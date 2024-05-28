const request = require('supertest');
const axios = require('axios');

const baseUrl = 'http://localhost:3000';
let config = {};


describe("GET /chain/getgasprice", () => {

    test("Ethereum", async () => {
        config.params = {
            chainId: "1"
        }
        const response = await axios.get(baseUrl+"/chain/getgasprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("BSC", async () => {
        config.params = {
            chainId: "56"
        }
        const response = await axios.get(baseUrl+"/chain/getgasprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Avalanche", async () => {
        config.params = {
            chainId: "43114"
        }
        const response = await axios.get(baseUrl+"/chain/getgasprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Polygon", async () => {
        config.params = {
            chainId: "137"
        }
        const response = await axios.get(baseUrl+"/chain/getgasprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Cronos", async () => {
        config.params = {
            chainId: "25"
        }
        const response = await axios.get(baseUrl+"/chain/getgasprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Arbitrum", async () => {
        config.params = {
            chainId: "42161"
        }
        const response = await axios.get(baseUrl+"/chain/getgasprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Fantom", async () => {
        config.params = {
            chainId: "250"
        }
        const response = await axios.get(baseUrl+"/chain/getgasprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Optimism", async () => {
        config.params = {
            chainId: "10",
        }
        const response = await axios.get(baseUrl+"/chain/getgasprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Near", async () => {
        config.params = {
            chainId: "1200"
        }
        const response = await axios.get(baseUrl+"/chain/getgasprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })


    jest.setTimeout(30000);

})