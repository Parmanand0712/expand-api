const http = require("http");
const dotenv = require("dotenv");

const app = require("./src/expand-api/utils/app");

dotenv.config();

// initialize port
const port = process.env.PORT || 3000;

// Price Discovery Socket
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Expand.network listening on port http://localhost:${port} `);
});
