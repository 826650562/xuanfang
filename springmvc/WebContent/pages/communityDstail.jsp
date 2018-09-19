<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>选房系统</title>
<!--<link rel="icon" href="images/ico.png" type="image/x-icon">-->
<!--<link href="layui/css/layui.css" rel="stylesheet" type="text/css">-->
<link href="<%=basePath%>js/fontawesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
<link href="<%=basePath%>js/mui-master/examples/hello-mui/css/mui.min.css" rel="stylesheet" type="text/css">
<link href="<%=basePath%>css/z-layout.css" rel="stylesheet" type="text/css">
<link href="<%=basePath%>css/style.css" rel="stylesheet" type="text/css">
<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->   
    <style type="text/css">
      html,body{ height:100%; position:relative;}
	  .mui-table-view-cell{padding:0px;}
	  .mui-table-view-cell:after{ background:none;}
    </style>
</head>
<body>
<div class="mui-content">

<div class="topbar">
     <div class="z-row">
        <div class="topbarleft" onclick="javascript:history.back(-1);"><i class="fa fa-chevron-left fa-fw"></i>返回</div>
        <div class="z-col topbarcenter">小区详情</div>
        <div class="topbarright"></div>
     </div>
  </div>

<div class="itemcont marT10">
  <div class="z-row tytitle">
    <div><i class="fa fa-sticky-note-o fa-fw"></i>&nbsp;</div>
    <div class="z-col">小区配套</div>
  </div>
  <div class="z-row">
    <div class="z-col xqxfitemtxt">
  小区南侧配套幼儿园以及一所包括小学和初中的九年制学校。公租房区域同样配套了幼儿园、养老设施和商业设施。
    </div>
  </div>
</div>

<div class="itemcont">
  <div class="z-row tytitle">
    <div><i class="fa fa-sticky-note-o fa-fw"></i>&nbsp;</div>
    <div class="z-col">小区特色</div>
  </div>
  <div class="z-row">
    <div class="z-col xqxfitemtxt">
     焦化厂公租房项目是首个将超低能耗技术与高层装配式结构相结合的住宅建筑，在设计过程中遇到了诸多困难，通过各方的努力提出了解决方案。解决问题的过程中不断促进装配式技术与超低能耗技术的发展，从而为国内超低能耗绿色建筑的发展提供借鉴。
    </div>
  </div>
</div>

<div class="itemcont">
  <div class="z-row tytitle">
    <div><i class="fa fa-sticky-note-o fa-fw"></i>&nbsp;</div>
    <div class="z-col">小区位置</div>
  </div>
  <div class="z-row">
    <div class="z-col xqxfitemtxt">
     保障房项目位于朝阳区垡头地区原北京焦化厂厂区内，用地西至焦化厂西路、南至焦化厂二街、东至焦化厂西一路、北至原焦化厂厂区边界，项目临近东南五环，紧邻地铁7号线焦化厂站，周边交通方便.
    </div>
  </div>
</div>

<div class="itemcont">
  <div class="z-row tytitle">
    <div><i class="fa fa-sticky-note-o fa-fw"></i>&nbsp;</div>
    <div class="z-col">安心小区</div>
  </div>
  <div class="z-row">
    <div class="z-col xqxfitemtxt">
     为使百姓安心入住焦化厂保障房项目，4年来保障房中心严格按照市环境保护科学研究院编制的《原北京焦化厂政府储备土地剩余用地污染治理修复技术方案》进行环境整治工作。由北京市保障房中心委托中科院中科鼎实成立联合体，采用国内最先进的热解吸技术，对焦化厂污染土进行了彻底的治理修复。通过给“污染土”高温“桑拿”，将有害化学物进行彻底分解和对治理过程中污染气体的过滤吸附，实现了对污染土“洁净化”处理。
污染治理过程中，全程进行了“有组织”检测和“无组织”检测，同时通过全程安全监控、全程多点检测、全程透明公开等形式，接受周边居民和社会媒体监督，保证了污染土治理高质量完成。
    </div>
  </div>
</div>



</div>
</body>
</html>
