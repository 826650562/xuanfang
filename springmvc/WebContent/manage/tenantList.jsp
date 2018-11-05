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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <link rel="stylesheet" href="<%=basePath %>js/bootstrap/css/bootstrap.css">
  <link rel="stylesheet" href="<%=basePath %>js/layui/css/layui.css" media="all">
  <link href="<%=basePath %>js/fontawesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="<%=basePath %>css/style.css" media="all">
  <script>
  	var tenantList=${listOfPage}
  </script>	
  <script>
  ///^http(s*):\/\//.test(location.href) || alert('请先部署到 localhost 下再访问');
  </script>
  <script>window.path='<%=basePath %>'</script>
</head>
<body>
	<div class="container" style="margin:20px auto;width:100%">
	   <div class="orderT"><div class='layui-elem-quote'><span  class="marR20">预租人员信息列表</span><div style="display:inline-block;margin-left: 20px;"><button class="layui-btn layui-btn-xs marR20" id="importXls">导入xls表</button><button class="layui-btn layui-btn-xs" id="exportXls">导出xls表</button></div></div>
	</div>
   <div  class="z-col" style="text-align: center;"><div id="tenantListPageChange"></div></div>
  <script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
  <script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
  <script src="<%=basePath %>js/tenantList.js"></script>
  <script src="<%=basePath %>js/Export.js"></script>
</body>
</html>