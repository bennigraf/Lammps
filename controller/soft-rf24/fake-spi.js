
// fake spi module providing the right hooks to work without the hardware being available
function Spi () {
	// console.log('==inited fake spi connection to path');
}

Spi.prototype.open = function () {
	// console.log("==opened fake spi...");
}

Spi.prototype.write = function(data, callback) {
	// console.log("==writing...");
	console.log(data);
	callback();
}

Spi.prototype.transfer = function(txbuf, rxbuf, callback) {
	// console.log("==transferring...");
	// console.log(txbuf);
	callback('dev', txbuf);
}

Spi.prototype.read = function(rxbuf, callback) {
	callback();
}


module.exports.Spi = Spi;