/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a transferNFT  response
      Transaction{

      }
*/

const { Transaction, PublicKey } = require("@solana/web3.js");
const { createTransferCheckedInstruction } = require("@solana/spl-token");
const schemaValidator = require('../../../common/configuration/schemaValidator');

module.exports = {

  transferNFTSolana: async (Connection, options) => {
    /*
        Function will transfer an NFT token
    */
    const filterOptions = options;
    filterOptions.function = "transferNFTSolana()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return (validJson);
    }


    const feePayer = new PublicKey(options.feePayer);
    const mintPubkey = new PublicKey(options.token);
    const tokenAccount1Pubkey = new PublicKey(options.sender);
    const tokenAccount2Pubkey = new PublicKey(options.destination);
    // mint token
    const tx = new Transaction();
    tx.add(
      createTransferCheckedInstruction(
        tokenAccount1Pubkey, // from
        mintPubkey, // mint
        tokenAccount2Pubkey, // to
        feePayer, // from's owner
        1, // amount
        0 // decimals
      )
    );
    return tx;

  }
};