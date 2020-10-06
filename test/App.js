var expect = require('chai').expect;

describe('App', function () {

    describe('#constructor()', function (done) {
        it('should start', function () {
            const App = require("../keyhook.js");
            expect(App);
            done();
        });
    });
});

