//获取下级节点
function getMenus(parentId) {
   // var menus = [{ menuName: "菜单1", url: "", id: "root1", parentId: "", hasChild: true }, { menuName: "菜单2", url: "", id: "root2", parentId: "" }, { menuName: "菜单11", url: "", id: "child1", parentId: "root1", hasChild: true }, { menuName: "菜单12", url: "", id: "child2", parentId: "root1", hasChild: false }, { menuName: "菜单111", url: "", id: "child1", parentId: "child1", hasChild: false }, ];
    var returnArr = [];
    $.ajaxSetup({
          async: false
          });
    
    $.get(ctx+'/sys/menu/listMenuByParentIdWithPermit',{parentId:parentId},function(result){
        
        returnArr=result;
    });
    
    $.ajaxSetup({
          async: true
          });

    $(".kit-side-fold").click(function () {
        $("#ulmenu").children(".layui-nav-item").toggleClass("kit-side-folded");
    });
    return returnArr;

}

//初始化首节点
function initMenu(menus,p_app) {
    //app=p_app;
    for (var i = 0; i < menus.length; i++) {
        var menusi = menus[i];
        var $li = $('<li class="layui-nav-item">');
        var $a = $('<a href="javascript:;">');

            $a.append($('<i class="fa fa-plug" aria-hidden="true"></i>'));
        $a.append($('<span>'+menusi.menuName+'</span>'));

        if (menusi.hasChild==true) {
            var $span = $('<span class="layui-nav-more"></span>');
            $a.append($span);
        }

        $a.attr("onclick", "clickMenu(this)");
        $a.data("menuObj", menusi);

        $li.append($a);
        $("#ulmenu").append($li);
    }
}

//初始化叶子节点
function initChildMenu(childMenus, a) {
    //如何已经有数据可以直接显示不用生成html

    var $dl = $('<dl class="layui-nav-child">');
    for (var i = 0; i < childMenus.length; i++) {
        var menusi = childMenus[i];
        var $dd = $('<dd></dd>');
        var $a = $('<a href="javascript:;" onclick="clickMenu(this)" kit-target></a>');
        var $span = $('<span class="layui-nav-down"></span>');
        $a.append($('<span>'+menusi.menuName+'</span>'));
        if (menusi.hasChild) {
            $a.append($span);
            
        }


        $a.data("menuObj", menusi);
        $a.data("options",{url:ctx+menusi.url,icon:"&#xe658;",title:menusi.menuName,id:menusi.id})
        $dd.append($a);
        $dl.append($dd);
        $(a).parent().append($dl);
        $(a).parent().addClass("layui-nav-itemed");
    }
 
  //主入口
    appGlobal.set({
        type: 'iframe'
    }).init();
}

//单击事件
function clickMenu(a) {

    if($(a).data("menuObj").url){

    return; 
    }
    
    $(a).parent().toggleClass("layui-nav-itemed");

    if ($(a).next().length == 0) {//首次初始化
        var childMenus = getMenus($(a).data("menuObj").id);
        initChildMenu(childMenus, a);
    } else {
        if ($(a).parents(".layui-nav-child").length > 0) {
            $(a).next().toggle();
        }
    }

    $(a).children("span:last-child").toggleClass(function () {
        if ($(this).hasClass("layui-nav-down")) {
            return "layui-nav-more";
        } else {
            return "layui-nav-down";
        }
    });



}