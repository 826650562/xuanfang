/**
 *
 * Created by zxl on 2018/7/20.
 *
 */
function _blSearch(viewer,options){
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.viewer  = viewer;
    this.label= document.createElement("div");
    document.getElementsByTagName("body").item(0).appendChild(this.label);

    var style = document.createAttribute("style");
    this.label.setAttributeNode(style);
    this.label.setAttribute("id", "search_label");
    this.label.style.display = "none";
    this.label.style.position = "fixed";
    this.label.style.zIndex = 2;
    this.label.style.padding = "10px";
    this.label.style.color = "#fff";
    this.label.style.minWidth = "400px";
    this.label.style.minHeight = "60px";
    this.label.style.top = "180px";
    this.model;
    this.type = [];
    this.array=[];
    this.hideBox = [];
    window.searchHide;
}

_blSearch.prototype.load =function(){
    this.init();
    return this;
};

_blSearch.prototype.unload = function(){
    return true;
};

_blSearch.prototype.init = function(){
    var self = this;
    $("#search_label").append('<span class="iSpan2"><i class="fa fa-remove fa-lg"></i></span><div id="typeContain" class="typeContain"><div class="typeBox"><div class="typesList typeChoosed">楼层</div><div class="typesList">房间</div><div class="typesList">设施</div><div class="typesList">设备</div></div></div>');
    $("#typeContain").append('<div id="searchBox" class="searchBox"><div class="ldSearch"><label id="ldSearch">15号楼</label><i id="searchUpDown" class="fa fa-fw fa-caret-down"></i><ul></ul></div></div>');

    $("#searchBox").append('<input type="text" placeholder="搜索楼层(如15：为15楼)" class="forSearch" id="forSearch">');
    $("#searchBox").append('<input type="button" value="搜索" class="toSearch"  id="toSearch">');

    //楼栋列表 排除地下室
    var len = JHCYW.models_obj.length;
    for(var i=0;i<len-3;i++){
        $("#typeContain").find('ul').append('<li class="ldList" value="'+ i +'">'+Object.keys(JHCYW.models_obj[i])[0]+'</li>')
    }

    //关闭搜索框
    $(".iSpan2").unbind().click(function(){
        $(".typesList").removeClass("typeChoosed");
        $(".typesList").eq(0).addClass('typeChoosed');
        $(this).parent('#search_label').css({'display':'none'});
        $('#forSearch').attr('placeholder',$(this).text() +'(如15：为15楼)');
    });

    //类别
    $(".typesList").unbind().click(function(){
        $(".typesList").removeClass("typeChoosed");
        $(this).addClass('typeChoosed');
        $('#forSearch').val('');
        if($(this).text()=='楼层'){
            $('#forSearch').attr('placeholder',$(this).text() +'(如15：为15楼)');
        }else if($(this).text()=='房间'){
            $('#forSearch').attr('placeholder',$(this).text() +'(如1501：为15楼01户)');
        }else if($(this).text()=='设施'){
            $('#forSearch').attr('placeholder',$(this).text());
        }else if($(this).text()=='设备'){
            $('#forSearch').attr('placeholder',$(this).text());
        }
    });

    //选取了的楼栋显示框
    $('#ldSearch').unbind().click(function(){
        $("#typeContain").find('ul').css({'display':'block'});
    });

    //楼栋列表
    $(".ldList").unbind().click(function(){
        $('.ldList').removeClass('typeChoosed');
        $(this).addClass('typeChoosed');
        $("#ldSearch").text($(this).text());
        $(this).parent('ul').css({'display':'none'});

    });

    //搜索按钮
    $("#toSearch").unbind().click(function(){
        if($('.typeBox').find('.typeChoosed').length==0){
            alert('请选择搜索类别');
        }else if(!$("#forSearch").val()){
            alert('请输入搜索条件');
        }else{
            var type = $('.typeBox').find('.typeChoosed').eq(0).text();
            var ld = $('#ldSearch').text();
            var con = $('#forSearch').val();
            self.toSearch(type,ld,con);
        }
    })
};

_blSearch.prototype.toSearch = function(type,ld,con){
    var self = this;
    var lc;
    self.hideBox && self.hideBox.map(function(item){
        self.viewer.model.visibilityManager.show(item);
        self.viewer.model.visibilityManager.setNodeOff(item, false);
    });
    //遍历找到搜索的楼栋
    JHCYW.models_obj.map(function(item){
        self.viewer.showModel(Object.values(item)[0].id);
        if(Object.keys(item)[0]==ld){
            self.viewer.model = Object.values(item)[0];
        }else{
            self.viewer.hideModel(Object.values(item)[0].id);
        }
    });
    if(type=='楼层') {
        lc = 'F' + con;
    }else if(type=='房间'){
        lc = 'F' +con.substring(0,con.length-2);
    }
    //获取楼层列表
    var louceng = [];//['1F','2F'] 不重复
    var tempLC = [];
    var getLcNum,getTemp;
    var instanceTree = self.viewer.model.getData().instanceTree;
    self.viewer.model.search("A_", function (item) {
        var len = item.length-1;
        item.map(function (res,index) {
            if (instanceTree.getNodeParentId(res) == self.viewer.model.getRootId()) {
                var nodeFinalName = instanceTree.getNodeName(res);
                var arr = nodeFinalName.split("_");
                if (arr.length == 3) {
                    var _index = louceng.indexOf(arr[1]);
                    if (_index >= 0) {
                        tempLC[_index][arr[1]].push(res);
                    } else {
                        louceng.push(arr[1]);
                        var a = {};
                        a[arr[1]] = [res];
                        tempLC.push(a); //[{'1F':[1,2,3]},{'2F':[1,2,3]}]
                    }
                }
            }
            if(index==len){
                getLcNum = louceng;
                getTemp = tempLC;
                //显示所选楼层
                if(getLcNum.indexOf(lc)<0){
                    alert('搜索楼层不存在');
                }else{
                    getLcNum.map(function(res,index){
                        if(res==lc){
                            self.viewer.impl.fitToView(getTemp[index][res],self.viewer.model);
                            self.viewer.select(getTemp[index][res]);
                            setTimeout(function(){
                                $(".viewcubeUI").css({'display': 'block'});
                                self.viewer.setViewCube('front-top');
                                $(".viewcubeUI").css({'display': 'none'});
                            },500);
                            //隐藏楼顶、栏杆
                            instanceTree.enumNodeChildren(getTemp[index][res][0], function (x) {
                                self.viewer.model.getProperties(x,function(object){
                                    if(object.name && object.name.indexOf('天花')>=0){
                                        self.hideBox.push(x);
                                        window.searchHide = self.hideBox;
                                        self.viewer.model.visibilityManager.hide(x);//impl有模型会显示隔离之后的灰色
                                        self.viewer.model.visibilityManager.setNodeOff(x, true);
                                    }
                                },function (e) {})
                            });
                        }else{
                            self.hideBox.push(getTemp[index][res][0]);
                            window.searchHide = self.hideBox;
                            self.viewer.model.visibilityManager.hide(getTemp[index][res][0]);//impl有模型会显示隔离之后的灰色
                            self.viewer.model.visibilityManager.setNodeOff(getTemp[index][res][0], true);
                        }
                    });
                }

                self.viewer.model.search("S_", function (item) {
                    item.map(function(val){
                        self.hideBox.push(val);
                        window.searchHide = self.hideBox;
                        self.viewer.model.visibilityManager.hide(val);
                        self.viewer.model.visibilityManager.setNodeOff(val, true);
                    });
                },'名称');

                //房间的隐藏显示
                self.viewer.model.search("房间", function (item) {
                    var len = item.length-1;
                    var list= [];
                    item.map(function(val,index){
                        var nodeFinalName = instanceTree.getNodeName(val);
                        var arr = nodeFinalName.split('#');
                        if(arr.length == 6 && ( arr[2]+ "F" == lc || "F" + arr[2] == lc) && type=='房间'){
                            var room = con.substring(con.length-2,con.length);
                            if (arr[3]==room) {
                                list.push(val);
                            }
                        }else{
                            self.hideBox.push(val);
                            window.searchHide = self.hideBox;
                            self.viewer.model.visibilityManager.hide(val);
                            self.viewer.model.visibilityManager.setNodeOff(val, true);
                        }
                        if(index==len && list.length!=0){
                            self.viewer.select(list);
                            console.log(list.length);
                        }
                    })
                },'类别');
            }
        });
    }, "名称");

};

Autodesk.Viewing.theExtensionManager.registerExtension('blSearch', _blSearch);