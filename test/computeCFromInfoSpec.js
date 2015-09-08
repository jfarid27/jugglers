if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    var _ = require("underscore")

    describe("computeCFromInfo", function() {
        var computeCFromInfo
        beforeEach(function() {
            computeCFromInfo = require("src/computeCFromInfo")(_)
        })
        describe("builtin indexer", function() {
            describe("when given jugg and circuit", function() {
                var jugg, cur, result, numJuggs, numCircs
                beforeEach(function() {
                    numJuggs = 2000
                    numCircs = 500
                    jugg = {
                        code: "J534"
                    }
                    cur = {
                        code: "C168"
                    }
                    result = computeCFromInfo.indexer(numJuggs, numCircs, jugg, cur)
                })
                it("should properly compute objective index representing circuit and jugg", function() {
                    expect(result).toBe((2000*168) + 534)
                })
            })
        })
        describe("builtin scorer", function() {
            describe("when given jugg and circuit", function() {
                var jugg, cur, result
                beforeEach(function() {
                    jugg = {
                        score: {
                        "H": 1,
                        "E": 2,
                        "P": 3
                        }
                    }
                    cur = {
                        score: {
                        "H": 13,
                        "E": 14,
                        "P": 15
                        }
                    }
                    result = computeCFromInfo.scorer(jugg, cur)
                })
                it("should properly compute correlation score", function() {
                    expect(result).toBe(86)
                })
            })
        })
        describe("when given info", function() {
            var info, juggs, cirs, expected
            beforeEach(function() {
                juggs = _.times(4, function(index){
                    return {
                        code: "J" + index,
                    }
                })

                juggs[0].preferences = ["C0"]
                juggs[0].score = {
                    "H": 1,
                    "E": 2,
                    "P": 3
                }
                juggs[1].preferences = ["C1", "C0"]
                juggs[1].score = {
                    "H": 4,
                    "E": 5,
                    "P": 6
                }
                juggs[2].preferences = ["C1"]
                juggs[2].score = {
                    "H": 7,
                    "E": 8,
                    "P": 9
                }
                juggs[3].preferences = ["C1"]
                juggs[3].score = {
                    "H": 10,
                    "E": 11,
                    "P": 12
                }

                cirs = [{
                    code: "C0",
                    score: {
                        "H": 13,
                        "E": 14,
                        "P": 15
                    }
                }, {
                    code: "C1",
                    score: {
                        "H": 16,
                        "E": 17,
                        "P": 18
                    }
                }]
                info = {
                    jugglers: juggs,
                    circuits: cirs
                }
                expected = [ 86, 212, 338, 464, 104, 257, 410, 563 ]
            })
            it("should compute proper objective coefficients in cb", function(done) {
                var cb = function(result) {
                    
                    var matches = _.reduce(result, function(prev, val, index){
                        if (val != expected[index]) {
                            return false
                        }
                        return true && prev
                    }, true)

                    expect(matches).toBe(true)
                    done()
                }
                computeCFromInfo(info, cb)
            })
        })
    })
})
