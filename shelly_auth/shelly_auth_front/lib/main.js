var leftPage, mainPage, topPage
define(["jquery", "common"], function ($, common) {
    leftPage = {
        menuItems: [],
        resizeAll: function () {
            $("#main-nav li").unbind("click");
            $("#main-nav li").bind('click',function (e) {
                e.stopPropagation();
                var id = $(this).parents('ul').attr('id');
                if($(this).hasClass("close-item")){
                    $(this).removeClass("close-item").addClass("open-item").addClass("active-item");
                    if("main-nav" == id){
                        $($(this).siblings()).removeClass('open-item').removeClass("active-item").addClass("close-item");
                        $(this).siblings().each(function (i,e) {
                            if($(this).children("ul").children("li").hasClass("has-child-item")){
                                $(this).children("ul").children("li").removeClass('open-item').removeClass("active-item");
                                $(this).children("ul").children("li").children("ul").children("li").removeClass("active-item");
                                $(this).children("ul").children("li").children("ul").children("li").children("a").removeClass("a_hover");
                                $(this).children("ul").children("li").children("a").removeClass("a_hover");
                            }
                            $(this).children("ul").children("li").removeClass("active-item");
                            $(this).children("ul").children("li").children("a").removeClass("a_hover");
                        });
                    }else{
                        $(this).children("a").addClass("a_hover");
                    }
                }else if($(this).hasClass("open-item")){
                    $(this).removeClass("open-item").removeClass("active-item").addClass("close-item");
                    if("main-nav" != id){
                        //$(this).children("a").removeClass("a_hover");
                    }
                }else{
                    $(this).siblings().each(function (i,e) {
                        $(this).removeClass("open-item").removeClass("active-item");
                        if($(this).hasClass("has-child-item")){
                            $(this).addClass("close-item");
                            $(this).children("ul").children("li").removeClass("active-item");
                            $(this).children("ul").children("li").children("a").removeClass("a_hover");
                        }
                        $(this).children("a").removeClass("a_hover");
                    });
                    $(this).parent("ul").parent("li").siblings().each(function (i,e) {
                        $(this).removeClass("open-item").removeClass("active-item");
                        if($(this).hasClass("has-child-item")){
                            $(this).addClass("close-item");
                        }
                        $(this).children("a").removeClass("a_hover");
                    });
                    $(this).addClass("active-item");
                    //$(this).parent("ul").parent("li").siblings().removeClass("open-item").removeClass("active-item");
                    $(this).children("a").addClass("a_hover");
                    //$($(this).siblings()).removeClass("open-item").removeClass("active-item");

                    $("#bar").show();
                    //$("#mainDiv").removeClass("content2");

                    $("#currentPoint a:gt(0)").remove();
                    var currentName = $(this).children("a").text();
                    $("#main-nav .open-item").each(function (i,e) {
                        $("#currentPoint").append("<a>&nbsp;&nbsp;--&nbsp;&nbsp;"+$(this).children("a").text()+"</a>");
                    });
                    $("#currentPoint").append("<a>&nbsp;&nbsp;--&nbsp;&nbsp;"+currentName+"</a>");
                    $("#notice-headerbox").show();
                    $("#notice-headerbox-separator").show();

                    if($(this).attr("id")=='indexMenuLi'){
                        //$("#mainDiv").addClass("content2");
                        $("#bar").hide();
                        $("#notice-headerbox").hide();
                        $("#notice-headerbox-separator").hide();
                        var currentUser = common.getCurrentUser();
                        var superRoleCode = currentUser["superRoleCode"];
                        var role_id = common.getCurrentUser().roleMap[superRoleCode];//管理员权限
                        if(role_id !== undefined){
                            router.navigate("1002");
                        }else{
                            router.navigate("DT_SFETY_INDEX");
                        }
                        return false;
                    }else{
                        router.navigate($(this).attr("value"));
                    }
                    return false;
                }
                if($(this).attr("id")=='indexMenuLi'){
                    //$("#mainDiv").addClass("content2");
                    $("#bar").hide();
                    $("#notice-headerbox").hide();
                    $("#notice-headerbox-separator").hide();
                    var currentUser = common.getCurrentUser();
                    var superRoleCode = currentUser["superRoleCode"];
                    var role_id = common.getCurrentUser().roleMap[superRoleCode];//管理员权限
                    if(role_id !== undefined){
                        router.navigate("1002");
                     }else{
                        router.navigate("DT_SFETY_INDEX");
                     }
                }
                return false;
            });
            //$("#indexMenuLi").trigger("click");
        },
        init: function () {
            var iClass = ["fa-database","fa-edit","fa-sort-amount-asc","fa-wpforms","fa-address-book-o","fa-laptop"];
            var menus = leftPage.queryMenu();
            var count = 0;
            var menuHTML = "<li class='active-item' value='DT_SFETY_INDEX' id='indexMenuLi'><a href=\"javascript:void(0)\"><i class=\"fa fa-home\" aria-hidden=\"true\"></i><span>数据安全管控平台</span></a></li>";
            if(menus){
                for(var i = menus.length-1;i >=0; i--){
                    var menuObj = menus[i];
                    if(menuObj["menuType"] == "1"){
                        var level = Number(menuObj["level"]);   //菜单级别
                        var seq = Number(menuObj["seq"].substring(2*level-2,2*level))-1;  //菜单顺序
                        menuHTML += "<li class=\"has-child-item  close-item\"><a><i class=\"fa "+iClass[seq]+"\" aria-hidden=\"true\"></i><span>"+menuObj["menuName"]+"</span></a>";
                        count++;
                        var childMenu = menuObj["childMenuCode"];
                        if(childMenu){
                            menuHTML += leftPage.subMenu(childMenu,1);
                        }
                        menuHTML += "</li>";
                    }
                }
                $("#main-nav").html(menuHTML);
                leftPage.resizeAll();
            }
        },
        queryMenu: function () {
            var menus = common.getCurrentUser()["menusList"];
            return menus;
        },
        subMenu: function (menus,level) {
            var subMenuHTML = "<ul class=\"nav child-nav level-"+level+"\">";
            for(var i = menus.length-1;i >=0; i--){
                var menuObj = menus[i];
                var childMenu = menuObj["childMenuCode"];
                if(childMenu){
                    subMenuHTML += "<li  class=\"has-child-item close-item\"><a href=\"javascript:void(0);\">"+menuObj["menuName"]+"</a>";
                }else{
                    subMenuHTML += "<li value='"+menuObj["menuCode"]+"'><a href=\"javascript:void(0);\">"+menuObj["menuName"]+"</a>";
                }
                if(childMenu){
                    subMenuHTML += leftPage.subMenu(childMenu,(level+1));
                }
                subMenuHTML += "</li>";
            }
            subMenuHTML += "</ul>";
            return subMenuHTML;
        },
        loadURL:function (menuCode,openType,url,obj) {
            $("#currentPoint a:gt(0)").remove();
            var currentName = $(obj).text();
            $("#main-nav .open-item").each(function (i,e) {
                $("#currentPoint a:eq(0)").append("<a>&nbsp;&nbsp;--&nbsp;&nbsp;"+$(this).children("a").text()+"</a>");
            });
            $("#currentPoint").append("<a>&nbsp;&nbsp;--&nbsp;&nbsp;"+currentName+"</a>");
            if("1" === openType){
                router.navigate(menuCode);
            }else{
                var params={"url":url};
                common.setRouterParams(params);
                router.navigate(menuCode);
            }
        },
        toggleShow: function (_this) {
            if ($(_this).parent().children().hasClass("middle_list")) {
                $(_this).toggleClass("open");
                $(_this).next('ol').toggle();
            }
            var a = $(_this).parent().parent().parent().siblings().children().children().removeClass('cur');
            $(_this).parent().addClass('cur').siblings().removeClass('cur');
        },
        openTab: function (id, name, url) {
            mainPage.openTab(id, name, url);
        }
    };

    mainPage = {
        closeTabListeners: [],
        tabOpened:[],

        openTab: function (id, name, url, callBack) {
            var tabDiv = $("#tabstrip");
            var tabStrip = tabDiv.wandaTabStrip();
            var tabNbr = tabStrip.data("wandaTabStrip").items().length;

            var opened = tabDiv.find("ul").find("li").filter("." + id);
            if (opened.length > 0) {
                opened.addClass("newTab");
                mainPage.resizeAll();
                //$.each(mainPage.tabOpened,function(index,item){
                //    // index是索引值（即下标）   item是每次遍历得到的值；
                //    if(item==id){
                //        mainPage.tabOpened.splice(index,1);
                //    }
                //});
                //mainPage.tabOpened.push(id);
            } else
            {
                if (tabNbr > 7) {
                    alert("打开页面数已超出限制范围！")
                    return;
                }
                var headSpan = $("<span/>");
                var tabHead = $("<li/>");
                headSpan.text(name);
                tabHead.addClass("newTab");
                tabHead.addClass(id);
                tabHead.attr("tabId", id);
                headSpan.appendTo(tabHead);
                tabDiv.children("ul").append(tabHead);
                var tabMidContent = $("<div/>");
                tabMidContent.addClass("tabContentHeight");
                var tabContent = $("<div/>");
                tabMidContent.load( url, function () {
                    if ('undefined' != (typeof callBack)) {
                        callBack(id, name, url);
                    }
                    ;

                });
                tabContent.append(tabMidContent);
                tabDiv.append(tabContent);
                tabStrip = $("#tabstrip").wandaTabStrip();
                tabStrip.data("wandaTabStrip").reload('.newTab');

                //加滚动条
                mainPage.resizeAll();
                var scroll = $(".tabContentHeight").niceScroll({
                    autohidemode: false,
                    cursorborder: "3px solid #9AB8E5",
                    cursorcolor: "#9AB8E5",
                    boxzoom: false
                });
                var currentScrollId = scroll[scroll.length - 1].id;
                var listener = {
                    "id": id, "func": function () {
                        $("#" + currentScrollId).remove();
                        $("#" + currentScrollId + "-hr").remove();
                    }
                };
                mainPage.closeTabListeners.push(listener);
              //  mainPage.tabOpened.push(id);
            }
            tabStrip.data("wandaTabStrip").select('.newTab');
            tabDiv.find('.newTab').click();



        },
        resizeAll: function () {

            var winHeight = ' height:' + ($(window).height() - $("#top")[0].offsetHeight - 10) + 'px';
            var style = $(".tabContentHeight").attr("style");
            if (style) {
                style = style.replace(/\height(.*?)\px/g, "");
                style = style.replace(/\HEIGHT(.*?)\px/g, "");
            } else {
                style = "";
            }
            $(".tabContentHeight").attr("style", style + winHeight);
        },
        initTab: function () {
            var tabStrip = $("#tabstrip").wandaTabStrip({
                scrollable: false
            }).data("wandaTabStrip");
            $("#tabstrip").on("click", function () {
                var a = $(".newTab");
                if (a.length > 0) {
                    a.removeClass("newTab");
                    $("#tabstrip").find(".k-i-close").parents(".k-item").addClass("k-header");
                    $("#tabstrip").find(".k-i-close").parents(".k-item").find(".k-i-close").remove();
                    var colseDom = $("<span/>");
                    colseDom.attr("class", "k-icon k-i-close ");
                    $(a.find(".k-link")).append(colseDom);
                   var selectTabId= a.attr("tabId");
                    $.each(mainPage.tabOpened,function(index,item){
                        // index是索引值（即下标）   item是每次遍历得到的值；
                        if(item==selectTabId){
                            mainPage.tabOpened.splice(index,1);
                        }
                    });
                    mainPage.tabOpened.push(selectTabId);


                    $("#tabstrip").find(".k-i-close").parents(".k-item").removeClass("k-header");
                }
            });
            mainPage.resizeAll();
        },
        addCloseTabListener: function (tabId, func) {
            var listener = {"id": tabId, "func": func};
            mainPage.closeTabListeners.push(listener);
        },

        closeTab: function (tabStrip, tab) {
            var popId = mainPage.tabOpened.pop();
            var closeId = $(tab).attr("tabid");
            if(!closeId){
                closeId = $(tab).parents(".k-item").attr("tabid");
            }
            if(closeId!=popId){
                mainPage.tabOpened.push(popId);
                return;
            }
            var tabId = mainPage.tabOpened[mainPage.tabOpened.length-1];
           var otherTab = $("[tabid='"+tabId+"']");
           var firstTab =  $("#tabstrip").find("#firstPage").parents(".k-item");
            var isFirstTab = otherTab.length ? false : true;
           otherTab = otherTab.length ? otherTab : firstTab;
            tabStrip.remove(tab);
            tabStrip.select(otherTab);
            if (!isFirstTab) {
                var colseDom = $("<span/>");
                colseDom.attr("class", "k-icon k-i-close");
                otherTab.find(".k-link").append(colseDom);
                $("#tabstrip").find(".k-i-close").parents(".k-item").removeClass("k-header");
            } else {
                firstTab.removeClass("k-header");
            }

            var funcs = mainPage.closeTabListeners;
            for (var i = 0; i < funcs.length; i++) {
                var has = tab.hasClass(funcs[i]["id"]);
                if (has) {
                    funcs[i]["func"]();
                    mainPage.closeTabListeners.splice(i, 1);
                    i--;
                }

            }


        },
        initBar: function (e) {
        },
        initPage: function () {
            mainPage.initTab();
        }
    }


    topPage = {
        init: function () {
            $("#operDocument").attr("href", common.baseUrl + "download/fileDownload?fileName=operDocument");
            $("#signUpBtn").on("click", function () {
                common.login.signUp();
            });
            var user = common.getCurrentUser();
            if(user && user["userInfo"]){
                $("#userHello").text(user["userInfo"].userName);
            }
        }
    }


    return {
        leftPage: leftPage,
        mainPage: mainPage,
        topPage: topPage
    }
});






















