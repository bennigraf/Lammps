var gpio = require("pi-gpio");

gpio.open(15, "output", function(err) {     // Open pin 16 for output
    gpio.write(15, 0, function() {          // Set pin 16 high (1)
        gpio.close(15);                     // Close pin 16
    });
});
