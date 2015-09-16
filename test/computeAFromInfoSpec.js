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
        describe("preferencesParse method", function() {
            describe("scenario when given a circuit preference string", function() {
                var expected, result, preference
                beforeEach(function() {
                    preference = "C143"
                    expected = 143
                    result = computeAFromInfo.preferencesParse(preference)
                })
                it("should return proper numerical index of referenced circuit", function() {
                    expect(result).toBe(expected)
                })
            })
        })
        describe("sparse matrix generation method", function() {
            describe("when given info", function() {
                var expected
                beforeEach(function(){
                    var circuit1Vals = _.times(4, function(index){
                        return [0, index]
                    })

                    var circuit2Vals = _.times(4, function(index){
                        return [1, index + 4]
                    })

                    var jugglerVals = _.times(4, function(index){
                        return [[index + 2, index], [index + 2, index + 4]]
                    }).reduce(function(agg, arr){
                        return agg.concat(arr)
                    }, [])

                    var jugglerPrefs = [[6,0], [7,5], [7,1], [8,6], [9,7]]

                    expected = circuit1Vals.concat(circuit2Vals).concat(jugglerVals).concat(jugglerPrefs)
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
