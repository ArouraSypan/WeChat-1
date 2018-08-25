function MVMusicUtil() {
    var connection;
    this.init = function () {
        var mysql = require('mysql');  //调用MySQL模块

        //1，创建一个connection
        connection = mysql.createConnection({
            host: 'localhost',       //主机 ip
            user: 'root',            //MySQL认证用户名
            password: '123456',                //MySQL认证用户密码
            port: '3306',                 //端口号
            database: 'music'          //数据库里面的数据
        });

        //2,连接
        connection.connect();
    }

    //插入MV
    this.inserMv = function (name,infor,address,call) {
        //1,编写sql语句
        var MvAddSql = 'INSERT INTO mv(name,infor,src) VALUES(?,?,?)';
        var MvAddSql_Params = [name,infor,address];
        //2,进行插入操作
        connection.query(MvAddSql, MvAddSql_Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            call(result);
        });

        //5,连接结束
        connection.end();
    }

    //修改MV
    this.update=function (id,name,infor,address) {
        //4,编写sql语句
        var updateModSql = 'UPDATE mv SET name = ?,infor = ?,src = ? WHERE id = ?';

        var updateModSql_Params = [name,infor,address, id];
        //5，更新操作
        connection.query(updateModSql,updateModSql_Params,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
        });
    }

    //删除mv
    this.delete = function (id) {
        var  mvGetSql = "DELETE FROM mv where id = " +id;

        connection.query(mvGetSql,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            console.log(result);
        });
    }

    //查询MV
    this.queryMV = function (call) {
        var sql = "select * from mv";

        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            call(result);
        });
        //5,连接结束
        connection.end();
    }

    //根据id查询mv
    this.queryId = function (id,call) {
        var sql = "select * from mv where id='" +id+ "'";
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            call(result);
        });
        //5,连接结束
        connection.end();
    }
}


module.exports = MVMusicUtil;