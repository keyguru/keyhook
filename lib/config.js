const express = require("express");
const fs = require("fs-extra");

module.exports = class Configuration {

    constructor(config_path) {
        if (!fs.existsSync(config_path)) {
            throw "Configuration file does not exist.";
        }
        console.log("» Using config file:", config_path);
        this.configuration = JSON.parse(fs.readFileSync(config_path)).hooks;
    }

}