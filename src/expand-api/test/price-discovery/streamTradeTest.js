const socketClient = require("socket.io-client");

const serverURL = "http://localhost:3000";
const socket = socketClient(serverURL,{
    reconnection: true,
    "reconnectionAttenpts" : "Infinity",
});


socket.on("getTrades", (data) =>{
    console.log("connected-socket--------",socket.id);
    console.log(data);
});