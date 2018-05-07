define(["jquery", "common", "wandaComp","biz/test/decide_content_popup"], function ($, common, wandaComp,decideConst) {
    var decidePopup_validate = {
        helper:null,
        init:function (parentIds) {
            decidePopup_validate.helper =  wandaComp.commonValidator("decidePopup");
        }
    }
    // 判断条件设置页面取消按钮
    var decidePopup_cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#decidePopup_cancel").unbind("click");
            $("#" + parentIds).find("#decidePopup_cancel").click(function () {
                $("#" + parentIds).find("#decidePopup_cancel").trigger("afterClick");
            });
        }
    };
    // 判断条件设置页面保存按钮
    var decidePopup_saveBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#decidePopup_saveBtn").unbind("click");
            $("#" + parentIds).find("#decidePopup_saveBtn").click(function () {
                if(decidePopup_validate.helper.validate()){
                    var patter = /^[A-Za-z0-9-_.~!@#$%^&*+=]*$/;
                    var decidePopupName = $("#decidePopup_name").val();

                    var items = decidePopup_tabstrip.dataSource,decidData = {};
                    decidData["name"] = $("#decidePopup_name").val();
                    decidData["desc"] = $("#decidePopup_desc").val();
                    decidData["data"] = [];
                    for(var k=0;k<items.length;k++){
                        var obj = items[k];
                        decidData["data"][k] = {};
                        decidData["data"][k]["id"] = obj["id"];
                        decidData["data"][k]["type"] = obj["type"];
                        //decidData[k]["data"] = obj["data"];

                        var relation = $("#decidePopup_tabstrip-"+(k+1)).find('input[name='+obj["id"]+'_relation]:checked').val();
                        try{
                            decideConst.decideContGrid.getInst("decideContPopup_"+obj["id"]).saveAll();
                            var data = decideConst.decideContGrid.getDataSource(null,"decideContPopup_"+obj["id"])["_data"];
                            var girdData = [];
                            if (data && data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i]["PATH"] == "" || data[i]["VALUE"] == "") {
                                        common.jqConfirm.alert({
                                            title: 0,
                                            content: "请完成条件判断设置！"
                                        });
                                        return false;
                                    }
                                    if(!patter.test(data[i]["PATH"].trim())){
                                        common.jqConfirm.alert({
                                            title: 0,
                                            content: "参数路径\""+data[i]["PATH"]+"\"格式不正确！"
                                        });
                                        return false;
                                    }
                                    if(data[i]["TYPE"] == "number"){
                                        if(!Number(data[i]["VALUE"])){
                                            common.jqConfirm.alert({
                                                title: 0,
                                                content: obj["collectName"]+"的第"+(i+1)+"行参数值不是number类型"
                                            });
                                            return false;
                                        }
                                    }
                                    girdData.push({
                                        "SOURCE":data[i]["SOURCE"],
                                        "PATH": data[i]["PATH"],
                                        "DECIDE": data[i]["DECIDE"],
                                        "TYPE": data[i]["TYPE"],
                                        "VALUE": data[i]["VALUE"]
                                    });
                                }
                            }else{
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "请完成条件判断设置！"
                                });
                                return false;
                            }
                            decidData["data"][k]["expression"] = girdData;
                            decidData["data"][k]["relation"] = relation;
                        }catch (e){
                            decidePopup_tabstrip.getInst().select(i);  //如果tabstrip列表不打开，页面内容就没办法加载
                            var ifSetting = false;
                            var operateId = $("#decidePopup_operatorId").val();
                            var decideData = $("#"+operateId).attr("data");
                            if(decideData == undefined){
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "请完成条件判断设置！"
                                });
                                return false;
                            }
                            var dataJson = JSON.parse(decideData);
                            var relationArry = dataJson["data"];
                            for(var i=0;i<relationArry.length;i++){
                                if(relationArry[i]["id"] == obj["id"]){
                                    ifSetting = true;
                                    decidData["data"][k]["relation"] = relationArry[i]["relation"];
                                    decidData["data"][k]["expression"] = relationArry[i]["expression"];
                                    break;
                                }
                            }
                            if(!ifSetting){
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "请完成条件判断设置！"
                                });
                                return false;
                            }
                        }
                    }

                    var operatorId = $("#decidePopup_operatorId").val();
                    $("#" + operatorId).attr("data", JSON.stringify(decidData));
                    decidePopup_clearData();
                    $("#decidePopup_saveBtn").attr("data",decidePopupName);
                    $("#" + parentIds).find("#decidePopup_saveBtn").trigger("afterClick");
                }
            });
        }
    };
    // 判断条件设置页面清除数据
    var decidePopup_clearData = function () {
        var items = decidePopup_tabstrip.dataSource;
        for(var i=0;i<items.length;i++){
            var obj = items[i];
            decideConst.decideContGrid.getInst("decideContPopup_"+obj["id"]).setDataSource(null);
        }
        decidePopup_tabstrip.dataSource = [];
        $("#decidePopup_name").val("");
        $("#decidePopup_desc").val("");
    }
    // 判断条件设置页面 连接关系tabstrip
    var decidePopup_tabstrip = {
        paramValueData:[],
        dataSource:[],
        getInst: function () {
            return $("#decidePopup_tabstrip").data("wandaTabStrip");
        },
        init:function (parentId) {
            $("#decidePopup_tabstrip").wandaTabStrip({
                tabPosition: "left",
                dataTextField: "collectName",
                dataContentUrlField: "contentUrl",
                animation: {open: {effects: "fadeIn"}},
                contentLoad: decidePopup_tabstrip.onContentLoad
            })
        },
        onContentLoad: function (e) {
            decideConst.decideContGrid.paramValueData = [];
            var item = e.item;
            var obj = e.sender.dataSource._view[$(item).index()];
            var operateId = $("#decidePopup_operatorId").val();
            var decideData = $("#"+operateId).attr("data");

            /************    动态修改tabstrip 内容的id 和name ***************/
            $("#decidePopup_tabstrip-"+($(item).index()+1)).css("height","320px").css("overflow","auto");
            $("#decidePopup_tabstrip-"+($(item).index()+1)).find("input[type=radio]").attr("name",obj["id"]+"_relation");
            $("#decideContPopup_grid").attr("id","decideContPopup_"+obj["id"]);
            $("#decideContPopup_grid_dataAdd").attr("id","decideContPopup_dataAdd_"+obj["id"]).attr("data","decideContPopup_"+obj["id"]);
            decideConst.decideContGrid.paramValueData = decidePopup_tabstrip.paramValueData;
            $("#decidePopup_objId").val("decideContPopup_"+obj["id"]);
            decideConst.decideContGrid.init("decideContPopup_"+obj["id"]);
            decideConst.decideContAdd.init("decideContPopup_dataAdd_"+obj["id"]);
            /**************** 动态修改tabstrip 内容的id 和name ************/

            if(decideData){
                var dataJson = JSON.parse(decideData);
                $("#decidePopup_name").val(dataJson["name"]);
                $("#decidePopup_desc").val(dataJson["desc"]);
                var relationArry = dataJson["data"];
                for(var i=0;i<relationArry.length;i++){
                    if(relationArry[i]["id"] == obj["id"]){
                        decideConst.decideContGrid.addDataSource(null,"decideContPopup_"+obj["id"],relationArry[i]["expression"]);
                        $("#decidePopup_tabstrip-"+($(item).index()+1)).find('input[name='+obj["id"]+"_relation"+'][value=\"'+relationArry[i]["relation"]+'\"]').prop("checked", "checked");
                    }
                }
            }
        },
        append: function (data) {
            decidePopup_tabstrip.dataSource = [];
            for (var i = 0; i < data.length; i++) {
                decidePopup_tabstrip.dataSource[i] = data[i];
                decidePopup_tabstrip.dataSource[i]["contentUrl"] = "biz/test/decide_content_popup.html";
            }
            decidePopup_tabstrip.getInst().setDataSource(decidePopup_tabstrip.dataSource);
            decidePopup_tabstrip.getInst().select("li:first");
        }
    }
    // 判断条件设置页面 初始化
    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        decidePopup_validate.init(parentId);
        decidePopup_cancelBtn.init(parentId);
        decidePopup_saveBtn.init(parentId);
        decidePopup_tabstrip.init(parentId);
    };
    return {
        init: init,
        tabstrip:decidePopup_tabstrip
    };
});

