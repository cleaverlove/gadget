
var http = require('http'),
	fs =  require('fs');

var serve = http.Server();
//必须打开文件，读取其中的内容，然后将这些内容发送给浏览器
function serveStaticFile(res, path, contentType, responseCode) {
	if (!responseCode) responseCode = 200;
	fs.readFile(__dirname + path, function(err, data) {
		if (err) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end('Internal Error');
		} else {
			res.writeHead(responseCode, {'Content-Type': contentType});
			res.end(data);
		}
	})
}

serve.on('request', function(req, res) { 
	//规范化url, 去掉查询字符串，可选的反斜杆，并把它变成小写
	console.log(req.url);
	var path = req.url.replace(/\/?(?:\?.*)?$/,'').toLowerCase();
	console.log(path);
	switch(path) {
		case '':
			serveStaticFile(res, '/public/home.html', 'text/html');
			break;
		case '/about':
			serveStaticFile(res, '/public/about.html', 'text/html');
			break;
		case '/img/logo.jpg':
			serveStaticFile(res, '/public/img/logo.jpg','image/jpeg');
			break;
		case '/xss':  //href="javascript:location.href='http://127.0.0.1:3000/xss?xss=sucess'"
				res.writeHead(200,'xss sucess',{'content-type': 'text/plain; charset=utf-8'});
				res.end('xss sucess');
				
		default:
			serveStaticFile(res, '/public/nofound.html','text/html',404);
			break;
	}
}).listen(3000,'127.0.0.1', function() {
	console.log('监听成功');
});

