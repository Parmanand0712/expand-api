
const axios = require('axios');




const baseUrl = 'http://localhost:3000';
let config = {};


describe("GET /yieldaggregator/getbalance", () => {

    test("get Vault", async () => {
        try{
            config.params = {
                tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                yieldAggregatorId: '5000'
            }
            const response = await axios.get(baseUrl+"/yieldaggregator/getvaults",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err)
        }
    })

    test("get Vault", async () => {
        try{

        } catch(err){
            config.params = {
                tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                yieldAggregatorId: '5100'
            }
            const response = await axios.get(baseUrl+"/yieldaggregator/getvaults",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        }
        
    })
    jest.setTimeout(30000);

})