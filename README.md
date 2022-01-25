## Installation using docker
see https://github.com/DHFinance/dhf-pay-deploy

## Install apart

```bash
$ npm install
```

## .env file 
Create .env baset on env.sample

```bash
#Casper-back url
NEXT_PUBLIC_API_HOST=http://localhost:3010
#Fake transaction mode. With a value of 0, it works with signer and creates real transactions registered with casper (only available on localhost for now). If 1 - fake mode for other domains, transactions are hardcoded and created without the participation of signer
NEXT_PUBLIC_FAKE_TRANSACTION=1
```

## Run

After run casper-back and casper-processor run casper-front

```bash
$ npm run build
$ npm run start
```
