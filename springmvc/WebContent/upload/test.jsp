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
<meta charset="utf-8" http-equiv="X-UA-Compatible">
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

</head>

<body>
	<div>
		<div class="col-lg-3 pad10">
			<div class="mxitemsc">
				<div class="mxitembox">
					<div class="louhao">图片上传</div>
					<div class="layui-upload-drag" id="test10">
						<i class="layui-icon"></i>
						<p>点击上传</p>
						<br />
					</div>
				</div>
			</div>
		</div>
	</div>

</body>
<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
<script>
	layui.use([ 'form', 'element', 'upload', 'laypage', 'jquery' ], function() {
		var form = layui.form;
		var element = layui.element;
		var $ = layui.jquery;
		var upload = layui.upload;
		var laypage = layui.laypage;
		//拖拽上传
		upload.render({
			elem : '#test10',
			url : 'toUpload',
			multiple: true,
			done : function(res) {
				if (res.success) {
					layer.msg(res.success);	
					console.log(res.filenameList)	;			
				}
				form.render();
			},
			accept : 'images', //允许上传的文件类型
			size : 500000 //最大允许上传的文件大小
		});
	})
/* 	var formData = new FormData();
	$('#btn').unbind().click(function() {
		formData.append("imgList", $('#imgList')[0].files);
		$.ajax({
			url : 'upload',
			data : formData,
			type : "POST",
			dataType : "JSON",
			cache : false, //上传文件无需缓存
			processData : false, //用于对data参数进行序列化处理 这里必须false
			contentType : false, //必须
			success : function(rtn) {
				console.log(rtn);
			},
			error : function(rtn) {
				console.log(rtn);
			}
		})
	}) */
</script>
</html>
