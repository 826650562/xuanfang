/**
 * allRoomList.js
 */
//分页功能
$(function(){
	var laypage,form;
	
	layui.use(['laypage','jquery','layer','form','laydate'], function(){
		laypage = layui.laypage;
		var $ = layui.jquery;
		form = layui.form;
		var laydate = layui.laydate;
		
		vm.getAllRoom();
		laydate.render({
			elem:'#dateStart',
			type: 'datetime',
			format:'yyyy-MM-dd HH:mm:ss',
			trigger: 'click',
			value: new Date(),
			showBottom: true,
			isInitValue: true 
		})
		laydate.render({
			elem:'#dateEnd',
			type: 'datetime',
			format:'yyyy-MM-dd HH:mm:ss',
			trigger: 'click',
			value: new Date(),
			showBottom: true,
			isInitValue: true 
		})
		
	})
	var vm = new Vue({
		el:'#contain',
		data:{
			roomList:[],
			buildArr:buildArr
		},
		methods:{
			insertToTem:function(){
				var choosedStr = '';
				$('input:checkbox[name="choose"]:checked').each(function(){
					choosedStr=choosedStr + $(this).attr('_id')+ ',';
				})
				choosedStr = choosedStr.substring(0, choosedStr.length-1);
				if(compareTime($('#dateStart').text(),$('#dateEnd').text()) && $('input:checkbox[name="choose"]:checked').length>0){
					$.ajax({
						url:'insertIntoTable',
						data:{
							choosedStr : choosedStr,
							starttime:$('#dateStart').text(),
							endtime:$('#dateEnd').text()
						},
						type:'POST',
						dataType:'JSON',
						success:function(res){
							if(res.success){
								$('input:checkbox[name="choose"]:checked').each(function(){
									$(this).removeAttr('checked');
								})
								getRoomByPage(15,$('.layui-laypage-curr').find('em').eq(1).text(),'getRoomListByPage');

								layer.msg(res.success);
							}
							
						},
						error:function(res){
							console.log(res);
						}
						
					})
				}else if($('input:checkbox[name="choose"]:checked').length<=0){
					layer.msg('请选择需要添加的预租房！');
				}				
			},
			serachByBuild:function(build){
				$('.buildBtn').removeClass('layui-btn-warm').addClass('layui-btn-primary');
				$(event.target).removeClass('layui-btn-primary').addClass('layui-btn-warm');
				if(build){
					this.getBuildRoomCount(build);
				}else{
					this.getAllRoom();
				}
				
			},
			getBuildRoomCount:function(build){
				var count = 0;
				$.ajax({
					url:'getRoomCountByBuild',
					data:{
						build:build
					},
					dataType:'JSON',
					type:'POST',
					success:function(res){
						count = res.count;
						laypage.render({
							elem:'pageChange',
							count: count, //另一个方法传入总数
							limit: 15,
							theme:'#59d439',
							jump: function(obj, first){
								getRoomByPage(obj.limit,obj.curr,'getRoomListByPage',build);				
							}
						})
					},
					error:function(res){
						console.log(res);
					}
				});
			},
			getAllRoom:function(){
				laypage.render({
					elem:'pageChange',
					count: roomCount, //另一个方法传入总数
					limit: 15,
					theme:'#59d439',
					jump: function(obj, first){
						getRoomByPage(obj.limit,obj.curr,'getRoomListByPage');				
					}
				})
			}
		}
	})
	
	function getRoomByPage(limit,cur,url,build){
		$.ajax({
			url:url,
			data:{
				limit:limit,
				cur:cur,
				build:build
			},
			dataType:'JSON',
			type:'POST',
			success:function(res){
				vm.roomList = [];
				vm.roomList = res.roomArr;
				setTimeout(function(){
					form.render();
				},50);
			},
			error:function(res){
				console.log(res);
			}
		})
	}
	
	//判断日期，时间大小  
	function compareTime(startDate, endDate) {   
	 if (startDate.length > 0 && endDate.length > 0) {   
	    var startDateTemp = startDate.split(" ");   
	    var endDateTemp = endDate.split(" ");   

	    var arrStartDate = startDateTemp[0].split("-");   
	    var arrEndDate = endDateTemp[0].split("-");   

	    var arrStartTime = startDateTemp[1].split(":");   
	    var arrEndTime = endDateTemp[1].split(":");   

		var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);   
		var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);   
	
		if (allStartDate.getTime() >= allEndDate.getTime()) {   
		        layer.msg("开始时间不能大于结束时间");   
		        return false;   
		} else {   
		    return true;   
		       }   
	} else {   
 
		return false;   
		  }   
	}   
})
