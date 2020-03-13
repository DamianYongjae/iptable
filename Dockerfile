FROM node:10.19.0-alpine

WORKDIR /

ENV PATH /node_modules/.bin:$PATH

COPY . .
COPY package.json /package.json
RUN yarn install
RUN yarn 

CMD ["yarn","start"]
