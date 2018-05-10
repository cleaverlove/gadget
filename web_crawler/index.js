
/*
    '必应首页HTML'
*/
/*
var http = require('http');

const opt = {
    hostname: 'cn.bing.com',
    port: 80
};
http.request(opt, function(res) {
    res.setEncoding('utf-8');
    res.on('data', function(chunk) {
        console.log(chunk);
    }).on('end', function() {
        console.log(`输出全部完成`);
    }).on('error', function(e) {
        console.log(`服务器响应出错: ${e.message}`);
    })
}).on('error', function(e) {
    console.log(`请求出错: ${e.message}`);
}).end();

*/

/*
    2. cnode社区发帖
*/
// var http = require('http');  报错: protocol "https" not supported. Expected "http:"

    //因为cnode社区的协议是https ,而我的客户端使用的是http模块，所以报错
        //解决办法: 使用https模块

/*        
var https = require('https');
var querystring = require('querystring');

var postData = querystring.stringify({
    accesstoken: 'accessToken,用户登录后，在设置页面可以看到自己的 accessToken',
    title: '二二三四,再来一次-到此一游',
    tab: 'dev',
    content: '2018/05/09  到此一游'
})

    //https时，port我写成80报错 
    //write error 101057795:error:140770fc:ssl routines: ssl23_get_server_hello: unknow protocol:openssl\ssl\s23_clnt.c:794
    //解决办法: https://blog.csdn.net/qibobo/article/details/50328411

const opt = {
    hostname: 'cnodejs.org',
    port: 443,
    path: '/api/v1/topics',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    }
}

const req = https.request(opt,function(res) {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    res.on('data', function(chunk) {
        console.log(chunk.toString());
    }).on('end', function() {
        console.log('评论完毕~');
    })
})

req.on('error', function(e) {
    console.log(`请求出错: ${e.message}`);
})
//写入数据到请求主体
req.write(postData);
req.end();

*/

/*
    3. 爬虫部分
*/
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');

var opt = "http://www.lyun.edu.cn";
var htmlData = "";
var req = http.request(opt,function(res) {
    res.on('data', function(chunk) {
        htmlData += chunk;
    }).on('end', function() {
        var $ = cheerio.load(htmlData);
        var textContent = $("#t1_3_").text();
        fs.writeFile('./school.txt',textContent,"utf-8",function(e) {
            if (e) {
                console.log(`写入失败: ${e.message}`);
            } else {
                console.log('看样子是成功了');
            }
            
        });
    })
})
req.end();


