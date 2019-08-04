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
        this.m_deafultDirs = new Array(this.dirs.length).fill(0).map((x, index) => { return index; });
        // this.entropies = new HEAP();
    }

    ReadTextFile(file)
    {
        var fs = require('fs');
        var contents = fs.readFileSync('./data/input.xml', 'utf8');
        return contents;
    }

    Load(fileName) 
    {
        var parser = new DOMParser();

        var xmlDoc = parser.parseFromString(this.ReadTextFile(fileName))
        // console.log(xmlDoc.getElementsByTagName("tile")[0].getAttribute("name"));
        var slots = xmlDoc.getElementsByTagName("slots")[0].getElementsByTagName("slot");
        var index = 0;
        for (var i = 0; i < slots.length; i++) 
        {
            this.m_slots[slots[i].getAttribute("name")] = 
            {
                "index": index++,
                "linkedSlots": new Array(this.dirs.length).fill([]),
            };
        }
        var edges = xmlDoc.getElementsByTagName("edges")[0].getElementsByTagName("edge");
        
        for (var i = 0; i < edges.length; i++) 
        {
            var fromSlotName = this.edges[i].getAttribute("from");
            var toSlotNames = this.edges[i].getElementsByTagName("to");
            var edgeType = this.edges[i].getElementsByTagName("type");
            var dirs = this.m_deafultDirs;
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
                        this.m_slots[toSlotNames[j].getAttribute("name")]
                            ["linkedSlots"][this.m_oppositeDirID[dirID]].append(fromSlotName);
                    }
                }
            }
        }
        // currentyly, only use 2d as main slot size
        // TODO: add 1 more dimension
        this.m_sizeX = xmlDoc.getAttribute("sizeX");
        this.m_sizeY = xmlDoc.getAttribute("sizeY");
        this.m_sizeSlot = this.m_sizeX * this.m_sizeY;
        this.m_modules = new Array(this.m_sizeSlot).fill(
            {
                "entropy": 0,
                "patternPossibility": new Array(this.dirs.length).fill(0),
                "patternStatusNumInDir": new Array(this.dir.length).fill(new Array(this.m_slots.length).fill(0)),
                "patternStatusInDir": new Array(this.dir.length).fill(0).map(
                    () => {
                        return new Array(this.m_slots.length).fill(new new Array(this.m_slots.length).fill(false));
                    },
                ),
            });
        for (var i = 0; i < this.m_sizeX; i++)
        {
            for (var j = 0; j < this.m_sizeY; j++)
            {
                for (var slot in this.m_slots) {
                    for (var dirID = 0; dirID < this.dirs.length; dirID++) 
                    {
                        var x = i + this.m_dir[dirID][0];
                        var y = j + this.m_dir[dirID][1];
                        var moduleID = positionToSlotID([x, y]);
                        if (x >= 0 && y >= 0 && x < this.m_sizeX && y < this.m_sizeY)
                        {
                            for (var toSlotID = 0; toSlotID < slot.linkedSlots.length; toSlotID++) {
                                if (!this.m_modules[moduleID]["patternStatusInDir"]
                                    [this.m_slots[slot.linkedSlots[toSlotID]]["index"]]
                                    [slot["index"]])
                                {
                                    if (this.m_modules[moduleID].patternStatusNumInDir
                                        [this.m_slots[slot.linkedSlots[toSlotID]]["index"]] == 0)
                                    {
                                        this.m_modules[moduleID].patternPossibility++;   
                                    }
                                    this.m_modules[moduleID].patternStatusNumInDir
                                    [this.m_slots[slot.linkedSlots[toSlotID]]["index"]]++;

                                    this.m_modules[moduleID]["patternStatusInDir"]
                                    [this.m_slots[slot.linkedSlots[toSlotID]]["index"]]
                                    [slot["index"]] = true;
                                }
                            }
                            
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