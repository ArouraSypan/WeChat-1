function albumMusicUtil() {
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

    //添加专辑
    this.inserAlbum = function (id,name,call) {
        //1,编写sql语句
        var userAddSql = 'INSERT INTO album VALUES(?,?)';
        var userAddSql_Params = [id,name];
        connection.query(userAddSql, userAddSql_Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return -1;
            }
            else {
                console.log(111);
                call(result);
            }
        });

    }

    //查询专辑
    this.queryalbum = function (call) {
        var sql = "select * from album";

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

    //删除专辑
    this.delete = function (id) {
        var  albumGetSql = "DELETE FROM album where album_id = " +id;

        connection.query(albumGetSql,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            console.log(result);
        });
    }

    //根据id查询专辑
    this.queryId = function (id,call) {
        var sql = "select * from album where album_id='" +id+ "'";
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

    //修改专辑
    this.update=function (id,name) {
        //4,编写sql语句
        var updateModSql = 'UPDATE album SET album_name = ? WHERE album_id = ?';

        var updateModSql_Params = [name, id];
        //5，更新操作
        connection.query(updateModSql,updateModSql_Params,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
        });
    }

}


module.exports = albumMusicUtil;