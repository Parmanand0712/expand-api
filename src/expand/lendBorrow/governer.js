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
const configuratorAbi = require('../../../assets/abis/compound3Configurator.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    governerDataAaveV2: async () => throwErrorMessage("notApplicable"),
    governerDataAaveV3: async () => throwErrorMessage("notApplicable"),
    governerDataCompound: async () => throwErrorMessage("notApplicable"),

    governerDataCompoundV3: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "governerDataCompV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
        let cometConfiguration;
        const {comet , configurator } = config.lendborrow[filterOptions.lendborrowId][filterOptions.market];
        const response = {};
        const [cometContract, configuratorContract] = [new web3.eth.Contract(cometAbi, comet)
            , new web3.eth.Contract(configuratorAbi, configurator)];

        [response.isSupplyPaused, response.isTransferPaused, response.isWithdrawPaused, response.isAbsorbPaused
            , response.isBuyPaused, cometConfiguration ] = await Promise.all([cometContract.methods.isSupplyPaused().call()
                , cometContract.methods.isTransferPaused().call(),
            cometContract.methods.isWithdrawPaused().call(), cometContract.methods.isAbsorbPaused().call()
                , cometContract.methods.isBuyPaused().call()
                , configuratorContract.methods.getConfiguration(comet).call()]);

        response.cometConfiguration = {
            "governor": cometConfiguration[0],
            "pauseGuardian": cometConfiguration[1],
            "baseToken": cometConfiguration[2],
            "baseTokenPriceFeed": cometConfiguration[3],
            "extensionDelegate": cometConfiguration[4],
            "supplyKink": cometConfiguration[5],
            "supplyPerYearInterestRateSlopeLow": cometConfiguration[6],
            "supplyPerYearInterestRateSlopeHigh": cometConfiguration[7],
            "supplyPerYearInterestRateBase": cometConfiguration[8],
            "borrowKink": cometConfiguration[9],
            "borrowPerYearInterestRateSlopeLow": cometConfiguration[10],
            "borrowPerYearInterestRateSlopeHigh": cometConfiguration[11],
            "borrowPerYearInterestRateBase": cometConfiguration[12],
            "storeFrontPriceFactor": cometConfiguration[13],
            "trackingIndexScale": cometConfiguration[14],
            "baseTrackingSupplySpeed": cometConfiguration[15],
            "baseTrackingBorrowSpeed": cometConfiguration[16],
            "baseMinForRewards": cometConfiguration[17],
            "baseBorrowMin": cometConfiguration[18],
            "targetReserves": cometConfiguration[19],
            "assetConfigs": cometConfiguration[20]
        };

        return response;
    },

};

