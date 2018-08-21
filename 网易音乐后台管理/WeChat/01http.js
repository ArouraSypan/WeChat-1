/**
 * Created by boy on 2017/7/10.
 */
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var multer = require('multer');
var fs=require('fs');
//1,接受表单的请求
app.use(bodyParser.urlencoded({extended: false}));
//2,设置下载的地址
app.use(multer({dest: '/public/images/'}).array('image'));
//设置静态文件
app.use(express.static('public'));
//指定模板引擎
app.set("views engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/views');
//1, 引入模块
var updateSql = require('./dao/updateSql');
//2,创建对象
updateSql = new updateSql();
updateSql.init();
//引入腾讯云模块
var qqutil=require('./util/QQutil');
qqutil=new qqutil();
qqutil.init();
var COS = require('cos-nodejs-sdk-v5');
var cos = new COS({
    // 必选参数
    SecretId: "AKIDNEqC4Li0Vt2jHu8IEMEALtBEcU5eZEbj",
    SecretKey: "0kESQ8WhFXIVUFoHPId5cyWUcR7JHzmK",
});
//利用模板文件home.ejs渲染为html
app.get("/index", function(req, res) {

    res.render('index', {

        }

    );
});

app.get("/select", function(req, res) {




    res.render();

});


app.post('/find', urlencodedParser, function(req, res) {
    var name=req.body.picname;

    updateSql.queryAllpic(name,function (data) {
        res.render('findpic', {
            pic:data

        });
    })


});
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

app.post('/addmusic', function (req, res) {
    var key=new Date();
    var filepath = req.files[0].path;
    var name=req.files[0].originalname;
    var namee=name.split('.');
    var aa=namee[0];
    var paylist=req.body.playlist;
    var play=0;
    var singer=req.body.singer;
    var language=req.body.language;
    var collection=0;
    var album=req.body.album;
    // 调用方法
    cos.putObject({
        Bucket: "music-1257212633", /* 必须 */ // Bucket 格式：test-1250000000
        Region: "ap-chengdu",
        Key: key.toLocaleString(), /* 必须 */
        TaskReady: function (tid) {
        },
        onProgress: function (progressData) {
        },
        Body: fs.createReadStream(filepath),
        ContentLength: fs.statSync(filepath).size
    }, function (err, data) {
        if (data.statusCode >= 200){
            console.log(111)
            if(updateSql.inserMusic(0,aa,paylist,play,singer,language,collection,key.toLocaleString(),album)){
                console.log(222)
                res.render('success', {

                    }

                );
            }

        }
    });
})
app.post('/addlist', function (req, res) {
    var key=new Date();
    var filepath = req.files[0].path;
    var name=req.body.playlist_name;
    var label=req.body.label;
    var amount=Math.floor(Math.random()*64526+1215);
    var collection=Math.floor(Math.random()*10000+254);
    // 调用方法
    // var i=updateSql.inserPlaylist(0,name,key.toLocaleString(),amount,label,collection);
    // console.log(i)

    cos.putObject({
        Bucket: "images-1257212633", /* 必须 */ // Bucket 格式：test-1250000000
        Region: "ap-chengdu",
        Key: key.toLocaleString(), /* 必须 */
        TaskReady: function (tid) {
        },
        onProgress: function (progressData) {
        },
        Body: fs.createReadStream(filepath),
        ContentLength: fs.statSync(filepath).size
    }, function (err, data) {
        if (data.statusCode >= 200){
            updateSql.inserPlaylist(0,name,key.toLocaleString(),amount,label,collection);
            res.render('success', {
                }
            );
        }
    });


})
var server = app.listen(8088);