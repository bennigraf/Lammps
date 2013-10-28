

// NOT IN A WORKING STATE YET!!!!

var spi = require('spi');

// constructor
// conntects to rf via spi-device given in path (on rpi: /dev/spidev0.0 or 0.1);
function RF(spiPath) = {
	this.device = new spi.Spi(spiPath);
	this.device.open();
}


// read a register at a address (up to 5 bytes...) and return numDataBytes to Callback...
RF.prototype.readRegister = function(addr, numDataBytes, callback) {
	// ANDing addr with read command
	var cmd = new Buffer(this.R_REGISTER & addr);
	// padding with null bytes to receive data bytes
	var padbuf = new Buffer(numDataBytes)
	var txbuf = Buffer.concat([cmd, padbuf]);
	// copy rxbuf because it needs to be the same length (why not use spi.write here, would be the same...)
	var rxbuf = txbuf;
	// invoke spi, hand over to callback
	spi.transfer(txbuf, rxbuf, function(dev, buf) {
		console.log("wrote data, read register content is " + buf);
		callback(buf);
	});
}

// set a register at a address (with up to 5 bytes...)
// addr: byte (0-31 in dec)
RF.prototype.setRegister = function(addr, data, callback) {
	// erm...
	// just set data bytes here, take care of not overwriting flags somewhere else...
	var cmdbyte = this.W_REGISTER & addr;
	var txbuf = new Buffer([cmdbyte, data]);
	
	spi.write(txbuf, function (dev, buf) {
		console.log("successfully written data, cmd was: " + txbuf);
	})
}


// send a data packet of 1 to 32 bytes
function RF.prototype.transmit (buffer) {
	
}

// check for incoming data and read it
function RF.prototype.receive (pipe, callback) {
	var buffer;
	
	callback(buffer);
}

// set crc mode; (bool)active and (int)mode (0 -> 1 byte, 1 -> 2 byte)
// RF.RADDR.CONFIG + bit 3 and 2
function RF.prototype.setCRC(active, mode) {
	// read register
	this.readRegister(this.RADDR.CONFIG, 1, function(buf) {
		// buf[0] contains status byte I guess...
		var currentConf = buf[1];
		var newConf = this.setBit(currentConf, this.BITMASKS.EN_CRC, active);
		newConf = this.setBit(newConf, this.BITMASKS.CRCO, mode);
		this.setRegister(this.RADDR.CONFIG, newConf, function(){
			console.log("Set register" + this.RADDR.CONFIG + "to data" + newConf);
		});
	});
}

// global address width (3 to 5 bytes)
// RF.RADDR.SETUP_AW
function RF.prototype.setAddrWidth(width) {
	// just write width here because nothing else is stored in that register
	width = width - 2; // assuming width is (int)3..5, this translates to (int)1..3 in the register
	this.setRegister(this.RADDR.SETUP_AW, width, function() {
		console.log("New addr width set to mode: " + width);
	});
}

// receiving address of specific pipe
// RF.RADDR.EN_RXADDR + RX_ADDR_Pn
function RF.prototype.setRxAddress(pipe, addr) {
	// read register of active pipes  (EN_RXADDR)
	this.readRegister(this.RADDR.EN_RXADDR, 1, function(buf) {
		var currentConf = buf[1];
		// activate pipe (EN_RXADDR)
		var mask = 1 << pipe; // pipe 0 => lsb, pipe 5 => 00100000...
		var newConf = this.setBit(currentConf, mask, 1);
		this.setRegister(this.RADDR.EN_RXADDR, newConf, function(){
			console.log("Activated pipe" + pipe + "(mask "+mask.toString(2)+")");
			// set address (RX_ADDR_Pn)
			// address must be of correct length, so .setAddrWidth first
			// for pipe 2 to 5 one can only set the lsb, the rest is the same as in pipe 1
			// calc addr: dec to hex, but lsb first!?...laterbitches...
			this.setRegister(this.RADDR.RX_ADDR_P0 + pipe, )
		});
	});
	
}

// set radio channel (0..125)
// RF.RADDR.RF_CH
function RF.prototype.setChannel(channel) {
	this.setRegister(this.RADDR.RF_CH, channel, function() {
		console.log("Set channel to" + channel);
	})
}

// set data rate (0..2, 250k..2M)
// RF.RADDR.RF_SETUP
function RF.prototype.setRate(rate) {
	// read register
	this.readRegister(this.RADDR.RF_SETUP, 1, function(buf) {
		var currentConf = buf[1];
		// this register is a bit strange...:
		// 250k	bit RF_DR_LOW=>1, bit RF_DR_HIGH=>0
		// 1m	bit RF_DR_LOW=>0, bit RF_DR_HIGH=>0
		// 2m	bit RF_DR_LOW=>0, bit RF_DR_HIGH=>1
		var newConf;
		if(rate == 0) {
			newConf = this.setBit(currentConf, this.BITMASKS.RF_DR_LOW, 1);
			newConf = this.setBit(currentConf, this.BITMASKS.RF_DR_HIGH, 0);
		}
		if (rate == 1) {
			newConf = this.setBit(currentConf, this.BITMASKS.RF_DR_LOW, 0);
			newConf = this.setBit(currentConf, this.BITMASKS.RF_DR_HIGH, 0);
		}
		if (rate == 2) {
			newConf = this.setBit(currentConf, this.BITMASKS.RF_DR_LOW, 0);
			newConf = this.setBit(currentConf, this.BITMASKS.RF_DR_HIGH, 1);
		}
		this.setRegister(this.RADDR.RF_SETUP, newConf, function(){
			console.log("Set rf-rate to " + rate);
		});
	});
}

// set output power (0..3)
// RF.RADDR.RF_SETUP
function RF.prototype.setPower(power) {
	// read register
	this.readRegister(this.RADDR.RF_SETUP, 1, function(buf) {
		var currentConf = buf[1];
		var newConf;
		// obviously I don't really know how to handle bitmasks. Here I have to set
		// bit 2 and 1 to the binary value of power. I don't know how to do that less complicated...
		// mask for msb
		var mask1 = parseInt("00000100", 2);
		// mask for lsb
		var mask2 = parseInt("00000010", 2);
		// calc and set msb
		newConf = this.setBit(currentConf, mask1, (power >= 2) & 1);
		// calc and set lsb
		newConf = this.setBit(currentConf, mask2, power % 2);
		// write register
		this.setRegister(this.RADDR.RF_SETUP, newConf, function(){
			console.log("Set rf-power to " + rate);
		});
	});
}

// manage auto-ack on specific pipe
// RF.RADDR.EN_AA + bit 5 to 0 for the 6 pipes
function RF.prototype.setAutoAck(pipe, active) {
	this.readRegister(this.RADDR.EN_AA, 1, function(buf) {
		var currentConf = buf[1];
		var mask = 1 << pipe; // pipe 0 => lsb, pipe 5 => 00100000...
		var newConf = this.setBit(currentConf, mask, active);
		this.setRegister(this.RADDR.EN_AA, newConf, function(){
			console.log("Set Autoack on pipe" + pipe + " to "+active+"(mask:"+mask.toString(2)+")");
		});
	});
}

// set transmission address
// RF.RADDR.TX_ADDR
function RF.prototype.setTxAddress (addr) {
	
}





RF.CMDS = {
	RF.R_REGISTER: 0x00, // 000A AAAA -> AAAAA is the register address
	RF.W_REGISTER: 0x20, // 001A AAAA -> s.o.
	RF.R_RX_PAYLOAD: 0x61, // 0110 0001, read RX payload
	RF.W_TX_PAYLOAD: 0xA0, // 1010 0000, write TX payload
	RF.FLUSH_TX: 0xE1, // 1110 0001;
	RF.FLUSH_RX: 0xE2, // 1110 0010;
	RF.R_RX_PL_WID: 0x60, // 0110 0000; Read RX payload width
	RF.W_ACK_PAYLOAD: 0xA8, // 1010 1PPP; P is a pipe...
	RF.W_TX_PAYLOAD_NO_ACK: 0xB0, // 1011 0000; No ack on next packet...
	RF.NOP: 0xFF, // NO OPERATION! Love this! (Used to read out status byte...)
};

// don't know how to deal with this stuff yet... see here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FOperators%2FBitwise_Operators
// register addresses for configuration shit... to be ANDed with RF.CMDS.R_REGISTER and .W_REGISTER
RF.RADDR = {
	CONFIG: 	0x00, // general configuration
	EN_AA: 		0x01, // Auto Ack (Enh. ShockBurst), enabled on all pipes by default
	EN_RXADDR: 	0x02, // enable rx addresses/pipes, 0 and 1 are enabled by default
	SETUP_AW: 	0x03, // Address width!
	SETUP_RETR: 0x04,	// automatic retransmission, delay and count
	RF_CH: 		0x05, // Channel...
	RF_SETUP: 	0x06,	// various setup stuff, data rate!!
	STATUS: 	0x07,	// same as status sent during spi-cmd-byte
	OBSERVE_TX: 0x08,	// monitor transmission
	RPD: 		0x09,	// received power detector
	RX_ADDR_P0: 0x0A,	// receive-address of pipe 0
	RX_ADDR_P1: 0x0B,	// receive-address of pipe 0
	RX_ADDR_P2: 0x0C,	// receive-address of pipe 0
	RX_ADDR_P3: 0x0D,	// receive-address of pipe 0
	RX_ADDR_P4: 0x0E,	// receive-address of pipe 0
	RX_ADDR_P5: 0x0F,	// receive-address of pipe 0
	TX_ADDR: 	0x10, // transmit address
	RX_PW_P0: 	0x11, // numbytes (received) in pipe 0 (1..32)
	RX_PW_P1: 	0x12, // numbytes (received) in pipe 0 (1..32)
	RX_PW_P2: 	0x13, // numbytes (received) in pipe 0 (1..32)
	RX_PW_P3: 	0x14, // numbytes (received) in pipe 0 (1..32)
	RX_PW_P4: 	0x15, // numbytes (received) in pipe 0 (1..32)
	RX_PW_P5: 	0x16, // numbytes (received) in pipe 0 (1..32)
	FIFO_STATUS: 0x17, // fifo status... duh
	DYNPD: 		0x1C,	// enable dynamic payload on pipes (disabled by default!)
	FEATURE: 	0x1D, // special features :-) (dynamic payload, ack payload)
}

RF.BITMASKS = {
	EN_CRC: 	parseInt("00001000", 2),
	CRCO: 		parseInt("00000100", 2),
	RF_DR_LOW: 	parseInt("00010000", 2),
	RF_DR_HIGH:	parseInt("00000100", 2),
}


// Helper function to set specific bit (mask) in byte (byte) to bool value (value)
function RF.prototype.setBit(byte, mask, value) {
	var retByte;
	if(value == 1) { retByte = byte | mask; };
	if(value == 0) { retByte = byte & ~mask; };
	return retByte;
}



/*

To set a register: 
For configuration-flags:
1st byte: 	RF.W_REGISTER && REGISTER_ADDR
2nd byte: 	Read actual register byte; 
			Mod register byte with bitmask
			Write byte back
For pipe-addresses etc.:
1st byte: 	see above
nth byte: 	just the fucking bytes...


functionality (by priority):
Hi -----
x check for incoming data on pipe and read it	=> RF.RADDR.RX_PW_Pn + RF.CMDS.R_RX_PAYLOAD
x send data (addr, channel etc has been set)	=> RF.CMDS.W_TX_PAYLOAD + CE on high...
x Enable/Disable CRC, select 1- or 2-byte-crc 	=> RF.RADDR.CONFIG + bit 3 and 2
x set global Address width (3-5 bytes)			=> RF.RADDR.SETUP_AW (globally for all addresses)
x set receiving Address of specific pipe		=> RF.RADDR.EN_RXADDR + RX_ADDR_Px
x set channel									=> RF.RADDR.RF_CH
x set data rate									=> RF.RADDR.RF_SETUP
x set output power (-18 to 0dbm)				=> RF.RADDR.RF_SETUP
** (maybe combine data rate and power into one call?)
x Enable/Disable Auto-Ack on specific pipe 		=> RF.RADDR.EN_AA + bit 5 to 0 for the 6 pipes
x set transmit address							=> RF.RADDR.TX_ADDR

lo -----
* manage retransmission (delay, number of tries) => RF.RADDR.SETUP_RETR
* maybe read receive-power						=> RF.RADDR.RPD

* rx-mode: get into receiving mode and wait for incoming packets (maybe with irq??); only leave to transmit a packet


//














*/