/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
const config = require('../../../common/configuration/config.json');
const Common = require('../../../common/common');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const aaveV3DataProvider = require('../../../assets/abis/aaveV3DataProvider.json');
const aaveV2ProtocolProvider = require('../../../assets/abis/aaveV2ProtocolProvider.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getGasPrice } = require('../chain/index');

module.exports = {

    migrateAaveV3: async (evmWeb3, options) => {
        const filterOptions = options;
        filterOptions.function = "migrateAaveV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {


            let numberOfSupplied = 0;
            const suppliedPositions = [];
            const suppliedBalances = {};

            filterOptions.dataAddressv2 = await config.lendborrow[(Number(filterOptions.lendborrowId) - 200).toString()].dataPoolProvider;
            const userReserveContractv2 = new evmWeb3.eth.Contract(aaveV2ProtocolProvider
                , config.lendborrow[(Number(filterOptions.lendborrowId) - 200).toString()].dataProvider);
            const reserveDatav2 = new evmWeb3.eth.Contract(aaveV3DataProvider, filterOptions.dataAddressv2);
            const reserveList = await reserveDatav2.methods.getReservesList(
                config.lendborrow[(Number(filterOptions.lendborrowId) - 200).toString()].lendingPoolAddressProvider).call();

            const migrationContractAddress = config.lendborrow[filterOptions.lendborrowId].migrationContract;
            if (migrationContractAddress === undefined) {
                return ({ message: errorMessage.error.message.notApplicable, code: errorMessage.error.code.notApplicable });
            }


            for (let i = 0; i < reserveList.length; i += 1) {

                const userData = await userReserveContractv2.methods.getUserReserveData(reserveList[i], filterOptions.from).call();
                if (userData.currentATokenBalance !== '0') {
                    suppliedPositions.push(reserveList[i]);
                    suppliedBalances[numberOfSupplied] = userData.currentATokenBalance;
                    numberOfSupplied += 1;
                }
                if (userData.currentStableDebt !== '0' || userData.currentVariableDebt !== '0') {
                    return ({
                        message: errorMessage.error.message.disabledMigrationForBorrowedPosition,
                        code: errorMessage.error.code.notApplicable
                    });
                }
            }
            const positions = (filterOptions.assets === undefined ? suppliedPositions : filterOptions.assets);

            const data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x3698d492",
                "parametersType": ["address[]", "tuple[]", "tuple[]", "tuple[]"],
                "parameters": [positions, [], [], []]
            });

            const transactionObject = {
                "chainId": filterOptions.chainId,
                "from": filterOptions.from,
                "to": migrationContractAddress,
                "value": "0",
                "gas": filterOptions.gas,
                "data": data
            };

            if (filterOptions.gasPriority !== undefined) {
                transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                    gasPriority: filterOptions.gasPriority
                });
            }

            return (transactionObject);
        }
        catch (error) {
            return error;
        }

    },

    // eslint-disable-next-line no-unused-vars
    migrateAaveV2: async (evmWeb3, options) => {

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    migrateCompoundV3: async (evmWeb3, options) => {

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    }
};