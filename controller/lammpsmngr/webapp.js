
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
		lm.api.test();
	});
	
	app.get('/listmodules', function(req, res) {
		var modules = lm.api.listmodules();
		res.send(modules);
	});
	
	app.get('/modules/:id', function(req, res) {
		var id = req.params["id"];
		var module = lm.api.module(id);
		res.send(module);
	});
	

}