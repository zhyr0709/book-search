// pages/home/personal/editPersonal/index.js
var event = require('../../../../utils/event.js');
var layer=require("../../../../utils/layerControl.js");
var util=require("../../../../utils/util.js");
var app=getApp();
Page({
  data:{
    maxNum:150,
    remainNum:150,
    loadingHidden:true,
    editContent:null,
    rdid:null
  },
  onTextareaChange: function(event){
    var curIndex = event.currentTarget.dataset.curIndex;
    var val = event.detail.value;
    var remainNum = this.data.maxNum - val.length;
    this.data.editContent[curIndex].value = val;
    this.setData({
      remainNum : remainNum,
    });
  },
  onInputChange: function(event){
    var curIndex = event.currentTarget.dataset.curIndex;
    var val = event.detail.value;
    this.data.editContent[curIndex].value = val;
  },
  onSubmitPress: function() {
      //在这里执行修改信息的操作
      var that=this;
      var param={uuid:app.uuid,rdid:that.data.rdid||'',
              rdName:that.data.editContent[0].value||'',
              rdPhone:that.data.editContent[1].value||'',
              rdEmail:that.data.editContent[2].value||'',
              rdAddress:that.data.editContent[3].value||'',
              }
      wx.request({
        url:app.baseUrl+'interface/opac/updateReaderInfo',
        data: param,
        method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          if(res.data.code==0){
              var user_info = wx.getStorageSync('user_info');
              if(param.rdAddress)
                user_info.readerInfo.rdAddress=param.rdAddress
              if(param.rdEmail)
                user_info.readerInfo.rdEmail=param.rdEmail
              if(param.rdName)
                user_info.readerInfo.rdName=param.rdName
              if(param.rdPhone)
                user_info.readerInfo.rdPhone=param.rdPhone
              wx.setStorageSync('user_info', user_info);
              event.emit('user_info_changed',{});
              wx.navigateBack({
                delta:1
              })
          }else if(!util.showCodeTip(that,res.data))
            layer.show(that,'fail','修改出错');
        },
        fail: function() {
           layer.show(that,'fail','修改出错');
        }
      })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady:function(){
    // 页面渲染完成
    this.setData({
      remainNum : this.data.maxNum - this.data.editContent[3].value.length
    })
  },
  onShow:function(){
    // 页面显示
    var that = this;
    that.setData({loadingHidden: false});
    util.getReaderInfo(function(userInfo){
      that.setData({rdid:userInfo.readerInfo.rdid});
      that.setData({rdlibName:userInfo.readerInfo.rdlibName});
        that.setData({
          editContent:[
            {
              label:'姓名',
              value:userInfo.readerInfo.rdName||''
            },
            {
              label:'手机',
              value:userInfo.readerInfo.rdPhone||''
            },
            {
              label:'邮箱',
              value:userInfo.readerInfo.rdEmail||''
            },
            {
              label:'地址',
              value:userInfo.readerInfo.rdAddress||''
            }
          ]
        })
        that.setData({loadingHidden: true});
    },function(res){
      that.setData({loadingHidden: true});
       if(res&&res.code==-3){
          wx.navigateTo({url: '../../service/my-dzbdjb'})
          return ;
        }
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