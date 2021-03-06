$(function(){
	
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
	var indexMsg = setInterval(indexMsg,2000);
	//vue
	var vm = new Vue({
		el:'#bodyContent',
		data:{
			untreatedApply:rentalJson,
			applyDetail:applyDetail,
			detailId:'',
			delCount:delCount,
			untreatedCount:untreatedCount,
			btnShow:true,
		},
		methods:{
			showApply:function(id){
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
			toSetApply:function(id){
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
			changeList:function(e){
				clearInterval(indexMsg);
				$('.xxtxbox').removeClass('bgGreen');
				$(e.target).addClass('bgGreen'); 
				treatedApply();
				treatedApplyInter = setInterval(treatedApply,2000);
			},
			openChooseRoomOnline:function(){
				//$('#').attr("src",window.path+"manage/chooseRoomPage");
				window.open(window.path+"manage/chooseRoomPage");
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
				vm.untreatedApply = rentalJson;
				vm.delCount = delJsonArray.length;
				vm.untreatedCount = rentalJson.length;
			},
			error:function(res){
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
})

 
