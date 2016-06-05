var gulp = require("gulp"),
	gutil = require("gulp-util"),
	requireDir = require("require-dir");

var tasks = requireDir('./gulp_tasks', { recurse: true });

gulp.task("watch", ["default"], function() {
	tasks.web.buildJS(true);
	gulp.watch("src/web/scss/*.scss", ["css", "nginx"]);
	gulp.watch(["src/web/svg/**/*.svg", "src/web/html/**/*"], ["html", "node"]);
	gulp.watch("src/web/images/**/*", ["images", "nginx"]);
	gulp.watch("src/web/public/**/*", ["public", "nginx"]);
	gulp.watch("src/nginx/**/*", ["nginx"]);
	gulp.watch("src/node/**/*", ["node"]);
});

gulp.task("default", ["web", "node", "nginx"]);
