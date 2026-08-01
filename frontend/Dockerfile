ARG IMAGE_TAG=local
ARG BUILD_VERSION=development
ARG GIT_SHA=unknown
ARG OCI_SOURCE=https://github.com/bonkanoar-png/abdoul-ai

FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public && npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ARG IMAGE_TAG
ARG BUILD_VERSION
ARG GIT_SHA
ARG OCI_SOURCE

LABEL org.opencontainers.image.source="${OCI_SOURCE}" \
      org.opencontainers.image.revision="${GIT_SHA}" \
      org.opencontainers.image.version="${BUILD_VERSION}" \
      org.opencontainers.image.ref.name="${IMAGE_TAG}"

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Keep the required npm entrypoint while running Next.js' minimal standalone server.
RUN node -e 'const fs=require("node:fs");const path="package.json";const pkg=JSON.parse(fs.readFileSync(path,"utf8"));pkg.scripts={start:"node server.js"};fs.writeFileSync(path,JSON.stringify(pkg));' \
    && chown node:node package.json

USER node

EXPOSE 3000

CMD ["npm", "start"]
