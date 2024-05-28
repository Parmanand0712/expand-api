const { Networks, TransactionBuilder, BASE_FEE, Operation, Asset } = require("stellar-sdk");
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { isValidStellarAccount } = require("../../../common/contractCommon");
const { throwUserError } = require("../../../common/stellarCommon");

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  issueAssetStellar: async (stllrWeb3, options) => {
    const filterOptions = options;

    filterOptions.function = "stellarIssueAsset";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId, issuer, amount, assetCode, to } = filterOptions;

    // Throws an error if both issuer and to addresses are same
    if (issuer === to) return throwUserError("Issuer", "to");

    // initializing the accounts
    const [account, toAddress] = await Promise.all([isValidStellarAccount(stllrWeb3, issuer), isValidStellarAccount(stllrWeb3, to)]);
    if (!account) return throwErrorMessage("invalidIssuer");
    if (!toAddress) return throwErrorMessage("invalidUserAddress");

    const rwaAsset = new Asset(assetCode, issuer);
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
        })
      )
      .setTimeout(100)
      .build();
    return { chainId, from: issuer, gas: BASE_FEE, data: transaction.toEnvelope().toXDR('base64') };
  },
};