package main

import (
	"encoding/json"
	"net/http"
)

type trackEvent struct {
	Event       string `json:"event"`
	Action      string `json:"action,omitempty"`
	SessionID   string `json:"session_id,omitempty"`
	Page        string `json:"page,omitempty"`
	PageDur     int64  `json:"page_duration_ms,omitempty"`
	Screen      string `json:"screen,omitempty"`
	Viewport    string `json:"viewport,omitempty"`
	Lang        string `json:"lang,omitempty"`
	ScrollDepth int    `json:"scroll_depth,omitempty"`
	UTMSource   string `json:"utm_source,omitempty"`
	UTMMedium   string `json:"utm_medium,omitempty"`
	UTMCampaign string `json:"utm_campaign,omitempty"`
}

func trackHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var evt trackEvent
	if err := json.NewDecoder(r.Body).Decode(&evt); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	if evt.Event == "" {
		http.Error(w, "Missing event", http.StatusBadRequest)
		return
	}

	ip := clientIP(r)
	geo := lookupGeo(ip)
	ua := r.UserAgent()
	ref := r.Referer()

	writeLog(accessLog{
		Event:          evt.Event,
		IP:             ip,
		Country:        geo.Country,
		City:           geo.City,
		UserAgent:      ua,
		Browser:        parseBrowser(ua),
		OS:             parseOS(ua),
		DeviceType:     parseDeviceType(ua),
		App:            parseApp(ua),
		Action:         evt.Action,
		SessionID:      evt.SessionID,
		Page:           evt.Page,
		PageDur:        evt.PageDur,
		Referrer:       ref,
		ReferrerDomain: referrerDomain(ref),
		Screen:         evt.Screen,
		Viewport:       evt.Viewport,
		Lang:           evt.Lang,
		ScrollDepth:    evt.ScrollDepth,
		UTMSource:      evt.UTMSource,
		UTMMedium:      evt.UTMMedium,
		UTMCampaign:    evt.UTMCampaign,
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
}
