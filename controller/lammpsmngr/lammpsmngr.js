/*
Lammpsmngr calls modulemngr, manages all connections to the outside (DMX, MIDI, OSC, ...), 
provides JSon-API for GUI-stuff (which should be the same as the OSC-API)...



API (to be implemented in OSC and JSON somehow...):
========

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