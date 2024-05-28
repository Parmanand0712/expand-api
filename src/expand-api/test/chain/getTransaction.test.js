const axios = require('axios');

const baseUrl = 'http://localhost:3000';
let config = {};


describe("GET /chain/gettransaction", () => {

    test("Ethereum", async () => {

        config.params = {
            chainId: "1",
            transactionHash:"0xfff975e7f1b9c43c811b170c090bd7ecf770ab1c957deb89f0d21399b69e7415"
        }

        const response = await axios.get(baseUrl+"/chain/gettransaction/",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("BSC", async () => {

        config.params = {
            chainId: "97",
            transactionHash:"0x37d3550c39f7b79b516fb1985e74be53a64c5b84a846b063a664e6e026ac80a9"
        }

        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        console.log(response.data);
    })

    test("Avalanche", async () => {

        config.params = {
            chainId: "43114",
            transactionHash:"0x50c91e9de9e93adf1fe6df1e01e35101a72fa0e5490588914520db706586dd1c"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        expect(response.status).toBe(200);
    })

    test("Polygon", async () => {

        config.params = {
            chainId: "137",
            transactionHash:"0xe76844ca20a622583f23f93844ed20615cb5191c3346a20032809d73d38b7a63"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        console.log(response);
        expect(response.status).toBe(200);
    })

    test("Cronos", async () => {

        config.params = {
            chainId: "25",
            transactionHash:"0x66afa32f9fdb112fe9dd92c72ed25fd52118c609f1b8e3b669902352bb240aa3"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Arbitrum", async () => {

        config.params = {
            chainId: "42161",
            transactionHash:"0x93e5305e870a58de9b90f2e2d9caa91bc90e8b03c39cd41e5537edf2ac579cda"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Fantom", async () => {

        config.params = {
            chainId: "250",
            transactionHash:"0x55df46f1459b9e5ecc67a434cca710224319ba0d2304c8fcb91c57969e5e98ed"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        console.log(response.data);
        expect(response.status).toBe(200);
    })

    test("Tron", async () => {

        config.params = {
            chainId: "1000",
            transactionHash:"a954f6dabdfefd6ead95d885c2b372a0c4fdf976ac8dd6cdf672e16093f2e460"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        console.log(response);
        expect(response.status).toBe(200);
    })

    test("Optimism", async () => {
        config.params = {
            chainId: "10",
            transactionHash : "0x5b1f90d11bfb86ad338990bdf411f839903dbd888b22471febdbd68e8d8d3e6d"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction/",config);
        console.log("Optimism Response ====>",response);
        expect(response.status).toBe(200);
    })

    test("Solana", async () => {
        config.params = {
            chainId: "900",
            transactionHash:"3rEryabyyQdVPGoLCfwz7nVkNvnh5RGgJzK96614ybtACuFgGdh8QB6KjFY9gw77iTM8BLzzTmiqvCAk8BKuBASG"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        console.log(response);
        expect(response.status).toBe(200);
    })

    test("Near", async () => {
        config.params = {
            chainId: "1200",
            transactionHash:"2tRbpShX9FvT577T9tTJzev3DiDGERssu86c6bVx5tzM"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        console.log("Near Response ====>",response);
        expect(response.status).toBe(200);
    })

    test("Algorand", async () => {

        config.params = {
            chainId: "1300",
            transactionHash:"CFTVQPO6HWOXJSRJGSG7LNCHAWB3FRMYHEODFIMAE7IBVHX4E2FQ",
            connectionType:"idx"
        }
        const response = await axios.get(baseUrl+"/chain/gettransaction",config);
        console.log(response);
        expect(response.status).toBe(200);
    })





    jest.setTimeout(30000);


})