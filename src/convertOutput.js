if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    module.exports = function(computeCFromInfo, _) {
        var convertOutput = function(problemInfo, xSoln) {

            var jugglersLength = problemInfo.jugglers.length
            var codeLines = problemInfo.circuits.map(function(c, i){
                return xSoln.slice((problemInfo.jugglers.length * i), ((problemInfo.jugglers.length * i) + problemInfo.jugglers.length) )
            })

            var circsHash = _.object(problemInfo.circuits.map(function(c) { return c.code }), problemInfo.circuits)
            var juggHash = _.object(problemInfo.jugglers.map(function(c) { return c.code }), problemInfo.jugglers)

            var lines = codeLines.map(function(line, lineIndex){
                return convertOutput.lineConverter(lineIndex, jugglersLength, juggHash, circsHash, line)
            })
            return lines
        }

        convertOutput.lineConverter = function(circIndex, numJuggs, juggHash, circsHash, lineRow) {
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
