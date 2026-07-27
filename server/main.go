package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
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

	fs := http.FileServer(http.Dir(distDir))
	http.Handle("/", spaHandler(fs, distDir))

	addr := fmt.Sprintf(":%s", port)
	fmt.Printf("MySQL2PG Web Server starting on http://localhost%s\n", addr)
	fmt.Printf("Serving static files from: %s\n", distDir)

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
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
