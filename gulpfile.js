var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var es = require('event-stream');
var bowerFiles = require('main-bower-files');
var minify = require('gulp-minify-css');

// == SETTINGS ========
var moduleName = 'ps';

// == PATH STRINGS ========
var paths = {
    scripts: './public/js/**/*.js',
    styles: './public/scss/*.scss',
    index: './public/index.html',
    partials: ['./public/views/**/*.html', '!public/index.html'],
    dist: './public.build',
    scriptsServer: './app/**/*.js',
    bowerDir: './public/libs/bootstrap-sass/assets/fonts'
};

// == PIPE SEGMENTS ========

var pipes = {};

pipes.orderedVendorScripts = function() {
    return plugins.order(['jquery.js', 'angular.js']);
};

pipes.orderedAppScripts = function() {
    return plugins.angularFilesort();
};

pipes.validatedAppScripts = function() {
    return gulp.src(paths.scripts)
        //.pipe(plugins.jshint())
        //.pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.angularFilesort());
};

pipes.builtAppScripts = function() {
    var scriptedPartials = pipes.scriptedPartials();
    var validatedAppScripts = pipes.validatedAppScripts();

    return es.merge(scriptedPartials, validatedAppScripts)
        .pipe(pipes.orderedAppScripts())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.dist + '/js/'));
};

pipes.builtVendorStyles = function() {
    return gulp.src(bowerFiles('**/*.css', {includeDev:true}))
        .pipe(plugins.concat('vendor-styles.min.css'))
        .pipe(minify())
        .pipe(gulp.dest(paths.dist + '/css/'));
};

pipes.builtVendorScripts = function() {
    return gulp.src(bowerFiles('**/*.js', {includeDev:true}))
        .pipe(pipes.orderedVendorScripts())
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.dist + '/js/'));
};

pipes.validatedServerScripts = function() {
    return gulp.src(paths.scriptsServer)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.validatedPartials = function() {
    return gulp.src(paths.partials)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter());
};

pipes.scriptedPartials = function() {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.ngHtml2js({
            moduleName: moduleName,
            prefix: 'views/'
        }));
};

pipes.builtStyles = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sass())
        .pipe(gulp.dest(paths.dist + '/css/'));
};

pipes.validatedIndex = function() {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtIndex = function() {

    var vendorScripts = pipes.builtVendorScripts();
    var vendorStyles = pipes.builtVendorStyles();
    var appScripts = pipes.builtAppScripts();
    var appStyles = pipes.builtStyles();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.dist)) // write first to get relative path for inject
        .pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(vendorStyles, {ignorePath: 'public.build/', name: 'bower'}))
        .pipe(plugins.inject(appScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {ignorePath: 'public.build/'}))
        .pipe(gulp.dest(paths.dist));
};

pipes.builtApp = function() {
    return es.merge(pipes.builtIndex());
};

// == TASKS ========

gulp.task('fonts', function() {
    gulp.src(paths.bowerDir + '/**/*.*')
        .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('validate-server-scripts', pipes.validatedServerScripts);

gulp.task('build-app', ['fonts'], pipes.builtApp);

gulp.task('watch', ['validate-server-scripts'], function() {

    // start nodemon to auto-reload the dev server
    plugins.nodemon({ script: 'server.js', ext: 'js', watch: ['server.js', 'app/routes.js'], env: {NODE_ENV : 'production'} })
        .on('change', ['validate-server-scripts'])
        .on('restart', function () {
            console.log('[nodemon] restarted dev server');
        });

    plugins.livereload.listen({start: true});

    gulp.watch(paths.index, function() {
        return pipes.builtIndex()
            .pipe(plugins.livereload());
    });

    gulp.watch(paths.scripts, function() {
        return pipes.builtAppScripts()
            .pipe(plugins.livereload());
    });

    gulp.watch(paths.partials, function() {
        return pipes.builtAppScripts()
            .pipe(plugins.livereload());
    });

    gulp.watch(paths.styles, function() {
        return pipes.builtStyles()
            .pipe(plugins.livereload());
    });

});

gulp.task('default', ['build-app', 'watch']);
