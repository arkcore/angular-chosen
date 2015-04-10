'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    coffeeify = require('coffeeify'),
    copy = require('gulp-copy'),
    source = require('vinyl-source-stream'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    guif = require('gulp-if');

var isProduction = process.env.NODE_ENV === 'production';

gulp.task('js-bindings', function () {

    var bundler = browserify({
        fullPaths: !isProduction,
        debug: true
    });

    bundler.add('./src/chosen.coffee');
    bundler.transform(coffeeify);

    if (isProduction) {
        bundler.plugin('minifyify', { map: 'chosen.map.js-chosen', output: './dist/chosen.map.js-chosen' });
    }

    return bundler.bundle()
              .pipe(source(isProduction ? 'chosen.min.js' : 'chosen.js'))
              .pipe(gulp.dest('./dist'));
});

gulp.task('css-bindings', function () {
    return gulp.src('./src/*.css')
              .pipe(guif(isProduction, minifyCSS()))
              .pipe(rename(isProduction ? 'chose.min.css' : 'chosen.css'))
              .pipe(gulp.dest('./dist'));
});

gulp.task('images', function () {
    return gulp.src('./src/*.gif')
              .pipe(imagemin({ interlaced: true }))
              .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['css-bindings', 'images', 'js-bindings']);
