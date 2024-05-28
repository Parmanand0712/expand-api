const schemaValidator = require('../../../common/configuration/schemaValidator');
const stargatePoolABI = require('../../../assets/abis/StargatePool.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');

module.exports = {
    
    getLiquidityStargate: async( web3, options) => {
        const filterOptions = options;
        filterOptions.function = "getLiquidityStargate";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const pool = new web3.eth.Contract(stargatePoolABI,filterOptions.poolAddress);
        let userLiquidity;
        const response = {};

        try{
            const totalLiquidity = await pool.methods.totalLiquidity().call();
            const tokenAddress = await pool.methods.token().call();
            const poolId = await pool.methods.poolId().call();
            const poolname = await pool.methods.name().call();
            response.poolId = poolId;
            response.poolName = poolname;
            response.tokenAddress = tokenAddress;
            try{
                if(filterOptions.from)
                   userLiquidity = await pool.methods.balanceOf(filterOptions.from).call();
                if(userLiquidity){
                response.userLiquidity = userLiquidity;
                }
            }catch(error){
                response.userLiquidity = "Address not valid";
            }
            response.totalLiquidity = totalLiquidity;
        } catch(error){
            console.log(error);
            return { 'message': errorMessage.error.message.poolDoesNotExist, 'code': errorMessage.error.code.notFound };

        }

        return (response);

    }
};