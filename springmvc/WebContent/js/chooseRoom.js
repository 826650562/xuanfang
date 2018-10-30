/**
 * 在线选房
 */
var vm = new Vue({
	el:'#bodyContent',
	data:{
		userInfo:[],
		buildingAll:[]
	},
	methods:{
		toSearch:function(){				
			if(!$('#uerIdCard').val()){
				layer.msg('请输入选房者身份证号！');
			}else if(!$('#chooseRoomNum').val()){
				layer.msg('请输入选房者选房号！');
			}else{	
				var loading = layer.load(1, {shade: [0.2, '#87888a']});
				$.ajax({
					url:'searchUser',
					data:{
						idCard:$('#uerIdCard').val(),
						publicRental:$('#chooseRoomNum').val()
					},
					type:'POST',
					dataType:'JSON',
					success:function(res){
						layer.close(loading);
						if(res.userInfo){
							$('.userInfoContain').css('display','block');
							vm.userInfo = [res.userInfo];
							vm.buildingAll = [res.buildingArray];
						}else{
							$('.userInfoContain').css('display','none');
							layer.msg("未搜索到用户")
						}							
					},
					error:function(res){
						layer.close(loading);
						console.log(res);
					}
				})
				
			}
		}
	}
})

