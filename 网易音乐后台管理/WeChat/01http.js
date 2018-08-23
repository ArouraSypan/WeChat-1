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

//1, 引入模块
var updateSql = require('./dao/updateSql');
//2,创建对象
updateSql = new updateSql();
updateSql.init();
//引入腾讯云模块

var COS = require('cos-nodejs-sdk-v5');
var cos = new COS({
    // 必选参数
    SecretId: "AKIDNEqC4Li0Vt2jHu8IEMEALtBEcU5eZEbj",
    SecretKey: "0kESQ8WhFXIVUFoHPId5cyWUcR7JHzmK",
});
//利用模板文件home.ejs渲染为html
// app.get("/index", function(req, res) {
//
//     res.render('index', {
//
//         }
//
//     );
// });
var listdata=[];
var i=0;
app.get("/index", function(req, res) {
    var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
    //2,创建对象
    playlistMusicUtil = new PlaylistMusicUtil();
    playlistMusicUtil.init();
    playlistMusicUtil.queryPlaylist(function (data) {
        res.render('index', {
            data: data
        })
    })
});


app.post('/find', urlencodedParser, function(req, res) {
    var name=req.body.picname;

    updateSql.queryAllpic(name,function (data) {
        res.render('findpic', {
            pic:data

        });
    })


});
// app.post('/addalbum', urlencodedParser, function(req, res) {
//     var name=req.body.album_name;
//     console.log(name)
//     updateSql.inserAlbum(0,name,function ()
//     {
//         res.render('success', {
//
//         });
//     })
//
//
//
// });
app.post('/up', urlencodedParser, function(req, res) {
    var name=req.body.namepic;
    var path=req.body.path;
    var bt=req.body.bt;
    var instr=req.body.instr;
    var i=updateSql.updateBan(path,bt,instr,name) ;
    if(i=1){
        res.render('success', {

        });
    }
});
app.post("/deldata", urlencodedParser,function(req, res) {
    req.on('data',function(data){
        if(updateSql.delBan(data)){
            res.end('删除成功');
        }
        else {
            res.end('删除失败');
        }
    })

});
app.get("/update", function(req, res) {


    res.render('update', {

        }

    );
});
app.get("/services", function(req, res) {
    imageUtil.queryAllServices(function (imageData) {
            var length = imageData.length;
            for (var i = 0; i < length; i++) {
                imagedatd[i] = imageData[i]
            }
            res.render('services', {
                    imageData: imagedatd
                }
            );

        }
    );
});
app.get("/single", function(req, res) {

    res.render('single', {

        }

    );
});
app.get("/work", function(req, res) {

    res.render('work', {

        }

    );
});

// app.post('/addmusic', function (req, res) {
//     var key=new Date();
//     var filepath = req.files[0].path;
//     var name=req.files[0].originalname;
//     var namee=name.split('.');
//     var aa=namee[0];
//     var paylist=req.body.playlist;
//     var play=0;
//     var singer=req.body.singer;
//     var language=req.body.language;
//     var collection=0;
//     var album=req.body.album;
//     // 调用方法
//     if(updateSql.inserMusic(0,aa,paylist,play,singer,language,collection,key.toLocaleString(),album)){
//         cos.putObject({
//             Bucket: "music-1257212633", /* 必须 */ // Bucket 格式：test-1250000000
//             Region: "ap-chengdu",
//             Key: key.toLocaleString(), /* 必须 */
//             TaskReady: function (tid) {
//             },
//             onProgress: function (progressData) {
//             },
//             Body: fs.createReadStream(filepath),
//             ContentLength: fs.statSync(filepath).size
//         }, function (err, data) {
//             if (data.statusCode >= 200){
//                 res.render('success', {
//
//                     }
//
//                 );
//             }
//         });
//
//     }
//
// })
// app.post('/addlist', function (req, res) {
//     var key=new Date();
//     var filepath = req.files[0].path;
//     var name=req.body.playlist_name;
//     var label=req.body.label;
//     var amount=Math.floor(Math.random()*45457+1215);
//     var collection=Math.floor(Math.random()*10000+254);
//     // 调用方法
//     cos.putObject({
//         Bucket: "images-1257212633", /* 必须 */ // Bucket 格式：test-1250000000
//         Region: "ap-chengdu",
//         Key: key.toLocaleString(), /* 必须 */
//         TaskReady: function (tid) {
//         },
//         onProgress: function (progressData) {
//         },
//         Body: fs.createReadStream(filepath),
//         ContentLength: fs.statSync(filepath).size
//     }, function (err, data) {
//         var url= cos.getObjectUrl({
//             Bucket: "images-1257212633", // Bucket 格式：test-1250000000
//             Region: "ap-chengdu",
//             Key: key.toLocaleString(),
//             Expires: 600000,
//             Sign: true,
//         }, function (err, data) {
//             if (data.statusCode >= 200){
//                 updateSql.inserPlaylist(0,name,data.Url.toLocaleString(),amount,label,collection);
//                 res.render('update', {
//                     }
//                 );
//             }
//
//             //updateSql.inserPlaylist(0,name,data.Url,amount,label,collection);
//
//         });
//         // if (data.statusCode >= 200){
//         //     updateSql.inserPlaylist(0,name,key.toLocaleString(),amount,label,collection);
//         //     res.render('success', {
//         //         }
//         //     );
//         // }
//     });
//
//
// });

app.get("/success", function (req, res) {
    res.render('success', {

    });
});

app.post("/addlist", function (req, res) {
    var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
    //2,创建对象
    playlistMusicUtil = new PlaylistMusicUtil();
    playlistMusicUtil.init();
    var filepath = req.files[0].path;

    var name = req.body.name;
    var label = req.body.label;
    var amount = Math.floor(Math.random() * 45457 + 1215);
    var collection = Math.floor(Math.random() * 10000 + 254);

    var fileKey = "nodejs" + new Date().getTime();
    // 调用方法
    cos.putObject({
        Bucket: "qqmusic-1257212625", /* 必须 */ // Bucket 格式：test-1250000000
        Region: "ap-chengdu",
        Key: fileKey, /* 必须 */
        TaskReady: function (tid) {
        },
        onProgress: function (progressData) {

        },
        // 格式1. 传入文件内容
        // Body: fs.readFileSync(filepath),
        // 格式2. 传入文件流，必须需要传文件大小
        Body: fs.createReadStream(filepath),
        ContentLength: fs.statSync(filepath).size
    }, function (err, data) {
        if (data.statusCode == 200) {
            var url = cos.getObjectUrl({
                    Bucket: "qqmusic-1257212625", // Bucket 格式：test-1250000000
                    Region: "ap-chengdu",
                    Key: fileKey,
                    Expires: 600000,
                    Sign: true,
                }, function (err, data) {
                    // if (data.statusCode == 200) {
                    //     playlistMusicUtil.inserPlaylist(0, name, data.Url, amount, label, collection);
                    //     res.render('index', {});
                    // }
                    playlistMusicUtil.inserPlaylist(0, name, data.Url, amount, label, collection);
                    playlistMusicUtil.queryPlaylist(function (data) {
                        res.render('index', {
                            data: data
                        })
                    })
                    // res.render('index', {})

                }
            );
        }
    });
});

app.post("/upload", function (req, res) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/upload';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        // console.log(files.uploadImage);
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

app.get('/SelectSong', function (req, res) {
    var SongMusicUtil = require('./dao/SongMusicUtil');
    //2,创建对象
    songMusicUtil = new SongMusicUtil();
    songMusicUtil.init();
    songMusicUtil.querySong(function (data) {
        var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
        //2,创建对象
        playlistMusicUtil = new PlaylistMusicUtil();
        playlistMusicUtil.init();
        playlistMusicUtil.queryMusic_list(function (playlist) {
            var response = {
                data: data,
                playlist: playlist
            }
            res.end(JSON.stringify(response));
        });
    });
});





//     var SongMusicUtil = require('./dao/SongMusicUtil');
//     //2,创建对象
//     songMusicUtil = new SongMusicUtil();
//     songMusicUtil.init();
//     songMusicUtil.querySong(function (data) {
//         var length = data.length;
//         console.log("length"+length)
//         var index=0;
//         for(var i=0;i<length;i++) {
//             var PlaylistMusicUtil = require('./dao/PlaylistMusicUtil');
//             //2,创建对象
//             playlistMusicUtil = new PlaylistMusicUtil();
//             playlistMusicUtil.init();
//             var songs = [];
//             var music_id = data[i].music_id;
//             console.log("data[i].music_id  "+data[i].music_id);
//             playlistMusicUtil.queryMusic_list(data[i].music_id,function (playlist_name) {
//
//                 console.log("music_id "+music_id);
//                 console.log("i "+index);
//                 // for(var j=0;j<playlist_name.length;j++) {
//                 //     songs[j] = playlist_name;
//                 // }
//                 songs.push({playlist_name:playlist_name,id:index});
//                 index++;
//                 console.log("  playlist_name "+playlist_name);
//
//                 // songs.push(playlist_name);
//                 // index++;
//                 if(index==length) {
//                     var response = {
//                         data:data,
//                         playlist_name:songs
//                     }
//                     res.end(JSON.stringify(response));
//                 }
//
//             });
//         }
//         // var response = {
//         //     data:data
//         // }
//         // res.end(JSON.stringify(response));
//     });
// });



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