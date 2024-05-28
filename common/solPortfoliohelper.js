const anchor = require("@project-serum/anchor");
const { Metadata } = require("@metaplex-foundation/mpl-token-metadata");
// const tokenSol = require('@solana/spl-token');
const solana = require('@solana/web3.js');
const { default: axios } = require('axios');
const config = require('./configuration/config.json');
const errorMessage = require("./configuration/errorMessage.json");

// const instance = axiosRateLimit(axios.create(), {
//     maxRequests: 30,  // maximum number of requests in the given time period
//     perMilliseconds: 60 * 1000,  // time period in milliseconds
// });

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(config.nonFungibleToken.meta);            // "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

const getBalanceSolana = async (solanaWeb3, address, tokenDetails) => {
    /*
     * Function will fetch the balance for given wallet from solana
     */
    const tokenAddress = tokenDetails ? tokenDetails.token : null;
    const tokenName = tokenDetails ? tokenDetails.name : null;
    const tokenSymbol = tokenDetails ? tokenDetails.symbol : null;
    const message = tokenDetails ? tokenDetails.message : null;
    let usdPrice = "0";
    const response = {};
    if (message) {
        response.name = "NA";
        response.symbol = "NA";
        response.balance = "NA";
        response.message = message;
        response.address = tokenAddress;
        response.USDPrice = "NA";
        return (response);
    }

    let solanaAddress;
    try {
        solanaAddress = new solana.PublicKey(address);
    } catch (error) {
        return throwErrorMessage("invalidUserAddress");
    }

    let balance = null;
    let decimals = null;
    if (tokenAddress === null) {

        balance = await solanaWeb3.getBalance(solanaAddress);
    } else {

        try {
            const tokenAccount = await solanaWeb3.getTokenAccountsByOwner(new solana.PublicKey(solanaAddress),
                { mint: new solana.PublicKey(tokenAddress) });
            balance = 0;
            for await (const account of tokenAccount.value) {
                try {
                    const data = await solanaWeb3.getTokenAccountBalance(account.pubkey);
                    if (!decimals)
                        decimals = (data) ? data?.value?.decimals.toString() : null;
                    balance += parseInt((data) ? data.value.amount : 0);
                } catch (error) {
                    balance += 0;
                }
            }
        } catch (error) {
            console.log(error);
        }

        const conf = {
            method: 'get',
            url: config.coinMarketCap.priceConversionUrl,
            headers: {
                'X-CMC_PRO_API_KEY': process.env.coinMarketCap
            },
            params: { 'amount': '1', "symbol": tokenSymbol, convert: 'usd' }
        };


        try {
            usdPrice = await axios.request(conf);
            usdPrice = usdPrice ? usdPrice.data ? usdPrice.data.data[0] ? usdPrice.data.data[0].quote ?
                usdPrice.data.data[0].quote.USD.price.toString() : "NA" : "NA" : "NA" : "NA";
        } catch (error) {
            usdPrice = null;
        }

    }
    response.name = tokenName;
    response.symbol = tokenSymbol;
    response.balance = balance.toString();
    response.address = tokenAddress;
    if (decimals)
        response.decimals = decimals;
    if (usdPrice)
        response.USDPrice = usdPrice;
    return (response);

};

const getSolMetadata = async (Connection, options) => {
    /*
        * Function will get  metadata: Name
    */
    try {

        const publickey = new anchor.web3.PublicKey(config.solanaDefaultAddress);


        const provider = new anchor.AnchorProvider(
            new anchor.web3.Connection(Connection._rpcEndpoint),
            new anchor.Wallet(publickey),
            { commitment: "confirmed" }
        );

        const mint = new anchor.web3.PublicKey(
            options.token
        );

        const [metadataPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mint.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
        );


        const accInfo = await provider.connection.getAccountInfo(metadataPDA);

        const metadata = Metadata.deserialize(accInfo.data, 0);

        let { name } = metadata[0].data;
        let { symbol } = metadata[0].data;

        let byteSequence = Buffer.from(name, 'utf8');
        name = byteSequence.toString('utf8').replace(/\0/g, '');

        byteSequence = Buffer.from(symbol, 'utf8');
        symbol = byteSequence.toString('utf8').replace(/\0/g, '');

        return {
            name,
            symbol,
            token: options.token
        };

    } catch (error) {
        return {
            name: "NA",
            symbol: "NA",
            message: errorMessage.error.message.invalidSPLToken,
        };

    }

};

const processSPL = async (splData) => {
    const splBalances = [];
    for (const element of splData) {
        splBalances.push({
            "name": element.content.metadata.name || element.token_info?.symbol || "NA",
            "symbol": element.content.metadata?.symbol || element.token_info?.symbol || "NA",
            "assetType": element.token_info?.decimals?.toString() === "0" ? "NonFungibleToken" : element.interface,
            "balance": element.token_info?.balance?.toString(),
            "address": element.id,
            "decimals": element.token_info?.decimals?.toString(),
            "USDPrice": element.token_info?.price_info?.price_per_token?.toString() || "NA",
            "compression": (element?.compression.compressed)?(element?.compression):element?.lamp,
            "mint_extensions": element?.mint_extensions
        });
    }
    return splBalances;
};

module.exports = {
    getBalanceSolana,
    getSolMetadata,
    processSPL
};


