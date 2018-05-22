var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    zlib = require('zlib'); //gzip压缩

var mime = require('./types');  //mime类型
var config = require('./config'); //指定后缀文件和过期日期
var port = process.env.PORT || 3000;    
http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    // /img.jpg  -> /img.jpg
    
    var ext = path.extname(pathname);
    var realPath = ''
    if (ext.substring(0,1) !== '.') {
        console.log('这是路由，不是请求资源了');
        realPath = __dirname + '/public/' + config.Welcome.file;
    } else {
        realPath = __dirname + '/public/img' + pathname;
    }

    //根据请求，读取内容，失败后返回文件不存在(fs.exists已经废弃了,可以尝试fs.existsSync)
    fs.readFile(realPath, function(err, data) {
        if (err) { //不存在
            res.writeHead(404,{'Content-Type': 'text/plain'});
            res.write('This request URL ' + pathname + ' was not found');
            res.end();
        } else {
            //没有后缀名，一律是'unknow'  内容类型没有映射的一律是 text/plain
            ext = ext ? ext.slice(1) : 'unknow';
            //读取文件的最后修改时间
            fs.stat(realPath, function(err, stat) {
                if (err) {
                    res.writeHead(500,'server error',{'Content-Type': 'text/plain'});
                    res.end();
                } else {
                    //为所有请求的响应添加Last-Modified头
                    var lastModified = stat.mtime.toUTCString();
                    res.setHeader('Last-Modified',lastModified);
                    //检测浏览器是否发送了if-Modified-Since请求头
                    if (req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
                        res.writeHead(304, 'Not Modified');
                        res.end();
                        return ;
                    }
                    //判断后缀名是否符合要添加过期时间头的条件
                    if (ext.match(config.Expires.fileMatch)) {
                        var expires = new Date();
                        expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                        res.setHeader('Expires', expires.toUTCString());
                        res.setHeader('Cache-Control', "max-age=" + config.Expires.maxAge);
                    }
                    
                    var contentType = mime[ext] || 'text/plain';
                    res.writeHead(200, {'Content-Type': contentType});
                    res.write(data);
                    res.end();
                }
            })
        }
    })
    /*  
    var raw = fs.createReadStream(realPath);
    var acceptEncoding = req.headers['accept-encoding'] || "";
    var matched = ext.match(config.Compress.match);
    if (matched && acceptEncoding.match(/\bgzip\b/)) {
        res.writeHead(200, "Ok", {
            'Content-Encoding': 'gzip'
        });
        raw.pipe(zlib.createGzip()).pipe(res);
    } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
        res.writeHead(200, "Ok", {
            'Content-Encoding': 'deflate'
        });
        raw.pipe(zlib.createDeflate()).pipe(res);
    } else {
        res.writeHead(200, "Ok");
        raw.pipe(res);
    }
    */
}).listen(port, function() {
    console.log('监听端口:' + port);
})