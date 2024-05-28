const axios = require('axios');


const baseUrl = 'http://localhost:3000';
let config = {};

describe("GET /lendborrow/getrepayamount", () => {

    test("Aave", async () => {
        try{
            config.params = {
                asset: '0xa7c3Bf25FFeA8605B516Cf878B7435fe1768c89b', 
                user: '0x2CAaCea2068312bbA9D677e953579F02a7fdC4A9',
                lendborrowId: '1001',
            }
            const response = await axios.get(baseUrl+"/lendborrow/getrepayamount/", config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
        
    })

    test("Compound", async () => {

        try{
            config.params = {
                lendborrowId: "1100",
                asset: "AAVE"
            }
            const response = await axios.get(baseUrl+"/lendborrow/getpool/",config);
            console.log(response.data);
            expect(response.status).toBe(200);
        } catch(err){
            console.log(err);
        }
    })

    jest.setTimeout(30000);

})