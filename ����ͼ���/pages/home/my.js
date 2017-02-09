// pages/index/advance-search/index.js
var util=require("../../utils/util.js");
var layer=require("../../utils/layerControl.js");
var app = getApp();
Page({
  data:{
      qrcodeIcon:'../../image/erweima.jpg',
      personal:'personal/index',
      loadingHidden:true,
      modalHidden:true,
      userInfo:null,
      pages:[
        [
          {name:'读者证件服务',url:'service/my-dzbdjb'},
          {name:'我的借阅',url:'borrow/index'}
        ]
      ],
  },
  onLoad:function(options){
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var that=this;
    //调用应用实例的方法获取全局数据
    that.setData({loadingHidden: false});
    util.getReaderInfo(function(userInfo){
        that.setData({userInfo:userInfo.userInfo});
        that.setData({'userInfo.readerInfo':userInfo.readerInfo})
        that.setData({loadingHidden: true});
    },function(res){
        that.setData({loadingHidden: true});
        if(res&&res.code==-3){
          that.setData({modalHidden:false});
          return ;
        }
         if(res&&res.code==-2){//重试
           util.clearUserInfo();
           that.onShow();
         }else if(!util.showCodeTip(that,res)){
            layer.show(that,'fail','数据获取失败，请重试');
         }
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  modalChangeCancel:function(){
    this.setData({modalHidden:true});
    wx.switchTab({url: '/pages/index/index'})
  },
   modalChangeConfirm:function(){
    this.setData({modalHidden:true});
    wx.navigateTo({url: 'service/my-dzbdjb'})
  }
})