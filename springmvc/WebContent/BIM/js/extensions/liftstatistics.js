/*
* 电梯模型数据导入插件
* LX
* 2018/8/24
* */
function _LiftStatistics(viewer,options){
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this._viewer = viewer;

    //创建地下一层设施设备列表
    this.label= document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(this.label);
    this.label.setAttribute("id", "liftInfo");
    this.label.style.display = "none";
    this.label.style.position = "fixed";
    this.label.style.zIndex = 2;
    this.label.style.backgroundColor = "rgba(37, 37, 37, 0.76)";
    this.label.style.borderRadius = "6px";
    this.label.style.color = "#fff";
    this.label.style.width = '255px';
    this.label.style.height = "297px";
    this.label.style.top = '425px';
    this.label.style.left = '125px';
    this.label.style.padding = "15px";
}
_LiftStatistics.prototype.unload = function(){
    return true;
};

_LiftStatistics.prototype.load = function(){
    this.init();
    return this;
};

_LiftStatistics.prototype.init = function(){
    // window.addEventListener("basedata", e => { this.showBaseStatistics( e.detail ) }, false);
    this.showLiftStatistics();
};

_LiftStatistics.prototype.showLiftStatistics = function() {
    self = this;
    //电梯点击事件
    $('.liftsxt').unbind().click(function () {
        self.label.innerHTML = null;
        self.label.style.display = "block";

        var val = $(this).parent('.liftnum').find('p').text();
        $('#liftInfo').append('<div id= "title"><h2>电梯运维</h2></div>');
        $('#liftInfo').append('<div class="lift-wrapper"></div>');
        //机械设备
        $('.lift-wrapper').append('<ul class="lift_info"><li class="_info">名称：<span class="info1">'+val+'</span></li><li class="_info">安装日期：<span>2018/05/06</span></li><li class="_info">生产厂商：<span class="info1">杭州奥德森电梯有限公司</span></li><li class="_info">维护单位：<span class="info1">北京华星宇恒电梯维保公司</span></li><li class="_info">上次检修日期：<span class="info1">2018/08/01</span></li><li class="_info">下次检修日期：<span class="info1">2018/09/01</span></li></ul>');
        $('.lift-wrapper').append('<div class="Lbtn"><span class="liftbtn border-l" id="jx"><a href="#" >检修记录</a></span><span class="liftbtn"><a href="'+window.Path+'/bim/bimJzxx/Pdflist" target="_blank">PDF文档</a></span><span class="liftbtn"><a href="'+window.Path+'/bim/bimJzxx/Videolist" target="_blank">教学视频</a></span></div>')
        //关闭按钮
        $('#liftInfo').append('<span class="iSpan" id="liftcancel"><i class="fa fa-remove fa-lg"></i></span>');

        $("#jx").click(function(){
            alert("检修记录文档尚未完工……");
        })
        //点击设施设备框
        $("#liftcancel").click(function(){
            $('#liftInfo').html('');
            document.getElementById('liftInfo').style.display = 'none';
        })
    })

    $(".liftnum").unbind().click(function (e) {
        var oEvent = e || event;
        oEvent.cancelBubble = true;
        $(".liftnum").removeClass('LcChoosed');
        $(".liftnum").find("img").attr("src","static/images/sxt-3.png");
        $(this).addClass('LcChoosed');
        $(this).find("img").attr("src", "static/images/sxt-2.png");
    });

    //设备设施框可拖拽
    $('#liftInfo').draggable();



}
Autodesk.Viewing.theExtensionManager.registerExtension('LiftStatistics', _LiftStatistics);