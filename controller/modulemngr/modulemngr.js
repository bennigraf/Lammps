
var RF = require('../soft-rf24/soft-rf24.js');
var Module = require('./module.js');

// export stuff...
module.exports = MM;


function MM () {
	// setup module manager
	
	this.rf = new RF("/dev/spidev0.0");
	// rf.startAutoMode();
	this.rf.setAddrWidth(5);
	this.rf.setTxAddress(17449370420);
	this.rf.setRxAddress(0, 0);
	this.rf.setChannel(127);
	this.rf.setAutoAck(0, 0);
	this.rf.setRate(2);
	this.rf.setPower(3);
	this.rf.setCRC(1, 1);
	// this.rf.setRXTX(0);
	
	this.rf.startAutoMode();
	this.rf.on('data', this.rcvData);
	
	this.modules = new Array();



	// this.modules["xhhe"] = new Module("xhhe", this);
	// this.modules["xhhe"].address = 8859435828;
	// this.modules["xhhe"].functions = ["color"];
	// 
	// this.modules["ddwg"] = new Module("ddwg", this);
	// this.modules["ddwg"].address = 13154403124;
	// this.modules["ddwg"].functions = ["color"];
	// 
	// this.modules["askw"] = new Module("askw", this);
	// this.modules["askw"].address = 17449370420;
	// this.modules["askw"].functions = ["color"];
	// 
	// this.modules["icos"] = new Module("icos", this);
	
	
		// { title: 'module1', id: 'xhhe', 'location': [0, 0], 'functions': ["dim", "color"] },
		// { title: 'module2', id: 'ddwg', 'location': [0, 1], 'functions': ["dim", "color"] },
		// { title: 'module3', id: 'askw', 'location': [1, 0], 'functions': ["dim"] },
		// { title: 'module4', id: 'icos', 'location': [1, 0], 'functions': ["sound"] },
	// ];
}

MM.prototype.boot = function () {
	return false;
}

MM.prototype.rcvData = function(data) {
	console.log("data received!");
	console.log(data);

	// byte0: info byte
	// bit 7: startpacket of multi-packet-transaction (mask: 0x80)
	// bit 6: packet is part of --- " --- (mask: 0x40)
	// bit 5-0: (opt) payload with (mask: 0x1f)
	if(data[0] & 0x80) {
		this.newDataStack(data[0] & 0x1f);
		this.putDataOnStack(data);
	}
	if(data[0] & 0x40) {
		this.putDataOnStack(data);
	}
	
	// no multipacket thing, parse data directly
	if(data[0] & 0x80 === 0) {
		this.parseData(data);
	}
}
MM.prototype.parseData = function(data) {
	// byte1: command
	// 0x00: reboot/reset (of module, not cn)
	// 0xa0: register module -- 5bytes guid, byte func_1, byte func_2, ..., byte func_n
	if(data[1] & 0xa0) {
		this.registerModule(data);
	}
	
}

MM.prototype.sendData = function(addr, data) {
	this.rf.setTxAddress(addr);
	this.rf.setRxAddress(0, addr); // pipe 0 needed to recv autoack
	// this.rf.setRXTX(1);
	// console.log(data);
	// this.rf.sendData(data);
	/* hack: empty tx fifo */
	// this.rf.spi.write(new Buffer([0xe1, 0x00])); // FLUSH_TX
	// this.rf.setRegister(0x07, 0x10); // MAX_RT
	this.rf.sendToFifo(data);
}

MM.prototype.registerModule = function(data) {
	// 0xa0: register module -- 5bytes guid, byte func_1, byte func_2, ..., byte func_n
	var guid = data.slice(2, 6); // should return 5 bytes of data;
	var module = new Module(guid);
	// go through all function bytes, set all functions of module...
	for (var i = 7; i < data.length; i++) {
		module.addFunction(data[i]);
	}
	var address = Module.getAddress(); // generates an address if none is set
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