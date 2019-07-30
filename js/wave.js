var DOMParser = require('xmldom').DOMParser;
class Wave 
{
    constructor() 
    {
        this.m_data = [];
        this.m_relations = [];
        this.m_result = [];
        this.m_size = 0;
        
        // this.entropies = new HEAP();
    }

    ReadTextFile(file)
    {
        var fs = require('fs');
        var contents = fs.readFileSync('./data/input.xml', 'utf8');
        return contents;
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
        var parser = new DOMParser();

        var xmlDoc = parser.parseFromString(this.ReadTextFile("../data/input.xml"));
        // console.log(xmlDoc.getElementsByTagName("tile")[0].getAttribute("name"));
        this.testTmp = xmlDoc.getElementsByTagName("tile");
        console.log(this.testTmp.length);
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

module.exports = {}
module.exports.Wave = Wave;