const request = require('supertest');
const axios = require('axios');

const baseUrl = 'http://localhost:3000';
let config = {};

describe("GET /chain/getstorage", () => {

    test("Ethereum", async () => {
        config.params = {
            chainId: "1",
            address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
        }
        const response = await axios.get(baseUrl+"/chain/getstorage/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("BSC", async () => {
        config.params = {
            chainId: "56",
            address: "0x0000000000000000000000000000000000001000"
        }
        const response = await axios.get(baseUrl+"/chain/getstorage/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Avalanche", async () => {
        config.params = {
            chainId: "43114",
            address: "0x384F35b12dD373D8e9d713da5Fe9E089009d731f"
        }
        const response = await axios.get(baseUrl+"/chain/getstorage/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Polygon", async () => {
        config.params = {
            chainId: "137",
            address: "0x856Ea9da98bc398C5733176f4395B547740959cd"
        }
        const response = await axios.get(baseUrl+"/chain/getstorage/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Cronos", async () => {
        config.params = {
            chainId: "25",
            address: "0x1017c28eA9EfBD13C60e6a0466EAcE1c9459740E"
        }
        const response = await axios.get(baseUrl+"/chain/getstorage/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Arbitrum", async () => {
        config.params = {
            chainId: "42161",
            address: "0x138236a9a3BD8A40Ec8e4aF592e6007f352f6beB"
        }
        const response = await axios.get(baseUrl+"/chain/getstorage/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Fantom", async () => {
        config.params = {
            chainId: "250",
            address: "0x2C1353f961BBDcF89897F38D17e5060d41607165"
        }
        const response = await axios.get(baseUrl+"/chain/getstorage/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Optimism", async () => {
        config.params = {
            chainId: "10",
            address: "0xFC550BAD3c14160CBA7bc05ee263b3F060149AFF",
        }
        const response = await axios.get(baseUrl+"/chain/getstorage/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    jest.setTimeout(30000);

})