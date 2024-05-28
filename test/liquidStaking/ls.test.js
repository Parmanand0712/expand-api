const { stake, claim, withdraw, approveWithdrawals, increaseAllowance, decreaseAllowance, unwrap, wrap} = require('../../src/expand/liquidStaking/index');
const EvmWeb = require('web3');
const web3 = new EvmWeb(new EvmWeb.providers.HttpProvider('https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'));

describe("Lido tests", () => {
   
    test("stake Lido", async () => {
        const result = await stake(web3,{
    
                "value": "1000000",
                "referrer": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
                "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
                "gas": "1221"
            
            });
        console.log(result);
        // expect(result).toBeTruthy();
        expect(result.chainId).toBeTruthy();

    });
    jest.setTimeout(30000);

    test("reqWithdrawal", async () => {
        const result = await withdraw( web3, {
        "liquidStakingId": "11155111",
        "amount": "1000000",
        "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
        "ownerAddress": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
        "gas": "40000000"
        });
        console.log(result);
        expect(result.chainId).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("claim", async () => {
        const result = await claim( web3, {
            "liquidStakingId": "11155111",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            "requestId": "7"
        
        });
        console.log(result);
        expect(result.chainId).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("approveWithdrawals", async () => {
        const result = await approveWithdrawals( web3, {
            "liquidStakingId": "11155111",
            "amount": "1000000",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000"
        
        });
        console.log(result);
        expect(result.chainId).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("wrap", async () => {
        const result = await wrap( web3,{
            "liquidStakingId": "11155111",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            "amount": "100000"
        });
        console.log(result);
        expect(result.chainId).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("unwrap", async () => {
        const result = await unwrap( web3,{
            "liquidStakingId": "11155111",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            "amount": "100000"
        });
        console.log(result);
        expect(result.chainId).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("increaseAllowance", async () => {
        const result = await increaseAllowance( web3,{
            "liquidStakingId": "1",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            "addedValue": "100000",
            "spender": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
            "tokenAddress": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
        
        });
        console.log(result);
        expect(result.chainId).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("decreaseAllowance", async () => {
        const result = await decreaseAllowance( web3,{
            "liquidStakingId": "1",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            "subtractedValue": "100000",
            "spender": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
            "tokenAddress": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
        
        });
        console.log(result);
        expect(result.chainId).toBeTruthy();
    });
    jest.setTimeout(30000);

});

describe("Lido tests Negative", () => {
   
    test("stake Lido", async () => {
        const result = await stake(web3,{
    
                "value": "1000000",
                "referrer": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b",
                "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
                "gas": "40000000"
            
            });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("reqWithdrawal", async () => {
        const result = await withdraw( web3, {
        "liquidStakingId": "11155111",
        // "value": "1000000",
        "ownerAddress": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
        "gas": "40000000"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("claim", async () => {
        const result = await claim( web3, {
            "liquidStakingId": "4",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            "requestId": "7"
        
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("approveWithdrawals", async () => {
        const result = await approveWithdrawals( web3, {
            "liquidStakingId": "11155111",
            "value": "1000000",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b",
            "gas": "40000000"
        
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("wrap", async () => {
        const result = await wrap( web3,{
            "liquidStakingId": "11155111",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            // "amount": "100000"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("unwrap", async () => {
        const result = await unwrap( web3,{
            "liquidStakingId": "11155111",
            // "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            "amount": "100000"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("increaseAllowance", async () => {
        const result = await increaseAllowance( web3,{
            "liquidStakingId": "11155111",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            // "addedValue": "100000",
            "spender": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
            "tokenAddress": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
        
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("decreaseAllowance", async () => {
        const result = await decreaseAllowance( web3,{
            "liquidStakingId": "11155111",
            "from": "0x747b11E5AaCeF79cd78C78a8436946b00dE30b97",
            "gas": "40000000",
            // "subtractedValue": "100000",
            "spender": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
            "tokenAddress": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
        
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

})
