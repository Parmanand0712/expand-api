/* eslint-disable no-unused-expressions */
const TonWeb = require('tonweb');

const AddressConstructor = TonWeb.Address;
const JettonConstructor = TonWeb.token.jetton.JettonMinter;
const CellConstructor = TonWeb.boc.Cell;
const BNConstructor = TonWeb.utils.BN;
// const cell = new CellConstructor();
// const secondcell = new CellConstructor();
const { bytesToBase64 } = TonWeb.utils;
const W = (o, s, t) => {
    let e = BigInt(0);
    for (let n = 0; n < t; n += 1) {
        e *= BigInt(2);
        e += BigInt(o.get(s + n));
    }
    return e;
};

const tonAddressParser = (o) => {
    try {
        let s = W(o.bits, 3, 8);
        s > BigInt(127) && (s -= BigInt(256));
        const t = W(o.bits, 3 + 8, 256);
        if (`${s.toString(10)}:${t.toString(16)}` === "0:0")
            return null;
        const e = `${s.toString(10)}:${t.toString(16).padStart(64, "0")}`;
        return new TonWeb.Address(e);
    } catch (err) {
        return null;
    }
};



const payloadModifier = async(swapTxParams) => {
const byteArray = Array.from(await swapTxParams.toBoc());
const binaryString = String.fromCharCode.apply(null, byteArray) ;
const base64Encoded = btoa(binaryString) ;

return base64Encoded;
};

module.exports = {AddressConstructor , JettonConstructor ,CellConstructor  , bytesToBase64 , BNConstructor ,tonAddressParser ,payloadModifier};