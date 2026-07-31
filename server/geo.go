package main

import (
	"encoding/json"
	"fmt"
	"io"
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
	geoClient  = &http.Client{Timeout: 5 * time.Second}
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

	info := fetchGeoWithRetry(ip)

	geoCacheMu.Lock()
	geoCache[ip] = geoCacheEntry{info: info, expiresAt: time.Now().Add(geoCacheTTL)}
	geoCacheMu.Unlock()

	return info
}

func fetchGeoWithRetry(ip string) geoInfo {
	for i := 0; i < 2; i++ {
		if info := fetchFromIPAPI(ip); info.Country != "" {
			return info
		}
		time.Sleep(200 * time.Millisecond)
	}
	if info := fetchFromIPInfo(ip); info.Country != "" {
		return info
	}
	return geoInfo{}
}

func fetchFromIPAPI(ip string) geoInfo {
	url := fmt.Sprintf("http://ip-api.com/json/%s?fields=status,country,city", ip)
	body, err := httpGet(url)
	if err != nil {
		return geoInfo{}
	}
	var result struct {
		Status  string `json:"status"`
		Country string `json:"country"`
		City    string `json:"city"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return geoInfo{}
	}
	if result.Status != "success" {
		return geoInfo{}
	}
	return geoInfo{Country: result.Country, City: result.City}
}

func fetchFromIPInfo(ip string) geoInfo {
	url := fmt.Sprintf("https://ipinfo.io/%s/json", ip)
	body, err := httpGet(url)
	if err != nil {
		return geoInfo{}
	}
	var result struct {
		Country string `json:"country"`
		City    string `json:"city"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return geoInfo{}
	}
	return geoInfo{Country: result.Country, City: result.City}
}

func httpGet(url string) ([]byte, error) {
	resp, err := geoClient.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return io.ReadAll(resp.Body)
}
