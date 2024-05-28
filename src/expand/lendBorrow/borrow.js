/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a Pool response
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }
 */

const config = require('../../../common/configuration/config.json');
const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const aaveV3DataProvider = require('../../../assets/abis/aaveV3DataProvider.json');
const aaveV3Pool = require('../../../assets/abis/aaveV3Pool.json');
const cometAbi = require('../../../assets/abis/compound3Comet.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getGasPrice } = require('../chain/index');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    borrowAaveV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "borrowAave()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddress;

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xa415bcad",
            "parametersType": ["address", "uint256", "uint256", "uint16", "address"],
            "parameters": [filterOptions.asset, filterOptions.amount, filterOptions.interestRateMode,
            filterOptions.referralCode, filterOptions.onBehalfOf]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.lendPoolAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    borrowAaveV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "borrowAaveV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let isIsolated = false;
        filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddress;
        filterOptions.dataAddress = await config.lendborrow[filterOptions.lendborrowId].dataPoolProvider;
        const reserveData = new evmWeb3.eth.Contract(aaveV3DataProvider, filterOptions.dataAddress);
        const userData = new evmWeb3.eth.Contract(aaveV3Pool, filterOptions.lendPoolAddress);
        const userEmode = await userData.methods.getUserEMode(filterOptions.from).call();
        const tokenData = await reserveData.methods.getReservesData(config.lendborrow[filterOptions.lendborrowId].lendingPoolAddressProvider).call();
        const userAssetsData = await reserveData.methods.getUserReservesData(
            config.lendborrow[filterOptions.lendborrowId].lendingPoolAddressProvider,
            filterOptions.from).call();

        const { isolatedTokens } = config.lendborrow[filterOptions.lendborrowId];

        for (let j = 0; j <= userAssetsData[0].length - 1; j += 1) {
            if (userAssetsData[0][j][2] === true &&
                (isolatedTokens.includes((userAssetsData[0][j][0]).toLowerCase()))) {
                isIsolated = true;
            }
        }


        if (userEmode === '1') {
            for (let i = 0; i <= tokenData[0].length - 1; i += 1) {
                if (tokenData[0][i].underlyingAsset === filterOptions.asset && tokenData[0][i].eModeCategoryId === '0') {
                    throw new Error(`Asset ${tokenData[0][i].symbol} (${tokenData[0][i].name}) is not borrowable in e-Mode.`);
                }
            }
        }

        if (isIsolated === true) {
            for (let i = 0; i <= tokenData[0].length - 1; i += 1) {
                if ((tokenData[0][i].underlyingAsset).toLowerCase() === (filterOptions.asset).toLowerCase()
                    && tokenData[0][i].borrowableInIsolation === false) {
                    throw new Error(`Asset ${tokenData[0][i].symbol} (${tokenData[0][i].name}) is not borrowable in Isolation Mode.`);
                }
            }
        }

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xa415bcad",
            "parametersType": ["address", "uint256", "uint256", "uint16", "address"],
            "parameters": [filterOptions.asset, filterOptions.amount, filterOptions.interestRateMode,
            filterOptions.referralCode, filterOptions.onBehalfOf]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.lendPoolAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    borrowCompound: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "borrowCompound()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const token = `c${filterOptions.asset}`;
        filterOptions.cTokenAddress = await config.lendborrow[filterOptions.lendborrowId].ctokens[token];

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xc5ebeaec",
            "parametersType": ["uint256"],
            "parameters": [filterOptions.amount]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.cTokenAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    borrowCompoundV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "borrowCompV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let transactionObject;
        const { lendborrowId, amount, from, gas, market, chainId, gasPriority } = filterOptions;
        const { comet, bulker, bundleActionsFunctions } = config.lendborrow[lendborrowId][market];

        if(evmWeb3.utils.isAddress(from) === false) return throwErrorMessage("invalidEOAAddress");

        const cometContract = new evmWeb3.eth.Contract(cometAbi, comet);

        const baseToken = await cometContract.methods.baseToken().call();

        if (market === "USDC") {

            const data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0xf3fef3a3",
                "parametersType": ["address", "uint256"],
                "parameters": [baseToken, Number(amount)]
            });

            transactionObject = {
                "chainId": chainId,
                "from": from,
                "to": comet,
                "value": "0",
                "gas": gas,
                "data": data
            };

        }
        else {
            const actionValueTypes = Object.values(bundleActionsFunctions.ACTION_WITHDRAW_NATIVE_TOKEN);
            const encodedData = evmWeb3.eth.abi.encodeParameters(actionValueTypes, [comet, from, Number(amount)]);
            const action = evmWeb3.utils.toHex('ACTION_WITHDRAW_NATIVE_TOKEN');
            const data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x555029a6",
                "parametersType": ["bytes32[]", "bytes[]"],
                "parameters": [[action], [encodedData]]
            });

            transactionObject = {
                "chainId": chainId,
                "from": from,
                "to": bulker,
                "value": "0",
                "gas": gas,
                "data": data
            };

        }

        if (gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    }

};