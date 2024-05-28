const { getPool, getUserPositions, getUserAccountData } = require('../../src/expand/lendBorrow/index');
const EvmWeb = require('web3');
const web3 = new EvmWeb(new EvmWeb.providers.HttpProvider('https://aged-bold-general.quiknode.pro/aca755115e18fb7c58c55a9e7c1af78e55e9cde2/'));

describe("LendBorrow tests", () => {
   
    test("get UserPositions Aavev2", async () => {
        const result = await getUserPositions(web3,{
                "address": "0x6Fb447Ae94F5180254D436A693907a1f57696900"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    test("get UserPositions Aavev3", async () => {
        const result = await getUserPositions(web3,{
                "address": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
                "lendborrowId": "1200"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    test("get UserPositions compund", async () => {
        const result = await getUserPositions(web3,{
                "address": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
                "lendborrowId": "1100"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    test("get UserPositions compundv3", async () => {
        const result = await getUserPositions(web3,{
                "address": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
                "lendborrowId": "1100"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("get getuseraccountdata", async () => {
        const result = await getUserAccountData(web3,{
                "address": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
                "lendborrowId": "1000",
                "asset": "0x6b175474e89094c44da98b954eedeac495271d0f"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    test("get getpool", async () => {
        const result = await getUserPositions(web3,{
                "lendborrowId": "1000",
                "asset": "0x6b175474e89094c44da98b954eedeac495271d0f"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

});

describe("Negative LendBorrow tests", () => {
   
    test("get UserPositions Aavev2", async () => {
        const result = await getUserPositions(web3,{
                "address": "0xFb447Ae94F5180254D436A693907a1f57696900"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    test("get UserPositions Aavev3", async () => {
        const result = await getUserPositions(web3,{
                "address": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
                "lendborrowId": "1400"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    test("get UserPositions compund", async () => {
        const result = await getUserPositions(web3,{
                "address": "0x6Fb47Ae94F5180254D436A693907a1f57696900",
                "lendborrowId": "1100"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    test("get UserPositions compundv3", async () => {
        const result = await getUserPositions(web3,{
                "address": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
                "lendborrowId": "100"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

});