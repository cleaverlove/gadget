/*
    1.写死的参数 2.输出的字符串很难看，如何更好的展示（如颜色,格式等）
*/
/*
var http = require('http');

process.argv.forEach(function(v,k) {
    console.log(`${k}: ${v}`);
})
console.log(`分割线; ${process.argv0}`);
const opt = {
    protocol: 'http:',
    hostname: 'fanyi.youdao.com',
    port: 80,
    path: '/openapi.do?keyfrom=bladetrans&key=902909552&type=data&doctype=json&version=1.1&q=%E4%BB%8A%E5%A4%A9',

}
var req = http.request(opt, function(res) {
    let str = ''
    res.setEncoding('utf-8');
    res.on('data', function(chunk) {
        str += chunk;
    })
    res.on('end', function() {
        console.log(str);
    })
})
req.on('error', function(e) {
    console.error(`请求遇到问题: ${e.message}`);
})
req.end();

*/
/*
    2.
*/
// ①先获取当前控制台输入的参数
var http = require('http');
var colors = require('colors') //输出控制颜色模块
var url = 'http://fanyi.youdao.com/openapi.do?keyfrom=bladetrans&key=902909552&type=data&doctype=json&version=1.1&q=';
var params = '';
for (var i = 2; i < process.argv.length; i++) {
    params += process.argv[i];
    console.log(`参数 ${i} : ${process.argv[i]} \n`);
}
params = encodeURIComponent(params); // querystring.escape()
console.log(`最终形态: ${params}`);
//②调用服务器接口
http.get(url + params,function(res) {

    res.on('error', function(e) {
        console.log(`服务器返回出现问题: ${e.message}`);
    })

    let params = '' //未设置 setEncoding
    res.on('data', function(chunk) {
        params += chunk;
    }).on('end', function() {
        let obj = JSON.parse(params.toString()); //转换成字符串,再变为对象
        process.stdout.write(` - ${obj.translation[0].green || ""} \n`)
        if (obj.web) {
            process.stdout.write(`
            1. ${obj.web && obj.web[0].key.yellow || ""} \n
                   ${obj.web && obj.web[0].value || ""} \n
            2. ${obj.web && obj.web[1].key.yellow || ""} \n
                   ${obj.web && obj.web[1].value || ""} \n
            3. ${obj.web && obj.web[2].key.yellow || ""} \n
                   ${obj.web && obj.web[2].value || ""} \n
            `)
        }
    })

}).on('error',function(e) {
    console.log(`请求遇到问题: ${e.message}`);
})
