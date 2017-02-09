// pages/index/book-detail/index.js
var util = require("../../../utils/util.js");
var layer=require("../../../utils/layerControl.js");
var app=getApp();
Page({
  data:{
    bookrecno:'',
    noData:false,
    loadingHidden1:true,
    loadingHidden2:true,
    book:{
      image:'/image/default_cover.jpg',
      title:'',
      author:'',
      subject:'',
      publisher:'',
      pubdate:'',
      classNo:''
    },
    bookCollec:[]
  },
  onLoad:function(options){
    if(options.bookrecno){
      this.setData({bookrecno:options.bookrecno});
    }else{
      layer.show(this,'text','出现错误')
      setTimeout(function(){
        wx.navigateBack({delta: 1 });
      },2000);
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    if(!this.data.bookrecno)
      return ;
    var that=this;
    that.setData({loadingHidden1: false, loadingHidden2:false});
    wx.request({
      url: app.baseUrl+'interface/opac/book_detail',
      data: {uuid:app.uuid,bookrecno:that.data.bookrecno},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        var data=res.data;
        if(data.code==-1){
          layer.show(that,'fail',data.msg);
          return ;
        }
        if(data.isbn)
          util.getImages(data.isbn,function(res){
            if(res&&res[0])
              that.setData({'book.image':res[0]});
          },function(){
          })
        that.setData({book:data});
      },
      fail: function() {
        layer.show(that,'text','加载出错');
      },
      complete: function() {
        that.setData({loadingHidden1: true});
      }
    });
    that.setData({noData:false});
    wx.request({
      url: app.baseUrl+'interface/opac/book_collec',
      data: {uuid:app.uuid,bookrecno:that.data.bookrecno},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res.data);
        var d=res.data;
        if(d.holdingList&&d.holdingList.length==0){
          that.setData({noData:true});
          return ;
        }
        var bookCollec=[];
        d.holdingList.forEach(function(e,i){
          bookCollec.push({
            callno:e.callno,
            orglib:d.libcodeMap[e.orglib]||'暂无',
            orglocal:d.localMap[e.orglocal]||'暂无'
          });
        });
        var arr=[];
        bookCollec.forEach(function(e,i){
          var added=false;
          for(var i=0;i<arr.length;i++){
            if(arr[i].orglib==e.orglib&&
                arr[i].orglocal==e.orglocal){
                arr[i].num=arr[i].num+1;
                added=true;
            }
          }
          if(!added){
            e.num=1;
            arr.push(e);
          }
        });
        that.setData({bookCollec:arr});
      },
      fail: function() {
        layer.show(that,'text','加载出错');
      },
      complete: function() {
        that.setData({ loadingHidden2:true});
      }
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})