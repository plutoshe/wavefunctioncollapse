var Wave = require("./js/wave.js");
var waveCollapse = function(inputfile) {
    var wave = new Wave.Wave();

    // load phase
    wave.Load("../data/input_mine.xml");
    return wave.testTmp;
    // generating phase
    // if (wave.Generating()) {
    //     // output phase
    //     wave.Output();
    // }
}

var test = function(text) {
    return "test output " + text;
}

module.exports = {
    waveCollapse: waveCollapse,
    test: test,
}

