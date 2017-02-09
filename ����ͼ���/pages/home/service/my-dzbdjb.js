// pages/home/my-dzbdjb.js
var md5=require("../../../utils/md5.js");
var util=require("../../../utils/util.js");
var layer=require("../../../utils/layerControl.js");
var app=getApp();
Page({
  data:{
    alertText:"绑定成功",
    isShowBzBtn:true,
    loadingHidden:true,
    bind_success:false,
    rdid:null,
    pwd:null,
  },
  _toggle:function(){
    var b=this.data.isShowBzBtn;
    this.setData({isShowBzBtn:!b});
  },
  _bind:function(){
    var that=this;
    if(!(this.data.rdid&&this.data.pwd)){
      layer.show(that,'fail','请输入证号和对应的密码');
      return ;
    }
     if(!this.data.loadingHidden)
      return ;
    that.setData({loadingHidden: false});
    util.readerLogin(function(userInfo){
       wx.request({
        url: app.baseUrl+'interface/opac/wechat_bind',
        data: {uuid:app.uuid,rdid:that.data.rdid,pwd:md5.hex_md5(that.data.pwd)},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {'Cookie':'JSESSIONID='+app.sessionid}, // 设置请求的 header
        success: function(res){
          if(res.data.code==0){
            layer.show(that,'success',"绑定成功");
            setTimeout(function(){
              wx.navigateBack({delta: 1});
            },2000)
          }else if(res.data.code==1){//解绑成功
            layer.show(that,'success',"解绑成功");
            util.clearReaderInfo();
            setTimeout(function(){
             wx.switchTab({url: '/pages/index/index'});
            },2000);
          }else if(res.data.code==-2){//需要从新登录
            util.clearUserInfo();
            that.setData({loadingHidden: true});
            that._bind();
          }else if(!util.showCodeTip(that,res.data)){
              layer.show(that,'fail','出现错误，请重试');
          }
        },
        fail: function() {
          layer.show(that,'fail','出现错误，请重试');
        },
        complete: function() {
          that.setData({loadingHidden: true});
        }
      })
    },function(res){
      if(res&&res.code==-2){//重试
        util.clearUserInfo();
        that._bind();
      }else{
        layer.show(that,'fail','数据获取失败，请重试');
      }
    });
  },
  bindRdid:function(e){
    this.setData({rdid:e.detail.value});
  },
  bindPwd:function(e){
    this.setData({pwd:e.detail.value});
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var that=this;
    that.setData({loadingHidden: false});
    util.readerLogin(function(userInfo){
      that.setData({loadingHidden: true});
      if(userInfo.readerInfo&&userInfo.readerInfo.rdid){
        that.setData({rdid:userInfo.readerInfo.rdid});
      }
    },function(res){
      that.setData({loadingHidden: true});
       if(res&&res.code==-2){//重试
          util.clearUserInfo();
          that.onShow();
        }else{
          layer.show(that,'fail','数据获取失败，请重试');
        }
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})