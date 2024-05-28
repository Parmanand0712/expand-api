/* eslint-disable new-cap */
const { Asset, getLiquidityPoolId } = require("stellar-sdk");
const errorMessage = require("./configuration/errorMessage.json");
const config = require('./configuration/config.json');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

// Function to get the details of an issuer for the specific asset
exports.getStellarAssetsByIssuer = async (stllrWeb3, issuer, code) => {
  let assetIssuer = "";
  let assetCode = code;
  if (code.toUpperCase() !== "XLM") {
    assetIssuer = issuer;
  } else assetCode = code.toUpperCase();

  try {
    const issuerAsset = await stllrWeb3.assets().forIssuer(assetIssuer).forCode(assetCode).call();
    return issuerAsset.records;
  } catch (err) {
    return false;
  }
};

// Function to throw custom user specific error
exports.throwUserError = async (user1, user2) => ({
  'message': `${user1} and ${user2} addresses cannot be same`,
  'code': errorMessage.error.code.invalidInput
});

exports.getPoolId = (poolShareAsset) => getLiquidityPoolId("constant_product", poolShareAsset.getLiquidityPoolParameters()).toString("hex");
exports.formatTokenUnit = (value) => (Number(value) / config.chains[1500].decimals).toString();
const parseAsset = (assetCode, assetIssuer) => assetCode.toUpperCase() === 'XLM' ? new Asset.native() : new Asset(assetCode, assetIssuer);

const validateAssetCodeLength = (assetCode) => {
  const len = assetCode?.length || 0;
  if (len && len > 1 && len < 13) return true;
  return false;
};

// Function to validate the assetCode and issuer.
exports.getStellarAssets = async (stllrWeb3, path) => {
  const tokenACode = path[0]?.split(":")?.[0]; 
  const tokenAIssuer = path[0]?.split(":")?.[1]?.toUpperCase(); 
  const tokenBCode = path[1]?.split(":")?.[0]; 
  const tokenBIssuer = path[1]?.split(":")?.[1]?.toUpperCase(); 

  if (!validateAssetCodeLength(tokenACode) || !validateAssetCodeLength(tokenBCode)) throw throwErrorMessage("invalidAssetCode");
  
  if (tokenACode === tokenBCode && tokenAIssuer === tokenBIssuer) return throwErrorMessage("sameTokenSwap");
  if ((tokenACode.toUpperCase() !== "XLM" && !tokenAIssuer) || (tokenBCode.toUpperCase() !== "XLM" && !tokenBIssuer))
  throw throwErrorMessage("missingAssetParams");

  const [recordsA, recordsB] = await Promise.all([
    this.getStellarAssetsByIssuer(stllrWeb3, tokenAIssuer, tokenACode),
    this.getStellarAssetsByIssuer(stllrWeb3, tokenBIssuer, tokenBCode)
  ]);

  if (!recordsA || !recordsB) throw  throwErrorMessage("invalidIssuer");
  if (!recordsA.length || !recordsB.length) throw throwErrorMessage("assetNotFound");

  return {
    tokenA: parseAsset(tokenACode, tokenAIssuer),
    tokenB: parseAsset(tokenBCode, tokenBIssuer)
  };
};
