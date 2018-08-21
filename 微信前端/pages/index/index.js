//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isChecked: false,
      imgUrls: [
        '../../imgs/m1.jpg',
        '../../imgs/m2.jpg',
        '../../imgs/m3.jpg',
        '../../imgs/m4.jpg',
        '../../imgs/m5.jpg',
        '../../imgs/m6.jpg'
      ],
      autoplay: true,
      interval: 2000,
      duration: 1000
  },
  serviceSelection: function (e) {
    var judge = true;
    if (e.detail.value=='') {
      judge = false;
    }
    else {
      judge = true;
    }
    this.setData({
      isChecked: judge
    })
  },
  onLoad: function () {
    
  }
    
})
