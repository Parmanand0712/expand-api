/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a NFTMetadata  response
    {
      owner: "                ";
    }
*/
// eslint-disable-next-line import/no-extraneous-dependencies
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const bs58 = require("bs58");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const erc721ContractAbi = require('../../../assets/abis/erc721.json');
const { isSmartContract, is721NftContract } = require("../../../common/contractCommon");
const errorMessage = require('../../../common/configuration/errorMessage.json');


const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});


// get NFT current owner

module.exports = {

    getNFTOwnerSolanaMetaplex: async (connection, options) => {
        /*
            * Function will get NFT metadata: Owner
        */
        const filterOptions = options;
        filterOptions.function = "getNFTOwnerSolana()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }
        try {
          const accountInfos  = 
        await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
            encoding: "base64",
            filters: [
              {
                dataSize: 165,
              },
              {
                memcmp: {
                  offset: 0,
                  bytes: options.nftCollection, // your mint here
                },
              },
              {
                memcmp: {
                  offset: 64,
                  bytes: "Ahg1opVcGX", // this is base58 encode [1,0,0,0,0,0,0,0]
                },
              },
            ],
          });
          if (accountInfos.length === 0) return throwErrorMessage("invalidNftContract");
          const owner = bs58.encode(accountInfos[0].account.data.slice(32, 64));
          return {
            'owner': owner
          };
        } catch (err) {
          return throwErrorMessage("invalidNftContract");
        }
    },

    getNFTOwnerEvm721: async (web3, options) => {
      /*
          * Function will return the owner
      */

      const filterOptions = options;
      filterOptions.function = "ownerOfEvmNFT721()";
      const validJson = await schemaValidator.validateInput(options);

      if (!validJson.valid) {
          return (validJson);
      }
      const {nftCollection} = filterOptions;
        // Check if input is valid.
        const [isContract, is721Nft] = await Promise.all([
          isSmartContract(web3, nftCollection),
          is721NftContract(web3, nftCollection),
        ]);
        if (!isContract || !is721Nft) {
          return throwErrorMessage("invalidNftContract");
        } 

      const erc721Contract = new web3.eth.Contract(erc721ContractAbi, nftCollection);
      const erc721Owner = await erc721Contract.methods.ownerOf(filterOptions.nftIndex).call();
      return ({ 'owner': erc721Owner });
  },

};
