
var RF = require('../soft-rf24/soft-rf24.js');
var Module = require('./module.js');

// export stuff...
module.exports = MM;


function MM () {
	// setup module manager
	
	this.rf = new RF("/dev/spidev0.0");
	// rf.startAutoMode();
	this.rf.setAddrWidth(5);
	this.rf.setTxAddress(0);
	this.rf.setChannel(0);
	this.rf.setAutoAck(0, 1);
	this.rf.setRate(2);
	this.rf.setPower(3);
	this.rf.setCRC(1, 0);
	this.rf.setRXTX(0);
	
	this.modules = new Array();



	this.modules["xhhe"] = new Module("xhhe", this);
	this.modules["xhhe"].address = 8859435828;
	this.modules["xhhe"].functions = ["color"];
	
	this.modules["ddwg"] = new Module("ddwg", this);
	this.modules["ddwg"].address = 13154403124;
	this.modules["ddwg"].functions = ["color"];
	
	this.modules["askw"] = new Module("askw", this);
	this.modules["askw"].address = 17449370420;
	this.modules["askw"].functions = ["color"];
	
	this.modules["icos"] = new Module("icos", this);
	
	
		// { title: 'module1', id: 'xhhe', 'location': [0, 0], 'functions': ["dim", "color"] },
		// { title: 'module2', id: 'ddwg', 'location': [0, 1], 'functions': ["dim", "color"] },
		// { title: 'module3', id: 'askw', 'location': [1, 0], 'functions': ["dim"] },
		// { title: 'module4', id: 'icos', 'location': [1, 0], 'functions': ["sound"] },
	// ];
}

MM.prototype.boot = function () {
	return false;
}

MM.prototype.sendData = function(addr, data) {
	this.rf.setTxAddress(addr);
	this.rf.setRXTX(1);
	console.log(data);
	this.rf.sendData(data);
}



/*
Useage:
mmngr = new ModuleManager();

// do setup tasks...
mmngr.findRFFreq(); // tries to find free channel with not much traffic...
mmngr.rf // access to rf module, if some special setup is needed...

// boot everything up!
mmngr.boot();

// ...waits for incoming module calls...
// on module-discovery, sets id & address, receives functionality, keeps dictionary of that...

mmngr.listModules() // returns list of known modules
mmngr.modules[id].properties // returns properties-object of a module
mmngr.modules[id].set(prop, data) // set property of a module, i.e. Position in space

mmngr.modules[id].setFun('rgb', [13, 88, 99]);




*/