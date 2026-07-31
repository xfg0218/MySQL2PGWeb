package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

type geoInfo struct {
	Country string `json:"country"`
	City    string `json:"city"`
}

type geoCacheEntry struct {
	info      geoInfo
	expiresAt time.Time
}

var (
	geoCache   = make(map[string]geoCacheEntry)
	geoCacheMu sync.RWMutex
	geoClient  = &http.Client{Timeout: 3 * time.Second}
)

const geoCacheTTL = 24 * time.Hour

func lookupGeo(ip string) geoInfo {
	if ip == "" || ip == "127.0.0.1" || ip == "::1" {
		return geoInfo{Country: "Local", City: "Local"}
	}

	geoCacheMu.RLock()
	entry, ok := geoCache[ip]
	geoCacheMu.RUnlock()
	if ok && time.Now().Before(entry.expiresAt) {
		return entry.info
	}

	info := fetchGeoFromAPI(ip)

	geoCacheMu.Lock()
	geoCache[ip] = geoCacheEntry{info: info, expiresAt: time.Now().Add(geoCacheTTL)}
	geoCacheMu.Unlock()

	return info
}

func fetchGeoFromAPI(ip string) geoInfo {
	url := fmt.Sprintf("http://ip-api.com/json/%s?fields=status,country,city", ip)
	resp, err := geoClient.Get(url)
	if err != nil {
		return geoInfo{}
	}
	defer resp.Body.Close()

	var result struct {
		Status  string `json:"status"`
		Country string `json:"country"`
		City    string `json:"city"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return geoInfo{}
	}
	if result.Status != "success" {
		return geoInfo{}
	}
	return geoInfo{Country: result.Country, City: result.City}
}
