const {isApprovedForAll} = require('../../src/expand/nonFungibleToken/index');
const {initialiseWeb3} = require('../../common/intialiseWeb3');

describe('erc 721',()=>{
    test('isApprovedForAll' , async() => {
        evmWeb3 = await initialiseWeb3({
            chainId:'5',chainName:'Evm'
        })

        const result = await isApprovedForAll(evmWeb3,{
            contractAddress: '0xf86ee4c21be45daa7d6f7f76a928f37c171c1ed7',
            ownerAddress: '0x731FDBd6871aD5cD905eE560A84615229eD8197a',
            operatorAddress: '0x8e7D7a97b4aa8B6D857968058A03cd25707Ed025',
            chainId:"5"
        }).then(res => console.log(res))
    });

    jest.setTimeout(50000)
})