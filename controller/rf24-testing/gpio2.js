var gpio = require('rpi-gpio');

gpio.setup(18, gpio.DIR_OUT, write);

function write() {
    gpio.write(18, 0, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}