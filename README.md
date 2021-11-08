# Backend Engineer Interview Project

## Demo

There is a demo recording [here](https://www.dropbox.com/s/4s3fdrl0my417lg/Demo.mov?dl=0)

## Architecture Design

Pdfs are in root folder. But for higher quality version see [here](https://miro.com/app/board/o9J_lrJNYVw=/?invite_link_id=803757951231)

## Getting Started for developers

Make sure you have node, npm and docker installed (you can run `node -v`, `npm -v` and `docker -v` to check)
`yarn install`
`yarn start` Will start mongo db dev container and api in dev mode (uses `ts-node-dev` to restart on every change)

## Run Tests

`yarn test`

## Build and run with docker

`docker-compose up`

## Background

For any social network, activity feed is a common feature that usually starts off simple to implement but can grow in complexity as the number of users increases. This can cause performance issues that can cripple user experience.
