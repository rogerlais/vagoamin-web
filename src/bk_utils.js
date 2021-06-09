function print(path, layer) {
	if (layer.route) {
		layer.route.stack.forEach(
			print.bind(null, path.concat(split(layer.route.path)))
		);
	} else if (layer.name === "router" && layer.handle.stack) {
		layer.handle.stack.forEach(
			print.bind(null, path.concat(split(layer.regexp)))
		);
	} else if (layer.method) {
		console.log(
			"%s /%s",
			layer.method.toUpperCase(),
			path.concat(split(layer.regexp)).filter(Boolean).join("/")
		);
	}
}

function split(thing) {
	if (typeof thing === "string") {
		return thing.split("/");
	} else if (thing.fast_slash) {
		return "";
	} else {
		var match = thing
			.toString()
			.replace("\\/?", "")
			.replace("(?=\\/|$)", "$")
			.match(
				/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//
			);
		return match
			? match[1].replace(/\\(.)/g, "$1").split("/")
			: "<complex:" + thing.toString() + ">";
	}
}

function printRouters( app ) {
	app._router.stack.forEach(print.bind(null, []));
}

const logRoutes = (app) => {
	console.log("Rotas atualmente carregadas da aplicação:");
	printRouters(app);
	console.log("Routers atualmente registrados na aplicação:");	
	if (app._router) {
		app._router.stack.forEach(function (r) {
			console.log(`Name: ${r.name}`);
			if (r.route && r.route.path) {
				console.log(r.route.path);
			}
		});
	} else {
		console.log("Nenhuma no momento!");
	}
};

module.exports = { logRoutes };
