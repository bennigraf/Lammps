/*
Module-object, that holds and tracks properties and functionalities of a single module managed
by modulemngr...
*/

module.exports = Module;

function Module (id, mngr) {
	this.id = id;
	this.address = 0;
	this.functions = new Array();
	
	this.mngr = mngr; // reference to module manager, needed for callback to send data out
	
}


Module.prototype.setData = function(fn, data) {
	console.log(fn, data);
	switch(fn) {
		case "color":
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
	var fsize = 0x00; // 1st byte of packet
	var fn = 0x00; // 2nd byte of packet
	var r = toInt(data[0]);
	var g = toInt(data[1]); 
	var b = toInt(data[2]);
	var dataBuf = new Buffer([fsize, fn, r, g, b]);
	this.mngr.sendData(this.address, dataBuf);
}