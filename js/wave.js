var DOMParser = require('xmldom').DOMParser;

class Wave 
{
    constructor() 
    {
        this.m_data = [];
        this.m_relations = [];
        this.m_result = [];
        this.m_size = 0;
        this.m_slots = {};
        this.m_oppositeDirID = [2,3,0,1]
        this.m_dir = [[0,1],[1,0],[0,-1],[-1,0]];
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

        var xmlDoc = parser.parseFromString(this.ReadTextFile("../data/input_mine.xml"));
        // console.log(xmlDoc.getElementsByTagName("tile")[0].getAttribute("name"));
        var slots = xmlDoc.getElementsByTagName("slots")[0].getElementsByTagName("slot");
        for (var i = 0; i < slots.length; i++) 
        {
            this.m_slots[slots[i].getAttribute("name")] = 
            {
                "linkedSlots": [[],[],[],[]],
            };
        }
        var edges = xmlDoc.getElementsByTagName("edges")[0].getElementsByTagName("edge");
        for (var i = 0; i < edges.length; i++) 
        {
            var fromSlotName = this.edges[i].getAttribute("from");
            var toSlotNames = this.edges[i].getElementsByTagName("to");
            var dirs = [0,1,2,3];
            var edgeType = this.edges[i].getElementsByTagName("type");
            if (this.edges[i].getAttribute("dir") != "")
            {
                dirs = this.edges[i].getAttribute("dir").split(",");
            }
            
            for (var dirID = 0; dirID < dirs.length; dirID++)
            {
                for (var j = 0; j < toSlotNames.length; j++) 
                {
                    this.m_slots[fromSlotName]["linkedSlots"][dirID].append(toSlotNames[j].getAttribute("name"));
                    if (edgeType == "undirect") 
                    { 
                        this.m_slots[toSlotNames[j].getAttribute("name")]["linkedSlots"][this.m_oppositeDirID[dirID]].append(fromSlotName);
                    }
                }
            }
        }
        this.m_sizeX = xmlDoc.getAttribute("sizeX");
        this.m_sizeY = xmlDoc.getAttribute("sizeY");
        this.m_slots = new Array(this.m_dir.length).fill(0).map(
            () => new Array(this.m_sizeX).fill(0).map(
                () => new Array(this.m_sizeY).fill({
                    influxDegree: 0,
                    inArray: [],
                })));
        this.m_entrop = new Array(this.m_sizeX).fill(0).map(
            () => new Array(this.m_sizeY).fill(0));
        for (var i = 0; i < this.m_sizeX; i++)
        {
            for (var j = 0; j < this.m_sizeY; j++)
            {
                for (var slot in this.m_slots) {
                    for (var dirID = 0; dirID < 3; dirID++) 
                    {
                        var x = i + this.m_dir[dirID][0];
                        var y = j + this.m_dir[dirID][1];
                        if (x >= 0 && y >= 0 && x < this.m_sizeX && y < this.m_sizeY)
                        {
                            this.m_status[dirID][x][y]["influxDegree"]++;
                            this.m_status[dirID][x][y]["inArray"].push.apply(
                                this.m_status[dirID][x][y]["inArray"],
                                this.m_slots[slot]["linkedSlots"][dirID]);
                            this.entropies[x][y] = this.m_status[dirID][x][y]["inArray"].length;
                        }
                    }
                }
            }
        }
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