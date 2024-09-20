FROM node:18.14.2 as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Use Nginx as the web server
FROM nginx
EXPOSE 80 
EXPOSE 443
COPY --from=builder /app/dist /usr/share/nginx/html

# Change permissions
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80 (HTTP) and 443 (HTTPS)
EXPOSE 80
EXPOSE 443

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]