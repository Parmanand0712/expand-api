/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-bitwise */
const {Buffer} = require('buffer');
const {PublicKey} = require('@solana/web3.js');

const empty32Buffer = Buffer.alloc(32);
const PKorNull = (data) => (data.equals(empty32Buffer) ? null : new PublicKey(data));
const MAX_SLOT_DIFFERENCE = 25;

function readBigInt64LE(buffer, offset = 0) {
  const first = buffer[offset];
  const last = buffer[offset + 7];
  // eslint-disable-next-line no-undef
  if (first === undefined || last === undefined) boundsError(offset, buffer.length - 8);
  const val = buffer[offset + 4] + buffer[offset + 5] * 2 ** 8 + buffer[offset + 6] * 2 ** 16 + (last << 24); // Overflow
  return (
    (BigInt(val) << BigInt(32)) + // tslint:disable-line:no-bitwise
    BigInt(first + buffer[++offset] * 2 ** 8 + buffer[++offset] * 2 ** 16 + buffer[++offset] * 2 ** 24)
  );
}

function readBigUInt64LE(buffer, offset = 0) {
  const first = buffer[offset];
  const last = buffer[offset + 7];
  if (first === undefined || last === undefined) boundsError(offset, buffer.length - 8);

  const lo = first + buffer[++offset] * 2 ** 8 + buffer[++offset] * 2 ** 16 + buffer[++offset] * 2 ** 24;

  const hi = buffer[++offset] + buffer[++offset] * 2 ** 8 + buffer[++offset] * 2 ** 16 + last * 2 ** 24;

  return BigInt(lo) + (BigInt(hi) << BigInt(32)); // tslint:disable-line:no-bitwise
}

exports.parseBaseData = async(data) => {
    const Magic = 0xa1b2c3d4;
    // data is too short to have the magic number.
    if (data.byteLength < 4) {
      return undefined;
    }
    const magic = data.readUInt32LE(0);
    if (magic === Magic) {
      // program version
      const version = data.readUInt32LE(4);
      // account type
      const type = data.readUInt32LE(8);
      // account used size
      const size = data.readUInt32LE(12);
      return { magic, version, type, size };
    } else {
      return undefined;
    }
};

exports.parseMappingData = async(data)=> {

  
  // number of product accounts
  const numProducts = data.readUInt32LE(16);

  // read each symbol account
  let offset = 56;
  const productAccountKeys = [];
  for (let i = 0; i < numProducts; i++) {
    const productAccountBytes = data.slice(offset, offset + 32);
    const productAccountKey = new PublicKey(productAccountBytes);
    offset += 32;
    productAccountKeys.push(productAccountKey);
  }
  return {
    productAccountKeys
  };
};

exports.parseProductData = async(data) => {

  ;
  // pyth magic number
  const magic = data.readUInt32LE(0);
  // program version
  const version = data.readUInt32LE(4);
  // account type
  const type = data.readUInt32LE(8);
  // price account size
  const size = data.readUInt32LE(12);
  // first price account in list
  const priceAccountBytes = data.slice(16, 48);
  const priceAccountKey = new PublicKey(priceAccountBytes);
  const product = {} ;
  product.price_account = priceAccountKey.toBase58();
  let idx = 48;
  while (idx < size) {
    const keyLength = data[idx];
    idx++;
    if (keyLength) {
      const key = data.slice(idx, idx + keyLength).toString();
      idx += keyLength;
      const valueLength = data[idx];
      idx++;
      const value = data.slice(idx, idx + valueLength).toString();
      idx += valueLength;
      product[key] = value;
    }
  }
  return {  magic,version,type,size,priceAccountKey, product };

};

const parsePriceInfo = async(data,exponent)=> {
  
  // aggregate price
  const priceComponent = readBigInt64LE(data, 0);
  const price = Number(priceComponent) * 10 ** exponent;
  // aggregate confidence
  const confidenceComponent = readBigUInt64LE(data, 8);
  const confidence = Number(confidenceComponent) * 10 ** exponent;
  // aggregate status
  const status = data.readUInt32LE(16);
  // aggregate corporate action
  const corporateAction = data.readUInt32LE(20);
  // aggregate publish slot. It is converted to number to be consistent with Solana's library interface (Slot there is number)
  const publishSlot = Number(readBigUInt64LE(data, 24));
  return {
    status,
    confidence,
    confidenceComponent,
    corporateAction,
    publishSlot,
    priceComponent,
    price
  };
};

exports.parsePriceData = async(data,currentSlot) => {
  
  
  const exponent = data.readInt32LE(20);

  const productAccountKey = new PublicKey(data.slice(112, 144));

  const aggregate = await parsePriceInfo(data.slice(208, 240), exponent);

  let status = await aggregate.status;
  if (currentSlot && status === 1) {
    if (currentSlot - aggregate.publishSlot > MAX_SLOT_DIFFERENCE) {
      status = "Unknown";
    }
  }

  let price;
  let confidence;
  if (status === 1) {
    price = aggregate.price;
    confidence = aggregate.confidence;
  }

  const priceComponents = [];
  let offset = 240;
  let shouldContinue = true;
  while (offset < data.length && shouldContinue) {
    const publisher = PKorNull(data.slice(offset, offset + 32));
    offset += 32;
    if (publisher) {
      const componentAggregate = parsePriceInfo(data.slice(offset, offset + 32), exponent);
      offset += 32;
      const latest = parsePriceInfo(data.slice(offset, offset + 32), exponent);
      offset += 32;
      priceComponents.push({ publisher, aggregate: componentAggregate, latest });
    } else {
      shouldContinue = false;
    }
  }

  return {
    price,
    status,
    confidence,
    productAccountKey
  };
};
