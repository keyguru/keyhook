var expect = require('chai').expect;

describe('Server', function () {

    const config_file = require("../keyhook.json");
    const Server = require("../lib/server");

    let server;

    describe('#constructor()', function (done) {
        it('should start on ports from given configuration file', function () {
            server = new Server(config_file);
            expect(server);
            done();
        });
    });

    describe('#setup()', function (done) {
        it('should setup webhook paths', function () {
            expect(server.setup_server());
            done();
        });
    });

    describe('#start()', function (done) {
        it('should start server hooks', function () {
            expect(server.start_hooks());
            done();
        });
    });

    describe('#stop()', function (done) {
        it('should stop server', function () {
            expect(server.stop_server());
            done();
        });
    });
});

