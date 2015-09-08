if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    describe("parseFileLine", function() {
        var parseFileLine = require("src/parseFileLine")();
        describe("circuit method", function() {
            describe("scenario when given a circuit line", function() {
                var test, result
                beforeEach(function() {
                    test = "C C0 H:7 E:7 P:10"
                    result = parseFileLine.circuit(test)
                })
                it("should return a proper circuit object", function() {

                    expect(result.code).toBe("C0")
                    expect(result.score.H).toBe(7)
                    expect(result.score.E).toBe(7)
                    expect(result.score.P).toBe(10)
                })
            })
        })
        describe("juggler method", function() {
            describe("scenario when given a juggler line", function() {
                var test, result
                beforeEach(function() {
                    test = "J J1 H:4 E:3 P:7 C0,C2,C1"
                    result = parseFileLine.juggler(test)
                })
                it("should return a proper juggler object", function() {
                    expect(result.code).toBe("J1")
                    expect(result.score.H).toBe(4)
                    expect(result.score.E).toBe(3)
                    expect(result.score.P).toBe(7)
                    expect(result.preferences).toContain("C0")
                    expect(result.preferences).toContain("C1")
                    expect(result.preferences).toContain("C2")
                })
            })
        })
    })
})
