$(function(){
	var vm = new Vue({
		el:'#contain',
		data:{
			tenementList:[]
		},
		methods:{
			setRenderTime:function(){
				var choosedStr = '';
				$('input:checkbox[name="choose"]:checked').each(function(){
					choosedStr=choosedStr + $(this).attr('_id')+ ',';
				})
				choosedStr = choosedStr.substring(0, choosedStr.length-1);
				if($('input:checkbox[name="choose"]:checked').length<=0){
					layer.msg('请选择需要删除的预租人员！');
				}else{
					$.ajax({
						url:'delPersonByTenementId',
						data:{
							choosedStr : choosedStr,
						},
						type:'POST',
						dataType:'JSON',
						success:function(res){
							if(res.success){
								$('input:checkbox[name="choose"]:checked').each(function(){
									$(this).removeAttr('checked');
								})
								getList($('.layui-laypage-curr').find('em').eq(1).text(),12);
								layer.msg(res.success);
							}
							
						},
						error:function(res){
							console.log(res);
						}
						
					})
				}
			}
		}
		
	})
	
	//分页功能
	var laypage,form;
	layui.use(['laypage','jquery','layer','upload','laydate','form'], function(){
		laypage = layui.laypage;
		var $ = layui.jquery;
		var upload = layui.upload;
		var laydate = layui.laydate;
		form = layui.form;
		
		laypage.render({
		  elem: 'tenantListPageChange',
		  count: personCount, //另一个方法传入总数
		  limit: 12,
		  theme:'#59d439',
		  jump: function(obj, first){
		    //obj包含了当前分页的所有参数，比如：
		    /*console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
		    /*console.log(obj.limit);*/ //得到每页显示的条数
			getList(obj.curr,obj.limit);
		  }
		});

	});
	function getList(curr,limit){
		var loading = layer.load(1, {shade: [0.2, '#87888a']});
		$.ajax({
			type : "POST",
			url :  window.path+"manage/getPersonByPage",
			data : {
				curr : curr,
				limit : limit
			},
			dataType:'JSON',
			success : function(res) {
				layer.close(loading);
				vm.tenementList = [];
				vm.tenementList = res.personArr ;
				setTimeout(function(){
					form.render();
				},50);					
			},
			error : function(data) {
				layer.close(loading);
				console.log("error:" + data.responseText);
			}
		});
	}
	
})