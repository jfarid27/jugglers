if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {
    describe("convertOutput", function() {

        var _ = require("underscore");
        var computeCFromInfo = require("src/computeCFromInfo")(_),
            convertOutput = require("src/convertOutput")(computeCFromInfo, _);

        describe("lineConverter", function() {
            describe("when given line, index, and jugg circ hash tables", function() {

                var expected, juggHash, line, circIndex, numJuggs
                beforeEach(function() {
                    numJuggs = 4
                    circIndex = 1
                    juggHash = {
                        "J0": {
                            "preferences": ["C1", "C0"],
                            score: {
                                H: 10,
                                E: 0,
                                P: 10
                            }
                        },
                        "J1": {
                            "preferences": []
                        },
                        "J2": {
                            "preferences": ["C0", "C1"],
                            score: {
                                H: 10,
                                E: 0,
                                P: 10
                            }
                        },
                        "J3": {
                            "preferences": []
                        },
                    }

                    circsHash = {
                        "C0": {
                            code: "C0",
                            score: {
                                H: 10,
                                E: 10,
                                P: 0
                            }
                        },
                        "C1": {
                            code: "C1",
                            score: {
                                H: 10,
                                E: 0,
                                P: 10
                            }
                        },
                    }

                    line = [0, 0, 0, 0, 1, 0, 1, 0]
                    expected = "C1 J0 C1:200 C0:100, J2 C0:100 C1:200"
                    result = convertOutput.lineConverter(circIndex, numJuggs, juggHash, circsHash, line)
                })
                it("should return correct line", function() {
                    expect(result).toBe(expected)
                })
            })
        })
    })
})
