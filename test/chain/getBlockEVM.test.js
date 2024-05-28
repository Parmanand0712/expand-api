const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb("https://aged-bold-general.quiknode.pro/aca755115e18fb7c58c55a9e7c1af78e55e9cde2/");
const { getBlock } = require('../../src/expand/chain/index');

describe("getBlock Test", () => {
    test("Get Block for chainId (1) - Positive", async () => {

        const result = await getBlock(evmWeb3, {
            chainId: '1'
        });
        console.log(result);
        expect(result).toBeTruthy();
    })
    test("Get Block for chainId (101) - Negative", async () => {
      const result = await getBlock(evmWeb3, {
          chainId: '101'
      });
      console.log(result);
      expect(result).toBeTruthy();
  })
  jest.setTimeout(8000000)
});