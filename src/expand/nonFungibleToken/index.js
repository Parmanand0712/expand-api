/* eslint-disable no-param-reassign */
const GetNFTName = require('./getNFTName');
const mintNFT = require('./mintNFT');
const TransferNFT = require('./transferNFT');
const GetNFTSymbol = require('./getNFTSymbol');
const burnNFT = require('./burnNFT');
const approveNFT = require('./approveNFT');
const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const balanceOf = require('./balanceOf');
const safeTransferFrom = require('./safeTransferFrom');
const setApprovalForAll = require('./setApprovalForAll');
const transferFrom = require('./transferFrom');
const isApprovedForAll = require('./isApprovedForAll');
const getApproved = require('./getApproved');
const common = require('../../../common/common');
const getHistoricalTransactions = require('./getHistoricalTransactions');
const getHistoricalLogs = require('./getHistoricalLogs');
const getNFTOwner = require('./getNFTOwner');
const getNFTMetadata = require('./getNFTMetadata');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

exports.getNFTName = async (web3, options) => {


    try {

        if (options.chainName == null) {
            const { chainName } = config.chains[options.chainId];
            options.chainName = chainName;
        }

        const name = await GetNFTName[`getNFTName${options.chainName}`](web3, options);
        return (name);

    } catch (error) {
        return throwErrorMessage("INVALID_NFT");
    }


};
exports.getNFTSymbol = async (web3, options) => {


    try {

        if (options.chainName == null) {
            const { chainName } = config.chains[options.chainId];
            options.chainName = chainName;
        }

        const symbol = await GetNFTSymbol[`getNFTSymbol${options.chainName}`](web3, options);
        return (symbol);
    } catch (error) {
        return throwErrorMessage("INVALID_NFT");
    }


};

exports.mintNFT = async (web3, options) => {


    try {

        if (options.chainName == null) {
            const { chainName } = config.chains[options.chainId];
            options.chainName = chainName;
        }
        const tx = await mintNFT[`mintNFT${options.chainName}`](web3, options);
        return (tx);
    } catch (error) {
        return throwErrorMessage("INVALID_NFT");
    }


};


exports.transferNFT = async (web3, options) => {


    try {

        if (options.chainName == null) {
            const { chainName } = config.chains[options.chainId];
            options.chainName = chainName;
        }
        const sig = await TransferNFT[`transferNFT${options.chainName}`](web3, options);
        return (sig);
    } catch (error) {
        return throwErrorMessage("INVALID_NFT");
    }


};

exports.burnNFT = async (web3, options) => {


    try {

        if (options.chainName == null) {
            const { chainName } = config.chains[options.chainId];
            options.chainName = chainName;
        }
        const sig = await burnNFT[`burnNFT${options.chainName}`](web3, options);
        return (sig);
    }

    catch (error) {
        return throwErrorMessage("INVALID_NFT");
    }


};

exports.approveNFT = async (web3, options) => {

    try {

        if (options.chainName == null) {
            const { chainName } = config.chains[options.chainId];
            options.chainName = chainName;
        }
        const sig = await approveNFT[`approveNFT${options.chainName}`](web3, options);
        return (sig);
    }

    catch (error) {
        return throwErrorMessage("INVALID_NFT");
    }

};


exports.balanceOf = async (web3, options) => {
    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    if (!chainId) return throwErrorMessage("invalidChainSymbol");

    let chainName;
    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    if (!config.nftChainSupported.includes(chainId)) return throwErrorMessage("invalidFunction");

    const nftProtocolId = filterOptions.nftProtocolId == null ?
        await common.getNftProtocolByChainName(chainName) : filterOptions.nftProtocolId;


    if (!config.nftProtocolSupported.includes(nftProtocolId)) return throwErrorMessage("invalidNftProtocolId");

    filterOptions.chainId = chainId;
    filterOptions.nftProtocolId = nftProtocolId;
    const balance = await balanceOf[`balanceOf${chainName}${nftProtocolId}`](web3, { ...options, chainId });
    return balance;
};

exports.getApproved = async (web3, options) => {

    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    const query = await getApproved[`getApproved${chainName}`](web3, filterOptions);
    return (query);

};

exports.isApprovedForAll = async (web3, options) => {

    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    const transaction = await isApprovedForAll[`isApprovedForAll${chainName}`](web3, filterOptions);
    return (transaction);

};



exports.safeTransferFrom = async (web3, options) => {

    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    const transaction = await safeTransferFrom[`safeTransferFrom${chainName}`](web3, filterOptions);
    return (transaction);

};

exports.setApprovalForAll = async (web3, options) => {

    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    const transaction = await setApprovalForAll[`setApprovalForAll${chainName}`](web3, filterOptions);
    return (transaction);

};

exports.transferFrom = async (web3, options) => {

    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    const transaction = await transferFrom[`transferFrom${chainName}`](web3, filterOptions);
    return (transaction);

};

exports.getHistoricalTransactions = async (web3, options) => {

    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    if (!(chainId in config.nft)) return throwErrorMessage("invalidFunction");

    const nftProtocolId = filterOptions.nftProtocolId == null ?
        await common.getNftProtocolByChainName(chainName) : filterOptions.nftProtocolId;

    if (nftProtocolId in config.nft[chainId] === false) return throwErrorMessage("invalidNftProtocolId");

    filterOptions.chainId = chainId;
    filterOptions.chainName = chainName;
    filterOptions.nftProtocolId = nftProtocolId;

    const transaction = await getHistoricalTransactions[`getHistoricalTransactions${chainName}${nftProtocolId}`](web3, filterOptions);
    return (transaction);

};

exports.getHistoricalLogs = async (web3, options) => {

    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    if (!(chainId in config.nft)) return throwErrorMessage("invalidFunction");

    const nftProtocolId = filterOptions.nftProtocolId == null ?
        await common.getNftProtocolByChainName(chainName) : filterOptions.nftProtocolId;

    if (nftProtocolId in config.nft[chainId] === false) return throwErrorMessage("invalidNftProtocolId");

    filterOptions.chainId = chainId;
    filterOptions.nftProtocolId = nftProtocolId;
    const logs = await getHistoricalLogs[`getHistoricalLogs${chainName}${nftProtocolId}`](web3, filterOptions);
    return (logs);

};

exports.getNFTOwnerOf = async (web3, options) => {
    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    if (!chainId) return throwErrorMessage("invalidChainSymbol");

    let chainName;
    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    if (!config.nftChainSupported.includes(chainId)) return throwErrorMessage("invalidFunction");

    const nftProtocolId = filterOptions.nftProtocolId == null ?
        await common.getNftProtocolByChainName(chainName) : filterOptions.nftProtocolId;
    if (!config.nftMetadataSupportedProtocol.includes(nftProtocolId)) return throwErrorMessage("invalidNftProtocolId");

    filterOptions.chainId = chainId;
    filterOptions.nftProtocolId = nftProtocolId;
    const owner = await getNFTOwner[`getNFTOwner${chainName}${nftProtocolId}`](web3, { ...options, chainId });
    return owner;
};

exports.getNFTMetadata = async (web3, options) => {
    const filterOptions = options;
    let chainId = filterOptions.chainId ? filterOptions.chainId : null;
    const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;

    chainId = await common.getChainId({ chainId, chainSymbol });
    if (!chainId) return throwErrorMessage("invalidChainSymbol");

    let chainName;
    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    if (!config.nftChainSupported.includes(chainId)) return throwErrorMessage("invalidFunction");

    const nftProtocolId = await common.getNftProtocolByChainName(chainName);

    filterOptions.chainId = chainId;
    const metadata = await getNFTMetadata[`getNFTMetadata${chainName}${nftProtocolId}`](web3, { ...options, chainId });
    return metadata;
};
