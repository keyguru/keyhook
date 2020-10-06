var assert = require('assert');

var expect = require('chai').expect;

describe('Configuration', function () {

  const config_file = require("../keyhook.json");
  const Configuration = require("../lib/config");
  
  describe('#constructor()', function () {
    it('should load with default configuration file', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
      let hooks = new Configuration(config_file);
      expect(hooks);
      //assert.doesNotThrow();
    });
  });

  describe('#portFromPath(path)', function () {
    it('should provide port for specific path', function () {
      let hooks = new Configuration(config_file);
      expect(hooks.portFromPath("/test") == 32767);
      //assert.doesNotThrow();
    });
  });

  describe('#getAllPorts()', function () {
    it('should list all ports from configuration', function () {
      let hooks = new Configuration(config_file);
      expect(hooks.getAllPorts());
    });
  });

  describe('#getAllPaths()', function () {
    it('should list all paths from configuration', function () {
      let hooks = new Configuration(config_file);
      expect(hooks.getAllPaths());
    });
  });

  describe('#getCommandForPath(path, port)', function () {
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
        expect(command);
      }
      done();
    });
  });

});

