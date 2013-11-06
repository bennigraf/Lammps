$().ready(function(){
	// load navigation functionality
	var router = Davis(function () {
		this.before(function(req) {
			req.path = req.path.replace("/lammps.html#", "");
		});
	});
	
	
	router.get("/manage-system", function() {
		var content = ["%ul", {class: "nav nav-pills nav-stacked"},
			// ["%li", 
			// 	["%form", 
			// 		["%label", {class: "checkbox"}, "Online", 
			// 			["%input", {type: "checkbox" }, "Hallo Wach!"]
			// 		]
			// 	]
			// ],
			["%li", ["%a", {class: "nav", href: "#/manage-system/mode" }, "Mode"]],
			["%li", ["%a", {class: "nav", href: "#/manage-system/rescan" }, "Rescan Modules"]],
			["%li", ["%a", {class: "nav", href: "#/manage-system/save" }, "Save State"]],
			["%li", ["%a", {class: "nav", href: "#/manage-system/load" }, "Load State"]],
			["%li", ["%a", {class: "nav", href: "#/manage-system/reset" }, "Reset System"]],
		];
		$("#contentcolumns .span3:nth-child(2)").haml(content);
	})
	
	router.get("/manage-system/mode", function() {
		var content = ["%ul", {class: "nav nav-pills nav-stacked"},
			["%li", ["%a", {class: "nav", href: "#/manage-system/mode/offline"}, "Switch to offline mode"]]
		];
		$("#contentcolumns .span3:nth-child(3)").haml(content);
	})
	router.get("/manage-system/mode/offline", function() {
		// remove 
		$("#contentcolumns .span3:nth-child(3)").html("");
		return false;
	});
	router.get("/manage-system/mode/offline", function() {
		// remove 
		$("#contentcolumns .span3:nth-child(3)").html("");
		return false;
	});
	
	
	router.get("/manage-modules", function() {
		var modules = $.get("/listmodules", {}, function(data, status) {
			var modules = data;
			var haml_modules = new Array();
			for (var i=0; i < modules.length; i++) {
				var title = modules[i].title;
				var id = modules[i].id;
				var haml = ["%li", ["%a", {class: "nav", href: "#/manage-modules/modules/"+id }, title]];
				haml_modules.push(haml);
			};
			
			var haml = ["%ul", {class: "nav nav-pills nav-stacked" },
				haml_modules,
			];
			$("#contentcolumns .span3:nth-child(2)").haml(haml);
		}, "json");
	});
	
	
});