FROM nginx:alpine

# Copy static assets
COPY . /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run defaults to 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
