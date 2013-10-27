// var SPI = require('spi');

var gpio = require('rpi-gpio');

// ce: pin 25
gpio.setup(24, gpio.DIR_OUT, function(){ 
	console.log("gpio-output enabled!");
	gpio.write(24, 1);
} );

// gpio.open(15, "output", function(err) {     // Open pin 16 for output
//     gpio.write(15, 0, function() {          // Set pin 16 high (1)
//         gpio.close(15);                     // Close pin 16
//     });
// });


/*
gpio.setup(7, gpio.DIR_IN, readInput);

function readInput() {
    gpio.read(7, function(err, value) {
        console.log('The value is ' + value);
    });
}
*/
