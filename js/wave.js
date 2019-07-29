class Wave 
{
    constructor() 
    {
        this.m_data = [];
        this.m_relations = [];
        this.m_result = [];
        this.m_size = 0;
        this.entropies = new HEAP();
    }


    // neighboor constrain structure:
    // {
    //    from: curentBlockID
    //    to: nextBlockID
    //    dir: [direction which constrain exist]
    LoadConstrainsByNeighboors(neighboors) 
    {
        for (var i = 0; i < neighboors.length; i++)
        {
            for (var j = 0; j < neighboors[i].dirs.length; j++)
            {
                this.status[neighboors[i].dirs[j]][neighboors[i].from][neighboors[i].to] = true;
            }
        }
    }

    Load() 
    {
        this.status = new bool[this.dirNum][this.patternNum][this.patternNum];
    }

    Select() 
    {
        var entropyArgMin = this.entropies.GetMin();
        this.m_slots[entropyArgMin].GeneratingPattern();
    }

    Influence() {
        
    }

    Generating()
    {
        for (var i = 0; i < this.m_size; i++) 
        {
            var currentGeneratingItem = this.Pop();
            if (currentGeneratingItem.Select()) 
            {
                this.m_result.push(currentGeneratingItem);
                wave.Influence();
            } 
            else 
            {
                return false;
            }
        }
        return true;
    }

    Output() 
    {

    }

    Pop() {

    }
}

// Wave.Pop = function() {

// }