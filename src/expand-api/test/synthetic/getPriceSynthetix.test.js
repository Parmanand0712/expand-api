const axios = require('axios');


const baseUrl = 'https://uat.expand.network';
const localhost = 'http://localhost:3000';
let config = {};


describe("/getsyntheticprice Synthetix get price", () => {

    test("200 status code ", async () => {
        try{
            config.params = {
                amount : '10000000'
            }
            const response = await axios.get(localhost+"/synthetic/getprice",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        }catch(err){
            console.log(err);
        }
        
    })
    

    jest.setTimeout(30000);

})