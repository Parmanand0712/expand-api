const { DutchOrderBuilder, NonceManager } = require("@uniswap/uniswapx-sdk");
const { ethers, BigNumber } = require("ethers");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});


module.exports = {
  createOrderUniswapV2: async () => throwErrorMessage("notApplicable"),
  createOrderSushiswapV2: async () => throwErrorMessage("notApplicable"),
  createOrderPancakeV2: async () => throwErrorMessage("notApplicable"),
  createOrderUniswapV3: async () => throwErrorMessage("notApplicable"),
  createOrderCurveV2: async () => throwErrorMessage("notApplicable"),
  createOrderBalancerV2: async () => throwErrorMessage("notApplicable"),
  createOrder0x: async () => throwErrorMessage("notApplicable"),
  createOrder1inch: async () => throwErrorMessage("notApplicable"),
  createOrderKyberswap: async () => throwErrorMessage("notApplicable"),
  createOrderTraderJoe: async () => throwErrorMessage("notApplicable"),
  createOrderOrca: async () => throwErrorMessage("notApplicable"),


  createOrderUniswapX: async (web3, options) => {
    const filterOptions = options;
    filterOptions.function = "createOrderUniswapX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return validJson;
    }

    let { amountOutMin } = filterOptions;
    const { slippage, deadline, decayEndTime, decayStartTime, from, to, path, amountIn, chainId, } = filterOptions;

    if (Number(decayStartTime) >= Number(decayEndTime)) return throwErrorMessage("invalidBidTime");
    amountOutMin = (slippage === undefined) ? amountOutMin : BigInt(Math.round(amountOutMin - ((slippage / 100) * amountOutMin))).toString();

    const provider = new ethers.providers.JsonRpcProvider(
      web3.currentProvider.host
    );
    const nonceManager = new NonceManager(
      provider,
      chainId
    );
    const nonce = await nonceManager.useNonce(from);
    const builder = new DutchOrderBuilder(chainId);
    const order = builder
      .deadline(deadline)
      .swapper(from)
      .decayEndTime(decayEndTime)
      .decayStartTime(decayStartTime)
      .nonce(BigNumber.from(nonce).add(1))
      .input({
        token: path[0],
        startAmount: BigNumber.from(amountIn),
        endAmount: BigNumber.from(amountIn)
      })
      .output({
        token: path[1],
        startAmount: BigNumber.from(amountOutMin),
        endAmount: BigNumber.from(amountOutMin),
        recipient: to,
      })
      .build();

    const { domain, types, values } = order.permitData();
    const serializedOrder = order.serialize();
    return {
      domain,
      types,
      values,
      serializedOrder,
    };
  },
};
