**WORK IN PROGRESS! NOT FUNCTIONAL YET!**

SOFT-RF24
=========

A NodeJS interface to use a nrf24l01+ wireless module using the spi library by @RussTheAerialist and the gpio library xxx. All functionality is implemented directly in node because it's easier for me than writing native C code, sorry folks. 

GPIO is needed for the CE signal which is used (additionally to the spi interface) to activate TX/RX mode of the chip.

IRQs are not used in this first version but may be added to receive data later. For now, we have to manually check for incoming data.

BTW: There's no tolerance for faulty data yet, so use wisely!

**Consult the datasheet of the NRF24l01 for details on all functionality and how to configure it properly!**

Basic Usage
===========

```
var rf = RF("/dev/spidev0.0");
rf.setAddrWidth(3);
rf.setRxAddress(0, 13);
rf.setTxAddress(13);
// ...more setup stuff if needed...

var txbuf = new Buffer([0x03, 0xf3, 0x89]);
rf.transmit(buffer);

rf.receive(0, function(buf){
	console.log("Received data:");
	console.log(buf);
})
```

API Reference
=============

Initialisation:
---------------

* **new RF(spidev)**  
Creates a new instance. 
**spidev**: Path to spi device, i.e. /dev/spidev0.0 on a Raspberry Pi.

* **rf.transmit(buffer)**  
Transmits a buffer of up to 32 bytes. Bytes after that are dropped.  
**buffer**: A nodejs buffer (i.e. ```new Buffer([0x13, 0x13, ...])```), up to 32 bytes.

* **rf.receive(pipe, callback)**
Receive data from rf device. Checks for received data on the device first. Only gets the data if there is some. This has to be called manually, at some point there will be an event emitter (maybe even using the irq-pin of the nrf) in this implementation...  
**pipe**: The pipe to receive from (0 to 5).  
**callback**: The function called with the received data in a buffer as argument. Only gets called when there is data!


Module setup:
-------------

* **RF.setCRC(active, mode)**  
**active**: 0 or 1, enables or disables CRC  
**mode**: 0 => 1 byte crc, 1 => 2 byte crc

* **RF.setAddrWidth(width)**  
**width**: 3, 4 or 5 for 3, 4 or 5 bytes

* **RF.setRxAddress(pipe, addr)**    
Set the receiving address of a certain pipe (of which there are 6). Pipe 0 and 1 can use a full address, for byte 2 to 5 only the lsb can be configured, the msbs are taken from the address of pipe 1. **In case of doubt, set address width first!**  
**pipe**: The pipe to set the address to, 0 to 5  
**addr**: The address (integer), up to 16777215 (for 3 bytes) or 1099511627775 (for 5 bytes).

* **RF.setChannel(channel)**  
Set the radio channel of the device. It's calculated as 2.4GHz + n MHz. It's recommended to not use adjacent channels in 2 MBit-mode.  
**channel**: Channel to set to, 0 to 125.

* **RF.setRate(rate)**  
Set the transmission rate of the device.  
**rate**: The rate to set. 0 => 250kbit, 1 => 1mbit, 2 => 2mbit.

* **RF.setPower(power)**  
Set the transmission power of the device. Less power means less energy consumption while sending!  
**power**: The power to set. 0 => -18dbm, 1 => -12dbm, 2 => -6dbm, 3 => 0dbm.

* **RF.setAutoAck(pipe, active)**  
Enable or disable Auto Acknowledgement on a certain pipe.   
**pipe**: The pipe to use, 0 to 5.  
**active**: 1 => enable, 0 => disable.

* **RF.setTxAddress(addr)**  
Set the transmission address of the device. **Set address width first!**
**addr**: The address (integer), up to 16777215 (for 3 bytes) or 1099511627775 (for 5 bytes).


Example:
```
Some example code...
```