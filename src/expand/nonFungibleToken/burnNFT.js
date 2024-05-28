/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a burnNFT  response
     Transaction
    {

    }
    

*/
const web3 = require('@solana/web3.js');
const token = require('@solana/spl-token');
const schemaValidator = require('../../../common/configuration/schemaValidator');


module.exports = {

    burnNFTSolana: async (Connection, options) => {
        /*
            * Function will burn an NFT
        */

        

        const filterOptions = options;
        filterOptions.function = "burnNFTSolana()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }
        
        const account =  new web3.PublicKey(options.account);
        const mint = new web3.PublicKey(options.mint);
        const owner = new web3.PublicKey(options.owner);


        
        const transaction =  new web3.Transaction().add(
            token.createBurnInstruction(
                account,
                mint,
                owner,
                1,
            )
        );
    
        return transaction;
          
    },
};
