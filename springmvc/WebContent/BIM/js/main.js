/**
 * Created by Administrator on 2018/6/19/019.
 * GIS组
 */
$(function () {
    //var viewer = new Autodesk.Viewing.Private.GuiViewer3D(document.getElementById('viewer-local'), JHCYW.viewer_opts);
    if (JHCYW.isloadSvf)   var viewer = new Autodesk.Viewing.Viewer3D(document.getElementById('viewer-local'), JHCYW.viewer_opts);
    var options = {
        env: 'Local',
        offline: 'true',
        useADP: false
    };
    var oldModel;
    window.showEquipment = function(data){
        oldModel = viewer.model;
        JHCYW.models_obj.map(function(item){
            if(Object.keys(item)[0].indexOf(data.ssld)>=0){
                viewer.select([Number(data.dbid)]);
                viewer.model = Object.values(item)[0];
                var threeMesh = buildComponentMesh( viewer, Number(data.dbid) );
                var sensorPos = new Object();
                sensorPos.x = (threeMesh.boundingBox.max.x+threeMesh.boundingBox.min.x)/2;
                sensorPos.y = (threeMesh.boundingBox.max.y+threeMesh.boundingBox.min.y)/2;
                sensorPos.z = (threeMesh.boundingBox.max.z+threeMesh.boundingBox.min.z)/2;
                //重新设置相机的位置
                //注意camera up vector 的方向，还有跟right vector的关系，以及pivot的位置
                viewer.navigation.setRequestTransitionWithUp(true,new THREE.Vector3(sensorPos.x+4,sensorPos.y+4, sensorPos.z),new THREE.Vector3(sensorPos.x,sensorPos.y, sensorPos.z),45,new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0));
                viewer.navigation.setPivotPoint(true); //更新到pivot
                viewer.loadExtension('Autodesk.FirstPerson', viewer.config)
                    .then(function () {
                        viewer.setActiveNavigationTool('firstperson'); //viewer3d需要开启第一视角工具
                    });
                //重新设置相机的位置
            }
        })
    };
    Autodesk.Viewing.Initializer(options, function () {
        var SumLen=0;
        var _temp;
        var width=$('body').width(),width2=$(".progress").width();
        var  isaddPercent=true;
        viewer.addEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT,
            function (event) {
                if(isaddPercent){
                    if(_temp){
                        SumLen+=(event.percent-_temp);
                    }else{
                        SumLen+=event.percent;
                    }
                    _temp=event.percent
                }

                if(event.percent<100){
                    document.getElementById("progress001").style.display = "block";
                }else{
                    document.getElementById("progress001").style.display = "none";
                    _temp=0;
                }

                if(SumLen>=(JHCYW.models_urls.length+2)*100-10){
                    document.getElementById('progress-container').style.display = "none";
                    isaddPercent=false;SumLen=0;
                }else{
                    document.getElementById("progress-bar").style.width = parseInt(width2 *SumLen/(JHCYW.models_urls.length+2)/100) + "px";
                    document.getElementById("progress-text01").innerHTML =  ((width2 *SumLen/(JHCYW.models_urls.length+2)/100)/425*100).toFixed(2) + "%";
                }
                document.getElementById("progress001").style.width = parseInt(width *event.percent/100) + "px";
            });
        //获取当前url
        JHCYW.LocationURL= getLocationURL();
        //加载模型
        globalPromise(viewer,JHCYW.models_urls,onLoadSuccess,onLoadError)
    });

    function globalPromise(viewer,modelArray,success,error){
        function promiseEachModel(index) {
            return new Promise(function(resolve, reject){
                var modelName = modelArray[index];
                function _onLoadModelSuccess(model) {
                    var a={};
                    a[modelArray[index]]=model;
                    JHCYW.models_obj.push(a);// [{"15号楼":model},{"17号楼":model}]
                    resolve(modelName + ': Load Model Succeeded!');
                }
                function _onLoadModelError(){
                    error && error();
                    reject(modelName + ': Load Model failed!');
                }
                if(index==0){
                    //JD建筑模型  JG结构   JD 机电模型
                    viewer.start(JHCYW.LocationURL+"/BIM/svf/"+modelArray[index]+"/JZ/3d.svf",{},
                        _onLoadModelSuccess,
                        _onLoadModelError);
                }else{
                    viewer.loadModel(JHCYW.LocationURL+"/BIM/svf/"+modelArray[index]+"/JZ/3d.svf",
                        { globalOffset: viewer.model.getData().globalOffset },
                        _onLoadModelSuccess,
                        _onLoadModelError);
                }
            });
        }


        var indexArr = JHCYW.models_urls.map(function (item,index) {
            return index;
        });
        function processArray(array, fn) {
            var results = [];
            return array.reduce(function(p, item) {
                return p.then(function() {
                    return fn(item).then(function(data) {
                        results.push(data);
                        return results;
                    });
                });
            }, Promise.resolve());
        }
        //start to process
        processArray(indexArr, promiseEachModel).then(function(result) {
            console.log(result);
            success && success();
        }, function(reason) {
            console.log(reason);
        });
    };

    function onLoadSuccess() {
        //改变背景色
        viewer.setBackgroundColor(255,192,203,176,224,230);
        viewer.impl.setGhostingBrightness = function(darkerFade)
        {
            if (darkerFade) {
                //ghost 透明度
                this.fadeMaterial.opacity = 0.08;
            }
            else {
            }
            this.fadeMaterial.needsUpdate = true;
        };

        //测量工具
        document.getElementById('ls').onclick = function(){
           var isopen=  $("#ls").attr("ipOpen");
            if ( isopen == '1') {
                viewer.setActiveNavigationTool();
                $("#ls").attr("ipOpen",'0').css('border','1.5px solid white');
                $("#ls").find(".arrow01").css("borderBottom",'10px solid white');
            } else{
                viewer.loadExtension('Autodesk.Measure', viewer.config)
                    .then(function () {
                        viewer.setActiveNavigationTool('measure');
                        const measureExtension = viewer.getExtension( 'Autodesk.Measure' ); // const 定义常量
                        measureExtension.setUnits( 'mm' );
                    });
                $("#ls").attr("ipOpen",'1').css('border','1.5px solid  orange');
                $("#ls").find(".arrow01").css("borderBottom",'10px solid  orange');
            }
        }
        // 窗口缩放
        document.getElementById('gc').onclick = function(){
            var isopen=  $("#gc").attr("ipOpen");
            if (isopen == '1') {
                viewer.setActiveNavigationTool();
                $("#gc").attr("ipOpen",'0').css('border','1.5px solid white');
                $("#gc").find(".arrow01").css("borderBottom",'10px solid white');
            } else{
                viewer.setActiveNavigationTool( 'zoomwindow' );
                $("#gc").attr("ipOpen",'1').css('border','1.5px solid  orange');
                $("#gc").find(".arrow01").css("borderBottom",'10px solid  orange');
            }
        }

        viewer.loadExtension("Common").then(function(e){
            //加载楼栋和楼层、房间功能
            viewer.loadExtension("ObjectTree",{"tools":e});
            //模糊搜索
            viewer.loadExtension("blSearch");
        });
        //加载弹出插件
        viewer.loadExtension("infoWindow");
        //加载右侧工具
        viewer.loadExtension("Tools",{});
        //右键获取菜单
        viewer.loadExtension("Autodesk.ADN.Viewing.Extension.ContextMenu",{hasInfoWindow:true});
        //生成首页模型统计图表
        viewer.loadExtension("ModelStatistics");
        //传感器
        viewer.loadExtension("cgq_infor",{});
        //机电模型
        viewer.loadExtension("Electrome");

        //生成地下一层设施设备数据
        viewer.loadExtension("BasementStatistics");
        // 生成电梯模型引入
        viewer.loadExtension("LiftStatistics");
        //动画test
        // viewer.loadExtension("Autodesk.ADN.Viewing.Extension.TranslateTool",{});

    }

    function onLoadError(event) {
        console.log('fail');
    }

    function getLocationURL(){
        //获取当前的路径
        var pathName = window.location.pathname.substring(1);
        var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
        if (webName == "") {
            return window.location.protocol + '//' + window.location.host;
        }
        else {
            return window.location.protocol + '//' + window.location.host + '/' + webName;
        }
    }




});