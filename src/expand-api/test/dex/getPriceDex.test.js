const axios = require('axios');


const baseUrl = 'http://localhost:3000';
let config = {};

describe("GET /dex/getprice", () => {

    test("Uniswap V2", async () => {
        try{
            config.params = {
                dexId: "1000",
                path: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0xdAC17F958D2ee523a2206206994597C13D831ec7",
                amountIn: "100000000000000000"
            }
            const response = await axios.get(baseUrl+"/dex/getprice/",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
        
    })

    test("Uniswap V3", async () => {

        try{
            config.params = {
                dexId: "1300",
                path: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0xdAC17F958D2ee523a2206206994597C13D831ec7",
                amountIn: "100000000000000000"
            }
            const response = await axios.get(baseUrl+"/dex/getprice/",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
        
    })

    test("Sushiswap v2", async () => {
        try{
            config.params = {
                dexId: "1100",
                path: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0xdAC17F958D2ee523a2206206994597C13D831ec7",
                amountIn: "100000000000000000"
            }
            const response = await axios.get(baseUrl+"/dex/getprice/",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
        
    })

    test("Pancake V2", async () => {
        try{
            config.params = {
                dexId: "1200",
                path: "0xe9e7cea3dedca5984780bafc599bd69add087d56,0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
                amountIn: "100000000000000000"
            }
            const response = await axios.get(baseUrl+"/dex/getprice/",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
        
    })

    test("Balancer", async () => {
        
        try{
            config.params = {
                dexId: "1400",
                path: ",0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
                amountIn: "100000000000000000"
            }
            const response = await axios.get(baseUrl+"/dex/getprice/",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
        

    })

    

    jest.setTimeout(30000);

})