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
<title>选房系统管理</title>
<meta name="viewport"
	content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<link rel="icon" href="<%=basePath%>images/ico.png" type="image/x-icon">
<!--标准mui.css-->
<link rel="stylesheet"
	href="<%=basePath%>js/mui-master/dist/css/mui.min.css">
<link rel="stylesheet"
	href="<%=basePath%>js/bootstrap/css/bootstrap.css">
<link href="<%=basePath%>js/layui/css/layui.css" rel="stylesheet"
	type="text/css">
<link href="<%=basePath%>js/layui/css/layui.manage.css" rel="stylesheet"
type="text/css">
<link href="<%=basePath%>js/fontawesome/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">
<link href="<%=basePath%>css/mcss/style.css" rel="stylesheet"
	type="text/css">
<script src="<%=basePath %>js/manageIndex.js"></script>
<style>
#showApplyDetail{display:none;}
</style>
<!--App自定义的css-->
</head>
<body class="layui-layout-body">
	<div class="layui-layout layui-layout-admin" id="myApp" v-cloak>
		<div class="layui-header" style=" background-color: #53cc33;">
			<div class="layui-logo">
				<img src="<%=basePath%>images/logo.png">
			</div>
			<!-- 头部区域（可配合layui已有的水平导航） -->
			<ul class="layui-nav layui-layout-right">
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
		<div class="layui-side layui-bg-black">
			<div class="layui-side-scroll">
				<ul class="layui-nav layui-nav-tree" lay-filter="test">
					<li class="layui-nav-item layui-nav-itemed"><a
						class="" href="javascript:;"><i
							class="fa fa-home fa-fw"></i>&nbsp;选房管理</a>
						<dl class="layui-nav-child">
							<dd class="layui-this">
								<a href="javascript:;" @click='javascript:location.reload();'><i class="fa fa-registered fa-fw"></i>&nbsp;房屋申请处理</a>
							</dd>
							<dd>
								<a @click='javascript:location.reload();window.open("<%=basePath%>chooseRoom/showRoomStatus")'><i
									class="fa fa-registered fa-fw"></i>&nbsp;房屋信息看板</a>
							</dd>
						</dl></li>
				</ul>
			</div>
		</div>
		<div class="layui-body" id="bodyContent">
			<!-- 选房审核列表 内容主体区域 -->
			<div class="pad15" id="applyListContain">
				<div class="row">
					<div class="col-lg-3">
						<a href="<%=basePath%>manage/index" class="xxtxbox bgGreen"  id="untreatedApplyMsg">意向申请未处理消息
							<span class="xxtxnum">{{untreatedCount}}</span>
						</a>
					</div>
					<div class="col-lg-3">
						<a href="javascript:;" class="xxtxbox" @click='changeList($event)' id="treatedApplyMsg"> 意向申请已处理信息<span
							class="xxtxnum">{{delCount}}</span>
						</a>
					</div>
					<!-- <div class="col-lg-3">
						<a href="xxtx3.html" class="xxtxbox"> 房租到期预提醒消息 <span
							class="xxtxnum">3</span>
						</a>
					</div> -->
				</div>
				<div class="row" style=" height:15px;">
					<div class="col-lg-12"></div>
				</div>
				<!-- 选房审核列表  start -->
				<div class="row" id="showApplyList">
					<div class="col-lg-12">
						<div class="layui-form">
							<table class="layui-table mar0">
								<colgroup>
									<col>
									<col width="300">
									<col width="200">
								</colgroup>
								<tbody>
									<tr v-for='i in untreatedApply' :_id=i.ID>
										<td>{{i.TENEMENTNAME}}选择了&nbsp;<strong class="colorRed">{{i.BUILD}}</strong>
											<strong class="colorRed">{{i.HOUSEHOLD}}</strong>&nbsp;户
										</td>
										<td>{{i.TIME}}</td>
										<td><a href="#" class="showDetailBtn" @click='showApply(i.ID)'><i
												class="fa fa-eye fa-f2"></i>&nbsp;查看</a></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<!-- 选房审核列表  end -->
			</div>
			<!-- 选房审核列表 内容主体区域 end -->
			<!-- 选房人基本信息内容主体区域 -->
			<div class="pad15" id="showApplyDetail">
				<div class="shadowbox"  v-for='detail in applyDetail'>
					<form class="layui-form">
						<div class="padTB10 colorRed">选房人基本信息</div>
						<table class="layui-table marB15">
							<thead>
								<tr>
									<th><strong>姓名</strong></th>
									<th><strong>性别</strong></th>
									<th><strong>年龄 </strong></th>
									<th><strong>籍贯</strong></th>
									<th><strong> 手机号</strong></th>
									<th><strong>身份证号</strong></th>
									<th><strong> 婚姻状况</strong></th>
									<th><strong>家庭成员（人数） </strong></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{{detail.NAME}}</td>
									<td>男</td>
									<td>23</td>
									<td>{{detail.ADDRESS}}</td>
									<td>{{detail.PHONENUM}}</td>
									<td>{{detail.IDCARD}}</td>
									<td>未婚</td>
									<td>1</td>
								</tr>
							</tbody>
						</table>
						<div class="padTB10 colorRed">选房信息</div>
						<table class="layui-table mar0">
							<thead>
								<tr>
									<th><strong>项目名称</strong></th>
									<th><strong>楼栋</strong></th>
									<th><strong>单元</strong></th>
									<th><strong>房号</strong></th>
									<th><strong>户型编号</strong></th>
									<th><strong>建筑面积</strong></th>
									<th><strong>室内使用面积</strong></th>
									<th><strong>户型</strong></th>
									<th><strong>三维模型</strong></th>
									<th><strong>全景图</strong></th>
									<th><strong>户型平面图</strong></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>保障房项目01（东区）</td>
									<td>{{detail.LOUDONG}}</td>
									<td>{{detail.DY}}单元</td>
									<td>{{detail.HOUSEHOLD}}</td>
									<td>{{detail.HOUSETYPE}}</td>
									<td>{{detail.INSIDE}}m²</td>
									<td>{{detail.INSIDE}}m²</td>
									<td>两室一厅一卫</td>
									<td><img src="<%=basePath%>images/swmx1.png"></td>
									<td><img src="<%=basePath%>images/qjt1.jpg"></td>
									<td><img src="<%=basePath%>images/hxt01.png"></td>
								</tr>
							</tbody>
						</table>
					</form>					
				</div>
				<div class="row" id="btnBox" v-if='btnShow'>
					<div class="col-lg-5"></div>
					<div class="col-lg-2">
						<a href="#"  @click.prevent='toSetApply(detailId)' class="layui-btn"><i class="fa fa-hdd-o fa-fw"></i>&nbsp;受理并通知对方</a>
					</div>
					<div class="col-lg-5"></div>
				</div>
			</div>
			<!-- 选房人基本信息内容主体区域 end -->
		</div>
		<div class="layui-footer">分页展示</div>
	</div>
	<script type="text/javascript" src="<%=basePath%>js/jquery-1.9.1.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vue"></script>
	<script src="<%=basePath%>js/layui/layui.js"></script>
	<script src="<%=basePath%>js/layui/leftnav.js"></script>
	<script>
	Date.prototype.toLocaleString = function() {
		return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + "   " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds() + "";
	};
	//JavaScript代码区域
	layui.use([ 'form', 'element', 'jquery' ], function() {
		var form = layui.form;
		var element = layui.element,
			$ = layui.jquery;
		$(".menu_three").on("click", function() {
			$(this).next().toggle();
		})
		$("ol").on("click", "li a", function() {
			$.each($(this).parent().siblings(), function(i, e) {
				$(e).find("a").removeClass('three_this')
			});
			$(this).addClass('three_this'); // 添加当前元素的样式
		})
	});
	var rentalJson ;
	var delJsonArray ;
	var applyDetail = [];
	var untreatedCount;
	var delCount;
	var treatedApplyInter;
	indexMsg();//获取未处理信息数据
	//var indexMsg = setInterval(indexMsg,2000);
	//vue
	var vm = new Vue({
		el:'#myApp',
		data:{
			untreatedApply:rentalJson,
			applyDetail:applyDetail,
			detailId:'',
			delCount:delCount,
			untreatedCount:untreatedCount,
			btnShow:true
		},
		methods:{
			showApply(id){
				$.ajax({
					url:'getApplyDetail',
					data:{
						id:id
					},
					type:'POST',
					dataType:'JSON',
					success:function(rtn){
						var res = rtn.arr;
						var arr = [res];						
						if(rtn.error){
							layer.msg(rtn.error);
						}else{
							$('#applyListContain').css('display','none');
							$('#showApplyDetail').css('display','block');
							vm.applyDetail = arr;
							vm.detailId = res.SID;
							if(res.STATUSID=='1'){
								vm.btnShow = true;
							}else if(res.STATUSID=='3'){
								vm.btnShow = false;
							}
						}												
					},
					error:function(res){
						console.log(res);
					}
				})
			},
			toSetApply(id){
				indexMsg && clearInterval(indexMsg);
				treatedApplyInter && clearInterval(treatedApplyInter);
				$.ajax({
					url:'toSetApply',
					data:{
						id:id
					},
					type:'POST',
					dataType:'JSON',
					success:function(rtn){
						var res = rtn[0];						
						if(res.setSuccess){
							layer.msg(res.setSuccess);
							$.ajax({
								url:'sendMessage',
								data:{
									mobile:res.PHONENUM,
									name:res.TENEMENTNAME
								},
								type:'POST',
								dataType:'JSON',
								success:function(back){
									if(back.success){
										$('#btnBox').css('display','none');
										layer.msg(back.success);
									}else if(back.error){
										layer.msg(back.error);
									}
								},
								error:function(back){
									layer.msg(back.reason);
								}
							})
						}
					},
					error:function(res){
						console.log(res);
					}
				})
			},
			changeList(e){
				clearInterval(indexMsg);
				$('.xxtxbox').removeClass('bgGreen');
				$(e.target).addClass('bgGreen'); 
				treatedApply();
				//treatedApplyInter = setInterval(treatedApply,2000);
			}

		} 
	});
	function changeTime(arr){
		arr.map(function(item){
			var newDate = new Date();
		    newDate.setTime( Number(item.TIME));
			item.TIME =newDate.toLocaleString();
		});
	}
	function indexMsg(){
		$.ajax({
			url:'indexMsg',
			dataType:'JSON',
			type:'GET',
			success:function(res){
				rentalJson = res.rentalJson;
				delJsonArray = res.delJsonArray;
				untreatedCount = res.rentalJson.length;
				//未处理消息
				changeTime(rentalJson);
				//已处理消息
				changeTime(delJsonArray);
				vm.untreatedApply = rentalJson;
				vm.delCount = delJsonArray.length;
				vm.untreatedCount = rentalJson.length;
			},
			error:function(){
				console.log(res);
			}
		})
	}
	function treatedApply(){
		$.ajax({
			url:'treatedApply',
			dataType:'JSON',
			type:'GET',
			success:function(res){
				changeTime(res.delJsonArray);
				changeTime(res.rentalJson);
				vm.untreatedApply = res.delJsonArray;
				vm.delCount = res.delJsonArray.length;
				vm.untreatedCount = res.rentalJson.length;
				vm.btnShow = false;
			},
			error:function(res){
				console.log(res);
			}
		});
	}
</script>
</body>
</html>
