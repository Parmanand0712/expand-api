
const axios = require('axios');




const baseUrl = 'http://localhost:3000';
let config = {};


describe("GET /yieldaggregator/getbalance", () => {
    
    test("get Balance", async () => {
        try{
            config.params = {
                address: '0xE8f9025fbce23e9A2AcC82F8e22DcA16a4BF33a6',
                tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                // vaultNumber: 1,
                // vaultAddress: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
                yieldAggregatorId: '5000'
            }
            const response = await axios.get(baseUrl+"/yieldaggregator/getbalance",config);
            console.log(response.data.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err)
        }
        
    })

    test("get Balance", async () => {

        try{
            config.params = {
                address: '0xE8f9025fbce23e9A2AcC82F8e22DcA16a4BF33a6',
                tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                // vaultAddress: '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e',
                poolAddress: '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e',
                yieldAggregatorId: '5100'
            }
            const response = await axios.get(baseUrl+"/yieldaggregator/getbalance",config);
            console.log(response.data.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
        
    })

    




    jest.setTimeout(30000);

})