FROM node:24-alpine AS base
RUN npm install -g pnpm@12.14.0
WORKDIR /repo

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
RUN pnpm install --frozen-lockfile
COPY apps apps
RUN pnpm turbo run build

FROM build AS backend
ENV NODE_ENV=production
WORKDIR /repo/apps/backend
EXPOSE 3001
CMD ["node", "dist/index.js"]

FROM build AS frontend
WORKDIR /repo/apps/frontend
EXPOSE 3000
CMD ["pnpm", "preview"]
