var expect = require('chai').expect;

describe('Server', function () {

    const config_file = require("../keyhook.json");
    const Server = require("../lib/server");

    let server;

    describe('#constructor()', function () {
        it('should start on ports from given configuration file', function () {
            server = new Server(config_file);
            expect(server);
        });
    });

    describe('#setup()', function () {
        it('should setup webhook paths', function () {
            expect(server.setup_server());
        });
    });

    describe('#start()', function () {
        it('should start server hooks', function () {
            expect(server.start_hooks());
        });
    });

    describe('#stop()', function () {
        it('should stop server', function () {
            expect(server.stop_server());
        });
    });
});

