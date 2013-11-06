
/*
The OSC Server!

Very simple osc thingy which routes osc paths to calls to the generic api of
lammpsmngr.
*/


module.exports = function(lm) {
	
	var osc = require('node-osc');
	var oscServer = new osc.Server(13333, '0.0.0.0');

	oscServer.on("message", function (msg, rinfo) {
		console.log("Message:");
		console.log(msg);
		
		// switch msg[0] (the path) from here on, maybe use express.js-routing?
	});

}