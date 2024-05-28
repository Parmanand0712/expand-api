
module.exports ={
    PORT : process.env.PORT,
    apiKey : process.env.API_KEY,

    functionHashToParamsEvm: {
        '0xb6f9de95': ['uint256', 'address[]', 'address', 'uint256'],
        '0x18cbafe5': ['uint256','uint256', 'address[]', 'address', 'uint256'],
        '0x7ff36ab5': ['uint256', 'address[]', 'address', 'uint256'],
        '0xfb3bdb41': ['uint256', 'address[]', 'address', 'uint256'],
        '0x38ed1739': ['uint256','uint256','address[]', 'address', 'uint256'],
        '0x791ac947': ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
        '0x5c11d795': ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
        '0x8803dbee': ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
        '0x4a25d94a': ['uint256', 'uint256', 'address[]', 'address', 'uint256']
    },
    
    dexFunctionHashEvm: [ '0xb6f9de95', '0x18cbafe5', '0x7ff36ab5', '0xfb3bdb41', '0x38ed1739', '0x791ac947',
    '0x5c11d795', '0x8803dbee', '0x4a25d94a']
};