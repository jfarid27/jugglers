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

            juggs[0].preferences = ["C0"]
            juggs[1].preferences = ["C1", "C0"]
            juggs[2].preferences = ["C1"]
            juggs[3].preferences = ["C1"]

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
                    expect(result.row).toBe(3)
                    expect(result.column).toBe(75)
                })
            })
        })
        describe("sparse matrix generation method", function() {
            describe("when given info", function() {
                var expected
                beforeEach(function(){
                    expected = [[0, 0, 1], [1, 5, 1],
                    [0, 1, 1], [1, 6, 1], [1, 7, 1],
                    [2, 0, 1], [2, 4, 1],
                    [3, 1, 1], [3, 5, 1],
                    [4, 2, 1], [4, 6, 1],
                    [5, 3, 1], [5, 7, 1]]
                })
                it("should properly generate sparse A matrix", function(done) {
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
                    computeAFromInfo.sparse(info, cb)
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
