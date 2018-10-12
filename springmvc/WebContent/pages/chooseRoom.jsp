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
	layui.use(['form','element','upload','laypage','jquery'], function(){
        var form = layui.form;
        var element = layui.element;
        var $ = layui.jquery;
        var upload = layui.upload;
        var laypage = layui.laypage;
    });
	var getJson = '${buildList}';
	var json = getJson.substring(1, getJson.length - 1);

	var buildNumJsonArr = json.split(',');
	var buildNum = [];
	$(function() {
		//字符串转json
		for (var i = 0; i < buildNumJsonArr.length; i++) {
			buildNumJsonArr[i] = $.parseJSON(buildNumJsonArr[i]);
			buildNum.push(Object.values(buildNumJsonArr[i])[0]);
		}
		//填充楼栋列表
		$('#buildListBox').html('');
		for (var j = 0; j < buildNum.length; j++) {
			$('#buildListBox').append('<button class="mui-btn mui-btn-outlined ldxzbtn">' + buildNum[j] + '</button>');
		}
		//默认选择楼栋列表第一个
		$('.ldxzbtn').eq(0).removeClass('mui-btn-outlined');
		$('.ldxzbtn').eq(0).addClass('mui-btn-success');
		$('#cicleBox').css({display:"block"});
		$('#xflistbox').find('.z-row').remove();
		getRoomList(); //获取初始选择楼栋房屋列表

		//房屋按钮注册点击事件
		$('.ldxzbtn').unbind().click(function() {
			$('.ldxzbtn').removeClass('mui-btn-success');
			$(this).removeClass('mui-btn-outlined');
			$(this).addClass('mui-btn-success');
			$('#cicleBox').css({display:"block"});
			$('#xflistbox').find('.z-row').remove();
			getRoomList();
		})
		
		$('#toMine').unbind().click(function(){
			window.location.href = "<%=basePath%>chooseRoom/mine";
		})
		
		
		//获取楼栋户型列表
		function getRoomList() {
			$.ajax({
				url : 'buildRoomByList', //获取楼栋户型列表
				data : {
					loudong : $('.mui-btn-success').text(),
				},
				dataType : 'JSON',
				type : 'POST',
				success : function(res) {
					var roomArr = [];
					var floorArr = [];
					var roomIdArr = [];
					res.map(function(item) {
						var obj = {};
						var floor = 'F' + Number(item.FLOOR);
						var floorIndex = floorArr.indexOf(floor);
						var roomNum;
						if (floorIndex >= 0) {
							if (Number(item.HOUSEHOLD)) {
								roomNum = item.HOUSEHOLD.substring(2);								
								roomArr[Number(item.FLOOR)][floor][Number(roomNum)] = item.HOUSEHOLD;
								roomIdArr[Number(item.FLOOR)][Number(roomNum)] = item.ID;
							}
						} else {
							obj[floor] = [];
							idArr = [];
							if (Number(item.HOUSEHOLD)) {
								roomNum = item.HOUSEHOLD.substring(2);
								floorArr.push(floor);
								obj[floor][Number(roomNum)] = item.HOUSEHOLD;	
								idArr[Number(roomNum)]	= item.ID ;			
								roomArr[Number(item.FLOOR)] = obj;
								roomIdArr[Number(item.FLOOR)] = idArr;
							}
						}
					})				
					var floorRoomArr;
					$('#cicleBox').css({display:"none"});
					$('#xflistbox').find('.z-row').remove();
					for (var i = 0; i < roomArr.length; i++) {
						if (roomArr[i] !== "" && roomArr[i] != undefined) {
							floorRoomArr = Object.values(roomArr[i])[0];
							$('#xflistbox').append('<div class="z-row marB10">' +
								'<div class="xflistch" id="' + $('.mui-btn-success').text() + Object.keys(roomArr[i])[0] + '">' + Object.keys(roomArr[i])[0] + '</div>' +
								'<div class="z-col xflist floorRoomListBox"></div></div>');
							for (var j = 0; j < floorRoomArr.length; j++) {
								if(floorRoomArr[j]!== ""&&floorRoomArr[j]!= undefined){
									floorRoomArr[j].length == 4 && $('#' + $('.mui-btn-success').text() +
									Object.keys(roomArr[i])[0]).next('.floorRoomListBox').append('<div class="xflistitem mui-table-view-cell bgGray" id="' +
									floorRoomArr[j] + '" _id="' + roomIdArr[i][j] + '">' + floorRoomArr[j] + '</div>');
								}
							}
							var len = $('#' + $('.mui-btn-success').text() +Object.keys(roomArr[i])[0]).next('.floorRoomListBox').find('.xflistitem').length;
							if(len<4){
								for(var a=0;a<4-len;a++){
									$('#' + $('.mui-btn-success').text() +Object.keys(roomArr[i])[0]).next('.floorRoomListBox').append('<div class="xflistitem mui-table-view-cell"></div>');
								}
							}
						}
					}
					!getCookie('closeLayer') && layer.open({
						title: '温馨提示',
						btn:['不再显示','确定'],
						content: '<div>1.本次选房只能选与配租面积相等的户型。</div>'+
								'<div>2.每个租户只能意向选取一户，若想选取其他户，请到‘我的’的页面中退选之前选中的户，每个租户可以最多退选三次。</div>'+
								'<div>3.一旦被后台判定选中成功，户列表中会显示已出租，并等待签署出租合同。</div>',
						btn1:function(index){
							setCookie('closeLayer',true);
							layer.close(index);
						},
						btn2:function(index){
							layer.close(index);
						}
					});
					getRoomStatusList();
					roomListClick();
				},
				error : function(res) {
					console.log(res);
				}
			})
			function getRoomStatusList() {
				$.ajax({
					url : "roomStatusList",
					type : "POST",
					dataType : "JSON",
					success : function(res) {
						res.map(function(item) {
							if (item.STATUS == '已被选') {
								$('[_id=' + item.ROOMID + ']').removeClass('bgGray').addClass('bgQianYellow');
								$('[_id=' + item.ROOMID + ']').attr('disabled', true);
							} else if (item.STATUS == '已出租') {
								$('[_id=' + item.ROOMID + ']').removeClass('bgGray').addClass('bgQianRed');
								$('[_id=' + item.ROOMID + ']').attr('disabled', true);
							}
						})
					},
					error : function(res) {
						console.log(res);
					}
				})
			}
			//room列表注册点击事件
			function roomListClick() {
				$('.xflistitem').unbind().click(function() {
					if ($(this).hasClass('bgGray')) {
						window.location.href = "<%=basePath%>chooseRoom/roomDetail?build=" + $('.mui-btn-success').text() + 
						"&&household=" + $(this).text() + "";
					} else if ($(this).hasClass('bgQianRed')) {
						layer.msg('该户已出租');
					} else if($(this).hasClass('bgQianYellow')){
						layer.msg('该户已被选');
					}
				})
			}			
		}
		//存cookie
		function setCookie(name,value){
			var Days = 30;
			var exp = new Date();
			exp.setTime(exp.getTime() + 10*60*1000);//Days*24*60*60*1000
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		}
		
		//取cookie
		function getCookie(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
			else
			return null;
		}
	})
</script>
</html>
