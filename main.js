var wave = new Wave();

// load phase
wave.Load();

// generating phase
if (wave.Generating()) {
    // output phase
    wave.Output();
}

