# senatus-ui

**senatus-ui** allows a group of users to reach consensus for a message, Ethereum contract, or Bitcoin wallet. Senatus-ui depends on [Senatus](https://github.com/bitfinexcom/senatus), [Grenache](https://github.com/bitfinexcom/grenache), and [Wasteland](https://github.com/bitfinexcom/senatus).

## Install:

To get running, you will need to install [grenache-grape](https://github.com/bitfinexcom/grenache-grape), and clone [senatus](https://github.com/bitfinexcom/senatus) and this repo:

```
npm install -g grenache-grape
git clone https://github.com/bitfinexcom/senatus
git clone https://github.com/bitfinexcom/senatus-ui
```

## Config:

Senatus-ui is designed to be extended to anyone's needs. You will find a config file under `src/var/` where you can edit project parameters.

## Run:

### Grapes:

Senatus depends on the micro-framework Grenache that uses Distributed Hash Tables for p2p connections. Grapes are the backbone of Grenache. They manage the DHT.

```
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

### Senatus:

Next you will need to run a Senatus worker. A worker announces itself to the grapes. Grapes then tell the UI what IP the worker lives, so the UI and worker can directly communicate.

```
cd senatus
node worker.js --env=development --wtype=wrk-senatus-api-vanilla --apiPort 8721
```

### UI:

Now that you are running your grapes and senatus worker, you can now start the UI:

```
cd senatus-ui
yarn install && yarn start
```

## Build:

Use the following command to build the project:

```
yarn build
```

## PR

Please open a PR if you have an issue or feature request.
