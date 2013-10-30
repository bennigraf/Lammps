
// fake gpio module providing the right hooks to work without the hardware being available
function Gpio() {
	console.log("==Fake GPIO inited!");
}

Gpio.prototype.setup = function() {
	console.log("==Fake GPIO setup call");
}

Gpio.prototype.write = function(pin, val, callback) {
	console.log("==write gpio: "+pin+", "+val);
	if(callback) { callback(); }
}

Gpio.DIR_OUT = 'out';

module.exports = new Gpio;