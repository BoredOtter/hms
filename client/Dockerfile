FROM node:latest AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build-stage


FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY deployment/nginx.conf /etc/nginx/conf.d/

COPY --from=build /app/dist /usr/share/nginx/html

RUN sed -i 's/auth\.hms\.test/auth\.hms\.test\.boredotter\.dev/g' /usr/share/nginx/html/index.html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
