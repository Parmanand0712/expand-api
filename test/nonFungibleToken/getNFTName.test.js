const {getNFTName,getNFTSymbol,getNFTOwner,approveNFT} = require('../../src/expand/nonFungibleToken/index');
const {initialiseWeb3} = require('../../common/intialiseWeb3');
const token = require('@solana/spl-token');
const { PublicKey } = require('@solana/web3.js')
describe('getNFTName Test',()=>{
    
    test('Should give Name of NFT Token' , async() => {
            connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
            const metadata = await getNFTName(connection,{publickey:'kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq',token: 'AoAH8NBws97Fn4QFt9wpThBPzaTZt6aYqFqepTji3yT6',chainId: '901'}); // chainName: 'Solana'});
            console.log(metadata);
            expect(metadata).toBeTruthy();
    });

    test('Should give Symbol of NFT Token' , async() => {
            connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
            const metadata = await getNFTSymbol(connection,{publickey:'kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq',token: 'AoAH8NBws97Fn4QFt9wpThBPzaTZt6aYqFqepTji3yT6',chainName: 'Solana'});
            console.log(metadata);
            expect(metadata).toBeTruthy();
    });

    test('Should give Owner of NFT Token' , async() => {
            connection = await initialiseWeb3({chainId:'901'}); // chainName:'Solana'});
            const owner = await getNFTOwner(connection,{token: 'AoAH8NBws97Fn4QFt9wpThBPzaTZt6aYqFqepTji3yT6',chainName: 'Solana'});
            console.log(owner);
            expect(owner).toBeTruthy();
    });

    test('Should approve NFT Token' , async() => {
            connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
            const tx = await approveNFT(connection,{owner:'kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq',token: 'AoAH8NBws97Fn4QFt9wpThBPzaTZt6aYqFqepTji3yT6',delegate:'5NRcjdDkJ85r84DUhFtRZKJNiointMMk8xm9mtye5W7G',chainId: '901'}); // chainName: 'Solana'});
            console.log(tx);
    });

    jest.setTimeout(50000);

});

