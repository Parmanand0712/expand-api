const formatLogs = (web3, logs, type, protocol) => {
    const formattedLogs = [];
    const logType = protocol ? `${type}${protocol}`: type;
    logs.forEach(async(log) => {
        let params = {};
        switch (logType) {
            case 'Approval': {
                const approveValue = BigInt(log.data);
                params = {
                    src: `0x${log.topics[1].slice(26)}`,
                    guy: `0x${log.topics[2].slice(26)}`,
                    wad: approveValue.toString(),
                };
                break;
            }
            case 'Transfer': {
                const transferValue = BigInt(log.data);
                params = {
                    src: `0x${log.topics[1].slice(26)}`,
                    dst: `0x${log.topics[2].slice(26)}`,
                    wad: transferValue.toString(),
                };
                break;
            }
            case 'Approval721':
                params = {
                    from: `0x${log.topics[1].slice(26)}`,
                    to: `0x${log.topics[2].slice(26)}`,
                    tokenId: `${parseInt(log.topics[3], 16) || 0}`,
                };
                break;
            case 'Transfer721':
                params = {
                    from: `0x${log.topics[1].slice(26)}`,
                    to: `0x${log.topics[2].slice(26)}`,
                    tokenId: `${parseInt(log.topics[3], 16) || 0}`,
                };
                break;
            case 'ApproveForAll1155':
                params = {
                    account: `0x${log.topics[1].slice(26)}`,
                    operator: `0x${log.topics[2].slice(26)}`,
                    approved: parseInt(log.data, 16) === 1,
                };
                break;
            case 'TransferSingle1155': {
                const decodedData = await web3.eth.abi.decodeParameters([
                    {
                      type: "uint256",
                      name: "id",
                    },
                    {
                      type: "uint256",
                      name: "value",
                    },
                  ], log.data); 
                params = {
                    operator: `0x${log.topics[1].slice(26)}`,
                    from: `0x${log.topics[2].slice(26)}`,
                    to: `0x${log.topics[3].slice(26)}`,
                    tokenId: decodedData.id,
                    value: decodedData.value,
                };
                break;
            }
            case 'Deposit': {
                const depositValue = BigInt(log.data);
                params = {
                    dst: `0x${log.topics[1].slice(26)}`,
                    wad: depositValue.toString(),
                };
                break;
            }
            case 'Withdraw': {
                const withdrawValue = BigInt(log.data);
                params = {
                    src: `0x${log.topics[1].slice(26)}`,
                    wad: withdrawValue.toString(),
                };
                break;
            }
            default:
                break;
        }
        formattedLogs.push({
            address: log.address,
            topics: log.topics,
            params,
            data: log.data,
            blockNumber: `${parseInt(log.blockNumber, 16)}`,
            blockHash: log.blockHash,
            timeStamp: `${parseInt(log.timeStamp, 16)}`,
            gasPrice: `${parseInt(log.gasPrice, 16)}`,
            gasUsed: `${parseInt(log.gasUsed, 16)}`,
            logIndex: `${parseInt(log.logIndex, 16) || 0}`,
            transactionHash: log.transactionHash,
            transactionIndex: `${parseInt(log.transactionIndex, 16) || 0}`,
        });
    });
    return formattedLogs;
};

module.exports = formatLogs;