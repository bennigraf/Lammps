var radio = require('nrf').connect(spiDev, cePin, irqPin);
radio.channel(0x7d).dataRate('2Mbps').crcBytes(2).autoRetransmit({count:15, delay:4000});
radio.begin(function () {
    var rx = radio.openPipe('rx', new Buffer([0x00, 0x00, 0x00, 0x00, 0x00]));
        // tx = radio.openPipe('tx', 0xF0F0F0F0D2);
	rx.on('readable', function() {
		console.log("reading data", rx.read());
		radio.printDetails();
	}
    rx.pipe(tx);        // echo back everything
});