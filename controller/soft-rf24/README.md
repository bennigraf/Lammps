**IN PROGRESS! NOT FUNCTIONAL YET!**

SOFT-RF24
=========

A NodeJS interface to use a nrf24l01+ wireless module using the spi library by @RussTheAerialist and the gpio library xxx. All functionality is implemented directly in node because it's easier for me than writing native C code, sorry folks. 

GPIO is needed for the CE signal which is used (additionally to the spi interface) to activate TX/RX mode of the chip.

IRQs are not used in this first version but may be added to receive data later. For now, we have to manually check for incoming data.

Basic Usage
===========

Todo...

API Reference
=============

Todo...

A certain functionality
-----------------------

Example:
```
Some example code...
```