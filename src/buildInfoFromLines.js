if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    module.exports = function(parseFileLine, _) {
        var buildInfoFromLines = function(lines, cb) {
            console.log("Creating Problem Info\n")
            var data = _.reduce(lines, buildInfoFromLines.reducer, {
                jugglers: [],
                circuits: []
            })
            console.log("Created Problem Info\n")
            cb(data)
        }

        buildInfoFromLines.reducer = function(info, line) {
            var splits = line.split(" ")
            if (splits[0] == "C") {
                info.circuits.push(parseFileLine.circuit(line))
            } else if (splits[0] == "J") {
                info.jugglers.push(parseFileLine.juggler(line))
            }
            return info
        }

        return buildInfoFromLines;

    }
})
