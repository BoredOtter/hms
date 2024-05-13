FROM node:latest AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN find . -type f -exec sed -i 's/\bhms\.test\b/hms\.test\.boredotter\.dev/g' {} \;

RUN npm run build-stage

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY deployment/nginx.conf /etc/nginx/conf.d/

COPY --from=build /app/dist /usr/share/nginx/html

# :c 
RUN find . -name "index*.js" -type f -exec sed -i 's|https://auth\.hms\.test\.boredotter\.dev\.boredotter\.dev|https://auth.hms.test.boredotter.dev|g' {} \;

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
