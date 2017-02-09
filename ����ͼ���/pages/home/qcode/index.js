// pages/home/qcode/index.js
var util=require("../../../utils/util.js");
var layer=require("../../../utils/layerControl.js");
var app = getApp();
Page({
  data:{
    loadingHidden:true,
    modalHidden:true,
    refresh:false,
    qcode:'',
    uuid:null
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    this.loadQcode();
  },
  loadQcode:function(){
    var that=this;
    if(!that.data.loadingHidden){
      return ;
    }
    that.setData({loadingHidden: false});
    util.getQcode(that.data.refresh,function(data){
      that.setData({
        qcode:data.qcode.replace("http","https"),
        uuid:data.uuid
      });
      that.setData({refresh:false});
      that.setData({loadingHidden: true});
    },function(data){
      that.setData({loadingHidden: true});
      if(data&&data.code==-2){
        that.relogin();
        return ;
      }else if(data&&data.code==-3){
        that.setData({modalHidden:false});
      }else if(!util.showCodeTip(that,data))
        layer.show(that,'fail','数据获取失败，请重试');  
    });
  },
  refreshQcode:function(){
    this.setData({refresh:true});
    this.onShow();
  },
  relogin:function(){
    util.clearUserInfo();
    this.onShow();
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
    wx.navigateTo({url: '/pages/home/service/my-dzbdjb'})
  }
})