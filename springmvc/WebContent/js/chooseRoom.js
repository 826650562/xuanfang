/**
 * chooseRoom
 */
var buildNum = [];
$(function() {
	var layer;
	layui.use(['form','element','upload','laypage','jquery','layer'], function(){
        var form = layui.form;
        var element = layui.element;
        var $ = layui.jquery;
        var upload = layui.upload;
        layer = layui.layer;
        getRoomList(); //获取初始选择楼栋房屋列表
    });

	//字符串转json
	for (var i = 0; i < buildNumJsonArr.length; i++) {
		buildNumJsonArr[i] = $.parseJSON(buildNumJsonArr[i]);
		buildNum.push(Object.values(buildNumJsonArr[i])[0]);
	}
	//填充楼栋列表
	$('#buildListBox').html('');
	for (var j = 0; j < buildNum.length; j++) {
		$('#buildListBox').append('<button class="mui-btn mui-btn-outlined ldxzbtn">' + buildNum[j] + '</button>');
	}
	//默认选择楼栋列表第一个
	$('.ldxzbtn').eq(0).removeClass('mui-btn-outlined');
	$('.ldxzbtn').eq(0).addClass('mui-btn-success');
	$('#cicleBox').css({display:"block"});
	$('#xflistbox').find('.z-row').remove();
	

	//房屋按钮注册点击事件
	$('.ldxzbtn').unbind().click(function() {
		$('.ldxzbtn').removeClass('mui-btn-success');
		$(this).removeClass('mui-btn-outlined');
		$(this).addClass('mui-btn-success');
		$('#cicleBox').css({display:"block"});
		$('#xflistbox').find('.z-row').remove();
		getRoomList();
	})
	
	$('#toMine').unbind().click(function(){
		window.location.href = window.path+"chooseRoom/mine";
	})
	
	
	//获取楼栋户型列表
	function getRoomList() {
		$.ajax({
			url : 'buildRoomByList', //获取楼栋户型列表
			data : {
				loudong : $('.mui-btn-success').text(),
			},
			dataType : 'JSON',
			type : 'POST',
			success : function(res) {
				var roomArr = [];
				var floorArr = [];
				var roomIdArr = [];
				res.map(function(item) {
					var obj = {};
					var floor = 'F' + Number(item.FLOOR);
					var floorIndex = floorArr.indexOf(floor);
					var roomNum;
					if (floorIndex >= 0) {
						if (Number(item.HOUSEHOLD)) {
							roomNum = item.HOUSEHOLD.substring(2);								
							roomArr[Number(item.FLOOR)][floor][Number(roomNum)] = item.HOUSEHOLD;
							roomIdArr[Number(item.FLOOR)][Number(roomNum)] = item.ID;
						}
					} else {
						obj[floor] = [];
						idArr = [];
						if (Number(item.HOUSEHOLD)) {
							roomNum = item.HOUSEHOLD.substring(2);
							floorArr.push(floor);
							obj[floor][Number(roomNum)] = item.HOUSEHOLD;	
							idArr[Number(roomNum)]	= item.ID ;			
							roomArr[Number(item.FLOOR)] = obj;
							roomIdArr[Number(item.FLOOR)] = idArr;
						}
					}
				})				
				var floorRoomArr;
				$('#cicleBox').css({display:"none"});
				$('#xflistbox').find('.z-row').remove();
				for (var i = 0; i < roomArr.length; i++) {
					if (roomArr[i] !== "" && roomArr[i] != undefined) {
						floorRoomArr = Object.values(roomArr[i])[0];
						$('#xflistbox').append('<div class="z-row marB10">' +
							'<div class="xflistch" id="' + $('.mui-btn-success').text() + Object.keys(roomArr[i])[0] + '">' + Object.keys(roomArr[i])[0] + '</div>' +
							'<div class="z-col xflist floorRoomListBox"></div></div>');
						for (var j = 0; j < floorRoomArr.length; j++) {
							if(floorRoomArr[j]!== ""&&floorRoomArr[j]!= undefined){
								floorRoomArr[j].length == 4 && $('#' + $('.mui-btn-success').text() +
								Object.keys(roomArr[i])[0]).next('.floorRoomListBox').append('<div class="xflistitem mui-table-view-cell bgGray" id="' +
								floorRoomArr[j] + '" _id="' + roomIdArr[i][j] + '">' + floorRoomArr[j] + '</div>');
							}
						}
						var len = $('#' + $('.mui-btn-success').text() +Object.keys(roomArr[i])[0]).next('.floorRoomListBox').find('.xflistitem').length;
						if(len<4){
							for(var a=0;a<4-len;a++){
								$('#' + $('.mui-btn-success').text() +Object.keys(roomArr[i])[0]).next('.floorRoomListBox').append('<div class="xflistitem mui-table-view-cell"></div>');
							}
						}
					}
				}
				!getCookie('closeLayer') && layer.open({
					title: '温馨提示',
					btn:['不再显示','确定'],
					content: '<div>1.本次选房只能选与配租面积相等的户型。</div>'+
							'<div>2.每个租户只能意向选取一户，若想选取其他户，请到‘我的’的页面中退选之前选中的户，每个租户可以最多退选三次。</div>'+
							'<div>3.一旦被后台判定选中成功，户列表中会显示已出租，并等待签署出租合同。</div>',
					btn1:function(index){
						setCookie('closeLayer',true);
						layer.close(index);
					},
					btn2:function(index){
						layer.close(index);
					}
				});
				getRoomStatusList();
				roomListClick();
			},
			error : function(res) {
				console.log(res);
			}
		})
		function getRoomStatusList() {
			$.ajax({
				url : "roomStatusList",
				type : "POST",
				dataType : "JSON",
				success : function(res) {
					res.map(function(item) {
						if (item.STATUS == '已被选') {
							$('[_id=' + item.ROOMID + ']').removeClass('bgGray').addClass('bgQianYellow');
							$('[_id=' + item.ROOMID + ']').attr('disabled', true);
						} else if (item.STATUS == '已出租') {
							$('[_id=' + item.ROOMID + ']').removeClass('bgGray').addClass('bgQianRed');
							$('[_id=' + item.ROOMID + ']').attr('disabled', true);
						}
					})
				},
				error : function(res) {
					console.log(res);
				}
			})
		}
		//room列表注册点击事件
		function roomListClick() {
			$('.xflistitem').unbind().click(function() {
				if ($(this).hasClass('bgGray') && isDateBetween(startTime, endTime)) {
					window.location.href = window.path + "chooseRoom/roomDetail?build=" + $('.mui-btn-success').text() + 
					"&&household=" + $(this).text() + "";
				} else if ($(this).hasClass('bgQianRed')) {
					layer.msg('该户已出租');
				} else if($(this).hasClass('bgQianYellow')){
					layer.msg('该户已被选');
				}else if(!isDateBetween(startTime, endTime)){
					layer.msg('当前用户不在选房时段内!');
				}
			})
		}			
	}
	//存cookie
	function setCookie(name,value){
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + 10*60*1000);//Days*24*60*60*1000
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}
	
	//取cookie
	function getCookie(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
		else
		return null;
	}

	function isDateBetween(startDateString, endDateString){  
		var timestamp=new Date().getTime();//13位
		var startTime = new Date(startDateString).getTime();
		var endTime = new Date(endDateString).getTime();
		
	    var flag = false;  
	    if(startTime<timestamp< endTime){  
	        flag = true;  
	    }  
	    return flag;  
	};  
})