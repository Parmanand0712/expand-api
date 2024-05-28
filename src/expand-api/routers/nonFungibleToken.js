const express = require("express");
const { validateParams } = require("../middlewares/paramValidator");

const nonFungibleTokenRouter = express.Router();
const { getHistoricalTransactions, getBalanceOf, getHistoricalLogs, getNFTOwnerOf, getNFTMetadata }
    = require("../controllers/nonFungibleToken");

nonFungibleTokenRouter.get('/nft/historical/transactions', validateParams, getHistoricalTransactions);
nonFungibleTokenRouter.get('/nft/historical/logs', validateParams, getHistoricalLogs);
nonFungibleTokenRouter.get('/nft/getbalance', validateParams, getBalanceOf);
nonFungibleTokenRouter.get('/nft/getowner', validateParams, getNFTOwnerOf);
nonFungibleTokenRouter.get('/nft/getmetadata', validateParams, getNFTMetadata);

module.exports = nonFungibleTokenRouter;
