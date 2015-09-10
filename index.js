var argvs = require('minimist')(process.argv.slice(2)),
    async = require('async'),
    fs = require('fs'),
    _ = require('underscore');

//My code
var parseFileLine = require("./src/parseFileLine")(),
    buildInfoFromLines = require("./src/buildInfoFromLines")(parseFileLine, _),
    computeAFromInfo = require("./src/computeAFromInfo")(_),
    computeBFromInfo = require("./src/computeBFromInfo")(_),
    computeCFromInfo = require("./src/computeCFromInfo")(_),
    convertOutput = require("./src/convertOutput")(computeCFromInfo, _),
    pyShell = require("python-shell");

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
    console.log("Read main text data\n")
    var lines = (result.toString()).split("\n")
    buildInfoFromLines(lines, function(problemInfo) {

        async
            .series([
                generateB(problemInfo),
                generateC(problemInfo),
                generateA(problemInfo)
            ], function(err, results) {
                if (err) {
                    console.log("Failed on problem generation\n")
                    console.log(err)
                    return
                }

                var options = {
                    "scriptPath": "./src/python"
                }

                pyShell.run("solver.py", options, function(err, result){
                    console.log(result)
                    if (err) {
                        console.log("Received python err\n")
                        console.log(err)
                        return
                    }
                    console.log("Python solution generated.\n")
                    generateResult(problemInfo)
                })

            })

    })

})
//Generate A matrix and store it in data
var generateA = function(problemInfo) {
    return function(done) {
        computeAFromInfo.sparse(problemInfo, function(data){
            fs.writeFile("./data/A.json", new Buffer(JSON.stringify(data)), function(err){
                if (err) {
                    done(err, null)
                }
                console.log("Wrote A to json.\n")
                done(null)
            })
        })
    }
}
//Generate B vector and store it in data
var generateB = function(problemInfo) {
    return function(done) {
        computeBFromInfo.sparse(problemInfo, function(data){
            fs.writeFile("./data/B.json", new Buffer(JSON.stringify(data)), function(err){
                if (err) {
                    done(err, null)
                }
                console.log("Wrote B to json.\n")
                done(null)
            })
        })
    }
}
//Generate C vector and store it in data
var generateC = function(problemInfo) {
    return function(done) {
        computeCFromInfo.sparse(problemInfo, function(data){
            fs.writeFile("./data/C.json", new Buffer(JSON.stringify(data)), function(err){
                if (err) {
                    done(err, null)
                }
                console.log("Wrote C to json.\n")
                done(null)
            })
        })
    }
}

var generateResult = function(problemInfo) {
    fs.readFile("./data/X.json", function(err, data) {
        if (err) {
            console.log("Error reading result assignment\n")
            console.log(err)
            return
        }

        var soln = convertOutput(problemInfo, JSON.parse(data))
        var longString = soln.join("\n")
        fs.writeFile("./data/solution.txt", new Buffer(longString), function(err) {
            if (err) {
                console.log("Error writing solution to file")
                console.log(err)
                return
            }
            console.log("Wrote solution to solution.txt.\n")
        })

    })
}
