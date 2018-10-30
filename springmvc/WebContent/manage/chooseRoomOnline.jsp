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
<link href="<%=basePath%>css/z-layout.css" rel="stylesheet"
	type="text/css">
<link href="<%=basePath%>css/mcss/style.css" rel="stylesheet"
	type="text/css">
	<style>
	body{background-color: #fdfdfd;}
	.userInfoContain{display:none;}
	</style>
  </head>
  
  <body>
    <div class="layui-body" id="bodyContent">
    	<!--    在线选房   内容主体区域   start   -->
			<div class="pad15 bodyContain" id="chooseRoomOnline">
				<div class="row">
					<div class="col-lg-3">
						<input id="uerIdCard" placeholder="输入用户身份证号" type="text" value="123456666666666666">
					</div>
					<div class="col-lg-3">
						<input id="chooseRoomNum" placeholder="输入用户选房码"  type="text" value="035291">
					</div>
					<div class="col-lg-3">
						<input id="toSearchBtn" @click="toSearch()" type="button" value="搜索">
					</div>
				</div>
				<div class="row" style=" height:15px;">
					<div class="col-lg-12"></div>
				</div>
				<!-- 选房审核列表  start -->
				<form class="layui-form userInfoContain">
					<div class="padTB10 colorRed">选房人基本信息</div>
					<table class="layui-table marB15">
						<thead>
							<tr>
								<th><strong>姓名</strong></th>								
								<th><strong>户口所在地</strong></th>
								<th><strong>户口所在街道</strong></th>	
								<th><strong>房型 </strong></th>							
								<th><strong>手机号</strong></th>
								<th><strong>身份证号</strong></th>
								<th><strong>备案时间 </strong></th>
								<th><strong>保办审核状态</strong></th>								
							</tr>
						</thead>
						<tbody>
							<tr :_id=i.ID v-for="i in userInfo">
								<td>{{i.TENEMENTNAME}}</td>
								<td>{{i.ADDRESS}}</td>
								<td>{{i.ADDRESSDETAIL}}</td>
								<td>{{i.HOUSETYPE}}</td>
								<td>{{i.PHONENUM}}</td>
								<td>{{i.IDCARD}}</td>
								<td>{{i.RECORDTIME}}</td>
								<td>{{i.CHECKSTATUS}}</td>								
							</tr>
						</tbody>
					</table>
					<div class="itemcont minHeight600" class="z-row"  >
						<div class="xflistbox" id="buildListBox" >
							<button class="mui-btn ldxzbtn" :class="index==0? 'mui-btn-success':'mui-btn-outlined' "  v-for="(i,index) in buildingAll">{{ i.LDH }}</button>
						</div>
						<div  v-for="floor in roomArr" class="xflistbox">
							<div class="z-row marB10" v-for="(roomArr,floorNum) in floor">
								<div class="xflistch" :id=floorNum>{{floorNum}}</div>
								<div class="z-col xflist floorRoomListBox" >
									<div  :rid=roomObj.id  :key="roomObj"  v-for="roomObj in roomArr " class="xflistitem mui-table-view-cell bgGray">{{ roomObj.houseType }}</div>
								</div>
							</div>
						</div>
					</div>
				</form>
				<!--  在线选房     内容主体区域       end -->
			</div>
			<!--   在线选房     内容主体区域      end -->
    </div>
    
    
  </body>
<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="<%=basePath%>js/layui/layui.js"></script>
<script src="<%=basePath%>js/layui/leftnav.js"></script>
<script src="<%=basePath%>js/chooseRoomOnline.js"></script>
</html>
