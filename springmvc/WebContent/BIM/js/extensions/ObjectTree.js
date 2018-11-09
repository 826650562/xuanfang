/**
 * Created by 熊梦瑶 on 2018/6/29.
 * 这里是楼栋和楼层、房间功能代码
 */

function _ObjectTree(viewer, options) {
    //创建弹出层
    this.lineColor = "red";
    this.label= document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(this.label);

    var style = document.createAttribute("style");
    this.label.setAttributeNode(style);
    this.label.setAttribute("id", "fjInfo_label");
    this.label.style.display = "none";
    this.label.style.position = "fixed";
    //固定位置
    this.label.style.left = '12%';
    this.label.style.top = '45%'; // 写完功能后，单独改一下。
    this.label.style.zIndex = 2;
    this.label.style.backgroundColor = "rgba(38, 62, 62, 0.7)";
    this.label.style.borderRadius = "6px";
    this.label.style.padding = "10px";
    this.label.style.color = "#fff";
    // this.label.style.overflow = " hidden";
    this.label.style.maxHeight = "494px";
    //固定格式 需要写这句
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this._viewer = viewer;
    this.hideBox = [];
    this.dixiaArray = [];
    //存数据 删除用
    this.lineGroups = [];
    //线的配置
    this.linesMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color('#6eb92c'),
        transparent: true,
        depthWrite: false,
        depthTest: true,
        linewidth: 10,
        opacity: 1
    });

    //调用创建一个cube方法
    this.createCube();
    $(".viewcubeUI").css({'display': 'none'});//隐藏viewCube
    this.re = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{2,3}$/);//(?![0-9]+$)(?![a-zA-Z]+$)正则判断显示楼层
    this.re2 = new RegExp(/^[a-zA-Z]{2,3}$/);
}

_ObjectTree.prototype.load = function () {
    //入口
    this.initLdList();
    return this;
}

_ObjectTree.prototype.unload = function () {
    //卸载调用
    return true;
}

/*
 * 初始化楼栋列表
 * 王新亮
 * */
_ObjectTree.prototype.initLdList = function () {
    var self = this;
    if (JHCYW.models_obj.length <= 0) {
        alert("缺少模型或者模型加载错误！请联系管理员");
    } else {
        var html = "";
        //  JHCYW.models_obj ==[{"15号楼":model},{"17号楼":model}]
        JHCYW.models_obj.map(function (item, index) {
            var model = Object.values(item)[0];
            var modelName = Object.keys(item)[0];
            // if (model.id >= JHCYW.models_obj.length-2) { //地下室
            //     self.dixiaArray.push({"name": modelName, "id": model.id});
            // } else
                html += "<span class='ldnum' model_id='" + model.id + "'>" + modelName + "</span>";
        });
        html += "<span class='ldnum' model_id='地下室'>地下室</span>";
        html += "<span class='ldnum' model_id='all'>ALL</span>";

        $(".loudongbox .tclcinnercont").html(" ").append(html);
        self.loudongEvent();
    }
    //创建线画布
    self.viewer.impl.createOverlayScene(
        'boundingBox',
        this.linesMaterial)
}

/*
* 楼栋点击事件
* */
_ObjectTree.prototype.loudongEvent = function () {
    var self = this;
    //楼栋列表按钮事件
    $(".ldnum").unbind().click(function () {
        window.searchHide && window.searchHide.map(function (item) {
            self._viewer.model.visibilityManager.show(item);
            self._viewer.model.visibilityManager.setNodeOff(item, false);
        });
        //self.toLocalAndFit();
        var model_id = $(this).attr("model_id");
        var model_val = $(this).text();
        $(".ldnum").removeClass('LcChoosed _ld');
        $(this).addClass('LcChoosed _ld');
        //清除边框线
        self._viewer.impl.clearOverlay("boundingBox");
        //显示全部隐藏的构件
        self.showALlHideBox();
        if (model_id == 'all') {
            //显示全部楼栋
            JHCYW.models_obj.map(function (item) {
                var id = Object.values(item)[0].id;
                self._viewer.showModel(id)
            });
            $("#ldInput").attr("model_id", '').val('ALL');
        } else {
            $("#ldInput").val(model_val);
            var oldModel_id = $("#ldInput").attr("model_id");
            $("#ldInput").attr("model_id", "");
            var m= self.getCurrentModel(model_id);
            //这里如果是点击的地下室 那么无法获取当前的model_id
            try{
                var box = m.getBoundingBox();
                var pos1=new Object();
                pos1.x = (box.max.x+box.min.x)/2;
                pos1.y = (box.max.y+box.min.y)/2;
                pos1.z = (box.max.z+box.min.z)/2;
                self.drawBox(box.min, box.max);

            }catch (e){

            }
            JHCYW.models_obj.map(function (item, index) {
                var id = Object.values(item)[0].id;
                if (model_id == id || oldModel_id == id || id >= JHCYW.models_obj.length-2) {
                    self._viewer.showModel(id);
                } else {
                    self._viewer.hideModel(id);
                }
            });
        }
        self.toLocalAndFit();
    });

    /*
    *添加前往楼栋按钮事件
    * */
    $(".lcgobtn").click(function () {
        var model_id = $("._ld").attr("model_id");
        $('#sensor-wrapper').html('');
        self._viewer.unloadExtension("markup3d");
        if(model_id=="all") return false;
        $("#lcInput").attr("lc_id",'');
        $('#lcInput').attr('lc_dbid','');
        $("#lcInput").val('');
        //获取楼层列表
        $("#ldInput").attr("model_id", model_id);
        $(".louhao").text($("#ldInput").val());
        //隐藏其他楼栋
        JHCYW.models_obj.map(function (item, index) {
            var id = Object.values(item)[0].id;
            if (id != parseInt(model_id) && id < JHCYW.models_obj.length-2) {
                self._viewer.hideModel(id);
            } else {
                self._viewer.showModel(id)
            }
        });
        self.getLcByDdid(model_id);
        self._viewer.impl.clearOverlay("boundingBox");
    })

};

/*
* 获取当前选中的楼栋号
* */
_ObjectTree.prototype.getCurrentModel = function (model_id) {
    var self = this;
    JHCYW.models_obj.map(function (value) {
        var model = Object.values(value)[0];
        if (model.id == model_id) {
            self._viewer.model = model;
        }
    });
    return self._viewer.model;
}

/*
* 楼层点击事件
* */
_ObjectTree.prototype.louCengEvent = function (loucengArray) {
    var self = this;
    $(".tclccs").unbind().click(function () {
        window.searchHide && window.searchHide.map(function (item) {
            self._viewer.model.visibilityManager.show(item);
            self._viewer.model.visibilityManager.setNodeOff(item, false);
        });
        $(".tclccs").removeClass('LcChoosed');
        $(this).addClass('LcChoosed');
        //清除选中项、显示隐藏的
        self._viewer.clearSelection(true);
        self.showALlHideBox();
        var lc = $(this).attr("lc_id");
        var lc_name=$(this).text();
        $("#lcInput").val(lc_name).attr('lc_id',lc);
        if (lc== 'all') {
            if (!loucengArray) {
                for (var k = 0; k < self.dixiaArray.length; k++) {
                    self._viewer.showModel(self.dixiaArray[k].id);
                }
            }
            self.toLocalAndFit();
        } else {
            if (!loucengArray) {
                for (var k = 0; k < self.dixiaArray.length; k++) {
                    self._viewer.showModel(self.dixiaArray[k].id);
                    if (lc == self.dixiaArray[k].id) {
                        self.getCurrentModel(self.dixiaArray[k].id);
                        self._viewer.impl.fitToView(1);
                        self._viewer.select(1);
                    }
                }
            } else {
                var lcDBids;
                loucengArray.map(function (item) {
                    item[lc] && (lcDBids = item[lc]);

                });
                $('#lcInput').attr('lc_dbid',lcDBids[0]);
                self._viewer.impl.fitToView(lcDBids, self._viewer.model);
                self._viewer.select(lcDBids);
            }
        }
    });

    $("#goLc").unbind().click(function () {

        var lc =$("#lcInput").attr("lc_id");
        self.getFjByDbid(lc, loucengArray);
        $('#sensor-wrapper').html('');
        self._viewer.unloadExtension("markup3d");
    })
};

//房间点击事件
_ObjectTree.prototype.fangjianEvent = function (fangjianArray,type) {
    var self = this;
    // console.log(fangjianArray);
    self.label.innerHTML = null;
    self.label.style.display = "none";
    //修改
    $(".tcfjnum").unbind().click(function (e) {
        var oEvent = e || event;
        oEvent.cancelBubble = true;
        $(".tcfjnum").removeClass('LcChoosed');
        $(".tcfjnum").find("img").attr("src","static/images/sxt-3.png");
        $(this).addClass('LcChoosed');
        $(this).find("img").attr("src", "static/images/sxt-2.png");
        var fj = $(this).attr("_id");
        var fjDBids;
        if(type=='_dixia'){
            fangjianArray.map(function (item) {
                item[fj] && self._viewer.select(Number(Object.keys(item)[0]));
            });

        }else{
            fangjianArray.map(function (item) {
                item[fj] && (fjDBids = item[fj]);
            });
            self._viewer.select(fjDBids);
        }
    });
}


//根据楼栋数据中房间属性中的楼层的dbid 获取房间数据
_ObjectTree.prototype.getFjByDbid = function (lcVal, loucengArray) {
    var self = this;
    var tempFJ = [];
    var roomName = [];
    var roomType = [];
    var roomAll = [];
    var huName;

    self._viewer.clearSelection(true);
    var instanceTree = self._viewer.model.getData().instanceTree;
    if(lcVal=='all') return false;
    //隐藏其他楼栋
    if ($("#ldInput").attr("model_id") == "地下室"  ) {
        var html = "";
        for (var a = 0; a < self.dixiaArray.length; a++) {
            if ($("#lcInput").val() != self.dixiaArray[a].name) {
                self._viewer.hideModel(self.dixiaArray[a].id);
            } else {
                $("#lcInput").attr('_id', self.dixiaArray[a].id);
            }
        }
        //开始查找所有的房间 填充房间列表
        self._viewer.model.search('"房间"', function (item) {
            var fangjianL = item.length - 1;
            var temp_fj_dx=[];
            var roomdixia = [];
            // debug lx 解决点击地下室，房间列表无显示问题
            var dixiafj = [];
            item.map(function (val, index) {
                var name = instanceTree.getNodeName(val);
                var names = name.split("#");
                /*var names = name.split(" ");
                if (names.length == 3) {
                    html += '<span class="tcfjnum" _id=' + val + '><p title="'+ names[0] +'">' + names[0] + '</p><i class="fjsxt"><img src="static/images/sxt-3.png"></i></span>';
                    var a={};
                    a[val]=names[0];
                    temp_fj_dx.push(a);
                    // debug lx 解决点击地下室，房间列表无显示问题
                    dixiafj.push(a[val]);
                }*/
                if (names.length == 4) {
                    html += '<span class="tcfjnum" _id=' + val + '><p title="'+ names[2]+name[3] +'">' + names[2]+name[3] + '</p><i class="fjsxt"><img src="static/images/sxt-3.png"></i></span>';
                    var a={};
                    a[val]=names[2]+name[3];
                    temp_fj_dx.push(a);
                    // debug lx 解决点击地下室，房间列表无显示问题
                    dixiafj.push(a[val]);
                }
                if (index == fangjianL) {
                    //search方法的用法
                    $("#tcfjinnercont").html(" ").append(html);
                    self.fangjianEvent(temp_fj_dx,'_dixia');
                    roomdixia.push({"name":dixiafj});
                }
            });
            // debug lx 解决点击地下室，房间列表无显示问题
            self.popups(roomdixia);
        }, '类别');
    } else {
        //当前模型id！！！！！！！！！！！！！！！！！！！不要删！！！！！！！！！！！！
        var curModel = self._viewer.model; //debug
        JHCYW.models_obj.map(function (item, index) {
            var id = Object.values(item)[0].id;
            if (id != self._viewer.model.id) {
                self._viewer.hideModel(id);
            } else {
                self._viewer.showModel(id)
            }
            self._viewer.model = curModel; //debug
        });

        //隐藏本栋其他楼层
        self._viewer.model.search('"S_"', function (item) {
            item.map(function (val) {
                self.hideBox.push(val);
                self._viewer.model.visibilityManager.hide(val);
                self._viewer.model.visibilityManager.setNodeOff(val, true);
            });
        },'名称');
        var htmlAll = "",html1="",html2="";
        self._viewer.model.search('"房间"', function (item){
            item.map(function (val,index) {
                var nodeFinalName = instanceTree.getNodeName(val);
                var arr = nodeFinalName.split('#');
                //lx debug 误删 b4 lcval多了一个空格
                 /*if ((arr[2] && (Number(arr[2]) + "F" == lcVal || "F" + Number(arr[2]) == lcVal || arr[2].toString() == lcVal))|| (arr[1] && arr[1].toString()==lcVal) )*/
                if ((arr[2] && (Number(arr[2]) + "F" == lcVal || "F" + Number(arr[2]) == lcVal || arr[2].toString() == lcVal))|| (arr[1] && arr[1].indexOf(lcVal)>=0) ) {
                    if(arr.length == 6 || arr.length == 5 ||  arr.length == 4){
                        var roomType01;
                        if (arr.length == 6) {
                            //当属性个数为6的时候 按标准 是房间户型
                            huName=arr[2]+ arr[3];
                            roomType01 = arr[5].split(" ")[0];
                       }else if(arr.length == 5){
                            //当属性个数为5的时候 是地上的公共区域
                            huName=arr[2]+ arr[3]+ arr[4].split(" ")[0];
                            roomType01= '无';
                        }
                        else if(arr.length == 4){
                            //当属性个数为4的时候 是楼栋的地下部分
                            huName=arr[2]+ arr[3].split(" ")[0];
                            roomType01= '无';
                        }

                        var _index = roomName.indexOf(huName);
                        if (_index >= 0) {
                            tempFJ[_index][huName].push(val);
                        }else
                        {
                            roomName.push(huName);
                            var a = {};
                            a[huName] = [val];
                            tempFJ.push(a); //[{'1':[1,2,3]},{'2':[1,2,3]}]
                            roomType.push(roomType01);
                            html2 += '<span class="tcfjnum" _id=' + huName + '><p class="fjnum"  title="'+ huName +'">'+ huName + '</p><i class="fjsxt"><img src="static/images/sxt-3.png"></i></span>';
                        }
                        // lx 新增户名和户型信息
                    }
                }else{
                    self.hideBox.push(val);
                    self._viewer.model.visibilityManager.hide(val);
                    self._viewer.model.visibilityManager.setNodeOff(val, true);
                }
                if(index==item.length-1){
                    htmlAll = html1+html2;
                    $("#tcfjinnercont").html(htmlAll);
                    self._viewer.clearSelection(true);
                    //添加房间列表点击事件
                    self.fangjianEvent(tempFJ,'_dishang');
                    //lx 添加房间弹出层
                    roomAll.push({"name":roomName,"type":roomType});
                    self.popups(roomAll);
                }
            });
        },'类别');

        loucengArray.map(function (item) {
            if (!item[lcVal]) {
                Object.values(item)[0].map(function (val) {
                    self.hideBox.push(val);
                    self._viewer.model.visibilityManager.hide(val);
                    self._viewer.model.visibilityManager.setNodeOff(val, true);
                });
            } else {
                self._viewer.select(Object.values(item)[0][0]);
                self._viewer.model.visibilityManager.show(Object.values(item)[0][0]);
                self._viewer.model.visibilityManager.setNodeOff(Object.values(item)[0][0], false);
                //隐藏楼顶、栏杆
                instanceTree.enumNodeChildren(item[lcVal][0], function (x) {
                    var name = instanceTree.getNodeName(x);
                    if(name && name.indexOf('天花')>=0){
                        self.hideBox.push(x);
                        self._viewer.model.visibilityManager.hide(x);//impl有模型会显示隔离之后的灰色
                        self._viewer.model.visibilityManager.setNodeOff(x, true);
                    }
                })
            }
        });
        $(".viewcubeUI").css({'display': 'block'});
        self._viewer.setViewCube('front-top');
        $(".viewcubeUI").css({'display': 'none'});

    }
    $(".viewcubeUI").css({'display': 'block'});
    self._viewer.setViewCube('front-top');
    $(".viewcubeUI").css({'display': 'none'});

};

//弹出户信息框
_ObjectTree.prototype.popups = function(all){
    var self = this;
    var currentM = self._viewer.model;

    $('.fjsxt').unbind().click(function () {
        self.label.innerHTML = null;
        self.label.style.display = "block";
        $( function() {
            $( "#fjInfo_label" ).draggable();
        } );

        var val = $(this).parent('.tcfjnum').find('p').text();
        if ($("#ldInput").attr("model_id")=="地下室"){
            $('#fjInfo_label').append('<ul class="fj_info"><li class="_info">户名：<span class="info1">' + val + '</span></li><li class="_info">所属户型：<span><a href="#" id="type">无</a></span></li><li class="_info">户总面积：<span class="info1">1000平米</span></li><li class="_info">是否已出租：<span class="info1">是</span></li><li class="_info">承租人：<span class="info1">张三</span></li><li class="_info"><div  id="isopenLouding" class="layui-form">是否隐藏顶层：<input type="checkbox" lay-filter="test1"  lay-skin="switch"> </div></li></ul> ');
            $('#fjInfo_label').append('<span class="iSpan" id="fjcancel"><i class="fa fa-remove fa-lg"></i></span>');
        } else {
            for (var i=0;i<all[0].name.length;i++) {
                //debug lx
                if (val == all[0].name[i]) {
                    // if ($("#ldInput").attr("model_id")=="地下室") {
                    //     $('#fjInfo_label').append('<ul class="fj_info"><li class="_info">户名：<span class="info1">' + val + '</span></li><li class="_info">所属户型：<span><a href="#" id="type">无</a></span></li><li class="_info">户总面积：<span class="info1">1000平米</span></li><li class="_info">是否已出租：<span class="info1">是</span></li><li class="_info">承租人：<span class="info1">张三</span></li><li class="_info"><div  id="isopenLouding" class="layui-form">是否隐藏顶层：<input type="checkbox" lay-filter="test1"  lay-skin="switch"> </div></li></ul> ');
                    //     $('#fjInfo_label').append('<span class="iSpan" id="fjcancel"><i class="fa fa-remove fa-lg"></i></span>');
                    // }else {
                    //     $('#fjInfo_label').append('<ul class="fj_info"><li class="_info">户名：<span class="info1">' + all[0].name[i] + '</span></li><li class="_info">所属户型：<span><a href="#" id="type">' + all[0].type[i] + '</a></span></li><li class="_info">户总面积：<span class="info1">1000平米</span></li><li class="_info">是否已出租：<span class="info1">是</span></li><li class="_info">承租人：<span class="info1">张三</span></li><li class="_info"><div  id="isopenLouding" class="layui-form">是否隐藏顶层：<input type="checkbox" lay-filter="test1"  lay-skin="switch"> </div></li></ul> ');
                    //     $('#fjInfo_label').append('<span class="iSpan" id="fjcancel"><i class="fa fa-remove fa-lg"></i></span>');
                    // }
                    $('#fjInfo_label').append('<ul class="fj_info"><li class="_info">户名：<span class="info1">' + all[0].name[i] + '</span></li><li class="_info">所属户型：<span><a href="#" id="type">' + all[0].type[i] + '</a></span></li><li class="_info">户总面积：<span class="info1">1000平米</span></li><li class="_info">是否已出租：<span class="info1">是</span></li><li class="_info">承租人：<span class="info1">张三</span></li><li class="_info"><div  id="isopenLouding" class="layui-form">是否隐藏顶层：<input type="checkbox" lay-filter="test1"  lay-skin="switch"> </div></li></ul> ');
                    $('#fjInfo_label').append('<span class="iSpan" id="fjcancel"><i class="fa fa-remove fa-lg"></i></span>');
                }
                //if 在下面
            }
        }

        layui.use(['form','layer'], function(){
            //弹出层
            $("#isopenLouding").hide();
            var form = layui.form;
            form.render();
        })

        $('#type').unbind().click(function () {
            //假如已经加载了户型模型要先删除
            if(self.roomModel){
                self._viewer.model = currentM;
                self._viewer.impl.unloadModel(self.roomModel);
                self.roomModelId = self.roomModel = null;
            }
            var loudingArray=[]; //楼顶数据  wxl

            //获取点击的户型类型  根据类型去加载对应的户型模型
            self._viewer.loadModel("/BIM/svf/roomType/A1-1/3d.svf",
                { globalOffset: self.viewer.model.getData().globalOffset },
                function(model){
                    self.roomModel = model;

                    // 隐藏楼层模型
                    self._viewer.hideModel(self._viewer.model.id);
                    // 将当前模型设置为户型模型
                    self._viewer.model = self.roomModel;
                    self._viewer.impl.fitToView(self.roomModel.id);


                    //隐藏顶层构件
                    self._viewer.model.search('"天花板"',function (item) {
                        var len=item.length-1;
                        item.map(function (a,index) {
                            loudingArray.push(a);
                            if(index==len){
                                addOpenOrClose();
                            }
                        })
                    },'名称');


                    self._viewer.model.search('"顶面系统"',function (item) {
                        var len=item.length-1;
                        item.map(function (a,index) {
                            loudingArray.push(a);
                            if(index==len){
                                addOpenOrClose();
                            }
                        })
                    },'系统类型');

                    function  addOpenOrClose() {
                        $("#isopenLouding").show();
                        layui.use('form', function(){
                            var form = layui.form;
                            form.on('switch(test1)', function(data){
                                if (loudingArray.length) {
                                    if(data.elem.checked) {
                                        loudingArray.map(function (i) {
                                            self._viewer.impl.visibilityManager.hide(i, self._viewer.model);
                                            self._viewer.model.visibilityManager.setNodeOff(i, true);
                                        })
                                    }else{
                                        loudingArray.map(function (i) {
                                            self._viewer.impl.visibilityManager.show(i, self._viewer.model);
                                            self._viewer.model.visibilityManager.setNodeOff(i, false);
                                        })
                                    }
                                }
                            });
                        });
                    }

                },self._onLoadModelError);
        })

        $('#fjcancel').unbind().click(function () {
            self.label.innerHTML = null;
            self.label.style.display = "none";
            self._viewer.model = currentM;
            self.roomModel && self._viewer.hideModel(self.roomModel.id);

            self._viewer.showModel(currentM.id);
            self._viewer.model.visibilityManager.show(Number($('#lcInput').attr('lc_dbid')));
            self._viewer.model.visibilityManager.setNodeOff(Number($('#lcInput').attr('lc_dbid')), false);  //这个是什么呢

            self._viewer.impl.fitToView(Number($('#lcInput').attr('lc_dbid')));
            var instanceTree = self._viewer.model.getData().instanceTree;
            instanceTree.enumNodeChildren(Number($('#lcInput').attr('lc_dbid')), function (x) {
                var name = instanceTree.getNodeName(x);
                if(name && name.indexOf('天花')>=0){
                    self.hideBox.push(x);
                    self._viewer.model.visibilityManager.hide(x);//impl有模型会显示隔离之后的灰色
                    self._viewer.model.visibilityManager.setNodeOff(x, true);
                }
            })

            setTimeout(function(){
                self._viewer.impl.unloadModel(self.roomModel);
                self.roomModel = null;
                $(".viewcubeUI").css({'display': 'block'});
                self._viewer.setViewCube('front-top');
                $(".viewcubeUI").css({'display': 'none'});
            },500);
        });
    })
};

//根据楼栋的dbid获取 该楼栋的楼层列表
_ObjectTree.prototype.getLcByDdid = function (model_id) {
    var self = this;
    var louceng = [];//['1F','2F'] 不重复
    var tempLC = [];
    $("#tclcinnercont").html("");
    var html = "";
    if (model_id == "地下室") {
        for (var j = 0; j < self.dixiaArray.length; j++) {
            html += '<span class="tclccs" lc_id=' + self.dixiaArray[j].id + '>' + self.dixiaArray[j].name + '</span>';
        }
        html += '<span class="tclccs" lc_id="all">' + 'ALL' + '</span>';
        $("#tclcinnercont").html(" ").append(html);
        //添加楼层列表点击事件
        self.louCengEvent();
        louceng.length = 0;
    } else {
        var instanceTree = self._viewer.model.getData().instanceTree;
        //这是搜索地面上楼层的方法
        self._viewer.model.search('"A_"', function (item) {
            var Len = item.length - 1;
            var htmlArray = [];
            item.map(function (res, index) {
                if (instanceTree.getNodeParentId(res) == self._viewer.model.getRootId()) {
                    var nodeFinalName = instanceTree.getNodeName(res);
                    var arr = nodeFinalName.split("_");

                    if (arr.length == 3) {
                        var _index = louceng.indexOf(arr[1]);
                        if (_index >= 0) {
                            tempLC[_index][arr[1]].push(res);
                        } else {
                            louceng.push(arr[1]);
                            var a = {};
                            a[arr[1]] = [res];
                            tempLC.push(a); //[{'1F':[1,2,3]},{'2F':[1,2,3]}]
                            //增加楼层列表
                            htmlArray.push(arr);
                        }
                    }
                }

                if (index == Len) {
                    function _sort(array) {
                        if (array.length <= 1) return array;
                        array.sort(function (item, item2) {

                            var s1 = item[1].split("");
                            var s2 = item2[1].split("");
                            var Ns1 = [], Ns2 = [];
                            s1.map(function (i, index) {
                                if (index > 0) {
                                    Ns1.push(i);
                                }
                            });
                            s2.map(function (i, index) {
                                if (index > 0) {
                                    Ns2.push(i);
                                }
                            });
                            return Number(Ns1.join("")) - Number(Ns2.join(""));
                        });
                        return array;
                    }

                    var as1 = [], as2 = [], as3 = [];
                    htmlArray.forEach(function (item) {
                        if (item[1].indexOf("R") >= 0) {
                            as1.push(item);
                        } else if (item[1].indexOf("B") >= 0) {
                            as2.push(item);
                        } else if (item[1].indexOf("F") >= 0) {
                            as3.push(item);
                        }
                    });
                    as1 = _sort(as1);
                    as2 = _sort(as2);
                    as3 = _sort(as3);
                    var As = as2.concat(as3).concat(as1);
                    As.map(function (arr) {
                        html += '<span _name="' + arr[0] + '_' + arr[1] + '_' + arr[2] + '" class="tclccs" lc_id="' + arr[1] + '">' + arr[1] + '</span>';
                    })
                    html += '<span class="tclccs"  lc_id="all">' + 'ALL' + '</span>';

                    $("#tclcinnercont").html(" ").append(html);
                    //添加楼层列表点击事件
                    self.louCengEvent(tempLC);
                    louceng.length = 0;
                }
            })
        }, "名称");

    }
};


_ObjectTree.prototype.init = function () {
    var self = this;
    //注册楼栋列表事件
    this.loudongEvent();
};

//显示构件
_ObjectTree.prototype.showALlHideBox = function (view, dbid) {
    var self = this;
    this.hideBox.map(function (value) {
        try {
            self._viewer.model.visibilityManager.show(value);
            self._viewer.model.visibilityManager.setNodeOff(value, false);
        }
        catch (e) {
        }
    });
    self.hideBox = [];
};

//显示构件
_ObjectTree.prototype.showDBID = function (view, showBox) {
    var view = view;
    var showBox = showBox;
    for (var z = 0; z < showBox.length; z++) {//显示隐藏的构件
        view.show(parseInt(showBox[z]));
        view.impl.visibilityManager.setNodeOff(parseInt(showBox[z]), false);
    }
    // self.hideBox=[];
};

//显示透视  并清空透视数组
_ObjectTree.prototype.clearHide = function (arr) {
    var self = this;
    if (window.hideList.length != 0) {
        self._viewer.showAll(true);
        window.hideList = [];
    }
    for (var i = 0; i < arr.length; i++) {
        window.hideList.push(Number(arr[i]));
    }
};
//创建cube
/*_ObjectTree.prototype.createCube = function () {
 this._viewer.createViewCube();
 };*/
//创建cube
_ObjectTree.prototype.createCube = function () {
    this._viewer.createViewCube();
    var self = this;
    initViewCube();
    this._viewer.addEventListener(
        Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        initViewCube
    );

    //创建viewerCube
    function initViewCube() {
        setTimeout(function () {
            self._viewer.displayViewCube(true);
            self._viewer.removeEventListener(
                Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                initViewCube
            );
        }, 100);
    }
};


_ObjectTree.prototype.drawBox = function (min, max) {
    var self = this;
    const geometry = new THREE.Geometry();


    geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))
    geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))
    geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))
    geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))
    geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))

    geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))

    geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))

    geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))

    geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))

    const lines = new THREE.Line(geometry,
        self.linesMaterial,
        THREE.LinePieces)

    self.lineGroups.push(lines)

    self.viewer.impl.addOverlay('boundingBox', lines)

    self.viewer.impl.invalidate(
        true, true, true)
};

//回到初始视角并焦点楼层
_ObjectTree.prototype.toLocalAndFit = function () {
    this._viewer.navigation.setRequestTransitionWithUp(true, new THREE.Vector3(-400.0043366824929, -270.0816380112992, 170.3020853438724), this._viewer.impl.scene.position, 45, new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0))
};

//注册到 Autodesk.Viewing.theExtensionManager   参数：1.插件名称  2.上面的对象名
Autodesk.Viewing.theExtensionManager.registerExtension('ObjectTree', _ObjectTree);