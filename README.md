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

## Your Task

Design a scalable and robust system that implements a social network activity feed system base on the User Stories below, and provide a working proof-of-concept application to demonstrate your design.

You are required to:

1. Provide an architecture design that can scale to millions of users (please propose relevant technology to use). This test is about evaluating your skills and thought process.
   - You are expected to provide an architecture drawing of your design for the subsequent technical discussion round
   - Please commit your drawing to this git repository
1. Create a simple proof-of-concept application and API endpoints to demonstrate your design. This application will not be tested for performance, but should illustrate your design motivation.
   - You are not required to build the entire application stack, but you are expected to annotate in your demo application's code where workflow will differ from actual design. For example, without implementing a real task queue, you can comment in code where processing should be pushed into a background process or serverless function.
   - Write sufficient documentation (in code and README) for the design document, database schema, implementation and APIs and explain your technical choices.
   - You are expected to commit your code to this repository in Github, and provide additional written instruction on a 1-step command to run your application locally. Ideally (but not required) you should create your application as a Docker container.

## User Stories

_All API design proposal below are not mandatory. Feel free to implement your own design to taste, as long as it fulfills the requirements. Also, please propose JSON responses for any errors that might occur._

For this document:

- We will assume you are the user `ivan`, together with other users named `niko` and `eric`.
- Anyone that you follow is considered a **friend**.
- You are expected to implement users stories that are marked **[P0]**.
  - **[P0]** Features that are required for a minimum viable product (MVP)
  - **[P1]** Features that are essential but not required to make this MVP work
  - **[P2]** Features that are related but not considered essential to this MVP
- You are free to implement all user stories if time permitting.

**1. [P0] As a user, I need an API that allows me to build an activity feed.**

The API should receive the following activity object as a JSON request:

```
{
  actor: 'ivan',
  verb: 'like',
  object: 'photo:1',
  target: 'eric',
}
```

| Name     | Type   | Description                                                                             |
| -------- | ------ | --------------------------------------------------------------------------------------- |
| `actor`  | string | The actor performing the activity represented by user name                              |
| `verb`   | string | The verb of the activity, please include at least 3 types. e.g. `like`, `share`, `post` |
| `object` | string | Optional: The object of the activity, e.g. `photo:1`                                    |
| `target` | string | Optional: Target of the activity, usually another user name                             |

More examples of activity objects:

| `actor` | `verb`   | `object` | `target` |
| ------- | -------- | -------- | -------- |
| `ivan`  | `share`  | `post:1` | `eric`   |
| `niko`  | `like`   | `post:2` | `ivan`   |
| `eric`  | `post`   | `post:3` | null     |
| `ivan`  | `follow` | null     | `niko`   |

Hint:

- The response from the API call should be fast
- The requirement does not mandate side effects to be in real time; i.e. any updates to a given activity feed _do not need to appear in other feeds immediately_

**2. [P0] As a user, I need an API to read my own activity feed that contains my activities posted via the above API.**

The API should send the following JSON response:

```
{
  my_feed :
    [
      { actor: 'ivan', verb: 'share', object: 'photo:1', target: 'eric', datetime: '2018-07-25T18:35:22'},
      { actor: 'ivan', verb: 'follow', object: null, target: 'niko', datetime: '2018-07-25T18:35:22'},

      ...
    ],
  next_url: 'http://....',
}
```

**3. [P0] As a user, I need an API to follow a friend's activity feed.**

The API should receive the following JSON request:

```
{
  follow: 'eric'
}
```

**4. [P0] As a user, I need an API to retrieve a feed of all activities of friends that I follow.**

The API should return the following JSON response on success:

```
{
  friends_feed :
    [
      { actor: 'niko', verb: 'like', object: 'post:2', target: 'eric', datetime: '2018-07-25T18:35:22'},
      { actor: 'eric', verb: 'post', object: 'post:3', target: null, datetime: '2018-07-25T18:35:22'},
      ...
    ],
  next_url: 'http://....',
}
```

**5. [P1] As a user, I need an API to unfollow a friend's feed.**

The API should receive the following JSON request:

```
{
  unfollow: 'eric'
}
```

**6. [P2] For all activity objects in any read feed API, create an additional `related` field that contains common friend's action.**

Here are some examples of how the `related` field looks like:

```
{
  actor: 'eric',
  verb: 'post',
  object: 'post:1',
  target: null,
  related: [
    {
      actor: 'niko',
      verb: 'like',
      object: 'post:1',
      target: 'eric'
    },
    {
      actor: 'ivan',
      verb: 'like',
      object: 'post:1',
      target: 'eric'
    }
  ]
}
```

This will allow us to present the data as:

- `eric` posted `post:1` (`niko` and you liked it)

## Constraints

### Time

7 days from start of project. Please feel free to submit your work any time, before the dateline. If you need more time to complete the project due to existing work commitments, do let us know.

Please time-box yourself to a maximum of **4 hours** of coding time for this activity.

- Plan your use of time carefully
- Do not spend time on features that are not mentioned in the user stories (eg authentication)

### Technology

You are required to use any of these languages: NodeJS, or Python.

You are allowed to use any frameworks for the language you chose, e.g. Flask, SQLAlchemy, Sequelize, Express

### Git and Commit History

Please maintain a descriptive and clear Git commit history as it would allow us to better understand your thought process.

### Evaluation Criteria

Your project will be assessed in the following areas:

- Timely completion of the project, and respecting the time-boxing
- Clear communication on the architecture design
- Fulfilment of requirements and specifications
- Packaging of the project that facilitates ease of execution locally (ie developer experience)
- Clean reusable codes with good comments are expected
- Creative use of libraries and codes
- Git discipline

### Follow Up

Upon the your submission, our team will carefully review your code and content, and test run your project. We may schedule a next round of technical review base on your submission. Expected talking points include:

- Learnings and insights from your project
- Architecture/design discussion of how you will design your solution in a production environment
- Your feedback regarding this interview project

Looking forward to seeing your project!
