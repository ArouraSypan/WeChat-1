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

    //插入歌曲
    this.inserMusic = function (name,singer,languages,amount,collection,musicSrc,album_id,call) {
        //1,编写sql语句
        var MusicAddSql = 'INSERT INTO music(music_name,playlist_id,music_play,singer,language,collection,music_src,album_id) VALUES(?,?,?,?,?,?,?,?)';
        var MusicAddSql_Params = [name,0,amount,singer,languages,collection,musicSrc,album_id];
        //2,进行插入操作
        /**
         *query，mysql语句执行的方法
         * 1，userAddSql编写的sql语句
         * 2，userAddSql_Params，sql语句中的值
         * 3，function (err, result)，回调函数，err当执行错误时，回传一个err值，当执行成功时，传回result
         */
        connection.query(MusicAddSql, MusicAddSql_Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            call(result);
        });

        //5,连接结束
        connection.end();
    }

    //修改歌曲
    this.update=function (id,name,singer,language,album_id) {
        //4,编写sql语句
        var updateModSql = 'UPDATE music SET music_name = ?, singer=?,language=?,album_id=? WHERE music_id = ?';

        var updateModSql_Params = [name,singer,language,album_id, id];
        //5，更新操作
        connection.query(updateModSql,updateModSql_Params,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
        });
    }

    //删除歌曲
    this.delete = function (id,call) {
        var  specieGetSql = "DELETE FROM music where music_id = " +id;

        connection.query(specieGetSql,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            call(result);
        });
    }

    //删除与歌曲相关的歌单联系
    this.deleteSongP = function (id) {
        var  specieGetSql = "DELETE FROM song_playlist where song_id = " +id;

        connection.query(specieGetSql,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            return result;
        });
    }

    //查询歌曲
    this.querySong = function (call) {
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

    //根据id查询歌曲
    this.queryId = function (id,call) {
        var sql = "select * from music where music_id='" +id+ "'";
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