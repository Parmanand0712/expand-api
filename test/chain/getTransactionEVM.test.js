const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb("https://aged-bold-general.quiknode.pro/aca755115e18fb7c58c55a9e7c1af78e55e9cde2/");
const { getTransaction } = require('../../src/expand/chain/index');

describe("getTransaction Test", () => {
    test("Get transaction for chainId (1) - Positive", async () => {

        const result = await getTransaction(evmWeb3, {
            chainId: '1',
            transactionHash: "0x662db00077c566dd6d754e33770689c47e0f07705538fc39bc9630ec98719d7e"
        });
        console.log(result);
        expect(result).toBeTruthy();
    })
    test("Get transaction for chainId (1013) - Negative", async () => {
      const result = await getTransaction(evmWeb3, {
          chainId: '1013',
          transactionHash: "0x662db00077c566dd6d754e33770689c47e0f07705538fc39bc9630ec98719d7e"
      });
      console.log(result);
      expect(result).toBeTruthy();
  })
  jest.setTimeout(50000)
});