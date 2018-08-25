var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
//handle request entity too large
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
//设置静态文件
app.use(express.static('public'));
//指定模板引擎
app.set("views engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/views');
//接受表单的请求

var urlencodedParser=bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

var formidable = require('formidable');

//引入腾讯云模块

var COS = require('cos-nodejs-sdk-v5');


//首页
app.get("/index", function(req, res) {
    var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
    //2,创建对象
    playlistMusicUtil = new PlaylistMusicUtil();
    playlistMusicUtil.init();
    playlistMusicUtil.queryPlaylist(function (data) {
        var AlbumMusicUtil = require('./dao/AlbumMusicUtil');
        //2,创建对象
        albumMusicUtil = new AlbumMusicUtil();
        albumMusicUtil.init();
        albumMusicUtil.queryalbum(function (album) {
            res.render('index', {
                data: data,
                album:album
            })
        })

    })
});

//添加歌单
app.get('/addPlaylist', function(req, res) {
    var name = req.query.name;
    var label = req.query.label;
    var pathsrc = req.query.pathsrc;
    var amount = req.query.amount;
    var collection = req.query.collection;
    var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
    //2,创建对象
    playlistMusicUtil = new PlaylistMusicUtil();
    playlistMusicUtil.init();
    // inserPlaylist = function (id,name,path,amount,label,collection)
    playlistMusicUtil.inserPlaylist(0,name,pathsrc,amount,label,collection,function (data) {
        id = data.insertId;
        var response = {
            result:1,
            id:id
        }
        // console.log(JSON.stringify(response));
        res.end(JSON.stringify(response));
    });
});

//删除歌单
app.post('/deletePlaylist', urlencodedParser, function(req, res) {
    req.on('data',function (aplaylist_id) {
        var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
        //2,创建对象
        playlistMusicUtil = new PlaylistMusicUtil();
        playlistMusicUtil.init();
        playlistMusicUtil.delete(aplaylist_id);
        var response = {
            result:1
        }
        res.end(JSON.stringify(response));
    });
});

// 修改歌单
app.post("/Playlistupload", function (req, res) {



    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/upload';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        console.log(files.uploadImage.path);
        if (err) {
            res.locals.error = err;
            res.render('index', { title: "图片上传失败" });
            return;
        }
        //显示地址；
        var path = files.uploadImage.path;

        var index=  path.lastIndexOf('\\')+1;
        path=path.substring(index,path.length);

        console.log(path);




        res.json({
            "newPath":'http://localhost:8088/upload/'+path
        });
    });
});

//根据id查询歌单
app.get('/selectPlaylistid', function (req, res) {
    var id = req.query.id;
    //1, 引入模块
    var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
    //2,创建对象
    playlistMusicUtil = new PlaylistMusicUtil();
    playlistMusicUtil.init();
    playlistMusicUtil.queryId(id,function (playlistData) {
        playlistData.forEach(function (playlist) {
            var response = {
                playlist:playlist
            }
            res.end(JSON.stringify(response));
        });
    });
});

//修改歌单
app.get('/alterplaylist', function (req, res) {
    var id = req.query.id;
    var playName = req.query.playName;
    var playLabel = req.query.playLabel;
    var src = req.query.src;
    //1, 引入模块
    var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
    //2,创建对象
    playlistMusicUtil = new PlaylistMusicUtil();
    playlistMusicUtil.init();
    playlistMusicUtil.update(id,playName,playLabel,src);
    var response = {
        result:1
    }
    res.end(JSON.stringify(response));
})

//查询歌曲
app.get('/SelectSong', function (req, res) {
    var SongMusicUtil = require('./dao/SongMusicUtil');
    //2,创建对象
    songMusicUtil = new SongMusicUtil();
    songMusicUtil.init();
    songMusicUtil.querySong(function (data) {
        var playlists = [];
        var index = 0;
        for(var i=0;i<data.length;i++) {
            console.log("data.length "+data.length+"index"+index);
            var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
            //2,创建对象
            playlistMusicUtil = new PlaylistMusicUtil();
            playlistMusicUtil.init();
            playlistMusicUtil.queryMusic_list(data[i].music_id,function (playlist) {
                index++;
                for(var i=0;i<playlist.length;i++) {
                    playlists.push({id:playlist[i].music_id,playlist_name:playlist[i].playlist_name});
                }
                if(index==data.length) {
                    var response = {
                        data: data,
                        playlist: playlists
                    }
                    console.log(playlists);
                    res.end(JSON.stringify(response));
                }

            });
        }
    });
});

//添加歌曲
app.post("/uploadSong", function (req, res) {

    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/upload';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        console.log(files.uploadImage.path);
        if (err) {
            res.locals.error = err;
            res.render('index', { title: "歌曲上传失败" });
            return;
        }
        //显示地址；
        var path = files.uploadImage.path;
        var index=  path.lastIndexOf('\\')+1;
        path=path.substring(index,path.length);
        console.log(path);
        res.json({
            "newPath":'http://localhost:8088/upload/'+path
        });
    });
});

//添加音乐
app.get('/addMusic', function (req, res) {
    var name = req.query.name;
    var singer = req.query.singer;
    var languages = req.query.languages;
    var amount = req.query.amount;
    var collection = req.query.collection;
    var musicSrc = req.query.musicSrc;
    var album_id = req.query.playlist_name;

    //1, 引入模块
    var SongMusicUtil = require('./dao/SongMusicUtil');
    //2,创建对象
    songMusicUtil = new SongMusicUtil();
    songMusicUtil.init();
    songMusicUtil.inserMusic(name,singer,languages,amount,collection,musicSrc,album_id,function (data) {
        id = data.insertId;
        var response = {
            result:1,
            id:id
        }
        console.log(JSON.stringify(response));
        res.end(JSON.stringify(response));
    });
})

//删除歌曲
app.post('/deleteMusic', urlencodedParser, function(req, res) {
    req.on('data',function (Music_id) {
        var SongMusicUtil = require('./dao/SongMusicUtil');
        //2,创建对象
        songMusicUtil = new SongMusicUtil();
        songMusicUtil.init();
        songMusicUtil.delete(Music_id,function (data) {
            songMusicUtil.deleteSongP(Music_id);
            var response = {
                result:1
            }
            res.end(JSON.stringify(response));
        });

    });
});

//根据id查询歌曲
app.get('/selectMusicid', function (req, res) {
    var id = req.query.id;
    //1, 引入模块
    var SongMusicUtil = require('./dao/SongMusicUtil');
    //2,创建对象
    songMusicUtil = new SongMusicUtil();
    songMusicUtil.init();
    songMusicUtil.queryId(id,function (songData) {
        songData.forEach(function (song) {
            var response = {
                song:song
            }
            res.end(JSON.stringify(response));
            //species.push(specie);
        });
    });
});

//修改歌曲
app.get('/alterMusicid', function (req, res) {
    var id = req.query.id;
    var name = req.query.name;
    var singer = req.query.singer;
    var language = req.query.language;
    var album_id = req.query.album_id;
    //1, 引入模块
    var SongMusicUtil = require('./dao/SongMusicUtil');
    //2,创建对象
    songMusicUtil = new SongMusicUtil();
    songMusicUtil.init();
    songMusicUtil.update(id,name,singer,language,album_id);
    var response = {
        result:1
    }
    res.end(JSON.stringify(response));
})

//将歌曲与歌单相连
app.get('/addSongPlaylist', function (req, res) {
    var id = req.query.id;
    var check_val = req.query.check_val;
    var index = 0;
    var playlist = check_val.split(",")
    var SongPlaylistUtil = require('./dao/SongPlaylistUtil');
    //2,创建对象
    songPlaylistUtil = new SongPlaylistUtil();
    songPlaylistUtil.init();
    songPlaylistUtil.delete(id,function (data) {
        for(var i=0;i<playlist.length;i++) {
            songPlaylistUtil.inserMusic(id,playlist[i]);
            index++;
        }
        if(index==playlist.length) {
            var response = {
                result:1
            }
            res.end(JSON.stringify(response));
        }
    });

    // //1, 引入模块
    // var SongMusicUtil = require('./dao/SongMusicUtil');
    // //2,创建对象
    // songMusicUtil = new SongMusicUtil();
    // songMusicUtil.init();
    // songMusicUtil.inserMusic(name,singer,languages,amount,collection,musicSrc,album_id,function (data) {
    //     id = data.insertId;
    //     var response = {
    //         result:1,
    //         id:id
    //     }
    //     console.log(JSON.stringify(response));
    //     res.end(JSON.stringify(response));
    // });
})

//查询专辑
app.get('/SelectAlbum', function (req, res) {
    var AlbumMusicUtil = require('./dao/AlbumMusicUtil');
    //2,创建对象
    albumMusicUtil = new AlbumMusicUtil();
    albumMusicUtil.init();
    albumMusicUtil.queryalbum(function (data) {
        var response = {
            data:data
        }
        res.end(JSON.stringify(response));
    });
});

//添加专辑
app.post('/addAlbum', urlencodedParser, function(req, res) {
    req.on('data',function (album) {
        var album_name = album;
        var AlbumMusicUtil = require('./dao/AlbumMusicUtil');
        //2,创建对象
        albumMusicUtil = new AlbumMusicUtil();
        albumMusicUtil.init();
        albumMusicUtil.inserAlbum(0,album_name,function (data) {
            id = data.insertId;
            var response = {
                result:1,
                id:id,
                album:album_name.toString()
            }
            // console.log(JSON.stringify(response));
            res.end(JSON.stringify(response));
        });
    });
});

//删除专辑
app.post('/deleteAlbum', urlencodedParser, function(req, res) {
    req.on('data',function (album_id) {
        var AlbumMusicUtil = require('./dao/AlbumMusicUtil');
        //2,创建对象
        albumMusicUtil = new AlbumMusicUtil();
        albumMusicUtil.init();
        albumMusicUtil.delete(album_id);
        var response = {
            result:1
        }
        res.end(JSON.stringify(response));
    });
});

//根据id查询专辑
app.get('/selectAlbumid', function (req, res) {
    var id = req.query.id;
    //1, 引入模块
    var AlbumMusicUtil = require('./dao/AlbumMusicUtil');
    //2,创建对象
    albumMusicUtil = new AlbumMusicUtil();
    albumMusicUtil.init();
    albumMusicUtil.queryId(id,function (albumData) {
        albumData.forEach(function (album) {
            var response = {
                album:album.album_name
            }
            res.end(JSON.stringify(response));
            //species.push(specie);
        });
    });
});

//修改专辑
app.get('/alterAlbumid', function (req, res) {
    var id = req.query.id;
    var name = req.query.name;
    //1, 引入模块
    var AlbumMusicUtil = require('./dao/AlbumMusicUtil');
    //2,创建对象
    albumMusicUtil = new AlbumMusicUtil();
    albumMusicUtil.init();
    albumMusicUtil.update(id,name);
    var response = {
        result:1
    }
    res.end(JSON.stringify(response));
})

//查询mv
app.get('/SelectMv', function (req, res) {
    var MVMusicUtil = require('./dao/MVMusicUtil');
    //2,创建对象
    mvMusicUtil = new MVMusicUtil();
    mvMusicUtil.init();
    mvMusicUtil.queryMV(function (data) {
        var response = {
            data:data
        }
        res.end(JSON.stringify(response));
    });
});

//添加mv
app.get('/addMV', function (req, res) {
    var Name = req.query.Name;
    var Infor = req.query.Infor;
    var address = req.query.address;
    console.log(Name);
    //1, 引入模块
    var MVMusicUtil = require('./dao/MVMusicUtil');
    //2,创建对象
    mvMusicUtil = new MVMusicUtil();
    mvMusicUtil.init();
    mvMusicUtil.inserMv(Name,Infor,address,function (data) {
        id = data.insertId;
        var response = {
            result:1,
            id:id,
            Name:Name,
            Infor:Infor,
            address:address
        }
        console.log(JSON.stringify(response));
        res.end(JSON.stringify(response));
    });
})

//删除mv
app.post('/deleteMv', urlencodedParser, function(req, res) {
    req.on('data',function (mv_id) {
        var MVMusicUtil = require('./dao/MVMusicUtil');
        //2,创建对象
        mvMusicUtil = new MVMusicUtil();
        mvMusicUtil.init();
        mvMusicUtil.delete(mv_id);
        var response = {
            result:1
        }
        res.end(JSON.stringify(response));
    });
});

//根据id查询MV
app.get('/selectMVid', function (req, res) {
    var id = req.query.id;
    //1, 引入模块
    var MVMusicUtil = require('./dao/MVMusicUtil');
    //2,创建对象
    mvMusicUtil = new MVMusicUtil();
    mvMusicUtil.init();
    mvMusicUtil.queryId(id,function (mvData) {
        mvData.forEach(function (mv) {
            var response = {
                mv:mv
            }
            res.end(JSON.stringify(response));
            //species.push(specie);
        });
    });
});

//修改MV
app.get('/alterMVid', function (req, res) {
    var id = req.query.id;
    var name = req.query.name;
    var infor = req.query.infor;
    var address = req.query.address;
    //1, 引入模块
    var MVMusicUtil = require('./dao/MVMusicUtil');
    //2,创建对象
    mvMusicUtil = new MVMusicUtil();
    mvMusicUtil.init();
    mvMusicUtil.update(id,name,infor,address);
    var response = {
        result:1
    }
    res.end(JSON.stringify(response));
})



app.listen(8088);