<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    <%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <link rel="icon" href="<%=basePath %>BIM/images/ico.png" type="image/x-icon">
    <title>工单系统</title>
    <link rel="stylesheet" href="<%=basePath %>BIM/js/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="<%=basePath %>BIM/js/layui/css/layui.css">
    <link rel="stylesheet" href="<%=basePath %>BIM/js/layui/css/modules/layer/default/layer.css">
    <link href="<%=basePath %>BIM/js/fontawesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="<%=basePath %>BIM/css/z-layout.css" rel="stylesheet" type="text/css">

    <link rel="stylesheet" href="<%=basePath %>BIM/css/jquery-ui.min.css">
    <link href="<%=basePath %>BIM/css/style.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="<%=basePath %>BIM/css/css/style.min.css">

    <script>
        window.Path='<%=basePath %>';
    </script>
	<script src="<%=basePath %>BIM/js/layui/layui.js"></script>
    <script src="<%=basePath %>BIM/js/viewer3D.js"></script>
     <script src="<%=basePath %>BIM/js/jquery-1.9.1.min.js"></script>
    <script src="<%=basePath %>BIM/js/jquery-ui.js"></script>
    <!--加载配置文件-->
    <script src="<%=basePath %>BIM/js/config.js"></script>
    <script src="<%=basePath %>BIM/js/main.js"></script>
    <!--这里放插件的地方-->
    <script src="<%=basePath %>BIM/js/extensions/common.js"></script>
    <script src="<%=basePath %>BIM/js/extensions/buildComponentMesh.js"></script>
    <script src="<%=basePath %>BIM/js/extensions/infowindow.js"></script>
    <!--楼栋、楼层、房间-->
    <script src="<%=basePath %>BIM/js/extensions/ObjectTree.js"></script>
    <!--右侧工具栏-->
    <script src="<%=basePath %>BIM/js/extensions/tools.js"></script>
    <!--右侧菜单-->
    <script src="<%=basePath %>BIM/js/extensions/Autodesk.ADN.Viewing.Extension.ContextMenu.js"></script>
    <!--首页模型统计-->
    <script src="<%=basePath %>BIM/js/extensions/ModelStatistics.js"></script>
    <!--查看地下一层设施设备的数据-->
    <script src="<%=basePath %>BIM/js/extensions/BasementStatistics.js"></script>
    <!--引入电梯模型系统--!>
    <script src="<%=basePath %>BIM/js/extensions/liftstatistics.js"></script>

    <!-- 载入echart-->
    <script src="<%=basePath %>BIM/js/echarts.js"></script>
    <script src="<%=basePath %>BIM/js/snap.svg-min.js"></script>


    <script src="<%=basePath %>BIM/js/extensions/cgqInfor/line.js"></script>
    <script src="<%=basePath %>BIM/js/extensions/cgqInfor/cgqInfor.js"></script>
    <script src="<%=basePath %>BIM/js/extensions/electrome.js"></script>
    <script src="<%=basePath %>BIM/js/extensions/blSearch.js"></script>
    <script src="<%=basePath %>BIM/js/extensions/markup3d.js"></script>

<%--
    <script src="<%=basePath %>js/extensions/markup3d.js"></script>
--%>

    <%--test animation--%>
    <script src="<%=basePath %>BIM/js/extensions/liftanimation.js"></script>

 <%--   <script type="text/javascript" src="<%=basePath %>js/extensions/dragslot.js"></script>--%>

    <style>
        html,body{height:100%; position:relative; overflow:hidden;}
        .layui-tab-bar, .layui-tab-card, .layui-tab-title, .layui-tab-title .layui-this:after {border: none;}
        .layui-tab-title{width:100px; float:left; height:auto; padding-top:0px;}
        .layui-tab-card>.layui-tab-title li{float:left;}
        .layui-tab-content{width:160px; float:left; height: 450px !important; border-radius:3px; overflow-y: scroll; overflow-x:hidden;scrollbar-base-color: #000;
            scrollbar-base-color: #000;
            scrollbar-3dlight-color: #000;
            scrollbar-highlight-color: #000;
            scrollbar-track-color: #002430;
            scrollbar-arrow-color: #002430;
            scrollbar-shadow-color: #000;
            scrollbar-dark-shadow-color: #000;}
        .layui-tab-title li{padding:0 0}
        .layui-tab-card>.layui-tab-title{ background:none;}
        .layui-tab-card>.layui-tab-title .layui-this{background:url(<%=basePath %>BIM/images/blackbg.png) repeat; color:#fff;}
        .layui-tab-card{float:left;}
        .layui-tab{margin:0px;}
        .layui-tab-card{ box-shadow:none;}
        .layui-tab-title li{min-width: 88px; background:url(<%=basePath %>BIM/images/blackbg.png) repeat; margin-bottom:10px; color:#fff; border-top-left-radius:3px;border-bottom-left-radius:3px;}

    </style>
</head>
<body oncontextmenu="return false;">
<!--网页遮罩式进度条-->
<div class="progress-container" id="progress-container">
    <div id="progress-text">
        <p id="text01">正在努力加载，请耐心等待...</p>
        <div class="progress">
            <div class="progress-bar progress-bar-info progress-bar-striped active" id="progress-bar" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 0">
            </div>
        </div>
        <p id="progress-text01">0%</p>
    </div>
</div>
<!--网页顶部进度条-->
<div id="progress001"></div>
<%--<div class="logo"><img src="<%=basePath %>BIM/images/logo.png" width="500" height="70"></div>  不要logo--%>
<div class="toprightbox">
    <div class="row">
        <div class="col-lg-6"><button id="xtrkbtn" class="layui-btn xtrkbtn"><i class="fa fa-navicon fa-fw"></i></button></div>
    </div>
</div>
<div class="indexleftbox">
    <!--<div class="leftopenclose"><i class="fa fa-caret-left fa-fw"></i></div>-->
    <div class="layui-tab layui-tab-card">
        <ul class="layui-tab-title">
            <!--<li><div class="loudongxtb ld" id="ld"></div></li>-->
            <li id="ld"><div class="fa fa-building rhover">楼栋</div><span class="arrow01"></span></li>
            <li id="lc"><div class="fa fa-microchip rhover">楼层</div><span class="arrow01"></span></li>
            <li id="fj"><div class="fa fa-institution rhover">房间</div><span class="arrow01"></span></li>
            <li id="dt"><div class="fa fa-arrow-circle-up rhover">电梯</div><span class="arrow01"></span></li>
            <li id="xt"><div class="fa fa-cog rhover">系统</div><span class="arrow01"></span></li>
            <li id="ls"><div class="fa fa-calculator rhover">量算</div><span class="arrow01"></span></li>
            <li id="gc"><div class="fa fa-search-plus rhover">观察</div><span class="arrow01"></span></li>
        </ul>
    </div>
</div>

<div id="loudongbox"  class="loudongbox">
    <div class="tclciputbox"><input id="ldInput" type="text" name="title" lay-verify="title" autocomplete="off" class="layui-input tclciputtxt" placeholder="格式：楼层号#"></div>
    <div class="tclccont">
        <div class="tclcinnercont">
        </div>
    </div>
    <div class="lcgo">
        <button class="layui-btn layui-btn-warm lcgobtn" id="goLd">前往该楼栋</button>
    </div>
    <span class="iSpan"><i class="fa fa-remove fa-lg"></i></span>
</div>

<div id="loucentbox" class="tclcbox">
    <div class="tclciputbox"><input id="lcInput" type="text" name="title" lay-verify="title" autocomplete="off" class="layui-input tclciputtxt"></div>
    <div class="tclccont">
        <div class="tclcinnercont" id="tclcinnercont">

        </div>
    </div>
    <div class="lcgo">
        <button class="layui-btn layui-btn-warm lcgobtn" id="goLc">前往该楼层</button>
    </div>
    <span class="iSpan"><i class="fa fa-remove fa-lg"></i></span>
</div>

<div id="fangjianbox" class="tcfjbox">
    <div class="tcfjinnercont" id="tcfjinnercont">

    </div>
    <span class="iSpan"><i class="fa fa-remove fa-lg"></i></span>
</div>

<%--lx 电梯模型入口 test--%>

<div id="liftbox" class="tcfjbox">
    <div class="tcfjinnercont" id="elevatorbox">
        <span class="liftnum" _id="15">15号楼电梯<i class="liftsxt"><img src="<%=basePath %>BIM/images/sxt-3.png"></i></span>
        <span class="liftnum" _id="17">17号楼电梯<i class="liftsxt"><img src="<%=basePath %>BIM/images/sxt-3.png"></i></span>
        <span class="liftnum" _id="21">21号楼电梯<i class="liftsxt"><img src="<%=basePath %>BIM/images/sxt-3.png"></i></span>
        <span class="liftnum" _id="22">22号楼电梯<i class="liftsxt"><img src="<%=basePath %>BIM/images/sxt-3.png"></i></span>
    </div>
    <span class="iSpan"><i class="fa fa-remove fa-lg"></i></span>
</div>

<div id="xitongbox" class="tcxtbox">
    <div class="tcxtinnercont">
        <label class="xtTitle" id="xtTitle">15号楼的机电模型</label>
        <input type="text" name="title"  title="观察..." placeholder="观察..." class="searchArea-input" onclick="$(this).attr('placeholder','');"><button class="searchArea-btn">搜索</button>
        <%--<div class="circle"></div>--%>
        <form class="layui-form" action="">

            <div class="circle"></div>
           <%-- wxl  注释掉 <div class="switchitem">
                <div class="kglable">给水与排水</div><div class="kgNote" title="标注">无标注</div><div class="kgbtn"><input type="checkbox" name="close" lay-skin="switch" lay-text="开|关"><div class="layui-unselect layui-form-switch layui-form-onswitch" lay-skin="_switch"><em>开</em><i></i></div></div><i class="layui-icon layui-icon-edit"></i>
            </div>
            <div class="switchitem">
                <div class="kglable">弱电</div><div class="kgNote" title="标注">无标注</div><div class="kgbtn"><input type="checkbox" name="close" lay-skin="switch" lay-text="开|关"><div class="layui-unselect layui-form-switch layui-form-onswitch" lay-skin="_switch"><em>开</em><i></i></div></div><i class="layui-icon layui-icon-edit"></i>
            </div>--%>

        </form>
    </div>
    <span class="iSpan"><i class="fa fa-remove fa-lg"></i></span>
</div>

<div class="indexrightbox">
    <div class="gnanniu fristperson">
        <span><i class="fa fa-male fa-lg"></i></span>
        <!--<span><i class="fa fa-hand-grab-o fa-lg"></i></span>-->
        <div class="gnanniu-title ">第一人称视角</div>
    </div>
    <div class="gnanniu" id="clearBox">
        <span><i class="fa fa-remove fa-lg"></i></span>
        <div class="gnanniu-title">关闭及清除</div>
    </div>
    <div class="gnanniu">
        <span><i class="fa fa-scissors fa-lg"></i></span>
        <div class="gnanniu-title">截图导出图片</div>
    </div>
    <div class="gnanniu" id="qjBox">
        <span><i class="fa fa-eercast fa-lg"></i></span>
        <div class="gnanniu-title">回到原始位置</div>
    </div>
    <div class="gnanniu">
        <span id="show-sensor"><i class="fa fa-gg fa-lg"></i></span>
        <div class="gnanniu-title">查看传感器</div>
    </div>
</div>


<div class="indexbottombox">
    <div class="bottomopenclose"><i id="upDown" class="fa fa-caret-down fa-fw"></i></div>
    <div class="row">
        <div class="col-lg-2">
            <div class="bottomleftinfo">
                <div class="row">
                    <div class="col-lg-12 louhao marB25">楼栋未选中</div>
                    <div class="col-lg-12">
                        <div class="row tqsj">
                            <div class="col-lg-12" id="date01">----年--月--日</div>
                            <div class="col-lg-12" id="time01">--:--:--</div>
                            <div class="col-lg-12" id="week01">星期-</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-10">
            <div class="bottomrightinfo">
                <div class="layui-carousel" id="test1" lay-filter="test1">
                    <div carousel-item="">
                        <!------------>
                        <div>
                            <div class="row">

                          <div class="col-lg-4 padLR25">
                                    <div class="row">
                                        <div class="col-lg-12 tjttitle" id="title1">楼栋楼层数统计</div>
                                        <div class="col-lg-12 tjtitem" id="powerConsumption">

                                        </div>
                                    </div>
                                </div>


                                <div class="col-lg-4 padLR25">
                                    <div class="row">
                                        <div class="col-lg-12 tjttitle" id="title2">楼栋房间数统计</div>
                                        <div class="col-lg-12 tjtitem" id="powerConsumption01">

                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-4 padLR25">
                                    <div class="row">
                                        <div class="col-lg-12 tjttitle" id="title3">楼栋住房面积数统计</div>
                                        <div class="col-lg-12 tjtitem" id="powerConsumption02">

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>

    </div>
</div>


<div class="container-fluid moxing"><!--三维模型容器-->
    <!--<img src="images/bg.jpg" width="1920" height="1080"> -->
    <div id="viewer-local"></div>
</div>



<script type="text/javascript">
    layui.use(['element','carousel', 'form','layer'], function(){
        //弹出层
        var carousel = layui.carousel
                ,form = layui.form
                ,$ = layui.jquery
                ,layer = layui.layer;

        $("#xtrkbtn").click(function(){
            $("#search_label").css({"display":"none"});
            layer.closeAll();
            layer.open({
                type: 1,
                offset: '200px',
                shade: false,
                title: false,
                area: ['600px', '300px'],
                content:'<div class="row padT30">'
                +'<div class="col-lg-3 xtrkitem"><a href="#"><div class="row"><div class="col-lg-12"><img src="<%=basePath %>BIM/images/xtrkxtb1.png"></div><div class="col-lg-12 padT10">房屋信息</div></div></a></div>'
                +'<div class="col-lg-3 xtrkitem"><a href="#"><div class="row"><div class="col-lg-12"><img src="<%=basePath %>BIM/images/xtrkxtb2.png"></div><div class="col-lg-12 padT10">三维信息</div></div></a></div>'
                +'<div class="col-lg-3 xtrkitem"><a href="#"><div class="row"><div class="col-lg-12"><img src="<%=basePath %>BIM/images/xtrkxtb3.png"></div><div class="col-lg-12 padT10">决策分析</div></div></a></div>'
                +'<div class="col-lg-3 xtrkitem"><a href="#"><div class="row"><div class="col-lg-12"><img src="<%=basePath %>BIM/images/xtrkxtb4.png"></div><div class="col-lg-12 padT10">应急处置</div></div></a></div>'
                +'<div class="col-lg-3 xtrkitem"><a href="#"><div class="row"><div class="col-lg-12"><img src="<%=basePath %>BIM/images/xtrkxtb5.png"></div><div class="col-lg-12 padT10">智能接入</div></div></a></div>'
                +'<div class="col-lg-3 xtrkitem"><a href="#"><div class="row"><div class="col-lg-12"><img src="<%=basePath %>BIM/images/xtrkxtb6.png"></div><div class="col-lg-12 padT10">运维保障</div></div></a></div>'
                +'<div class="col-lg-3 xtrkitem"><a href="#"><div class="row"><div class="col-lg-12"><img src="<%=basePath %>BIM/images/xtrkxtb7.png"></div><div class="col-lg-12 padT10">综合办公OA</div></div></a></div>'
                    +'<div class="col-lg-3 xtrkitem"><a href="#" id="basementStatistics"><div class="row"><div class="col-lg-12"><img src="<%=basePath %>BIM/images/xtrkxtb7.png"></div><div class="col-lg-12 padT10">设施设备</div></div></a></div>'
                +'<div class="col-lg-3 xtrkitem"><a  id="blSearch" href="#"><div class="row"><div class="col-lg-12"><img src="<%=basePath %>BIM/images/xtrkxtb7.png"></div><div class="col-lg-12 padT10">搜索</div></div></a></div>'
                +'</div>',
            });
            parent.$('#blSearch').unbind().click(function(){
                var left = (document.body.clientWidth-$("#search_label").width())/2;
                $("#search_label").css({'left':left+'px'});
                $("#search_label").css({"display":"block"});
                layer.closeAll();
            });
            //地下室设施设备信息
            parent.$('#basementStatistics').unbind().click(function(){

                if($("#ldInput").attr("model_id")==undefined||$("#ldInput").attr("model_id")=="" ||$("#ldInput").attr("model_id")!="地下室"){
                    layer.closeAll();
                    layer.msg("请选择地下室楼栋");
                }else {
                    $("#baseInfo").css({'right':300+'px'});
                    $("#baseInfo").css({'top':180+'px'});
                    $("#baseInfo").css({"display":"block"});
                    window.dispatchEvent(new CustomEvent('basedata'));
                    layer.closeAll();
                }
            });

        });
        //点击楼栋
        $("#ld").click(function(){
            disBox('#loucentbox','#fangjianbox','#xitongbox','#elevatorbox');
            $("#loudongbox").animate({
                height: 'toggle',
                opacity: 'toggle'
            },500);
            window.dispatchEvent(new CustomEvent('clearCut',{detail:true}));
        });
        $("#xt").click(function(){
            if(!$('#ldInput').attr('model_id')){
                layer.closeAll();
                layer.msg("请选择楼栋");
            }else{
                disBox('#loucentbox','#loudongbox','#fangjianbox','#elevatorbox');
                $('#xtTitle').text($('#ldInput').val()+'的机电系统');
                $("#xitongbox").animate({
                    height: 'toggle',
                    opacity: 'toggle'
                },500);
            }
        });
        $(".iSpan").click(function(){
            $(this).parent('div').css({'display':'none'});
        });
        //点击楼层
        $("#lc").click(function(){
            if($("#ldInput").attr("model_id")==undefined||$("#ldInput").attr("model_id")==""){
                layer.closeAll();
                layer.msg("请选择楼栋");
            }else{
                disBox('#loudongbox','#fangjianbox','#xitongbox','#elevatorbox');
                $("#loucentbox").animate({
                    height: 'toggle',
                    opacity: 'toggle'
                },500)
            }
            window.dispatchEvent(new CustomEvent('clearCut',{detail:true}));
        });
        //点击房间
        $("#fj").click(function(){
            if($("#lcInput").attr("lc_id")==undefined){
                layer.closeAll();
                layer.msg("请选择楼层");
            }else if($("#tcfjinnercont").find(".tcfjnum").length==0||$("#lcInput").attr("lc_id")==""||$("#lcInput").val()=="ALL"){
                layer.closeAll();
                layer.msg("当前选择楼层没有房间数据");
            }else{
                disBox('#loucentbox',  '#loudongbox','#xitongbox','#elevatorbox');
                $("#fangjianbox").animate({
                    height: 'toggle',
                    opacity: 'toggle'
                },500)
            }
            window.dispatchEvent(new CustomEvent('clearCut',{detail:true}));
        });
        //点击电梯 test lx
        $("#dt").click(function(){
            disBox('#loudongbox','#fangjianbox','#xitongbox','#elevatorbox');
            $('#liftbox').css({'display':'block'});
            $("#elevatorbox").animate({
                height: 'toggle',
                opacity: 'toggle'
            },500)
            window.dispatchEvent(new CustomEvent('clearCut',{detail:true}));
        });

        //lx test
        function disBox(box1,box2,box3,box4){
            $(box1).css({'display':'none'});
            $(box2).css({'display':'none'});
            $(box3).css({'display':'none'});
            $(box4).css({'display':'none'});
        }
        //常规轮播
        carousel.render({
            elem: '#test1'
            ,interval: 5000000
            ,width: '100%'
            ,height: '270px'
            ,arrow: 'always'
        });

        $(".layui-tab-title li").hover(function(){
            $(this).css('border','1.5px solid  orange');
            $(this).find(".arrow01").css("borderBottom",'10px solid  orange');
            },function(){
            if($(this).attr("ipOpen")!='1'){
                $(this).css('border','1.5px solid white');
                $(this).find(".arrow01").css("borderBottom",'10px solid white');
            }
        });
        $(".fristperson").hover(function(){
              $(this).css('background','url(BIM/images/gnanniuhoverbg.png) no-repeat');
            },function(){
            if($(this).attr("ipOpen")!='1'){
                $(this).css('background','url(BIM/images/gnanniubg.png) no-repeat');
            }
        });
    });
</script>
<script type="text/javascript">
    $(function(){
        $(".bottomopenclose").click(function(){
            var h= $(".indexbottombox").height();
            $(".indexbottombox").animate({height:-(h-270)+'px'},500,function(){
                if($("#upDown").hasClass("fa-caret-down")){
                    $("#upDown").removeClass("fa-caret-down");
                    $("#upDown").addClass("fa-caret-up");
                }else{
                    $("#upDown").removeClass("fa-caret-up");
                    $("#upDown").addClass("fa-caret-down");
                }
            });
        });
        $('#xtTitle').mousedown(function(){
            $('#xitongbox').draggable();
        });
        $('#xtTitle').mouseup(function(){
            $('#xitongbox').draggable( "destroy" );
        });
    })
</script>

</body>
</html>
