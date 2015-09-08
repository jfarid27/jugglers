if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    module.exports = function(computeCFromInfo, _) {
        var convertOutput = function(info, cb) {
            return
        }

        convertOutput.lineConverter = function(circIndex, numJuggs, juggHash, circsHash, line) {
            var lineRow = line.slice(numJuggs*circIndex, (numJuggs*circIndex) +numJuggs)

            var finishedData = lineRow.reduce(function(stringData, jugglerSelected, jugglerIndex) {

                if (jugglerSelected) {
                    var juggler = juggHash["J" + jugglerIndex]
                    var jugglerData = juggler.preferences.map(function(circuitCode) {
                        var circuit = circsHash[circuitCode]
                        return circuit.code + ":" + (- computeCFromInfo.scorer(juggler, circuit))
                    }).join(" ")

                    stringData = stringData + " " + "J" + jugglerIndex + " " + jugglerData + ","

                }

                return stringData
            }, ["C" + circIndex])

            return finishedData.slice(0, -1)
        }

        return convertOutput
    }
})
