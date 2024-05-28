const { Horizon } = require('stellar-sdk');
const { getPrice, getLiquidity, getPoolLiquidity, getTokenLiquidity, getTokenHolder, swap, addLiquidity, removeLiquidity } = require('../../src/expand/dex/index');
const web3 = new Horizon.Server("https://horizon.stellar.org/");

describe("Stellar DEX Tests", () => {
  test("getPrice() Test", async () => {
    const result = await getPrice(web3, {
      'dexId': '2400',
      "amountIn": "120000000",
      "tokenInCode": "yUSDC",
      "tokenOutCode": "XLM",
      "tokenInIssuer": "GDGTVWSM4MGS4T7Z6W4RPWOCHE2I6RDFCIFZGS3DOA63LWQTRNZNTTFF"
    });
    console.log(result);
    expect(result).toBeTruthy();
  });
  test("getUserLiquidity() Test", async () => {
    const result = await getLiquidity(web3, {
      "tokenAIssuer": "GDPJALI4AZKUU2W426U5WKMAT6CN3AJRPIIRYR2YM54TL2GDWO5O2MZM",
      "address": "GDLOF7T2R4KG5MGJFVAGUZSHI56RPICDB6RT3YJH4K5S6URUTT4GLOYL",
      "dexId": "2400",
      "tokenBCode": "USDC",
      "tokenACode": "BTC",
      "tokenBIssuer": "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
    });
    console.log(result);
    expect(result).toBeTruthy();
  });
  test("getPoolLiquidity() Test", async () => {
    const result = await getPoolLiquidity(web3, {
      'dexId': '2400',
      'poolAddress': "fffe949fa72b0957b381229a39a74a11add3a563b1f6a50b05a161ee622d2e81"
    });
    console.log(result);
    expect(result).toBeTruthy();
  });
  test("getTokenLiquidity() Test", async () => {
    const result = await getTokenLiquidity(web3, {
      'dexId': '2400',
      'poolAddress': "fffe949fa72b0957b381229a39a74a11add3a563b1f6a50b05a161ee622d2e81"
    });
    console.log(result);
    expect(result).toBeTruthy();
  });
  test("getTokenHolders() Tst", async () => {
    const result = await getTokenHolder(web3, {
      'dexId': '2400',
      'poolAddress': "fffe949fa72b0957b381229a39a74a11add3a563b1f6a50b05a161ee622d2e81"
    });
    console.log(result);
    expect(result).toBeTruthy();
  });

  test("swap() Test", async () => {
    const result = await swap(web3, {
      "tokenOutCode": "USDC",
      "tokenInCode": "XLM",
      "tokenOutIssuer": "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      "amountIn": "2000",
      "amountOutMin": "12",
      "from": "GBZWXTV66FIXOLM7TINV2H4LD2HSDS6ZK3FANGVK6YCAFBGEN52T7E2I",
      "slippage": "10",
      "dexId": "2400"
    }
    );
    console.log(result);
    expect(result).toBeTruthy();
  });
  test("addLiquidity() Test", async () => {
    const result = await addLiquidity(web3, {
      "dexId": "2400",
      "amountADesired": "20",
      "amountBDesired": "10",
      "from": "GBZWXTV66FIXOLM7TINV2H4LD2HSDS6ZK3FANGVK6YCAFBGEN52T7E2I",
      "tokenBCode": "USDC",
      "tokenACode": "XLM",
      "tokenBIssuer": "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
    });
    console.log(result);
    expect(result).toBeTruthy();
  });
  test("removeLiquidity() Test", async () => {
    const result = await removeLiquidity(web3, {
      "dexId": "2400",
      "from": "GBZWXTV66FIXOLM7TINV2H4LD2HSDS6ZK3FANGVK6YCAFBGEN52T7E2I",
      "tokenBCode": "USDC",
      "tokenACode": "XLM",
      "tokenBIssuer": "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      "liquidity": "3000000",
      "amountAMin": "32",
      "amountBMin": "32"
    });
    console.log(result);
    expect(result).toBeTruthy();
  });
  jest.setTimeout(30000);
});
