<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>选房系统</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <link rel="stylesheet" href="<%=basePath%>js/layui/css/layui.css" media="all">
  <link href="<%=basePath%>js/fontawesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="<%=basePath%>css/indexcss/admin.css" media="all">
  <link rel="stylesheet" href="<%=basePath%>css/indexcss/style.css" media="all">
  
  <script>
  ///^http(s*):\/\//.test(location.href) || alert('请先部署到 localhost 下再访问');
  </script>
</head>
<body class="layui-layout-body">
  
  <div id="LAY_app">
    <div class="layui-layout layui-layout-admin" id="myApp" v-cloak>
      <div class="layui-header">
        <!-- 头部区域 -->
        <ul class="layui-nav layui-layout-left">
          <li class="layui-nav-item layadmin-flexible" lay-unselect>
            <a href="javascript:;" layadmin-event="flexible" title="侧边伸缩">
              <i class="layui-icon layui-icon-shrink-right" id="LAY_app_flexible"></i>
            </a>
          </li>
        </ul>
        <ul class="layui-nav layui-layout-right padR15" lay-filter="layadmin-layout-right">
          <c:forEach var="loginContent"  items="${username}">
				<li class="layui-nav-item"><a href="javascript:;"> <img
						src="<%=basePath%>images/head.png" class="layui-nav-img">
						系统管理员<c:out value="${username}"/>
				</a>
					<dl class="layui-nav-child">
						<dd>
							<a href="<%=basePath%>chooselogin/loginout">退出登录</a>
						</dd>
					</dl></li>
			</c:forEach>
        </ul>
      </div>
      
      <!-- 侧边菜单 -->
      <div class="layui-side layui-side-menu">
        <div class="layui-side-scroll">
          <div class="layui-logo">
            <div class="z-row">
              <div class="logoimg"><img src="<%=basePath%>images/logo2.png"></div>
            </div>
          </div>
          <ul class="layui-nav layui-nav-tree" lay-shrink="all" id="LAY-system-side-menu" lay-filter="layadmin-system-side-menu">
            <li data-name="gdlb" class="layui-nav-item">
              <a href="javascript:;"  lay-tips="工单列表" lay-direction="2">
                <i class="fa fa-home fa-fw"></i>
                <cite>选房管理</cite>
              </a>
              <dl class="layui-nav-child">
                <dd data-name="console" class="layui-this"><a lay-href="applyList"  class="layui-nav-erjinav">房屋申请处理</a></dd>
              </dl>
              <dl class="layui-nav-child">
                <dd data-name="console"><a lay-href="chooseRoomPage"  class="layui-nav-erjinav">在线选房</a></dd>
              </dl>
              <dl class="layui-nav-child">
                <dd data-name="console"><a lay-href="showRoomStatus"  class="layui-nav-erjinav">房屋信息看板</a></dd>
              </dl>

            </li>
            <li data-name="gdlb" class="layui-nav-item">
              <a href="javascript:;">
                <i class="fa fa-bars fa-fw"></i>
                <cite>预租信息</cite>
              </a>
              <dl class="layui-nav-child">
                <dd  data-name="console"><a lay-href="tenantList"  class="layui-nav-erjinav">所有人员信息</a></dd>
              </dl>
              <dl class="layui-nav-child">
                <dd  data-name="console"><a lay-href="tenantForRentalList"  class="layui-nav-erjinav">预租人员信息</a></dd>
              </dl>
              <dl class="layui-nav-child">
                <dd data-name="console"><a lay-href="allRoomList"  class="layui-nav-erjinav">所有房屋信息</a></dd>
              </dl>
              <dl class="layui-nav-child">
                <dd data-name="console"><a lay-href="roomListForRental"  class="layui-nav-erjinav">预租房屋信息</a></dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>

      <!-- 页面标签 -->
      <div class="layadmin-pagetabs" id="LAY_app_tabs">
        <div class="layui-icon layadmin-tabs-control layui-icon-prev" layadmin-event="leftPage"></div>
        <div class="layui-icon layadmin-tabs-control layui-icon-next" layadmin-event="rightPage"></div>
        <!-- <div class="layui-icon layadmin-tabs-control layui-icon-next" layadmin-event="rightPage"></div> -->
        <div class="layui-icon layadmin-tabs-control layui-icon-down">
          <ul class="layui-nav layadmin-tabs-select" lay-filter="layadmin-pagetabs-nav">
            <li class="layui-nav-item" lay-unselect>
              <a href="javascript:;"></a>
              <dl class="layui-nav-child layui-anim-fadein">
                <dd layadmin-event="closeThisTabs"><a href="javascript:;">关闭当前标签页</a></dd>
                <dd layadmin-event="closeOtherTabs"><a href="javascript:;">关闭其它标签页</a></dd>
                <dd layadmin-event="closeAllTabs"><a href="javascript:;">关闭全部标签页</a></dd>
              </dl>
            </li>
          </ul>
        </div>
        <div class="layui-tab" lay-unauto lay-allowClose="true" lay-filter="layadmin-layout-tabs">
          <ul class="layui-tab-title" id="LAY_app_tabsheader">
            <li lay-id="console.html" class="layui-this"><i class="layui-icon layui-icon-home"></i></li>
          </ul>
        </div>
      </div>
      
      
      <!-- 主体内容 -->
      <div class="layui-body" id="LAY_app_body">
        <div class="layadmin-tabsbody-item layui-show">
          <iframe src="applyList" frameborder="0" class="layadmin-iframe" id="iframe01"></iframe>
      </div>
      </div>
      
      <!-- 辅助元素，一般用于移动设备下遮罩 -->
      <div class="layadmin-body-shade" layadmin-event="shade"></div>
    </div>
  </div>
  <script src="<%=basePath%>js/jquery-1.9.1.min.js" type="text/javascript"></script>
  	<script src="https://cdn.jsdelivr.net/npm/vue"></script>
  	  <script src="<%=basePath%>js/layui/layui.js"></script>
<%--   <script src="<%=basePath%>js/manageIndex.js"></script> --%>
  <script>
  	
  	window.path = "<%=basePath%>";
  </script>
  <script>
  layui.config({
    base: '<%=basePath%>' //静态资源所在路径
  }).extend({
    index: 'js/lib/index' //主入口模块
  }).use('index');
  </script>
</body>
</html>


