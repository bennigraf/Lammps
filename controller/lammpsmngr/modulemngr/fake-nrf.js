
var util = require("util");
var events = require("events");
util.inherits(NRF24, events.EventEmitter); // yay, events!


// fake spi module providing the right hooks to work without the hardware being available
function NRF24 () {
	console.log('==inited fake nrf');
	events.EventEmitter.call(this);
}

NRF24.prototype.connect = function(spidev, cePin, irqPin) {
	console.log("nrf connect", spidev, cePin, irqPin);
	return this;
}
NRF24.prototype.channel = function(chan) {
	console.log("set channel", chan);
	return this;
}
NRF24.prototype.dataRate = function(dr) {
	console.log("set data rate", dr);
	return this;
}
NRF24.prototype.crcBytes = function(b) {
	console.log("set crc bytes", b);
	return this;
}
NRF24.prototype.begin = function() {
	console.log("beginning");
	setTimeout(function() {
		this.emit('ready');
	}.bind(this), 300);
}

NRF24.prototype.openPipe = function(type, addr, options) {
	console.log("opened nrf pipe", type, addr, options);
	return this;
}

// this.nrfRx = this.nrf.openPipe('rx', 0x0000000000, {autoAck: false}); // used to wait for registration requests

module.exports.NRF24 = NRF24;