FROM node:12.11.1-alpine

WORKDIR /

ENV PATH /node_modules/.bin:$PATH

COPY . .
COPY package.json /package.json
RUN yarn install
RUN yarn 

CMD ["yarn","start"]
