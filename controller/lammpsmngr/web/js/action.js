$().ready(function(){
	// load navigation functionality
	
	$("body").on('click', "a.nav", function() {
		var elem = $(this);
		elem.parent().parent().find("li").removeClass('active');
		elem.parent().addClass('active');
		
		// unload content from all following columns
		elem.parents(".span3").nextAll().html("");
		load_to(elem.attr("href"), elem.parents(".span3").next());
		//
		
		return false;
	});
	
	var pages = new Array();
	function load_to(uri, target) {
		if(pages[uri] != undefined) {
			var page = pages[uri]();
			if(page !== undefined) {
				target.haml(page);
			}
		} else {
			console.log(404, uri, "-- page not found!");
			// console.log(uri);
		}
	}
	
	pages["#/manage-system"] = function() {
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
		return content;
	}
	
	pages["#/manage-system/mode"] = function() {
		
		var content = ["%ul", {class: "nav nav-pills nav-stacked"},
			["%li", ["%a", {class: "nav", href: "#/manage-system/mode/offline"}, "Switch to offline mode"]]
		];
		return content;
	}
	pages["#/manage-system/mode/offline"] = function() {
		// remove 
		$("#contentcolumns .span3:nth-child(3)").html("");
		return false;
	}
	pages["#/manage-system/mode/online"] = function() {
		// remove 
		$("#contentcolumns .span3:nth-child(3)").html("");
		return false;
	}
	
	
	pages["#/manage-modules"] = function() {
		var modules = $.get("/listmodules", {}, function(data, status) {
			console.log(data);
		}, "json");
	}
	
	
});