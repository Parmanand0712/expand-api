const { Networks, TransactionBuilder, BASE_FEE, Operation, Asset } = require("stellar-sdk");
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { isValidStellarAccount } = require("../../../common/contractCommon");
const { getStellarAssetsByIssuer, throwUserError } = require("../../../common/stellarCommon");

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  burnAssetStellar: async (stllrWeb3, options) => {
    const filterOptions = options;

    filterOptions.function = "setTrustlineAndBurnAsset";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId, issuer, amount, assetCode, from } = filterOptions;

    // Throws an error if both issuer and from addresses are same
    if (issuer === from) return throwUserError("Issuer", "from");

    // Checking if issuer and assetCode are correct
    const records = await getStellarAssetsByIssuer(stllrWeb3, issuer, assetCode);
    if (!records) return throwErrorMessage("invalidIssuer");
    if (!records.length) return throwErrorMessage("assetNotFound");
    
    // initializing the account
    const account = await isValidStellarAccount(stllrWeb3, from);
    if (!account) return throwErrorMessage("invalidUserAddress");

    const rwaAsset = new Asset(assetCode, issuer);
    const { TESTNET, PUBLIC } = Networks;

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: chainId === "1501" ? TESTNET : PUBLIC,
    })
      .addOperation(
        Operation.payment({
          destination: issuer,
          asset: rwaAsset,
          amount,
        }),
      )
      .setTimeout(100)
      .build();
      return { chainId, from, gas: BASE_FEE, data: transaction.toEnvelope().toXDR('base64') };
    },
};