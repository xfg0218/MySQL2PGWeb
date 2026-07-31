package main

import (
	"encoding/json"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"
)

type accessLog struct {
	Timestamp string `json:"timestamp"`
	Event     string `json:"event"`
	IP        string `json:"ip"`
	Country   string `json:"country"`
	City      string `json:"city"`
	UserAgent string `json:"user_agent"`
	Browser   string `json:"browser"`
	OS        string `json:"os"`
	Method    string `json:"method,omitempty"`
	Path      string `json:"path,omitempty"`
	Status    int    `json:"status,omitempty"`
	Duration  int64  `json:"duration_ms,omitempty"`
	Action    string `json:"action,omitempty"`
	SessionID string `json:"session_id,omitempty"`
	Page      string `json:"page,omitempty"`
	PageDur   int64  `json:"page_duration_ms,omitempty"`
	Referrer  string `json:"referrer,omitempty"`
}

var accessLogger *log.Logger

func initAccessLogger() {
	f, err := os.OpenFile("access.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		log.Fatalf("Failed to open access.log: %v", err)
	}
	accessLogger = log.New(io.MultiWriter(os.Stdout, f), "", 0)
}

func writeLog(entry accessLog) {
	entry.Timestamp = time.Now().UTC().Format(time.RFC3339)
	b, err := json.Marshal(entry)
	if err != nil {
		return
	}
	accessLogger.Println(string(b))
}

func clientIP(r *http.Request) string {
	if fwd := r.Header.Get("X-Forwarded-For"); fwd != "" {
		parts := strings.Split(fwd, ",")
		return strings.TrimSpace(parts[0])
	}
	if real := r.Header.Get("X-Real-IP"); real != "" {
		return strings.TrimSpace(real)
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (r *statusRecorder) WriteHeader(code int) {
	r.status = code
	r.ResponseWriter.WriteHeader(code)
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			next.ServeHTTP(w, r)
			return
		}

		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, status: 200}
		next.ServeHTTP(rec, r)

		ip := clientIP(r)
		geo := lookupGeo(ip)
		ua := r.UserAgent()

		writeLog(accessLog{
			Event:     "page_view",
			IP:        ip,
			Country:   geo.Country,
			City:      geo.City,
			UserAgent: ua,
			Browser:   parseBrowser(ua),
			OS:        parseOS(ua),
			Method:    r.Method,
			Path:      r.URL.Path,
			Status:    rec.status,
			Duration:  time.Since(start).Milliseconds(),
			Referrer:  r.Referer(),
		})
	})
}
