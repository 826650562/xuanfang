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
  <link rel="icon" href="<%=basePath%>images/ico.png" type="image/x-icon">
  <link rel="stylesheet" href="<%=basePath %>js/bootstrap/css/bootstrap.css">
  <link rel="stylesheet" href="<%=basePath %>js/layui/css/layui.css" media="all">
  <link href="<%=basePath %>js/fontawesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="<%=basePath %>css/stylelogin.css" media="all">
  <link rel="stylesheet" href="<%=basePath %>css/login.css" media="all">
  <script src="<%=basePath %>js/jquery-1.11.0.min.js"></script>
  <script src="<%=basePath %>js/chooseLogin.js"></script>
  
  <script>
  ///^http(s*):\/\//.test(location.href) || alert('请先部署到 localhost 下再访问');
  </script>
  <script>window.path='<%=basePath %>'</script>
</head>
<body>
  
  <div class="logintop">
<div class="z-row">
  <div class="loginlogo1"><img src="<%=basePath %>images/logo.png"></div>
</div>
</div>

<div class="container-fluid">
  <div class="container">
     <div class="z-row">
       <div class="z-col"></div>
       <div class="loginbox">
          <div class="login-form">
             <form>
                  <div class="z-row input-group">
                     <div class="logintxtxtb"><i class="fa fa-user-circle-o fa-fw"></i></div>
                     <div class="z-col"><input type="text" placeholder="用户名" class="input-field" id="user"></div>
                  </div>
                  <div class="z-row input-group">
                     <div class="logintxtxtb"><i class="fa fa-unlock-alt fa-fw"></i></div>
                     <div class="z-col"><input type="password" placeholder="密码" class="input-field" id="password"></div>
                  </div>
                  <div class="z-row input-yzmbox">
                     <div class="z-col yzmsrk"><input type="text" placeholder="验证码" class="input-field" id="yzm" value="""></div>
                     <div>
						  <img id="randCodeImage" alt="验证码"  src="<%=basePath %>VerificationCode/generate" width="100" height="40"/>
					 </div>
					 <div class="z-col yzmsx"><a href="#">看不清换一张</a></div>
                  </div>
                 <button type="button" class="login-button">登录<i class="fa fa-long-arrow-right fa-fw"></i></button>
             </form>
        </div>
       </div>
       <div class="z-col"></div>
     </div>
     <div class="z-row">
        <div class="z-col loginbottomtxt">北京市保障房建设投资中心</div>
     </div>
  </div>
</div>
</body>
<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
<script type="text/javascript">
layui.use([ 'form', 'laypage', 'element', 'jquery', 'laydate' ,'layer'], function() {
	var form = layui.form;
	var laypage = layui.laypage;
	var element = layui.element,
		$ = layui.jquery;
	var laydate = layui.laydate;

});
</script>
</html>