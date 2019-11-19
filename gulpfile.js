var gulp = require("gulp");
var imagemin = require("gulp-imagemin"); // 压缩图片的插件
var htmlclean = require("gulp-htmlclean"); // 压缩HTML的插件
var uglify = require("gulp-uglify"); // 压缩JS的插件
var stripDebug = require("gulp-strip-debug"); // 在压缩之前去掉调试语句 在开发中经常用到调试语句
var concat = require("gulp-concat");// JS拼接文件：在DOM开发的时候我们不只用到一个JS文件 那我们可以对这些JS文件进行一些拼接 我们把所有的JS文件放在最终的一个JS文件里面 这样可以减少HTTP的请求次数
var deporder = require("gulp-deporder"); //
var less = require("gulp-less"); // less转成CSS插件
var postcss = require("gulp-postcss"); //  CSS3会有兼容问题 自动添加CSS前缀压缩代码
var autoprefixer = require("autoprefixer"); // 添加前缀 兼容浏览器
var cssnano = require("cssnano"); // 压缩CSS代码
var connect = require("gulp-connect"); // 开模拟简易的服务器



var folder = {
    src : "src/", // 开发目录文件夹
    dist : "dist/" // 压缩打包目录后的文件夹
}

var devMode = process.env.NODE_ENV !== "production"; // 上线环境

//流操作 task running
gulp.task("html",function(){ // 先创建一个任务 
    var page =  gulp.src(folder.src + "html/index.html")
                    .pipe(connect.reload()); // 开启HTML改变的时候自动刷新 变成流文件 如何在这里面进行流的操作
    if(!devMode){
        page.pipe(htmlclean()); // 压缩HTML
    }
    page.pipe(gulp.dest(folder.dist + "html/"))  // 最后文件流的方式传输到我要写入的文件
})

// 压缩图片 减少请求
gulp.task("images",function(){
    gulp.src(folder.src + "images/*") // 读出文件
        .pipe(imagemin()) // 压缩文件
        .pipe(gulp.dest(folder.dist+"images/")) // 放在哪个路径下
})

// 压缩JS文件
gulp.task("js",function(){  // 创建任务
    var js = gulp.src(folder.src+"js/*")
            .pipe(connect.reload());
    if(!devMode){
        js.pipe(uglify())
        .pipe(stripDebug()) // 在代码压缩之前去掉调试语句
    }   
    js.pipe(gulp.dest(folder.dist+"js/"))
})

// 压缩CSS文件
gulp.task("css",function(){
    var css = gulp.src(folder.src+"css/*") // 先取到src下面要配置的所有CSS文件
                .pipe(connect.reload())
                .pipe(less()); // 编译成CSS：当它变成文件流之后 我们取到这个less
    var options = [autoprefixer()]; // 把添加前缀和压缩方法都放在一个数组里面
    if(!devMode){
        options.push(cssnano()) // 压缩代码
    }
        
    css.pipe(postcss(options))
    .pipe(gulp.dest(folder.dist + "css/")) // 放到上线的CSS文件下面
})

// 监听文件变化的
gulp.task("watch",function(){ // 监听
    gulp.watch(folder.src + "html/*",["html"]); // 监听完执行, 后面的任务
    gulp.watch(folder.src + "images/*",["images"]);
    gulp.watch(folder.src + "js/*",["js"]);
    gulp.watch(folder.src + "css/*",["css"]);
})

// 创建任务 开启服务
gulp.task("server",function(){
    connect.server({
        port : "8081",
        livereload : true // 开启浏览器自动刷新 当我们HTML改变的时候自动刷新页面
    });
})


// 执行上面所创建的任务
gulp.task("default",["html","images","js","css","watch","server"]);