var router;
require.config({
    baseUrl: "",
    paths: {
        "jquery": "lib/jquery-1.10.2",
        "nicescroll": "lib/jquery.nicescroll.min",
        "wanda": "lib/wandaui/js/kendo.wanda.min",
        "wandaCulture": "lib/wandaui/js/cultures/wanda.culture.zh-CN.min",
        "main": "lib/main",
        "common": "lib/common",
        "wandaComp": "lib/wandaComp",
        "wandaCompR": "lib/wandaCompReUse",
        "bootstrap": "lib/bootstrap-3.3.7/js/bootstrap.min",
        /*"myDatePicker": "lib/myDatePicker",*/
        "date_time_Picker": "lib/date_time_Picker",
        "jqConfirm": "lib/jqconfirm/jquery-confirm.min",
        "echarts": 'lib/echart3/echarts.min',
        "compont":"lib/commonCompont",
        "jqueryCorner":"lib/jquery.corner",
        "jsonpath":"lib/jsonpath",
        "xml2json":"lib/xml2json",
        "jqZtree":"lib/ztree/js/jquery.ztree.all.min",
        "Promise":"lib/bluebird/bluebird.min",
        "resize" :"lib/resize",
        "d3":"lib/d3.v3.min",
        "jquery-ui/ui/widget":"lib/upload/js/jquery.ui.widget",
        "jquery.iframe-transport":"lib/upload/js/jquery.iframe-transport",
        "fileupload":"lib/upload/js/jquery.fileupload",
        "jqueryui":"lib/jquery.flowchart/jquery-ui.min",
        "flowchart":"lib/jquery.flowchart/jquery.flowchart",
        "wdtree":"lib/ztree/js/wdtree"

    },
    shim: {
        jqConfirm: {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        resize: {
            deps: ['jquery'],
            exports: 'resize'
        },
        wanda: {
            deps: ['jquery'],
            exports: 'wanda'
        },
        nicescroll: {
            deps: ['jquery'],
            exports: 'nicescroll'
        },
        jqueryCorner: {
            deps: ['jquery'],
            exports: 'jqueryCorner'
        },
        jsonpath:{
            deps:['jquery'],
            exports:'jsonpath'
        },
        xml2json:{
            deps:['jquery'],
            exports:'xml2json'
        },
        jqZtree:{
            deps:['jquery'],
            exports:'jqZtree'
        },
        d3:{
            deps:['jquery'],
            exports:'d3'
        },
        fileupload:{
            deps:['jquery'],
            exports:'fileupload'
        },
        bootstrap:{
            deps:['jquery'],
            exports:'bootstrap'
        },
        jqueryui: {
            deps: ['jquery'],
            exports: 'jqueryui'
        },
        flowchart: {
            deps: ['jqueryui'],
            exports: 'flowchart'
        }

    }
});
require(["jquery", "common", "wandaComp", "wanda","resize"], function ($, common, wandaComp) {
    var routerInit = function () {
        if (window.location.hash != "") {
            window.location.href = "index.html";
        }else{
            menusToItem.init();
            wandaComp.routerControl.init("index", menusToItem.getItem());
            wandaComp.routerControl.addRoute("login", "Login.html");
            wandaComp.routerControl.addRoute("modifyUserPwd", "biz/html/modifyUserPwd.html");
        }
    };
    var menusToItem = {
        item: {},
        getItem: function () {
            return menusToItem.item;
        },
        setItem: function (menus) {
            if (menus) {
                for (var i = menus.length - 1; i >= 0; i--) {
                    var itemData = menus[i]["childMenuCode"];
                    var menuType = menus[i]["menuType"];
                    if (("1" == menuType && !itemData) || "2" == menuType) {
                        var mLoadUrl = function () {
                            $("script").nextAll().remove();
                            $("#main").load(arguments.callee.url);
                        };
                        mLoadUrl.url = menus[i].url;
                        menusToItem.item[menus[i].menuCode] = mLoadUrl;
                    } else {
                        menusToItem.setItem(itemData);
                    }
                }
            }

        },
        init: function () {
            var menus = common.getCurrentUser()["menusList"];
            menusToItem.setItem(menus);
        }
    }
    var initFun = function () {
        routerInit();
    };
    common.initExe("index", initFun);


});
