const { Keypair,sendAndConfirmTransaction, PublicKey} = require('@solana/web3.js');
const { getAssociatedTokenAddress }  =  require("@solana/spl-token");
const { burnNFT } = require('../../src/expand/nonFungibleToken/index');
const { initialiseWeb3 } = require('../../common/intialiseWeb3');
describe('burnNFT Test',()=>{
       
  
  test('Should create a burn a NFT Token' , async() => {
        const connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
       
        try{
        
            const phrase = [78, 180, 36, 209, 60, 139, 224, 163, 142, 208, 46, 64, 236, 53, 204, 211, 221, 223, 237, 197, 73, 156, 157, 175, 231, 249, 89, 40, 8, 56, 198, 133, 11, 15, 39, 162, 203, 86, 159, 30, 17, 204, 225, 232, 98, 206, 56, 119, 181, 71, 36, 211, 218, 115, 215, 202, 31, 92, 83, 61, 215, 54, 152, 208];
            const secret = Uint8Array.from(phrase);
            const feePayer = Keypair.fromSecretKey(secret);
            const options={};
            options.mint = 'DZRqWxqW6qpJxABavpALYr2ECm9ivqDpdvdfeJDFD83V';
            options.owner = 'kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq';
            const account = await getAssociatedTokenAddress(new PublicKey(options.mint), new PublicKey(options.owner));
            options.account = account.toBase58();
            options.chainName = 'Solana';
            // console.log(JSON.stringify(options.account))
            console.log(options);
            const tx = await burnNFT(connection,options); // ,rpc: 'https://api.devnet.solana.com'});
            console.log('tx: ',tx);
            const rec = await sendAndConfirmTransaction(connection,tx,[feePayer]);
            console.log('rec',rec);
        }
        catch(error){
               console.log('errrr');
   }
});

       jest.setTimeout(50000);
});

