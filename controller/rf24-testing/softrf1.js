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
	rf.setAutoAck(0, 1);
// 	
// 	console.log("set channel");
	rf.setChannel(0);
// 	
// 	console.log("set rate");
	// rf.setRate(2); // 2mbit
	rf.setRate(1); // 1mbit
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
	// rf.setRegister(0x1d, 0x05);
	// rf.setRegister(0x1c, 0x3f);
	
	// payload width...
	rf.setRegister(0x11, 0x11); // 17byte...
// 	
// 
// 	rf.readRegister(0x07, 1, function(buf) { 
// 		console.log("reading");
// 		console.log(buf) 
// 	});

// 	console.log("set addr");
// 	// rf.setTxAddress(13154403124);
	// rf.setRxAddress(0, 17449370420);
	rf.setTxAddress(17449370420); // 04 10 10 43 34
	// rf.setTxAddress(224463425540); // 34 43 10 10 04
	rf.setRxAddress(0, 17449370420);
	
	// power it up!!
	rf.setPWR(1);


// 
	rf.startAutoMode();
// 	
	// rf.setRXTX(0);
// 	
	rf.on('data', function(pipe, data) {
		console.log('======================================data received');
		console.log("pipe: " +pipe);
		console.log(data);
	});
});

setTimeout(function(){
	var i = 0;
	setInterval(function() {
		i = i + 1;
		var buf = new Buffer(17);
		buf.fill(0x30);
		buf[0] = 0x00;
		buf[1] = 0x00;
		buf[2 + i%3] = 0xf0;
		/* hack: empty tx fifo */
		rf.spi.write(new Buffer([0xe1, 0x00])); // FLUSH_TX
		rf.setRegister(0x07, 0x10); // MAX_RT
		
		rf.sendToFifo(buf);
		
	}, 20);
}, 1030);
