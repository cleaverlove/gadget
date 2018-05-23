
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');

var port = process.env.PORT || 3000;
mongoose.connect(config.database);
var db = mongoose.connection;
db.on("error", console.error.bind(console,'connection error'));
db.once('open', function() {
	//连接成功，然后监听端口
	app.listen(port, function() {
		console.log('Magic happens at http://localhost:' + port);
	});
})
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));
//基础route
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
})

//创建一个用户样例
app.get('/setup', function(req, res) {
	//建一个简单的user  方式一
	var nick = new User({
		name: 'pmx1',
		password: 'pmx123',
		admin: true
	})
	//保存
	nick.save(function(err) {
		if (err) throw err;
		console.log('User saved successfully');
		res.json({sucess: true});
	})
	//方式二   方式一和二效果相同
	// User.create({
	// 	name: 'pmx',
	// 	password: 'pmx123',
	// 	admin: true
	// }, function(err, nick) {
	// 	if (err) throw err;
	// 	res.json({success: true});
	// })
})

// AIP ROUTES
var apiRoutes = express.Router();
// 权限认证路由  
apiRoutes.post('/authenticate', function(req, res) {
	//查找用户
	console.log(req.body);
	//注意下此处: 如果是User.find()方法返回的是数组,第一个记录为user[0]。此处使用User.findOne()方法
	User.findOne({name: req.body.name}, function(err, user) {
		if (err) throw err;
		if (!user) {
			res.json({sucess: false, message: 'Authentication failed, User not found'});
		} else if (user) {
			//检查密码是否匹配
			if (user.password != req.body.password) {
				console.log(user.password,req.body.password)
				res.json({sucess: false, message: 'Authentication failed, wrong password'});
			} else {
				//用户存在且密码正确
				const payload = {
					admin: user.admin
				}
				var token = jwt.sign(payload,app.get('superSecret'),{expiresIn:86400}) //expires in 24 hours
				// 返回信息包括token
				res.json({
					sucess: true,
					message: 'Enjoy your token!',
					token: token
				})
			}
		}
	})
})
// 路由中间件去检验token （保护最后两个routes）
apiRoutes.use(function(req, res, next) {
	//检查头信息或者url参数或者post方法传递token参数
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
		//校验
		jwt.verify(token,app.get('superSecret'), function(err, decoded) {
			if (err) {
				return res.json({sucess: false, message: 'Failed to authenticate token'});
			} else {
				req.decoded = decoded;
				console.log(decoded);
				next();
			}
		})
	} else {
		//没有token 返回错误
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		})
	}
})
//路由展示随机信息
apiRoutes.get('/', function(req, res) {
	res.json({message: 'welcome to the coolest API on earth!'})
})

//路由 返回所有的用户
apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	})
})

//使用该routes到app上，使用前缀/api
app.use('/api', apiRoutes);

app.use(function(err,req,res,next) {
	res.status(505).send('error:' + err.message);
})

process.on('uncaughtException', function(err) {
	console.log('捕获异常:' + err.message);
})


