const {getApproved} = require('../../src/expand/nonFungibleToken/index');
const {initialiseWeb3} = require('../../common/intialiseWeb3');

describe('erc 721',()=>{
    test('getApproved' , async() => {
        evmWeb3 = await initialiseWeb3({
            chainId:'5'//,chainName:'Evm'
        })

        const result = await getApproved(evmWeb3,{
            contractAddress: '0xf86ee4c21be45daa7d6f7f76a928f37c171c1ed7',
            tokenId: '0',
            // chainSymbol: 'TETHGRL'
            chainId: '5',
        }).then(res => console.log(res))
    });

    jest.setTimeout(50000)
})