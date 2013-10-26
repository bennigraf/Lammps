var spi = require('spi');

// constructor
// conntects to rf via spi-device given in path (on rpi: /dev/spidev0.0 or 0.1);
function RF(spiPath) = {
	this.device = new spi.Spi(spiPath);
	this.device.open();
}


// read a register at a address (up to 5 bytes...) and return numDataBytes to Callback...
RF.prototype.readRegister = function(addr, numDataBytes, callback) {
	var txbuf = new Buffer(this.R_REGISTER);
	var rxbuf = txbuf;
	
	spi.transmit(txbuf, rxbuf, function(dev, buf) {
		callback(buf);
	});
}

// set a register at a address (with up to 5 bytes...)
// addr: byte (0-31 in dec)
RF.prototype.setRegister = function(addr, data, callback) {
	// erm...
	// just set data bytes here, take care of not overwriting flags somewhere else...
}

RF.prototype.sendData = function() {
	// sends a packet with up to 32 bytes
}

// short helper-functions to not have to set the register manually...
RF.prototype.setAddress = function() {
	
}
RF.prototype.setChannel = function() {
	
}

RF.prototype.speed = function(spd) {
	// this.setRegister...
}

RF.CMDS = {
	RF.R_REGISTER: [0x00], // 000A AAAA -> AAAAA is the register address
	RF.W_REGISTER: [0x20], // 001A AAAA -> s.o.
	RF.R_RX_PAYLOAD: [0x61], // 0110 0001, read RX payload
	RF.W_TX_PAYLOAD: [0xA0], // 1010 0000, write TX payload
	RF.FLUSH_TX: [0xE1], // 1110 0001;
	RF.FLUSH_RX: [0xE2], // 1110 0010;
	RF.R_RX_PL_WID: [0x60], // 0110 0000; Read RX payload width
	RF.W_ACK_PAYLOAD: [0xA8], // 1010 1PPP; P is a pipe...
	RF.W_TX_PAYLOAD_NO_ACK: [0xB0], // 1011 0000; No ack on next packet...
	RF.NOP: [0xFF], // NO OPERATION! Love this! (Used to read out status byte...)
};

// don't know how to deal with this stuff yet... see here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FOperators%2FBitwise_Operators
RF.RM = {
	MASK_RX_DR: [0x00, ]
}
























