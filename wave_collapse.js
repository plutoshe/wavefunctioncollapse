var waveCollapse = function(inputfile) {
    var wave = new Wave();

    // load phase
    wave.Load();

    // generating phase
    if (wave.Generating()) {
        // output phase
        wave.Output();
    }
}

var test = function(text) {
    return "test output " + text;
}

module.exports = {
    waveCollapse: waveCollapse,
    test: test,
}

