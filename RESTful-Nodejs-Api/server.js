
var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose');

var User = require('./app/model/User');
var config = require('./config');

var app = express();
var port = process.env.PORT || 3000;

mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error'));
db.once('open', function() {
    console.log('连接数据库成功');
})

app.use(bodyParser.urlencoded({extended: true}));  //是否识别 /:id  /:userId等
app.use(bodyParser.json());
app.use(morgan('dev'));

var router = express.Router();
//为所有的请求使用中间件
router.use(function(req, res, next) {
    console.log('Something is happening');
    next(); //将权限交给下一个路由
})
//测试 路由 确保能够工作
router.get('/', function(req, res) {
    res.json({message: 'hooray! welcome to our api!'});
})
/*
    @param {Error} err
    @param {String | Object} data
    @param {http.ServerResponse} res
*/
function handle(err, data, res) {
    if (err) 
        res.send(err);

    res.json(data)    
}
//API 路由  CRUD
// 以/users 结尾的路由
router.route('/users')
    .post(function(req, res) {  //创建一个用户
        User.create({name: req.body.name, password: req.body.pwd,admin: true}, function(err,user) {
            handle(err, {message: 'User created!'}, res);
        })
    })
    .get(function(req, res) {//获取所有的用户
        User.find({}, function(err,users) {
            handle(err, users, res);
        })
    })


//以/users/:user_id 结尾的路由
router.route('/users/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            handle(err, user, res);
        });
    })
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);

            //修改信息
            user.name = req.body.name;
            user.password = req.body.pwd;
            user.save(function(err) { //更新信息
                handle(err, {message: 'User updated!'}, res);
            })
        })
    })
    .delete(function(req, res) {
        console.log(req.body.name);  //也可携带 数据
        User.remove({_id: req.params.user_id}, function(err, user) {
            handle(err, {message: 'Sucess deleted'}, res)
        })
    })
app.use('/api', router);
app.listen(port, function() {
    console.log('监听端口');
})