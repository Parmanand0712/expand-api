const web3 = require('@solana/web3.js');
const token = require('@solana/spl-token')
const { getName, getSymbol, getDecimals, transfer } = require('../../src/expand/fungibleTokens/index');
const {initialiseWeb3} = require('../../common/intialiseWeb3');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));

describe("erc20 tests", () => {

    // test("erc20 transfer for ethereum", async () => {

    //     const result = await transfer(evmWeb3, {
    //         from: '0x6672a7e294aca680BCB2087F446BAe0Dc5A57769',
    //         tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    //         amount: '5', // erc20 token
    //         to: '0xF4f7c657D76E3A26137A99752eAED2941C06b336',
    //         gas: '2307200',
    //         chainId: '1',
    //         // privateKey: 'e730706646b38f80fc016675e9fec8b149148f12b00c4214b313914b708bb863'
    //     });
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });

    test("Solana transfer() ", async () => {
            
                    
                    const phrase = [78, 180, 36, 209, 60, 139, 224, 163, 142, 208, 46, 64, 236, 53, 204, 211, 221, 223, 237, 197, 73, 156, 157, 175, 231, 249, 89, 40, 8, 56, 198, 133, 11, 15, 39, 162, 203, 86, 159, 30, 17, 204, 225, 232, 98, 206, 56, 119, 181, 71, 36, 211, 218, 115, 215, 202, 31, 92, 83, 61, 215, 54, 152, 208];
                    const secret = Uint8Array.from(phrase);
                    const feePayer = web3.Keypair.fromSecretKey(secret);
                    connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
                    const options={};
                    options.token = 'AoAH8NBws97Fn4QFt9wpThBPzaTZt6aYqFqepTji3yT6';
                    options.feePayer = 'kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq';
                    account = await token.getAssociatedTokenAddress(new web3.PublicKey(options.token), new web3.PublicKey(options.feePayer));
                    console.log(account.toBase58());
                    options.sender = account.toBase58();
                    options.destination = 'BYuayR6tLEAhsskH1ssxKohaZHqvGnYmFqbhu6SdQKyJ';
                    destination = await token.getOrCreateAssociatedTokenAccount(connection , feePayer,new web3.PublicKey(options.token), new web3.PublicKey(options.destination));
                    console.log(destination.address.toBase58());// ).address.toBase58())
                    options.destination= destination.address.toBase58();
                    options.amount = 100;
                    options.chainName = 'Solana';
                    options.chainId = '901';
                    options.decimals = '9';
                    const tx = await transfer(connection,options);
                    console.log(tx);
                    console.log(await web3.sendAndConfirmTransaction(connection,tx,[feePayer]))
                    
    });
    jest.setTimeout(500000);


});
