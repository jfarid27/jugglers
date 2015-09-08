if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    describe("buildInfoFromLines", function() {

        var _, buildInfoFromLines, parseFileLine
        beforeEach(function() {
            _ = {
               reduce: function(lines, reducer) {
                   this.givenReducer = reducer
                   this.lines = lines
                   return "UnderscoreReducer"
               }
            }

            parseFileLine = require("src/parseFileLine")()

            buildInfoFromLines = require("src/buildInfoFromLines")(parseFileLine, _);
        })

        describe("when given lines", function() {

            var lines, listener
            beforeEach(function() {
                lines = [
                    "foo",
                    "bar"
                ]
                listener = []

                buildInfoFromLines.reducer = function() {
                    return "Reducer"
                }
            })

            it("should return reduce call on lines", function(done) {

                var cb = function(result){

                    expect(result).toBe("UnderscoreReducer")
                    expect(_.givenReducer()).toBe("Reducer")
                    expect(_.lines[0]).toBe("foo")
                    expect(_.lines[1]).toBe("bar")
                    done()
                }

                buildInfoFromLines(lines, cb)
            })
        })

        describe("reducer", function() {
            var reducer
            beforeEach(function() {
                reducer = buildInfoFromLines.reducer
            })
            describe("when given info object and line", function() {
                var info
                beforeEach(function() {
                    info = {
                        circuits: ["mockCircuit"],
                        jugglers: ["mockJuggler"]
                    }
                })
                describe("if line is a circuit object", function() {
                    var line
                    beforeEach(function(){
                        line = "C C0 H:6 E:7 P:10"
                    })
                    it("should append to info object a circuit using given parseFileLine", function() {
                        var result = reducer(info, line);
                        expect(result.circuits[0]).toBe("mockCircuit")
                        expect(result.circuits[1].code).toBe("C0")
                        expect(result.circuits[1].score.H).toBe(6)
                        expect(result.circuits[1].score.E).toBe(7)
                        expect(result.circuits[1].score.P).toBe(10)
                    })
                })
                describe("if line is a jugg object", function() {
                    var line
                    beforeEach(function(){
                        line = "J J1 H:4 E:3 P:7 C0,C2,C1"
                    })
                    it("should append to info object a jugg using given parseFileLine", function() {
                        var result = reducer(info, line);
                        expect(result.jugglers[0]).toBe("mockJuggler")
                        expect(result.jugglers[1].code).toBe("J1")
                        expect(result.jugglers[1].score.H).toBe(4)
                        expect(result.jugglers[1].score.E).toBe(3)
                        expect(result.jugglers[1].score.P).toBe(7)
                        expect(result.jugglers[1].preferences).toContain("C0")
                        expect(result.jugglers[1].preferences).toContain("C1")
                        expect(result.jugglers[1].preferences).toContain("C2")
                    })
                })
            })
        })
    })
})
