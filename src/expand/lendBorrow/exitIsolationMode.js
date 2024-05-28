const config = require('../../../common/configuration/config.json');
const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const aaveV3DataProvider = require('../../../assets/abis/aaveV3DataProvider.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getGasPrice } = require('../chain/index');


module.exports = {

    exitIsolationModeAaveV3: async (evmWeb3, options) => {
        const filterOptions = options;
        filterOptions.function = "exitIsolationModeAaveV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let isIsolated = false;
        filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddress;
        filterOptions.dataAddress = await config.lendborrow[filterOptions.lendborrowId].dataPoolProvider;
        const reserveData = new evmWeb3.eth.Contract(aaveV3DataProvider, filterOptions.dataAddress);
        const userAssetsData = await reserveData.methods.getUserReservesData(
            config.lendborrow[filterOptions.lendborrowId].lendingPoolAddressProvider,
            filterOptions.from).call();

        const { isolatedTokens } = config.lendborrow[filterOptions.lendborrowId];

        for (let j = 0; j <= userAssetsData[0].length - 1; j += 1) {
            if (userAssetsData[0][j][2] === true &&
                (isolatedTokens.includes((userAssetsData[0][j][0]).toLowerCase())) &&
                 (filterOptions.asset).toLowerCase() === (userAssetsData[0][j][0]).toLowerCase()) {
                isIsolated = true;
            }
        }


        if (isIsolated === false) {

            throw new Error(`Asset ${filterOptions.asset} is not Exitable since it is not in Isolation Mode.`);

        }

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x5a3b74b9",
            "parametersType": ["address", "bool"],
            "parameters": [filterOptions.asset, false]
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

    // eslint-disable-next-line no-unused-vars
    exitIsolationModeAaveV2: async (evmWeb3, options) => {

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    exitIsolationModeCompoundV3: async (evmWeb3, options) => {

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    }
};