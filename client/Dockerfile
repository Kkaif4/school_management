# Stage 1 — Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# --- Add these next two lines ---
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

# --- Change the CMD ---
CMD ["nginx", "-g", "daemon off;"]