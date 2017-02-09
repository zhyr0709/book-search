var layer=require("layerControl.js");
var app = getApp();
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function subStr(str,length){
  return str;
  // var strl = str.length;
  // var newStr = "";
  // if(strl < length){
  //   newStr = str;
  // }else{
  //   newStr = str.substring(0,length)+"...";
  // }
  // return newStr
}
function clearUserInfo(){
   wx.setStorageSync('user_info', null);
   app.sessionid=null;
}
function clearReaderInfo(){
  var user_info = wx.getStorageSync('user_info');
  user_info.readerInfo=null;
  app.qcode=null;
  wx.setStorageSync('user_info', user_info);
}
function  getUserInfo(cb,fail){
  var user_info = wx.getStorageSync('user_info')
  if(user_info){
    typeof cb == "function" && cb(user_info);
    return ;
  }
  user_info={};
  wx.login({
    success: function(res2){
        if(!res2.code){//用户拒绝授权
           typeof fail == "function" && fail();
        }
        user_info.code=res2.code;
        wx.getUserInfo({
          success: function(res){
            user_info.iv=res.iv;
            user_info.userInfo = res.userInfo
            user_info.encryptedData=res.encryptedData;
            wx.setStorageSync('user_info', user_info);
            typeof cb == "function" && cb(user_info);
          },
          fail: function() {
            typeof fail == "function" && fail();
          }
        })
    },
    fail: fail
    
  })
}
function readerLogin(cb,fail){
  getUserInfo(function(userInfo){
      if(app.sessionid){
        typeof cb == "function" && cb(userInfo);
        return ;
      }
      wx.request({
        url: app.baseUrl+'interface/opac/reader_login',
        data: {uuid:app.uuid,code:userInfo.code,iv:userInfo.iv, encryptedData:userInfo.encryptedData},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          if(res.data.code){//error
            typeof fail == "function" && fail(res.data);
            return ;
          }
          app.sessionid=res.data.sessionid;
          typeof cb == "function" && cb(userInfo);
        },
        fail: fail
      })
  },fail);
}
function getReaderInfo(cb,fail){
    readerLogin(function(userInfo){
       if(userInfo.readerInfo){
        typeof cb == "function" && cb(userInfo);
        return ;
      }
      wx.request({
        url: app.baseUrl+'interface/opac/reader_info',
        data: {uuid:app.uuid},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         header: {'Cookie':'JSESSIONID='+app.sessionid}, // 设置请求的 header
        success: function(res){
          if(res.data.code){
            if(res.data.code==-4){
              
            }
            typeof fail == "function" && fail(res.data);
            return ;
          }
          userInfo.readerInfo=res.data;
          wx.setStorageSync('user_info', userInfo);
          typeof cb == "function" && cb(userInfo);
        },
        fail: fail
      })
    },fail);
}
function getImages(isbns,cb,fail){
  wx.request({
    url: app.baseUrl+'interface/opac/image',
    data: {isbns:isbns},
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function(res){
      typeof cb == "function" && cb(res.data);
    },
    fail: fail
  })
}
/**
 * 电子证证 
 */
function getQcode(refresh,cb,fail){
  if(app.qcode&&!refresh){
    typeof cb == "function" && cb(app.qcode);
    return ;
  }
  getReaderInfo(function(userInfo){
    wx.request({
      url: app.baseUrl+'interface/opac/qcode',
      data: {rdid:userInfo.readerInfo.rdid,uuid:app.uuid},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'Cookie':'JSESSIONID='+app.sessionid}, // 设置请求的 header
      success: function(res){
        if(res.data.code){
          typeof fail == "function" && fail(res.data);
          return ;
        }
        app.qcode=res.data;
        typeof cb == "function" && cb(res.data);
      },
      fail: fail
    })
  },fail);
}
/**
 * 续借
 */
function readerRenew(barcode,cb,fail){
  if(!barcode)
  return ;
   getReaderInfo(function(userInfo){
    wx.request({
      url: app.baseUrl+'interface/opac/renew',
      data: {rdid:userInfo.readerInfo.rdid,
              uuid:app.uuid,barcode:barcode},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res){
        if(res.data.code){
          typeof fail == "function" && fail(res.data);
          return ;
        }
        typeof cb == "function" && cb(res.data);
      },
      fail: fail
    })
  },fail);
}
function showCodeTip(that,data){
  if(!(that&&data)){
    return false;
  }
  if(data.code==-4){//获取用户信息失败
    layer.show(that,'fail','获取用户信息失败，请重试！');
    return true;
  }else if(data.code==-3){//未绑定读者证
      layer.show(that,'fail','未绑定读者证！');
      return true;
  }else if(data.code==-1){
    layer.show(that,'fail',data.msg);
    return true;
  }
  return false;
}
module.exports = {
  formatTime: formatTime,
  subStr:subStr,
  getUserInfo:getUserInfo,
  readerLogin:readerLogin,
  getReaderInfo:getReaderInfo,
  clearUserInfo:clearUserInfo,
  clearReaderInfo:clearReaderInfo,
  getQcode:getQcode,
  readerRenew:readerRenew,
  showCodeTip:showCodeTip,
  getImages:getImages
}
