
// var RF = require('../soft-rf24/soft-rf24.js');
var Module = require('./module.js');
try {
	NRF24 = require('nrf');
} catch (e) {
	console.log("NRF COULD NOT BE LOADED! Using fake nrf module for testing purposes...");
	console.log(e)
	NRF24 = require('./fake-nrf.js');
	console.log(NRF24);
	NRF24 = NRF24["NRF24"];
	NRF24 = new NRF24;
}

// export stuff...
module.exports = MM;


function MM () {
	// setup module manager
	
	/*
	this.rf = new RF("/dev/spidev0.0");
	this.rf.on('ready', function() {
		this.rf.setAddrWidth(5); 			// address width - 5 bytes
		this.rf.setTxAddress(17449370420);	// tx address
		this.rf.setRxAddress(0, 0);			// rx address on pipe 0 ("broadcast")
		this.rf.setChannel(125);			// channel
		this.rf.setAutoAck(0, 0);			// no auto ack on pipe 0
		this.rf.setAutoAck(1, 0);			// no auto ack on pipe 1
		this.rf.setRate(2);					// tx rate - 2mbit
		this.rf.setTxPower(3);				// tx amp - 0dbm
		this.rf.setCRC(1, 1);				// crc - enabled, 2byte
	
		this.rf.setDynPdTx(1);				// dynpd on transmission enabled
		this.rf.setDynPdRx(0, 1);			// dynpd on rx pipe 0 enabled
		this.rf.setDynPdRx(1, 1);			// dynpd on rx pipe 1 enabled
		// this.rf.setRXTX(0);
	
		this.rf.setPayloadWidth(0, 32);		// seems to be necessary because the default pw of 0 disables the pipe
	
		this.rf.setPWR(1); 					// powers up
		this.rf.startAutoMode();	
	}.bind(this));
	this.rf.on('data', this.rcvData.bind(this));	
	 */
	
	// pin numbers from /sys/class/gpio numbering, I assume this: http://raspberrypiguide.de/howtos/raspberry-pi-gpio-how-to/
	var spidev = "/dev/spidev0.0", cePin = 24, irqPin = 25;
	console.log(NRF24);
	this.nrf = NRF24.connect(spidev, cePin, irqPin);
	this.nrf.channel(127).dataRate('2Mbps').crcBytes(2);
	this.nrf.begin();
	this.nrf.on('ready', function() {
		this.nrfRx = this.nrf.openPipe('rx', 0x0000000000, {autoAck: false}); // used to wait for registration requests
		// tx stuff only openend when neccessary...
	
		this.nrfRx.on('readable', function() {
			// process registration request
			var data = this.nrfRx.read();
			console.log("RX on pipe 0!", data);
			this.rcvData(0, data);
		}.bind(this));
	}.bind(this));
	
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

// process data recieved from a module
MM.prototype.rcvData = function(pipe, data) {
	console.log("data received!");
	console.log(data);

	// byte0: info byte
	// bit 7: startpacket of multi-packet-transaction (mask: 0x80)
	// bit 6: packet is part of --- " --- (mask: 0x40)
	// bit 5-0: (opt) payload with (mask: 0x1f)
	if(data[0] & 0x80) { // true if first bit is set
		this.newDataStack(data[0] & 0x1f);
		this.putDataOnStack(data);
	}
	if(data[0] & 0x40) { // true if 2nd bit is set
		this.putDataOnStack(data);
	}
	// TODO: Implement data stack... bang parsedata when stack has expected size; what happens if other packet interferes?? fuck...
	
	// no multipacket thing, parse data directly
	if((data[0] & 0x80) == 0) {
		this.parseData(data);
	}
}
// parse data received from a module
MM.prototype.parseData = function(data) {
	// byte1: command
	// 0x00: reboot/reset (of module, not cn)
	// 0x10: register module -- 5bytes guid, byte func_1, byte func_2, ..., byte func_n
	if(data[1] == 0x10) {
		this.registerModule(data);
	}
	
}

/* DEPRECATED */
MM.prototype.sendData = function(addr, data) {
	this.rf.setTxAddress(addr);
	this.rf.setRxAddress(0, addr); // pipe 0 needed to recv autoack
	// this.rf.setRXTX(1);
	// console.log(data);
	// this.rf.sendData(data);
	/* hack: empty tx fifo */
	// this.rf.spi.write(new Buffer([0xe1, 0x00])); // FLUSH_TX
	// this.rf.setRegister(0x07, 0x10); // MAX_RT
	// this.rf.sendToFifo(data);
	this.nrf.openPipe('tx', addr, {autoAck: false}).write(data);
}

// send a packet (or many depending on data length)
// addr: hardware-address to send to
// cmd: cmd to send (cmd-byte is byte 2)
// data: data-bytes...
MM.prototype.sendPacket = function(addr, cmd, data) {
	var pipe = this.nrf.openPipe('tx', addr, {autoAck: false});
	var infoByte = Buffer([this.makeInfoByte(data.length)]);
	var cmdByte = Buffer([cmd]);
	var data = Buffer.concat([infoByte, cmdByte, data]);
	console.log(data);
	pipe.write(data);
	pipe.close();
	// this.rf
}
MM.prototype.makeInfoByte = function(size) {
	var byte = 0x80 & 0x00 + 0x40 & 0x00 + 0x00; // TODO: implement multipacket-transactions...
	return byte;
}

MM.prototype.listModules = function() {
	var modules = this.modules;
	return modules;
}
MM.prototype.createFakeModules = function() {
	var fmods = [
		{ guid: 'xhhee', 'location': [0, 0], 'functions': [0x20, 0x30] }, // funcs: dim&col
		{ guid: 'ddwgq', 'location': [0, 1], 'functions': [0x20, 0x30] },
		{ guid: 'askwb', 'location': [1, 0], 'functions': [0x20, 0x30] },
		{ guid: 'icosz', 'location': [1, 0], 'functions': [0x40] } // funcs: snd
	];
	var data = new Buffer([0x10, 0x10]); // register module
	for (var i = 0; i < fmods.length; i++) {
		var mod = fmods[i];
		var guid = new Buffer(mod['guid']);
		var funs = mod['functions'];
		var funBytes = new Buffer(0);
		for (var j = 0; j < funs.length; j++) {
			funBytes = Buffer.concat([funBytes, new Buffer([funs[j]]) ]);
		}
		var thisdata = Buffer.concat([ data, guid, funBytes ]);
		this.registerModule(thisdata);
	}
	
}

MM.prototype.registerModule = function(data) {
	console.log("registering module");
	// 0x10: register module -- 5bytes guid, byte func_1, byte func_2, ..., byte func_n
	var guid = data.slice(2, 7); // should return 5 bytes of data;
	// if module with this guid is already registered, remove it from module list
	var oldmod = this.findByGUID(guid);
	if (oldmod !== null) {
		this.removeModule(oldmod);
	}
	
	var module = new Module(guid, this);
	// go through all function bytes, set all functions of module...
	for (var i = 7; i < data.length; i++) {
		module.addFunction(data[i]);
	}
	var address = this.generateAddress();
	module.address = address;
	
	this.modules.push(module);
	// console.log(this.modules);
	// console.log(module);
	
	// TODO: send packet back to module - info-byte, 0x01, (5bytes)guid, (5bytes)addr
}
MM.prototype.generateAddress = function() {
	var address = 0;
	while (address == 0) {
		// var address = Math.floor(Math.random() * 0xfffffffffe + 1); // 5-byte unsigned int excl. 1... :-)
		var address = Math.floor(Math.random() * 0x00fffffffe + 1); // 4-byte unsigned int excl. 1... :-)
		// check if address is taken already; if it is, repeat!
		for (var i = 0; i < this.modules.length; i++) {
			if(this.modules[i].address == address) {
				address = 0;
			}
		}
	}
	return address;
}

MM.prototype.removeModule = function(id) {
	// if(typeof id === 'Buffer')
	if(typeof id !== 'number') {
		// assume guid-buffer here, else take as literal index in modules array
		id = this.findByGUID(id);
	}
	this.modules.splice(id, 1);
}

MM.prototype.findByGUID = function(guid) {
	for (var i = 0; i < this.modules.length; i++) {
		if(this.modules[i].guid.toString() == guid.toString()) {
			return this.modules[i];
		}
	}
	return null;
}
/*
Usage:
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
