const axios = require('axios');

const baseUrl = 'https://uat.expand.network';
const localhost = 'http://localhost:3000';
let config = {};

describe("/stablecoin/ ", () => {

    test("USDT", async () => {
        try{
            config.params = {
                asset : "UsDt"
            }
            const response = await axios.get(localhost+"/stablecoin/getprice",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
        

        jest.setTimeout(30000)
    })

    test("USDC", async () => {
        try{
            config.params = {
                asset : "uSdC"
            }
            const response = await axios.get(localhost+"/stablecoin/getprice",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
        

        jest.setTimeout(30000)
    })
    
})

