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
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const rewardAbi = require('../../../assets/abis/compound3Reward.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    getClaimedRewardsAaveV2: async () => throwErrorMessage("notApplicable"),
    getClaimedRewardsAaveV3: async () => throwErrorMessage("notApplicable"),
    getClaimedRewardsCompound: async () => throwErrorMessage("notApplicable"),


    getClaimedRewardsCompoundV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "getClaimedRewardsCompV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { lendborrowId, market , address } = filterOptions;
        const { reward, comet } = config.lendborrow[lendborrowId][market];

        
        if(evmWeb3.utils.isAddress(address) === false) return throwErrorMessage("invalidEOAAddress");

        const rewardContract = new evmWeb3.eth.Contract(rewardAbi, reward);

        const rewardAccured = await rewardContract.methods.getRewardOwed(comet, address).call();

        const response = { 'rewardAccured':  rewardAccured[1]};

        return response;

    }

};