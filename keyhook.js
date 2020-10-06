const Server = require("./lib/server");

const config_file = require("./keyhook.json");

const server = new Server(config_file);

server.setup_server();
server.start_hooks();

if (process.env.ENVIRONMENT == "test") {
  process.exit(0);
}