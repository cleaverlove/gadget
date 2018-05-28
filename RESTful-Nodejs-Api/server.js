
var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
    session = require('express-session');

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
// 这三个参数secret,resave,saveUninitialized 不传会警告
app.use(session({
    secret:'restful',
    resave: false,
    saveUninitialized: false,
}));// ①

function githubStrategyMiddleware(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    done(null, profile);
}

function githubMiddle(req, res, next) {
    if (config.GITHUB_OAUTH.clientID === 'your GITHUB_CLIENT_ID') {
        return res.send('call the admin to set github oauth.');
    }
    next();
}

function githubCallBackMiddle(req, res, next) {
    console.log(req.user);
    //auth/github/callback后, 可以通过req.user得到profile
    res.redirect('/api'); //跳转到/api
}
//oAuth中间件
app.use(passport.initialize());
app.use(passport.session()); //②
//github oAuth
passport.serializeUser(function(user, done) {
    done(null, user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
})
passport.use(new GitHubStrategy(config.GITHUB_OAUTH,githubStrategyMiddleware))

app.get('/', function(req, res) {

    res.send('<p>使用github登录,获取权限</p><a href="/auth/github">github登录</a>');
})
//测试github回调是否回来
function callback(req, res, next) {
    console.log('回调成功');
    next();
}
// github认证和登录
app.get('/auth/github', githubMiddle, passport.authenticate('github'));
//在github已经认证完用户之后的回调控制函数  注: successRedirect属性有时,后面就不需要第二个回调函数了
app.get('/auth/github/callback', passport.authenticate('github',{failureRedirect: '/'}), githubCallBackMiddle)
//确保每个API的使用是在登录情况下,如果没有登录，则回到首页
function isLoggedIn(req, res, next) {
    //if user middleware to make sure a user is logged in
    /*
        注意: 确保req.isAuthenticated在登录后返回true
        ① 基于session的，使用express-session
        ② 要使用passport.session()中间件
    */
    if ( req.isAuthenticated() ) {
        return next();
    }

    //if they are't redirect them to the home page
    res.redirect('/');
}
var router = express.Router();
//为所有的请求使用中间件
router.use(function(req, res, next) {
    console.log('Something is happening');
    next(); //将权限交给下一个路由
})

router.get('/', isLoggedIn,function(req, res) {
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
    .post(isLoggedIn,function(req, res) {  //创建一个用户
        User.create({name: req.body.name, password: req.body.pwd,admin: true}, function(err,user) {
            handle(err, {message: 'User created!'}, res);
        })
    })
    .get(isLoggedIn,function(req, res) {//获取所有的用户
        User.find({}, function(err,users) {
            handle(err, users, res);
        })
    })


//以/users/:user_id 结尾的路由
router.route('/users/:user_id')
    .get(isLoggedIn,function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            handle(err, user, res);
        });
    })
    .put(isLoggedIn,function(req, res) {
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
    .delete(isLoggedIn,function(req, res) {
        console.log(req.body.name);  //也可携带 数据
        User.remove({_id: req.params.user_id}, function(err, user) {
            handle(err, {message: 'Sucess deleted'}, res)
        })
    })
app.use('/api', router);
app.use(function(req, res, next) {
    res.status(404).send('未被处理路由');
})
process.on('uncaughtException', function(err) {
    console.log('捕捉到错误: ' + e.message);
})
app.listen(port, function() {
    console.log('监听端口');
})