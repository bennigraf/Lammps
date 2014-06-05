
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
		switch (msg[0]) {
		case "/module/set":
			// msg[1] is all or module id, msg[2] is function, etc...
			var guid = msg[1];
			var func = msg[2];
			var data = msg.splice(3); // remove first 3 items
			if(guid=="all") {
				// set all modules
				// (don't check for fn here, it's being checked in Module.setData)
				for (var i = 0; i < lm.mm.modules.length; i++) {
					var guid = lm.mm.modules[i].guid;
					setData(guid, func, data);
				}
			} else {
				console.log("setting", guid, func, data);
				setData(guid, func, data);
			}
			break;
		default:
			
		}
	});
	
	function setData(guid, func, data) {
		switch (func) {
		case "dim":
			var val = data[0];
			lm.setdata(guid, "dim", val);
			break;
		case "rgb":
			var rgb = data;
			lm.setdata(guid, "rgb", rgb);
			break;
		}
	}
}
/*
/listmodules
	returns a list of modules known to the system
/scanmodules
	starts polling for new modules (unless this happens automagically)
/mode [online|offline]
	sets mode to online or offline. online is default; offline means that
	incoming data is being ignored to keep rf-device in rx-mode
/module/:moduleid/describe
	return describing data of the module (in what form??)
/module/:moduleid/get/function
	return functionalities of module (dim, color, sound, whatevs...)
/module/:moduleid/get/position
/module/:moduleid/get/...
	returns ...
/module/:moduleid/set/position x y
	set position of module in space, 0/0 being the central node maybe?
/modue/:moduleid/set/...
	set ...
	
/module/:moduleid/setdata :functionality :data
	set data to a specific functionality/protocol
 */