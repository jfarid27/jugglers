if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    describe("computeBFromInfo", function() {
        var _ = require("underscore")
        var computeBFromInfo = require("src/computeBFromInfo")(_);
        describe("scenario when given problem info", function() {
            
            var info, juggs, cirs
            beforeEach(function() {
                juggs = [{}, {}, {}, {}]
                cirs = [{}, {}]
                info = {
                    jugglers: juggs,
                    circuits: cirs
                }
                expected = [2, 2, 1, 1, 1, 1]
            })
            describe("it should return appropriate constraint vector in cb", function(done) {
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
                computeBFromInfo(info, cb)
            })
        })
    })
})
