
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
		res.send(modules);
	});
	
	app.get('/modules/:id', function(req, res) {
		var id = req.params["id"];
		var module = lm.getmodule(id);
		res.send(module);
	});
	
	app.get('/modules/:id/setdata', function(req, res) {
		var id = req.params["id"];
		var func = req.query["function"];
		var r = req.query["r"];
		var g = req.query["g"];
		var b = req.query["b"];
		switch(func) {
			case "color":
				lm.setdata(id, "color", [r, g, b]);
				break;
		}
		res.send();
	});
	

}