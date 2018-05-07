define(["jquery","jqConfirm","common"], function ($,jqConfirm,common) {
    var searchParam = {
        init: function (parentId) {
            $("#"+parentId).find("#advancedSrhBtn").click(function () {
                if($("#"+parentId).find(".generalSrh").is(":hidden")){
                    $("#"+parentId).find(".generalSrh").show();
                    var paramCount = $("#"+parentId).find(".search-owe").find(".form-horizontal").length;
                    if((paramCount-1)% 4 == 0){
                        $("#"+parentId).find("#advancedSrh").css("float","right");
                    }

                    $("#"+parentId).find("#advancedSrhBtn").html("<i class=\"fa fa-angle-double-up\"></i>&nbsp;&nbsp;普通搜索");
                }else{
                    $("#"+parentId).find(".generalSrh").hide();
                    $("#"+parentId).find("#advancedSrh").css("float","");
                    $("#"+parentId).find("#advancedSrhBtn").html("<i class=\"fa fa-angle-double-down\"></i>&nbsp;&nbsp;高级搜索");
                }
            });
        }
    };
    //判断是提供者 还是消费者
    var checkRole = function () {
        var roleId = -1 ;
        var meunsList = common.getCurrentUser()["menusList"];
        if(meunsList && meunsList.length>0){
            for(var i=0;i<meunsList.length;i++){
                var menu = meunsList[i];
                if(roleId < 0 && menu["url"]!=null && menu["url"].indexOf("biz/API/APIMgr/html/list.html")>=0){
                    roleId = 2;  //2 == 提供者
                }else if(roleId > 0 && menu["url"]!=null && menu["url"].indexOf("biz/API/APIMgr/html/list.html")>=0){
                    roleId = 3;  //3 == 即是提供者 也是消费者
                }

                if(roleId < 0 && menu["url"]!=null && menu["url"].indexOf("biz/API/orderMgr/html/list.html")>=0){
                    roleId = 1;  //1 == 消费者
                }else if(roleId > 0 && menu["url"]!=null && menu["url"].indexOf("biz/API/orderMgr/html/list.html")>=0){
                    roleId = 3;  //3 == 即是提供者 也是消费者
                }

                if(menu["childMenuCode"] && menu["childMenuCode"].length>0){
                   roleId = checkSubMenus(menu["childMenuCode"],roleId);
                }
            }
        }
        return roleId;
    }
    var checkSubMenus = function (subMenus,roleId) {
        for(var i=0;i<subMenus.length;i++){
            var menu = subMenus[i];
            if(roleId < 0 && menu["url"]!=null && menu["url"].indexOf("biz/API/APIMgr/html/list.html")>=0){
                roleId = 2;  //2 == 提供者
            }else if(roleId > 0 && menu["url"]!=null && menu["url"].indexOf("biz/API/APIMgr/html/list.html")>=0){
                roleId = 3;  //3 == 即是提供者 也是消费者
            }

            if(roleId < 0 && menu["url"]!=null && menu["url"].indexOf("biz/API/orderMgr/html/list.html")>=0){
                roleId = 1;  //1 == 消费者
            }else if(roleId > 0 && menu["url"]!=null && menu["url"].indexOf("biz/API/orderMgr/html/list.html")>=0){
                roleId = 3;  //3 == 即是提供者 也是消费者
            }

            if(menu["childMenuCode"] && menu["childMenuCode"].length>0){
                roleId = checkSubMenus(menu["childMenuCode"],roleId);
            }
        }
        return roleId;
    }
    return {
        searchParam:searchParam,
        checkRole:checkRole
    }
});





