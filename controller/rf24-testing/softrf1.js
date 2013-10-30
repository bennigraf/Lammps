var RF = require('../soft-rf24/soft-rf24.js');

console.log(RF);

var rf = RF.RF("/dev/spidev0.0");

console.log(rf);

rf.setAddrWidth(5);
rf.setTxAddress(4564468532);
rf.setAutoAck(0, 1);
rf.setChannel(0);
rf.setRate(2); // 2mbit
rf.setPower(3); // 0dbm
rf.setCRC(1, 1); // active, 2byte

rf.sendData(new Buffer([0x2d, 0x00, 0x00, 0xff]));
// ...more setup stuff if needed...
