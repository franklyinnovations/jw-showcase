module.exports = function (grunt) {

    var fs       = require('fs'),
        url      = require('url'),
        template = require('lodash.template'),
        pkg      = require(process.cwd() + '/package.json'),
        libPkg   = require(process.cwd() + '/bower_components/jw-showcase-lib/package.json');

    function compile (src, dest, configLocation) {

        var config   = require(process.cwd() + '/' + configLocation),
            baseUrl  = grunt.option('url') || '/',
            urlParts = url.parse(baseUrl),
            html, compiler;

        config.version = pkg.version;
        config.libVersion = libPkg.version;

        html = fs.readFileSync(src).toString();

        compiler = template(html);

        config.path = urlParts.path;
        config.url  = baseUrl;

        if (config.path.slice(-1) !== '/') {
            config.path += '/';
        }

        if (config.url.slice(-1) !== '/') {
            config.url += '/';
        }

        fs.writeFileSync(dest, compiler(config));
    }

    // process.cwd() + '/dist/config.json'

    grunt.registerTask('template:server', function () {
        compile('./app/index.html', './.tmp/index.html', './app/config.json');
    });

    grunt.registerTask('template:dist', function () {
        compile('./dist/index.html', './dist/index.html', './dist/config.json');
    });
};