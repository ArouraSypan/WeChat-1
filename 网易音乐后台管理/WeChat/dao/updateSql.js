function updateSql() {
var connection;
this.init = function () {
    var mysql = require('mysql');  //调用MySQL模块

    //1，创建一个connection
    connection = mysql.createConnection({
        host: 'localhost',       //主机 ip
        user: 'root',            //MySQL认证用户名
        password: '123456',                //MySQL认证用户密码
        port: '3306',                 //端口号
        database: 'Music'          //数据库里面的数据
    });

    //2,连接
    connection.connect();
}

this.inserMusic = function (music_id,music_name,palylist_id,music_play,singer,language,collection,music_src,album_id) {
    //1,编写sql语句
    var userAddSql = 'INSERT INTO music VALUES(?,?,?,?,?,?,?,?,?)';
    var userAddSql_Params = [music_id,music_name,palylist_id,music_play,singer,language,collection,music_src,album_id];
    //2,进行插入操作
    /**
     *query，mysql语句执行的方法
     * 1，userAddSql编写的sql语句
     * 2，userAddSql_Params，sql语句中的值
     * 3，function (err, result)，回调函数，err当执行错误时，回传一个err值，当执行成功时，传回result
     */
    connection.query(userAddSql, userAddSql_Params, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return false;
        }
        return true;
    });

}

this.inserBan = function (name,path,bt,instr) {
    //1,编写sql语句
    var userAddSql = 'INSERT INTO ban(name,path,bt,instr) VALUES(?,?,?,?)';
    var userAddSql_Params = [name,path,bt,instr];
    //2,进行插入操作
    /**
     *query，mysql语句执行的方法
     * 1，userAddSql编写的sql语句
     * 2，userAddSql_Params，sql语句中的值
     * 3，function (err, result)，回调函数，err当执行错误时，回传一个err值，当执行成功时，传回result
     */
    connection.query(userAddSql, userAddSql_Params, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return -1;
        }
        else {
            return 1;
        }
    });

}
this.queryAllmusic = function (call) {

    var sql = "select * from ban ORDER BY name";
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        call(result);
    });

}
    this.queryAllpic = function (name,call) {

        var sql = "select * from ban where name="+name+"";
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            call(result);
        });

    }
    this.queryAllserver = function (call) {
        var sql = "select * from server ORDER BY name";
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            call(result);
        });

    }
this.updateBan = function (path,bt,instr,name) {

    var sql = "UPDATE ban set path=?, bt=?,instr=?where name=?";
    var userAddSql_Params = [path,bt,instr,name];
    connection.query(sql,userAddSql_Params, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return 0;
        }
        else {
            return 1;
        }

    });

}

this.updateServer = function (name,path,instr) {

    var sql = "update server set path="+path+",instr="+instr+" where name="+name+"";
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        call(result);
    });

}
this.delServer = function (name) {

    var sql = "delete from server where name="+name+"";
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        call(result);
    });

}
this.delBan = function (name) {

    var sql = "delete from ban where name="+name+"";
    connection.query(sql, function (err) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    });

}
}

module.exports = updateSql;