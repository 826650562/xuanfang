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
		roomArr:[]
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
							vm.buildingAll = res.buildingArray;
							vm.roomArr = tidyRoom(res.roomArr);
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

