<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
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
<title>选房系统</title>
<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">

<!--标准mui.css-->
<link rel="stylesheet" href="<%=basePath %>js/mui-master/dist/css/mui.min.css">
<link href="<%=basePath %>js/layui/css/layui.css" rel="stylesheet" type="text/css">
<link href="<%=basePath %>js/fontawesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
<link href="<%=basePath %>css/z-layout.css" rel="stylesheet" type="text/css">
<link href="<%=basePath %>css/style.css" rel="stylesheet" type="text/css">
<!--App自定义的css-->

</head>
<body>
<div class="mui-content pad15">
<div class="z-row">
   <div class="z-col blkhtmlblk"></div>
</div>

<div class="z-row">
   <div id="submitResult" class="z-col nofound colorGreen" style="font-size:20px;">提交成功</div>
</div>

<div class="z-row">
   <div id="roomNum" class="z-col nofound" style="line-height:26px;"></div>
</div>
<div class="z-row">
   <div class="z-col"></div>
   <div> <button class="layui-btn" id="back">返回主菜单</button></div>
   <div class="z-col"></div>
</div>
</div>
</body>
<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
<script type="text/javascript">
	var houseHold = '${houseHold}';
	var error = '${error}';
	//提交成功ss
	houseHold && $('#roomNum').text('您选择了'+ houseHold +'户');
	//提交失败
	if(error){
		$('#submitResult').text('提交失败');
		$('#submitResult').removeClass('colorGreen').addClass('colorRed');
		$('#roomNum').text(error);
	}
	$('#back').unbind().click(function(){
		window.location.href = '<%=basePath%>login/chooseRoom';
	})
</script>
</html>
