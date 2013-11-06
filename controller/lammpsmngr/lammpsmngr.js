/*
Lammpsmngr calls modulemngr, manages all connections to the outside (DMX, MIDI, OSC, ...), 
provides JSon-API for GUI-stuff (which should be the same as the OSC-API)...
*/


module.exports = LM;

function LM() {
	
	var MM = require('../modulemngr/modulemngr.js');
	var mm = new MM();
	
	// OSC init...
	// OSC paths init...
	var osccli = require('./osccli.js');
	
	
	var wa = require('./webapp.js');
	console.log(wa);
	wa(this);
}

LM.prototype.api = {
	listmodules: function() {
		return modules;
	},
	module: function(id) {
		var module = new Array;
		if(id === undefined) { return false }
		for (var i=0; i < modules.length; i++) {
			if(modules[i]["id"] == id) {
				module = modules[i];
			}
		};
		return module;
	}
}


var modules = [
	{ title: 'module1', id: 'xhhe', 'location': [0, 0], 'functions': ["dim", "color"] },
	{ title: 'module2', id: 'ddwg', 'location': [0, 1], 'functions': ["dim", "color"] },
	{ title: 'module3', id: 'askw', 'location': [1, 0], 'functions': ["dim"] },
	{ title: 'module4', id: 'icos', 'location': [1, 0], 'functions': ["sound"] },
];
/*


API (to be implemented in OSC and JSON somehow...):
========

/listmodules
	returns a list of modules known to the system
/scanmodules
	starts polling for new modules (unless this happens automagically)
/mode [online|offline]
	sets mode to online or offline. online is default; offline means that
	incoming data is being ignored to keep rf-device in rx-mode
/module/:moduleid/describe
	return describing data of the module (in what form??)
/module/:moduleid/get/function
	return functionalities of module (dim, color, sound, whatevs...)
/module/:moduleid/get/position
/module/:moduleid/get/...
	returns ...
/module/:moduleid/set/position x y
	set position of module in space, 0/0 being the central node maybe?
/modue/:moduleid/set/...
	set ...
	
/module/:moduleid/setdata :functionality :data
	set data to a specific functionality/protocol



*/