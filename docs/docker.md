# Docker

`docker-compose.yml` runs the whole stack locally: nothing from the host or
the cloud. Each app builds from its own `Dockerfile` (`server/Dockerfile`,
`client/Dockerfile`).

```bash
make up                                           # build and start
docker compose exec server node dist/db/seed.js   # optional: admin user
docker compose logs -f                            # follow logs
make down                                         # stop (volumes are kept)
```

| Service       | Image                                       | Host port | Notes                                                    |
| ------------- | ------------------------------------------- | --------- | -------------------------------------------------------- |
| `postgres`    | `postgres:16-alpine`                        | 5434      | Data in the `pg_data` volume                             |
| `redis`       | `redis:7-alpine`                            | 6379      | Workflow queue (BullMQ); data in `redis_data`            |
| `ollama`      | `alpine/ollama:0.40.11` (CPU-only, ~115 MB) | none      | Models in the `ollama_data` volume                       |
| `ollama-pull` | `alpine/ollama:0.40.11`                     | none      | One-shot: pulls `OLLAMA_MODEL`, then exits               |
| `floci`       | `floci/floci`                               | 4566      | Local AWS emulator (S3, SQS, DynamoDB, …)                |
| `server`      | `./server`                                  | 3001      | Starts after Postgres is healthy and the model is pulled |
| `client`      | `./client`                                  | 3000      | Proxies `/api` to `http://server:3001`                   |

Ports 3000, 3001, 4566, 5434 and 6379 must be free on the host. Stop any local
`pnpm dev` or `vite preview` first.

## Ollama

- The server uses `OLLAMA_URL=http://ollama:11434`. This is fixed in the
  compose file, so an `OLLAMA_URL` in `.env` does not apply here.
- The first `make up` downloads the model (`llama3.2` is about 2 GB). The
  server waits for the pull to finish. Later starts reuse `ollama_data`.
- Pick another model with `OLLAMA_MODEL=<name>` in `.env`.
- On macOS, Docker cannot use the GPU, so Ollama in a container runs on the
  CPU and is slow. For faster runs, start only Postgres and run the apps on the
  host with the Ollama app (see [Local development](server/development.md)).

## Floci (AWS)

The server gets `AWS_ENDPOINT_URL=http://floci:4566`, `AWS_REGION=us-east-1`
and the test keys `test`/`test`. Any AWS SDK client goes to Floci with no code
change. From the host, point the AWS CLI at it:

```bash
aws --endpoint-url http://localhost:4566 s3 ls
```

## Postgres only

For development on the host, start just the database:

```bash
docker compose up -d postgres
```

Postgres listens on `localhost:5434` (user `postgres`, password `postgres`,
database `multi_agent`).
