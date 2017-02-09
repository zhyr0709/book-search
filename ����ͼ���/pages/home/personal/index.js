// pages/home/personal/index.js
var event = require('../../../utils/event.js');
var util = require('../../../utils/util.js');
var layer=require("../../../utils/layerControl.js");
var app = getApp();
Page({
  data:{
    qrcodeIcon:'/image/erweima.jpg',
    userInfo:null,
    balance:100,
    user_passwd_changed:false,
    user_info_changed:false,
    showQR:false,
    loadingHidden:true,
    qruser : {
      name:'二维码读者',
      icon:'/image/erweima.jpg',
      identity:'',
      tip:'将以上二维码放置在自助借还机扫码处',
      img:""
    },
    pages:[
      [{
        name:'修改密码',
        url:'modifyPwd/index',
        icon:'/image/arrowright.png'
      }]
    ],
    readerInfo:{
      url:'editPersonal/index',
      info:{}
    }
  },
  toggleQR:function() {
    var that=this;
    if(that.data.showQR){
      that.setData({showQR: !that.data.showQR});
      return ;
    }
    if(!that.data.loadingHidden)
      return ;
    that.setData({loadingHidden: false});
    util.getQcode(false,function(data){
      that.setData({
          qrcodeIcon:data.qcode,
          'qruser.icon':data.qcode,
          showQR: !that.data.showQR,
          loadingHidden: true
        });
    },function(){
      that.setData({loadingHidden: true});
      if(data&&data.code==-2){
          that.relogin();
          return ;
      }else if(!util.showCodeTip(that,data))
        layer.show(that,'fail','数据获取失败，请重试');
    });
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    event.on('user_info_changed',this, function(){
      layer.show(this,'success','修改成功');
    });
    event.on('user_passwd_changed',this, function(){
      layer.show(this,'success','修改成功');
    });
  },
  onReady:function(){
  },
  onShow:function(){
    var that=this;
    //调用应用实例的方法获取全局数据
    that.setData({loadingHidden: false});
    util.getReaderInfo(function(userInfo){
        
         that.setData({
           userInfo:userInfo.userInfo,
           'readerInfo.info':userInfo.readerInfo,
           'qruser.identity':userInfo.readerInfo.rdName,
           'qruser.img':userInfo.userInfo.avatarUrl
           });
        that.setData({loadingHidden: true});
    },function(res){
        that.setData({loadingHidden: true});
        if(res&&res.code==-3){
          wx.navigateTo({url: '../service/my-dzbdjb'})
          return ;
        }
         if(res&&res.code==-2){//重试
           util.clearUserInfo();
           that.onShow();
         }else if(!util.showCodeTip(that,data)){
           layer.show(that,'fail','数据获取失败，请重试');
         }
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
    event.remove('infoChanged', this);
  }
})