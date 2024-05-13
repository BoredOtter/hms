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

# i cri evrytiem i remeber what i have done here
RUN sed -i 's/auth\.hms\.test/auth\.hms\.test\.boredotter\.dev/g' /usr/share/nginx/html/index.html
RUN sed -i 's/hms\.test/hms\.test\.boredotter\.dev/g' /usr/share/nginx/html/index.html 
RUN sed -i 's/auth\.hms\.test/auth\.hms\.test\.boredotter\.dev/g' /usr/share/nginx/html/assets/index-DUWarN1E.js 
RUN sed -i 's/hms\.test/hms\.test\.boredotter\.dev/g' /usr/share/nginx/html/assets/index-DUWarN1E.js

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
