# A very easy mini-node-server

This is a very simple Node server. It lacks many features, and it is used for learning.

## Start the server

We should globally install ts-node-dev，it

* support ts
* will restart Node server after files changes

```bash
yarn global add ts-node-dev
```

or

```bash
npm i -g ts-node-dev
```

Start the service

```bash
ts-node-dev index.ts
```

## How to use

When starting the server, we can open http://localhost:8888 to see the page. Then We can replace sources in the folder
of `public`. 
