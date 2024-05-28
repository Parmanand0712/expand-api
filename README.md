# expand.network
Adapter project to perform read and write query on EVM and Non-EVM chains for multiple available protocols and platforms. 

# Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites
  * Node.js(16.x)
  * NPM(7.x)
  * Account With Ethereum Node Provider (Like Infura) or a deployed GETH
  
NOTE - The code works best with a self deployed GETH because all the other providers will allow only limited number of hits per day.

## Installing

1. Get the ssh key into your .ssh directory. Please note that this key should be the one uploaded to github so that you can access github without username and password.

2. Clone the arbitrage repository 

```
$ git clone https://github.com/cumberlandlabs/expand.git
```

3. Install the necessary modules

```
npm install
```

4. Running the Tests

```
npm test
```

5. Running the server

```
npm start
```

## Documentation

Click [here](https://docs.expand.network/) to check the official documentation of expand.network

## eslint

```
npm install -g eslint
eslint .
```
