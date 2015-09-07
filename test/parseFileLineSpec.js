if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    describe("parseFileLine", function() {
        var parseFileLine = require("src/parseFileLine")();
        describe("scenario when given a circuit line", function() {
            var test
            beforeEach(function() {
                test = "C C0 H:7 E:7 P:10"
            })
            it("should cb a proper circuit object", function(done) {
                var cb = function(result){
                    expect(result.code).toBe("C0")
                    expect(result.score.H).toBe("7")
                    expect(result.score.E).toBe("7")
                    expect(result.score.P).toBe("10")
                    done()
                }

                parseFileLine.circuit(test, cb)
            })
        })
        describe("scenario when given a juggler line", function() {
            var test
            beforeEach(function() {
                test = "J J1 H:4 E:3 P:7 C0,C2,C1"
            })
            it("should cb a proper juggler object", function(done) {
                var cb = function(result){
                    expect(result.code).toBe("J1")
                    expect(result.score.H).toBe("4")
                    expect(result.score.E).toBe("3")
                    expect(result.score.P).toBe("7")
                    expect(result.preferences).toContain("C0")
                    expect(result.preferences).toContain("C1")
                    expect(result.preferences).toContain("C2")
                    done()
                }

                parseFileLine.juggler(test, cb)
            })
        })
    })
})
