<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>选房系统管理</title>
<meta name="viewport"
	content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<link rel="icon" href="<%=basePath%>images/ico.png" type="image/x-icon">
<!--标准mui.css-->
<link rel="stylesheet"
	href="<%=basePath%>js/mui-master/dist/css/mui.min.css">
<link rel="stylesheet"
	href="<%=basePath%>js/bootstrap/css/bootstrap.css">
<link href="<%=basePath%>js/layui/css/layui.css" rel="stylesheet"
	type="text/css">
<link href="<%=basePath%>js/layui/css/layui.manage.css" rel="stylesheet"
type="text/css">
<link href="<%=basePath%>js/fontawesome/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">
<link href="<%=basePath%>css/mcss/style.css" rel="stylesheet"
	type="text/css">
<style>
#showApplyDetail{display:none;}
</style>
<!--App自定义的css-->
</head>
<body class="layui-layout-body">
	<div class="layui-layout layui-layout-admin" id="myApp" v-cloak>
		<div class="layui-header" style=" background-color: #53cc33;">
			<div class="layui-logo">
				<img src="<%=basePath%>images/logo.png">
			</div>
			<!-- 头部区域（可配合layui已有的水平导航） -->
			<ul class="layui-nav layui-layout-right">
			<c:forEach var="loginContent"  items="${username}">
				<li class="layui-nav-item"><a href="javascript:;"> <img
						src="<%=basePath%>images/head.png" class="layui-nav-img">
						系统管理员<c:out value="${username}"/>
				</a>
					<dl class="layui-nav-child">
						<dd>
							<a href="<%=basePath%>chooselogin/loginout">退出登录</a>
						</dd>
					</dl></li>
			</c:forEach>
			</ul>
		</div>
		<div class="layui-side layui-bg-black">
			<div class="layui-side-scroll">
				<ul class="layui-nav layui-nav-tree" lay-filter="test">
					<li class="layui-nav-item layui-nav-itemed"><a
						class="" href="javascript:;"><i
							class="fa fa-home fa-fw"></i>&nbsp;选房管理</a>
						<dl class="layui-nav-child">
							<dd class="layui-this">
								<a href="javascript:;" @click='javascript:window.open("<%=basePath%>manage/applyList");'><i class="fa fa-registered fa-fw"></i>&nbsp;房屋申请处理</a>
							</dd>
							<dd>
								<a @click='openChooseRoomOnline()'><i
									class="fa fa-registered fa-fw"></i>&nbsp;在线选房</a>
							</dd>
							<dd>
								<a @click='javascript:location.reload();window.open("<%=basePath%>manage/showRoomStatus")'><i
									class="fa fa-registered fa-fw"></i>&nbsp;房屋信息看板</a>
							</dd>
							<dd>
								<a href="<%=basePath%>manage/tenantList"><i class="fa fa-registered fa-fw"></i>&nbsp;预租人员信息 </a>
							</dd>							
						</dl>
					</li>
				</ul>
			</div>
		</div>

		<div class="layui-footer">分页展示</div>
	</div>
	<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vue"></script>
	<script src="<%=basePath%>js/layui/layui.js"></script>
	<script src="<%=basePath%>js/layui/leftnav.js"></script>
	<script>window.path = "<%=basePath%>";</script>
</body>
</html>
