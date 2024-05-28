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
const Common = require('../../../common/common');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});



module.exports = {

    bundleActionsAaveV2: async () => throwErrorMessage("notApplicable"),
    bundleActionsAaveV3: async () => throwErrorMessage("notApplicable"),
    bundleActionsCompound: async () => throwErrorMessage("notApplicable"),

    bundleActionsCompoundV3: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "bundleActionsCompV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let { actions } = filterOptions;
        const { data , gas, from, chainId, market, lendborrowId , gasPriority } = filterOptions;

        if(web3.utils.isAddress(from) === false) return throwErrorMessage("invalidAddress");

        let valueToPass = 0;
        const dataArray = [];
        const { bundleActionsFunctions, bulker } = config.lendborrow[lendborrowId][market];
        if (actions.length !== data.length) return throwErrorMessage("contractExecutionError");
        for (let i = 0; i <= actions.length - 1; i += 1) {
            try {
                if(actions[i].includes('SUPPLY_NATIVE')) valueToPass += Number(data[i][2]);
                const actionValueTypes = Object.values(bundleActionsFunctions[actions[i]]);
                dataArray.push(web3.eth.abi.encodeParameters(actionValueTypes, data[i]));
            }
            catch (err) {
                return throwErrorMessage("invalidParameters");
            }
        }

        actions = actions.map(element => `${((web3.utils.toHex(element)))}`); 

        const dataValues = await Common.encodeFunctionData(web3, {
            "functionHash": "0x555029a6",
            "parametersType": ["bytes32[]", "bytes[]"],
            "parameters": [actions, dataArray]
        });

        const transactionObject = {
            "chainId": chainId,
            "from": from,
            "to": bulker,
            "value": valueToPass.toString(),
            "gas": gas,
            "data": dataValues
        };

        if (gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(web3, {
                gasPriority
            }).then(res => res.gasPrice);
        }

        return transactionObject;

    },




};

