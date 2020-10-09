const fs = require("fs-extra");
module.exports = class Config {

	constructor(filename) {
        let file = JSON.parse(fs.readFileSync(filename));
        this.configuration = file.hooks;
    }
    
    portFromPath(path) {
        var port;
        for (var index in this.configuration) {
            if (this.configuration[index].path === path) {
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
        if (ports.length === 0) {
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
        if (paths.length === 0) {
            throw "At least one hook URI must be configured";
        }
        return paths;
    }

    getCommandForPath(path, port) {
        return this.getConfigurationForPath(path, port).command;
    }

    getConfigurationForPath(path, port) {
        for (var index in this.configuration) {
            let config = this.configuration[index];
            if ((config.port === port) && config.path.indexOf(path) === 0) {
                return this.configuration[index];
            }
        }
        return null;
    }
}