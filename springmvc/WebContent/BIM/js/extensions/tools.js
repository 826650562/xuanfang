/**
 * Created by Administrator on 2018/7/2/002.
 * 工具扩展插件
 * 王新亮
 */
function _tools(viewer, options) {
    //必须要写的
    Autodesk.Viewing.Extension.call(this, viewer, options);

    this.tool_buttons = ".indexrightbox .gnanniu";
    this._viewer = viewer;
    /*this.showimg = document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(this.showimg);
    var style = document.createAttribute("style");
    this.showimg.setAttributeNode(style);
    this.showimg.style.display = "none";*/
    window.hideList = [];
    window.hideBox;
}

//插件卸载时执行
_tools.prototype.unload = function () {
    return true;
};

//插件加载时执行 入口
_tools.prototype.load = function () {
    this.init();
    return this;
};
_tools.prototype.init = function () {
    this._addEventListener();
    this.setTimeAndDate();
    // this.initEchartsOfbottom();
};
//内部注册事件函数
_tools.prototype._addEventListener = function () {
    // this.tool_buttons
    var self = this;
    $(self.tool_buttons).unbind().click(function () {
        self._doMainEvent($(this).index());
    });



};
_tools.prototype.setTimeAndDate =function ()  {
    //设置系统时间

    var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];

    function _settime() {
        setTimeout(function () {
            var today = new Date();
            document.getElementById("date01").innerHTML = (today.getFullYear()) + "年" + (today.getMonth() + 1 ) + "月" + today.getDate() + "日  " ;
            document.getElementById("time01").innerHTML = (today.getHours()) + ':' + (today.getMinutes()) + ':' + (today.getSeconds());
            document.getElementById("week01").innerHTML = (weekday[today.getDay()]);
            _settime();
        },1000)
    }
    _settime();

};



_tools.prototype._doMainEvent = function (index) {
    var self = this;
    switch (index) {
        //第一人称视角
        case 0:
            this.firstSightseeing();
            break;
        //关闭及清除
        case 1:
            this.deleteSth();
            this.closeSelect();
            break;
        //截图导出图片
        case 2:
            this.CutScreenPic();
            break;
        //回到原始位置
        case 3:
            this.toLocal(self._viewer);
            break;
        //查看传感器
        // case 4:
        //     this.hideOrShowTextures(self._viewer);
        //     break;
    }
};

/*
 * 第一视角 LX
 * */

_tools.prototype.firstSightseeing = function(){
     var self=this;
     var iopen=$(self.tool_buttons).eq(0).attr('iopen');
     if (iopen=='1'){
        self._viewer.setActiveNavigationTool();
        $(self.tool_buttons).eq(0).attr('iopen','0').css('background','url(static/images/gnanniubg.png) no-repeat')
     }else{
        this._viewer.loadExtension('Autodesk.FirstPerson', this._viewer.config)
            .then(function () {
                self._viewer.setActiveNavigationTool('firstperson'); //viewer3d需要开启第一视角工具
            });
        $(self.tool_buttons).eq(0).attr('iopen','1').css('background','url(static/images/gnanniuhoverbg.png) no-repeat')
     }
};

/*
 * 清除第一视角及测量工具
 * */
_tools.prototype.deleteSth = function(){
    var self = this;
    self._viewer.setActiveNavigationTool(); //删除
  /*  //清除观察样式
    document.getElementById('gc').style.border = "1.5px solid white";
    document.getElementById('arrow02').style.borderBottom = "10px solid white";
    //清除量算样式
    document.getElementById('ls').style.border = "1.5px solid white";
    document.getElementById('arrow01').style.borderBottom = "10px solid white";*/
};

/*
 查看传感器
 * */
_tools.prototype.hideOrShowTextures=function(viewer) {

    if ($("#ldInput").attr("model_id") == "" || $("#ldInput").attr("model_id") == undefined && window.hideList.length == 0) {
        alert("请选择楼栋");
    } else {
        console.log("引入传感器插件成功");
    }

};
/*
 * 截屏功能
 * 张昌北
 * */
_tools.prototype.CutScreenPic = function () {
    var b = this._viewer.getScreenShotBuffer();//截屏方法得到Base64的图片地址b
    this.showimg.src = b.toString();//Base64图片地址塞进img标签的src中
    var imgsrc = this.showimg.src;//定义imgsrc
    //将页面上的图片保存到本地电脑(浏览器默认的 下载地址)
    var a = document.createElement('a');
    a.setAttribute("href", imgsrc);
    a.setAttribute("download", "");
    var evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
    a.dispatchEvent(evObj);
};
//关闭清除功能
_tools.prototype.closeSelect = function(){
    //清除房间选中
    this._viewer.clearSelection(true);
    this._viewer.impl.clearOverlay("boundingBox_info");
    $("#info_label").hide(300);
    //关闭菜单栏 清除楼层选择效果
    $("#fangjianbox").find(".LcChoosed").find("img").attr("src","images/sxt-3.png");
    $("#fangjianbox").find(".LcChoosed").removeClass("LcChoosed");
    $("#loudongbox").css({'display':'none'});
    $("#loucentbox").css({'display':'none'});
    $("#fangjianbox").css({'display':'none'});
    $("#xitongbox").css({'display':'none'});

    if(window.hideList.length!=0){//取消透视
        this._viewer.showAll(true);
        window.hideList = [];
    }
    //清除传感器弹窗
    $("#cgq_info_contri").hide(500);
    $("#cgq_box").hide(500);
    $("#arrow").hide(500);
    this._viewer.impl.invalidate(
        true, true, true)

};
//回到原始位置
_tools.prototype.toLocal  = function(view){
    view.navigation.setRequestTransitionWithUp(true,new THREE.Vector3(-400.0043366824929,-270.0816380112992,170.3020853438724),view.impl.scene.position,45,new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0));
    // view.loadExtension("liftAnimation"); //电梯测试入口 test
};


//注册到 Autodesk.Viewing.theExtensionManager   参数：1.插件名称  2.上面的对象名
Autodesk.Viewing.theExtensionManager.registerExtension('Tools', _tools);