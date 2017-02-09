
var app = getApp();

function  getUserInfo(cb,fail){
  var user_info={};
  return new Promise(function(resolve,reject){
      wx.login({
        success: function(res2){
            if(!res2.code){//用户拒绝授权
                reject();
                return ;
            }
            user_info.code=res2.code;
            wx.getUserInfo({
                success: function(res){
                    // user_info.iv=res.iv;
                    // user_info.userInfo = res.userInfo
                    // user_info.encryptedData=res.encryptedData;
                    resolve(res);
                },
                fail: function() {
                    reject();
                }
            })
        },
        fail: reject
    })
  });
}
/**
 * 获取sessinoid
 */
function readerLogin(){
    return new Promise(function(resolve,reject){
        getUserInfo().then(function(userInfo){
            if(app.sessionid){//检查缓存
                userInfo.sessionid=app.sessionid;
                resolve(userInfo);
                return ;
            }
            wx.request({
                url: app.baseUrl+'interface/opac/reader_login',
                data: {uuid:app.uuid,code:userInfo.code,iv:userInfo.iv, encryptedData:userInfo.encryptedData},
                method: 'POST', 
                // header: {}, // 设置请求的 header
                success: function(res){
                    if(res.data.code){//error
                        reject(res.data);
                        return ;
                    }
                    app.sessionid=res.data.sessionid;//缓存到app
                    userInfo.sessionid=app.sessionid;
                    resolve(userInfo);
                },
                fail: fail
            })
        },reject)
    });
}

function getReaderInfo(){
    return new Promise(function(resolve,reject){
        readerLogin().then(function(userInfo){
            if(userInfo.readerInfo){
                resolve(userInfo);
                return ;
            }
            wx.request({
                url: app.baseUrl+'interface/opac/reader_info',
                data: {uuid:app.uuid},
                method: 'GET',
                header: {'Cookie':'JSESSIONID='+app.sessionid},
                success: function(res){
                    if(res.data.code){
                        if(res.data.code==-4){
                        
                        }
                        reject(res.data);
                        return ;
                    }
                    userInfo.readerInfo=res.data;
                    resolve(userInfo);
                },
                fail: reject
            })
        },reject);
    });
    readerLogin(function(userInfo){
      wx.request({
        url: app.baseUrl+'interface/opac/reader_info',
        data: {uuid:app.uuid},
        method: 'GET', 
         header: {'Cookie':'JSESSIONID='+app.sessionid}, 
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
/**
 * 获取图片封面
 */
function getImages(isbns){
    return new Promise(function(resolve,reject){
        wx.request({
            url: app.baseUrl+'interface/opac/image',
            data: {isbns:isbns},
            method: 'GET', 
            success: function(res){
                resolve(res.data);
            },
            fail: reject
        })
    });
}

/**
 * 电子证证 
 */
function getQcode(refresh){
    return new Promise(function(resolve,reject){
        if(app.qcode&&!refresh){
            resolve(app.qcode);
            return ;
        }
        getReaderInfo().then(function(userInfo){
            wx.request({
                url: app.baseUrl+'interface/opac/qcode',
                data: {rdid:userInfo.readerInfo.rdid,uuid:app.uuid},
                method: 'GET',
                header: {'Cookie':'JSESSIONID='+userInfo.sessionid},
                success: function(res){
                    if(res.data.code){
                        reject(res.data);
                        return ;
                    }
                    app.qcode=res.data;
                    resolve(res.data);
                },
                fail: reject
            })
        },reject);
    });
}

/**
 * 续借
 */
function readerRenew(barcode){
    return new Promise(function(resolve,reject){
        if(!barcode){
            reject();
            return ;
        }
        getReaderInfo().then(function(userInfo){
            wx.request({
                url: app.baseUrl+'interface/opac/renew',
                data: {rdid:userInfo.readerInfo.rdid,
                        uuid:app.uuid,barcode:barcode},
                method: 'GET',
                success: function(res){
                    if(res.data.code){
                        reject(res.data);
                        return ;
                    }
                    resolve(res.data);
                },
                fail: reject
            })
        },reject);
    });
}

module.exports={
    getUserInfo:getUserInfo,
    readerLogin:readerLogin,
    getReaderInfo:getReaderInfo,
    getQcode:getQcode,
    readerRenew:readerRenew,
    getImages:getImages
}