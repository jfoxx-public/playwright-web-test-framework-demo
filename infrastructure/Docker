# STAGE 1: Build with Node.js
FROM node:18-alpine AS build-stage

WORKDIR /app

# Install git and clone the repository
RUN apk add --no-cache git
RUN git clone https://github.com/saucelabs/sample-app-web.git .

# Install dependencies and build the app for production
RUN npm install
RUN npm run build

# STAGE 2: Serve with Nginx
FROM nginx:alpine

# Copy only the compiled output (located in /dist or /build)
# Note: This repo generates output in the 'build' or 'dist' folder
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
