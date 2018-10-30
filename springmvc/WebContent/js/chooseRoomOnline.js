/**
 * 在线选房
 */
layui.use([ 'form', 'element', 'jquery' ], function() {
	var form = layui.form;
	var element = layui.element,
		$ = layui.jquery;
});
var vm = new Vue({
	el:'#bodyContent',
	data:{
		userInfo:[],
		buildingAll:[],
		roomArr:[],
		limitArea:'',
		tenementId:''
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
							vm.limitArea = res.userInfo.LIMITAREA;
							vm.tenementId = res.userInfo.ID;
							vm.userInfo = [res.userInfo];
							vm.buildingAll = res.buildingArray;
							vm.roomArr = tidyRoom(res.roomArr);
							setTimeout(function(){vm.mapRoomStatus(res.rentalArray)},50);
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
		},
		searchRoom:function(build){
			var loading = layer.load(1, {shade: [0.2, '#87888a']});
			$('.ldxzbtn').removeClass('layui-btn-danger');
			$(event.target).addClass('layui-btn-danger');
			$.ajax({
				url:'getRoomByBuild',
				data:{
					build:build,
					area:vm.limitArea
				},
				type:'POST',
				dataType:'JSON',
				success:function(res){					
					if(res.roomArr){
						vm.roomArr = [];
						vm.roomArr = tidyRoom(res.roomArr);
						setTimeout(function(){vm.mapRoomStatus(res.rentalArray)},50);
					}
					layer.close(loading);
				},
				error:function(res){
					layer.close(loading);
					console.log(res);
				}
			})
		},
		chooseThis:function(roomId){
			var build;
			$('.ldxzbtn').each(function(){
				if($(this).hasClass('layui-btn-danger')){
					build = $(this).text();
				}
			})
			if($(event.target).hasClass('bgQianRed')){
				layer.msg('该户已出租');
			}else if($(event.target).hasClass('bgQianYellow')){
				layer.msg('该户已被选');
			}else{
				layer.confirm('是否选择该户？', {
					  btn: ['确定','取消'] //按钮
				}, function(index){				
					layer.close(index);
					$.ajax({
						url:'chooseRoom',
						data:{
							roomId:roomId,
							tenementId:vm.tenementId,
							build:build
						},
						type:'POST',
						dataType:'JSON',
						success:function(res){
							if(res.success){
								layer.msg(res.success);
								setTimeout(function(){vm.mapRoomStatus(res.rentalArray)},10);
							}else if(res.error){
								layer.msg(res.error);
							}
						},
						error:function(res){
							console.log(res);
						}
					})
				}, function(index){
					layer.close(index);
				});
			}
			
		},
		mapRoomStatus:function(arr){
			$('.xflistitem').removeClass('bgQianRed').removeClass('bgQianYellow').addClass('bgGray2');
			arr.map(function(item){
				if(item.STATUS=="已出租"){
					$('.xflistitem[rid="'+ item.ROOMID +'"]').removeClass('bgGray2').addClass('bgQianRed');
				}else if(item.STATUS=="已被选"){
					$('.xflistitem[rid="'+ item.ROOMID +'"]').removeClass('bgGray2').addClass('bgQianYellow');
				}
			})
		}
	}
})

function tidyRoom(arr){
	var roomArr = [];
	var floorArr = [];
	var roomIdArr = [];
	arr.map(function(item) {
		var obj = {};
		var floor = 'F' + Number(item.FLOOR);
		var floorIndex = floorArr.indexOf(floor);
		var roomNum;
		var roomObj = {}
		if (floorIndex >= 0) {
			if (Number(item.HOUSEHOLD)) {
				roomNum = item.HOUSEHOLD.substring(2);		
				roomObj.houseType = item.HOUSEHOLD;
				roomObj.id = item.ID;
				roomArr[Number(item.FLOOR)][floor][Number(roomNum)] = roomObj;
			}
		} else {
			obj[floor] = [];		
			if (Number(item.HOUSEHOLD)) {
				roomNum = item.HOUSEHOLD.substring(2);
				floorArr.push(floor);
				roomObj.houseType = item.HOUSEHOLD;
				roomObj.id = item.ID;
				obj[floor][Number(roomNum)] = roomObj;			
				roomArr[Number(item.FLOOR)] = obj;
			}
		}
	})	
	for(var i = 0 ;i<roomArr.length;i++){
        if(roomArr[i] == "" || typeof(roomArr[i]) == "undefined"){
        	roomArr.splice(i,1);
        	i = i - 1;
        }else{
        	arr = Object.values(roomArr[i])[0];
        	for(var j=0;j<arr.length;j++){
        		 if(arr[j] == "" || typeof(arr[j]) == "undefined"){
        			 arr.splice(j,1);
        			 j=j-1;
        		 }
        	}
        }
	}
	return roomArr;
}

