/* jshint ignore:start */

/* TODO:
 * - PROD vs DEV (versioning/cache)
 * - delete old cached files
 */

var gulp = require('gulp');

var currentDateObject = new Date(),
    currentDatetime = currentDateObject.getFullYear() + '-'
        + ((currentDateObject.getMonth() + 1) < 10 ? '0' : '') + (currentDateObject.getMonth() + 1) + '-'
        + (currentDateObject.getDate() < 10 ? '0' : '') + currentDateObject.getDate() + '_'
        + ((currentDateObject.getHours() + 1) < 10 ? '0' : '') + currentDateObject.getHours() + '-' +((currentDateObject.getMinutes() + 1) < 10 ? '0' : '') +  currentDateObject.getMinutes() + '-' + ((currentDateObject.getSeconds() + 1) < 10 ? '0' : '') + currentDateObject.getSeconds();


var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');
var inlinesource = require('gulp-inline-source');
var cleanhtml = require('gulp-cleanhtml');
var clean = require('gulp-clean');
var filesize = require('gulp-filesize');
var path = require('path');
var fs = require('fs');

/*
var clean = require('gulp-clean');
*/
var replace = require('gulp-replace-task');

var paths = {
    scripts: ['assets/js/*.js'],
    less: ['assets/css/*.less'],
    index: ['index.html']
};

gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(filesize())
        .pipe(uglify())
        //.pipe(concat('all_' + currentDatetime + '_min.js'))
        .pipe(concat('all.min.js'))
        .pipe(filesize())
        .pipe(gulp.dest('./web/assets/js'));
});

gulp.task('less', function () {
    return gulp.src(paths.less)
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(filesize())
        .pipe(minifycss({}))
        .pipe(filesize())
        .pipe(gulp.dest('./web/assets/css'));
});

gulp.task('replace', function () {
    return gulp.src('./index.html')
        .pipe(replace({
            patterns: [
                {
                    match: 'cssStyles',
                    replacement: fs.readFileSync('./web/assets/css/style.css', 'utf8')
                },
                {
                    match: 'jsScript',
                    replacement: fs.readFileSync('./web/assets/js/all.min.js', 'utf8')
                },
                {
                    match: 'timestamp',
                    replacement: currentDatetime
                }
            ]
        }))
        //.pipe(cleanhtml())
        .pipe(gulp.dest('./web'));
});

gulp.task('clean', function () {
    return gulp.src('web/assets', {read: false})
        .pipe(clean());
});


// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['scripts', 'less', 'replace', 'clean']);
    gulp.watch(paths.less, ['scripts', 'less', 'replace', 'clean']);
    gulp.watch(paths.index, ['scripts', 'less', 'replace', 'clean']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'less', 'replace', 'clean', 'watch']);

/* jshint ignore:end */
