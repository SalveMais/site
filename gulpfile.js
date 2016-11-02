var gulp = require('gulp'),
    nano = require('gulp-cssnano'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    handlebars = require('gulp-compile-handlebars');

var root = process.cwd() + '/src/';

var config = {
    CSS_SRC: root + 'sass/main.sass',
    CSS_AUTOPREFIXER: '',
    CSS_DIST: 'dist/assets/',
    CSS_WATCH: root + 'sass/**/*',
    HANDLEBARS_WATCH: root + 'templates/**/*',
    HANDLEBARS_REDERED_TEMPLATES: root + 'templates/*.hbs',
    HANDLEBARS_DIST: 'dist/',
    HANDLEBARS_CONFIG: {
        batch : [root + 'templates/partials/']
    }
}

gulp.task('css', function () {
    return gulp.src(config.CSS_SRC)
                .pipe(sass())
                .pipe(autoprefixer(config.CSS_AUTOPREFIXER))
                .pipe(nano())
                .pipe(gulp.dest(config.CSS_DIST))
})

gulp.task('handlebars', function () {
    return gulp.src(config.HANDLEBARS_REDERED_TEMPLATES)
                .pipe(handlebars({}, config.HANDLEBARS_CONFIG))
                .pipe(rename({ extname: '.html' }))
                .pipe(gulp.dest(config.HANDLEBARS_DIST))
})

gulp.task('deploy', ['css', 'handlebars'], function () {
    shell.exec('docker -t salvemais-site .')
    shell.exec('eval $(docker-machine env salvemais-site)')
    shell.exec('docker run -t salvemais-site -p 8080:8080')
})

gulp.task('watch', ['css', 'handlebars'], function () {
    gulp.watch(config.HANDLEBARS_WATCH, ['handlebars'])
    gulp.watch(config.CSS_WATCH, ['css'])
})
