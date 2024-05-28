const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

const wstETHABI = require("../../../assets/abis/wstETHABI.json");
const bnbxABI = require("../../../assets/abis/bnbx.json");

const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');


const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});


module.exports = {

    decreaseAllowanceLido: async (web3, options) => {
        /*
        * Function will decrease allowance of st[token] to a spender
        */

        const filterOptions = options;
        filterOptions.function = "decreaseAllowance()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { liquidStakingId, from, gas, tokenAddress, spender, subtractedAmount } = options;

        if (! await isValidContractAddress(web3, from)) return throwErrorMessage("invalidAddress");


        // Checking if the token is a st[token]
        if (!(config.liquidStaking[liquidStakingId].stTokens.includes(tokenAddress)))
            return throwErrorMessage("inValidstToken");

        const lidoContract = new web3.eth.Contract(wstETHABI, tokenAddress);
        const data = lidoContract.methods.decreaseAllowance(spender, subtractedAmount).encodeABI();

        const decreaseAllowanceTx = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: tokenAddress,
            data,
            value: "0",
            gas
        };

        if (filterOptions.gasPriority !== undefined) {
            decreaseAllowanceTx.gasPrice = await getGasPrice(web3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        };

        return decreaseAllowanceTx;
    },
    decreaseAllowanceBNBStader: async (web3, options) => {
        /*
        * Function will decrease allowance of BNBx to a spender
        */

        const filterOptions = options;
        filterOptions.function = "decreaseAllowance()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { liquidStakingId, from, gas, tokenAddress, spender, subtractedValue } = options;

        if (! await isValidContractAddress(web3, from)) return throwErrorMessage("invalidAddress");


        // Checking if the token is BNBx
        if (!(config.liquidStaking[liquidStakingId].stTokens ===(tokenAddress)))
            return throwErrorMessage("inValidstToken");

        const bnbxContract = new web3.eth.Contract(bnbxABI, tokenAddress);
        const data = bnbxContract.methods.decreaseAllowance(spender, subtractedValue).encodeABI();

        const decreaseAllowanceTx = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: tokenAddress,
            data,
            value: "0",
            gas
        };

        if (filterOptions.gasPriority !== undefined) {
            decreaseAllowanceTx.gasPrice = await getGasPrice(web3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        };

        return decreaseAllowanceTx;
    }
};