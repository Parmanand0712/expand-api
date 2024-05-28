const { initialiseWeb3 } = require('../../common/intialiseWeb3');
const config = require('../../common/configuration/config.json');
const { issueAsset, transferAsset, freezeAsset, setTrustline, burnAsset } = require('../../src/expand/realWorldAsset');
const { getBalance, getTransaction, getUserTransaction, getGasPrice, getBlock, getUserPortfolio, getStorage, getEvents, getLatestLedger, simulateTransaction, decodeTransaction, sendTransaction } = require('../../src/expand/chain');


describe('Stellar Chain Testing - Positive', () => {
  test('get balance', async () => {
    web3 = await initialiseWeb3({ chainId: '1501' })
    const balance = await getBalance(web3, {
      "chainId": "1501",
      "address": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LHT"
    });
    console.log(balance);
    expect(balance).toBeTruthy();
  }),
    test('get transaction', async () => {
      web3 = await initialiseWeb3({ chainId: '1500' })
      const transaction = await getTransaction(web3, {
        "chainId": "1500",
        "transactionHash": "3ee7edbe77d9ca096adf05feab86cc3b2f0a355088240f3eeb06cbfc24a491a7"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    test('get block', async () => {
      web3 = await initialiseWeb3({ chainId: '1500' })
      const block = await getBlock(web3, {
        "chainId": "1500",
        "blockNumber": "50755373"
      });
      console.log(block);
      expect(block).toBeTruthy();
    }),
    test('get gas price', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const gasPrice = await getGasPrice(web3, {
        "chainId": "1501",
      });
      console.log(gasPrice)
      expect(gasPrice).toBeTruthy();
    }),
    test('get user transactions', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const userTxs = await getUserTransaction(web3, {
        "chainId": "1501",
        "address": "GCN75YMAUNO7WE3BOD3F6UDPEWRMZUTOXC6VYAS6ZWAO3ANONE6N6LHT"
      });
      console.log(userTxs);
      expect(userTxs).toBeTruthy();
    }),
    test('get portfolio', async () => {
      web3 = await initialiseWeb3({ chainId: '1500' })
      const portfolio = await getUserPortfolio(web3, {
        "chainId": "1500",
        "address": "GAJ4BSGJE6UQHZAZ5U5IUOABPDCYPKPS3RFS2NVNGFGFXGVQDLBQJW2P"
      });
      console.log(portfolio);
      expect(portfolio).toBeTruthy();
    }),
    test('get storage', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const storage = await getStorage(web3, {
        "chainId": "1501",
        "keys": "AAAABgAAAAH3xNSi+8RNeGCQ9G+xxqeBQYdAPM67qt+vUv/54U9NeAAAABQAAAAB"
      });
      console.log(storage);
      expect(storage).toBeTruthy();
    }),
    test('get events', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const events = await getEvents(web3, {
        "chainId": "1500",
        "startBlock": "50857879",
        "type": "contract"
      });
      console.log(events);
      expect(events).toBeTruthy();
    }),
    test('get latest ledger', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const latestLedger = await getLatestLedger(web3, {
        "chainId": "1501",
      });
      console.log(latestLedger)
      expect(latestLedger).toBeTruthy();
    }),
    test('decode transaction', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await decodeTransaction(web3, {
        "chainId": "1501",
        "rawTransaction": "AAAAAgAAAABMmM4wvUEdIHJlj742UZIjX7WP6OqgK3x/pPnbTCXxcgAAAGQAAaHuAAAACwAAAAEAAAAAAAAAAAAAAABl+DZxAAAAAAAAAAEAAAAAAAAABgAAAAJFeHBhbmREb2xsYXIAAAAAm/7hgKNd+xNhcPZfUG8loszSbri9XAJezYDtga5pPN8AAAAAIC+/AAAAAAAAAAAA"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    test('send Transaction', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await sendTransaction(web3, {
        "chainId": "1501",
        "rawTransaction": "AAAAAgAAAABMmM4wvUEdIHJlj742UZIjX7WP6OqgK3x/pPnbTCXxcgAAAGQAAaHuAAAACwAAAAEAAAAAAAAAAAAAAABl+DZxAAAAAAAAAAEAAAAAAAAABgAAAAJFeHBhbmREb2xsYXIAAAAAm/7hgKNd+xNhcPZfUG8loszSbri9XAJezYDtga5pPN8AAAAAIC+/AAAAAAAAAAAA"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    test('Simulate Transaction', async () => {
      web3 = await initialiseWeb3({ chainId: '1501' })
      const transaction = await simulateTransaction(web3, {
        "chainId": "1501",
        "rawTransaction": "AAAAAgAAAACb/uGAo137E2Fw9l9QbyWizNJuuL1cAl7NgO2Brmk83wAAxn4AADIbAAAAFgAAAAEAAAAAAAAAAAAAAABl+sbAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABl8opLdY4TUNP7pmosTaumaDjcjtK2AZEUvz+40Dj/ZsAAAAJaW5jcmVtZW50AAAAAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAHCxRSx/lCsIebq3ncX/0VB3zL1ZCf+AY3FmCgx7Q9iO0AAAABAAAABgAAAAGXyikt1jhNQ0/umaixNq6ZoONyO0rYBkRS/P7jQOP9mwAAABQAAAABADpyuAAAAwAAAACEAAAAAAAAxhoAAAABrmk83wAAAEB18y/DVjo6/Yiyr7ZmZM6H+cNTPnGnJe75CuqLknRsbmI1NjB3lNxjyKSnMDqJyT2eSPs3pNYeMGViFYaWcSEF"
      });
      console.log(transaction);
      expect(transaction).toBeTruthy();
    }),
    jest.setTimeout(8000)
});


