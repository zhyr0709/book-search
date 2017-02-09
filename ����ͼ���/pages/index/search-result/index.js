// pages/index/search-result/index.js
var util = require("../../../utils/util.js");
var layer=require("../../../utils/layerControl.js");
var app=getApp();
Page({
  data:{
    search_param:{},
    bookList:[],
    historyList: [],
    hasNextPage:true,
    loadingHidden:true,
    historyHidden:false,
    hiddenBottom:true,
    modalHidden:true,
    modalContent:'',
  },
  onLoad:function(options){
    options.uuid = app.uuid;
    this.setData({search_param:options});
    console.log(this.data.search_param);
    let that = this;
    if(!!options.q){
      loadMore();
    }
    wx.getStorage({
      key:"history",
      success: function(res) {
        if(res.data.length > 5){
          res.data.splice(5);
        }
        that.setData({
          historyList : res.data
        })
      }
    })

    
  },
  clearHistory: function(e){
    let that = this;
    let data = this.data.historyList
    data.splice(e.currentTarget.dataset.historykey,1);
    wx.setStorage({
      key:"history",
      data: data,
      success: function() {
        that.setData({
          historyList : data
        })
      }
    })
  },
  chooseHistory(e) {
    this.setData({
      'search_param.q': e.currentTarget.dataset.historykey
    });
    this.startSearch();
  },
  setHistory() {
    var that = this;
    // var curDate = new Date().getTime();
    var historylist = this.data.historyList;
    var query = this.data.search_param.q
    for(let j = 0;j<historylist.length;j++){
      if(historylist[j].name === query){
        historylist.splice(j,1);
      }
    }
    historylist.unshift({
      name: query
    })
    this.setData({
      historyList: historylist
    })
    wx.setStorage({
      key:"history",
      data: historylist
    })
  },
  startSearch:function(){
    if(!this.data.search_param.q){
      layer.show(this,'fail','请输入搜索内容');
      return ;
    }
    this.setData({
      historyHidden: true
    });
    this.setData({hasNextPage:true,'search_param.page':1});
    this.setData({bookList:[]});
    this.setHistory();
    this.loadMore(false);
  },
  loadMore:function(increment){
    if(!this.data.loadingHidden)
      return ;
    if(increment!=false){
      var page=this.data.search_param.page?parseInt(this.data.search_param.page)+1:1;
      this.setData({hiddenBottom:true,'search_param.page':page});
    }
    if(!this.data.hasNextPage){
      this.setData({hiddenBottom:false});
      return;
    }
    this.loadingTap();
    var url=app.baseUrl+'interface/opac/advanceSearch';
    var that=this;
    console.log(that.data.search_param);
    wx.request({
      url: url,
      data: that.data.search_param,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        var data=res.data;
        if(data.code==-1){
          layer.show(that,'fail',data.msg);
          return ;
        }
        var totalPage=(data.totalCount/data.row)+data.totalCount%data.row;
        if(!data.bookList || data.bookList.length===0){
          layer.show(that,'text',"没有查询到结果");
          return;
        }
        that.setData({hiddenBottom:true,
            'hasNextPage':data.page<totalPage});
        var isbns=[];
        data.bookList.forEach(function(e){
            e.title=e.title;
            e.author=e.author;
            e.publisher=e.publisher;
            isbns.push(e.isbn);
        });
        var start=that.data.bookList.length;
        that.setData({bookList:that.data.bookList.concat(data.bookList)});
        util.getImages(isbns.join(","),function(arr){
          var j=0;
          for(var i=start;i<that.data.bookList.length;i++,j++){
              var index='bookList['+i+'].cover';
              that.setData({[index]:arr[j]||'/image/default_cover.jpg'});
          }
      },function(){
          layer.show(that,'fail','抱歉，获取图片失败');
      })
      },
      fail: function(e) {
        layer.show(that,'fail','数据获取失败，请重试');
      },
      complete: function() {
        that.setData({loadingHidden: true});
      }
    });
  },
   onReachBottom: function(){
     if(this.data.search_param.q){
       this.loadMore();
     }
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
  },
  bindInputSearch:function(e){
    this.setData({'search_param.q':e.detail.value});
  },
  loadingTap: function() {
    this.setData({loadingHidden: false});
  },
  modalChange:function(){
    this.setData({modalHidden:true});
  },
})