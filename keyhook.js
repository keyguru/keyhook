let Server = require("./lib/server");
let config_file = require("./keyhook.json");

for (let j = 0; j < process.argv.length; j++) {
  let name = process.argv[j];
  if ((name == "--config") || (name == "-c")) {
    config_file = process.argv[j+1];
    console.log("» Using config file", config_file);
  }
}

let server = new Server(config_file);

server.setup_server();
server.start_hooks();

if (process.env.ENVIRONMENT == "test") {
  process.exit(0);
}