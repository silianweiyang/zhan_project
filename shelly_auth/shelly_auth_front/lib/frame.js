require(["jquery", "nicescroll", "main", "wandaComp", "common"], function ($, nicescroll, main, wandaComp, common) {
    var initTop = main.topPage.init;
    var initLeft = main.leftPage.init;
    var initBar = main.mainPage.initBar;
    $(document).ready(function () {
        $("#top").load("frame/top.html", function () {
            var currentUser = common.getCurrentUser();
            var superRoleCode = currentUser["superRoleCode"];

            var role_id = common.getCurrentUser().roleMap[superRoleCode];//管理员权限
            initTop();
            $("#leftDiv").load("frame/left.html", initLeft);
            if(role_id != undefined){
               //$("#main").load("biz/index/admin.html");
            }else{
                //$("#main").load("biz/index/contentLg.html");
            }
            $("#main").load("test/test.html");//暂时使用
            $("#bar").load("frame/bar.html", initBar);
        });
    });


});