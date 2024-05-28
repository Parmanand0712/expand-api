const { initialiseWeb3 } = require('../../common/intialiseWeb3');
const config = require('../../common/configuration/config.json');
const { issueAsset, transferAsset, freezeAsset, setTrustline, burnAsset } = require('../../src/expand/realWorldAsset');


describe('Stellar RWA Testing - Positive', () => {
  test('issue asset', async () => {
    web3 = await initialiseWeb3({ chainId: '1501' })
    const transaction = await issueAsset(web3, {
      "chainId": "1501",
      "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LHT",
      "assetCode": "ExpandDollar",
      "amount": "54",
      "to": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO"
    });
    console.log(transaction);
    expect(transaction).toBeTruthy();
  }),
    test('burn asset', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await burnAsset(web3, {
        "chainId": "1501",
        "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LHT",
        "assetCode": "ExpandDollar",
        "amount": "54",
        "from": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    test('transfer asset', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await transferAsset(web3, {
        "chainId": "1501",
        "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LHT",
        "assetCode": "ExpandDollar",
        "amount": "54",
        "from": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO",
        "to": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    test('freeze asset', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await freezeAsset(web3, {
        "chainId": "1501",
        "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LHT",
        "assetCode": "ExpandDollar",
        "user": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    test('setTrustline', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await setTrustline(web3, {
        "chainId": "1501",
        "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LHT",
        "assetCode": "ExpandDollar",
        "amount": "54",
        "from": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    })
  jest.setTimeout(5000)
})

describe('Stellar RWA Testing - Negative', () => {
  test('issue asset', async () => {
    web3 = await initialiseWeb3({ chainId: '1501' })
    const transaction = await issueAsset(web3, {
      "chainId": "1501",
      "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LH",
      "assetCode": "ExpandDollar",
      "amount": "54",
      "to": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO"
    });
    console.log(transaction);
    expect(transaction).toBeTruthy();
  }),
    test('burn asset', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await burnAsset(web3, {
        "chainId": "1501",
        "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LHT",
        "assetCode": "ExpandDollar",
        "amount": "54",
        "from": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MXYXFMCO"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    test('transfer asset', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await transferAsset(web3, {
        "chainId": "1501",
        "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LH",
        "assetCode": "ExpandDollar",
        "amount": "54",
        "from": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO",
        "to": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    test('freeze asset', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await freezeAsset(web3, {
        "chainId": "1501",
        "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONEN6LHT",
        "assetCode": "ExpandDollar",
        "user": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    test('setTrustline', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await setTrustline(web3, {
        "chainId": "1501",
        "issuer": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LT",
        "assetCode": "ExpandDollar",
        "amount": "54",
        "from": "GBGJRTRQXVAR2IDSMWH34NSRSIRV7NMP5DVKAK34P6SPTW2MEXYXFMCO"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    })
  jest.setTimeout(7000)
})

