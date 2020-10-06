var expect = require('chai').expect;

describe('Server', function () {

    const config_file = require("../keyhook.json");
    const Server = require("../lib/server");

    let server;

    describe('#constructor()', function () {
        it('should start on ports from given configuration file', function (done) {
            server = new Server(config_file);
            expect(server);
            done();
        });
    });

    describe('#setup()', function () {
        xit('should setup webhook paths', function (done) {
            expect(server.setup_server());
            done();
        });
    });

    describe('#start()', function () {
        xit('should start server hooks', function (done) {
            expect(server.start_hooks());
            done();
        });
    });

    describe('#stop()', function () {
        it('should stop server', function (done) {
            expect(server.stop_server());
            done();
        });
    });

    it('should skip, eventually', function (done) {
        setTimeout(() => {
          this.skip();
          done(); // never called!
        }, 500);
    });
});

