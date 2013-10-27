var SPI = require('spi');

var spi = new SPI.Spi('/dev/spidev0.0', {
    'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
    'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
  }, function(s){s.open();});

var txbuf = new Buffer([ 0x06, 0xff ]);
var rxbuf = new Buffer([ 0x00, 0x00 ]);

for(var i = 0; i < txbuf.length; i++) {
//	console.log(" " + txbuf[i].toString(2));
}

spi.transfer(txbuf, rxbuf, function(device, buf) {
    // rxbuf and buf should be the same here
       console.log(buf);
  });

//spi.write(txbuf, function(dev, buf2) {
//	for(var i = 0; i < buf2.length; i++)
//		console.log(buf2[i]);
//	console.log(buf2);
//});
