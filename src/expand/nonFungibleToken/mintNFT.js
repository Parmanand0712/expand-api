/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a mintNFT  response
      Transaction{

      }
*/

const { PublicKey, Transaction, SystemProgram } = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");
const {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");
const {
  createCreateMetadataAccountV2Instruction,
  createCreateMasterEditionV3Instruction,
} = require("@metaplex-foundation/mpl-token-metadata");
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');


const MPL_TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(config.nonFungibleToken.meta);

async function getMetadataPDA(mint) {
  const [publicKey] = await PublicKey.findProgramAddress(
    [Buffer.from("metadata"), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    MPL_TOKEN_METADATA_PROGRAM_ID
  );
  return publicKey;
}

async function getMasterEditionPDA(mint) {
  const [publicKey] = await PublicKey.findProgramAddress(
    [Buffer.from("metadata"), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from("edition")],
    MPL_TOKEN_METADATA_PROGRAM_ID
  );
  return publicKey;
}

module.exports = {

  mintNFTSolana: async (connection, options) => {

    // Funtion will mint an NFT on Solana Blockchain
    // as per latest metaplex master edition

    const filterOptions = options;
    filterOptions.function = "mintNFTSolana()";
    const feePayer = new anchor.web3.PublicKey(options.publickey);
    const mint = new PublicKey(options.tokenAddress);
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return (validJson);
    }

    const AssociatedTokenAccount = await getAssociatedTokenAddress(mint, feePayer);
    const tokenMetadataPubkey = await getMetadataPDA(mint);
    const masterEditionPubkey = await getMasterEditionPDA(mint);
    const tx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: feePayer,
        newAccountPubkey: mint,
        lamports: await getMinimumBalanceForRentExemptMint(connection),
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(mint, 0, feePayer, feePayer),
      createAssociatedTokenAccountInstruction(feePayer, AssociatedTokenAccount, feePayer, mint),
      createMintToCheckedInstruction(mint, AssociatedTokenAccount, feePayer, 1, 0),
      createCreateMetadataAccountV2Instruction(
        {
          metadata: tokenMetadataPubkey,
          mint,
          mintAuthority: feePayer,
          payer: feePayer,
          updateAuthority: feePayer,
        },
        {
          createMetadataAccountArgsV2: {
            data: {
              name: options.name,
              symbol: options.symbol,
              uri: options.uri,
              sellerFeeBasisPoints: 100,
              creators: [
                {
                  address: feePayer,
                  verified: true,
                  share: 100,
                },

              ],
              collection: null,
              uses: null,
            },
            isMutable: true,
          },
        }
      ),
      createCreateMasterEditionV3Instruction(
        {
          edition: masterEditionPubkey,
          mint,
          updateAuthority: feePayer,
          mintAuthority: feePayer,
          payer: feePayer,
          metadata: tokenMetadataPubkey,
        },
        {
          createMasterEditionArgs: {
            maxSupply: 0,
          },
        }
      )
    );
    return tx;
  }
};

