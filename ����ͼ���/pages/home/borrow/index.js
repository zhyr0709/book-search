var util=require("../../../utils/util.js");
var layer=require("../../../utils/layerControl.js");
var app=getApp();
Page({
  data:{
    current_page:1,
    has_more_page:true,
    row:10,
    loadingHidden:true,
    modalHidden:true,
    hiddenBottom:true,
    modalContent:'',
    info:[]
  },
  _renew:function(event){
    var that=this;
    if(!that.data.loadingHidden)
        return ;
    that.setData({loadingHidden: false});
    var curIndex = event.currentTarget.dataset.curIndex;
    var barcode=this.data.info[curIndex].barcode;
    util.readerRenew(barcode,function(data){
      that.setData({loadingHidden: true});
      if(data.code==0){
        that.setData({modalHidden:false,modalContent:data.msg});
        return ;
      }
      layer.show(that,'fail','出现错误，请重试');
    },function(data){
      that.setData({loadingHidden: true});
      if(data.code==-2){
        util.clearUserInfo();
        that._renew();
        return;
      }
      if(!util.showCodeTip(that,data)){
          layer.show(that,'fail','出现错误，请重试');
      }
    })
    //var info = 'info['+curIndex+'].isRenew';
    //this.setData({[info]:true})

  },
  onPullDownRefresh: function(){
    //下拉刷新
    //...
    wx.stopPullDownRefresh()
  },
  onReachBottom: function(){
      if(this.data.loadingHidden){
          this.loadMore();
      }
    //到达底部执行
  },
  onLoad:function(options){
     
  },
  loadMore:function(){
    if(!this.data.rdid)
        return ;
    var that=this;
    if(!that.data.loadingHidden)
        return ;
    if(!that.data.has_more_page){
        that.setData({hiddenBottom:false});
        return ;
    }
    that.setData({loadingHidden: false});
    wx.request({
      url: app.baseUrl+'interface/opac/loan_list',
      data: {rdid:that.data.rdid,uuid:app.uuid,row:that.data.row,
      pages:that.data.current_page},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        that.setData({loadingHidden: true,hiddenBottom:true});
        if(res.data.code==-1){
            layer.show(that,'fail',res.data.msg);
            return ;
        }
        that.setData({
            has_more_page:res.data.next,
            current_page:res.data.pages,
            row:res.data.row
        });
        that.formatData(res.data.data);
      },
      fail: function() {
        layer.show(that,'fail','出现错误，请稍后重试');
        that.setData({loadingHidden: true});
      }
    })
  },
  formatData:function(arr){
      if(!arr)
        return ;
      var tmp=[];
      var isbns=[];
      arr.forEach(function(e){
          isbns.push(e.isbn);
        tmp.push({
            cover:"/image/default_cover.jpg",
            title:e.title,
            time:e.returnDateInStr,
            borrowNum:e.loanCount,
            barcode:e.barcode,
            isRenew:false
        });
      })
      var start=this.data.info.length;
      this.setData({info:this.data.info.concat(tmp)});
      var that=this;
      util.getImages(isbns.join(","),function(arr){
          var j=0;
          for(var i=start;i<that.data.info.length;i++,j++){
            if(arr[j]){
              var index='info['+i+'].cover';
              that.setData({[index]:arr[j]});
            }
          }
      },function(){
          layer.show(that,'fail','抱歉，获取图片失败');
      })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
     var that=this;
    //调用应用实例的方法获取全局数据
    that.setData({loadingHidden: false});
    util.getReaderInfo(function(userInfo){
        that.setData({rdid:userInfo.readerInfo.rdid});
        that.setData({loadingHidden: true,pages:1,has_more_page:true,info:[]});
        that.loadMore();
    },function(res){
       layer.show(that,'fail','出现错误，请重试');
        that.setData({loadingHidden: true});
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },modalChange:function(){
    this.setData({modalHidden:true});
  }
})