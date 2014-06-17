
/*
The Webapp!

Very simple express thingy which serves a default start page and then translates
simple json calls to the general api equivalent of the lammpsmngr.
*/


module.exports = function(lm) {
	
	var path = require('path');
	var express = require('express');
	var app = express();

	// make http server...
	app.listen(3000);
	
	// server 'static' content
	app.use(express.static(path.join(__dirname, 'web')));

	app.get('/', function(req, res) {
	    res.redirect('lammps.html');
	});

	app.get('/test', function(req, res) {
		lm.test();
	});
	
	app.get('/listmodules', function(req, res) {
		var modules = lm.listmodules();
		var myModules = [];
		for (var i = 0; i < modules.length; i++) {
			// create copy of modules here, otherwise I'd be modifying original module
			var m = modules[i];
			var title = "GUID: " + m['guid'][0] + ":" + m['guid'][1] + ":" + m['guid'][2] + ":" + m['guid'][3] + ":" + m['guid'][4];
			var guid = m['guid'][0] + ":" + m['guid'][1] + ":" + m['guid'][2] + ":" + m['guid'][3] + ":" + m['guid'][4];
			guid = guid.split(":").join("");
			// myModules.push({ 'title': m['guid'].toString(), 'guid': m['guid'], address: m['address'], functions: m['functions'] });
			myModules.push({ 'title': title, 'guid': guid, address: m['address'], functions: m['functions'] });
		}
		console.log(myModules);
		res.send(myModules);
	});
	
	app.get('/modules/:id', function(req, res) {
		var guid = req.params["id"].split("");
		var m = lm.getmodule(guid);
		// var myModule = { 'title': m['guid'].toString(), 'guid': m['guid'], address: m['address'], functions: m['functions'] };
		var title = "GUID: " + m['guid'][0] + ":" + m['guid'][1] + ":" + m['guid'][2] + ":" + m['guid'][3] + ":" + m['guid'][4];
		var myModule = { 'title': title, 'guid': m['guid'], address: m['address'], functions: m['functions'] };
		res.send(myModule);
	});
	
	app.get('/modules/:id/setdata', function(req, res) {
		var id = req.params["id"].split("");
		var func = req.query["function"];
		switch(func) {
			case "dim":
				lm.setdata(id, "dim", req.query["value"]);
				break;
			case "rgb":
				lm.setdata(id, "rgb", [req.query["r"], req.query["g"], req.query["b"]]);
				break;
		}
		res.send();
	});
	

}
