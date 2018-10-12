/*$(function(){
	function getSessionmanage(){
		$.ajax({
			type : "POST",
			url :  window.path+"/manage/index",
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
	getSessionmanage();
})*/


 
