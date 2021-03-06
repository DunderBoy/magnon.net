const express = require("express"),
	nunjucks = require("nunjucks"),

	app = express(),
	router = express.Router();

let server;

function startServer() {
	app.disable("etag");
	app.set("view engine", "html");

	nunjucks.configure(["views"], {
		autoescape: true,
		express: app,
		noCache: true
	});

	router.get("/", function(req, res) {
		res.render("index");
	});
	router.get("/:page", function(req, res) {
		res.render(req.params.page, {}, function(err, html) {
			if (err) {
				res.status(404).send("Not found");
			} else {
				res.send(html);
			}
		});
	});
	router.get("/games/:game", function(req, res) {
		res.render("games/" + req.params.game, {}, function(err, html) {
			if (err) {
				res.status(404).send("Not found");
			} else {
				res.send(html);
			}
		});
	});
	router.get("/error/:error", (req, res) => {
		res.render("error/" + req.params.error, {}, (err, html) => {
			if (err) {
				res.status(500).send("Couldn't find error page");
			} else {
				res.send(html);
			}
		});
	});

	app.use(router);

	server = app.listen(8001);
}

process.on("SIGTERM", function() {
	if (server) {
		server.close(function() {
			process.exit(0);
		});
	} else {
		process.exit(0);
	}
});

startServer();
