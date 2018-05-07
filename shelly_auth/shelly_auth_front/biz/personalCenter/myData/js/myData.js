define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/personalCenter/myData/js/myDataPopup"], function ($, common, compont, wandaComp, wandaCompR,myDataPopup) {
    //初始化用户授权码
    var authCode = {
        init:function(){
            var successFun = function(data){
                $("#authCode").html(data["authCode"]);
            }
            common.ajaxPost("myDataMgr/getAuthCode",null,successFun,null,false,null);
        }
    };

    //用户资源树
    var authResourceDir_tree = {
        wandaTreeView: "",
        queryDataCall: "",
        params: {
            "dirName": $("#resourceDirTree_name").val()
        },
        querySuccessFun: function(data) {
            console.log(data.datas);
            authResourceDir_tree.queryDataCall(data.datas);
        },
        queryErrorFun: function() {
            common.jqConfirm.alert({
                title: 0,
                content: "加载失败！"
            });
        },
        getSelectValue:{

        },
        onSelect: function(dataItem) {
            authResourceDir_tree.getSelectValue = dataItem;
            resourceTableListGrid.params = {
                "dirId":dataItem["dirId"]
            }
            resourceTableListGrid.refreshDatas();
            // authResourceDir_tree.refreshDatas();
        },
        queryData: function(id, fun) {
            authResourceDir_tree.queryDataCall = fun;
            authResourceDir_tree.params.pdirId = id;
            common.ajaxPost("myDataMgr/loadResourceTree",authResourceDir_tree.params, authResourceDir_tree.querySuccessFun, authResourceDir_tree.queryErrorFun, null, $("#resourceCfgList"));
        },
        option: null,
        init: function() {
            authResourceDir_tree.option = {
                childKey: "children",
                textKey: "dirName",
                noCache: false,
                treeDom: $("#authResourceDir_tree"),
                queryKey: "dirId",
                openKey:"open",
                checkKey:"checked",
                queryData: authResourceDir_tree.queryData,
                onSelect: authResourceDir_tree.onSelect,
                template: "<span style='color: #= item.color #'>#= item.dirName # </span>"
            };
            authResourceDir_tree.wandaTreeView = new wandaComp.wandaTreeView(authResourceDir_tree.option);
            authResourceDir_tree.wandaTreeView.init();
        },
        reloadTree: function(dirId) {
            authResourceDir_tree.wandaTreeView.refresh(dirId);
        }
    };
    //树查询按钮
    var resourceDirTreeList_dirSearch ={
        init: function () {
            $("#resourceDirTreeList_dirSearch").click(function() {
                $("#authResourceDir_tree").empty();
                authResourceDir_tree.params.dirName = $("#resourceDirTree_name").val();
                authResourceDir_tree.init();
            });
        }
    };

    var resourceTableListGrid = {
        params:{

        },
        init:function(){
            var successFun = function(data){
                $("#resourceTableListGrid").empty();
                var tables = data.datas;
                var html = "";
                for (var i=0;i<tables.length;i++){
                    var table = tables[i];
                    if(table["ISENABLE"]=="1"){
                        html+="<div class=\"col-lg-6 tableItem_div\">\n" +
                            "                <input type=\"checkbox\" class=\"input_style\"/>\n" +
                            "                <p class=\"tableName_div\">"+table["RESTABLE_NAME"]+"</p>\n" +
                            "                <p style='margin-left: 5px;color:black;float: right'>(授权时间截止："+table["END_TIME"]+")</p>"+
                            "                <a style='float: right;' onclick=\"resourceList_applyDataBtn(\'"+table["AUTH_ID"]+"\',\'"+table["RES_ID"]+"\',\'"+table["END_TIME"]+"\')\" class='fa fa-database fa_icon' title='申请数据'></a>"+
                            "                <a class=\"fa fa-eye fa_icon\"  onclick=\"showResourceData(\'"+table["AUTH_ID"]+"\',\'"+table["RES_ID"]+"\',\'"+table["END_TIME"]+"\')\" style=\"color: rgb(102, 165, 174);float: right;\" title='查看表数据'></a>\n" +
                            "                <a style='float: right;' href='javascript:void(0)' class='fa fa-table fa_icon' title='查看表概览'></a>\n" +
                            "            </div>";
                    }else if(table["ISENABLE"]=="0"){
                        html+="<div class=\"col-lg-6 tableItem_div\">\n" +
                            "                <input type=\"checkbox\" class=\"input_style\"/>\n" +
                            "                <p class=\"tableName_div\">"+table["RESTABLE_NAME"]+"</p>\n" +
                            "                <p style='margin-left: 5px;color: darkgray;float: right'>(授权时间截止："+table["END_TIME"]+")</p>"+
                            "                <a style='float: right;color:darkgray;'href=\"javascript:void(0);\" class='fa fa-database fa_icon' title='申请数据'></a>" +
                            "                <a class=\"fa fa-eye fa_icon\" href=\"javascript:void(0);\" style=\"color:darkgray;float: right;\" title='查看表数据'></a>\n" +
                            "                <a style='color:darkgray;float: right;' class='fa fa-table fa_icon' href=\"javascript:void(0);\" title='查看表概览'></a>\n" +
                            "            </div>";
                    }

                }
                $("#resourceTableListGrid").html(html);
            };

            common.ajaxPost("myDataMgr/loadTableList",resourceTableListGrid.params, successFun, null, false, null);
        },
        refreshDatas:function(){
            resourceTableListGrid.init();
        }
    };
    //初始化表名搜索按钮
    var resourceDirList_searchBtn = {
        init: function () {
            $("#resourceDirList_searchBtn").click(function () {
                var tableName = $("#resourceDirList_searchTableName").val();
                resourceTableListGrid.params = {
                    "tableName":tableName
                };
                resourceTableListGrid.refreshDatas();
            });
        }
    };
    //弹出框
    var resourceList_detailBtn = {
        inst: {},
        optionObj: {
            minWidth: 900,
            minHeight: 550,
            maxWidth: 900,
            maxHeight: "",
            title: "查看",
            content: "biz/personalCenter/myData/html/myData_popup.html"
        },
        getInst: function () {
            if (resourceList_detailBtn.inst) {
                resourceList_detailBtn.inst = new wandaComp.wandaWindow("resourceList_detailBtn", "resourceTable_popup", resourceList_detailBtn.optionObj);
            }
            return resourceList_detailBtn.inst;
        },
        getGridSelectValue: function () {
            return resourceTableListGrid.getInst().getSelect();
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#resourceTable_popup").data("wandaWindow");
            plusPopup.close();
            resourceList_detailBtn.refreshDatas();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#resourceTable_popup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            resourceList_detailBtn.getInst().init(function () {
                common.initExeByAttr("resourceTable_popup", "opt='search'", function () {
                    myDataPopup.init("resourceTable_popup",showDataAuthId,showDataResId,showDataEndTime,"showData");
                });
            });
        }
    };

    //申请数据弹出框
    var dataApply_popup = {
        inst: {},
        optionObj: {
            minWidth: 900,
            minHeight: 550,
            maxWidth: 900,
            maxHeight: "",
            title: "申请数据",
            content: "biz/personalCenter/myData/html/myData_popup.html"
        },
        getInst: function () {
            if (dataApply_popup.inst) {
                dataApply_popup.inst = new wandaComp.wandaWindow("resourceList_applyDataBtn", "resourceTable_popup", dataApply_popup.optionObj);
            }
            return dataApply_popup.inst;
        },
        getGridSelectValue: function () {
            return resourceTableListGrid.getInst().getSelect();
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#resourceTable_popup").data("wandaWindow");
            plusPopup.close();
            dataApply_popup.refreshDatas();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#resourceTable_popup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            dataApply_popup.getInst().init(function () {
                common.initExeByAttr("resourceTable_popup", "opt='search'", function () {
                    myDataPopup.init("resourceTable_popup",showDataAuthId,showDataResId,showDataEndTime,"applyData");
                });
            });
        }
    };
    var init = function () {
        wandaComp.elementControl($("#myDataList"));
        authCode.init();
        authResourceDir_tree.params={};
        resourceTableListGrid.params={};
        authResourceDir_tree.init();
        resourceDirTreeList_dirSearch.init();
        resourceTableListGrid.init();
        resourceDirList_searchBtn.init();
        resourceList_detailBtn.init();
        dataApply_popup.init();
    };
    return {
        init: init
    }
});

var showDataAuthId = "";
var showDataResId = "";
var showDataEndTime = "";
function showResourceData(authId,resId,endTime){
    showDataAuthId = authId;
    showDataResId = resId;
    showDataEndTime = endTime;
    $("#resourceList_detailBtn").trigger("click");
};
function resourceList_applyDataBtn(authId,resId,endTime){
    showDataAuthId = authId;
    showDataResId = resId;
    showDataEndTime = endTime;
    $("#resourceList_applyDataBtn").trigger("click");
}