require('../soft-rf24');

/*
Useage:
mmngr = new ModuleManager();

// do setup tasks...
mmngr.findRFFreq(); // tries to find free channel with not much traffic...
mmngr.rf // access to rf module, if some special setup is needed...

// boot everything up!
mmngr.boot();

// ...waits for incoming module calls...
// on module-discovery, sets id & address, receives functionality, keeps dictionary of that...

mmngr.listModules() // returns list of known modules
mmngr.modules[id].properties // returns properties-object of a module
mmngr.modules[id].set(prop, data) // set property of a module, i.e. Position in space

mmngr.modules[id].setFun('rgb', [13, 88, 99]);




*/