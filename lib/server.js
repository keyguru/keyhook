const express = require("express");
const helmet = require("helmet");
const Configuration = require("./config");
const bodyParser = require('body-parser');

module.exports = class Server {

    constructor(config_path) {
        
        // console.log("» Using config file", config_path);
        this.configuration = new Configuration(config_path);

        this.fileserver = express();
        this.fileserver.use(express.json({
            limit: "2mb",
            strict: false
        }));
        this.fileserver.use(helmet({
            contentSecurityPolicy: false,
        }));
        this.fileserver.use(bodyParser.json());
        this.fileserver.use(express.json());
        helmet.hidePoweredBy();
        helmet.xssFilter();

        this.exec = require("child_process");
        this.http = require('http');
        this.pathList = [];
    }

    setup_server() {
        let config = this.configuration.configuration;
        let used_ports = [];
        for (var index in config) {
            let port = config[index].port;
            let path = config[index].path;
            if (typeof(used_ports[port]) === "undefined") {
                used_ports[port] = true;
                console.log("» Starting Webhook API on port", port, "path", path);
                try {
                    this.http.createServer(this.fileserver).listen(port, "0.0.0.0");
                } catch (e) {
                    // may throw if already started
                }
            }
            this.pathList[path] = path; // should bear whole config
        }
        return true;
    }

    start_hooks() {

        this.fileserver.post("*", (req, res) => {

            let body = req.body;

            let currentPath = req.path;
            let currentPort;

            if (typeof (this.pathList[currentPath]) !== "undefined") {
                console.log("Request on known path", currentPath);
                currentPort = this.configuration.portFromPath(currentPath);
            } else {
                console.log("Request on unknown path", currentPath);
                res.status(404).end("Bad URI");
                return;
            }

            console.log("REQ port: ", currentPort, "path:", currentPath);

            // From GitHub, exit on non-push events prematurely
            if (typeof (req.headers["X-GitHub-Event"]) !== "undefined") {
                if ((req.headers["X-GitHub-Event"] != "push")) {
                    res.status(200).end("Accepted");
                    return;
                }
            }

            // Otherwise will listen on all paths, with specific commands

            let repo_name, namespace, name;
            let type = "generic";
            let match = null;

            console.log("body:", body);

            if ((typeof(body) !== "undefined") && (typeof(body.repository) !== "undefined")) {
                // Parse GitHub Format
                if (typeof(body.repository.full_name) !== "undefined") {
                    repo_name = body.repository.full_name;
                    namespace = body.repository.owner.login;
                    name = body.repository.name;
                    // match = body.repository.ref; TODO: FIXME Needs proper input.
                    type = "GitHub";
                }

                // Parse DockerHub Format (after receiving non-empty body)
                if (typeof(body.repository.repo_name) !== "undefined") {
                    repo_name = body.repository.repo_name;
                    namespace = body.repository.namespace; 
                    name = body.repository.name; 
                    match = body.repository.repo_name;
                    type = "DockerHub";
                }
            } else {
                console.log("Request had no body.");
            }

            console.log("type:", type);

            // Should match repo_name (for DockerHub) and branch ref (for GitHub)

            // do not wait for response, may take ages
            res.status(200).end("Accepted");

            // Check if the incoming webhook reference passes through configuration ref filter
            let hook_config = this.configuration.getConfigurationForPath(currentPath, currentPort);
            console.log("hook_config", hook_config);

            // Generic type has no body to get ref from...
            if (match !== null) {
                console.log("match", match);
            }
            
            if (hook_config.ref.indexOf(match) !== -1 ) {
                console.log("Configuration ref does not match incoming data", configuration.ref, match);
                return;
            }

            // Process here
            let command = hook_config.command; // allow same path with different ports

            // TODO: Start shell async and log only to console, return true immediately (or callback?)

            if (command) {
                console.log("shell command:", command);
                let result = false;
                try {
                    result = this.exec.execSync(command).toString();
                } catch (e) {
                    console.log(e);
                }
                console.log("shell result:", result);
            } else {
                console.log("No command defined for URI", currentPath);
            }

        }); // end Webhook Server

        return true;
    }

    stop_server() {
        if (process.env.ENVIRONMENT === "test") {
            process.exit(0);
        } else {
            // will be terminated later
        }
    }

}
