package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
	}

	exe, err := os.Executable()
	if err != nil {
		log.Fatalf("Failed to get executable path: %v", err)
	}
	exeDir := filepath.Dir(exe)
	distDir := filepath.Join(exeDir, "frontend", "dist")

	if _, err := os.Stat(distDir); os.IsNotExist(err) {
		log.Fatalf("Frontend dist directory not found at %s. Run 'npm run build' in the frontend directory first.", distDir)
	}

	initAccessLogger()

	mux := http.NewServeMux()
	mux.Handle("/api/track", http.HandlerFunc(trackHandler))
	mux.Handle("/", cacheHandler(spaHandler(http.FileServer(http.Dir(distDir)), distDir)))

	handler := loggingMiddleware(mux)

	addr := fmt.Sprintf(":%s", port)
	fmt.Printf("MySQL2PG Web Server starting on http://localhost%s\n", addr)
	fmt.Printf("Serving static files from: %s\n", distDir)
	fmt.Printf("Access log: access.log (JSON structured)\n")

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func cacheHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		switch {
		case path == "/" || path == "/index.html":
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			w.Header().Set("Pragma", "no-cache")
			w.Header().Set("Expires", "0")
		case strings.HasPrefix(path, "/assets/"):
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		default:
			w.Header().Set("Cache-Control", "public, max-age=3600")
		}
		next.ServeHTTP(w, r)
	})
}

func spaHandler(next http.Handler, distDir string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(distDir, r.URL.Path)
		if _, err := os.Stat(path); err == nil {
			next.ServeHTTP(w, r)
			return
		}
		http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
	})
}
