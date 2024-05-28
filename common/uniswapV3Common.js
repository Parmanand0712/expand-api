const config = require('./configuration/config.json');
const factoryAbis = require('../assets/abis/uniswapV3Factory.json');
const poolAbis = require('../assets/abis/uniswapV3Pool.json');


exports.getPool = async(web3, dexId ,token0, token1, poolFees) => {
    /*
     * This functions returns the pool contract address 
     * for the given token pairs
     *    
     */

    const factory = await new web3.eth.Contract(
        factoryAbis,
        await config.dex[dexId].factoryAddress
    );

    const pool = await factory.methods.getPool(
        token0,
        token1,
        poolFees
    ).call();

    return (pool);

};


exports.getMinMaxTick = async(web3, poolAddress) => {
    /*
     * This functions returns the array of minimum and maximum Tick 
     * for the given pool Address
     *    
     */

    const pool = new web3.eth.Contract(
        poolAbis,
        poolAddress
    );
    
    const slot0 = await pool.methods.slot0().call();
    const tickSpacing = await pool.methods.tickSpacing().call();
    const nearestTick = Math.floor(slot0[1] / tickSpacing) * tickSpacing;

    const minTick = nearestTick - ( tickSpacing * 2 );
    const maxTick = nearestTick + ( tickSpacing * 2 );

    return ( [minTick, maxTick] );

};

exports.getLiquidity = async(web3, poolAddress, tokenId) => {
    /*
     * This functions returns the array of minimum and maximum Tick 
     * for the given pool Address
     *    
     */

    const pool = await new web3.eth.Contract(
        poolAbis,
        poolAddress
    );

    const position = await pool.methods.positions(Number(tokenId)).call();
    return ( position );

};
