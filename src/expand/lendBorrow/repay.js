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
const cometAbi = require('../../../assets/abis/compound3Comet.json');
const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    repayAaveV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "repayAave()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddress;

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x573ade81",
            "parametersType": ["address", "uint256", "uint256", "address",],
            "parameters": [filterOptions.asset, filterOptions.amount, filterOptions.interestRateMode, filterOptions.onBehalfOf]
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

    repayAaveV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "repayAaveV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddress;

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x573ade81",
            "parametersType": ["address", "uint256", "uint256", "address",],
            "parameters": [filterOptions.asset, filterOptions.amount, filterOptions.interestRateMode, filterOptions.onBehalfOf]
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

    repayCompound: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "repayCompound()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const token = `c${filterOptions.asset}`;
        filterOptions.cTokenAddress = await config.lendborrow[filterOptions.lendborrowId].ctokens[token];

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x0e752702",
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

    repayCompoundV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "repayCompV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let transactionObject;
        const { lendborrowId, amount, from, gas, market , chainId , gasPriority} = filterOptions;
        const { comet, bulker, bundleActionsFunctions } = config.lendborrow[lendborrowId][market];

        if(evmWeb3.utils.isAddress(from) === false) return throwErrorMessage("invalidEOAAddress");

        if (market === "USDC") {
        const cometContract = new evmWeb3.eth.Contract(cometAbi , comet);
        const baseToken = await cometContract.methods.baseToken().call();
        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xf2b9fdb8",
            "parametersType": ["address" , "uint256"],
            "parameters": [baseToken , amount]
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
            const actionValueTypes = Object.values(bundleActionsFunctions.ACTION_SUPPLY_NATIVE_TOKEN);
            const encodedData = evmWeb3.eth.abi.encodeParameters(actionValueTypes, [comet, from , amount]);
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

        if (gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    }

};