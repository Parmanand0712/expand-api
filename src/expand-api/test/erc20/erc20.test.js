const request = require('supertest')
const axios = require('axios');


const baseUrl = 'http://localhost:3000';
let config = {};

describe("GET ERC20 /erc20/", () => {

    test("ERC20 getName", async () => {
        config.params = {
            chainId: "56",
            tokenAddress: "0x55d398326f99059fF775485246999027B3197955"
        }
        const response = await axios.get(baseUrl+"/fungibletoken/getname/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("ERC20 getSymbol", async () => {
        config.params = {
            tokenAddress: "0x55d398326f99059fF775485246999027B3197955",
            chainSymbol: 'BSC'
        }
        const response = await axios.get(baseUrl+"/fungibletoken/getsymbol/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("ERC20 getDecimals", async () => {
        config.params = {
            chainSymbol: 'BSC',
            tokenAddress: "0x55d398326f99059fF775485246999027B3197955"
        }
        const response = await axios.get(baseUrl+"/fungibletoken/getdecimals/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    jest.setTimeout(30000);

})