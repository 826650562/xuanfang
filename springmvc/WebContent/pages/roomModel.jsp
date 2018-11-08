<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>房间模型</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">    
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<link href="<%=basePath%>js/fontawesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
</head>
<body sytle="padding:0;margin:0">
  <div id="wrapper" sytle="padding:0;margin:0">
	<div class="leftback" id="roomBack" style="position: absolute;color: white;left: 40px;top: 40px;font-size: 40px;margin-right: 5px;z-index:10000;">
        <i class="fa fa-chevron-left" style="margin-right: 10px;font-size: 40px;"></i>返回
    </div>
  </div>
</body>
<script src="<%=basePath%>js/jquery-1.9.1.min.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath%>js/layui/layui.js"></script>
<script src="<%=basePath%>js/config.js"></script>
<script>
function GetRequest() {
   var url = location.search; //获取url中"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}

var roomInfo = GetRequest();
var roomURL = JHCXF.ThreeUrl+'?total=JHC-'+ roomInfo.roomInfoDetail +'&&show=1';
/* window.location.href = roomURL; */
if(roomURL != undefined && roomURL != null){
	$("#wrapper").append("<iframe src="+roomURL+" title='房间模型' width='100%' height='100%' sytle='padding:0;margin:0' id='iframeroom'></iframe>");
/* 	$("#iframeroom").append("<div class='leftback' id='roomBack' style='position: absolute;color: black;left: 15px;top: 15px;font-size: 12px;margin-right: 5px;z-index:10000;'><i class='fa fa-chevron-left' style='margin-right: 5px;'></i>返回</div>"); */
}
$("#roomBack").click(function(){
        history.go(-1);
})
</script>
</html>
