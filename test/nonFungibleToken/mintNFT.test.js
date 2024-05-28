const { Keypair,sendAndConfirmTransaction } = require('@solana/web3.js');
const {mintNFT} = require('../../src/expand/nonFungibleToken/index');
const {initialiseWeb3} = require('../../common/intialiseWeb3');


// describe('mintNFT Test',()=>{
        
//      test('Should create a brand new NFT Token' , async() => {
        
        
( async () => {
    connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
        try{
        
                    const mint =  Keypair.generate();
                    const phrase = [78, 180, 36, 209, 60, 139, 224, 163, 142, 208, 46, 64, 236, 53, 204, 211, 221, 223, 237, 197, 73, 156, 157, 175, 231, 249, 89, 40, 8, 56, 198, 133, 11, 15, 39, 162, 203, 86, 159, 30, 17, 204, 225, 232, 98, 206, 56, 119, 181, 71, 36, 211, 218, 115, 215, 202, 31, 92, 83, 61, 215, 54, 152, 208];
                    const secret = Uint8Array.from(phrase);
                    const feePayer = Keypair.fromSecretKey(secret);
                    mintkey = mint.publicKey.toBase58();
                    console.log(mintkey);
                    const tx = await mintNFT(connection,{publickey:'kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq',tokenAddress: mintkey, name: "Sumi",symbol: "SUM", uri: 'https://34c7ef24f4v2aejh75xhxy5z6ars4xv47gpsdrei6fiowptk2nqq.arweave.net/3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E',chainName: 'Solana' });// ,rpc: 'https://api.devnet.solana.com'});
                    console.log(tx) ;
                    const rec = await sendAndConfirmTransaction(connection,tx,[feePayer,mint]);
                    console.log(rec);
                    expect(tx).toBeTruthy();
                    
        }
        catch(error){
            
            console.log('error occured');
        }

    })()
// });

    
//        jest.setTimeout(500000); 
// });

