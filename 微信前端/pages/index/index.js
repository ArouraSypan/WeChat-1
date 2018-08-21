//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isChecked: false
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
