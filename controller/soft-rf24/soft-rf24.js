

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


// send a data packet of 1 to 32 bytes
function RF.prototype.transmit (buffer) {
	
}

// check for incoming data and read it
function RF.prototype.receive (pipe, callback) {
	var buffer;
	
	callback(buffer);
}

// set crc mode; (bool)active and (int)mode
function RF.prototype.setCRC (active, mode) {
	
}

// global address width (3 to 5 bytes)
function RF.prototype.addr_width(width) {
	
}

// recv address of specific pipe
function RF.prototype.rx_pipe_addr(pipe, addr) {
	
}

// set radio channel (0..125)
function RF.prototype.channel(channel) {
	
}

// set data rate (0..2, 250k..2M)
function RF.prototype.tx_rate(rate) {
	// body...
}

// set output power (0..4)
function RF.prototype.tx_power(power) {
	// body...
}

// manage auto-ack on specific pipe
function RF.prototype.autoack(pipe, active) {
	// body...
}

// set transmission address
function RF.prototype.tx_address (addr) {
	
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
// register addresses for configuration shit... to be ANDed with RF.CMDS.R_REGISTER and .W_REGISTER
RF.RMADDR = {
	CONFIG: 	[0x00], // general configuration
	EN_AA: 		[0x01], // Auto Ack (Enh. ShockBurst), enabled on all pipes by default
	EN_RXADDR: 	[0x02], // enable rx addresses/pipes, 0 and 1 are enabled by default
	SETUP_AW: 	[0x03], // Address width!
	SETUP_RETR: [0x04],	// automatic retransmission, delay and count
	RF_CH: 		[0x05], // Channel...
	RF_SETUP: 	[0x06],	// various setup stuff, data rate!!
	STATUS: 	[0x07],	// same as status sent during spi-cmd-byte
	OBSERVE_TX: [0x08],	// monitor transmission
	RPD: 		[0x09],	// received power detector
	RX_ADDR_P0: [0x0A],	// receive-address of pipe 0
	RX_ADDR_P1: [0x0B],	// receive-address of pipe 0
	RX_ADDR_P2: [0x0C],	// receive-address of pipe 0
	RX_ADDR_P3: [0x0D],	// receive-address of pipe 0
	RX_ADDR_P4: [0x0E],	// receive-address of pipe 0
	RX_ADDR_P5: [0x0F],	// receive-address of pipe 0
	TX_ADDR: 	[0x10], // transmit address
	RX_PW_P0: 	[0x11], // numbytes (received) in pipe 0 (1..32)
	RX_PW_P1: 	[0x12], // numbytes (received) in pipe 0 (1..32)
	RX_PW_P2: 	[0x13], // numbytes (received) in pipe 0 (1..32)
	RX_PW_P3: 	[0x14], // numbytes (received) in pipe 0 (1..32)
	RX_PW_P4: 	[0x15], // numbytes (received) in pipe 0 (1..32)
	RX_PW_P5: 	[0x16], // numbytes (received) in pipe 0 (1..32)
	FIFO_STATUS: [0x17], // fifo status... duh
	DYNPD: 		[0x1C],	// enable dynamic payload on pipes (disabled by default!)
	FEATURE: 	[0x1D], // special features :-) (dynamic payload, ack payload)
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
x check for incoming data on pipe and read it	=> RF.RMADDR.RX_PW_Pn + RF.CMDS.R_RX_PAYLOAD
x send data (addr, channel etc has been set)	=> RF.CMDS.W_TX_PAYLOAD + CE on high...
x Enable/Disable CRC, select 1- or 2-byte-crc 	=> RF.RMADDR.CONFIG + bit 3 and 2
x set global Address width (3-5 bytes)			=> RF.RMADDR.SETUP_AW (globally for all addresses)
x set receiving Address of specific pipe		=> RF.RMADDR.EN_RXADDR + RX_ADDR_Px
x set channel									=> RF.RMADDR.RF_CH
x set data rate									=> RF.RMADDR.RF_SETUP
x set output power (-18 to 0dbm)				=> RF.RMADDR.RF_SETUP
** (maybe combine data rate and power into one call?)
x Enable/Disable Auto-Ack on specific pipe 		=> RF.RMADDR.EN_AA + bit 5 to 0 for the 6 pipes
x set transmit address							=> RF.RMADDR.TX_ADDR

lo -----
* manage retransmission (delay, number of tries) => RF.RMADDR.SETUP_RETR
* maybe read receive-power						=> RF.RMADDR.RPD

* rx-mode: get into receiving mode and wait for incoming packets (maybe with irq??); only leave to transmit a packet


//














*/