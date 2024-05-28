const web3 = require('@solana/web3.js');
const token = require('@solana/spl-token');
const schemaValidator = require('../../../common/configuration/schemaValidator');


module.exports = {

    approveNFTSolana: async (Connection, options) => {
        /*
            * Function will approve NFT to a delegate
        */
        const filterOptions = options;
        filterOptions.function = "approveNFTSolana()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }
        const account = await token.getAssociatedTokenAddress(new web3.PublicKey(options.token), new web3.PublicKey(options.owner));
        const delegate = await token.getAssociatedTokenAddress(new web3.PublicKey(options.token), new web3.PublicKey(options.delegate));
        const transaction = new web3.Transaction().add(
            token.createApproveInstruction(
                account,
                delegate,
                options.owner,
                1
            )
        );

        return transaction;
    },
};
