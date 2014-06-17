$().ready(function(){
	
	function free_cols (col) {
		for (var i=col; i <= 4; i++) {
			free_col(i);
		};
	}
	function free_col (col) {
		$("#contentcolumns .span3:nth-child("+col+")").html("");
	}
	// load navigation functionality
	var router = Davis(function () {
		this.configure(function () {
			// this.raiseErrors = false;
			// this.handleRouteNotFound = false;
			// this.linkSelector = "a.whatevs";
		});
		
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
		free_cols(2);
		$("#contentcolumns .span3:nth-child(2)").haml(content);
	})
	
	router.get("/manage-system/mode", function() {
		var content = ["%ul", {class: "nav nav-pills nav-stacked"},
			["%li", ["%a", {class: "nav", href: "#/manage-system/mode/offline"}, "Switch to offline mode"]]
		];
		free_cols(3);
		$("#contentcolumns .span3:nth-child(3)").haml(content);
	})
	router.get("/manage-system/mode/offline", function() {
		// remove 
		free_cols(3);
		return false;
	});
	router.get("/manage-system/mode/offline", function() {
		// remove 
		free_cols(3);
		return false;
	});
	
	
	router.get("/manage-modules", function() {
		var modules = $.get("/listmodules", {}, function(data, status) {
			console.log(status, data);
			var modules = data;
			var haml_modules = new Array();
			for (var i=0; i < modules.length; i++) {
				var id = modules[i].title;
				var title = modules[i].title;
				var haml = ["%li", ["%a", {class: "nav", href: "#/manage-modules/modules/"+guid }, title]];
				haml_modules.push(haml);
			};
			
			var haml = ["%ul", {class: "nav nav-pills nav-stacked" },
				haml_modules,
			];
			free_cols(2)
			$("#contentcolumns .span3:nth-child(2)").haml(haml);
		}, "json");
	});
	router.get("/manage-modules/modules/:id", function(res) {
		var id = res.params["id"];
		var module = $.get("/modules/"+id, function(data, status) {
			console.log(data);
			var module = data;
			
			var haml = ["%dl", 
						["%dt", "GUID"], ["%dd", module.title],
						// ["%dt", "ID"], ["%dd", module.id],
						// ["%dt", "Location"], ["%dd", module.location.join(", ")],
						["%dt", "Functionalities"], ["%dd", module.functions.join(", ")],
					];
			free_cols(3)
			var col = $("#contentcolumns .span3:nth-child(3)");
			col.haml(haml);
			// col.haml(["%h3", "Set values"]);
			
			// set sliders/handlers for functionalities...
			for (var i=0; i < module.functions.length; i++) {
				switch(module.functions[i]) {
					case "rgb":
						col.haml(["%h4", "Set color"]);
						col.haml(["%p", "Red", [".slider", {class: "rgb red"}]]);
						col.haml(["%p", "Green", [".slider", {class: "rgb green"}]]);
						col.haml(["%p", "Blue", [".slider", {class: "rgb blue"}]]);
						var setColor = function() {
							var rgb = get_rgb_values();
							console.log(rgb);
							$.get("/modules/"+id+"/setdata", {function: "rgb", r: rgb[0], g: rgb[1], b: rgb[2]});
						}
						function get_rgb_values() {
							var r = col.find(".slider.red").slider("value") / 100;
							var g = col.find(".slider.green").slider("value") / 100;
							var b = col.find(".slider.blue").slider("value") / 100;
							return [r, g, b];
						}
						col.find(".slider.rgb").slider().on('slide', setColor);
						col.find(".slider.rgb").slider().on('slidestop', setColor);
						break;
					case "dim":
						col.haml(["%h4", "Set value"]);
						col.haml(["%p", "Dim", [".slider", {class: "dim"}]]);
						var setValue = function() {
							var val = col.find(".slider.dim").slider("value") / 100;
							console.log(val);
							$.get("/modules/"+id+"/setdata", {function: "dim", value: val});
						}
						col.find(".slider.dim").slider().on('slide', setValue);
						col.find(".slider.dim").slider().on('slidestop', setValue);
						break;
					case "sound":
					
						break;
				}
			};
			col.haml([".slider"]);
			// col.find(".slider").slider();
		}, "json");
	});
	
	
});