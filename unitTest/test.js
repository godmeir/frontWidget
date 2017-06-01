/**
 * Created by JackHou on 2017/6/1.
 */
var gulp = require('gulp');
//合并文件
var concat = require('gulp-concat');
//串行执行顺序task
var runSequence = require('gulp-sequence');
//webpack插件
var webpack = require('webpack');
//深度压缩图片插件
var pngquant = require('pngquant');
//删除文件插件
var del = require('del');
// 合并stream
var mergeStream=require('merge-stream');
//子任务
var exec=require('child_process').exec;
//压缩图片
var imagemin = require('gulp-imagemin');
//压缩html
var htmlmin = require('gulp-htmlmin');
//压缩css
var minicss = require('gulp-clean-css');
//压缩js
var uglify = require('gulp-uglify');
//代替pipe
var pump = require('pump');
//重命名插件
var rename = require('gulp-rename');
//文档注释插件
var jsdoc = require('gulp-jsdoc3');
//单元测试插件jasmine
var jasmineBrowser = require('gulp-jasmine-browser');
//监视文件变化插件
var watch = require('gulp-watch');



gulp.task('jszip', function (callback) {
    console.log('jszip');
    pump(
        [
            gulp.src('js/*.js'),
            uglify(),
            gulp.dest('dest')
        ],
        callback
    );
});


