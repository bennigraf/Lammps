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

Module.prototype.setData = function(fn, data) {
	// console.log("setting data in module ", this.guid.toString());
	// console.log(fn, data);
	switch(fn) {
		case "rgb":
			this.sendColor(data);
			break;
	}
}

Module.prototype.sendColor = function(data) {
	// Assuming data is (number)rgb (0..1)...
	// make buffer out of it!!
	function toInt(num) {
		return Math.round(num*255);
	}
	var r = toInt(data[0]);
	var g = toInt(data[1]); 
	var b = toInt(data[2]);
	// var colrBuf = new Buffer(3);
	// hack: must have 15 clr bytes/17 bytes in total
	var colrBuf = new Buffer(15);
	colrBuf.fill(0x00);
	colrBuf[0] = r;
	colrBuf[1] = g;
	colrBuf[2] = b;
	// for (var i = 0; i < colrBuf.length; i++) {
	// 	colrBuf[i] = toInt(data[i%3]);
	// }
	this.mngr.sendPacket(this.address, 0x30, colrBuf);
	// this.mngr.sendData(this.address, dataBuf);
}