.PHONY: dev build serve clean

dev:
	cd frontend && npm run dev

build:
	cd frontend && npm run build
	cd server && go build -o ../mysql2pg-web .

serve: build
	./mysql2pg-web

clean:
	rm -rf frontend/dist frontend/node_modules server/mysql2pg-web mysql2pg-web
