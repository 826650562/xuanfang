<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>选房系统</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <link rel="stylesheet" href="<%=basePath %>js/bootstrap/css/bootstrap.css">
  <link rel="stylesheet" href="<%=basePath %>js/layui/css/layui.css" media="all">
  <link href="<%=basePath %>js/fontawesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="<%=basePath %>css/style.css" media="all">
  <script>
  	var rentalRoomCount=${rentalRoomCount}
  </script>	
  <script>
  ///^http(s*):\/\//.test(location.href) || alert(请先部署到 localhost 下再访问);
  </script>
  <script>window.path='<%=basePath %>'</script>
</head>
<body>
<div v-cloak id="contain" class="container" style="margin:20px auto;width:100%">
   <div class="orderT"><div class=layui-elem-quote>
		<span>预租房屋信息列表</span>
		<div class="z-col" style="text-align: left;height:50px;display: contents;">		
			<button style="margin-left:20px;" class="layui-btn layui-btn-radius layui-btn-warm" @click.stop.prevent="deleteRentalRoom">删除预租房屋</button>		 			
		</div>			
   </div>
		<table class="layui-table">
			  <thead>
			     <tr>
			      <th>所属楼栋</th>
			      <th>所属单元</th>
			      <th>所属楼层</th>
			      <th>户号</th>
			      <th>户型</th>
			      <th>预租开始时间</th>
			      <th>预租结束时间</th>
			      <th>选择</th>
			    </tr> 
			  </thead>
			  <tbody id ="roomListContent" class="layui-form">
				   <tr :data-workerId=i.ID  v-for="i in roomList">
				      <td>{{i.LOUDONG}}</td>
				      <td>{{i.JZ_DY}}单元</td>
				      <td>{{i.JZ_FLOOR}}楼</td>
				      <td>{{i.JZ_HOUSEHOLD}}户</td>
				      <td>{{i.JZ_HOUSETYPE}}</td>
				      <td>{{i.STARTTIME}}</td>
				      <td>{{i.ENDTIME}}</td>
				      <td><input :_id=i.ID  type="checkbox"  lay-skin="primary" name="choose"></td>			      
				    </tr>
			  </tbody>
		</table>
	</div>
   <div  class="z-col" style="text-align: center;"><div id="rentalRoomPage"></div></div>
</div>  
</body>
<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
<script type="text/javascript" src="<%=basePath%>js/vue.js"></script>
<script src="<%=basePath %>js/roomListForRental.js"></script>
</html>