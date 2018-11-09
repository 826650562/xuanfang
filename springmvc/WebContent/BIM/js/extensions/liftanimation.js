/*
* 右侧菜单栏按钮-电梯模型动画demo
* LX
* 2018/8/7
* */
function _liftAnimation(viewer,options){
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this._viewer = viewer;
}
_liftAnimation.prototype.unload = function(){
    return true;
};

_liftAnimation.prototype.load = function(){
    this.init();
    return this;
};

_liftAnimation.prototype.init = function(){
    this.loadanimation();
};

_liftAnimation.prototype.loadanimation = function(){
    var self = this;

    // 要求第一个动画 frame
    requestAnimationFrame(rotateHandler);
    function rotateHandler(){
        // 设置移动量 - 向 X 轴移动 -100 单位
        var offset = new THREE.Vector3( 0,0,300 );

        var model = self._viewer.model;

        var it = model.getData().instanceTree;
        it.enumNodeFragments(17062, function(fragId) {
                console.log(fragId);
                var fragProxy = self.viewer.impl.getFragmentProxy(model,fragId);
                fragProxy.getAnimTransform();
                var position = new THREE.Vector3(
                    fragProxy.position.x + offset.x,
                    fragProxy.position.y + offset.y,
                    fragProxy.position.z + offset.z
                );
                fragProxy.position = position;
                fragProxy.updateAnimTransform();
            },
            false);
        self.viewer.impl.sceneUpdated( true );
        // setTimeout("requestAnimationFrame(rotateHandlerback)",5000);
        function rotateHandlerback(){
            var offset = new THREE.Vector3( 0,0, -1 );
            var model = self._viewer.model;
            var fragProxy;

            var it = model.getData().instanceTree;
            it.enumNodeFragments(17062, function(fragId) {
                    console.log(fragId);
                    fragProxy = self.viewer.impl.getFragmentProxy(model,fragId);
                    fragProxy.getAnimTransform();
                    var position = new THREE.Vector3(
                        fragProxy.position.x + offset.x,
                        fragProxy.position.y + offset.y,
                        fragProxy.position.z + offset.z
                    );
                    fragProxy.position = position;
                    fragProxy.updateAnimTransform();
                },
                false);
            self.viewer.impl.sceneUpdated( true );

            if (fragProxy.position.z >= 0){
                requestAnimationFrame(rotateHandlerback);
            }
        }
        //开始动画
        rotateHandlerback();
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('liftAnimation', _liftAnimation);


