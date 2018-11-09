/*
 * *
 * Created by Administrator on 2018/6/25/025.
 */

function _Infor(viewer, options){
    //固定格式 需要写这句
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this._viewer = viewer;
    //添加需要的变量
    this.label= document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(this.label);

    var style = document.createAttribute("style");
    this.label.setAttributeNode(style);
    this.label.setAttribute("id", "cgq_info_contri");
    this.label.setAttribute("class", "cgq_info_contri");
    this.scene = viewer.impl.scene;
    this.camera = viewer.impl.camera;
    this.viewer=viewer;
    this.pos1;
    this.interval;
    this.createBox();
    this.label.innerHTML = '';
    this.label.innerHTML+='<div class="cgq_box" id="cgq_box" style="height: 100%"><div class="temBox"><label>当前设备：</label><span id="temName"></span></div>'+
        '<div class="temBox"><label>信息时间：</label><span id="temTim">  </span></div>'+
        '<div class="temBox"><label>当前温度：</label><span id="temTem"> °C</span></div>'+
        '<div class="temBox"><label>当前湿度：</label><span id="temHum">'+' %RH</span></div></div>';
        //'<div class="temBox" id="temBtn"><button id="moreTem" class="moreTem">查看更多</button></div>';//<button id="moreTem" class="moreTem">查看更多</button>
    this.label.innerHTML+='<div class="arrow" id="arrow" style="position: absolute"><i class="fa fa-sort-desc fa-lg"></i></div>';
    //.label.innerHTML+='<span class="iSpan"><i class="fa fa-remove fa-lg"></i></span>';
    $("#arrow").css({"left":(this.label.clientWidth/2-8)+'px',"top":(this.label.clientHeight-12)+'px'});
    //传感器列表
    this.lineColor = "red";
    this.label2= document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(this.label2);
    this.label2.setAttribute("id", "sensor_label");
    this.label2.setAttribute("class", "sensor_label");

}

_Infor.prototype.unload = function() {
    return true;
};

_Infor.prototype.load = function() {
    //插件入口
    this.init();
    this.sensorInfo();
    return this;
};
_Infor.prototype.init = function() {
    var self=this;
    //监听点击事件
    this.viewer.addEventListener(  //传入this
        Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
        onSelectionChange
    );

    window.addEventListener("cgqInforOver", function (e) {
        /*this.viewer.removeEventListener(  //传入this
            Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            onSelectionChange
        );*/
        onSelectionChanged(e.detail);
    }, false);


    window.addEventListener("cgqInforClick",function(e){
        var timeObj = self.getTime();
        self.showMore(timeObj.preTime,timeObj.currentTime,timeObj.curDate);
    },false);

    function onSelectionChanged( event ) {
        if(event){
            var dbId =  event.dbid;
            self.viewer.getProperties(dbId, showLabel,function(){});
            document.addEventListener('mousewheel', function(){
                self.moveLabel();
            }, true);
            document.addEventListener('mousemove',function(){
                self.moveLabel();
            }, false);
        }
    }

    function onSelectionChange( event ) {
        if(event.selections && event.selections[0]&& event.selections[0].dbIdArray.length<=1){//
            self.viewer.model=event.selections[0].model;
            var dbId =  event.selections[0].dbIdArray[0];
            var instanceTree = self.viewer.model.getData().instanceTree;
             var name = instanceTree.getNodeName(dbId);
             if(typeof(dbId)=="number" && name.indexOf('传感器')<0){
                $('#cgq_info_contri2').css('display','none');
                 $('#cgq_info_contri').css('display','none');
                return;
             }else {
                 self.getTem2(name,dbId);
             }
        }
    }
    // 显示label
    function showLabel(e){
        var instanceTree = self.viewer.model.getData().instanceTree;
        var name = instanceTree.getNodeName(e.dbId).split('-')[0];
        self.getTem(name);
        var threeMesh = buildComponentMesh( self.viewer, e );
        self.pos1 = new Object();
        self.pos1.x = (threeMesh.boundingBox.max.x+threeMesh.boundingBox.min.x)/2;
        self.pos1.y = (threeMesh.boundingBox.max.y+threeMesh.boundingBox.min.y)/2;
        self.pos1.z = (threeMesh.boundingBox.max.z+threeMesh.boundingBox.min.z)/2;
        self.moveLabel();
        $(self.label).fadeIn(500);
        $("#cgq_info_contri2").css('display','none');
    }
};

_Infor.prototype.moveLabel=function() {
    var self = this;
    if (!self.pos1) return;
    var p = self.viewer.worldToClient(new THREE.Vector3(self.pos1.x, self.pos1.y, self.pos1.z));
    var left = ((p.x - parseInt(this.label.clientWidth / 2)) < 0 ? 0 : p.x - parseInt(this.label.clientWidth / 2) - 3) + "px";
    var top = ((p.y - parseInt(this.label.clientHeight)) < 0 ? 0 : p.y - parseInt(this.label.clientHeight) - 12) + 'px';
    $('#cgq_info_contri').css({left: left, top: top});
    $("#arrow").css({"left": (self.label.clientWidth / 2 - 8) + 'px', "top": (self.label.clientHeight - 12) + 'px'});

    var p2 = self.viewer.worldToClient(new THREE.Vector3(self.pos1.x,self.pos1.y, self.pos1.z));
    var left2 = ((p2.x- parseInt($('#cgq_info_contri2')[0].clientWidth/2))< 0 ? 0 : p2.x- parseInt($('#cgq_info_contri2')[0].clientWidth/2)-3) +"px";
    var top2 = ((p2.y- parseInt($('#cgq_info_contri2')[0].clientHeight))<0 ? 0 : p2.y- parseInt($('#cgq_info_contri2')[0].clientHeight)-12) +'px';
    $('#cgq_info_contri2').css({left:left2,top:top2});
    $("#arrow2").css({"left":($('#cgq_info_contri2')[0].clientWidth/2-8)+'px',"top":($('#cgq_info_contri2')[0].clientHeight-12)+'px'});
};


_Infor.prototype.getTime = function(){
    var date = new Date();
    var timeObj  = {};
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1< 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    this.date = date.getDate()< 10 ? "0" + date.getDate() : date.getDate();
    this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var preTime = this.year.toString() + this.month.toString() + this.date.toString() + "000001";
    var currentTime = this.year.toString() + this.month.toString() + this.date + this.hour.toString() + this.minute.toString() + this.second.toString();
    var curDate = this.year + '-' + this.month + '-' + this.date;

    timeObj.preTime = preTime;
    timeObj.currentTime = currentTime;
    timeObj.curDate = curDate;

    return timeObj;
};

_Infor.prototype.getTem = function(name){
    var self=this;
    var tem,hum,tim;
    $.ajax({
        url: window.Path+"bim/bimJzxx/getCgqxx",
        type: 'GET',
        dataType: "jsonp",
        async: true,
        success: function (res) {
            tem = res[0].TEMPERATURE;
            hum = res[0].HUMIDITY;
            tim = res[0].TM;
            $("#arrow").css({"left":(self.label.clientWidth/2-8)+'px',"top":(self.label.clientHeight-12)+'px'});
            $('#temName').text(name);
            $('#temTim').text(tim);
            $('#temTem').text(tem +'°C');
            $('#temHum').text(hum +'%RH');
        },
        error: function (res) {
            console.log(res);
        }
    });
};

_Infor.prototype.getTem2 = function(name,e){
    var self=this;
    var tem,hum,tim;
    $("#cgq_info_contri2").css('display','none');
    $("#cgq_info_contri").css('display','none');
    $.ajax({
        url: window.Path+"bim/bimJzxx/getCgqxx",
        type: 'GET',
        dataType: "jsonp",
        async: true,
        success: function (res) {
            tem = res[0].TEMPERATURE;
            hum = res[0].HUMIDITY;
            tim = res[0].TM;
            $('#temName2').text(name);
            $('#temTim2').text(tim||'缺失');
            $('#temTem2').text(tem ||'缺失' +'°C');
            $('#temHum2').text(hum ||'缺失' +'%RH');
        },
        error: function (res) {
            console.log(res);
        }
    });

    $("#arrow2").css({"left":(self.label.clientWidth/2-8)+'px',"top":(self.label.clientHeight-12)+'px'});
    var threeMesh = buildComponentMesh( self.viewer, e );
    self.pos1 = new Object();
    self.pos1.x = (threeMesh.boundingBox.max.x+threeMesh.boundingBox.min.x)/2;
    self.pos1.y = (threeMesh.boundingBox.max.y+threeMesh.boundingBox.min.y)/2;
    self.pos1.z = (threeMesh.boundingBox.max.z+threeMesh.boundingBox.min.z)/2;
    self.moveLabel();

    //查看更多按钮注册点击事件
    $('#moreTem').click(function(){
        $("#cgq_info_contri2").fadeOut(500);
        var timeObj = self.getTime();
        self.showMore(timeObj.preTime,timeObj.currentTime,timeObj.curDate);
    });
    $("#cgq_info_contri2").find('.iSpan').click(function(){
        $("#cgq_info_contri2").fadeOut(500);
    });

    document.addEventListener('mousewheel', function(){
        self.moveLabel();
    }, true);
    document.addEventListener('mousemove',function(){
        self.moveLabel();
    }, false);

    $("#cgq_info_contri2").fadeIn(500);
    self.moveLabel();
};

//lx 传感器列表功能
_Infor.prototype.sensorInfo = function(){
    var self = this;
    var thatModel;
    var instanceTree;
    //右侧传感器按钮点击事件
    $('#show-sensor').unbind().click(function () {
        var sensorArr = [];
        var sensorDbid = [];
        $('#_group').html() && self._viewer.unloadExtension("markup3d");
        self._viewer.loadExtension("markup3d");
        JHCYW.models_obj.map(function(obj){
            if(Object.keys(obj)[0]==$('#ldInput').val()){
                self._viewer.model = Object.values(obj)[0];
            }
        });
        //显示楼栋传感器列表
        if ($("#ldInput").attr("model_id") == "" || $("#ldInput").attr("model_id") == undefined && window.hideList.length == 0) {
            alert("请选择楼栋");
        }else if (Number($("#ldInput").attr("model_id")) && !($('#lcInput').attr('lc_dbid'))){
            thatModel =Object.values(JHCYW.models_obj[$("#ldInput").attr("model_id")-1])[0];
            instanceTree = thatModel.getData().instanceTree;
            thatModel.search('"传感器"',function(item) {
                if (item.length == 0) {
                    sensorArr = item;
                    sensorDbid = item;
                    showSensorList(sensorArr,sensorDbid,true);
                } else {
                    item.map(function (val, index) {
                        var sensorName = instanceTree.getNodeName(val);
                        if (sensorName.indexOf('传感器') >= 0 && sensorName.indexOf('[') >= 0) {
                            var arr = sensorName.split(" ");
                            sensorArr.push(arr[0]);
                            sensorDbid.push(val);
                            if(index==item.length-1){
                                showSensorList(sensorArr,sensorDbid,true);
                            }
                        }
                    })
                }
            },"类型");
            // 判断楼层按钮的传感器事件
        } else if (Number($('#lcInput').attr('lc_dbid')) && $('#lcInput').val() != '') {//楼层传感器数据
            thatModel=Object.values(JHCYW.models_obj[$("#ldInput").attr("model_id")-1])[0];
            instanceTree = thatModel.getData().instanceTree;
            // 通过已点击楼层的dbid搜索子构件
            instanceTree.enumNodeChildren(Number($('#lcInput').attr('lc_dbid')), function (e) {
                var nodeFinalName = instanceTree.getNodeName(e);
                    if (nodeFinalName.indexOf('传感器')>=0 && nodeFinalName.indexOf('[')>=0){
                        var arr = nodeFinalName.split(" ");
                        sensorArr.push(arr[0]);
                        sensorDbid.push(e);
                }
            }, function (){});
            showSensorList(sensorArr,sensorDbid,false);

        }else if($('#ldInput').attr('model_id')=='地下室' && ! ($('#lcInput').attr('lc_dbid'))){ //地下室传感器
            var i=JHCYW.models_obj.length-3;
            getSensor(i);
            function getSensor(i){
                var model = Object.values(JHCYW.models_obj[i])[0];
                instanceTree = model.getData().instanceTree;
                model.search('"传感器"',function(res){
                    if(res.length>0){
                        res.map(function(item,index){
                            var sensorName = instanceTree.getNodeName(item);
                            if (sensorName.indexOf('传感器') >= 0 && sensorName.indexOf('[') >= 0) {
                                var arr = sensorName.split(" ");
                                sensorArr.push(arr[0]);
                                sensorDbid.push(item);
                                if(index==res.length-1){
                                    i++;
                                    if(i==JHCYW.models_obj.length){
                                        showSensorList(sensorArr,sensorDbid,true);
                                    }else{
                                        getSensor(i);
                                    }
                                }
                            }
                        })
                    }else{
                        i++;
                        if(i==JHCYW.models_obj.length){
                            showSensorList(sensorArr,sensorDbid,true);
                        }else{
                            getSensor(i);
                        }
                    }
                },'类别');
            }
        }else if($('#ldInput').attr('model_id')=='地下室' && $('#lcInput').attr('lc_dbid')){
            JHCYW.models_obj.map(function(item){
                if(Object.keys(item)[0] == $('#lcInput').attr('lc_dbid')){
                    var model = Object.values(item)[0];
                    instanceTree = model.getData().instanceTree;
                    model.search('"传感器"',function(res){
                        if(res.length>0){
                            res.map(function(item,index){
                                var sensorName = instanceTree.getNodeName(item);
                                if (sensorName.indexOf('传感器') >= 0 && sensorName.indexOf('[') >= 0) {
                                    var arr = sensorName.split(" ");
                                    sensorArr.push(arr[0]);
                                    sensorDbid.push(item);
                                    if(index==res.length-1){
                                        showSensorList(sensorArr,sensorDbid,false);
                                    }
                                }
                            })
                        }else{
                            showSensorList(sensorArr,sensorDbid,false);
                        }
                    },'类别');
                }
            })
        }
    });

    //遍历传感器名sensorArr及传感器dbid数组sensorDbid -------方法
    function showSensorList(sensorArr,sensorDbid,bol){
        var dummyData = [];
        $('#sensor_label').html('');
        if (sensorArr.length == 0 ) {
            // 无传感器
            document.getElementById('sensor_label').style.display = 'block';
            if(bol){
                $('#sensor_label').append('<label class="xtTitle" id="xtTitle">'+ $("#ldInput").val() +'传感器列表</label>');
            }else{
                $('#sensor_label').append('<label class="xtTitle" id="xtTitle">'+ $("#ldInput").val() + $('#lcInput').val() +'传感器列表</label>');
            }
            $('#sensor_label').append('<div id="sensor-wrapper"></div>');
            $('#sensor-wrapper').append('<span _id="_sensor">无传感器数据</span>');
            $('#sensor_label').append('<span class="iSpan" id="_sensorCancel"><i class="fa fa-remove fa-lg"></i></span>');
        }else{
            if(bol){
                $('#sensor_label').append('<label class="xtTitle" id="xtTitle">'+ $("#ldInput").val() +'传感器列表</label>');
            }else{
                $('#sensor_label').append('<label class="xtTitle" id="xtTitle">'+ $("#ldInput").val() + $('#lcInput').val() +'传感器列表</label>');
            }
            $('#sensor_label').append('<div id="sensor-wrapper"></div>');
            for (var i = 0;i< sensorDbid.length;i++){
                var threeMesh = buildComponentMesh( self._viewer, sensorDbid[i] );
                var sensorPos = new Object();
                sensorPos.x = (threeMesh.boundingBox.max.x+threeMesh.boundingBox.min.x)/2;
                sensorPos.y = (threeMesh.boundingBox.max.y+threeMesh.boundingBox.min.y)/2;
                sensorPos.z = (threeMesh.boundingBox.max.z+threeMesh.boundingBox.min.z)/2;
                dummyData.push({
                    icon:  Math.round(Math.random()*3),
                    x:  sensorPos.x,
                    y:  sensorPos.y,
                    z:  sensorPos.z,
                    dbid:sensorDbid[i],
                    name:sensorArr[i]
                });
                $('#sensor-wrapper').append('<div class="sensorDiv"><span class="sensor" _name="' + sensorArr[i] + '" _id="_sensor" _dbid="'+ sensorDbid[i]+'">' + sensorArr[i] + '</span><i class="layui-icon layui-icon-play iForMore" title="查看传感器更多数据"></i></div>');
            }
            window.dispatchEvent(
                new CustomEvent('newData', {'detail': dummyData})
            );
            $('#sensor_label').append('<span class="iSpan" id="_sensorCancel"><i class="fa fa-remove fa-lg"></i></span>');
            document.getElementById('sensor_label').style.display = 'block';
            $('.sensor').unbind().click(function () {
                self._viewer.select([Number($(this).attr('_dbid'))]);
                //传入传感器dbid
                var threeMesh = buildComponentMesh( self._viewer, Number($(this).attr('_dbid')) );
                var sensorPos = new Object();
                sensorPos.x = (threeMesh.boundingBox.max.x+threeMesh.boundingBox.min.x)/2;
                sensorPos.y = (threeMesh.boundingBox.max.y+threeMesh.boundingBox.min.y)/2;
                sensorPos.z = (threeMesh.boundingBox.max.z+threeMesh.boundingBox.min.z)/2;
                //重新设置相机的位置
                //注意camera up vector 的方向，还有跟right vector的关系，以及pivot的位置
                self._viewer.navigation.setRequestTransitionWithUp(true,new THREE.Vector3(sensorPos.x+4,sensorPos.y+4, sensorPos.z),new THREE.Vector3(sensorPos.x,sensorPos.y, sensorPos.z),45,new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0));
                self._viewer.navigation.setPivotPoint(true); //更新到pivot
                self._viewer.loadExtension('Autodesk.FirstPerson', self._viewer.config)
                    .then(function () {
                        self._viewer.setActiveNavigationTool('firstperson'); //viewer3d需要开启第一视角工具
                    });
                //重新设置相机的位置
            });
        }
        //实现弹窗可拖拽
        $( function() {
            $('#sensor_label').find('#xtTitle').mousedown(function(){
                $('#sensor_label').draggable();
            });
            $('#sensor_label').find('#xtTitle').mouseup(function(){
                $('#sensor_label').draggable( "destroy" );
            });
            $('.iForMore').unbind().click(function(){
                var timeObj = self.getTime();
                self.showMore(timeObj.preTime,timeObj.currentTime,timeObj.curDate);
            });

            $('.sensor').click(function(){
                self.getTem2($(this).attr('_name'),Number($(this).attr('_dbid')));
                self.moveLabel();
            });

            $('.sensor').mouseover(function(){
                Snap('#'+$(this).attr('sId')).select('circle').animate({
                    r: 9,
                    fill: "#aee0af",
                    fillOpacity: 0.6,
                    stroke: "#2dae66",
                    strokeWidth: 1
                }, 600);
            });

            $('.sensor').mouseout(function(){
                Snap('#'+$(this).attr('sId')).select('circle').animate({
                    r: 7,
                    fill: "#e4e4e4",
                    fillOpacity: 0.6,
                    stroke: "#7b7b7b",
                    strokeWidth: 1
                }, 600);
            });
            //关闭按钮事件，记得清空数据
            $('#_sensorCancel').unbind().click(function () {
                sensorArr = [];
                $('#sensor_label').html('');
                self._viewer.setActiveNavigationTool();
                document.getElementById('sensor_label').style.display = 'none';
                self._viewer.impl.fitToView(thatModel);
                self._viewer.unloadExtension("markup3d");
            });
        });
    }
};

_Infor.prototype.createBox = function(){
    var label= document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(label);
    var style = document.createAttribute("style");
    label.setAttributeNode(style);
    label.setAttribute('class','cgq_info_more ui-widget-content');
    label.setAttribute("id", "cgq_info_more");

    var label2= document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(label2);
    var style2 = document.createAttribute("style");
    label2.setAttributeNode(style2);
    label2.setAttribute('class','cgq_info_contri');
    label2.setAttribute("id", "cgq_info_contri2");
    label2.innerHTML+='<div class="cgq_box2" id="cgq_box2" style="height: 100%"><div class="temBox"><label>当前设备：</label><span id="temName2"></span></div>'+
        '<div class="temBox"><label>信息时间：</label><span id="temTim2">  </span></div>'+
        '<div class="temBox"><label>当前温度：</label><span id="temTem2"> °C</span></div>'+
        '<div class="temBox"><label>当前湿度：</label><span id="temHum2">'+' %RH</span></div>'+
    '<div class="temBox" id="temBtn"><button id="moreTem" class="moreTem">查看更多</button></div>';//<button id="moreTem" class="moreTem">查看更多</button>
    label2.innerHTML+='<div class="arrow" id="arrow2" style="position: absolute"><i class="fa fa-sort-desc fa-lg"></i></div>';
    label2.innerHTML+='<span class="iSpan"><i class="fa fa-remove fa-lg"></i></span>';
};

_Infor.prototype.showMore = function(preTime,currentTime,curDate){
    var self = this;
    $('#cgq_info_more').html('');
    $('#cgq_info_more').append('<div id="cgq_titleBox" class="titleBox"><span>S000001  温度湿度统计图</span><input type="text" class="layui-input" placeholder="选择日期" id="layDate"></div><i  class="fa fa-remove fa-lg"></i>');
    $('#cgq_info_more').append('<div id="cgq_more_info" style="height: 92%"></div>');
    $('#cgq_info_more').css('display','block');
    $('#cgq_more_info').ready(function(){
        addLine();
    });
    layui.use('laydate', function(){
        var laydate = layui.laydate;

        laydate.render({
            elem: '#layDate' ,
            position:'absolute',
            format: 'yyyyMMdd',
            min:'2017-1-1',
            max:'2018-8-31',
            done: function(value){
                if(value==""){
                    $('#cgq_more_info').html('');
                    addLine();
                }else{
                    var pre = value +'000001';
                    var end = value +'235959';
                    $('#cgq_more_info').html('');
                    addLine(pre,end);
                }
            }


        });
    });
    //启用draggable
    $('#cgq_titleBox').mousedown(function(){
        $( "#cgq_info_more").draggable();
    });

    //销毁draggable
    $('#cgq_titleBox').mouseup(function(){
        $( "#cgq_info_more").draggable( "destroy" );
    });

    $('#cgq_info_more i').unbind().click(function(){
        clearTimeout(JHCYW['timer']);
        $('#cgq_info_more').css('display','none');
    });

    $( "#cgq_info_more").resizable();

    document.removeEventListener('mousemove',function(){
        self.moveLabel();
    });
    document.removeEventListener('mousewheel',function(){
        self.moveLabel();
    });
};

_Infor.prototype.unload = function() {
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('cgq_infor', _Infor);