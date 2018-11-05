/**
 * roomListForRental
 */

$(function(){
	layui.use(['laypage','jquery','layer','form','laydate'], function(){
		laypage = layui.laypage;
		var $ = layui.jquery;
		form = layui.form;
		var laydate = layui.laydate;
		
		laypage.render({
			elem:'rentalRoomPage',
			count: rentalRoomCount, //另一个方法传入总数
			limit: 15,
			theme:'#59d439',
			jump: function(obj, first){
				getRoomByPage(obj.limit,obj.curr);				
			}
		})
		
		
	})
	
	
	var vm = new Vue({
		el:'#contain',
		data:{
			roomList:[]
		},
		methods:{
			deleteRentalRoom:function(){
				var choosedStr = '';
				$('input:checkbox[name="choose"]:checked').each(function(){
					choosedStr=choosedStr + $(this).attr('_id')+ ',';
				})
				choosedStr = choosedStr.substring(0, choosedStr.length-1);
				$.ajax({
					url:'deleteRentalRoom',
					data:{
						choosedStr:choosedStr
					},
					type:'POST',
					dataType:'JSON',
					success:function(res){
						if(res.success){
							$('input:checkbox[name="choose"]:checked').each(function(){
								$(this).removeAttr('checked');
							})
							getRoomByPage(15,$('.layui-laypage-curr').find('em').eq(1).text());

							layer.msg(res.success);							
						}
					},
					error:function(res){
						console.log(res);
					}
				})
			}
		}
	})
	
	function getRoomByPage(limit,cur){
		$.ajax({
			url:'getRoomListForRentalByPage',
			data:{
				limit:limit,
				current:cur
			},
			dataType:'JSON',
			type:'POST',
			success:function(res){
				vm.roomList = [];
				vm.roomList = res.roomList;
				setTimeout(function(){
					form.render();
				},50);
			},
			error:function(res){
				console.log(res);
			}
		})
	}
	
	
})