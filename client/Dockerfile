# Stage 1: Build Frontend Artifacts
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Minimal High-Performance Web Server
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=builder /app/dist .

# Custom Nginx virtual host for SPA routing
RUN printf 'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
