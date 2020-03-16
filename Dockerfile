FROM node:12.16.1-alpine

WORKDIR /

ENV PATH /node_modules/.bin:$PATH

COPY . .
COPY package.json /package.json
RUN yarn install
RUN yarn 
RUN yarn build

CMD ["yarn","dev"]

FROM nginx:alpine

EXPOSE  80
CMD ["nginx", "-g", "daemon off;"]
