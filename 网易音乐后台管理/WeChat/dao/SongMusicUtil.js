function SongMusicUtil() {
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

    this.inserSpecies = function (species_name,call) {
        //1,编写sql语句
        var speciesAddSql = 'INSERT INTO species(species_name) VALUES(?)';
        var speciesAddSql_Params = [species_name];
        //2,进行插入操作
        /**
         *query，mysql语句执行的方法
         * 1，userAddSql编写的sql语句
         * 2，userAddSql_Params，sql语句中的值
         * 3，function (err, result)，回调函数，err当执行错误时，回传一个err值，当执行成功时，传回result
         */
        connection.query(speciesAddSql, speciesAddSql_Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            //return result;
            call(result);
        });

        //5,连接结束
        connection.end();
    }

    this.update=function (id,name) {
        //4,编写sql语句
        var updateModSql = 'UPDATE species SET species_name = ? WHERE species_id = ?';

        var updateModSql_Params = [name, id];
        //5，更新操作
        connection.query(updateModSql,updateModSql_Params,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
        });
    }

    this.delete = function (id) {
        var  specieGetSql = "DELETE FROM species where species_id = " +id;

        connection.query(specieGetSql,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            console.log(result);
        });
    }

    this.querySong = function (call) {
        // var sql = "select * from music,album,playlist where music.album_id=album.album_id and music.playlist_id=playlist.playlist_id ";
        var sql = "select * from music,album where music.album_id=album.album_id ";

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

    this.queryId = function (id1,call) {
        var sql = "select * from species where species_id='" +id1+ "'";
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


module.exports = SongMusicUtil;