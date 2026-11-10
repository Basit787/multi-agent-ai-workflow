# Makefile

| Target    | Runs                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `up`      | Build and start `docker-compose.yml` (Postgres, Ollama, Floci, server, client) |
| `down`    | Stop it (volumes are kept)                                                     |
| `restart` | `down`, then `up` (rebuilds the images)                                        |
| `install` | `pnpm install` in `server/` and `client/`                                      |
| `clean`   | Remove `dist/` and `node_modules/` in `server/` and `client/`                  |
| `lint`    | Biome lint in `server/` and `client/`                                          |
| `format`  | Biome format (writes changes) in `server/` and `client/`                       |

Everything else runs with pnpm inside each app (see
[Local development](server/development.md)) or with `docker compose` directly (see
[Docker](docker.md)).
