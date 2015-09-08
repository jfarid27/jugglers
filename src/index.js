var argvs = require('minimist')(process.argv.slice(2)),
    async = require('async'),
    fs = require('fs'),
    _ = require('underscore');

//My code
var parseFileLine = require("./parseFileLine")(),
    buildInfoFromLines = require("./buildInfoFromLines")(parseFileLine, _);

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
        console.log(problemInfo.jugglers[8])
    })

})
//Generate A matrix and store it in data
var generateA = function(done) {

}
//Generate B vector and store it in data

//Generate C vector and store it in data

//When all that is complete call linear program to optimize
