FROM node:20-bullseye AS backend-build
WORKDIR /backend
RUN npm install --save-dev @types/axios
RUN apt-get update && apt-get install -y netcat
COPY ./backend .
RUN npm install
CMD ["sh", "-c", "while ! nc -z postgres 5432; do sleep 1; echo 'Waiting for PostgreSQL...'; done && cd migrations && npx sequelize-cli db:migrate && npm run start"]

FROM node:20-bullseye AS frontend-build
WORKDIR /frontend
COPY ./VebPara .
RUN npm install && npm run build

FROM nginx:alpine
# Remove default config
RUN rm -rf /etc/nginx/conf.d/*
# Copy custom config
COPY nginx.conf /etc/nginx/nginx.conf
# Copy built frontend
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html
# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]