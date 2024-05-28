const { Networks, TransactionBuilder, BASE_FEE, Operation, AuthRevocableFlag } = require("stellar-sdk");
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { isValidStellarAccount } = require("../../../common/contractCommon");
const { getStellarAssetsByIssuer, throwUserError } = require("../../../common/stellarCommon");

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  freezeAssetStellar: async (stllrWeb3, options) => {
    const filterOptions = options;

    filterOptions.function = "stellarFreezeAsset";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId, issuer, assetCode, user } = filterOptions;

    // Throws an error if both issuer and from addresses are same
    if (issuer === user) return throwUserError("Issuer", "user");

    // Checking if issuer and assetCode are correct
    const records = await getStellarAssetsByIssuer(stllrWeb3, issuer, assetCode);
    if (!records) return throwErrorMessage("invalidIssuer");
    if (!records.length) return throwErrorMessage("assetNotFound");
    
    // initializing the accounts
    const [issuerAccount, toAddress] = await Promise.all([isValidStellarAccount(stllrWeb3, issuer), isValidStellarAccount(stllrWeb3, user)]);
    if (!toAddress) return throwErrorMessage("invalidUserAddress");
    
    const { TESTNET, PUBLIC } = Networks;

    let transaction = new TransactionBuilder(issuerAccount, {
      fee: BASE_FEE,
      networkPassphrase: chainId === "1501" ? TESTNET : PUBLIC
    });
    const {flags} = await stllrWeb3.accounts().accountId(issuer).call();
  
    if (!flags.auth_revocable) {
      transaction = transaction.addOperation(Operation.setOptions({
        // eslint-disable-next-line no-bitwise
        setFlags: AuthRevocableFlag
      }));
    };
  
    transaction = transaction.addOperation(Operation.allowTrust({
      trustor: user,
      assetCode,
      assetIssuer: issuer,
      authorize: false
    }))
      .setTimeout(100)
      .build();
      return { chainId, from: issuer, gas: BASE_FEE, data: transaction.toEnvelope().toXDR('base64') };
    },
};