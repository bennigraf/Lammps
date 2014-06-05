/*
Module-object, that holds and tracks properties and functionalities of a single module managed
by modulemngr...
*/

module.exports = Module;

function Module (guid, mngr) {
	this.guid = guid;
	this.address = 0; // address is stored as number, not as buffer!
	this.functions = new Array(); // holds strings with functions, see funTable below...
	
	this.mngr = mngr; // reference to module manager, needed for callback to send data out
	
}

Module.prototype.addFunction = function(fn) {
	// functions (int-table)
	// 0-9 reserved for configuration purposes
	// 10: 	raw data
	// 20: 	dim
	// 21:	multi-dim
	// 30:	rgb
	// 31:	multi-rgb
	// 40:	sound/synth
	// TODO: define this elsewhere
	var funTable = {
		0x10: "raw",
		0x20: "dim",
		0x21: "multi-dim",
		0x30: "rgb",
		0x31: "multi-rgb",
		0x40: "sound"
	}
	this.functions.push(funTable[fn]);
}
// check if function is available for module
Module.prototype.hasFunction = function(fn) {
	for (var i = 0; i < this.functions.length; i++) {
		if(this.functions[i] == fn) {
			return true;
		}
	}
	return false;
}

Module.prototype.setData = function(fn, data) {
	// console.log("setting data in module ", this.guid.toString());
	// console.log(fn, data);
	if(this.hasFunction(fn)) {
		switch(fn) {
			case "rgb":
				this.sendColor(data);
				break;
			case "dim":
				this.sendDimValue(data);
				break;
		}
	}
}

Module.prototype.sendDimValue = function(data) {
	var dataBuf = new Buffer(1);
	dataBuf[0] = Math.round(data * 255);
	this.mngr.sendPacket(this.address, 0x20, dataBuf);
}
Module.prototype.sendColor = function(data) {
	// Assuming data is (number)rgb (0..1)...
	// make buffer out of it!!
	function toInt(num) {
		return Math.round(num*255);
	}
	var colrBuf = new Buffer(3);
	colrBuf.fill(0x00);
	colrBuf[0] = toInt(data[0]);
	colrBuf[1] = toInt(data[1]); 
	colrBuf[2] = toInt(data[2]);
	this.mngr.sendPacket(this.address, 0x30, colrBuf);
	// this.mngr.sendData(this.address, dataBuf);
}