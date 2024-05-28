const { Keypair,sendAndConfirmTransaction,PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount }  =  require("@solana/spl-token");
const { transferNFT } = require('../../src/expand/nonFungibleToken/index');
const { initialiseWeb3 } = require('../../common/intialiseWeb3');
describe('transferNFT Test',()=>{
        test('Transfer NFT' , async() => {
           connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
        try{      

                  const phrase = [78, 180, 36, 209, 60, 139, 224, 163, 142, 208, 46, 64, 236, 53, 204, 211, 221, 223, 237, 197, 73, 156, 157, 175, 231, 249, 89, 40, 8, 56, 198, 133, 11, 15, 39, 162, 203, 86, 159, 30, 17, 204, 225, 232, 98, 206, 56, 119, 181, 71, 36, 211, 218, 115, 215, 202, 31, 92, 83, 61, 215, 54, 152, 208];
                  const secret = Uint8Array.from(phrase);
                  const feePayer = Keypair.fromSecretKey(secret);
                  const options={};
                  options.token = 'e8pXo8wLPCwQ9Bk53aY1F6Y1BqZPyxzJjhN7jBzHASq';
                  options.feePayer = 'kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq';
                  account = await getAssociatedTokenAddress(new PublicKey(options.token), new PublicKey(options.feePayer));
                  console.log(account.toBase58());
                  options.sender = account.toBase58();
                  options.destination = 'Dgq5B8i5NJJfPoUgpkFZDzRr84zd1BJrUBntJt1EBvgd';
                  destination = await getOrCreateAssociatedTokenAccount(connection , feePayer,new PublicKey(options.token), new PublicKey(options.destination));
                  console.log(destination.address.toBase58());// ).address.toBase58())
                  options.destination= destination.address.toBase58();
                  options.chainName = 'Solana';
                  const tx = await transferNFT(connection,options);// ,rpc: 'https://api.devnet.solana.com'});
                  console.log(tx);
                  const rec = await sendAndConfirmTransaction(connection,tx,[feePayer]);
                  console.log(rec);
                  expect(tx).toBeTruthy();
         }
        catch(error){
           
                  console.log('errr');
         
        }
});

    // eslint-disable-next-line no-undef
       jest.setTimeout(500000);
});

