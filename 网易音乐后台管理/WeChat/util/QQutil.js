function QQutil() {
    
    this.init=function () {
        // 引入模块
        var COS = require('cos-nodejs-sdk-v5');

        this.cos = new COS({
            // 必选参数
            SecretId: "AKIDNEqC4Li0Vt2jHu8IEMEALtBEcU5eZEbj",
            SecretKey: "0kESQ8WhFXIVUFoHPId5cyWUcR7JHzmK",
        });
    }
    
    this.insert=function (key,path,call) {
        var fs=require('fs');
        this.cos.putObject({
            Bucket: "myimages-1257212633", /* 必须 */ // Bucket 格式：test-1250000000
            Region: "ap-chengdu",
            Key: key, /* 必须 */
            TaskReady: function (tid) {
            },
            onProgress: function (progressData) {
                //console.log(JSON.stringify(progressData));
            },
            // 格式1. 传入文件内容
            // Body: fs.readFileSync(filepath),
            // 格式2. 传入文件流，必须需要传文件大小
            Body: fs.createReadStream(path),
            ContentLength: fs.statSync(path).size
        }, function (err, data) {
            if (err) {
                return console.log(err);
            }
            if (data.statusCode == 200) {
                call();
            }
        });

    }
    this.query=function (key,call) {
        var url= this.cos.getObjectUrl({
            Bucket: "myimages-1257212633", // Bucket 格式：test-1250000000
            Region: "ap-chengdu",
            Key: key,
            Expires: 600000,
            Sign: true,
        }, function (err, data) {

        });
        call(url);

    }
    
}


module.exports = QQutil;