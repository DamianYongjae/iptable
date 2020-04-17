FROM node:12.16.1-alpine

WORKDIR /

ENV PATH /node_modules/.bin:$PATH

COPY . .
COPY package.json /package.json
RUN yarn
RUN yarn install
RUN yarn pm2 start server

CMD ["yarn","start"]

FROM nginx:alpine
COPY /build /usr/share/nginx/html

EXPOSE  80
CMD ["nginx", "-g", "daemon off;"]