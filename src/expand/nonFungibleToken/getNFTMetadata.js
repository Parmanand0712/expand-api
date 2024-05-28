const { Metadata } = require("@metaplex-foundation/mpl-token-metadata");
const anchor = require("@project-serum/anchor");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const erc721ContractAbi = require('../../../assets/abis/erc721.json');
const { isSmartContract, is721NftContract } = require("../../../common/contractCommon");
const errorMessage = require('../../../common/configuration/errorMessage.json');

const config = require('../../../common/configuration/config.json');

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(config.nonFungibleToken.meta);

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  getNFTMetadataEvm721: async (web3, options) => {
    /*
        * Function will return the metadata of the NFT for EVM 721 protocol
    */

    const filterOptions = options;
    filterOptions.function = "metadataOfEvmNFT721()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return (validJson);
    }
    const { nftCollection } = filterOptions;
    // Check if input is valid.
    const [isContract, is721Nft] = await Promise.all([
      isSmartContract(web3, nftCollection),
      is721NftContract(web3, nftCollection),
    ]);

    if (!isContract || !is721Nft) {
      return throwErrorMessage("invalidNftContract");
    }

    const erc721Contract = new web3.eth.Contract(erc721ContractAbi, nftCollection);
    const erc721Name = await erc721Contract.methods.name().call();
    const erc721Symbol = await erc721Contract.methods.symbol().call();
    return ({ 'name': erc721Name, 'symbol': erc721Symbol });
  },

  getNFTMetadataSolanaMetaplex: async (Connection, options) => {
    /*
        * Function will return the metadata of the Solana
    */

    const filterOptions = options;
    filterOptions.function = "metadataOfSolanaNFTMetaplex";
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
      options.nftCollection
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
    if (!accInfo) return throwErrorMessage("invalidNftContract");


    const metadata = Metadata.deserialize(accInfo.data, 0);
    return ({name: metadata[0].data.name, symbol: metadata[0].data.symbol, uri: metadata[0].data.uri});
  }
};
