var express = require("express");
var router = express.Router();
const app = express();
const path = require("path");

router.get("/test", function(req,res) {
	res.sendFile(path.join(__dirname + "/index.html"));
});
	
app.use("/data", express.static(__dirname + "/data"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/", express.static(__dirname + "/"));
app.use("/", router);
app.listen(3011);

console.log('Running at Port 3011');

