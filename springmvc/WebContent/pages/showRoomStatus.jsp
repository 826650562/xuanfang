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
<link href="<%=basePath%>css/style.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
</head>
<style type="text/css">
.mui-table-view-cell {
	padding: 0px;
}

.mui-table-view-cell:after {
	background: none;
}
</style>
<body>
	<div id="app">
		<!-- <form class="layui-form" id="cicleBox" action="" style="display:none;">
			<div class="circle"></div>
		</form> -->
		<div class="z-row">
			<div class="z-col">
				<div class="z-row wdxxyMain">
					<div class="z-col" v-for='(build,buildIndex) in buildRoomCountObj'>
						<div class="z-row">
							<div class="z-col wdxxyTitle">
								<i class="fa fa-home fa-fw"></i>&nbsp;{{ buildIndex }}房屋信息
							</div>
						</div>
						<div class="wdxxyinfocont">
							<div class="z-row wdxxyMainInfo">
								<div>楼栋全部户数：</div>
								<div id="roomBuild" class="z-col mui-text-right">{{ build.totalCount }}</div>
							</div>
							<div class="z-row wdxxyMainInfo">
								<div>楼栋被选数：</div>
								<div id="roomFloor" class="z-col mui-text-right">{{ build.chosedCount }}</div>
							</div>
							<div class="z-row wdxxyMainInfo">
								<div>楼栋出租数：</div>
								<div id="roomNum" class="z-col mui-text-right">{{ build.rentalCount }}</div>
							</div>
							<div class="z-row wdxxyMainInfo">
								<div>楼栋剩余数：</div>
								<div id="roomArea" class="z-col mui-text-right">{{ build.lastCount }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="itemcont minHeight600" class="z-row"  v-for="(build,buildIndex) in roomAllObj">
			<div class="xflistbox" id="buildListBox">
				<button class="mui-btn mui-btn-outlined ldxzbtn">{{ buildIndex }}</button>
			</div>
			<div  v-for="(floor,floorIndex) in build" class="xflistbox" id="xflistbox">
				<div class="z-row marB10">
					<div class="xflistch" :id=buildIndex+Object.keys(floor)[0]>{{ Object.keys(floor)[0] }}</div>
					<div class="z-col xflist floorRoomListBox"  v-for="(rooms,roomIndex) in floor">
						<div  :rid=Object.values(roomObj)[0] :key="roomObj" v-for="(roomObj,index) in rooms" class="xflistitem mui-table-view-cell bgGray">{{ Object.keys(roomObj)[0] }}</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- <div v-for="(build,index) in roomAllObj">
			<span>{{ index }}</span>
			<div v-for="(floor,index) in build">
				<div v-for="(rooms,index) in floor">
					<div :rid=Object.values(roomObj)[0] :key="roomObj"v-for="(roomObj,index) in rooms">{{ Object.keys(roomObj)[0]}}</div>
				</div>
			</div>
		</div> -->
	</div>
</body>
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script type="text/javascript">
	var roomAll = ${roomAll};
	var roomAllObj = {};//{楼栋:{楼层:[{户号:户id},户号:户id},户号:户id}]}}
	var buildRoomArr = [];
	var buildArr = [];
	var buildRoomCountObj = {};//楼顶所有户数
	getRoomAll();//获取所有楼栋所有户
	getStatus();//获取户状态表所有未被删除的数据
	//定时器  2秒获取状态一次
	setInterval(function(){
		getStatus();
	},2000);
	
	//定义vue  数据绑定
	var vm = new Vue({
		el:'#app',
		data:{
			roomAllObj:roomAllObj,
			buildRoomCountObj:buildRoomCountObj
		}
	})
	
	//获取房屋列表
	function getRoomAll(){		
		roomAll.map(function(item){
			if(item.HOUSEHOLD.length==4){
				var buildRoomIndex = buildRoomArr.indexOf(item.BUILD+item.FLOOR);
				var roomNum = item.HOUSEHOLD.substring(2);
				var roomObj = {};
				roomObj[item.HOUSEHOLD] = item.ROOMID;//户对象   户号：户id
				if(buildRoomIndex<0){
					var arr = [];
					var obj = {};					
					var buildIndex = buildArr.indexOf(item.BUILD);//buildArr数组是否存在当前楼栋
					if(buildIndex<0){
						buildArr.push(item.BUILD);
						roomAllObj[item.BUILD] = [];
					}
					buildRoomArr.push(item.BUILD+item.FLOOR);
					obj['F'+Number(item.FLOOR)] = [];
					roomAllObj[item.BUILD][Number(item.FLOOR)] = obj;		
					roomAllObj[item.BUILD][Number(item.FLOOR)]['F'+Number(item.FLOOR)][Number(roomNum)-1] = roomObj;	
				}else{
					roomAllObj[item.BUILD][Number(item.FLOOR)]['F'+Number(item.FLOOR)][Number(roomNum)-1] = item.HOUSEHOLD;
					roomAllObj[item.BUILD][Number(item.FLOOR)]['F'+Number(item.FLOOR)][Number(roomNum)-1] = roomObj;
				}
			}		
		})
		//去除房间数组中的空数据
		Object.values(roomAllObj).map(function(item,index){
			var arrList= [];
			var buildRoomCount = 0;
			item.map(function(val){
				if(val !== "" && val != undefined ){
					arrList.push(val);
					buildRoomCount += Object.keys(val)[0].length;
				}
			});
			buildRoomCountObj[Object.keys(roomAllObj)[index]] = {'totalCount':buildRoomCount,'lastCount':0,'chosedCount':0,'rentalCount':0};
			roomAllObj[Object.keys(roomAllObj)[index]] = [];
			roomAllObj[Object.keys(roomAllObj)[index]] = arrList;
		})
	}
	
	function getStatus(){
		$.ajax({
			url:'<%=basePath%>manage/getAllRoomStatus',
			type:'POST',
			dataType:'JSON',
			success:function(res){
				//遍历前  清空楼栋所有户状态
				Object.values(buildRoomCountObj).map(function(item){
					item.chosedCount = 0;
					item.rentalCount = 0;
					item.lastCount = item.totalCount;
				})
				//清理房屋列表样式
				$('.xflistitem').addClass('bgGray').removeClass('bgQianRed').removeClass('bgQianYellow');
				res.rentalArr.map(function(item){
					if(item.STATUS=='已被选'){						
						buildRoomCountObj[item.LOUDONG].chosedCount ++;
						$('[rid='+ item.ROOMID +']').removeClass('bgGray').addClass('bgQianYellow');
					}else if(item.STATUS=='已出租'){
						buildRoomCountObj[item.LOUDONG].rentalCount ++;
						$('[rid='+ item.ROOMID +']').removeClass('bgGray').addClass('bgQianRed');
					}
					buildRoomCountObj[item.LOUDONG].lastCount -= buildRoomCountObj[item.LOUDONG].rentalCount+buildRoomCountObj[item.LOUDONG].chosedCount;
				})
			},
			error:function(res){
				console.log(res);
			}
		})
	}
</script>
</html>
