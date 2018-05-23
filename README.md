# gadget
nodejs练手小项目

## 控制台输入-中英翻译
  dictionary文件夹
  
## cnode社区发布评论/爬取学校网站数据
  web_crawler文件夹
  
## http做的静态资源服务
  httpServer文件夹

  
  index.js  不同路径响应不同页面，提供资源.


  index1.js 静态文件服务器，浏览器发送url,服务端解析URL,对应到硬盘上的文件。如果文件存在，返回200状态码，并发送文件到浏览器; 如果文件不存在，返回404状态码，发送一个404的文件到浏览器端。
    http提供服务，fs读取文件，Expirse/Cache-Control:max-age 使用浏览器缓存，if-Modified-Since/Last-Modified头 提高效率，较少网络流量。

## 基于JSON Web Tokens权限认证的API
  express + jwt + mongoose  因为博文的创建时间较早，一些API已经过时了，已经进行重写。
  使用nodemon依赖，启动文件nodemon server.js  当文件修改时，会自动重启项目，无需手动
  参考地址:https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#toc-creating-a-sample-user

  使用postMan验证身份，并且获得token
  ![authenticate.png](./node-token-jwt/img/authenticate.png)

  使用中间件判断是否具有权限
  url携带token，请求/api接口
  ![api.png](./node-token-jwt/img/api.png)

  元数据携带token,请求/api/users接口
  ![users.png](./node-token-jwt/img/users.png)