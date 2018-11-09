// MarkupExt.js
function markup3d(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);

    this.viewer = viewer;
    this.scene = viewer.impl.scene; // change this to viewer.impl.sceneAfter with transparency, if you want the markup always on top.
    this.markupItems = []; // array containing markup data

    this.camera = viewer.impl.camera;


}

markup3d.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
markup3d.prototype.constructor = markup3d;

markup3d.prototype.unload = function () {
    $('#_group').remove();
    return true;
};

markup3d.prototype.load = function () {
    var self = this;

    var parent = self.viewer.container;
    self.group = $("<div class='_group' id='_group'></div>");
    $(parent).append(self.group);


    // setup listeners for new data and mouse events
    window.addEventListener("newData", function (e) {
        self.setMarkupData(e.detail)
    }, false);

    function caneraChange(rt) {
        var DOMeles = self.group.children();

        DOMeles.each(function(index,item){
            var divEle = $(item);
            //get out the 3D coordination
            var val = divEle.data('3DData');
            if(val) {
                try {
                    var pushpinModelPt = JSON.parse(val);
                } catch (e) {
                    //console.info(val);
                }

                //get the updated screen point
                if (pushpinModelPt && pushpinModelPt.x && pushpinModelPt.y && pushpinModelPt.z) {
                    var screenpoint = self.viewer.worldToClient(new THREE.Vector3(
                        pushpinModelPt.x,
                        pushpinModelPt.y,
                        pushpinModelPt.z));
                    divEle.css({
                        'left': screenpoint.x - pushpinModelPt.radius * 2,
                        'top': screenpoint.y - pushpinModelPt.radius
                    });
                }
            }
        });


    }

    function onMouseClick (event) {

        var screenPoint = {
            x: event.clientX,
            y: event.clientY
        };

        //get the selected 3D position of the object
        var hitTest = self.viewer.impl.hitTest(screenPoint.x,screenPoint.y,true);
       /* if(hitTest)
        {
            drawPushpin({x:hitTest.intersectPoint.x,
                y:hitTest.intersectPoint.y,
                z:hitTest.intersectPoint.z});
        }*/
    }

// Load markup points into Point Cloud
    this.setMarkupData = function (data) {
        data.map(function (item) {
            drawPushpin({
                x: item.x,
                y: item.y,
                z: item.z,
                dbid:item.dbid,
                name:item.name
            });
        });
        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, caneraChange);

        //$( this.viewer.container).bind("click", onMouseClick);
    };


    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function drawPushpin(pushpinModelPt) {

        //convert 3D position to 2D screen coordination
        var screenpoint = self.viewer.worldToClient(
            new THREE.Vector3(pushpinModelPt.x,
                pushpinModelPt.y,
                pushpinModelPt.z));

        //build the div container
        var randomId = makeid();
        var htmlMarker = '<div id="mymk' + randomId + '"  _dbid="'+ pushpinModelPt.dbid +'" _name="'+ pushpinModelPt.name +'"></div>';
        self.group.append(htmlMarker);
        $('#mymk' + randomId).css({
            'pointer-events': 'auto',
            'width': '24px',
            'height': '24px',
            'position': 'absolute',
            'overflow': 'visible',
            'cursor': 'pointer'
        });

        //build the svg element and draw a circle
        $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '" style="width:24px;height:24px;"></svg>');


        var snap = Snap($('#mysvg' + randomId)[0]);
        var rad = 7;
        var circle = snap.paper.circle(12, 12, rad);
        circle.attr({
            fill: "#e4e4e4",
            fillOpacity: 0.6,
            stroke: "#7b7b7b",
            strokeWidth: 1
        });
        snap.select("circle").mouseover(function(){
            this.animate({
                r: 9
            }, 600);
            var detail = {dbid:$('#mymk' + randomId).attr('_dbid'),name:$('#mymk' + randomId).attr('_name')};
            window.dispatchEvent(
                new CustomEvent('cgqInforOver', {'detail':detail})
            );
        });
        snap.select("circle").mouseout(function(){
            this.animate({
                r:rad
            }, 600);
            $('#cgq_info_contri').fadeOut(500);
        });
        snap.select("circle").click(function(){
            var detail = {dbid:$('#mymk' + randomId).attr('_dbid'),name:$('#mymk' + randomId).attr('_name')};
            window.dispatchEvent(
                new CustomEvent('cgqInforClick', {'detail':detail})
            );
        });


        //set the position of the SVG
        //adjust to make the circle center is the position of the click point
        var $container = $('#mymk' + randomId);
        $container.css({
            'left': screenpoint.x - rad * 2,
            'top': screenpoint.y - rad
        });

        //store 3D point data to the DOM
        var div = $('#mymk' + randomId);
        //add radius info with the 3D data
        pushpinModelPt.radius = rad;
        var storeData = JSON.stringify(pushpinModelPt);
        div.data('3DData', storeData);

        $('.sensor[_dbid='+ pushpinModelPt.dbid +']').attr('sId','mymk' + randomId);
        $('svg[xmlns="http://www.w3.org/2000/svg"]').remove();

    };

    return true;
}


Autodesk.Viewing.theExtensionManager.registerExtension('markup3d', markup3d);