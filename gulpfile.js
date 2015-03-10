'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var handlebars = require('gulp-compile-handlebars');
var jsonlint = require("gulp-jsonlint");
var rename = require('gulp-rename');
var fs = require('fs');
var path = require('path');
var base64 = require('gulp-base64');
var inlinesource = require('gulp-inline-source');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');

gulp.task('build', ['minify-css', 'minify-js', 'jsonlint', 'render-template', 'inline-source-and-minify-html']);

// Concat and compress CSS files in source/data/css, and generate output/production.css
gulp.task('minify-css', function() {
    var opts = {
        keepBreaks: false,
        keepSpecialComments: 0
    };
    return gulp.src('./source/css/*.css')
    .pipe(concat('production.css'))
    .pipe(base64())
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./output/'));
});

// Concat and compress JS files in source/data/javascript, and generate output/production.js
gulp.task('minify-js', function () {
    return gulp.src(['./source/js/core.js', './source/js/nav.js'])
    .pipe(concat('production.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('./output'));
});

// Validate source/data JSON files
gulp.task('jsonlint', function () {
    return gulp.src('./source/data/*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

// Render html using data in source/data against source/templates, and output source/html/index.html
gulp.task('render-template', function () {
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
        return gulp.src('./source/templates/index.handlebars')
        .pipe(handlebars(data, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./source/html'));
   });
});

// Copy output/production.js and output/production.css into source/html/index.html, compress html, and generate output/index.html
gulp.task('inline-source-and-minify-html', function () {
    var optsInline = {
        swallowErrors: true
    };
    var optsHtml = {
      conditionals: true,
      spare: true
    };
    return gulp.src('./source/html/*.html')
    .pipe(inlinesource(optsInline))
    .pipe(minifyHTML(optsHtml))
    .pipe(gulp.dest('output'));
});

// Validate all JS files
gulp.task('lint', function() {
    return gulp.src('./**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
});