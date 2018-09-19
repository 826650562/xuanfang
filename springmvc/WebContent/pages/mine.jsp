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
<style>
#roomNum {
	text-decoration: underline
}
.mui-table-view-cell {
    padding: 0px;
}
</style>
</head>
<body>
	<div class="topbar mui-bar mui-bar-nav">
		<div class="z-row">
			<div id="back" class="topbarleft">
				<i class="fa fa-chevron-left fa-fw"></i>返回
			</div>
			<div class="z-col topbarcenter">我的</div>
			<div class="topbarright"></div>
		</div>
	</div>
	<div class="mui-content">
		<div class="wdxxybox">
			<div class="wdxxyitembox">
				<div class="z-row padTB10">
					<div class="wdsyhead">
						<img src="<%=basePath%>images/head.jpg">
					</div>
					<div class="z-col wdsyheadright">
						<div class="z-row">
							<div id="tenementName" class="wdxxycpName">杨丞</div>
							<div id="tenementNum" class="z-col wdxxyLabel2"><label>编号：</label><span>1</span></div>
						</div>
						<div class="z-row">
							<div class="wdxxyLabel">手机号：</div>
							<div id="tenementTel" class="z-col wdxxyLabel padR5">182****0980</div>
						</div>
					</div>
				</div>
				<div class="z-row">
					<div class="z-col">
						<div class="z-row wdxxyMain">
							<div class="z-col">
								<div class="z-row">
									<div class="z-col wdxxyTitle">
										<i class="fa fa-home fa-fw"></i>&nbsp;房屋基本信息
									</div>
								</div>
								<div class="wdxxyinfocont">
									<div class="z-row wdxxyMainInfo">
										<div>户所在楼栋：</div>
										<div id="roomBuild" class="z-col mui-text-right">22号楼</div>
									</div>
									<div class="z-row wdxxyMainInfo">
										<div>户所在楼层：</div>
										<div id="roomFloor" class="z-col mui-text-right">04层</div>
									</div>
									<div class="z-row wdxxyMainInfo">
										<div>所选户号：</div>
										<div id="roomNum" class="z-col mui-text-right">0402户</div>
									</div>
									<div class="z-row wdxxyMainInfo">
										<div>房屋面积：</div>
										<div id="roomArea" class="z-col mui-text-right">
											<span>78</span>m<sup>2</sup>
										</div>
									</div>
									<div class="z-row wdxxyMainInfo" id="delCountBox">
										<div>可退选次数：</div>
										<div id="delCount" class="z-col mui-text-right">
											<span>0</span>次
										</div>
									</div>
									<div class="z-row wdxxyMainInfo"  id="btnBox" style="display: none;height: 38px;line-height: 38px;">
										<div style="float: left;">我要退选：</div>
										<div id="delCount" style="float: right;width:70%;" class="z-col mui-text-right">
											<button id="delChoose"
											style="height:30px;line-height:30px;"	class="layui-btn layui-btn-radius layui-btn-warm">退选
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="z-row marTB10" id="btnBox2">
					<div class="z-col">
						<button id="toLogin" onclick="javascript:window.location.href='<%=basePath %>login/index'"
							class="layui-btn width100 mui-btn-danger marT10">
							<i class="fa fa-long-arrow-right fa-fw"></i>&nbsp;退出登录
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
<!--底部nav html start-->
	<nav class="mui-bar mui-bar-tab textcenter">
		<div class="z-row" style="padding-top: 0.3em;">
			<div id="chooseRoom" class="z-col">
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
			<div id="toMine" class="z-col" onclick="javascript:location.reload();">
				<div class="mui-table-view-cell bottombaritem">
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
	layui.use(['form','element','upload','laypage','jquery'], function(){
        var form = layui.form;
        var element = layui.element;
        var $ = layui.jquery;
        var upload = layui.upload;
        var laypage = layui.laypage;
    });
    var error = '${error}';
    if(error){
    	alert(error);
    	window.location.href='<%=basePath%>login/index';
    }
	var json = ${JSONArray};
	$('#tenementName').text(json.NAME);
	$('#tenementNum span').text(json.ID);
	$('#tenementTel').text(json.TENEMENTTEL);
	$('#limitArea span').text(json.LIMITAREA);
	$('#delCount span').text(json.lastCount);
	//json.lastCount  剩余退选次数
	if(json.STATUSID=='1'){
		$('#btnBox').css('display','block');
	}else if(json.STATUSID=='3'){
		$('#delCountBox').css('display','none');
		$('#btnBox').css('display','none');
	}
	if(json.LOUDONG){
		$('#roomBuild').text(json.LOUDONG);
		$('#roomFloor').text(Number(json.FLOOR)+'楼');
		$('#roomNum').text(json.HOUSEHOLD);
		$('#roomArea span').text(json.AREA);
		 hasChoose();
	}else{
		$('#roomBuild').text("未选房");
		$('#roomFloor').text("未选房");
		$('#roomNum').text("前往选房");
		$('#roomArea span').text('0');
		$('#roomNum').unbind().click(function(){
			window.location.href = '<%=basePath%>login/chooseRoom';
		})
	}
	$('#chooseRoom').unbind().click(function(){
		window.location.href='<%=basePath%>login/chooseRoom';
	})
	
	$('#back').unbind().click(function(){
		window.location.href='<%=basePath%>login/chooseRoom';
	})
	function hasChoose(){
		$('#delChoose').unbind().click(function(){
			$.ajax({
				url:'delChoose',
				data:{
					tenementId:json.ID
				},
				type:"POST",
				dataType:"JSON",
				success:function(res){
					if(res.delSuccess){
						layer.msg(res.delSuccess);
						location.reload();
					}else if(res.delFailed){
						layer.msg(res.delFailed);
						location.reload();
					}else if(res.delCount){
						layer.msg(res.delCount);
					}
				},
				error:function(res){
					console.log(res);
				}
			})
		})	
		$('#roomNum').unbind().click(function(){
			window.location.href = "<%=basePath%>login/roomDetail?build=" + json.LOUDONG + 
							"&&household=" + json.HOUSEHOLD + "";
		})
	}
</script>
</html>
