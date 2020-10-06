
const express = require("express");
const exec = require("child_process");
const http = require('http');
const hook_server = express();

const config_file = require("./keyhook.json");
const Configuration = require("./lib/config"); const hooks = new Configuration(config_file);

var pathList = [];

for (var index in hooks.configuration) {
    let port = hooks.configuration[index].port;
    let path = hooks.configuration[index].path;
    console.log("» Starting Webhook API on port", port, "path", path);
    http.createServer(hook_server).listen(port, "0.0.0.0");
    pathList[path] = path; // should bear whole config
}

hook_server.use(express.json({
  limit: "2mb",
  strict: false
}));

hook_server.use(express.urlencoded({ extended: false }));

hook_server.post("*", (req, res) => {

    let currentPath = req.path;
    let currentPort;

    if (typeof(pathList[currentPath]) !== "undefined") {
        console.log("Request on known path", currentPath);
        currentPort = hooks.portFromPath(currentPath);
    } else {
        console.log("Request on unknown path", currentPath);
        res.status(404).end("Bad URI");
        return;
    }

    console.log("REQ path: ", req.path);

    // will listen on all paths, with specific commands
    
  // From GitHub, exit on non-push events prematurely
  if (typeof(req.headers["X-GitHub-Event"]) !== "undefined") {
    if ((req.headers["X-GitHub-Event"] != "push")) {
      res.status(200).end("Accepted");
      return;
    }
  }
  // do not wait for response, may take ages
  res.status(200).end("Accepted");

  // Process here
  let command = hooks.getCommandForPath(currentPath, currentPort); // allow same path with different ports
  if (command) {
    try {
        exec.execSync(command);
      } catch (e) {
          console.log(e);
      }
  } else {
      console.log("No command defined for URI", currentPath);
  }

}); // end Webhook Server