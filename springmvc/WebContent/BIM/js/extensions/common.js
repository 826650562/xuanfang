/*
* 通用函数 可扩展
* GIS组
* 2018/7/4
* */
function _Common(viewer,options){
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this._viewer = viewer;
}
_Common.prototype.unload = function(){
    return true;
};

_Common.prototype.load = function(){
    this.init();
    return this;
};

_Common.prototype.init = function(){
    this.changeCamera();
};

/*
* 自定义回到原点功能
* */
_Common.prototype.changeCamera=function(){
    var threejs=this._viewer.impl;
    threejs.camera.position.set(JHCYW.homePosition.x, JHCYW.homePosition.y, JHCYW.homePosition.z);
    threejs.camera.lookAt( threejs.scene.position);
};

/*
* 获取到原生的THREE
* 需要在viewer3D.js 添加getTHREE方法  在5000行
* */
_Common.prototype.getTHREE=function(){

     return this._viewer.viewer.model.getTHREE();
};

/*   viewer.addEventListener(
       Autodesk.Viewing.CAMERA_CHANGE_EVENT,
       function(e){
            console.info(e);
            $(".tcxtinnercont").text(e.camera.position.x+"_"+e.camera.position.y+"_"+e.camera.position.z);
       }
   );*/

/*      NOP_VIEWER.search('"加压送风系统"',function(e){
                         console.info(e);
                         NOP_VIEWER.isolateById(e);
                         NOP_VIEWER.select(e);
                         console.timeEnd('testForEach');
                     },function(){},['系统类型']);*/

Autodesk.Viewing.theExtensionManager.registerExtension('Common', _Common);