<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
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
	width: 116px;
	text-align: left;
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
  	var tenantList=${listOfPage}
  </script>
<script>
  ///^http(s*):\/\//.test(location.href) || alert('请先部署到 localhost 下再访问');
  </script>
<script>window.path = '<%=basePath %>'
</script>

</head>
<body>
	<div id="contain" class="container" style="margin:20px auto;width:100%">
		<div class="orderT layui-form">
			<div class='layui-elem-quote'>
				<span class="marR20">所有人员信息列表</span>
				<div style="display:inline-block;margin-left: 20px;">
					<button class="layui-btn layui-btn-xs marR20" id="importXls">导入xls表</button>
					<button class="layui-btn layui-btn-xs" id="exportXls">导出xls表</button>
				</div>
			</div>
			<div class="layui-elem-quote"
				style="border:0;background-color:#f6f6f6;margin-bottom:0;padding:9px">
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
					@click.stop.prevent="setRenderTime">添加预租时间</button>
			</div>
			<table class="layui-table ">
				<thead>
					<tr>
						<th>姓名</th>
						<th>户口所在地</th>
						<th>公租房备案号</th>
						<th>身份证号</th>
						<th>联系电话</th>
						<th>套型</th>
						<th>户口所在街乡</th>
						<th>备案时间</th>
						<th>正备选</th>
						<th>保办审核状态</th>
						<th>当前状态</th>
						<th>选房结果</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody id="tenantContent">
					<tr v-show='tenementList.length<=0'>
						<td colspan="13">暂无数据</td>						      
					</tr>
					<tr :rid=i.ID  v-for='i in tenementList'>
						<td>{{i.TENEMENTNAME}}</td>
						<td>{{i.ADDRESS}}</td>
						<td>{{i.PUBLIC_RENTAL_RECORD}}</td>
						<td>{{i.IDCARD}}</td>
						<td>{{i.PHONENUM}}</td>
						<td>{{i.HOUSETYPE}}</td>
						<td>{{i.ADDRESSDETAIL}}</td>
						<td>{{i.RECORDTIME}}</td>
						<td>{{i.OPTIONAL}}</td>
						<td>{{i.CHECKSTATUS}}</td>
						<td class="curStatus"></td>
						<td class="choosed">无</td>	
						<td><input :_id=i.ID type="checkbox" lay-skin="primary"
								name="choose">
						</td>						      
					</tr>
				</tbody>
			</table>
		</div>
		<div class="z-col" style="text-align: center;">
			<div id="tenantListPageChange"></div>
		</div>
	</div>
	<script type="text/javascript"
		src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
	<script src="<%=basePath%>js/vue.js"></script>
	<script src="<%=basePath%>js/tenantList.js"></script>
	<script src="<%=basePath%>js/Export.js"></script>
</body>
</html>