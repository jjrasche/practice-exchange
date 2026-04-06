FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /srv
RUN printf ':80 {\n    root * /srv\n    file_server\n    try_files {path} /index.html\n}\n' > /etc/caddy/Caddyfile
EXPOSE 80
