/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 balanceOf response
    {
        balance: '1' 
    }
*/
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const erc1155ContractAbi = require('../../../assets/abis/erc1155.json');
const erc721ContractAbi = require('../../../assets/abis/erc721.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { isSmartContract, is1155NftContract, is721NftContract } = require('../../../common/contractCommon');

const invalidNftContract = {
    'message': errorMessage.error.message.invalidNftContract,
    'code': errorMessage.error.code.invalidInput
};

const invalidEOAAddress = {
    'message': errorMessage.error.message.invalidEOAAddress,
    'code': errorMessage.error.code.invalidInput 
};

module.exports = {

    balanceOfEvm1155: async(web3, options) => {
        /*
            * Function will return the balance of any user for the given token and token id.
        */

        const filterOptions = { ...options, function: 'balanceOfEvm1155()' };
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }


        if(!filterOptions.address || await web3.eth.getCode(filterOptions.address) !== '0x') return (invalidEOAAddress);

        const {nftCollection, tokenId, address} = filterOptions;
        const [isContract, is1155Nft] = await Promise.all([isSmartContract(web3, nftCollection), is1155NftContract(web3, nftCollection)]);

        if (isContract && is1155Nft) {
            const erc1155Contract = new web3.eth.Contract(erc1155ContractAbi, nftCollection);
            const erc1155Balance = await erc1155Contract.methods.balanceOf(address, tokenId).call();
            return ({ 'balance': erc1155Balance });
        } else {
            return invalidNftContract;
        }
        
    },

    balanceOfEvm721: async(web3, options) => {
        /*
            * Function will return the balance of any user for the given token and token id.
        */

        const filterOptions = { ...options, function: 'balanceOfEvm721()' };
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
        

        if(!filterOptions.address || await web3.eth.getCode(filterOptions.address) !== '0x') return (invalidEOAAddress);
        
        const {nftCollection, address} = filterOptions;
        const [isContract, is721Nft] = await Promise.all([isSmartContract(web3, nftCollection), is721NftContract(web3, nftCollection)]);
        try{
            if (isContract && is721Nft) {
                const erc721Contract = new web3.eth.Contract(erc721ContractAbi, nftCollection);
                const erc721Balance = await erc721Contract.methods.balanceOf(address).call();
                return ({ 'balance': erc721Balance });
            } else {
                return invalidNftContract;
            }
        } catch (error) {
            return error;
        }

    },

    balanceOfSolanaMetaplex : async (Connection, options) => {
        const filterOptions = options;
        filterOptions.function = "balanceOfSolanaNFTMetaplex";
        const validJson = await schemaValidator.validateInput(options);
    
        if (!validJson.valid) {
          return (validJson);
        }

        const res = 
            await Connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
              filters: [
                {
                  dataSize: 165,
                },
                {
                  memcmp: {
                    offset: 0,
                    bytes: filterOptions.nftCollection, 
                  },
                },
                {
                  memcmp: {
                    offset: 32,
                    bytes: filterOptions.address, 
                  },
                },
                {
                  memcmp: {
                    offset: 64,
                    bytes: "Ahg1opVcGX", // bs58 for [1,0,0,0,0,0,0,0], it is a byte array for u64 little endian
                  },
                },
              ],
              dataSlice: {
                offset: 0,
                length: 0,
              },
            });
          return {"balance": res.length};
    }
};
