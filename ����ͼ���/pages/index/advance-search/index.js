// pages/index/advance-search/index.js
var app=getApp();
Page({
  data:{
    search_config:{
      search_way_index:0,
      sc_way_name: "dim",
      sort_way_index:0,
      selectedSortOrder:'desc'
    },
    search_way_value:['题名','正题名','ISBN','著者','主题','分类号','控制号','订购号','索书号','出版社'],//检索方式
    search_way_name:['title','title200a','isbn','author','subject','class','ctrlno','orderno','callno','publisher'],  
    search_way_index:0,
    sc_way:[ 
      {name: 'dim', value: '模糊检索'},
      {name: 'prefixMatch', value: '前缀匹配'},
      {name: 'full', value: '精确检索'}],
    sc_way_name: "dim",
    sort_way:['匹配度', '出版日期', '主题词', '题名','著者','索书号','题名拼音','借阅次数','卷册号','续借次数','题名权重','正题名权重'],//文献类型
    sort_way_value:['score','pubdate_sort','subject_sort','title_sort','author_sort','callno_sort','pinyin_sort','loannum_sort','title200h','renewnum_sort','title200Weight','title200aWeight'],
    sort_way_index:0,
    sortOrder:[{name:'降序',value:'desc'},{name:'升序',value:'asc'}],
    selectedSortOrder:'desc',
    q:'',
    row:10,
    page:1,
    hasNextPage:true,
    modalHidden:true,
    modalContent:''
  },
  sartSearch:function(){
    if(!this.data.q){
       this.setData({modalHidden:false,modalContent:'请输入搜索条件'});
       return ;
    }
    // var param='?uuid='+app.uuid+'&q='+this.data.q+'&searchWay='+this.data.search_way_name[this.data.search_way_index]+'&row='+this.data.row+'&page='+this.data.page+'&sortWay='+this.data.sort_way_value[this.data.sort_way_index]+'&scWay='+this.data.selectedSortOrder;
    // wx.navigateTo({url:'../search-result/index'+param});
  },
  getSearchConfig(name){
    let that = this;
    wx.getStorage({
      key: name,
      success: function(res){
        console.log(res);
        that.setData({
          search_config:res.data
        });
        let searchConfig = that.data.search_config;
        let sc_way = that.data.sc_way;
        let sortOrder = that.data.sortOrder;
        that.setData({
          selectedSortOrder:searchConfig.selectedSortOrder,
          sort_way_index:searchConfig.sort_way_index,
          sc_way_name:searchConfig.sc_way_name,
          search_way_index:searchConfig.search_way_index
        });
        for(let sortOrderIndex=0;sortOrderIndex < sortOrder.length;sortOrderIndex++){
          if(sortOrder[sortOrderIndex].value === searchConfig.selectedSortOrder) {
            sortOrder[sortOrderIndex].checked = true;
            that.setData({
              sortOrder:sortOrder
            })
          }
        }
        for(let scindex=0;scindex < sc_way.length;scindex++){
          if(sc_way[scindex].name === searchConfig.sc_way_name) {
            sc_way[scindex].checked = true;
            that.setData({
              sc_way:sc_way
            })
          }
        }
      },
      fail:function(err){
        that.data.sc_way[0].checked = true;
        that.setData({
          sc_way:that.data.sc_way
        });
        that.data.sortOrder[0].checked = true;
        that.setData({
          sortOrder:that.data.sortOrder
        });
      }
      
    })
    // console.log(that.data.search_config);
  },
  saveSeachConfig(val,name) {
    let that = this;
    let configName = 'search_config.'+name;
    console.log(configName);
    this.setData({
      [configName]:val
    })
    console.log(that.data.search_config);
    wx.setStorage({
      key: 'searchConfig',
      data: that.data.search_config,
      success: function(res){
        console.log(res);
      }
    })
  },
  searchKeyInput:function(e){
    this.setData({q:e.detail.value});
  },
  sortOrderChange:function(e){
    this.setData({selectedSortOrder:e.detail.value});
    this.saveSeachConfig(this.data.selectedSortOrder,'selectedSortOrder');
  },
   bindsortWayChange: function(e) {
    this.setData({
      sort_way_index: e.detail.value
    });
    this.saveSeachConfig(this.data.sort_way_index,'sort_way_index');
  },
  bindScWayChange:function(e){
    console.log(e.detail.value);
    this.setData({
      sc_way_name:e.detail.value
    })
    this.saveSeachConfig(this.data.sc_way_name,'sc_way_name');

  },
  bindSearchWayChange:function(e){
     this.setData({
      search_way_index: e.detail.value
    });
    this.saveSeachConfig(this.data.search_way_index,'search_way_index');
  },
  modalChange:function(){
    this.setData({modalHidden:true});
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getSearchConfig('searchConfig');
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