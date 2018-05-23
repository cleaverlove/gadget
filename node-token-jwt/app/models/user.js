//获取mongoose和mongoose.Schema实例
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//设置 mongoose model 传递给module.exports
//注意下: User.create方法创建的数据名称为小写，且会多一个s，即users
module.exports = mongoose.model("User", new Schema({
	name: String,
	password: String,
	admin: Boolean
}))