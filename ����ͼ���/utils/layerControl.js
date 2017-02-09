function show(that,atype,text,duration=2000){//success,fail,text
    var img='';
    if(atype=='fail')
        img='/image/m2.png';
    if(atype=='success')
        img='/image/m0.png';
    if(atype=='text')
        img='';
    that.setData({
        layerinfo:{
            text,
            atype,
            img,
            show:true
        }
    });
    setTimeout(function(){
        that.setData({
            'layerinfo.show':false
        })
    },duration);
}
module.exports = {
    show:show
}