define(["jquery", "common", "wandaComp","biz/test/detail/decideDetail_content_popup"], function ($, common, wandaComp,decideDetailConst) {
    var decidePopupDetail_validate = {
        helper:null,
        init:function (parentIds) {
            decidePopupDetail_validate.helper =  wandaComp.commonValidator("decidePopupDetail");
        }
    }
    // 判断条件设置页面取消按钮
    var decidePopupDetail_cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#decidePopupDetail_cancel").unbind("click");
            $("#" + parentIds).find("#decidePopupDetail_cancel").click(function () {
                $("#" + parentIds).find("#decidePopupDetail_cancel").trigger("afterClick");
            });
        }
    };
    // 判断条件设置页面清除数据
    var decidePopupDetail_clearData = function () {
        var items = decidePopupDetail_tabstrip.dataSource;
        for(var i=0;i<items.length;i++){
            var obj = items[i];
            decideDetailConst.decideContGrid.getInst("decideContPopup_"+obj["id"]).setDataSource(null);
        }
        decidePopupDetail_tabstrip.dataSource = [];
    }
    // 判断条件设置页面 连接关系tabstrip
    var decidePopupDetail_tabstrip = {
        dataSource:[],
        getInst: function () {
            return $("#decidePopupDetail_tabstrip").data("wandaTabStrip");
        },
        init:function (parentId) {
            $("#decidePopupDetail_tabstrip").wandaTabStrip({
                tabPosition: "left",
                dataTextField: "collectName",
                dataContentUrlField: "contentUrl",
                animation: {open: {effects: "fadeIn"}},
                contentLoad: decidePopupDetail_tabstrip.onContentLoad
            })
        },
        onContentLoad: function (e) {
            var item = e.item;
            var obj = e.sender.dataSource._view[$(item).index()];
            var operateId = $("#decidePopupDetail_operatorId").val();
            var decideData = $("#"+operateId).attr("data");

            /************    动态修改tabstrip 内容的id 和name ***************/
            $("#decidePopupDetail_tabstrip-"+($(item).index()+1)).css("height","320px").css("overflow","auto");
            $("#decidePopupDetail_tabstrip-"+($(item).index()+1)).find("input[type=radio]").attr("name",obj["id"]+"_relation");
            $("#decideDetailContPopup_grid").attr("id","decideDetailContPopup_"+obj["id"]);
            decideDetailConst.decideContGrid.init("decideDetailContPopup_"+obj["id"]);
            /**************** 动态修改tabstrip 内容的id 和name ************/

            if(decideData){
                var dataJson = JSON.parse(decideData);
                $("#decidePopupDetail_name").val(dataJson["name"]);
                $("#decidePopupDetail_desc").val(dataJson["desc"]);
                var relationArry = dataJson["data"];
                for(var i=0;i<relationArry.length;i++){
                    if(relationArry[i]["id"] == obj["id"]){
                        decideDetailConst.decideContGrid.addDataSource(null,"decideDetailContPopup_"+obj["id"],relationArry[i]["expression"]);
                        $("#decidePopupDetail_tabstrip-"+($(item).index()+1)).find('input[name='+obj["id"]+"_relation"+'][value=\"'+relationArry[i]["relation"]+'\"]').prop("checked", "checked");
                    }
                }
            }
        },
        append: function (data) {
            decidePopupDetail_tabstrip.dataSource = [];
            for (var i = 0; i < data.length; i++) {
                decidePopupDetail_tabstrip.dataSource[i] = data[i];
                decidePopupDetail_tabstrip.dataSource[i]["contentUrl"] = "biz/test/detail/decideDetail_content_popup.html";
            }
            decidePopupDetail_tabstrip.getInst().setDataSource(decidePopupDetail_tabstrip.dataSource);
            decidePopupDetail_tabstrip.getInst().select("li:first");
        }
    }
    // 判断条件设置页面 初始化
    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        decidePopupDetail_validate.init(parentId);
        decidePopupDetail_cancelBtn.init(parentId);
        decidePopupDetail_tabstrip.init(parentId);
    };
    return {
        init: init,
        tabstrip:decidePopupDetail_tabstrip
    };
});

