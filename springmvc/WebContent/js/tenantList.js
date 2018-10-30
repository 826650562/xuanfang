
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
	      '<th>面积限制</th>'+
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
	$(".orderT").append("<div class='layui-elem-quote'><h4>预租人员信息列表</h4></div>")
	$(".orderT"). append(html);

	
	//分页功能
	layui.use(['laypage','jquery','layer'], function(){
		var laypage = layui.laypage;
		var $ = layui.jquery;
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
							      '<td>'+res[i].LIMITAREA+'</td>'+
							      '<td>'+res[i].HOUSETYPE+'</td>'+
							      '<td>'+res[i].HOUSETYPEORDER+'</td>'+
							      '<td>'+res[i].ADDRESSDETAIL+'</td>'+
							      '<td>'+res[i].LOTTERYORDER+'</td>'+
							      '<td>'+res[i].RECORDTIME+'</td>'+
							      '<td>'+res[i].OPTIONAL+'</td>'+
							      '<td>'+res[i].CHECKSTATUS+'</td>'+
							      '<td>'+res[i].CURRENT+'</td>'+
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
	});
