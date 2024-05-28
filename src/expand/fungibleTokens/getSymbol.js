/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 getSymbol response
    {
      symbol: inderpreet
    }
*/
const { Metadata } = require("@metaplex-foundation/mpl-token-metadata");
const anchor = require("@project-serum/anchor");
const config = require('../../../common/configuration/config.json');

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(config.nonFungibleToken.meta);
const erc20ContractAbi = require('../../../assets/abis/iERC20.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const erc20SymbolInBytes = require('../../../assets/abis/erc20SymbolInBytes.json');

module.exports = {

  getSymbolEvm: async (evmWeb3, options) => {
    /*
        * Function will get getSymbolEvm of erc20
    */

    const filterOptions = options;
    filterOptions.function = "getSymbolEvm()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return (validJson);
    }

    try {
      const erc20Contract = new evmWeb3.eth.Contract(erc20ContractAbi, filterOptions.tokenAddress);
      const erc20TokenSymbol = await erc20Contract.methods.symbol().call();

      return ({ 'symbol': erc20TokenSymbol });
    }
    catch (err) {
      const erc20Contract = new evmWeb3.eth.Contract(erc20SymbolInBytes, filterOptions.tokenAddress);
      const erc20TokenInBytes = await erc20Contract.methods.symbol().call();
      const erc20TokenSymbol = await evmWeb3.utils.hexToUtf8(erc20TokenInBytes);

      return ({ 'symbol': erc20TokenSymbol });
    }
  },

  getSymbolSolana: async (Connection, options) => {
    /*
        * Function will get  metadata: Name
    */

    const mint = new anchor.web3.PublicKey(
      options.token
    );

    const provider = new anchor.AnchorProvider(
      new anchor.web3.Connection(Connection._rpcEndpoint),
      new anchor.Wallet(mint),
      { commitment: "confirmed" }
    );

    try {
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

      const byteSequence = Buffer.from(metadata[0].data.symbol, 'utf8');
      const symbol = byteSequence.toString('utf8').replace(/\0/g, '');

      return symbol;
    } catch (error) {
      return options.token;
    }

  },
};
