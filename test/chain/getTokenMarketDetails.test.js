
const axios = require('axios');


describe("getTokenMarketDataTest", () => {

    test("gettokemarketData Positive Scenario", async () => {

        
        const result = await axios.get('http://localhost:3000/chain/gettokenmarketdata', {params:{
            asset:"LINK"
        }});
      
        expect(result.data.status).toBe(200);
    });

    test("gettokemarketData Negative Scenario", async () => {
        try {
            var transaction = await axios({
                method: "get",
                url:  'http://localhost:3000/chain/gettokenmarketdata',
                params: { asset: "Lisk" }


            })
        }
        catch (err) {
            expect(err.response.data.status).toBe(400);
           
        }

        
       
    });

});
