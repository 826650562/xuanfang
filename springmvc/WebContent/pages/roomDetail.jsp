<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>选房系统</title>
<link href="<%=basePath%>js/fontawesome/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">
<link
	href="<%=basePath%>js/mui-master/examples/hello-mui/css/mui.min.css"
	rel="stylesheet" type="text/css">
<link href="<%=basePath%>css/z-layout.css" rel="stylesheet"
	type="text/css">
<link href="<%=basePath%>css/mystyle.css" rel="stylesheet"
	type="text/css">
<link href="<%=basePath%>css/layer.css" rel="stylesheet"
	type="text/css">
<script type="text/javascript" src="http://api.map.baidu.com/api?key=&v=1.1&services=true"></script>
</head>
<body>
	<div class="layui-main">
		<div class="z-row1">
			<div class="leftback"  id="back">
				<i class="fa fa-chevron-left" style="margin-right: 5px;"></i>返回
			</div>
			<div class="z-col1 bg">
				<img src="<%=basePath%>images/bg.jpg">
			</div>
			<div class="z-col btn">
				<button class="layui-btn-radius layui-btn-primary" id="img">图片</button>
				<button class="layui-btn-radius layui-btn-primary" id="quanjing">
					<a href="<%=basePath%>chooseRoom/vtour" style="color: black">全景</a>
				</button>
				<button class="layui-btn-radius layui-btn-primary" id="3d">
					<a href="" style="color: black">3D</a>
				</button>
				<button class="layui-btn-radius layui-btn-primary" id="btn-change">1/2</button>
			</div>
		</div>
		<div class="itemcontent">
			<div class="layui-row"
				style="height: 30px;border-bottom: 1px solid #e2e2e2;">
				<div class="layui-col-md9">基本信息</div>
				<div class="layui-col-md3">
					查看全部<i class="fa fa-chevron-right" style="margin-left: 5px"></i>
				</div>
			</div>
			<div class="layui-row">
				<div class="layui-col-md12" style="font-size: 13px;">
					<!--1-->
					<div class="z-row lineheight">
						<div class="z-col">
							<div class="z-row">
								<div class="left-col">户型：</div>
								<div class="z-col" id="roomType">A1</div>
							</div>
						</div>
						<div class="z-col">
							<div class="z-row">
								<div class="left-col">发布：</div>
								<div class="z-col">2018-10-30</div>
							</div>
						</div>
					</div>
					<!--2-->
					<div class="z-row lineheight">
						<div class="z-col">
							<div class="z-row">
								<div class="left-col">建筑面积：</div>
								<div id="outsideArea"><span>33</span>m<sup>2</sup></div>
							</div>
						</div>
						<div class="z-col">
							<div class="z-row">
								<div class="left-col">楼层：</div>
								<div class="z-col" id="roomFloor"><span>33</span>层</div>
							</div>
						</div>
					</div>
					<!--3-->
					<div class="z-row lineheight">
						<div class="z-col">
							<div class="z-row">
								<div class="left-col">使用面积：</div>
								<div class="z-col" id="insideArea"><span>78</span>m<sup>2</sup></div>
							</div>
						</div>
						<div class="z-col">
							<div class="z-row">
								<div class="left-col">状态：</div>
								<div class="z-col" id="roomStatus"><span class="colorYellow">待租</span>
								</div>
							</div>
						</div>
					</div>
					<!--4-->
					<div class="z-row lineheight">
						<div class="z-col">
							<div class="z-row">
								<div class="left-col">年代：</div>
								<div class="z-col">2018</div>
							</div>
						</div>
					</div>
					<!--5-->
					<div class="z-row lineheight">
						<div class="z-col">
							<div class="z-row">
								<div class="left-col">小区：</div>
								<div class="z-col">北京市保障房焦化厂项目</div>
							</div>
						</div>
					</div>
					<div class="z-row">
						<div class="z-col">
							<!--百度地图容器-->
							<div id="full-screen-btn"><i class="fa fa-arrows-alt" aria-hidden="true" style="z-index:10000"></i></div>
                            <div style="width:100%;height:100%;border:#ccc solid 1px; min-height:150px;min-widht:330px" id="dituContent"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="layui-row"
				style="height: 30px;border-bottom: 1px solid #e2e2e2;">
				<div class="layui-col-md9">房源描述</div>
				<div class="layui-col-md3">
					查看全部<i class="fa fa-chevron-right" style="margin-left: 5px"></i>
				</div>
			</div>
			<div class="z-row">
				<div class="z-col fwxxms" style="font-size: 14px;">
					整体户型方正，活动区域开阔，居住舒适度高；整个 空间全明通透，采光良好，同时利于居住空间通风； 整个户型空间布局合理，做到了...</div>
			</div>
		</div>
		<div class="bottombtnbox">
			<button id="chooseThisRoom" class="mui-btn mui-btn-danger xdfjbtn width100">选择该房间<i class="fa fa-long-arrow-right fa-fw"></i>&nbsp;
			</button>
		</div>
	</div>

</body>
<script src="<%=basePath%>js/jquery-1.9.1.min.js"
	type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
<script src="<%=basePath%>js/config.js"></script>
<script src="<%=basePath%>js/roomDetail.js"></script>
<script> 
	window.Path='<%=basePath%>';
	var RoomInfor = '${json}';
	var RoomAreaInfor = '${roomArea}';
	var roomStatus = '${roomStatus}';	
</script>
 
<script type="text/javascript">
    //创建和初始化地图函数：
    function initMap(){
        createMap();//创建地图
        setMapEvent();//设置地图事件
        addMapControl();//向地图添加控件
        addMarker();//向地图中添加marker
    }
    
    //创建地图函数：
    function createMap(){
        var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
        var point = new BMap.Point(116.546047,39.855109);//定义一个中心点坐标
        map.centerAndZoom(point,17);//设定地图的中心点和坐标并将地图显示在地图容器中
        window.map = map;//将map变量存储在全局
    }
    
    //地图事件设置函数：
    function setMapEvent(){
        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard();//启用键盘上下左右键移动地图
    }
    
    //地图控件添加函数：
    function addMapControl(){
                        //向地图中添加比例尺控件
	var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
	map.addControl(ctrl_sca);
    }
    
    //标注点数组
    var markerArr = [{title:"焦化厂公租房项目",content:"北京市保障性住房建设投资中心",point:"116.546047|39.855109",isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}
		 ];
    //创建marker
    function addMarker(){
        for(var i=0;i<markerArr.length;i++){
            var json = markerArr[i];
            var p0 = json.point.split("|")[0];
            var p1 = json.point.split("|")[1];
            var point = new BMap.Point(p0,p1);
			var iconImg = createIcon(json.icon);
            var marker = new BMap.Marker(point,{icon:iconImg});
			var iw = createInfoWindow(i);
			var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
			marker.setLabel(label);
            map.addOverlay(marker);
            label.setStyle({
                        borderColor:"#808080",
                        color:"#333",
                        cursor:"pointer"
            });
			
			(function(){
				var index = i;
				var _iw = createInfoWindow(i);
				var _marker = marker;
				_marker.addEventListener("click",function(){
				    this.openInfoWindow(_iw);
			    });
			    _iw.addEventListener("open",function(){
				    _marker.getLabel().hide();
			    })
			    _iw.addEventListener("close",function(){
				    _marker.getLabel().show();
			    })
				label.addEventListener("click",function(){
				    _marker.openInfoWindow(_iw);
			    })
				if(!!json.isOpen){
					label.hide();
					_marker.openInfoWindow(_iw);
				}
			})()
        }
    }
    //创建InfoWindow
    function createInfoWindow(i){
        var json = markerArr[i];
        var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
        return iw;
    }
    //创建一个Icon
    function createIcon(json){
        var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
        return icon;
    }
    
    initMap();//创建和初始化地图
</script>
</html>
</script>
</html>
