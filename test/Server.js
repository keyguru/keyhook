var expect = require('chai').expect;

describe('Server', function () {

    const Server = require("../lib/server");

    let server;

    it('should start on ports from given configuration file', function (done) {
        server = new Server(__dirname + "/../keyhook.json");
        expect(server);
        done();
    });

    it('should stop server', function (done) {
        expect(server.stop_server());
        done();
    });
});

