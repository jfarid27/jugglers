if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    describe("buildInfoFromLines", function() {

        var computeBFromInfo, _, mockParseFileLine
        beforeEach(function() {
            _ = {
               reduce: function(lines, reducer) {
                   this.givenReducer = reducer
                   this.lines = lines
                   return "UnderscoreReducer"
               }
            }

            mockParseFileLine = {
                circuit: function(){
                    return "Circuit"
                },
                juggler: function(){
                    return "Juggler"
                }
            }

            computeBFromInfo = require("src/computeBFromInfo")(mockParseFileLine, _);
        })

        describe("when given info and lines", function() {

            var lines, listener
            beforeEach(function() {
                lines = [
                    "foo",
                    "bar"
                ]
                listener = []

                computeBFromInfo.reducer = function() {
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

                computeBFromInfo(lines)
            })
        })

        describe("reducer", function() {
            var reducer = computeBFromInfo.reducer
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
                        line = "C C0 H:7 E:7 P:10"
                    })
                    it("should append to info object a circuit using given parseFileLine", function() {
                        var result = reducer(info, line);
                        expect(result.jugglers[0]).toBe("mockCircuit")
                        expect(result.jugglers[1]).toBe("Circuit")
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
                        expect(result.jugglers[1]).toBe("Juggler")
                    })
                })
            })
        })
    })
})
