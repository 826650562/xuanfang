/**
 *
 * Created by zxl on 2018/7/16.
 *
 */


function _Electrome(viewer,options){
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.model;
    this.viewer  = viewer;
    this.type = [];
    this.array=[];
    this.editContain = document.createElement('div');
    this.editContain.setAttribute('class','editContain');
    this.editContain.setAttribute('id','editContain');
    document.getElementsByTagName("body").item(0).appendChild(this.editContain);
    this.editContain.innerHTML = '<label class="editTitle" id="editTitle"></label><input type="text" name="title"  placeholder="标注" class="editContain-input" title="无标注"><button class="editContain-btn" id="editContain-btn">确定</button><span class="iSpan"><i class="fa fa-remove fa-lg"></i></span>';
}

_Electrome.prototype.load = function(){
    var self = this;
    this.init();
    $('#editContain').draggable();
    $('#editContain').find('.iSpan').unbind().click(function(){
        $('#editContain').css({'display':'none'});
        $('.editing').removeClass('editing');
        $('.red').removeClass('red');
        //self.model && self.viewer.impl.unloadModel(self.model);
    });
    return this;
};

_Electrome.prototype.unload = function(){
    return true;
};

_Electrome.prototype.init = function(){
    var self = this;
    var type = [];
    var LDmodel = self.model;

    $("#xt").click(function(){

        if($('#ldInput').attr('model_id')){
            self.model && self.viewer.impl.unloadModel(self.model);
            window.JDModel = null;

            self.viewer.loadModel("/BIM/svf/"+$("#ldInput").val()+"/JD/3d.svf",
                { globalOffset: self.viewer.model.getData().globalOffset },
                function(model){
                    self.model = model;
                    window.JDModel = model;
                    console.log("load JD success");
                    self.loadType(model);//查数据添加机电类型列表

                    var obj = self.viewer.model.getVisibleBounds();
                    //console.log(obj.min.z);
                    //截取该楼层的机电模型
                     var state = self.viewer.getState();
                     console.log(state);

                     var cutplanes = [
                         //new THREE.Vector4( 0, 0, 1, -146.8550262451172 ),
                         //new THREE.Vector4( 0, 0, -1, 137.58139038085938),
                         new THREE.Vector4( 0, 0, 1, -(obj.max.z)),
                         new THREE.Vector4( 0, 0, -1, obj.min.z),
                     ];

                     self.viewer.setCutPlanes( cutplanes );  //这个不传参数就可以 回到截面前面的样子

                },
                self._onLoadModelError);
        }
    });
    //方法  遍历所有机电dbids  对dbids分类
    function getTYpe(model,index,dbids){
        if( index>dbids.length-1){
            console.log(type);
            self.toSetSeq(type);
        }
        model.getProperties(Number(dbids[index]),function(p){
            if(p){
                var pro = p.properties;
                var pro_len=p.properties.length-1;
                pro.map(function(item,i){
                    if(item.displayName == '系统类型'){
                        var _index = type.indexOf(item.displayValue);
                        if(_index < 0){
                            type.push(item.displayValue);
                        }else{

                        }
                    }
                    if(i>=pro_len){
                        index++;
                        getTYpe(model,index,dbids);
                    }
                })
            }else{
                index++;
                getTYpe(model,index,dbids);
            }

        },function(){
            index++;
            getTYpe(model,index,dbids);
        });
    }
};

_Electrome.prototype._onLoadModelError = function(){
    console.log("load JD failed");
};

//ajax方法  向数据库插入楼栋机电类型列表
_Electrome.prototype.toSetSeq = function(type){
    $.ajax({
        url:'a/bim/bimJzxx/setJDxx',
        type:'POST',
        data:{
            loudong:$('#ldInput').val(),
            typeName:type.toString(),
            note:''
        },
        dataType:'json',
        success:function(data){
            console.log(data)
        },
        error:function(er){
            console.log(er);
        }
    })
};

//ajax 获取数据库机电类型列表
_Electrome.prototype.loadType = function(model){
    var self = this;

    $.ajax({
        url:'a/bim/bimJzxx/getJDxt',
        data:{
            loudong:$('#ldInput').val()
        },
        type:'GET',
        dataType:'JSON',
        success:function(res){
            $('#xitongbox').find('form').html('');
            for(var i=0;i<res.length;i++){
                var html;
                var note = res[i].JD_NOTE?res[i].JD_NOTE:"无标注";
                html = '<div class="switchitem"><div class="kglable">'+ res[i].JD_TYPE +'</div><div class="kgNote" title="'+ note +'">' + note +
                '</div><div class="kgbtn"><input type="checkbox" name="close" lay-skin="switch" lay-text="开|关">'+
                '<div class="layui-unselect layui-form-switch" lay-skin="_switch"><em>开</em><i></i></div>'+
                '</div><i class="layui-icon layui-icon-edit" title="标注编辑"></i></div>';
                $('#xitongbox').find('form').append(html);
            }
            self.clickKg(model);
        } ,
        error:function(res){
            console.log(res)
        }
    });
};

//机电类型列表 开关按钮 标注编辑按钮事件
_Electrome.prototype.clickKg = function(model){
    var self = this;
    var selectType =  [];
    var selectArr = [];
    var modelOld = self.viewer.model;
    self.viewer.model = model;
    var arr =[];

    //开关按钮事件绑定
    $(".kgbtn").unbind().click(function(){
        self.viewer.model = model;
        arr = [];
        var text = $(this).parent(".switchitem").find('.kglable').text();
        if($(this).find(".layui-form-onswitch").length>0){
            $(this).find(".layui-form-onswitch").removeClass("layui-form-onswitch");
            var _index = selectType.indexOf(text);
            selectType.splice(_index,1);
            selectArr.splice(_index,1);
            for(var j=0;j<selectArr.length;j++){
                arr = arr.concat(selectArr[j]);
            }
            self.viewer.select(arr);
            self.viewer.model = modelOld;
        }else{
            $(this).find(".layui-form-switch").addClass("layui-form-onswitch");
            self.viewer.model.search(text,function(res){
                selectType.push(text);
                selectArr.push(res);
                for(var i=0;i<selectArr.length;i++){
                    arr = arr.concat(selectArr[i]);
                }
                self.viewer.select(arr);
                self.viewer.model = modelOld;
            },'系统类型');
        }
    });

    //标注编辑按钮事件绑定
    $('.layui-icon-edit').unbind().click(function(e){
        if($(this).hasClass('red')){
            $(this).parents('.switchitem').removeClass('editing');
            $(this).removeClass('red');
            $('#editContain').css({'display':'none'});
        }else{
            $(this).parents('form').find('.switchitem').removeClass('editing');
            $(this).parents('form').find('.layui-icon-edit').removeClass('red');
            $(this).parents('.switchitem').addClass('editing');
            $(this).addClass('red');
            $('#editContain').css({'display':'block','left': e.clientX+50,top: e.clientY});
            var type = $(this).parents('.switchitem').find('.kglable').text();
            var note = $(this).parents('.switchitem').find('.kgNote').text();
            $("#editTitle").text(type);
            $('#editContain').find('.editContain-input').attr('placeholder','编辑' + type+'标注');
            $('#editContain').find('.editContain-input').click(function () {
                $(this).attr('placeholder','');
            });
            // $('#editContain').find('.editContain-input').val(note);
        }
    });

    //编辑标注确定按钮事件
    $('#editContain-btn').unbind().click(function(){
        var note = $('#editContain').find('.editContain-input').val();
        if(note.length>20){
            alert('字符长度超过20');
        }else{
            note = note ? note : '';
            $.ajax({
                url:'a/bim/bimJzxx/setNote',
                data:{
                    loudong:$('#ldInput').val(),
                    type:$('.editing').find('.kglable').text(),
                    note:note
                },
                type:'POST',
                success:function(res){
                    console.log(res);
                    $('.editing').find('.kgNote').attr('title',note);
                    $('.editing').find('.kgNote').text(note);
                    $('.editing').removeClass('editing');
                    $('.red').removeClass('red');
                    $('#editContain').css({'display':'none'});
                },
                error:function(res){
                    console.log(res.status);
                }
            });
        }
    });
    $('#xitongbox .iSpan').unbind().click(function(){
        $(this).parent('div').css({'display':'none'});
        self.model && self.viewer.impl.unloadModel(self.model);
        self.viewer.model = modelOld;
        self.viewer.setCutPlanes();
    });

    window.addEventListener('clearCut',function(e){
        if(e.detail){
            self.model && self.viewer.impl.unloadModel(self.model);
            self.viewer.model = modelOld;
            self.viewer.setCutPlanes();
        }
    })
};

_Electrome.prototype.switchBtn = function(type,array,model){
    $(".kgbtn").unbind().click(function(){
        var text = $(this).parent(".switchitem").find('.kglable').text();
        var _index = type.indexOf(text);
        var arr = array[_index][text];
        if($(this).find(".layui-form-onswitch").length>0){
            $(this).find(".layui-form-onswitch").removeClass("layui-form-onswitch");
            for(var i=0;i<arr.length;i++){
                model.visibilityManager.hide(arr[i]);
                model.visibilityManager.setNodeOff(arr[i], true);
            }
        }else{
            $(this).find(".layui-form-switch").addClass("layui-form-onswitch");
            for(var j=0;j<arr.length;j++) {
                model.visibilityManager.show(arr[j]);
                model.visibilityManager.setNodeOff(arr[j], false);
            }
        }
    });
    $(".forFa").unbind().click(function(){
        var text = $(this).parent(".switchitem").find('.kglable').text();
        var _index = type.indexOf(text);
        var arr = array[_index][text];
        for(var i=0;i<arr.length;i++){
            model.visibilityManager.hide(arr[i]);
            model.visibilityManager.setNodeOff(arr[i], true);
        }
        type.splice(_index,1);
        array.splice(_index,1);
        $(this).parent(".switchitem").remove();
    });

};

Autodesk.Viewing.theExtensionManager.registerExtension('Electrome', _Electrome);