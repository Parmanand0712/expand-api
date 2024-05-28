const request = require('supertest')
const axios = require('axios');


const baseUrl = 'http://localhost:3000';
let config = {};

describe("GET ERC20 /fungibletoken/getAllowance", () => {

    test("ERC20 getAllowance", async () => {
        config.params = {
            tokenAddress:'0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33',
            chainId: '5',
            owner: '0x902c3bdF5c0d54fB0eC901AFF8293f14750c6d45',
            spender: '0x4bd5643ac6f66a5237e18bfa7d47cf22f1c9f210'
        }
        const response = await axios.get(baseUrl+"/fungibletoken/getallowance/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

   
    

    jest.setTimeout(30000);

})