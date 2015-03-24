'use strict';

var base64 = require('gulp-base64');
var concat = require('gulp-concat');
var fs = require('fs');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var inlinesource = require('gulp-inline-source');
var jshint = require('gulp-jshint');
var jsonlint = require("gulp-jsonlint");
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var path = require('path');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var cssfiles = ['./source/css/normalize.css', './source/css/bricks.css', './source/css/index.css'];
var loginCssfiles = ['./source/css/normalize.css', './source/css/bricks.css', './source/css/login.css'];
var jsfiles = ['./source/js/production.js'];

gulp.task('less', function() {
    return gulp.src('./source/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./source/css/'));
});

// Concat and compress CSS files in source/data/css, and generate output/production.css
gulp.task('minify-css', ['less'], function() {
    var opts = {
        keepBreaks: false,
        compatibility: 'ie8',
        keepSpecialComments: 0
    };
    var cssfilesToBuild = cssfiles;
    return gulp.src(cssfilesToBuild)
    .pipe(concat('production.css'))
    .pipe(base64())
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./source/rendered'));
});

// Concat and compress CSS files in source/data/css, and generate output/production.css
gulp.task('login-minify-css', function() {
    var opts = {
        keepBreaks: false,
        compatibility: 'ie8',
        keepSpecialComments: 0
    };
    return gulp.src(loginCssfiles)
    .pipe(concat('login.css'))
    .pipe(base64())
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./source/rendered'));
});

// Copy output/production.js and output/production.css into source/html/index.html, compress html, and generate output/index.html
gulp.task('login-copy-css', ['less'], function () {
    return gulp.src(loginCssfiles)
    .pipe(concat('login.css'))
    .pipe(base64())
    .pipe(gulp.dest('./source/rendered'));
});


gulp.task('login-build', ['login-minify-css'], function () {
    var optsHtml = {
      conditionals: true,
      spare: true
    };
    var optsInline = {
        swallowErrors: true
    };
    return gulp.src('./source/rendered/login.html')
    .pipe(base64())
//    .pipe(inlinesource(optsInline))
    .pipe(minifyHTML(optsHtml))
    .pipe(gulp.dest('output'));
});


// Copy output/production.js and output/production.css into source/html/index.html, compress html, and generate output/index.html
gulp.task('copy-css', ['less'], function () {
    var cssfilesToBuild = cssfiles;
    return gulp.src(cssfilesToBuild)
    .pipe(concat('production.css'))
    .pipe(base64())
    .pipe(gulp.dest('./source/rendered'));
});


// Concat and compress JS files in source/data/javascript, and generate output/production.js
gulp.task('minify-js', function () {
    var jsfilesToBuild;
    if (jsfiles === [] || typeof jsfiles === 'undefined') {
        jsfilesToBuild = './source/js/production.js';
    } else {
        jsfilesToBuild = jsfiles;
    }
    return gulp.src(jsfilesToBuild)
    .pipe(concat('production.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('./source/rendered'));
});

// Concat and compress JS files in source/data/javascript, and generate output/production.js
gulp.task('login-minify-js', function () {
    return gulp.src('./source/js/login.js')
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('./source/rendered'));
});

// Copy output/production.js and output/production.css into source/html/index.html, compress html, and generate output/index.html
gulp.task('copy-js', function () {
    return gulp.src('./source/js/*.js')
    .pipe(gulp.dest('./source/rendered'));
});

// Validate source/data JSON files
gulp.task('jsonlint', function () {
    return gulp.src('./source/data/*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

// Render html using data in source/data against source/templates, and output source/html/index.html
gulp.task('render-template', ['jsonlint'], function (done) {
   var filepath = path.join(__dirname, './source/data/data-structure.json');
   var options = {
       ignorePartials: true,
       batch : ['./source/templates/partials']
   }

   fs.readFile(filepath, {encoding: 'utf-8'}, function (err, D) {
       var data;
        if (err) {
            console.log('error: ', err);
            return;
        }
        data = JSON.parse(D);
        gulp.src('./source/templates/index.handlebars')
        .pipe(handlebars(data, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./source/rendered'))
        .on('end', done); 
        return;
   });

});
gulp.task('build', ['copy-and-compress'], function () {
    var optsHtml = {
      conditionals: true,
      spare: true
    };
    var optsInline = {
        swallowErrors: true
    };
    return gulp.src('./source/rendered/*.html')
    .pipe(base64())
    .pipe(inlinesource(optsInline))
//    .pipe(minifyHTML(optsHtml))
    .pipe(gulp.dest('output'));
});

// Copy output/production.js and output/production.css into source/html/index.html, compress html, and generate output/index.html
gulp.task('build-dev', ['copy'], function (done) {
    return gulp.src('./source/rendered/*.html')
    .pipe(base64())
    .pipe(gulp.dest('output'));
});

gulp.task('login-render-template', function (done) {
    var filepath = path.join(__dirname, './source/data/data-structure.json');
    var options = {
        ignorePartials: true,
        batch : ['./source/templates/partials']
    }
    fs.readFile(filepath, {encoding: 'utf-8'}, function (err, D) {
        var data;
         if (err) {
             console.log('error: ', err);
             return;
         }
         data = JSON.parse(D);
         gulp.src('./source/templates/login.handlebars')
         .pipe(handlebars(data, options))
         .pipe(rename('login.html'))
         .pipe(gulp.dest('./source/rendered'))
         .on('end', done); 
         return;
    });
});

gulp.task('login-render-inline-template', function (done) {
    var options = {
        ignorePartials: true,
        batch : ['./source/templates/partials']
    };
    var data = {};
    var optsInline = {
        swallowErrors: true
    };
    return gulp.src('./source/templates/login.handlebars')
    .pipe(handlebars(data, options))
    .pipe(inlinesource(optsInline))
    .pipe(rename('login.html'))
    .pipe(gulp.dest('./source/rendered'));
});

// Copy output/production.js and output/production.css into source/html/index.html, compress html, and generate output/index.html
gulp.task('copy', ['login-copy-css', 'login-render-template', 'render-template', 'copy-js', 'copy-css'], function (done) {
    return gulp.src('./source/rendered/*')
    .pipe(gulp.dest('output'));
});

// Copy output/production.js and output/production.css into source/html/index.html, compress html, and generate output/index.html
gulp.task('copy-and-compress', ['login-minify-css', 'login-render-inline-template', 'render-template', 'login-minify-js', 'minify-js', 'minify-css'], function (done) {
    return gulp.src('./source/rendered/*')
    .pipe(gulp.dest('output'));
});

// Validate all JS files
gulp.task('lint', function() {
    return gulp.src('./source/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
});