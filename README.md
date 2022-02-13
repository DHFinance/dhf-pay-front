## DHF PAY
The crypto currency payment gateway on the CSPR blockchain. Made for pay and be paid easy and chill with blockchain and Casper Network.
System composed of 3 services:

|       Name         |            Link              |        Description                 |
|----------------|-------------------------------|-----------------------------|
|Backend  |<https://github.com/DHFinance/dhf-pay-back>            | Service backend            |
|Frontend          |<https://github.com/DHFinance/dhf-pay-front>            |Service frontend            |
|Processor          |<https://github.com/DHFinance/dhf-pay-processor>| Process a background tasks|

## Usage Guide
See https://github.com/DHFinance/dhf-pay-front/blob/main/UserGuide.pdf

## Installation using docker
See https://github.com/DHFinance/dhf-pay-deploy

## Install apart

```bash
$ npm install
```

## .env file 
Create .env baset on env.sample

```bash
#Casper-back url
NEXT_PUBLIC_API_HOST=http://localhost:3001
#Fake transaction mode. With a value of 0, it works with signer and creates real transactions registered with casper (only available on localhost for now). If 1 - fake mode for other domains, transactions are hardcoded and created without the participation of signer
NEXT_PUBLIC_FAKE_TRANSACTION=0
NEXT_PUBLIC_CASPER_NODE = https://node-clarity-testnet.make.services/rpc
NEXT_PUBLIC_CASPER_NETWORK = testnet.cspr.live
```

## Run

After run casper-back and casper-processor run casper-front

```bash
$ npm run build
$ npm run start
```
