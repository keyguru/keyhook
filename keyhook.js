#!/usr/bin/env node

const fs = require('fs-extra');

let Server = require("./lib/server");
let config_file = require("./keyhook.json");

for (let j = 0; j < process.argv.length; j++) {
  let name = process.argv[j];
  if ((name == "--config") || (name == "-c")) {
    // Check if file exists
    if (fs.existsSync(process.argv[j+1])) {
      config_file = process.argv[j+1];
    } else {
      console.log("Configuration file", name, "does not exist, using defaults...");
    }
  }
}

let server = new Server(config_file);

server.setup_server();
server.start_hooks();

if (process.env.ENVIRONMENT === "test") {
  process.exit(0);
}
