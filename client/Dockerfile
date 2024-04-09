FROM node:latest AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build-stage


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

#XD
RUN sed -i 's/auth\.hms\.test/auth\.hms\.test\.boredotter\.dev/g' /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
