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
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
<link rel="stylesheet"
	href="<%=basePath %>js/bootstrap/css/bootstrap.css">
<link rel="stylesheet" href="<%=basePath %>js/layui/css/layui.css"
	media="all">
<link href="<%=basePath %>js/fontawesome/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<%=basePath %>css/style.css" media="all">
<style>
.layui-table td, .layui-table th {
	text-align: center;
}

.layui-form-label {
	width: 150px;
}

.datetime {
	width: 180px;
	padding: 0 10px;
	height: 38px;
	line-height: 38px;
	text-align: center;
	border: 1px solid #ffb800;
	border-radius: 10px;
	color: #020202;
}

.layui-form-mid {
	display: contents;
}
</style>
<script>
  ///^http(s*):\/\//.test(location.href) || alert(请先部署到 localhost 下再访问);
  </script>
<script>
	window.path = '<%=basePath %>'
	var roomCount = '${roomCout}';
	var buildArr = ${buildArr};
</script>
</head>
<body>
	<div id="contain" class="container " v-cloak style="margin:20px auto;width:100%">
		<form class="layui-form" action="">
			<div class="orderT">
				<div class="layui-elem-quote">
					<span>可租房屋信息列表</span>
					<div class="z-col"
						style="text-align: left;height:50px;display: contents;">
						<div class="layui-inline">
							<label class="layui-form-label">预租时间段</label>
							<div class="layui-input-inline">
								<div id="dateStart" class=" datetime"></div>
							</div>
							<div class="layui-form-mid">-</div>
							<div class="layui-input-inline">
								<div id="dateEnd" class=" datetime"></div>
							</div>
						</div>
						<button style="margin-left:20px;"
							class="layui-btn layui-btn-radius layui-btn-warm"
							@click.stop.prevent="insertToTem">添加预租房屋</button>
					</div>
				</div>
				<div class="layui-elem-quote" style="border:0;background-color:#f6f6f6;">
					<button style="margin-right:20px;" class="layui-btn layui-btn-radius layui-btn-primary buildBtn" @click.stop.prevent="serachByBuild()">全部</button>					
					<button style="margin-right:20px;" class="layui-btn layui-btn-radius layui-btn-primary buildBtn" v-for="i in buildArr" @click.stop.prevent="serachByBuild(i.LDH)">{{i.LDH}}</button>
				</div>
				<table class="layui-table">
					<thead>
						<tr>
							<th>所属楼栋</th>
							<th>所属单元</th>
							<th>所属楼层</th>
							<th>户号</th>
							<th>户型</th>
							<!-- <th>房屋面积</th> -->
							<th>选择</th>
						</tr>
					</thead>
					<tbody id="roomListContent">
						<!-- <tr data-workerId="1" >
				      <td>1</td>
				      <td>1</td>
				      <td>1</td>
				      <td>1</td>
				      <td>1</td>
				      <td>1</td>
				      <td><input type="checkbox" title=""  lay-skin="primary"  name=""></td>
				    </tr> -->
						<tr :roomId=i.ID v-for="i in roomList">
							<td>{{i.LOUDONG}}</td>
							<td>{{i.JZ_DY}} 单元</td>
							<td>{{i.JZ_FLOOR}} 楼</td>
							<td>{{i.JZ_HOUSEHOLD}}</td>
							<td>{{i.JZ_HOUSETYPE}}</td>
							<!-- <td>{{i.ROOMINSIDEAREA}}</td> -->
							<td><input :_id=i.ID type="checkbox" lay-skin="primary"
								name="choose"></td>
						</tr>
					</tbody>
				</table>
			</div>
		</form>
		<div class="z-col" style="text-align: center;">
			<div id="pageChange"></div>
		</div>

	</div>
</body>
<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
<script type="text/javascript" src="<%=basePath%>js/vue.js"></script>
<script src="<%=basePath%>js/allRoomList.js"></script>
</html>