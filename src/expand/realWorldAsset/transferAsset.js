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
  transferAssetStellar: async (stllrWeb3, options) => {
    const filterOptions = options;

    filterOptions.function = "stellarTransferAsset";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId, issuer, amount, assetCode, from, to } = filterOptions;

    // Throws an error if both from and to addresses are same
    if (from === to) return throwUserError("From", "to");

    // Checking if issuer and assetCode are correct
    const records = await getStellarAssetsByIssuer(stllrWeb3, issuer, assetCode);
    if (!records) return throwErrorMessage("invalidIssuer");
    if (!records.length) return throwErrorMessage("assetNotFound");
    
    // initializing the accounts
    const [account, toAddress] = await Promise.all([isValidStellarAccount(stllrWeb3, from), isValidStellarAccount(stllrWeb3, to)]);
    if (!account || !toAddress) return throwErrorMessage("invalidUserAddress");

    const rwaAsset = (assetCode && issuer) ? new Asset(assetCode, issuer) : Asset.native();
    const { TESTNET, PUBLIC } = Networks;

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: chainId === "1501" ? TESTNET : PUBLIC,
    })
      .addOperation(
        Operation.payment({
          destination: to,
          asset: rwaAsset,
          amount,
        }),
      )
      .setTimeout(100)
      .build();
      return { chainId, from, to, gas: BASE_FEE, data: transaction.toEnvelope().toXDR('base64') };
  },
};