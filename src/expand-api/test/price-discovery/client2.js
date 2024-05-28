const socketClient = require("socket.io-client");

const serverURL = "http://localhost:3000";

const socket = socketClient(serverURL,{
    query : {clientId : 3},
    reconnection: true,
    "reconnectionAttenpts" : "Infinity",
});

socket.on("getTransactions", (data) =>{
    console.log("connected-socket--------",socket.id);
    for (const _data of data) {
        console.log(`To: ${_data[3]}\nFrom: ${_data[11]}`);
    }
});