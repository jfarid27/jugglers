if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    module.exports = function() {
        var parseFileLine = function() {
            return {}
        }

        parseFileLine.circuit = function(line) {
            var circuitObj = {
                code: undefined,
                score: {
                    "H": undefined,
                    "E": undefined,
                    "P": undefined
                }
            }
            var splits = line.split(" ")
            circuitObj.code = splits[1].split("\r").join("")
            circuitObj.score.H = parseInt(splits[2].split(":")[1])
            circuitObj.score.E = parseInt(splits[3].split(":")[1])
            circuitObj.score.P = parseInt(splits[4].split(":")[1])
            return circuitObj
        }

        parseFileLine.juggler = function(line) {
            var jugglerObj = {
                code: undefined,
                score: {
                    "H": undefined,
                    "E": undefined,
                    "P": undefined
                },
                preferences: []
            }
            var splits = line.split(" ")
            jugglerObj.code = splits[1].split("\r").join("")
            jugglerObj.score.H = parseInt(splits[2].split(":")[1])
            jugglerObj.score.E = parseInt(splits[3].split(":")[1])
            jugglerObj.score.P = parseInt(splits[4].split(":")[1])
            splits[5].split(",").map(function(circuit) {
                jugglerObj.preferences.push(circuit.split("\r").join(""))
            })
            return jugglerObj
        }

        return parseFileLine;

    }
})
