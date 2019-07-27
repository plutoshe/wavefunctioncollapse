var wave = new Wave();

// load phase


// generating phase
var hasSolution = true;
for (var i = 0; i < wave.size; i++) 
{
    var currentGeneratingItem = wave.Pop();
    
    if (currentGeneratingItem.Select()) 
    {
        wave.Influence(currentGeneratingItem);
    } 
    else 
    {
        hasSolution = false;
        break;
    }
}