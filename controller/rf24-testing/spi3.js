var SPI = require('spi');
var gpio = require('rpi-gpio');

// var gpio2 = require('pi-gpio');

// ce: pin 25
// gpio.setup(25, gpio.DIR_OUT, function(){ 
// 	console.log("gpio-output enabled!");
// 	sendstuff();
// } );
// gpio.setup(27, gpio.DIR_OUT, function(){
// 	gpio.write(27, 255);
// });

// function ce2(val, fn) {
// 	// gpio.write(25, val, fn);
// 	gpio2.open(15, "output", function(err) {     // Open pin 16 for output
// 	    gpio2.write(15, val, function() {          // Set pin 16 high (1)
// 	        gpio2.close(15);                     // Close pin 16
// 	    });
// 	});
// 	
// }
// 
// ce2(0);


// ce: pin 18
gpio.setup(18, gpio.DIR_OUT, function(){ 
	console.log("gpio-output enabled!");
	sendstuff();
	// ce(1);
} );

function ce(val, fn) {
	gpio.write(18, val, fn);
}

function setNrfReg(addr, val) {
	ce(0, function(){
		
	});

};


var LOUD = true;


var spi = new SPI.Spi('/dev/spidev0.0', {
    'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
    //'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
  }, function(s){s.open();});

var txbuf = new Buffer([ 0x07, 0xff ]);
var rxbuf = new Buffer([ 0x00, 0x00 ]);

function sendstuff() {

	ce(0, function() {
		// setTimeout(function(){
			// trying to manually send shit here
			/*
			0x30, 0x34, 0x43, 0x10, 0x10, 0x02
			0x2A, 0x34, 0x43, 0x10, 0x10, 0x02
			0x20 + 0x01, 0x01
			0x20 + 0x02, 0x01
			0x20 + 0x05, 0
			0x20 + 0x11, 0x04
			0x20 + 0x06, 0x07
			0x20 + 0x00, 0x0E
			0x20 + 0x0A,0x34, 0x43, 0x10, 0x10, 0x03
			0xA0, 0x2D, 0x34, 0x12, 0x76
			*/
			function sendbuf (comment, bufarr) {
				if(typeof comment !== 'string' && bufarr === undefined) { 
					bufarr = comment; 
					if(LOUD) { console.log("=== sending"); }
				} else {
					if(LOUD) { console.log("=== " + comment); }
				}
				var txbuf = new Buffer(bufarr);
				var rxbuf = txbuf;
				if(LOUD) { console.log(txbuf); }
				spi.transfer(txbuf, rxbuf, function(dev, buf){ 
					if(LOUD) { console.log(buf) }
				});
			}

			// enable aa
			// sendbuf("enable aa", [ 0x20 + 0x01, 0x01 ]);
			// disable aa (compatibility with nrf24l01?)
			sendbuf("disable aa", [ 0x20 + 0x01, 0x00]);
			
			// enable recv address
			sendbuf("enable rcv pipe", [ 0x20 + 0x02, 0x01 ]);
			
			// rf channel
			sendbuf("set rf channel", [ 0x20 + 0x05, 0x02 ]);
			
			// RX_PW_P0 (rx payload...)
			sendbuf([ 0x20 + 0x11, 0x20 ]); // 32 byte pw
			
			// RF_SETUP:
			// setup: 1mbit + 0dbm
			// sendbuf("1mbit + 0dbm", [ 0x20 + 0x06, 0x07 ]);
			// 1mbit -18dbm
			// sendbuf("1mbit -18dbm", [ 0x20 + 0x06, 0x00 ]);
			// 2mbit 0dbm
			sendbuf("2mbit + 0dbm", [ 0x20 + 0x06, 0x0e]);
			// 2mbit -18dbm:
			// sendbuf("2mbit -18dbm", [ 0x20 + 0x06, 0x08 ]);
			
			// CONFIG
			// crc, 2byte, pwrup, trx
			sendbuf([ 0x20 + 0x00, 0x0E ]);
			// crc 1byte pwrup trx
			// sendbuf([ 0x20 + 0x00, 0x0a]);
			// no crc, pwrup trx
			// sendbuf("nocrc", [ 0x20 + 0x00, 0x02 ]);
			
			// DPL
			// enable dpl
			// sendbuf([0x00 + 0x1d, 0x4]);
			
			//// ch0, 1mbit, crc 2byte
			//// oooder ch40, 2mbit, crc 2byte
			
			// dpl!!!
			sendbuf("enabling dpl", [0x20 + 0x1d, 0x05]); // globally enables dpl
			sendbuf("enabling dpl on pipes", [0x20 + 0x1c, 0x3f]); // enables dpl on all pipes
			
			
			// rx addr (again?)
			sendbuf("rxaddr", [ 0x20 + 0x0A, 0x34, 0x43, 0x10, 0x10, 0x04 ]);
			// tx addr
			sendbuf("tx addr", [ 0x30, 0x34, 0x43, 0x10, 0x10, 0x04 ]);
			// sendbuf("tx addr", [ 0x30, 0xe7, 0xe7, 0xe7, 0xe7, 0xe8 ]);
			
			// clock out status thingy, just for checking...
			sendbuf("check status...", [ 0x00 + 0x07, 0x00]);
			// check rf setup
			sendbuf("check rf setup...", [ 0x00 + 0x06, 0x00]);
			// check config
			sendbuf("check config", [ 0x00 + 0x00, 0x00]);
			// check aa
			sendbuf("check aa", [0x00 + 0x01, 0x00]);
			// check dpl
			sendbuf("check dpl", [0x00 + 0x1d, 0x00]);
			// check rxaddr
			sendbuf("check rxaddr", [0x10, 0x00, 0x00, 0x00, 0x00, 0x00]);
			// check chnl
			sendbuf("check channel", [0x00 + 0x05, 0x00]);
			
			var i = 0;
			// setInterval(function(){
			// 	// console.log("sending shit");
			// 	// ce(0, function(){console.log("anfang")});
			// 	var ph = i / Math.PI;
			// 	var r = Math.round((Math.sin(ph)/2+0.5) * 250);
			// 	var g = Math.round((Math.sin(ph + 1)/2+0.5) * 250);
			// 	var b = Math.round((Math.sin(ph + 2)/2+0.5) * 250);
			// 	sendbuf([ 0xA0, 0x2D, 0x01+b, 0x01+g, 0x01+r ]);
			// 	ce(1, function(){ /*console.log("ende");*/ ce(0); });
			// 	
			// 	i = i + 0.1;
			// }, 20);
			
			
			setInterval(function() {
				//check fifo...
				// sendbuf("check fifo", [0x00 + 0x17, 0x00 ]);
				
				var r = (((i % 3) == 0) & 1) * 250/10;
				var g = (((i % 3) == 1) & 1) * 250/10;
				var b = (((i % 3) == 2) & 1) * 250/10;
				// var buf = new Buffer(17);
				var buf = new Buffer(8);
				buf.fill(0x30);
				buf[0] = 0xa0;
				buf[1 + i%7] = 0xf0;
				sendbuf(buf);
				// sendbuf([ 0x00, 0x00, 0x0+r, 0x0+g, 0x0+b, 0x0f, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0x0f ]);
				//sendbuf([ 0x2d, 0x0+r, 0x0+g, 0x0+b ]);
				ce(1, function(){ 
					/*console.log("ende");*/ 
					// sendbuf([ 0x27, 0xff ]);
					ce(0); 
					// setTimeout(function(){ ce(0) }, 10);
				});
				
				i = i + 1;
			}, 100);


		// }, 100);
	});
	
}

