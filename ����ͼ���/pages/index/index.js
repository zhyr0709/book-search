//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    modalHidden:true,
    modalContent:'',
    q:''
  },
  startSearch:function(){
    if(!this.data.q){
       this.setData({ modalHidden:false,modalContent:'请输入搜索内容'});
      return ;
    }
    var that=this; 
    wx.navigateTo({
      url: 'search-result/index?q='+that.data.q+'&searchWay=title&row=10&page=1&sortWay=score&scWay=desc&uuid='+app.uuid,
    });
  },
  bindInputSearch:function(e){
    this.setData({q:e.detail.value});
  },
  modalChange:function(){
    this.setData({modalHidden:true});
  },
  onLoad: function () {
    
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
  }
})
