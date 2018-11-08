<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!doctype html>
<html>
<head>

<title>选房系统</title>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<link rel="icon" href="<%=basePath%>images/ico.png" type="image/x-icon">
<link href="<%=basePath%>js/layui/css/modules/layer/default/layer.css"
	rel="stylesheet" type="text/css">
<link href="<%=basePath%>js/layui/css/layui.css" rel="stylesheet"
	type="text/css">
<link href="<%=basePath%>js/fontawesome/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">
<link
	href="<%=basePath%>js/mui-master/examples/hello-mui/css/mui.min.css"
	rel="stylesheet" type="text/css">
<link href="<%=basePath%>css/z-layout.css" rel="stylesheet"
	type="text/css">
<link href="<%=basePath%>css/style.css" rel="stylesheet" type="text/css">
<script src="<%=basePath%>js/jquery-1.9.1.min.js" type="text/javascript"></script>
<script
	src="<%=basePath%>js/mui-master/examples/hello-mui/js/mui.min.js"
	type="text/javascript"></script>


<!--  HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
      <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
<style type="text/css">
html, body {
	height: 100%;
	position: relative;
}

.mui-table-view-cell {
	padding: 0px;
}

.mui-table-view-cell:after {
	background: none;
}
</style>
</head>
<body>
	<div class="mui-content">
		<div class="itemcont">
			<div class="z-row">
				<div class="z-col">
					<div class="z-row ">
						<div class="z-col xmtitle">北京保障房焦化厂项目</div>
					</div>
					<div class="z-row xmaddr">
						<div>地址：</div>
						<div class="z-col">北京市朝阳区垡头街道</div>
					</div>
				</div>
				<div>
					<a href="communityDstail"
						class="mui-btn mui-btn-danger mui-btn-outlined xqxqbtn">小区详情</a>
				</div>
			</div>
		</div>

		<div class="z-row marB10">
			<div class="z-col xmimg">
				<img src="<%=basePath%>images/xmimg.jpg">
			</div>
		</div>

		<div class="itemcont minHeight600">

			<div class="z-row tytitle">
				<div>
					<i class="fa fa-sticky-note-o fa-fw"></i>&nbsp;
				</div>
				<div class="z-col">房屋选择</div>
			</div>
			<div class="z-row">
				<div class="z-col" id="buildListBox">
				</div>
			</div>

			<div class="z-row padT10">
				<div class="z-col"></div>
				<!--勿删-->
				<div>
					<div class="xuanfangzt">
						<div class="xfztcolor bgQianYellow"></div>
						<div class="xfzttxt">已选</div>
					</div>
					<div class="xuanfangzt">
						<div class="xfztcolor bgGray"></div>
						<div class="xfzttxt">未选</div>
					</div>
					<div class="xuanfangzt">
						<div class="xfztcolor bgQianRed"></div>
						<div class="xfzttxt">已租</div>
					</div>
				</div>
				<div class="z-col"></div>
				<!--勿删-->
			</div>

			<div class="xflistbox" id="xflistbox">
				<form class="layui-form" id="cicleBox" action="">
					<div class="circle"></div>
				</form>
			</div>
		</div>
	</div>
	<!--底部nav html start-->
	<nav class="mui-bar mui-bar-tab textcenter" >
		<div class="z-row" style="padding-top: 0.3em;">
			<div id="chooseRoom"  class="z-col"  onclick="javascript:location.reload();">
				<div class="mui-table-view-cell bottombaritem bottomActive">
					<div class="z-row">
						<div class="z-col bottombarxtb">
							<span class="fa fa-home fa-lg"></span>
						</div>
					</div>
					<div class="z-row">
						<div class="z-col bottombartxt">
							<span class="mui-tab-label">选房</span>
						</div>
					</div>
				</div>
			</div>
			<div id="toMine" class="z-col">
				<div class=" bottombaritem">
					<div class="z-row">
						<div class="z-col bottombarxtb">
							<span class="fa fa-user-circle fa-lg"></span>
						</div>
					</div>
					<div class="z-row">
						<div class="z-col bottombartxt">
							<span class="mui-tab-label">我的</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
	<!--底部nav html end-->
</body>
<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
<script type="text/javascript">	
	var getJson = '${buildList}';
	var json = getJson.substring(1, getJson.length - 1);	
	var buildNumJsonArr = json.split(',');
	var startTime = '${startTime}';
	var endTime = '${endTime}';
	window.path = '<%=basePath%>';
</script>
<script type="text/javascript" src="<%=basePath%>js/chooseRoom.js"></script>
</html>
