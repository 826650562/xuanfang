$(function(){
	
	//登陆事件传递
	function login(){
	

		var usrname = $('#user').val();
		var psw = $('#password').val();
		var codeinfo = $('#yzm').val();
		$.ajax({
			type : "POST",
			url :  window.path+"/chooselogin/orderLogin",
			async : false,
			cache : false,
			data : {
				_usr : usrname,
				_psw : psw,
				_codeinfo : codeinfo
				
			},
			contentType : "application/x-www-form-urlencoded",
			success:function(res){		
				console.log(res);
				if(res=="登陆成功"){
					window.location.href = window.path +'manage/index';
				}else{
					alert("登陆失败")
					$('#randCodeImage').attr('src',window.path+'VerificationCode/generate?time='+new Date().getTime());
				}
				
				
			},
			error:function(){
				console.log("登陆失败");
			}	
		});
	
	}
	
	function changeCodePic(){
		$('.yzmsx').click(function(){
			$('#randCodeImage').attr('src',window.path+'VerificationCode/generate?time='+new Date().getTime());
			console.log("ok");
		})
	}
	
	
	function loginClick(){
		$('.login-button').click(login);
		$('body').keydown(function(){
			if(window.event.keyCode == 13){
				window.event.returnValue=false;
				window.event.cancel = true;
		        login();
		    }
		});
	}

	
	changeCodePic(); //刷新验证码
	loginClick(); // 登陆事件
})


 
