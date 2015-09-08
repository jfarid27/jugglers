if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    module.exports = function() {
        var computeCFromInfo = function(info, cb) {

            var numJuggs = info.jugglers.length
            var numCircs = info.circuits.length

            var c = info.circuits.map(function(){
                return info.jugglers.map(function() {
                    return 0
                })
            }).reduce(function(agg, next){
                return agg.concat(next)
            }, [])

            info.circuits.map(function(circuit) {
                info.jugglers.map(function(juggler){
                    var index = computeCFromInfo.indexer(numJuggs, numCircs, juggler, circuit)
                    c[index] = computeCFromInfo.scorer(juggler, circuit)
                })
            })
            cb(c)
        }

        computeCFromInfo.scorer = function(jugg, circ) {
            return ["H", "E", "P"].map(function(index){
                return jugg.score[index] * circ.score[index]
            }).reduce(function(agg, next) {
                return agg + next
            }, 0)
        }

        computeCFromInfo.indexer = function(numJuggs, numCircs, jugg, circ) {
            var circIndex = parseInt(circ.code.split("C")[1])
            var juggIndex = parseInt(jugg.code.split("J")[1])

            return (numJuggs * circIndex) + juggIndex
        }

        return computeCFromInfo;

    }
})
