/**
 * Created by Administrator on 2018/6/25/025.
 * 弹出框的插件
 * 王新亮
 */

function _infoWindow(viewer, options){
    //固定格式 需要写这句
    Autodesk.Viewing.Extension.call(this, viewer, options);
    //添加需要的变量
    this.lineColor = "red";
    this.label= document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(this.label);

    var style = document.createAttribute("style");
    this.label.setAttributeNode(style);
    this.label.setAttribute("id", "info_label");
    this.label.style.display = "none";
    this.label.style.position = "fixed";
    this.label.style.zIndex = 2;
    this.label.style.backgroundColor = "rgba(38, 62, 62, 0.7)";
    this.label.style.borderRadius = "6px";
    // this.label.style.padding = "10px";
    this.label.style.color = "#fff";
    // this.label.style.overflow = " hidden";
    this.label.style.maxHeight = "520px";

    // this.label= document.getElementById("label");
    this.scene = viewer.impl.scene;
    this.camera = viewer.impl.camera;
    this.labelOffset = new THREE.Vector3(20,20,0);

    this.xDivOffset = -0.1;  // x offset position of the div label wrt 3D line.
    this.yDivOffset = 0.05;  // y offset position of the div label wrt 3D line.
    this.line3d;
    this.viewer=viewer;
}

_infoWindow.prototype.unload = function() {
    return true;
};

_infoWindow.prototype.load = function() {
    //插件入口
    this.init();
    return this;
};


_infoWindow.prototype.init = function() {
    var self=this;
    this.viewer.impl.createOverlayScene (
        'boundingBox_info', this.linesMaterial)

    document.addEventListener('mousewheel', function(){
        self.update_DivLabel();
    }, true);

    document.addEventListener('mousemove',function(){
        self.update_DivLabel();
    }, false);



    window.obj = {};
    Object.defineProperty(window.obj,'bol',{
        get:function(){
            return bol;
        },
        set:function(newValue){
            bol = newValue;
            console.log('set :',newValue);
            if(newValue){
                //监听点击事件
                self.viewer.addEventListener(  //传入this
                    Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
                    onSelectionChanged
                );
            }else{
                //移除监听点击事件
                self.viewer.removeEventListener(  //传入this
                    Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
                    onSelectionChanged
                );
            }
        }
    });

    function removeLabel(){
         self.viewer.clearSelection(true);
         self.viewer.impl.clearOverlay("boundingBox_info");
         //刷新帧
         self.viewer.impl.invalidate(
            true, true, true)
         $("#info_label").hide(300);
    };

    function onSelectionChanged( event ) {
        if(event.selections && event.selections[0]){
            var dbId = event.selections[0].dbIdArray[0];
            self.viewer.model=event.selections[0].model;
            // 清空
            self.label.innerHTML = null;
            if(typeof(dbId)!="number"){
                self.label.style.display = "none";
                return;
            }else{
                self.viewer.getProperties(dbId, showLabel,function(){});
            }
        }
    };

    // 显示label
    function showLabel(dbId){
        //在这边调用 buildComponentMesh 函数取得 THREE.Mesh   需要先加载buildComponentMesh
        try{
            var threeMesh = buildComponentMesh( self.viewer, dbId );
            var pos1=new Object();
            pos1.x = (threeMesh.boundingBox.max.x+threeMesh.boundingBox.min.x)/2;
            pos1.y = (threeMesh.boundingBox.max.y+threeMesh.boundingBox.min.y)/2;
            pos1.z = (threeMesh.boundingBox.max.z+threeMesh.boundingBox.min.z)/2;
            self.label.style.display = "block";
            self.viewer.impl.invalidate(true);
            //self.update_Line(new THREE.Vector3(pos1.x, pos1.y, pos1.z));
            self.viewer.getProperties(dbId,function(e){
                //补充构件的信息
                $('#info_label').append("<div class='info-title'><h2>属性信息</h2></div>")
                self.label.innerHTML +='<div class="typeBoxContain"><span class="iSpan close01""><i class="fa fa-remove"></i></span><div id="typeBox" class="layui-collapse"  lay-accordion=""></div></div>';
                $(".close01").unbind().click(removeLabel);
                var value = dbId.properties;
                var type = [];
                var typeAndValue = [];
                for (var i = 0;i < value.length;i++){
                    //self.label.innerHTML += '<div class="disBox"><div class="disName">'+value01[i].displayName+':</div><div class="disValue">'+value01[i].displayValue+'</div></div>';
                    var arr = value[i].displayCategory.split("");
                    if(arr[0]!="_"){
                        var _index = type.indexOf(value[i].displayCategory);
                        if(_index>=0){
                            typeAndValue[_index][value[i].displayCategory].push({"displayName":value[i].displayName,"displayValue":value[i].displayValue});
                            $("h2[_id='"+value[i].displayCategory+"']").parent(".layui-colla-item").append('<div class="layui-colla-content layui-show clearfix"><div class="disName">'
                                +value[i].displayName+':</div><div class="disValue">'+value[i].displayValue+'</div>');
                        }else{
                            type.push(value[i].displayCategory);
                            var a = {};
                            a[value[i].displayCategory] = [{"displayName":value[i].displayName,"displayValue":value[i].displayValue}];
                            typeAndValue.push(a);
                            $("#typeBox").append('<div class="layui-colla-item"><h2 class="layui-colla-title infotitle" _id="'+value[i].displayCategory+'"><i class="layui-icon layui-colla-icon rotate"></i>'+value[i].displayCategory+'<i class="layui-input-block"><input type="checkbox" name="选中此属性" title="选中此属性" id="chooseAttr" ></i></h2><div class="layui-colla-content layui-show clearfix"><div class="disName">'
                                +value[i].displayName+':</div><div class="disValue">'+value[i].displayValue+'</div></div>');
                        }

                        $("#chooseAttr").click(function(){
//                            var tempA = {};
//                            tempA[valueAll[i].children[0].innerHTML] = [{"valueName":valueAll[i].children[0].innerHTML,"valueContent":valueAll[i].children[1].innerHTML}];
                            var valueAll = $(this).parents(".layui-colla-title").nextAll();
                                var valueAllContent = [];
//                            for(var i=0;i<valueAll.length;i++){
//                                    valueAllContent.push([{"valueName":valueAll[i].children[0].innerHTML,"valueContent":valueAll[i].children[1].innerHTML}]);
//                            }
                            $(valueAll).each(function(index,ele){
                                valueAllContent.push([{"valueName":ele.children[0].innerHTML,"valueContent":ele.children[1].innerHTML}]);
                                return false;
                            })
                            if($('input:radio[name="radioname"]:checked')){

                                console.log(valueAllContent);
                                $("#typeBox").append("<button style='background: black;border: 1px solid white;width: 100%;height: 35px;'>发送属性信息</button>");
                            }
                        })
                    }
                }

                //标识属性默认展开
                $(".layui-colla-item").unbind().click(function(){
                    if($(this).find(".layui-icon").hasClass("rotate")){ //rotate class 向下的箭头
                        $(this).find(".layui-icon").removeClass("rotate");//>
                        $(this).find(".layui-colla-content").removeClass("layui-show");//收起内容
                    }else{
                        //>箭头
                        $(this).find(".layui-icon").addClass("rotate");//向下
                        $(this).find(".layui-colla-content").addClass("layui-show"); //展开
                    }
                })

            },function(){});
            self.update_DivLabel();
        }catch (e){
            return false;
        }
    }
};

_infoWindow.prototype.update_DivLabel = function(){
    this.moveLabel([182,120]);
}

_infoWindow.prototype.moveLabel=function(p) {

    this.label.style.right = p[0] + 'px';
    this.label.style.top =  p[1] + 'px';

}


_infoWindow.prototype.unload = function() {
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('infoWindow', _infoWindow);