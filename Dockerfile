# Builder
FROM node:latest as builder

WORKDIR /demo
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./src/ ./src/

RUN yarn install
RUN yarn build

WORKDIR /demo

# Runner
FROM node:latest as runner

WORKDIR /demo
COPY --from=builder /demo/package.json .
COPY --from=builder /demo/dist/ ./dist/

ENV NODE_ENV production

RUN yarn install

WORKDIR /demo

EXPOSE 4000

ENV MONGO_DB_URI="mongodb://mongo-db:27017"

CMD ["yarn","start:build"]