require('events').EventEmitter.prototype._maxListeners = 2000;
var config = require('./config.json');
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
// sass和postcss一起使用
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
//postcss插件
var autoprefixer = require('autoprefixer');
//生成雪碧图插件
var spritesmith = require('gulp.spritesmith');
//文件复制插件
copy = require("gulp-copy");
//图片压缩插件
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
//js压缩插件
var uglify = require('gulp-uglify');
//es6编译
babel = require('gulp-babel');
//ejs相关插件
// var data = require('gulp-data');
// var ejs = require('gulp-ejs');
// var util = require('gulp-util');
//服务器相关插件
var lr = require('tiny-lr');
var server = lr();
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');
var opn = require('opn');
//文件打包
var zip = require('gulp-zip');
//mustache模板引擎
var mustache = require('gulp-mustache');
//开发目录
var D_DIR = './src/';
var P_DIR = './dist/';

//生成雪碧图
gulp.task('sprite', function() {
    return gulp.src(D_DIR + 'images/icon/*.png')
        .pipe(spritesmith({
            imgName: 'images/icon.png', //保存合并后图片的地址
            cssName: 'sass/icon/_icon.scss', //保存合并后对于css样式的地址
            padding: 5, //合并时两个图片的间距
            algorithm: 'binary-tree', //注释1
            cssTemplate: D_DIR + "sass/icon/handlebarsStr.css" //注释2
        }))
        .pipe(gulp.dest(D_DIR))
});

//压缩图片
gulp.task('imagemin', function() {
    return gulp.src(D_DIR + 'images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(P_DIR + 'images'));
});
//压缩javascript 文件
gulp.task('minifyjs', function() {
    gulp.src(D_DIR + 'js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(P_DIR + 'js'))
});

//sass和postcss一起编译成css
gulp.task('css', function() {
    var plugins = [
        autoprefixer
    ];
    return gulp.src(D_DIR + 'sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest(D_DIR + 'css'))
});
//babel编译js代码
gulp.task('babel', function() {
    return gulp.src(D_DIR + 'babel/*.js')
        .pipe(babel({
            presets:['env']
        }))
        .pipe(gulp.dest(D_DIR + 'js'))
});

//将相关项目文件复制到dist文件夹下
gulp.task('cp', function() {
    //html文件
    gulp.src(D_DIR + '*.html')
        .pipe(gulp.dest(P_DIR));
    //CSS文件
    gulp.src(D_DIR + 'css/*.css')
        .pipe(gulp.dest(P_DIR + 'css'));
});

//文件监控
gulp.task('watch', function() {

    server.listen(35729, function(err) {
        if (err) {
            return console.log(err);
        }
    });
    //监听scss文件
    gulp.watch(D_DIR + 'sass/**/*.scss', ['css']);
    //监听模板和数据文件
    gulp.watch([D_DIR + "templates/**/*", D_DIR + "data/*.json"], ['mustache']);
    //监听html文件
    gulp.watch([D_DIR + '*.html', D_DIR + 'css/*.css', D_DIR + 'js/*.js'], function(e) {
        server.changed({
            body: {
                files: [e.path]
            }
        });
    });
});
//开启本地Web服务器功能
gulp.task('webserver', function() {
    gulp.src(D_DIR)
        .pipe(webserver({
            host: config.localserver.host,
            port: config.localserver.port,
            livereload: true,
            directoryListing: false
        }))
});
//通过游览器打开web服务器
gulp.task('openbrowser', function() {
    opn("http://" + config.localserver.host + ":" + config.localserver.port);
});

//打包主体dist文件夹并按照时间重命名
gulp.task('zip', function() {
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }

    var d = new Date();
    var year = d.getFullYear();
    var month = checkTime(d.getMonth() + 1);
    var day = checkTime(d.getDate());
    var hour = checkTime(d.getHours());
    var minute = checkTime(d.getMinutes());

    return gulp.src(P_DIR + '**/*')
        .pipe(zip(config.project + '-' + year + month + day + hour + minute + '.zip'))
        .pipe(gulp.dest('./'));
});

//mustache编译成html
gulp.task('mustache', function() {
    return gulp.src(D_DIR + 'templates/*.mustache')
        .pipe(mustache(D_DIR + 'data/data.json', {
            extension: '.html'
        }, {}))
        .pipe(gulp.dest(D_DIR));
});

//生成发布版本
gulp.task('build', ['imagemin', 'minifyjs', 'cp']);
gulp.task('web', ['css', 'mustache', 'watch', 'webserver', 'openbrowser']);