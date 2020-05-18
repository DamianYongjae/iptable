FROM node:12.16.1-alpine

WORKDIR /

ENV PATH /node_modules/.bin:$PATH

COPY . .
COPY package.json /package.json
RUN yarn
RUN yarn install

CMD ["yarn","dev"]
