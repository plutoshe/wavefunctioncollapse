var express = require("express");
var route = express.Router();
var wave = require("./wave_collapse.js")
const app = express();
const path = require("path");

route.get("/test", function(req, res) {
   // console.log();

    var re = wave.waveCollapse();
    var result="";
    for (var i = 0; i < re.length; i++)
    {
        result += re[i].getAttribute("name") + " ";
    }
    res.write(result);
    res.end();
	//res.sendFile(path.join(__dirname + "/test3.html"));
});

app.use(route);
	
app.listen(3011);

console.log('Running at Port 3011');

