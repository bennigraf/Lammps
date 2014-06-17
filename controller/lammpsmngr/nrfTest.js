var spidev = "/dev/spidev0.0", cePin = 24, irqPin = 25;
var radio = require('nrf').connect(spidev, cePin, irqPin);
radio.channel(0x7d).dataRate('2Mbps').crcBytes(2).autoRetransmit({count:15, delay:4000});
radio.begin(function () {
    var rx = radio.openPipe('rx', new Buffer([0x00, 0x00, 0x00, 0x00, 0x00]));
        // tx = radio.openPipe('tx', 0xF0F0F0F0D2);
	radio.printDetails();
	rx.on('readable', function() {
		console.log("reading data", rx.read());
		radio.printDetails();
	});
	rx.on('error', function(e){ 
		console.log("Error in pipe", e);
	});
    //rx.pipe(tx);        // echo back everything
});
radio.on('error', function(e){
	console.log(e);
});