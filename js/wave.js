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
        this.m_deafultDirs = new Array(this.m_dirNum).fill(0).map((x, index) => { return index; });
        this.m_modules = []
        // this.entropies = new HEAP();
    }

    ReadTextFile(file)
    {
        var fs = require('fs');
        var contents = fs.readFileSync('./data/input.xml', 'utf8');
        return contents;
    }
    readTextFile(file)
    {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        var allText = "1";
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    allText = rawFile.responseText;
                    //alert(allText);
                }
            }
        }
        rawFile.send(null);
        return allText;
    }

    Load(fileName) 
    {
        //var parser = new DOMParser();
        var dom = new DOMParser();
        var body = this.readTextFile(fileName);
        var xmlDoc = dom.parseFromString(body, "application/xml").getElementById("main");
        var patterns = xmlDoc.getElementsByTagName("patterns")[0].getElementsByTagName("pattern");
        this.m_patternNum = patterns.length; 
        
        for (var i = 0; i < patterns.length; i++) 
        {
            this.m_patternNameMapping[patterns[i].getAttribute("name")] = i;
            this.m_patternsLinking.push(new Array(this.m_dirNum).fill(0).map(
                ()=>{return []}));
        }
        this.edges = xmlDoc.getElementsByTagName("edges")[0].getElementsByTagName("edge");
        
        for (var i = 0; i < this.edges.length; i++) 
        {
            var fromPatternIndex = this.m_patternNameMapping[this.edges[i].getAttribute("from")];
            var toPatternTags = this.edges[i].getElementsByTagName("to");
            var edgeType = this.edges[i].getAttribute("type");
            var dirs = this.m_deafultDirs;
            if (this.edges[i].getAttribute("dir") != "")
            {
                dirs = this.edges[i].getAttribute("dir").split(",");
            }
            
            for (var dirID = 0; dirID < dirs.length; dirID++)
            {
                for (var j = 0; j < toPatternTags.length; j++) 
                {
                    var toPatternIndex = this.m_patternNameMapping[toPatternTags[j].getAttribute("name")];
                    this.m_patternsLinking[fromPatternIndex][parseInt(dirs[dirID])].push(toPatternIndex);
                    if (edgeType == "undirect") 
                    { 
                        this.m_patternsLinking[toPatternIndex]
                            [this.m_oppositeDirID[parseInt(dirs[dirID])]].push(fromPatternIndex);
                    }
                }
            }
        }
        this.m_sizeX = xmlDoc.getAttribute("sizeX");
        this.m_sizeY = xmlDoc.getAttribute("sizeY");
        this.m_sizeModule = this.m_sizeX * this.m_sizeY;
        this.GraphInitialization();
    }

    moduleIDToPosition(moduleID) 
    {
        return [Math.floor(moduleID / this.m_sizeY), moduleID % this.m_sizeY];
    }

    positionToModuleID(pos)
    {
        return pos[0] * this.m_sizeY + pos[1];
    }

    InScope(pos)
    {
        return pos[0] >= 0 && pos[1] >= 0 && pos[0] < this.m_sizeX && pos[1] < this.m_sizeY;
    }

    GraphInitialization() 
    {
        // currentyly, only use 2d as main slot size
        // TODO: add 1 more dimension
        this.m_modules = new Array(this.m_sizeModule).fill(0).map(
            () => { return {
                "entropy": 0,
                "patternPossibility": 0,
                "result": -1,
                "patternStatus": new Array(this.m_patternNum).fill(false),
                "patternStatusNumInDir": new Array(this.m_dirNum).fill(0).map(
                    () => { return new Array(this.m_patternNum).fill(0)}),
                "patternStatusInDir": new Array(this.m_dirNum).fill(0).map(
                    () => {return new Array(this.m_patternNum).fill(0).map(
                        () => { return new Array(this.m_patternNum).fill(false);});}),
                "collapsed": false,
            }});
       
        for (var i = 0; i < this.m_sizeModule; i++)
        {
            var pos = this.moduleIDToPosition(i);
            for (var patternID = 0; patternID < this.m_patternNum; patternID++) {
                for (var dirID = 0; dirID < this.m_dirNum; dirID++) 
                {
                    var x = pos[0] + this.m_dir[dirID][0];
                    var y = pos[1] + this.m_dir[dirID][1];
                    var oppositeDirID = this.m_oppositeDirID[dirID];
                    var moduleID = this.positionToModuleID([x, y]);
                    if (this.InScope([x, y]))
                    {
                        for (var linkID = 0; linkID < this.m_patternsLinking[patternID][dirID].length; linkID++) {
                            
                            var toPatternID = this.m_patternsLinking[patternID][dirID][linkID];
                            
                            if (!this.m_modules[moduleID].patternStatusInDir
                                    [oppositeDirID][toPatternID][patternID])
                            {   
                                this.m_modules[moduleID].patternStatusNumInDir
                                    [oppositeDirID][toPatternID]++;

                                this.m_modules[moduleID].patternStatusInDir
                                    [oppositeDirID][toPatternID][patternID] = true;
                            }
                        }
                    }
                }
            }
        } 
        for (var moduleID = 0; moduleID < this.m_sizeModule; moduleID++)
        {
            var pos = this.moduleIDToPosition(moduleID);
            for (var patternID = 0; patternID < this.m_patternNum; patternID++)
            {
                var patternPermission = true;
                for (var dirID = 0; dirID < this.m_dirNum; dirID++)
                {
                    var x = pos[0] + this.m_dir[dirID][0];
                    var y = pos[1] + this.m_dir[dirID][1];
                    if (this.InScope([x, y]) && this.m_modules[moduleID].patternStatusNumInDir[dirID][patternID] == 0)
                    {
                        patternPermission = false;
                        break;
                    }
                }
                if (patternPermission)
                {
                    this.m_modules[moduleID].patternStatus[patternID] = true;
                    this.m_modules[moduleID].patternPossibility++;
                }
                else
                {
                    for (var dirID = 0; dirID < this.m_dirNum; dirID++)
                    {
                        this.m_modules[moduleID].patternStatusNumInDir[dirID][patternID] = 0;
                    }
                }
            }
            this.m_modules[moduleID].entropy = this.m_modules[moduleID].patternPossibility;
        }
    }

    Select() 
    {
        var minEntropy = 0; 
        var argminEntropy = -1;
        for (var i = 0; i < this.m_sizeModule; i++)
        {
            if (!this.m_modules[i].collapsed && (argminEntropy == -1 ||this.m_modules[i].entropy < minEntropy)) 
            {
                minEntropy = this.m_modules[i].entropy;
                argminEntropy = i;
            }
        }
        return argminEntropy;
    }

    removePatternByEdge(moduleID, dirID, patternID)
    {
        var oppositeDirID = this.m_oppositeDirID[dirID];
        for (var linkID = 0; linkID < this.m_patternsLinking[patternID][dirID].length; linkID++) 
        {
            var toPatternID = this.m_patternsLinking[patternID][dirID][linkID]; 
            if (this.m_modules[moduleID].patternStatusInDir[oppositeDirID][toPatternID][patternID])
            {
                this.m_modules[moduleID].patternStatusInDir[oppositeDirID][toPatternID][patternID] = false;
                this.m_modules[moduleID].patternStatusNumInDir[oppositeDirID][toPatternID]--;
                if (this.m_modules[moduleID].patternStatus[toPatternID] && 
                    this.m_modules[moduleID].patternStatusNumInDir[oppositeDirID][toPatternID] == 0)
                {
                    this.m_modules[moduleID].patternStatus[toPatternID] = false;
                    this.m_removingStack.push([moduleID, toPatternID]);
                }
            }
        }
    }

    reduceModulePossibility(collapseID, patternID)
    {
        var pos = this.moduleIDToPosition(collapseID);
        this.m_modules[collapseID].patternPossibility--;
        this.m_modules[collapseID].entropy--;
        this.m_modules[collapseID].patternStatus[patternID] = false;
        for (var dirID = 0; dirID < this.m_dirNum; dirID++)
        {    
            this.m_modules[collapseID].patternStatusNumInDir[dirID][patternID] = 0;
        }

        for (var dirID = 0; dirID < this.m_dirNum; dirID++)
        {
            var x = pos[0] + this.m_dir[dirID][0];
            var y = pos[1] + this.m_dir[dirID][1];
            if (this.InScope([x, y]))
            {
                var influencedModuleID = this.positionToModuleID([x, y]);
                if (!this.m_modules[influencedModuleID].collapseID)
                {
                    this.removePatternByEdge(influencedModuleID, dirID, patternID);        
                }
            }
        }
    }

    SelectModulePattern(collapseID)
    {
        // TODO: random pick based on possibility
        for (var patternID = 0; patternID < this.m_patternNum; patternID++)
        {
            if (this.m_modules[collapseID].patternStatus[patternID])
            {
                return patternID;
            }
        }
    }

    Influence(collapseID) 
    {
        this.m_modules[collapseID].collapsed = true;
        var patternID = this.SelectModulePattern(collapseID);
        this.m_modules[collapseID].result = patternID;
        this.m_removingStack = []
        for (var j = 0; j < this.m_patternNum; j++) 
        {
            if (this.m_modules[collapseID].patternStatus[j] && j != patternID)
            {
                this.m_modules[collapseID].patternStatus[j] = false;
                this.m_removingStack.push([collapseID, j])
            }
        }
        var removingIndex = 0;
        while (removingIndex < this.m_removingStack.length) 
        {
            this.reduceModulePossibility(
                this.m_removingStack[removingIndex][0], 
                this.m_removingStack[removingIndex][1]);
            removingIndex++;
        }
        
    }

    Generating()
    {
        this.m_exist = true;
        for (var i = 0; i < this.m_sizeModule; i++) 
        {
            this.Influence(this.Select());
            if (!this.m_exist)
            {
                return false;
            }
        }
        return true;
    }

    OutputToImage() 
    {
        var result = "";
        for (var i = 0; i < this.m_sizeModule; i++)
        {
            result += this.m_modules[i].result;
            if ((i + 1) % this.m_sizeX == 0)
            {
                result += "\n";
            } 
            else
            {
                result += ", ";
            }
        }
        console.log(result);
        return result;
    }
}

// Wave.Pop = function() {

// }
