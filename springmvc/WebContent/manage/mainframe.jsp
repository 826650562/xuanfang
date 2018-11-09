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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <title>选房系统</title>
    <script type="text/javascript" src="<%=basePath%>js/jquery-1.11.0.min.js"></script>
    <script>
        $(function () {
            function doLayout() {
                var scrWidth = window.screen.width;
                var scrHeight = window.screen.height;
                var top = 32;
                var width = document.documentElement.clientWidth;
                var height = document.documentElement.clientHeight - top;
                var step = width;

                adjustObj("scr1", 0, top, step, height);
                adjustObj("scr2", 0, top, step, height);
                if (width > 2000) {  //三屏
                    window.location = "twoScreen";
                } else {
                    showScreen('屏幕1', 'scr1');
                }

            }

            function adjustObj(objId, left, top, width, height) {
                var objFrame = document.getElementById(objId + "Frame");
                if (objFrame != null) {
                    var url = "";
                    if (objId.indexOf("1") >= 0) {
                        url = "manageIndex";
                    } else if (objId.indexOf("2") >= 0) {
                        url = "rightIndex";
                    }
                    objFrame.src = url;
                    objFrame.width = width;
                    objFrame.height = height;
                }
                $("#" + objId).css({
                    'left': left,
                    'top': top,
                    'width': width,
                    'height': height,
                    'display': "block"
                })
            }

            showScreen = function (title, screen) {
                if (screen == "scr1") {
                    showObj("scr1");
                } else {
                    hideObj("scr1");
                }
                if (screen == "scr2") {
                    showObj("scr2");
                } else {
                    hideObj("scr2");
                }
                var obj = document.getElementById("screen");
                obj.innerHTML = "<font color='red'>" + title + "</font>";
            }

            function showObj(objId) {
                $("#" + objId).show();
            }

            function hideObj(objId) {
                $("#" + objId).hide();
            }

            document.oncontextmenu = "window.event.returnvalue=false";
            doLayout();
        })
    </script>
</head>
<body style="overflow: hidden;padding:5px;margin:0px;">
&nbsp;&nbsp;&nbsp;<span style="font-size:12px;font-family:'微软雅黑';">当前显示屏幕：</span>
<span id=screen><font style="font-size:12px;font-family:'微软雅黑';color:red;">屏幕3</font></span>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:12px;font-family:'微软雅黑';">屏幕切换：</span>&nbsp;

<input onclick="showScreen('屏幕1','scr1')" value=屏幕1 type=button>&nbsp;
<input onclick="showScreen('屏幕2','scr2')" value=屏幕2 type=button>
<div style="position: absolute; width: 100%; display: none; height: 100%; top: 30px; left: 0px" id="scr1">
    <iframe id="scr1Frame" name="scr1Frame" height=100% src="" frameBorder=0 width=100% align=left></iframe>
</div>
<div style="position: absolute; width: 100%; display: none; height: 100%; top: 30px; left: 0px" id="scr2">
    <iframe id="scr2Frame" name ="scr2Frame" height=100% src="" frameBorder=0 width=100% align=left></iframe>
</div>
</body>
</html>