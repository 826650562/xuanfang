
	var html = '<table class="layui-table">'+
	 '<colgroup>'+
	    '<col width="150">'+
	    '<col width="200">'+
	    '<col>'+
	  '</colgroup>'+
	  '<thead>'+
	     '<tr>'+
	      '<th>姓名</th>'+
	      '<th>户口所在地</th>'+
	      '<th>公租房备案号</th>'+
	      '<th>身份证号</th>'+
	      '<th>联系电话</th>'+
	      '<th>套型</th>'+
	      '<th>套型内顺序</th>'+
	      '<th>户口所在街乡</th>'+
	      '<th>摇号顺序号</th>'+
	      '<th>备案时间</th>'+
	      '<th>正备选</th>'+
	      '<th>保办审核状态</th>'+
	      '<th>时间</th>'+
	    '</tr>'+ 
	  '</thead>'+
	  '<tbody id ="tenantContent">'+
	   
	  '</tbody>'+
	'</table>';
	$(".orderT"). append(html);

	
	//分页功能
	layui.use(['laypage','jquery','layer','upload'], function(){
		var laypage = layui.laypage;
		var $ = layui.jquery;
		var upload = layui.upload;
		
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
			var loading = layer.load(1, {shade: [0.2, '#87888a']});
			$.ajax({
				type : "POST",
				url :  window.path+"manage/showTenantList",
				data : {
					current : obj.curr,
					limit : obj.limit
				},
				async : false,
				cache : false,
				contentType : "application/x-www-form-urlencoded",
				success : function(data) {
					layer.close(loading);
					var res = JSON.parse(data);
					$('#tenantContent').html('');
					for(var i =0;i<res.length;i++){
						$("#tenantContent").append( '<tr data-workerId='+res[i].ID+'>'+
							      '<td>'+res[i].TENEMENTNAME+'</td>'+
							      '<td>'+res[i].ADDRESS+'</td>'+
							      '<td>'+res[i].PUBLIC_RENTAL_RECORD+'</td>'+
							      '<td>'+res[i].IDCARD+'</td>'+
							      '<td>'+res[i].PHONENUM+'</td>'+
							      '<td>'+res[i].HOUSETYPE+'</td>'+
							      '<td>'+res[i].HOUSETYPEORDER+'</td>'+
							      '<td>'+res[i].ADDRESSDETAIL+'</td>'+
							      '<td>'+res[i].LOTTERYORDER+'</td>'+
							      '<td>'+res[i].RECORDTIME+'</td>'+
							      '<td>'+res[i].OPTIONAL+'</td>'+
							      '<td>'+res[i].CHECKSTATUS+'</td>'+
							      '<td>'+res[i].CURRENT_TIME+'</td>'+
							      '</tr>');	
					}
				},
				error : function(data) {
					layer.close(loading);
					console.log("error:" + data.responseText);
				}
			});
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
