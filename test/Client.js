var expect = require('chai').expect;
const nock = require('nock');

describe('Trigger', function () {

    const Server = require("../lib/server");

    let server = new Server(__dirname + "/../keyhook.json");

    it('should start on ports from given configuration file', function (done) {
        process.env.ENVIRONMENT = "circleci"; // prevent exiting server on test
        server.setup_server();
        server.start_hooks();
        expect(server);
        done();
    });

    it('should get response from local test server on a GitHub Mock', function (done) {
        let sample_data = require("./github.sample.json");
        expect(sample_data);
        nock('http://localhost:32767/')
            .post('/test', sample_data)
            .reply(200, 'Accept' );
        done();
    });

    it('should get response from local test server on a DockerHub Mock', function (done) {
        let sample_data = require("./dockerhub.sample.json");
        expect(sample_data);
        nock('http://localhost:32767/')
        .post('/test', sample_data)
        .reply(200, 'Accept' );
        done();
    });


    it('Should stop server', function () {
        server.stop_server();
        setTimeout(() => {
            if (process.env.ENVIRONMENT === "circleci") {
                process.exit(0);
            }
        }, 10000);
    });
    
});

