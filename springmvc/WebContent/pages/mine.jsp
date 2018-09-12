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
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>css/css/style.min.css">
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
#roomNum{text-decoration:underline}
</style>
</head>
<body>
	<div class="tablebox">
		<table border="1px" bordercolor="#eee" cellspacing="0px"
			style="border-collapse:collapse; width:100%;">
			<tr>
				<td width="25%">承租人编号</td>
				<td width="25%">承租人姓名</td>
				<td width="25%">承租人手机号</td>
				<td width="25%">承租人房屋面积</td>
			</tr>
			<tr>
				<td id="tenementNum"><span>1604</span></td>
				<td id="tenementName"><span>33</span></td>
				<td id="tenementTel"><span>78</span></td>
				<td id="limitArea"><span>78</span>m<sup>2</sup></td>
			</tr>
		</table>
	</div>
	<div class="tablebox">
		<table border="1px" bordercolor="#eee" cellspacing="0px"
			style="border-collapse:collapse; width:100%;">
			<tr>
				<td width="25%">户所在楼栋</td>
				<td width="25%">户所在楼层</td>
				<td width="25%">所选户号</td>
				<td width="25%">退选</td>
			</tr>
			<tr>
				<td id="roomBuild"><span>1604</span></td>
				<td id="roomFloor"><span>33</span></td>
				<td id="roomNum"><span>78</span></td>
				<td><button style="display:none" id="delChoose">退选</button></td>
			</tr>
		</table>
	</div>
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
	var json = ${JSONArray};
	$('#tenementName span').text(json.NAME);
	$('#tenementNum span').text(json.ID);
	$('#tenementTel span').text(json.TENEMENTTEL);
	$('#limitArea span').text(json.LIMITAREA);
	
	if(json.LOUDONG){
		$('#roomBuild span').text(json.LOUDONG);
		$('#roomFloor span').text(json.FLOOR);
		$('#roomNum span').text(json.HOUSEHOLD);
		$('#delChoose').css("display","block");
		 hasChoose();
	}else{
		$('#roomBuild span').text("未选房");
		$('#roomFloor span').text("未选房");
		$('#roomNum span').text("前往选房");
		$('#roomNum').unbind().click(function(){
			window.location.href = '<%=basePath%>login/chooseRoom?public_rental_record='+ json.PUBLIC_RENTAL_RECORD +'&&limitArea='+ json.LIMITAREA +'';
		})
	}
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
							"&&household=" + json.HOUSEHOLD + "&&publicRentalRecord=" + json.PUBLIC_RENTAL_RECORD + "&&limitArea="+ json.LIMITAREA +"";
		})
	}
</script>
</html>
