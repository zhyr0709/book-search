// pages/home/personal/modifyPwd/index.js
var layer=require("../../../../utils/layerControl.js");
var event = require('../../../../utils/event.js');
var app=getApp();
Page({
  data:{
    editContent:[
      {
        label:'旧密码',
        value:''
      },
      {
        label:'新密码',
        value:''
      },
      {
        label:'确认密码',
        value:''
      }
    ]
  },
  onInputChange: function(event){
    var curIndex = event.currentTarget.dataset.curIndex;
    var val = event.detail.value;
    this.data.editContent[curIndex].value = val;
  },
  onSubmitPress: function() {
      if(!this.data.editContent[0].value){
        layer.show(this,'fail','请输入读者证密码');
        return;
      }
      if(!this.data.editContent[1].value){
        layer.show(this,'fail','请输入新密码');
        return;
      }
      if(this.data.editContent[1].value!=
              this.data.editContent[2].value){
        layer.show(this,'fail','两次密码不一致');
        return;
      }
      var that=this;
      wx.request({
        url: app.baseUrl+'interface/opac/updateReaderPasswd',
        data: {uuid:app.uuid,rdid:that.data.rdid,
                oldPwd:that.data.editContent[0].value,
                newPwd:that.data.editContent[1].value
              },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          if(res.data.code==0){
            event.emit('user_passwd_changed',{});
             wx.navigateBack({
              delta:1
            })
          }else if(res.data.code==-1)
            layer.show(that,'fail',res.data.msg);
          else
            layer.show(that,'fail','出现错误,请重试');
        },
        fail: function() {
          layer.show(that,'fail','出现错误,请重试');
        }
      })
  },
  onLoad:function(options){
    if(!options.rdid){
      wx.redirectTo({url: '../index'});
    }
    this.setData({rdid:options.rdid});
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})