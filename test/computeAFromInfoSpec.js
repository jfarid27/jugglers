if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    var _ = require("underscore")

    describe("computeAFromInfo", function() {
        var computeAFromInfo, info, juggs, cirs, scorer, expected
        beforeEach(function() {
            computeAFromInfo = require("src/computeAFromInfo")(_)

            juggs = _.times(4, function(index){
                return {
                    code: "J" + index,
                }
            })

            jugg[0].preferences = ["C0"]
            jugg[1].preferences = ["C1", "C0"]
            jugg[2].preferences = ["C1"]
            jugg[3].preferences = ["C1"]

            cirs = [{
                code: "C0"
            }, {
                code: "C1"
            }]
            info = {
                jugglers: juggs,
                circuits: cirs
            }

        })
        describe("indexer builtin", function() {
            var indexer
            beforeEach(function() {
                indexer = computeAFromInfo.indexer
            })
            describe("when given juggler and circuit", function() {
                var jugg, circ, numJuggs, numCircs, result
                beforeEach(function() {
                    numJuggs = 20
                    numCircs = 5
                    jugg = {
                        code: "J15"
                    }
                    circ = {
                        code: "C3"
                    }
                    result = indexer(numJuggs, numCircs, jugg, circ)
                })
                it("should properly parse row and column number based on code", function() {
                    expect(result.row).toBe(4)
                    expect(result.column).toBe(75)
                })
            })
        })
        describe("scenario when given info", function() {
            var expected
            beforeEach(function() {
                expected = [
                    [1, 1, 0, 0, 0, 0, 0, 0], //circuit constraints
                    [0, 0, 0, 0, 0, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0], //juggler constrains
                    [0, 1, 0, 0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0, 0, 1, 0],
                    [0, 0, 0, 1, 0, 0, 0, 1]
                ]

            })
            it("should return proper A constraint LP matrix", function(done) {
                var cb = function(result) {
                    var matches = _.reduce(result, function(prevRow, row, indexRow){
                        var rowsMatch = _.reduce(row, function(prevCols, col, indexCol) {
                            if (col != expected[indexRow][indexCol]) {
                                return false
                            }
                            return true && prevCols
                        }, true)

                        if (!rowsMatch) {
                            return false
                        }
                        return true && prevRow
                    }, true)

                    expect(matches).toBeTruthy()
                    done()
                }
                computeAFromInfo(info, cb)
            })
        })
    })
})
