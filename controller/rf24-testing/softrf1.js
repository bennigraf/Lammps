var RF = require('../soft-rf24/soft-rf24.js');

var rf = new RF("/dev/spidev0.0");

rf.on('ready', function() {
	// rf.debug = true;
// 	
// 	
// 	// console.log("set addr width");
	rf.setAddrWidth(5);
// 	
// 	
// 	// console.log("set aa");
	rf.setAutoAck(0, 0);
	rf.setAutoAck(1, 0);
	rf.setAutoAck(2, 0);
	rf.setAutoAck(3, 0);
	rf.setAutoAck(4, 0);
	rf.setAutoAck(5, 0);
// 	
// 	console.log("set channel");
	rf.setChannel(2);
// 	
// 	console.log("set rate");
	rf.setRate(2); // 2mbit
// 	
// 	console.log("set power");
	rf.setPower(3); // 0dbm
// 	
// 	console.log("set crc");
	rf.setCRC(1, 1); // active, 2byte
// 
// 	//rf.sendData(new Buffer([0x2d, 0x00, 0x00, 0xff]));
// 	// ...more setup stuff if needed...
// 	
// 	console.log("dpl");
	rf.setRegister(0x1d, 0x05);
	rf.setRegister(0x1c, 0x3f);
	
	// payload width...
	// rf.setRegister(0x11, 0x20); // 32byte...
// 	
// 
// 	rf.readRegister(0x07, 1, function(buf) { 
// 		console.log("reading");
// 		console.log(buf) 
// 	});

// 	console.log("set addr");
// 	// rf.setTxAddress(13154403124);
	rf.setRxAddress(0, 17449370420);
	rf.setTxAddress(17449370420);
	
	// power it up!!
	rf.setPWR(1);


// 
	rf.startAutoMode();
// 	
	// rf.setRXTX(0);
// 	
// 	rf.on('data', function(data) {
// 		console.log('data received');
// 	});
});

setTimeout(function(){
	var i = 0;
	setInterval(function() {
		i = i + 1;
		var buf = new Buffer(12);
		buf.fill(0x30);
		buf[1 + i%7] = 0xf0;
		rf.sendToFifo(buf);
		// rf.setRXTX(0);
		// rf.sendData(buf);
		// rf.setRXTX(1);
		// rf.ce(1, function() {rf.ce(0)});
	}, 10);
}, 1030);
