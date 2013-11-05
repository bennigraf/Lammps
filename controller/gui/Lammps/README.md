Lammps-Gui
==========

Provides a web interface to control the Lammp-System. Based on Express.js.

This needs:
-----------

- Modes/Toggles:
	- Offline-Mode (ignore incoming control data to not block communications)
	- Discovery-Mode? (or does this work automatically anyways??)
	- save state -- saves module configuration somehow (especially positions!)

- Functionality:
	- list discovered modules
	- show details of discovered module incl. functionality and stuff like 
	position
	- set details of module (position, functions)
	- show, erm, data flow somehow if possible...

This does:
----------

Provides just the interface. Makes AJAX-Calls to modulemngr or so (as osc replacement) to gather data.