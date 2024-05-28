const {getNFTName,getNFTSymbol,getNFTOwner,approveNFT, getHistoricalTransactions} = require('../../src/expand/nonFungibleToken/index');
const {initialiseWeb3} = require('../../common/intialiseWeb3');
const token = require('@solana/spl-token');
const { PublicKey } = require('@solana/web3.js');
describe('getHistoricalTransactions Test',()=>{
    
    test('Should give historical transactions of NFT Token' , async() => {
            connection = await initialiseWeb3({chainId:'1',chainName:'Evm'});
            const transactions = await getHistoricalTransactions(connection,
                {
                    tokenAddress: "0x76be3b62873462d2142405439777e971754e8e77",
                    address: "0x83f564d180b58ad9a02a449105568189ee7de8cb",
                    page: '1',
                    nftProtocol: '1155',
                    offset: '100',
                    startBlock: '0',
                    endBlock: '16582045',
                    sort: 'desc',
                    chainId: '1'
                }); // chainName: 'Solana'});
            console.log(transactions);
            expect(transactions).toBeTruthy();
    });
});
