var DOMParser = require('xmldom').DOMParser;

class Wave 
{
    constructor() 
    {
        this.m_data = [];
        this.m_relations = [];
        this.m_result = [];
        this.m_size = 0;
        this.m_patternNameMapping = {};
        this.m_patternsLinking = [];
        this.m_oppositeDirID = [2,3,0,1]
        this.m_dir = [[0,1],[1,0],[0,-1],[-1,0]];
        this.m_dirNum = this.m_dir.length;
        this.m_deafultDirs = new Array(thism_dirNum).fill(0).map((x, index) => { return index; });
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
        var patterns = xmlDoc.getElementsByTagName("patterns")[0].getElementsByTagName("pattern");
        this.m_patternNum = patterns.length; 
        for (var i = 0; i < patterns.length; i++) 
        {
            this.m_patternNameMapping[slots[i].getAttribute("name")] = i;
            this.m_patternsLinking.append(new Array(this.dirs.length).fill([]));
        }
        var edges = xmlDoc.getElementsByTagName("edges")[0].getElementsByTagName("edge");
        
        for (var i = 0; i < edges.length; i++) 
        {
            var fromPatternIndex = this.m_patternNameMapping[this.edges[i].getAttribute("from")];
            var toPatternTags = this.edges[i].getElementsByTagName("to");
            var edgeType = this.edges[i].getElementsByTagName("type");
            var dirs = this.m_deafultDirs;
            if (this.edges[i].getAttribute("dir") != "")
            {
                dirs = this.edges[i].getAttribute("dir").split(",");
            }
            
            for (var dirID = 0; dirID < dirs.length; dirID++)
            {
                for (var j = 0; j < toPatternTags.length; j++) 
                {
                    var toPatternIndex = this.m_patternNameMapping[toSlotNames[j].getAttribute("name")];
                    this.m_patternsLinking[fromPatternIndex][dirID].append(toPatternIndex);
                    if (edgeType == "undirect") 
                    { 
                        this.m_patternsLinking[toPatternIndex]
                            [this.m_oppositeDirID[dirID]].append(fromPatternIndex);
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
                "patternStatusNumInDir": new Array(this.dir.length).fill(new Array(this.m_patternNum).fill(0)),
                "patternStatusInDir": new Array(this.dir.length).fill(0).map(
                    () => {
                        return new Array(this.m_patternNum).fill(new new Array(this.m_patternNum).fill(false));
                    },
                ),
                "collapsed": false,
            });
        for (var i = 0; i < this.m_sizeX; i++)
        {
            for (var j = 0; j < this.m_sizeY; j++)
            {
                for (var patternID = 0; patternID < this.m_patternNum; patternID++) {
                    for (var dirID = 0; dirID < this.m_dirNum; dirID++) 
                    {
                        var x = i + this.m_dir[dirID][0];
                        var y = j + this.m_dir[dirID][1];
                        var moduleID = positionToModuleID([x, y]);
                        if (x >= 0 && y >= 0 && x < this.m_sizeX && y < this.m_sizeY)
                        {
                            for (var linkID = 0; linkID < this.m_patternsLinking[patternID][dirID].length; linkID++) {
                                var toPatternID = this.m_patternsLinking[patternID][dirID][linkID];
                                if (!this.m_modules[moduleID].patternStatusInDir
                                        [dirID]
                                        [toPatternID]
                                        [patternID])
                                {
                                    if (this.m_modules[moduleID].patternStatusNumInDir
                                        [dirID]
                                        [toPatternID] == 0)
                                    {
                                        this.m_modules[moduleID].patternPossibility[dirID]++;   
                                    }
                                    this.m_modules[moduleID].patternStatusNumInDir
                                        [dirID][toPatternID]++;

                                    this.m_modules[moduleID].patternStatusInDir
                                        [dirID][toPatternID][patternID] = true;
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
        for (var i = 0; i < this.m_modules.length; i++)
        {
            if (!this.m_modules[i].collapsed && this.m_modules[i].entropy < minEntropy) 
            {
                minEntropy = this.m_modules[i].entropy;
                argminEntropy = i;
            }
        }
        return i;
    }

    removePatternByEdge(moduleID, dirID, patternID)
    {
        for (var linkID = 0; linkID < this.m_patternsLinking[patternID][dirID]; linkID) 
        {
            if (this.m_modules[moduleID].patternStatusInDir[dirID][toPatternID][patternID])
            {
                this.m_modules[moduleID].patternStatusInDir[dirID][toPatternID][patternID] = false;
                this.m_modules[moduleID].patternStatusNumInDir[dirID][toPatternID]--;
                if (this.m_modules[moduleID].patternStatusNumInDir[dirID][toPatternID] == 0)
                {
                    this.m_removingStack.append([moduleID, toPatternID]);
                    this.m_modules[moduleID].patternPossibility[dirID]--;
                    if (this.m_modules[moduleID].patternPossibility[dirID] == 0) {
                        this.m_exist = false;
                    }
                }
            }
        }
    }

    reduceModulePossibility(collapseID, patternID)
    {
        var pos = moduleIDToPosition(collapseID);
        for (var dirID = 0; dirID < this.m_dirNum; dirID++)
        {
            var x = pos[0] + this.dirs[dirID][0];
            var y = pos[1] + this.dirs[dirID][1];
            var influencedModuleID = positionToModuleID(x, y);
            removePatternByEdge(influencedModuleID, dirID, patternID);        
        }
        
    }

    Influence(collapseID) 
    {
        this.m_modules[i].collapsed = true;
        var patternID = SelectModulePattern(this.m_modules[collapseID]);
        this.m_removingStack = []
        for (var j = 0; j < this.m_slots.length; j++) 
        {
            it (this.m_modules[collapseID].patternPossibility[0][j] != 0)
            {
                this.m_removingStack.append([collapseID, j])
            }
        }
        removingIndex = 0;
        while (removingIndex < this.m_removingStack.length) 
        {
            this.reduceModulePossibility(this.m_removingStack[removingIndex][0], this.m_removingStack[removingIndex][1]);
            removingIndex++;
        }
        
    }

    Generating()
    {
        this.m_exist = true;
        for (var i = 0; i < this.m_size; i++) 
        {
            this.Influence(this.Select());
            if (!this.m_exist)
            {
                return false;
            }
        }
        return true;
    }

}

// Wave.Pop = function() {

// }

module.exports = {}
module.exports.Wave = Wave;