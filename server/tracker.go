package main

import (
	"encoding/json"
	"net/http"
)

type trackEvent struct {
	Event     string `json:"event"`
	Action    string `json:"action,omitempty"`
	SessionID string `json:"session_id,omitempty"`
	Page      string `json:"page,omitempty"`
	PageDur   int64  `json:"page_duration_ms,omitempty"`
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

	writeLog(accessLog{
		Event:     evt.Event,
		IP:        ip,
		Country:   geo.Country,
		City:      geo.City,
		UserAgent: ua,
		Browser:   parseBrowser(ua),
		OS:        parseOS(ua),
		Action:    evt.Action,
		SessionID: evt.SessionID,
		Page:      evt.Page,
		PageDur:   evt.PageDur,
		Referrer:  r.Referer(),
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
}
