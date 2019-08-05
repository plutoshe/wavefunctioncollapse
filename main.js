var wave = new Wave();

// load phase
wave.Load("../data/input_mine.xml");

// generate phase
wave.Generating();

// output image to file
wave.OutputToImage();
    