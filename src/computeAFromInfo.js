if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    module.exports = function(_) {
        var computeAFromInfo = function(info, cb) {

            var numJuggs = info.jugglers.length
            var numCircs = info.circuits.length

            var circuitConstraints = info.circuits.map(function(){
                return info.circuits.map(function() {
                    return info.jugglers.map(function() { return 0})
                }).reduce(function(agg, next){ return agg.concat(next)}, [])
            })

            info.jugglers.map(function(jugg) {
                jugg.preferences.map(function(circuitCode){
                    var index = computeAFromInfo.indexer(numJuggs, numCircs, jugg, {
                        code: circuitCode
                    })
                    circuitConstraints[index.row][index.column] = 1
                })
            })

            var jugglerConstraints = info.jugglers.map(function() {
                return info.circuits.map(function() {
                    return info.jugglers.map(function() { return 0})
                }).reduce(function(agg, next){ return agg.concat(next)}, [])
            })

            info.jugglers.map(function(juggler, juggIndex) {
                info.circuits.map(function(circuit) {
                    var index = computeAFromInfo.indexer(numJuggs, numCircs, juggler, circuit)
                    jugglerConstraints[juggIndex][index.column] = 1
                })
            })

            var A = circuitConstraints.concat(jugglerConstraints)
            cb(A)
        }

        computeAFromInfo.sparse = function(info, cb){
            var numJuggs = info.jugglers.length
            var numCircs = info.circuits.length

            var circuitConstraints = _.reduce(info.jugglers, function(agg, jugg) {
                jugg.preferences.map(function(circuitCode){
                    var index = computeAFromInfo.indexer(numJuggs, numCircs, jugg, {
                        code: circuitCode
                    })
                    agg.push([index.row, index.column, 1])
                })
                return agg
            }, [])

            var jugglerConstraints = _.reduce(info.jugglers, function(agg, juggler, juggIndex) {
                info.circuits.map(function(circuit) {
                    var index = computeAFromInfo.indexer(numJuggs, numCircs, juggler, circuit)
                    agg.push([juggIndex + numCircs, index.column, 1])
                })
                return agg
            }, [])

            var A = circuitConstraints.concat(jugglerConstraints)
            cb(A)
        }

        computeAFromInfo.indexer = function(numJuggs, numCircs, jugg, circ) {
            var juggIndex = parseInt(jugg.code.split("J")[1])
            var circIndex = parseInt(circ.code.split("C")[1])
            return {
                row: circIndex,
                column: ((circIndex) * numJuggs) + juggIndex
            }
        }

        return computeAFromInfo;

    }
})
