var RF = require('../soft-rf24/soft-rf24.js');

var rf = new RF("/dev/spidev0.0");

rf.on('ready', function() {
	console.log("set addr width");
	rf.setAddrWidth(5);
	console.log("set addr");
	rf.setTxAddress(13154403124);
	//console.log("set aa");
	rf.setAutoAck(0, 1);
	//console.log("set channel");
	//rf.setChannel(0);
	rf.setRate(2); // 2mbit
	rf.setPower(3); // 0dbm
	rf.setCRC(1, 0); // active, 2byte

	//rf.sendData(new Buffer([0x2d, 0x00, 0x00, 0xff]));
	// ...more setup stuff if needed...


	rf.readRegister(0x07, 1, function(buf) { 
		console.log("reading");
		console.log(buf) 
	});

	//rf.startAutoMode();
	
	rf.on('data', function(data) {
		console.log('data received');
	});
});

setTimeout(function(){
//	rf.sendToFifo(new Buffer([0x2d, 0x00, 0xff, 0x00]));
//	rf.sendToFifo(new Buffer([0x2d, 0x0f, 0x00, 0xf0]));
}, 2030);
