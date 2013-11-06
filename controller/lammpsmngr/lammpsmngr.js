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
		var modules = {
			'module1': { 'location': [0, 0], 'functions': ["dim", "color"] },
			'module2': { 'location': [0, 1], 'functions': ["dim", "color"] },
			'module3': { 'location': [1, 0], 'functions': ["dim"] },
			'module4': { 'location': [1, 0], 'functions': ["sound"] },
		}
		return modules;
	}
}

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