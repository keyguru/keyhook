const express = require("express");

module.exports = class Server {

    constructor(config_path) {
        
        const Configuration = require("./config");
        // console.log("» Using config file", config_path);
        this.configuration = new Configuration(config_path);

        this.hook_server = express();
        this.exec = require("child_process");
        this.http = require('http');
        this.pathList = [];
    }

    setup_server() {
        let config = this.configuration.configuration;
        for (var index in config) {
            let port = config[index].port;
            let path = config[index].path;
            console.log("» Starting Webhook API on port", port, "path", path);
            try {
                this.http.createServer(this.hook_server).listen(port, "0.0.0.0");
            } catch (e) {
                // may throw if already started
            }
            
            this.pathList[path] = path; // should bear whole config
        }
        this.hook_server.use(express.json({
            limit: "2mb",
            strict: false
        }));
        this.hook_server.use(express.urlencoded({ extended: false }));
        return true;
    }

    start_hooks() {

        this.hook_server.post("*", (req, res) => {

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

            console.log("REQ path: ", req.path);

            // will listen on all paths, with specific commands

            // From GitHub, exit on non-push events prematurely
            if (typeof (req.headers["X-GitHub-Event"]) !== "undefined") {
                if ((req.headers["X-GitHub-Event"] != "push")) {
                    res.status(200).end("Accepted");
                    return;
                }
            }

            let repo_name, namespace, name;

            // Parse GitHub Format
            if (typeof(body.repository.full_name) !== "undefined") {
                repo_name = body.repository.full_name;
                namespace = body.repository.owner.login;
                name = body.repository.name;
            }

            // Parse DockerHub Format
            if (typeof(body.repository.repo_name) !== "undefined") {
                repo_name = body.repository.repo_name;
                namespace = body.repository.namespace; 
                name = body.repository.name; 
            }

            // do not wait for response, may take ages
            res.status(200).end("Accepted");

            // Process here
            let command = this.configuration.getCommandForPath(currentPath, currentPort); // allow same path with different ports
            if (command) {
                try {
                    this.exec.execSync(command);
                } catch (e) {
                    console.log(e);
                }
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