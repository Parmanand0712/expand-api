/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 getName response
    {
      name: inderpreet
    }
*/

const { Metadata } = require("@metaplex-foundation/mpl-token-metadata");
const anchor = require("@project-serum/anchor");
const erc20ContractAbi = require('../../../assets/abis/iERC20.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(config.nonFungibleToken.meta);            // "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"


module.exports = {

    getNameEvm: async (evmWeb3, options) => {
        /*
            * Function will get nameEvm of erc20
        */

        const filterOptions = options;
        filterOptions.function = "getNameEvm()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const erc20Contract = new evmWeb3.eth.Contract(erc20ContractAbi, filterOptions.tokenAddress);
        const erc20TokenName = await erc20Contract.methods.name().call();

        return ({ 'name': erc20TokenName });
    },

    getNameSolana: async (Connection, options) => {
        /*
            * Function will get  metadata: Name
        */
        const filterOptions = options;
        filterOptions.function = "getNameSolana()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }
        
        const publickey = new anchor.web3.PublicKey(config.solanaDefaultAddress);

      
        const provider = new anchor.AnchorProvider(
               new anchor.web3.Connection(Connection._rpcEndpoint),
               new anchor.Wallet(publickey),
               { commitment: "confirmed" }
        );
          const mint = new anchor.web3.PublicKey(
            options.token
          );
      
          const [metadataPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [
              Buffer.from("metadata"),
              TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              mint.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
          );
      
          
          const accInfo = await provider.connection.getAccountInfo(metadataPDA);
        
          const metadata = Metadata.deserialize(accInfo.data, 0);

          return  metadata[0].data.name ;
          
    },
};
