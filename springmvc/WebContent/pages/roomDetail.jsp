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
<link href="<%=basePath%>js/layui/css/layui.css" rel="stylesheet"
	type="text/css">
<link href="<%=basePath%>js/fontawesome/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">
<link
	href="<%=basePath%>js/mui-master/examples/hello-mui/css/mui.min.css"
	rel="stylesheet" type="text/css">
<link href="<%=basePath%>css/z-layout.css" rel="stylesheet"
	type="text/css">
<link href="<%=basePath%>css/style.css" rel="stylesheet"
	type="text/css">
<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
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
</style>

</head>
<body>
	<div class="mui-content">
		<div class="topbar">
			<div class="z-row">
				<div class="topbarleft" id="back">
					<i class="fa fa-chevron-left fa-fw"></i>返回
				</div>
				<div class="z-col topbarcenter">1604房</div>
				<div class="topbarright"></div>
			</div>
		</div>
		<div class="tablebox">
			<table border="1px" bordercolor="#eee" cellspacing="0px"
				style="border-collapse:collapse; width:100%;">
				<tr>
					<td width="25%">户型</td>
					<td width="25%">建筑面积</td>
					<td width="25%">使用面积</td>
					<td width="25%">状态</td>
				</tr>
				<tr>
					<td id="roomType"><span>A1</span></td>
					<td id="outsideArea"><span>33</span>m<sup>2</sup></td>
					<td id="insideArea"><span>78</span>m<sup>2</sup></td>
					<td id="roomStatus"><span class="colorYellow">待租</span></td>
				</tr>
			</table>
		</div>

		<div class="ckbtns">
			<div class="z-row">
<!-- 				<div class="z-col">
					<button id="showRoom"  class="mui-btn mui-btn-outlined ckitembtn1 width100">
						<i class="fa fa-street-view fa-fw"></i>所在位置
					</button>
				</div> -->
				<div class="z-col">
					<button id="showRoomType" class="mui-btn mui-btn-outlined ckitembtn2 width100">
						<i class="fa fa-cube fa-fw"></i>3D看房
					</button>
				</div>
			</div>
		</div>
		<div class="contitembox iframeBox">
			<iframe id="showModel" name="show3D" src="javascript:;" style="width:100%;height:100%"></iframe>
		</div>
<!-- 		<div class="contitembox">
			<div class="z-row fwwztitle">
				<div>
					<i class="fa fa-home fa-fw"></i>&nbsp;
				</div>
				<div class="z-col">房屋位置</div>
			</div>
			<div class="z-row">
				<div id="viewer-local" class="z-col cengwz">
					<img src="images/lczw.png">
				</div>
			</div>
		</div> -->
		<div class="contitembox">
			<div class="z-row fwxxmstitle">
				<div>
					<i class="fa fa-sticky-note-o fa-fw"></i>&nbsp;
				</div>
				<div class="z-col">房屋信息描述</div>
			</div>
			<div class="z-row">
				<div class="z-col fwxxms">整体户型方正，活动区域开阔，居住舒适度高；整个
					空间全明通透，采光良好，同时利于居住空间通风； 整个户型空间布局合理，做到了...</div>
			</div>
		</div>
		<div class="bottomblank"></div>
		<!--空div占位置-->

	</div>

	<div class="bottombtnbox">
		<button class="mui-btn mui-btn-danger xdfjbtn width100" id="chooseThisRoom">
			<i class="fa fa-long-arrow-right fa-fw"></i>&nbsp;<span>选择该户</span>
		</button>
	</div>
</body>
<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
<script src="<%=basePath%>js/config.js"></script>
<script type="text/javascript"></script>
<script>
    layui.use('layer', function(){
 		var layer = layui.layer;
	}); 
	window.Path='<%=basePath%>';
	var RoomInfor = '${json}';
	var RoomAreaInfor = '${roomArea}';
	var roomStatus = '${roomStatus}';
	RoomInfor =RoomInfor.substring(1,RoomInfor.length-1);
	var RoomInforJson = $.parseJSON(RoomInfor);//房屋所属楼栋等信息
    var AreaInforJson = $.parseJSON(RoomAreaInfor);//房屋面积描述朝向等信息
    var statusJson;
    if(roomStatus){
    	statusJson = $.parseJSON(roomStatus);//房屋状态
    }
    
    $('.topbarcenter').text(RoomInforJson.HOUSEHOLD+'房');//页面头部房屋名
    $('#roomType span').text(RoomInforJson.HOUSETYPE);//房屋信息框户型
    
    AreaInforJson.ROOMOUTSIDEAREA && $('#outsideArea span').text(AreaInforJson.ROOMOUTSIDEAREA); //房屋建筑面积
    AreaInforJson.ROOMINSIDEAREA && $('#insideArea span').text(AreaInforJson.ROOMINSIDEAREA); //房屋可用面积
    
    AreaInforJson.DESCRIPTION && $('.fwxxms').eq(0).text(AreaInforJson.DESCRIPTION); //房屋描述
    if(statusJson){
    	$('#roomStatus span').text(statusJson.STATUS);
    	switch (statusJson.STATUS){
    		case "已被选":
    			$('#roomStatus span').addClass("colorYellow");
    			$('.bottombtnbox').css("display","none");
    			/* $('.bottombtnbox').attr("disabled",true);
    			$('.bottombtnbox span').text("该户已被选") */
    			break;
   			case "已出租":
	   			$('#roomStatus span').addClass("colorRed");
	   			$('.bottombtnbox').css("display","none");
	   			/* $('.bottombtnbox').attr("disabled",true);
    			$('.bottombtnbox span').text("该户已出租") */
	   			break;
	   		case "未出租":
	   			$('#roomStatus span').addClass("colorGray");
	   			break;
    	}
    }
    //选择该户按钮点击事件
    $('#chooseThisRoom').unbind().click(function(){
		layer.confirm('是否确认选择该户，选择后您只有三次退选机会，请谨慎选择！', {icon: 3, title:'提示'}, function(index){
		  window.location.href = "<%=basePath%>chooseRoom/chooseRoomSuccess?build="+ RoomInforJson.BUILD +"&&household="+ RoomInforJson.HOUSEHOLD + "";
		  layer.close(index);
		}); 
    	
    });
    //返回按钮
    $('#back').unbind().click(function(){
    	window.location.href = '<%=basePath%>chooseRoom/chooseRoom';
    })
    
    //看模型参数设置
    var haoIndex = RoomInforJson.BUILD.indexOf('号');
    var build = RoomInforJson.BUILD.substring(0,haoIndex);
    var floor = RoomInforJson.HOUSEHOLD.substring(0,2);
    var room = RoomInforJson.HOUSEHOLD.substring(2);
    
    $('#showModel').attr("src",JHCXF.ThreeUrl+"?total=JHC-"+ RoomInforJson.HOUSETYPE +"&&show=1");
    /* $('#showModel').attr("src","http://116.236.96.146:28080/BIM/a/bim/bimJzxx/toShowHouseHold?total=JHC-"+ build +"-01-"+ floor + "-" + room + "&&show=1");    
    //所在位置  3d看房按钮事件
   	$('#showRoom').unbind().click(function(){
   		$('#showModel').attr("src","http://116.236.96.146:28080/BIM/a/bim/bimJzxx/toShowHouseHold?total=JHC-"+ build +"-01-"+ floor + "-" + room + "&&show=1");
   	})
   	$('#showRoomType').unbind().click(function(){
   		$('#showModel').attr("src","http://116.236.96.146:28080/BIM/a/bim/bimJzxx/toShowHouseType?total=JHC-"+ RoomInforJson.HOUSETYPE +"&&show=1");
   	}) */

</script>
</html>
