const { Address } = require("@ton/ton");
const ERC165Abi = require("../assets/abis/erc165.json");

module.exports = {

    is721NftContract: async (web3, contractAddress) => {
        // Given a contract address returns if it is a valid 721 NFT or not
        try {
            const contract = await new web3.eth.Contract(
                ERC165Abi,
                contractAddress
            );
            const res = await contract.methods.supportsInterface('0x80ac58cd').call();
            return (res);
        } catch (err) {
            /*
             * In case the contract does not have a function name supportsInterface
             * There might be some NFT contract which does not have a funciton name supportsInterface, 
             * but they don't follow the EIP, therefore ignoring them.
             *
             */
            return (false);
        }
    },

    is1155NftContract: async (web3, contractAddress) => {
        // Given a contract address returns if it is a valid 1155 NFT or not
        try {
            const contract = await new web3.eth.Contract(
                ERC165Abi,
                contractAddress
            );
            const res = await contract.methods.supportsInterface('0xd9b67a26').call();
            return (res);
        } catch (err) {
            /*
             * In case the contract does not have a function name supportsInterface
             * There might be some NFT contract which does not have a funciton name supportsInterface, 
             * but they don't follow the EIP, therefore ignoring them.
             *
             */
            return (false);
        }
    },

    isSmartContract: async (web3, address) => {
        /*
         * Given a address, check if it is a smart contract or not
         */
        try {
            const code = await web3.eth.getCode(address);
            return (code !== '0x');
        } catch (error) {
            return false;
        }
    },

    isErc20Contract: async (web3, address) => {
        /*
         * Given a address, check if it is a erc20 contract or not
        */
        try {
            const call = await web3.eth.call({ to: address, data: web3.utils.sha3("decimals()") });
            return (call !== '0x');
        } catch (error) {
            return false;
        }
    },

    isValidContractAddress: async (web3, contract) => {
        /*
         * Given a address, check if it is a valid contract or not
        */
        try {
            const isValidAddress = web3.utils.isAddress(contract);
            return isValidAddress;
        } catch (error) {
            return false;
        }
    },

    isValidNearUser: async (nearWeb3, address) => {
        /*
         * Given a near address, check if it is a valid or not
        */
        try {
            const user = await nearWeb3.account(address);
            const state = await user.state();
            return state.code_hash === "11111111111111111111111111111111" ;
        } catch (error) {
            return false;
        }
    },
    
    isValidAddressLengthEvm: (address) => address.length === 42,
    isValidAddressLengthTon: (address) => address.length === 48,
    isValidAddressTonAddress: (address) => {
        try {
            Address.parse(address);
            return true;
        } catch (err) {
            return false;
        }
    },
    isValidStellarAccount: async(stllrWeb3, address) => {
        try {
            const account = await stllrWeb3.loadAccount(address);
            return account;
        } catch (err) {
            return false;
        }
    },
};
