$(function(){
	var vm = new Vue({
		el:'#contain',
		data:{
			tenementList:[]
		},
		methods:{
			setRenderTime:function(){
				var choosedStr = '';
				$('input:checkbox[name="choose"]:checked').each(function(){
					choosedStr=choosedStr + $(this).attr('_id')+ ',';
				})
				choosedStr = choosedStr.substring(0, choosedStr.length-1);
				if(compareTime($('#dateStart').text(),$('#dateEnd').text()) && $('input:checkbox[name="choose"]:checked').length>0){
					$.ajax({
						url:'updataTime',
						data:{
							choosedStr : choosedStr,
							starttime:$('#dateStart').text(),
							endtime:$('#dateEnd').text()
						},
						type:'POST',
						dataType:'JSON',
						success:function(res){
							if(res.success){
								$('input:checkbox[name="choose"]:checked').each(function(){
									$(this).removeAttr('checked');
								})
								getList($('.layui-laypage-curr').find('em').eq(1).text(),12);
								layer.msg(res.success);
							}
							
						},
						error:function(res){
							console.log(res);
						}
						
					})
				}else if($('input:checkbox[name="choose"]:checked').length<=0){
					layer.msg('请选择需要添加的预租人员！');
				}		
			}
		}
		
	})
	
	//分页功能
	var laypage,form;
	layui.use(['laypage','jquery','layer','upload','laydate','form'], function(){
		laypage = layui.laypage;
		var $ = layui.jquery;
		var upload = layui.upload;
		var laydate = layui.laydate;
		form = layui.form;
		
		
		laydate.render({
			elem:'#dateStart',
			type: 'datetime',
			format:'yyyy-MM-dd HH:mm:ss',
			trigger: 'click',
			value: new Date(),
			showBottom: true,
			isInitValue: true 
		})
		laydate.render({
			elem:'#dateEnd',
			type: 'datetime',
			format:'yyyy-MM-dd HH:mm:ss',
			trigger: 'click',
			value: new Date(),
			showBottom: true,
			isInitValue: true 
		})
		
		//导入导出功能
		//执行实例 点击导入excel
		$('#importXls').click(function(){
			var index = layer.open({
				title:'下载模板',
				type: 1,
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 0, //不显示关闭按钮
				anim: 2,
				area: ['300px', '140px'], //宽高
				shadeClose: true, //开启遮罩关闭
				content: '<div style="width:90%;height:70%;padding:20px"><span>请下载导入模板,按格式填写数据后导入！</span></div>'+
					'<div style="padding-left: 110px;"><button class="layui-btn layui-btn-xs layui-btn-normal marR20" id="download">下载模板</button>'+
					'<button class="layui-btn layui-btn-xs layui-btn-warm" id="toImportXls">上传</button>'+
					'<button class="layui-btn layui-btn-xs layui-btn-primary marL20" id="cancel">取消</button></div>'
			});
			upload.render({
			    elem: '#toImportXls',
			    url: 'importTenantXls',
			    accept: 'file' ,
//			    size: 50 ,
			    done: function(res){
 		    	    window.location.reload();
			    	layer.close(index);
			      if(res.error){
			    	  layer.msg(res.error);
			      }else if(res.success){
			    	  layer.msg(res.success);
			    	  window.location.reload();
//			    	  getList(1,12);
			      }
			    },
			    error: function(res){
			    	layer.close(index);
			      console.log(res);
			    }
			});
			$('#download').click(function(){
				layer.close(index);
				window.open(window.path+"manage/downloadFile?name=预租人员模版.xls");					
			})
			$('#cancel').click(function(){
				layer.close(index);
			})

		})
		//导入导出功能结束
		laypage.render({
		  elem: 'tenantListPageChange',
		  count: tenantList, //另一个方法传入总数
		  limit: 12,
		  theme:'#59d439',
		  jump: function(obj, first){
		    //obj包含了当前分页的所有参数，比如：
		    /*console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
		    /*console.log(obj.limit);*/ //得到每页显示的条数
			getList(obj.curr,obj.limit);
		  }
		});
		

		$('#exportXls').unbind().click(function(){
			var name;
			layer.open({
				id:1,
			        type: 1,
			        title:'导出文件',
			        skin:'layui-layer-rim',
			        area:['450px', 'auto'],		        
			        content: ' <div class="row" style="width: 420px;  margin-left:7px; margin-top:10px;">'
			            +'<div class="col-sm-12">'
			            +'<div class="input-group">'
			            +'<span class="input-group-addon"> 文件名称   :</span>'
			            +'<input id="exlName" type="text" class="form-control" placeholder="请输入名称">'
			            +'</div>'
			            +'</div>'
			              +'</div>'
			        ,
			        btn:['确定','取消'],
			        btn1: function (index,layero) {
			        	name = $('#exlName').val();
			        	layer.close(index);
			        	$.ajax({
							url:'exportTenantXLS',
							data:{},
							type:'POST',
							dataType:'JSON',
							success:function(res){
								console.log(res);
								if(res.arr){
									var title=[{TENEMENTNAME:'姓名'},{ADDRESS:'户口所在地'},{PUBLIC_RENTAL_RECORD:'公租房备案号'},{IDCARD:'身份证号'},{PHONENUM:'联系方式'},{LIMITAREA:'面积限制'},{HOUSETYPE:'套型'},{HOUSETYPEORDER:'套型内顺序'},{ADDRESSDETAIL:'户口所在街乡'},{LOTTERYORDER:'摇号顺序号'},{RECORDTIME:'备案时间'},{OPTIONAL:'正备选'},{CHECKSTATUS:'保办审核状态'},{CURRENT_TIME:'时间'}]; 
									toExcel(name, res.arr, title);
								}
								
							},
							error:function(res){
								console.log(res);
							}						
						})
			    	},
			        btn2:function (index,layero) {
			        	 layer.close(index);
			        }
			 
			    });

			
		})
	});
	function getList(curr,limit){
		var loading = layer.load(1, {shade: [0.2, '#87888a']});
		$.ajax({
			type : "POST",
			url :  window.path+"manage/showTenantList",
			data : {
				current : curr,
				limit : limit
			},
			dataType:'JSON',
			success : function(res) {
				layer.close(loading);
				vm.tenementList = [];
				vm.tenementList = res.tenementArr ;				
				setTimeout(function(){
					form.render();
					res.rentalOrPersonArr.map(function(item){
						$('tr[rid="'+ item.TENEMENTID +'"]').find('input[name="choose"]').attr('disabled',true);
						if(item.STATUSID.indexOf('3')>=0){
							$('tr[rid="'+ item.TENEMENTID +'"]').find('.curStatus').text('已租房');
							$('tr[rid="'+ item.TENEMENTID +'"]').find('.choosed').text('已租房');
						}else if(item.STATUSID.indexOf('1')>=0){
							$('tr[rid="'+ item.TENEMENTID +'"]').find('.curStatus').text('已选房');
							$('tr[rid="'+ item.TENEMENTID +'"]').find('.choosed').text('已选房');
						}
					})
					res.toldPersonArr.map(function(item){
						$('tr[rid="'+ item.TENEMENTID +'"]').find('input[name="choose"]').attr('disabled',true);
						$('tr[rid="'+ item.TENEMENTID +'"]').find('.curStatus').text('已通知');
					})
					res.noRentalPersonArr.map(function(item){
						$('tr[rid="'+ item.TENEMENTID +'"]').find('.curStatus').text('未选房');
					})
				},50);					
			},
			error : function(data) {
				layer.close(loading);
				console.log("error:" + data.responseText);
			}
		});
	}
	
	//判断日期，时间大小  
	function compareTime(startDate, endDate) {   
	 if (startDate.length > 0 && endDate.length > 0) {   
	    var startDateTemp = startDate.split(" ");   
	    var endDateTemp = endDate.split(" ");   

	    var arrStartDate = startDateTemp[0].split("-");   
	    var arrEndDate = endDateTemp[0].split("-");   

	    var arrStartTime = startDateTemp[1].split(":");   
	    var arrEndTime = endDateTemp[1].split(":");   

		var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);   
		var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);   
	
		if (allStartDate.getTime() >= allEndDate.getTime()) {   
		        layer.msg("开始时间不能大于结束时间");   
		        return false;   
		} else {   
		    return true;   
		       }   
	} else {   
 
		return false;   
		  }   
	} 
})