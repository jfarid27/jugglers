var argvs = require('minimist')(process.argv.slice(2)),
    async = require('async'),
    fs = require('fs'),
    _ = require('underscore');

//My code
var parseFileLine = require("./src/parseFileLine")(),
    buildInfoFromLines = require("./src/buildInfoFromLines")(parseFileLine, _),
    computeAFromInfo = require("./src/computeAFromInfo")(_),
    computeBFromInfo = require("./src/computeBFromInfo")(_),
    computeCFromInfo = require("./src/computeCFromInfo")(_);

if (!argvs['f']) {
    console.log("No file specified! \n");
    return
}

var dataFileName = "./" + argvs['f']

//Read file line by line and build the information
fs.readFile(dataFileName, function(err, result) {
    if (err) {
        console.log("Error on file read!\n")
    }
    var lines = (result.toString()).split("\n")
    buildInfoFromLines(lines, function(problemInfo) {

        async
            .parallel([
                generateA(problemInfo),
                generateB(problemInfo),
                generateC(problemInfo)
            ], function(err, results) {
                if (err) {
                    console.log("Failed on problem generation\n")
                    console.log(err)
                }
            })

    })

})
//Generate A matrix and store it in data
var generateA = function(problemInfo) {
    return function(done) {
        computeAFromInfo(problemInfo, function(data){
            fs.writeFile("./data/A.json", new Buffer(JSON.stringify(data)), function(err){
                if (err) {
                    done(err, null)
                }
                done(null)
            })
        })
    }
}
//Generate B vector and store it in data
var generateB = function(problemInfo) {
    return function(done) {
        computeBFromInfo(problemInfo, function(data){
            fs.writeFile("./data/B.json", new Buffer(JSON.stringify(data)), function(err){
                if (err) {
                    done(err, null)
                }
                done(null)
            })
        })
    }
}
//Generate C vector and store it in data
var generateC = function(problemInfo) {
    return function(done) {
        computeCFromInfo(problemInfo, function(data){
            fs.writeFile("./data/C.json", new Buffer(JSON.stringify(data)), function(err){
                if (err) {
                    done(err, null)
                }
                done(null)
            })
        })
    }
}
//When all that is complete call linear program to optimize
