.PHONY: up down restart install clean lint format

up:
	docker compose up --build -d
down:
	docker compose down
restart: down up

install:
	pnpm -C server install
	pnpm -C client install

clean:
	rm -rf server/dist client/dist server/node_modules client/node_modules

lint:
	pnpm -C server lint
	pnpm -C client lint

format:
	pnpm -C server format
	pnpm -C client format
