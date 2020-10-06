var expect = require('chai').expect;

describe('App', function () {

    describe('#constructor()', function () {
        it('should start', function (done) {
            const App = require("../keyhook.js");
            expect(App);
            done();
        });
    });
});

