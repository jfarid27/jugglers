if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    describe("computeBFromInfo", function() {
        var _ = require("underscore")

        var computeBFromInfo = require("src/computeBFromInfo")(_);

        describe("scenario when given problem info", function() {

            var information, juggs, cirs
            beforeEach(function() {
                juggs = _.times(4, function() { return {"code": "foo"} });
                cirs = _.times(2, function() { return {"code": "bar"} });
                information = {
                    jugglers: juggs,
                    circuits: cirs
                };
                expected = [2, 2, 1, 1, 1, 1]
            })
            it("should return appropriate B vector in cb", function(done) {
                var cb = function(result) {
                    var matchesExpected = result.reduce(function(agg, next, index) {
                        if (next != expected[index]){
                            return false && agg
                        }
                        return true
                    }, true)

                    expect(matchesExpected).toBeTruthy()
                    done()
                }
                computeBFromInfo(information, cb)
            })
        })
    })
})
