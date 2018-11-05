/**
 * roomDetail
 */
$(function(){
	layui.use('layer', function(){
 		var layer = layui.layer;
	});
	
	RoomInfor =RoomInfor.substring(1,RoomInfor.length-1);
	var RoomInforJson = $.parseJSON(RoomInfor);//房屋所属楼栋等信息
    var AreaInforJson = $.parseJSON(RoomAreaInfor);//房屋面积描述朝向等信息
    var statusJson;
    if(roomStatus){
    	statusJson = $.parseJSON(roomStatus);//房屋状态
    }
    
    //$('.topbarcenter').text(RoomInforJson.HOUSEHOLD+'房');//页面头部房屋名
    $('#roomType').text(RoomInforJson.HOUSETYPE);//房屋信息框户型
    $('#roomFloor span').text(Number(RoomInforJson.FLOOR));//楼层
    
    AreaInforJson.ROOMOUTSIDEAREA && $('#outsideArea span').text(Number(AreaInforJson.ROOMINSIDEAREA)*1.2); //房屋建筑面积
    AreaInforJson.ROOMINSIDEAREA && $('#insideArea span').text(AreaInforJson.ROOMINSIDEAREA); //房屋可用面积
    
    AreaInforJson.DESCRIPTION && $('.fwxxms').eq(0).text(AreaInforJson.DESCRIPTION); //房屋描述
    if(statusJson){
    	$('#roomStatus').text(statusJson.STATUS);
    	switch (statusJson.STATUS){
    		case "已被选":
    			$('#roomStatus span').addClass("colorYellow");
    			$('.bottombtnbox').css("display","none");
    			$('.bottombtnbox').attr("disabled",true);
    			/*$('.bottombtnbox span').text("该户已被选") */
    			break;
   			case "已出租":
	   			$('#roomStatus span').addClass("colorRed");
	   			$('.bottombtnbox').css("display","none");
	   			$('.bottombtnbox').attr("disabled",true);
    			/* $('.bottombtnbox span').text("该户已出租") */
	   			break;
	   		case "未出租":
	   			$('#roomStatus span').addClass("colorGray");
	   			break;
    	}
    }
    //选择该户按钮点击事件
    $('#chooseThisRoom').unbind().click(function(){
		layer.confirm('是否确认选择该户，选择后您只有三次退选机会，请谨慎选择！', {icon: 3, title:'提示'}, function(index){
		  window.location.href = window.Path+"chooseRoom/chooseRoomSuccess?build="+ RoomInforJson.BUILD +"&&household="+ RoomInforJson.HOUSEHOLD + "";
		  layer.close(index);
		}); 
    	
    });
    //返回按钮
    $('#back').unbind().click(function(){
    	window.location.href = window.Path+'chooseRoom/index';
    })
    
    //看模型参数设置
    var haoIndex = RoomInforJson.BUILD.indexOf('号');
    var build = RoomInforJson.BUILD.substring(0,haoIndex);
    var floor = RoomInforJson.HOUSEHOLD.substring(0,2);
    var room = RoomInforJson.HOUSEHOLD.substring(2);
    
    //$('#showModel').attr("src",JHCXF.ThreeUrl+"?total=JHC-"+ RoomInforJson.HOUSETYPE +"&&show=1");
    
    $('#3d a').attr("href",JHCXF.ThreeUrl+"?total=JHC-"+ RoomInforJson.HOUSETYPE +"&&show=1");

    
	$("#img").click(function() {
		$("#img").css("background-color", "#6eb92b");
		$("#img").css("color", "white");
		$("#quanjing").css("background-color", "white");
		$("#quanjing").css("color", "black");
		$("#3d").css("background-color", "white");
		$("#3d").css("color", "black");
	});
	$("#quanjing").click(function() {
		$("#quanjing").css("background-color", "#6eb92b");
		$("#quanjing").css("color", "white");
		$("#img").css("background-color", "white");
		$("#img").css("color", "black");
		$("#3d").css("background-color", "white");
		$("#3d").css("color", "black");
		;
	});
	$("#3d").click(function() {
		$("#3d").css("background-color", "#6eb92b");
		$("#3d").css("color", "white");
		$("#img").css("background-color", "white");
		$("#img").css("color", "black");
		$("#quanjing").css("background-color", "white");
		$("#quanjing").css("color", "black");
		;
	});
	
})
