const config = require('../../common/configuration/config.json');
const baseURL = 'http://localhost:3000';
const axios = require('axios');

describe("CompoundV3 Test Positive Scenario", () => {
    describe("Allow",() => {
        test("Allow" , async() => {

            var transaction = await axios({
                method:"post",
                url:baseURL + '/lendborrow/allow',
                data:{
                    "lendborrowId":"1302",
                    "isAllowed":"true",
                    "manager":"0x69dD076105977c55dC2835951d287f82D54606b4",
                    "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900",
                    "gas":"50000"
                }

        })
            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Borrow",() => {
        test("Borrow" , async() => {

            var transaction = await axios({
                method:"post",
                url:baseURL + '/lendborrow/borrow',
                data:{
                    "lendborrowId":"1302",
                    "amount":"1000000",
                    "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900",
                    "gas":"50000",
                    "gasPriority":"high"
                }

        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Bundle Actions",() => {
        test("BundleActions" , async() => {

            var transaction = await axios({
                method:"post",
                url:baseURL + '/lendborrow/bundleactions',
                data:{
                    "lendborrowId":"1302",
                    "market":"USDC",
                    "actions":["ACTION_SUPPLY_NATIVE_TOKEN" , "ACTION_SUPPLY_NATIVE_TOKEN"],
                    "data":[["0xAec1F48e02Cfb822Be958B68C7957156EB3F0b6e" , "0x6Fb447Ae94F5180254D436A693907a1f57696900" , "00000100000000"] , ["0xAec1F48e02Cfb822Be958B68C7957156EB3F0b6e" , "0x6Fb447Ae94F5180254D436A693907a1f57696900" , "23000000"]],
                    "gas":"500000",
                    "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900"
                }


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Claim Rewards",() => {
        test("claimrewards" , async() => {

            var transaction = await axios({
                method:"post",
                url:baseURL + '/lendborrow/claimrewards',
                data:{
                    "lendborrowId":"1302",
                    "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900",
                    "gas":"5300000"

                }                


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Deposit",() => {
        test("deposit" , async() => {

            var transaction = await axios({
                method:"post",
                url:baseURL + '/lendborrow/deposit',
                data:{
                    "lendborrowId":"1302",
                    "amount":"1000000",
                    "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900",
                    "gas":"50000",
                    "gasPriority":"high",
                    "asset":"0xA6c8D1c55951e8AC44a0EaA959Be5Fd21cc07531"

                }                             


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Get Asset Info",() => {
        test("getassetinfo" , async() => {

            var transaction = await axios({
                method:"get",
                url:baseURL + '/lendborrow/getassetinfo',
                params:{lendborrowId:"1300" , asset:"0xc00e94Cb662C3520282E6f5717214004A7f26888"}                         


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Get Borrow Amount",() => {
        test("getborrowamount" , async() => {

            var transaction = await axios({
                method:"get",
                url:baseURL + '/lendborrow/getborrowamount',
                params:{lendborrowId:"1300" , address:"0x6Fb447Ae94F5180254D436A693907a1f57696900"}                         


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Get Claimed Rewards",() => {
        test("getclaimedrewards" , async() => {

            var transaction = await axios({
                method:"get",
                url:baseURL + '/lendborrow/getclaimedrewards',
                params:{lendborrowId:"1302" , address:"0x6Fb447Ae94F5180254D436A693907a1f57696900"}                         


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Get Max Amounts",() => {
        test("getmaxamounts" , async() => {

            var transaction = await axios({
                method:"get",
                url:baseURL + '/lendborrow/getmaxamounts',
                params:{lendborrowId:"1302" , address:"0x6Fb447Ae94F5180254D436A693907a1f57696900" , asset:"0xA6c8D1c55951e8AC44a0EaA959Be5Fd21cc07531"}                         


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Get Pool",() => {
        test("getpool" , async() => {

            var transaction = await axios({
                method:"get",
                url:baseURL + '/lendborrow/getpool',
                params:{lendborrowId:"1302"}                         


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Get Repay Amount",() => {
        test("getrepayamount" , async() => {

            var transaction = await axios({
                method:"get",
                url:baseURL + '/lendborrow/getrepayamount',
                params:{lendborrowId:"1302" , address:"0x6Fb447Ae94F5180254D436A693907a1f57696900"}                         


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Get User Account Data",() => {
        test("getuseraccountdata" , async() => {

            var transaction = await axios({
                method:"get",
                url:baseURL + '/lendborrow/getuseraccountdata',
                params:{lendborrowId:"1302" , address:"0x6Fb447Ae94F5180254D436A693907a1f57696900"}                         


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Get Governor Data",() => {
        test("getgovernordata" , async() => {

            var transaction = await axios({
                method:"get",
                url:baseURL + '/lendborrow/getgovernordata',
                params:{lendborrowId:"1302" }                         


        })

            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Repay",() => {
        test("Repay" , async() => {

            var transaction = await axios({
                method:"post",
                url:baseURL + '/lendborrow/repay',
                data:{
                    "lendborrowId":"1302",
                    "amount":"1000000",
                    "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900",
                    "gas":"50000",
                    "gasPriority":"high",
                    "market":"USDC"

                }                

        })
            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Transfer",() => {
        test("transfer" , async() => {

            var transaction = await axios({
                method:"post",
                url:baseURL + '/lendborrow/transfer',
                data:{
                    "lendborrowId":"1302",
                    "amount":"1000000",
                    "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900",
                    "gas":"50000",
                    "gasPriority":"high",
                    "to":"0x6Fb447Ae94F5180254D436A693907a1f57696900"

                }


        })
            expect(transaction.data.status).toBe(200);

        })

    })

    describe("Withdraw",() => {
        test("withdraw" , async() => {

            var transaction = await axios({
                method:"post",
                url:baseURL + '/lendborrow/withdraw',
                data:{
                    "lendborrowId":"1302",
                    "amount":"1000000",
                    "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900",
                    "gas":"50000",
                    "gasPriority":"high",
                    "asset":"0xA6c8D1c55951e8AC44a0EaA959Be5Fd21cc07531"

                }                


        })
            expect(transaction.data.status).toBe(200);

        })

    })

    jest.setTimeout(100000);
})

describe("CompoundV3 Test Negative Scenario", () => {
    describe("Allow", () => {
        test("Allow", async () => {

            try {
                var transaction = await axios({
                    method: "post",
                    url: baseURL + '/lendborrow/allow',
                    data: {
                        "lendborrowId": "1302",
                        "isAllowed": "true",
                        "manager": "asd",
                        "from": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
                        "gas": "50000"
                    }

                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
                
            }

        })

    })

    describe("Borrow", () => {
        test("Borrow", async () => {

            try {
                var transaction = await axios({
                    method: "post",
                    url: baseURL + '/lendborrow/borrow',
                    data: {
                        "lendborrowId": "1302",
                        "amount": "1000000",
                        "from": "asd",
                        "gas": "50000",
                        "gasPriority": "high"
                    }

                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    describe("Bundle Actions", () => {
        test("BundleActions", async () => {

            try {
                var transaction = await axios({
                    method: "post",
                    url: baseURL + '/lendborrow/bundleactions',
                    data: {
                        "lendborrowId": "1302",
                        "market": "USDC",
                        "actions": ["ACTION_SUPPLY_NATIVE_TOKEN", "ACTION_SUPPLY_NATIVE_TOKEN"],
                        "data": [["asd", "0x6Fb447Ae94F5180254D436A693907a1f57696900", "00000100000000"], ["0x3EE77595A8459e93C2888b13aDB354017B198188", "0x6Fb447Ae94F5180254D436A693907a1f57696900", "23000000"]],
                        "gas": "500000",
                        "from": "0x6Fb447Ae94F5180254D436A693907a1f57696900"
                    }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    describe("Claim Rewards", () => {
        test("claimrewards", async () => {

            try {
                var transaction = await axios({
                    method: "post",
                    url: baseURL + '/lendborrow/claimrewards',
                    data: {
                        "lendborrowId": "1302",
                        "from": "asd",
                        "gas": "5300000"

                    }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }



        })

    })

    describe("Deposit", () => {
        test("deposit", async () => {

            try {
                var transaction = await axios({
                    method: "post",
                    url: baseURL + '/lendborrow/deposit',
                    data: {
                        "lendborrowId": "1302",
                        "amount": "1000000",
                        "from": "asd",
                        "gas": "50000",
                        "gasPriority": "high",
                        "asset": "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"

                    }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }


        })

    })

    describe("Get Asset Info", () => {
        test("getassetinfo", async () => {

            try {
                var transaction = await axios({
                    method: "get",
                    url: baseURL + '/lendborrow/getassetinfo',
                    params: { lendborrowId: "1300", asset: "asd" }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }


        })

    })

    describe("Get Borrow Amount", () => {
        test("getborrowamount", async () => {

            try {
                var transaction = await axios({
                    method: "get",
                    url: baseURL + '/lendborrow/getborrowamount',
                    params: { lendborrowId: "1300", address: "asd" }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }


        })

    })

    describe("Get Claimed Rewards", () => {
        test("getclaimedrewards", async () => {

            try {
                var transaction = await axios({
                    method: "get",
                    url: baseURL + '/lendborrow/getclaimedrewards',
                    params: { lendborrowId: "1302", address: "asd" }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    describe("Get Max Amounts", () => {
        test("getmaxamounts", async () => {

            try {
                var transaction = await axios({
                    method: "get",
                    url: baseURL + '/lendborrow/getmaxamounts',
                    params: { lendborrowId: "1302", address: "asd", asset: "0x42a71137C09AE83D8d05974960fd607d40033499" }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    describe("Get Pool", () => {
        test("getpool", async () => {

            try {
                var transaction = await axios({
                    method: "get",
                    url: baseURL + '/lendborrow/getpool',
                    params: { lendborrowId: "1302" }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    describe("Get Repay Amount", () => {
        test("getrepayamount", async () => {

            try {
                var transaction = await axios({
                    method: "get",
                    url: baseURL + '/lendborrow/getrepayamount',
                    params: { lendborrowId: "1302", address: "asd" }


                })
            } catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    describe("Get User Account Data", () => {
        test("getuseraccountdata", async () => {

            try {
                var transaction = await axios({
                    method: "get",
                    url: baseURL + '/lendborrow/getuseraccountdata',
                    params: { lendborrowId: "1302", address: "asd" }


                })
            } catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }


        })

    })

    describe("Get Governor Data", () => {
        test("getgovernordata", async () => {

            try {
                var transaction = await axios({
                    method: "get",
                    url: baseURL + '/lendborrow/getgovernordata',
                    params: { lendborrowId: "1302" }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    describe("Repay", () => {
        test("Repay", async () => {

            try {
                var transaction = await axios({
                    method: "post",
                    url: baseURL + '/lendborrow/repay',
                    data: {
                        "lendborrowId": "1302",
                        "amount": "1000000",
                        "from": "asd",
                        "gas": "50000",
                        "gasPriority": "high",
                        "market": "USDC"

                    }

                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    describe("Transfer", () => {
        test("transfer", async () => {

            try {
                var transaction = await axios({
                    method: "post",
                    url: baseURL + '/lendborrow/transfer',
                    data: {
                        "lendborrowId": "1302",
                        "amount": "1000000",
                        "from": "asd",
                        "gas": "50000",
                        "gasPriority": "high",
                        "to": "0x6Fb447Ae94F5180254D436A693907a1f57696900"

                    }


                })
            } catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    describe("Withdraw", () => {
        test("withdraw", async () => {

            try {
                var transaction = await axios({
                    method: "post",
                    url: baseURL + '/lendborrow/withdraw',
                    data: {
                        "lendborrowId": "1302",
                        "amount": "1000000",
                        "from": "asd",
                        "gas": "50000",
                        "gasPriority": "high",
                        "asset": "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"

                    }


                })
            }
            catch (err) {
                expect(err.response.data.status).toBe(400);
               
            }

        })

    })

    jest.setTimeout(100000);
})
