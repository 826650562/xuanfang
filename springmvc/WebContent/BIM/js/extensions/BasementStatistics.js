/*
* 除初始化加载之外，其余数据统计信息插件
* LX
* 2018/8/14
* */
function _BasementStatistics(viewer,options){
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this._viewer = viewer;

    //创建地下一层设施设备列表
    this.label= document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(this.label);
    this.label.setAttribute("id", "baseInfo");
    this.label.style.display = "none";
    this.label.style.position = "fixed";
    this.label.style.zIndex = 2;
    this.label.style.backgroundColor = "rgba(38, 62, 62, 0.7)";
    this.label.style.borderRadius = "6px";
    this.label.style.color = "#fff";
    this.label.style.width = '305px';
    this.label.style.height = "476px";
}
_BasementStatistics.prototype.unload = function(){
    return true;
};

_BasementStatistics.prototype.load = function(){
    this.init();
    return this;
};

_BasementStatistics.prototype.init = function(){
    window.addEventListener("basedata", e => { this.showBaseStatistics( e.detail ) }, false);
};

_BasementStatistics.prototype.showBaseStatistics = function() {
    self = this;
    var thatModel;
    console.log(Object.values(JHCYW.models_obj));
    for (var i=0;i<JHCYW.models_obj.length;i++){
        if (Object.keys(JHCYW.models_obj[i])[0].toString() == "地下1层"){
            thatModel = Object.values(JHCYW.models_obj[i])[0];
            console.log(thatModel);
        }
    }
    // var thatModel = Object.values(JHCYW.models_obj["地下1层"])[0];
    var instanceTree = thatModel.getData().instanceTree;
    $('#baseInfo').append('<div id= "title"><h2>设施设备</h2></div>');
    $('#baseInfo').append('<div id="baseInfo-wrapper" class="layui-collapse"></div>');
    //机械设备
    $('#baseInfo-wrapper').append('<div class="layui-colla-item" id="Mlayui"></div>');
    //电气装置
    $('#baseInfo-wrapper').append('<div class="layui-colla-item" id="Elayui"></div>');
    //照明设备
    $('#baseInfo-wrapper').append('<div class="layui-colla-item" id="Llayui"></div>');
    //关闭按钮
    $('#baseInfo').append('<span class="iSpan" id="basecancel"><i class="fa fa-remove fa-lg"></i></span>');
    // //样式清空
    // document.getElementById('baseInfo').style.display = 'none';
    var baseInfodiv = "<div id='baseinfodiv'></div>";
    $(document.body).append(baseInfodiv);
    // $('#baseinfodiv').append('<span class="iSpan" id="baseInfocancel"><i class="fa fa-remove fa-lg"></i></span>');
    // $("#baseInfocancel").click(function(){
    //     document.getElementById('baseinfodiv').style.display = 'none';
    //     $('#baseinfodiv').html('');
    //     // $("#baseinfodiv").remove();
    // })

    var MnameArr = new Array();
    var EnameArr = new Array();
    var LnameArr = new Array();

    var MnameArrdbId = new Array();
    var EnameArrdbId = new Array();
    var LnameArrdbId = new Array();

    //搜索机械设备
    thatModel.search("机械设备",function (item) {

        var MnameL = item.length-1;
        var MnameInfo = new Array();
        console.log(item);
        item.map(function (val, index) {
            var Mname = instanceTree.getNodeName(val);
            MnameArr.push(Mname);
            MnameArrdbId.push(val);
            MnameInfo.push({"name":MnameArr,"dbid":MnameArrdbId});
            if (MnameL == index){
                for (var i=0;i<MnameInfo.length;i++){
                    if ( MnameInfo[0].name[i] == '3000 CMH' || MnameInfo[0].name[i] == '丙型 - 左 - 65 mm' || MnameInfo[0].name[i] == '排风机' || MnameInfo[0].name[i] == '标准' || MnameInfo[0].name[i] == '给水变频调速设备' || MnameInfo[0].name[i] == '三组给水变频调速设备' ){
                        $("#Mlayui").append('<div class="Lclick"><h2 class="layui-colla-title"><i class="layui-icon layui-colla-icon"></i>'+MnameInfo[0].name[i]+'</h2></div>')
                    }else if (MnameInfo[0].name[i] != '机械设备') {
                        $('.Lclick').append('<div class="layui-colla-content layuitool"><a href="#" _dbid ="' + MnameInfo[0].dbid[i] + '" class="Lclickdbid">' + MnameInfo[0].name[i] + '</a></div>')
                    }

                }
            }

        })
        Lclick();
    },'类别')

    //搜索电气装置
    thatModel.search("电气装置",function (item) {
        var EnameL = item.length-1;
        var EnameInfo = new Array();
        item.map(function (val, index) {
            var Ename = instanceTree.getNodeName(val);
            EnameArr.push(Ename);
            EnameArrdbId.push(val);
            EnameInfo.push({"name":EnameArr,"dbid":EnameArrdbId});
            if (EnameL == index){
               for (var i=0;i<EnameInfo.length;i++){
                   if ( EnameInfo[0].name[i] == '电源自动切换箱' || EnameInfo[0].name[i] == '动力配电箱' || EnameInfo[0].name[i] == '照明配电箱' || EnameInfo[0].name[i] == '应急照明配电箱' || EnameInfo[0].name[i] == 'LEB-局部等电位箱'){
                       $("#Elayui").append('<div class="Lclick"><h2 class="layui-colla-title"><i class="layui-icon layui-colla-icon"></i>'+EnameInfo[0].name[i]+'</h2></div>')
                   }else if (EnameInfo[0].name[i] != '电气装置') {
                       $('.Lclick').append('<div class="layui-colla-content layuitool"><a href="#" _dbid ="'+EnameInfo[0].dbid[i]+'" class="Lclickdbid">'+EnameInfo[0].name[i]+'</a></div>')
                   }
                }
            }
        })
        Lclick();
    },'类别')

    // //搜索照明装置
    thatModel.search("照明设备",function (item) {
        var LnameL = item.length-1;
        var LnameInfo = new Array();
        item.map(function (val, index) {
            var Lname = instanceTree.getNodeName(val);
            LnameArr.push(Lname);
            LnameArrdbId.push(val);
            LnameInfo.push({"name":LnameArr,"dbid":LnameArrdbId});
            if (LnameL == index){
                for (var i=0;i<LnameInfo.length;i++){
                    if ( LnameInfo[0].name[i] == '单管荧光灯' || LnameInfo[0].name[i] == '单管荧光灯（应急照明）-吊链' || LnameInfo[0].name[i] == '单管荧光灯—吊链' || LnameInfo[0].name[i] == '单管荧光灯(应急照明)—壁装' || LnameInfo[0].name[i] == '单管防水防尘荧光灯—壁装'){
                        $("#Llayui").append('<div class="Lclick"><h2 class="layui-colla-title"><i class="layui-icon layui-colla-icon"></i>'+LnameInfo[0].name[i]+'</h2></div>')
                    }else if (LnameInfo[0].name[i] != '照明设备') {
                        $(".Lclick").append('<div class="layui-colla-content layuitool" ><a href="#" _dbid="'+LnameInfo[0].dbid[i]+'" class="Lclickdbid">'+LnameInfo[0].name[i]+'</a></div>')
                    }
                }
            }
        })
        Lclick();
    },'类别')

    function Lclick() {
        $(".Lclick").unbind().click(function(){
            if($(this).find(".layui-icon").hasClass("rotate")){
                $(".layui-icon").removeClass("rotate");
                $(this).find(".layui-colla-content").removeClass("layui-show");
            }else{
                $(".layui-icon").removeClass("rotate");
                $(this).find(".layui-icon").addClass("rotate");
                $("#Lclick").find(".layui-show").removeClass("layui-show");
                $(this).find(".layui-colla-content").addClass("layui-show");
            }
        })
        $('.Lclickdbid').unbind().click(function () {
            $('#baseinfodiv').html('');
            self._viewer.select([Number($(this).attr('_dbid'))]);
            //传入传感器dbid
            var threeMesh = buildComponentMesh( self._viewer, Number($(this).attr('_dbid')) );
            var basePos = new Object();
            basePos.x = (threeMesh.boundingBox.max.x+threeMesh.boundingBox.min.x)/2;
            basePos.y = (threeMesh.boundingBox.max.y+threeMesh.boundingBox.min.y)/2;
            basePos.z = (threeMesh.boundingBox.max.z+threeMesh.boundingBox.min.z)/2;
            self._viewer.loadExtension('Autodesk.FirstPerson', self._viewer.config)
                .then(function () {
                    self._viewer.setActiveNavigationTool('firstperson'); //viewer3d需要开启第一视角工具
                    //重新设置相机的位置
                    //注意camera up vector 的方向，还有跟right vector的关系，以及pivot的位置

                    self._viewer.navigation.setRequestTransitionWithUp(true,new THREE.Vector3(basePos.x-5,basePos.y-5, basePos.z),new THREE.Vector3(basePos.x,basePos.y, basePos.z),45,new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0));

                    self._viewer.navigation.setPivotPoint(true); //更新到pivot
                });
            // 添加设施设备信息框弹窗
            //这里要根据 $(this).attr('_dbid') 获取模型对应的属性信息
            //需要属性：房间名称，制造商  系统分类（这个就是类型）  类型 ID（dbid不要了）
            self.viewer.getProperties(Number($(this).attr('_dbid')),function(e){
                var baseVal= e.properties;
                var xtval ="无";
                for (var i=0;i<baseVal.length;i++){
                    if (baseVal[i].displayName == "系统分类" && baseVal[i].displayValue !=""){
                        xtval = baseVal[i].displayValue;
                        console.log(xtval);
                    }
                }
                $('#baseinfodiv').append("<div id='basetitle'>设施设备信息框</div><div id='basecontent'><ul><li>设备名称：<span>"+ e.name +"</span></li><li>房间名称：<span>"+ e.properties[6].displayValue+"</span></li><li>系统分类: <span>"+xtval+"</span></li><li>类型ID: <span>" +e.properties[25].displayValue+ "</span></li><li>制造商：<span>北京蓝宝机械有限公司</span></li><li>安装日期：<span>2018年6月21日</span></li></ul></div>");

                $('#baseinfodiv').append('<span class="iSpan" id="baseInfocancel"><i class="fa fa-remove fa-lg"></i></span>');
                $('#baseinfodiv').css('display','block');
                $('#baseinfodiv').draggable();

                $("#baseInfocancel").click(function(){
                    document.getElementById('baseinfodiv').style.display = 'none';
                    $('#baseinfodiv').html('');
                    // $("#baseinfodiv").remove();
                })

            },function () {});
        })
    }

    //设备设施框可拖拽
    $('#baseInfo').draggable();


    //点击设施设备框
    $("#basecancel").unbind().click(function(){
        MnameArr = [];
        LnameArr = [];
        EnameArr = [];
        $('#baseInfo').html('');
        document.getElementById('baseInfo').style.display = 'none';
        self._viewer.setActiveNavigationTool();
        self._viewer.impl.fitToView(thatModel);
    })

    // $("#baseInfocancel").click(function(){
    //     document.getElementById('baseinfodiv').style.display = 'none';
    //     $('#baseinfodiv').html('');
    //     // $("#baseinfodiv").remove();
    // })
}
Autodesk.Viewing.theExtensionManager.registerExtension('BasementStatistics', _BasementStatistics);