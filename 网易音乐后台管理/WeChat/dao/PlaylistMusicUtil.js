function PlaylistMusicUtil() {
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

    //修改歌单
    this.update=function (id,playName,playLabel,src) {
        //4,编写sql语句
        var updateModSql = 'UPDATE playlist SET playlist_name = ?,playlist_pic=?,playlist_label=? WHERE playlist_id = ?';

        var updateModSql_Params = [playName,src,playLabel, id];
        //5，更新操作
        connection.query(updateModSql,updateModSql_Params,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
        });
    }

    //删除歌单
    this.delete = function (id) {
        var  specieGetSql = "DELETE FROM playlist where playlist_id = " +id;

        connection.query(specieGetSql,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            console.log(result);
        });
    }

    this.queryPlaylist = function (call) {
        var sql = "select * from playlist";

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


    //根据id查询歌单
    this.queryId = function (id,call) {
        var sql = "select * from playlist where playlist_id='" +id+ "'";
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

    //插入歌单
    this.inserPlaylist = function (id,name,path,amount,label,collection,call) {
        //1,编写sql语句
        var userAddSql = 'INSERT INTO playlist VALUES(?,?,?,?,?,?)';
        var userAddSql_Params = [id,name,path,amount,label,collection];
        //2,进行插入操作
        connection.query(userAddSql, userAddSql_Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return -1;
            }

            call(result);
        });

    }

    //4.查询歌曲所属的歌单
    this.queryMusic_list = function (call) {
        var sql = "select  playlist.playlist_name,music.music_id from playlist,music,song_playlist where music.music_id=song_playlist.song_id and song_playlist.playlist_id=playlist.playlist_id";
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            call(result);
        });

    }
}


module.exports = PlaylistMusicUtil;