const request = require('supertest')
const axios = require('axios');

const baseUrl = 'http://localhost:3000';
let config = {};

describe("GET /chain/getblock", () => {

    test("Ethereum", async () => {
        config.params = {
            blockNumber: "15526575"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("BSC", async () => {
        config.params = {
            chainId: "56",
            blockNumber: "22478376"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Avalanche", async () => {
        config.params = {
            chainId: "43114",
            blockNumber: "21514123"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Polygon", async () => {
        config.params = {
            chainId: "137",
            blockNumber: "33048914"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Cronos", async () => {
        config.params = {
            chainId: "25",
            blockNumber: "4612602"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Arbitrum", async () => {
        config.params = {
            chainId: "42161",
            blockNumber: "24395003"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Fantom", async () => {
        config.params = {
            chainId: "250",
            blockNumber: "46872525"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Tron", async () => {
        config.params = {
            chainId: "1000",
            blockNumber: "44161665"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Optimism", async () => {
        config.params = {
            chainId: "10",
            blockNumber : "222296"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("solana", async () => {
        config.params = {
            chainId: "900",
            blockNumber: "150467956"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Near", async () => {
        config.params = {
            chainId: "1200",
            blockNumber: "74064480"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Algorand", async () => {
        config.params = {
            chainId: "1301",
            blockNumber: "23797889",
            connectionType: "idx"
        }
        const response = await axios.get(baseUrl+"/chain/getblock/",config);
        console.log('-------',response.data);
        expect(response.status).toBe(200);
    })

    jest.setTimeout(30000);


})