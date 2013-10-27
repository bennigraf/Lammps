var SPI = require('spi');
var gpio = require('rpi-gpio');

// ce: pin 25
gpio.setup(25, gpio.DIR_OUT, function(){ 
	console.log("gpio-output enabled!");
	gpio.write(25, 0, function() {
		console.log("written gpio!");
	});
} );

function ce(val, fn) {
	gpio.write(25, val, fn);
}

function setNrfReg(addr, val) {
	ce(0, function(){
		
	});

};




var spi = new SPI.Spi('/dev/spidev0.0', {
    'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
    //'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
  }, function(s){s.open();});

var txbuf = new Buffer([ 0x07, 0xff ]);
var rxbuf = new Buffer([ 0x00, 0x00 ]);

setTimeout(function(){

// 1ter
txbuf = new Buffer([ 0x30, 0x34, 0x43, 0x10, 0x10, 0x01, 0x2A, 0x34, 0x43, 0x10, 0x10, 0x01, 0x21, 0x01, 0x22, 0x01, 0x25, 0x00, 0x31, 0x04, 0x26, 0x07, 0x20, 0x0E ]);
rxbuf = txbuf;

console.log("boo");

spi.transfer(txbuf, rxbuf, function(device, buf) {
    // rxbuf and buf should be the same here
	console.log(buf);
});


// 2ter...
txbuf = new Buffer([0x2a, 0x34, 0x43, 0x10, 0x10, 0x01, 0xA0, 0x2d, 0x34, 0x12, 0x76 ]);
rxbuf = txbuf;

console.log("boo");

spi.transfer(txbuf, rxbuf, function(device, buf) {
    // rxbuf and buf should be the same here
        console.log(buf);
});

ce(1);

}, 100);

