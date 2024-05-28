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
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    depositAaveV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "depositAave()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        /*
         *
         * involveBaseToken = 0 for any ERC20 Token
         * involveBaseToken = 1 for ETH
         * 
         */

        filterOptions.involveBaseToken = filterOptions.involveBaseToken != null ? filterOptions.involveBaseToken : 0;

        let data;
        let value = "0";
        if (filterOptions.involveBaseToken === "1") {

            filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddressBaseToken;
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x474cf53d",
                "parametersType": ["address", "address", "uint16"],
                "parameters": [await config.lendborrow[filterOptions.lendborrowId].poolAddress,
                filterOptions.onBehalfOf, filterOptions.referralCode]
            });
            value = filterOptions.amount;

        } else {

            filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddress;
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0xe8eda9df",
                "parametersType": ["address", "uint256", "address", "uint16"],
                "parameters": [filterOptions.asset, filterOptions.amount, filterOptions.onBehalfOf, filterOptions.referralCode]
            });

        }

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.lendPoolAddress,
            "value": value,
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

    depositAaveV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "depositAaveV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        /*
         *
         * involveBaseToken = 0 for any ERC20 Token
         * involveBaseToken = 1 for ETH
         * 
         */

        filterOptions.involveBaseToken = filterOptions.involveBaseToken != null ? filterOptions.involveBaseToken : 0;

        let data;
        let value = "0";

        if (filterOptions.involveBaseToken === "1") {

            filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddressBaseToken;
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x474cf53d",
                "parametersType": ["address", "address", "uint16"],
                "parameters": [await config.lendborrow[filterOptions.lendborrowId].poolAddress,
                filterOptions.onBehalfOf, filterOptions.referralCode]
            });
            value = filterOptions.amount;

        } else {

            filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddress;
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0xe8eda9df",
                "parametersType": ["address", "uint256", "address", "uint16"],
                "parameters": [filterOptions.asset, filterOptions.amount, filterOptions.onBehalfOf, filterOptions.referralCode]
            });

        }

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.lendPoolAddress,
            "value": value,
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

    depositCompound: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "depositCompound()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const token = `c${filterOptions.asset}`;
        filterOptions.cTokenAddress = await config.lendborrow[filterOptions.lendborrowId].ctokens[token];

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xa0712d68",
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
    
    depositCompoundV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "depositCompV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let transactionObject;
        const { asset, lendborrowId, amount, from, gas, market, to , chainId , gasPriority} = filterOptions;
        const { comet, bulker, bundleActionsFunctions, assets } = config.lendborrow[lendborrowId][market];

        const isValid = [from , asset ].every(address => evmWeb3.utils.isAddress(address));
        if(to !== undefined && evmWeb3.utils.isAddress(to) === false) return throwErrorMessage("invalidEOAAddress");
        if(isValid === false) return throwErrorMessage("invalidEOAAddress");

        if (!(asset in assets)) return throwErrorMessage("invalidToken");
        if (assets[asset].native !== true && to === undefined) {
            const data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0xf2b9fdb8",
                "parametersType": ["address", "uint256"],
                "parameters": [asset, amount]
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
        else if (assets[asset].native === true && to === undefined) {

            const actionValueTypes = Object.values(bundleActionsFunctions.ACTION_SUPPLY_NATIVE_TOKEN);
            const encodedData = evmWeb3.eth.abi.encodeParameters(actionValueTypes, [comet, from, amount]);
            const action = evmWeb3.utils.toHex('ACTION_SUPPLY_NATIVE_TOKEN');
            const data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x555029a6",
                "parametersType": ["bytes32[]", "bytes[]"],
                "parameters": [[action], [encodedData]]
            });

            transactionObject = {
                "chainId": chainId,
                "from": from,
                "to": bulker,
                "value": amount,
                "gas": gas,
                "data": data
            };

        }

        else {
            const data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x4232cd63",
                "parametersType": ["address", "address", "uint256"],
                "parameters": [to, asset, amount]
            });

            transactionObject = {
                "chainId": chainId,
                "from": from,
                "to": comet,
                "value": (assets[asset].native !== true) ? "0" : amount,
                "gas": gas,
                "data": data
            };
        }

        if (gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority
            }).then(res => res.gasPrice);
        }

        return transactionObject;

    }

};