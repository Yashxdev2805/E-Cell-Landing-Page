# Stage 1: Build TypeScript Backend
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src/ ./src/
RUN npm run build

# Stage 2: Hardened Production Runtime
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Non-root unprivileged security
USER node

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:5000/api/health', (r) => {if (r.statusCode !== 200) process.exit(1)}).on('error', () => process.exit(1))"

EXPOSE 5000
CMD ["node", "dist/index.js"]
