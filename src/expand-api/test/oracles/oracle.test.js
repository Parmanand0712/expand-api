const axios = require('axios');


const baseUrl = 'https://uat.expand.network';
const localhost = 'http://localhost:3000';
let config = {};

describe("/oracle/getprice with oracleName", () => {

    test("200 status code - default oracleId", async () => {
        config.params = {
            asset : 'BTC'
        }
        const response = await axios.get(localhost+"/oracle/getprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("200 status code-ChainLink", async () => {
        config.params = {
            asset : 'BTc',
            oracleName : 'ChainLink'
        }
        const response = await axios.get(localhost+"/oracle/getprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })
    
    test("200 status code-WinkLink", async () => {
        config.params = {
            asset : 'BTC',
            oracleName : 'WinkLink'
        }
        const response = await axios.get(localhost+"/oracle/getprice/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    jest.setTimeout(30000);

})