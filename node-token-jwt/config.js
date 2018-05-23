/*
	首先要在admin创建用户，然后才有权限去其他表创建用户
	切换到admin库
	use admin
	添加用户
	db.createUser({
		user: 'pmx',
		pwd: 'pmx',
		roles: [{role: 'root', db: 'admin'}]
	})
	登录
	db.auth('pmx','pmx')
*/
/*
	现在NodeApi数据库中创建用户
	use NodeApi
	db.createUser({
		user: 'pmxApi',
		pwd: 'pmxApi',
		roles: [{role: 'readWrite',db:"NodeApi"}]
	})
*/
module.exports = {
	'secret': 'nodeApi',
	'database': 'mongodb://pmxApi:pmxApi@localhost:27017/NodeApi' //在NodeApi数据库创建的用户账号密码
	// 'database': 'mongodb://localhost/NodeApi' 
}