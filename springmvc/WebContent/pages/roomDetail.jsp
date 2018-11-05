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

<style>
</style>
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
							<img src="<%=basePath%>images/map.png" style="width: 100%">
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
</html>
