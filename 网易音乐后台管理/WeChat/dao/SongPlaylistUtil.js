function SongPlaylistUtil() {
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

    //删除含有歌曲
    this.delete = function (id,call) {
        var  songGetSql = "DELETE FROM song_playlist where song_id = " +id;

        connection.query(songGetSql,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            call(result);
        });
    }

    //插入歌曲与歌单
    this.inserMusic = function (song_id,playlist_id) {
        //1,编写sql语句
        var MusicAddSql = 'INSERT INTO song_playlist(song_id,playlist_id) VALUES(?,?)';
        var MusicAddSql_Params = [song_id,playlist_id];
        //2,进行插入操作
        connection.query(MusicAddSql, MusicAddSql_Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            return result;
        });
        //5,连接结束
    }
}


module.exports = SongPlaylistUtil;