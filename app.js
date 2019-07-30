var express = require("express");
var route = express.Router();
var wave = require("./wave_collapse.js")
const app = express();
const path = require("path");

route.get("/test", function(req, res) {
    res.write(wave.test("aaaaaa"));
    res.end();
	//res.sendFile(path.join(__dirname + "/test3.html"));
});

app.use(route);
	
app.listen(3011);

console.log('Running at Port 3011');

