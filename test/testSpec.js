if (typeof define !== 'function') {
    var define = require("amdefine")(module)
}
define(function (require, exports, module) {

    describe("test1", function() {

        it("should pass", function(){
            expect(true).toBeTruthy()
        })
    })
})
