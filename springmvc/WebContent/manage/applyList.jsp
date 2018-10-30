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
  
  <body>
    <div class="layui-body" id="bodyContent">
		<!-- 选房审核列表 内容主体区域 -->
		<div class="pad15 bodyContain" id="applyListContain">
			<div class="row">
				<div class="col-lg-3">
					<a href="<%=basePath%>manage/index" class="xxtxbox bgGreen"  id="untreatedApplyMsg">意向申请未处理消息
						<span class="xxtxnum">{{untreatedCount}}</span>
					</a>
				</div>
				<div class="col-lg-3">
					<a href="javascript:;" class="xxtxbox" @click='changeList($event)' id="treatedApplyMsg"> 意向申请已处理信息<span
						class="xxtxnum">{{delCount}}</span>
					</a>
				</div>
			</div>
			<div class="row" style=" height:15px;">
				<div class="col-lg-12"></div>
			</div>
			<!-- 选房审核列表  start -->
			<div class="row" id="showApplyList">
				<div class="col-lg-12">
					<div class="layui-form">
						<table class="layui-table mar0">
							<colgroup>
								<col>
								<col width="300">
								<col width="200">
							</colgroup>
							<tbody>
								<tr v-for='i in untreatedApply' :_id=i.ID>
									<td>{{i.TENEMENTNAME}}选择了&nbsp;<strong class="colorRed">{{i.BUILD}}</strong>
										<strong class="colorRed">{{i.HOUSEHOLD}}</strong>&nbsp;户
									</td>
									<td>{{i.TIME}}</td>
									<td><a href="#" class="showDetailBtn" @click='showApply(i.ID)'><i
											class="fa fa-eye fa-f2"></i>&nbsp;查看</a></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<!-- 选房审核列表  end -->
		</div>
		<!-- 选房审核列表 内容主体区域 end -->
		<!-- 选房人基本信息内容主体区域 -->
		<div class="pad15 bodyContain" id="showApplyDetail">
			<div class="shadowbox"  v-for='detail in applyDetail'>
				<form class="layui-form">
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
							<tr>
								<td>{{detail.NAME}}</td>
								<td>{{detail.ADDRESS}}</td>
								<td>{{detail.ADDRESSDETAIL}}</td>
								<td>{{detail.HOUSETYPE}}</td>
								<td>{{detail.PHONENUM}}</td>
								<td>{{detail.IDCARD}}</td>
								<td>{{detail.RECORDTIME}}</td>
								<td>{{detail.CHECKSTATUS}}</td>	
							</tr>
						</tbody>
					</table>
					<div class="padTB10 colorRed">选房信息</div>
					<table class="layui-table mar0">
						<thead>
							<tr>
								<th><strong>项目名称</strong></th>
								<th><strong>楼栋</strong></th>
								<th><strong>单元</strong></th>
								<th><strong>房号</strong></th>
								<th><strong>户型编号</strong></th>
								<th><strong>建筑面积</strong></th>
								<th><strong>室内使用面积</strong></th>
								<th><strong>户型</strong></th>
								<th><strong>三维模型</strong></th>
								<th><strong>全景图</strong></th>
								<th><strong>户型平面图</strong></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>保障房项目01（东区）</td>
								<td>{{detail.LOUDONG}}</td>
								<td>{{detail.DY}}单元</td>
								<td>{{detail.HOUSEHOLD}}</td>
								<td>{{detail.HOUSETYPE}}</td>
								<td>{{detail.INSIDE}}m²</td>
								<td>{{detail.INSIDE}}m²</td>
								<td>两室一厅一卫</td>
								<td><img src="<%=basePath%>images/swmx1.png"></td>
								<td><img src="<%=basePath%>images/qjt1.jpg"></td>
								<td><img src="<%=basePath%>images/hxt01.png"></td>
							</tr>
						</tbody>
					</table>
				</form>					
			</div>
			<div class="row" id="btnBox" v-if='btnShow'>
				<div class="col-lg-5"></div>
				<div class="col-lg-2">
					<a href="#"  @click.prevent='toSetApply(detailId)' class="layui-btn"><i class="fa fa-hdd-o fa-fw"></i>&nbsp;受理并通知对方</a>
				</div>
				<div class="col-lg-5"></div>
			</div>
		</div>
		<!-- 选房人基本信息内容主体区域 end -->						
	</div>
  </body>
<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
<script src="<%=basePath%>js/vue.js"></script>
<script src="<%=basePath%>js/layui/layui.js"></script>
<script src="<%=basePath%>js/layui/leftnav.js"></script>
<script src="<%=basePath%>js/applyList.js"></script>
<script>window.path = "<%=basePath%>";</script>
</html>
