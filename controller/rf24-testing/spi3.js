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


// ce: pin 25
gpio.setup(18, gpio.DIR_OUT, function(){ 
	console.log("gpio-output enabled!");
	sendstuff();
} );

function ce(val, fn) {
	gpio.write(18, val, fn);
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

function sendstuff() {

	ce(0, function() {
		// setTimeout(function(){
			// trying to manually send shit here
			/*
			0x30, 0x34, 0x43, 0x10, 0x10, 0x01
			0x2A, 0x34, 0x43, 0x10, 0x10, 0x01
			0x20 + 0x01, 0x01
			0x20 + 0x02, 0x01
			0x20 + 0x05, 0
			0x20 + 0x11, 0x04
			0x20 + 0x06, 0x07
			0x20 + 0x00, 0x0E
			0x20 + 0x0A,0x34, 0x43, 0x10, 0x10, 0x01
			0xA0, 0x2D, 0x34, 0x12, 0x76
			*/
			function sendbuf (bufarr) {
				var txbuf = new Buffer(bufarr);
				var rxbuf = txbuf;
				// console.log(txbuf);
				spi.transfer(txbuf, rxbuf, function(dev, buf){ /*console.log(buf)*/ });
			}

			
			sendbuf([ 0x30, 0x34, 0x43, 0x10, 0x10, 0x01 ]);
			sendbuf([ 0x2A, 0x34, 0x43, 0x10, 0x10, 0x01 ]);
			sendbuf([ 0x20 + 0x01, 0x01 ]);
			sendbuf([ 0x20 + 0x02, 0x01 ]);
			sendbuf([ 0x20 + 0x05, 0x00 ]);
			sendbuf([ 0x20 + 0x11, 0x04 ]);
			sendbuf([ 0x20 + 0x06, 0x07 ]);
			sendbuf([ 0x20 + 0x00, 0x0E ]);
			sendbuf([ 0x20 + 0x0A, 0x34, 0x43, 0x10, 0x10, 0x01 ]);
			
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
				var r = (((i % 3) == 0) & 1) * 250/10;
				var g = (((i % 3) == 1) & 1) * 250/10;
				var b = (((i % 3) == 2) & 1) * 250/10;
				console.log(r, g, b);
				sendbuf([ 0xA0, 0x2D, 0x0+b, 0x0+g, 0x0+r ]);
				ce(1, function(){ /*console.log("ende");*/ ce(0); });
				
				i = i + 1;
			}, 500);


		// }, 100);
	});
	
}

