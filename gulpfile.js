var gulp = require('gulp');
var sync = require('browser-sync');
var rimraf = require('gulp-rimraf');

gulp.task('clean', function() {
    return gulp.src('www/*').pipe(rimraf());
});

gulp.task('clean:scripts', function() {
    return gulp.src('www/js/*').pipe(rimraf());
});
gulp.task('scripts', ['clean:scripts'], function() {
    return gulp.src('app/js/**/*').pipe(gulp.dest('www/js')).pipe(sync.reload({stream:true}));
});

gulp.task('clean:images', function() {
    return gulp.src('www/images/*').pipe(rimraf());
});
gulp.task('images', ['clean:images'], function() {
    return gulp.src('app/images/**/*').pipe(gulp.dest('www/images')).pipe(sync.reload({stream:true}));
});

gulp.task('clean:styles', function() {
    return gulp.src('www/css/*').pipe(rimraf());
});
gulp.task('styles', ['clean:styles'], function() {
    return gulp.src('app/css/**/*').pipe(gulp.dest('www/css')).pipe(sync.reload({stream:true}));
});

gulp.task('deploy', ['clean'], function() {
    gulp.src(['app/**/*']).pipe(gulp.dest('www'));

    gulp.src('platforms/android/assets/www/plugins/**').pipe(gulp.dest('www/android/plugins'));
    gulp.src('platforms/android/assets/www/cordova.js').pipe(gulp.dest('www/android'));
    gulp.src('platforms/android/assets/www/cordova_plugins.js').pipe(gulp.dest('www/android'));

    gulp.src('platforms/ios/www/plugins/**/*').pipe(gulp.dest('www/ios/plugins'));
    gulp.src('platforms/ios/www/cordova.js').pipe(gulp.dest('www/ios'));
    gulp.src('platforms/ios/www/cordova_plugins.js').pipe(gulp.dest('www/ios'));

    gulp.src('app/images/icon.png')
        .pipe(gulp.dest('platforms/android/res/drawable-ldpi'))
        .pipe(gulp.dest('platforms/android/res/drawable-mdpi'))
        .pipe(gulp.dest('platforms/android/res/drawable-hdpi'))
        .pipe(gulp.dest('platforms/android/res/drawable-xhdpi'));
});

gulp.task('serve', ['clean'], function(){
    gulp.src(['app/**/*']).pipe(gulp.dest('www'));

    sync({
        port: 9900,
        open : false,
        ghostMode: false,
        notify: false,
        server: {
            baseDir: ['./www']
        }
    });

    gulp.watch([
        'app/*.html'
    ]).on('change',function(){
        gulp.src('app/**/*.html').pipe(gulp.dest('www'));
        return sync.reload({stream:true});
    });

    gulp.watch('app/js/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('app/css/**/*', ['styles']);

    gulp.start();
});

