var assert = require('assert');

var expect = require('chai').expect;

describe('Configuration', function () {

  const config_file = require("../keyhook.json");
  const Configuration = require("../lib/config");

  it('should load with default configuration file', function () {
    assert.equal([1, 2, 3].indexOf(4), -1);
    let hooks = new Configuration(config_file);
    expect(hooks);
  });

  it('should provide port for specific path', function () {
    let hooks = new Configuration(config_file);
    let result = hooks.portFromPath("/test");
    expect(result === 32767);
  });

  it('should list all ports from configuration', function () {
    let hooks = new Configuration(config_file);
    let result = hooks.getAllPorts();
    expect(result);
  });

  it('should list all paths from configuration', function () {
    let hooks = new Configuration(config_file);
    let result = hooks.getAllPaths();
    expect(result);
  });

  it('should provide command for respective path and port', function (done) {
    let hooks = new Configuration(config_file);
    let configs = new Configuration(config_file).configuration;
    for (let index in configs) {
      let hook = configs[index];
      let path = hook.path;
      let port = hook.port;
      expect(hook);
      expect(path);
      expect(port);
      let command = hooks.getCommandForPath(path, port);
      console.log("command:", command);
      expect(command);
    }
    done();
  });

});

