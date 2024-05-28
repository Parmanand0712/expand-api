module.exports = {
  getABIFile : async (pool='') => {
    const filePath = `../assets/abis/${pool}.json`;
    // eslint-disable-next-line import/no-dynamic-require
    const object = require(filePath);
    return object;
  }
};