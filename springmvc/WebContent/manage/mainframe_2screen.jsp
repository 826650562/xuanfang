<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
<head>
	   <meta charset="utf-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <title>选房系统</title>
    <script type="text/javascript" src="<%=basePath%>js/jquery-1.11.0.min.js"></script>
    <script language=javascript>
        $(function () {
            function doLayout() {
                var scrWidth = window.screen.width;
                var scrHeight = window.screen.height;
                var width = document.documentElement.clientWidth;
                var height = document.documentElement.clientHeight;
                var step = parseInt(width * 1.0 / 2);
                if (width < 2000) {  //三屏
                    window.location = "indexScreen";
                } else {
                    adjustObj("scr1", 0, 0, step, height);
                    adjustObj("scr2", step, 0, step, height);
                }
            }

            function adjustObj(objId, left, top, width, height) {
                var objFrame = document.getElementById(objId + "Frame");
                if (objFrame != null) {
                    objFrame.width = width;
                    objFrame.height = height;
                    var url = "";
                  if (objId.indexOf("1") >= 0) {
                        url = "manageIndex";
                    } else if (objId.indexOf("2") >= 0) {
                        url = "rightIndex";
                    }
                    objFrame.src = url;
                }
                $("#" + objId).css({
                    'left': left,
                    'top': top,
                    'width': width,
                    'height': height,
                    'display': "block"
                })
            }

            document.oncontextmenu = "window.event.returnvalue=false";
            doLayout();
        })
    </script>

<body>
<div id="scr1" style="position:absolute;display:none;">
    <iframe id="scr1Frame"  name="scr1Frame" frameBorder="0" scrolling="auto" src="" align="left"></iframe>
</div>
<div id="scr2" style="position:absolute;display:none;">
    <iframe id="scr2Frame"  name="scr2Frame" frameBorder="0" scrolling="auto" src="" align="left"></iframe>
</div>
</body>
</html>











