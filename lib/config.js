module.exports = class Config {

	constructor() {
        let file = require("../keyhook.json");
        this.configuration = file.hooks;
    }
    
    portFromPath(path) {
        var port;
        for (var index in this.configuration) {
            if (this.configuration[index].path == path) {
                port = this.configuration[index].port;
                break;
            }
        }
        return port;
    }

	getAllPorts() {
        let ports = [];
        for (var index in this.configuration) {
            let variant = this.configuration[index];
            if (!ports.includes(variant.port)) {
                ports.push(variant.port);
            }
    
        }
        if (ports.length == 0) {
            throw "At least one port must be configured";
        }
        return ports;
    }
    
    getAllPaths() {
        let paths = [];
        for (var index in this.configuration) {
            let variant = this.configuration[index];
            if (!paths.includes(variant.path)) {
                paths.push(variant.path);
            }
        }
        if (paths.length == 0) {
            throw "At least one hook URI must be configured";
        }
        return paths;
    }

    getCommandForPath(path, port) {
        console.log("Getting command for path:", path);
        let paths = this.getAllPaths();
        for (var index in paths) {
            let pathName = paths[index];
            console.log("pathName:", pathName);
            if (pathName.indexOf(path) !== "undefined") {
                console.log("index config:", this.configuration[index]);
                // TODO: Match port as well
                return this.configuration[index].command;
            }
        }
        if (paths.length == 0) {
            throw "At least one hook URI must be configured";
        }
        return null;
    }
}