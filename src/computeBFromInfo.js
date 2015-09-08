if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    module.exports = function(_) {
        var computeBFromInfo = function(info, cb) {
            var juggsPerCircuit = info.jugglers.length / info.circuits.length;
            var bCircuits = _.times(info.circuits.length, function() {
                return juggsPerCircuit
            })
            var bJuggs = _.times(info.circuits.length, function() {
                return 1
            })
            cb(bCircuits.concat(bJuggs))
        }

        return computeBFromInfo;

    }
})
