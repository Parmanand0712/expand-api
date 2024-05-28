/* eslint-disable no-await-in-loop */
const Web3 = require("web3");
const config = require("../../../common/configuration/config.json");


async function getBlockForTimestamp(timestamp, chainId) {

    const targetTimestamp = timestamp;

    const web3 = new Web3(config.chains[chainId].publicRpc);

    // decreasing average block size will decrease precision and also
    // decrease the amount of requests made in order to find the closest
    // block
    const averageBlockTime = 17*1.5;

    // get current block number
    const currentBlockNumber = await web3.eth.getBlockNumber();
    let block = await web3.eth.getBlock(currentBlockNumber);

    let blockNumber = parseInt(currentBlockNumber);

    while (block.timestamp > targetTimestamp) {

        let decreaseBlocks = (block.timestamp - targetTimestamp) / averageBlockTime;
       
        decreaseBlocks = parseInt(decreaseBlocks);
        
        if (decreaseBlocks < 1) {
            break;
        }

        blockNumber -= decreaseBlocks;
        block = await web3.eth.getBlock(blockNumber);

    }


    while(parseInt(block.timestamp)!==parseInt(timestamp)){
        if(parseInt(block.timestamp) > parseInt(timestamp)){
            blockNumber -= 1;
        }
        else {
            blockNumber += 1;
        }
        block = await web3.eth.getBlock(blockNumber);
    }

    return block.number;

};

module.exports = { getBlockForTimestamp };
