<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<link rel="icon" href="<%=basePath%>images/ico.png" type="image/x-icon">
<title>选房系统</title>
<link href="<%=basePath %>js/fontawesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
<link href="<%=basePath %>js/mui-master/examples/hello-mui/css/mui.min.css" rel="stylesheet" type="text/css">
<link href="<%=basePath %>css/z-layout.css" rel="stylesheet" type="text/css">
<link href="<%=basePath %>css/style.css" rel="stylesheet" type="text/css">
<link href="<%=basePath %>js/layui/css/layui.css" rel="stylesheet" type="text/css">
<link href="<%=basePath %>js/layui/css/modules/layer/default/layer.css" rel="stylesheet" type="text/css">



<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
</head>
<body class="loginbg">
	<div class="loginbox">   
       <div class="z-row">
          <div class="z-col"> </div>
          <div class="loginlogo"><img src="<%=basePath %>images/loginlogo.png"></div>
          <div class="z-col"></div>
       </div>
       <div class="z-row loginInput">
          <div class="loginInputXtb">
             <i class="fa fa-phone fa-fw"></i>
          </div>
          <div class="z-col">
             <input id="phoneNum" type="tel" placeholder="手机号码" class="zInput">
          </div>
       </div>
       <div class="z-row loginInput">
          <div class="loginInputXtb">
             <i class="fa fa-commenting fa-fw"></i>
          </div>
          <div class="z-col">
             <input id="verifyCode" type="text" placeholder="短信验证码" class="zInput">
          </div>
          <div>
             <button id="sendVerifyCode" class="mui-btn mui-btn-success mui-btn-outlined hqyzm">获取验证码</button>
          </div>
       </div>
       <div class="z-row loginInput">
          <div class="loginInputXtb">
             <i class="fa fa-tag fa-fw"></i>
          </div>
          <div class="z-col">
             <input id="publicRentalRecord" type="password" placeholder="请输入选房码" class="zInput">
          </div>
       </div>
       <div class="z-row marT30">
          <div class="z-col">
             <button id="submitBtn" class="mui-btn mui-btn-danger width100">登录</button>
          </div>
       </div>
     </div>
</body>
<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
<script>
	layui.use(['form','element','upload','laypage','jquery'], function(){
        var form = layui.form;
        var element = layui.element;
        var $ = layui.jquery;
        var upload = layui.upload;
        var laypage = layui.laypage;
    });
	var mobilevalid = /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;//(0|86|17951)?
	var phoneBol;
	//登录按钮事件
	$('#submitBtn').unbind().click(function(){	
		phoneBol = mobilevalid.test($('#phoneNum').val());	
		if(!phoneBol){
			layer.msg('手机号码填写有误，请重新填写！');
		}else if(!$('#publicRentalRecord').val()){
			layer.msg('选房码不能为空，请重新填写！');
		}else if(!$('#verifyCode').val()){
			layer.msg('验证码不能为空，请重新填写！');
		}else if(phoneBol && $('#publicRentalRecord').val()){
			$.ajax({
				url:'<%=basePath%>login/tenement',
				data:{
					tenement:$('#phoneNum').val(),
					public_rental_record:$('#publicRentalRecord').val(),
					verifyCode:$('#verifyCode').val()
				},
				type:'POST',
				dataType:'JSON',
				success:function(res){					
					if(res.success){
						window.location.href = '<%=basePath%>chooseRoom/index';
					}else if(res.error){
						layer.msg(res.error);
					}else if(res.verifyCodeOverdue){
						layer.msg(res.verifyCodeOverdue);
					}else if(res.verifyCodeError){
						layer.msg(res.verifyCodeError);
					}		
				},
				error:function(res){
					layer.msg(res.status);
				}				
			})
		}
	})
	var interval;//倒计时interval
	var num;//倒计时时间
	$('#sendVerifyCode').unbind().click(function(){
		phoneBol = mobilevalid.test($('#phoneNum').val());
		if(!phoneBol){
			layer.msg('手机号码填写有误，请重新填写！');
		}else{
			$(this).attr('disabled',true);
			num=60;
			$('#sendVerifyCode').removeClass('mui-btn-success').addClass('mui-btn-danger');
			countDown();
			interval = setInterval(countDown,1000);
			$.ajax({
				url:'sendVerifyCode',
				data:{
					mobile:$('#phoneNum').val()
				},
				dataType:'JSON',
				type:'POST',
				success:function(rtn){
					if(rtn.success){
						layer.msg(rtn.success);
					}else if(rtn.error){
						layer.msg(rtn.error);
					}
				},
				error:function(rtn){
					console.log(rtn);
				}
			})
		}
	});
	//倒计时
	function countDown(){
		num--;
		if(num>=0){			
			$('#sendVerifyCode').text("("+ Number(num) +")秒后重新获取");
		}else{
			clearInterval(interval);
			$('#sendVerifyCode').removeClass('mui-btn-danger').addClass('mui-btn-success');
			$('#sendVerifyCode').text("获取验证码").attr('disabled',false);			
		}		
	};
</script>
</html>
