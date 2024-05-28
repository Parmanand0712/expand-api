const request = require('supertest')
const axios = require('axios');

const baseUrl = 'http://localhost:3000';
let config = {};

describe("GET /chain/getbalance", () => {

    test("Ethereum", async () => {
        config.params = {
            address: "0xE8D1CDB47baC64d5564248ffACca0Fad439115bF"
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("BSC", async () => {
        config.params = {
            chainId: "56",
            address: "0xC57747Fb0a9D4c2bfa3b8dc59A9C053A5f86a902"
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Avalanche", async () => {
        config.params = {
            chainId: "43114",
            address: "0x79ea98916E6bFc555A0a088658025C67A2FecD64"
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Polygon", async () => {
        config.params = {
            chainId: "137",
            address: "0x06B80557170aAD5CD3fdC6D5d96C0Fe8123f7f44"
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Cronos", async () => {
        config.params = {
            chainId: "25",
            address: "0x3d83e3b60f569E2A8834FdAf6bd3e86147AB3e06",
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Arbitrum", async () => {
        config.params = {
            chainId: "42161",
            address: "0x236CcbFC6C9C4a078D21eBdd44b92DB7dDbc735b",
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Fantom", async () => {
        config.params = {
            chainId: "250",
            address: "0x431e81E5dfB5A24541b5Ff8762bDEF3f32F96354",
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Tron", async () => {
        config.params = {
            chainId: "1000",
            address: "TScVwVTjqoqPEJ6atnvGCtErWnCyNbzmUL",
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Optimism", async () => {
        config.params = {
            chainId: "10",
            address: "0x17061cc8eb8c39ae263b5b7d0477714ee03f809f",
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("solana", async () => {
        config.params = {
            chainId: "900",
            address: "aK2dDzV4B5kyxNrF9C5mwNP3yZJMHKeSSUe8LbuZhJY",
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Near", async () => {
        config.params = {
            chainId: "1200",
            address: "operator.meta-pool.near",
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Algorand", async () => {
        config.params = {
            chainId: "1301",
            address: "GMO7N35PGI476TB5HEUBKMC5ENF4YAS22FUWCMVKGO47LAE4LPF6HNONFI",
        }
        const response = await axios.get(baseUrl+"/chain/getbalance/",config);
        console.log('-------',response.data);
        expect(response.status).toBe(200);
    })

    jest.setTimeout(30000);
})