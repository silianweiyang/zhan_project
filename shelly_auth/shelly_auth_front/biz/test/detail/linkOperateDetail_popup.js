define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var link_cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#linkOperatePopupDetail_cancel").unbind("click");
            $("#" + parentIds).find("#linkOperatePopupDetail_cancel").click(function () {
                $("#" + parentIds).find("#linkOperatePopupDetail_cancel").trigger("afterClick");
            });
        }
    };
    var link_saveBtn = {
        init:function (parentIds) {
            $("#" + parentIds).find("#linkOperatePopupDetail_saveBtn").unbind("click");
            $("#" + parentIds).find("#linkOperatePopupDetail_saveBtn").click(function () {
                systemParamGrid.getInst(parentIds).saveAll();
                inParamGrid.getInst(parentIds).saveAll();
                var sysData = systemParamGrid.getDataSource()["_data"];
                var inData = inParamGrid.getDataSource()["_data"];
                var gridData = {};gridData["sysParams"] = [],gridData["inParams"] = [];
                for(var i=0;i<inData.length;i++){
                    if(inData[i]["paramName"] =="" || inData[i]["paramValue"] == ""){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请完成下节点入参配置！"
                        });
                        return false;
                    }
                    gridData["inParams"].push({
                        "paramName": inData[i]["paramName"],
                        "paramValue": inData[i]["paramValue"],
                        "paramType": inData[i]["paramType"],
                        "ifNull":inData[i]["ifNull"]
                    });
                    if(inData[i]["paramType"]=="3"){
                        var flag = false;
                        for(var j=0;j<sysData.length;j++){
                            if(sysData[j]["paramName"] == inData[i]["paramName"]){
                                flag = true;
                                break;
                            }
                        }
                        if(!flag){
                            common.jqConfirm.alert({
                                title: 0,
                                content: "系统参数"+inData[i]["paramName"]+"不存在！"
                            });
                            return false;
                        }
                    }
                }
                for(var i=0;i<sysData.length;i++){
                    if(sysData[i]["paramName"] == "" || sysData[i]["paramValue"] == ""){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请完成系统参数配置！"
                        });
                        return false;
                    }
                    gridData["sysParams"].push({
                        "paramName": sysData[i]["paramName"],
                        "paramValue": sysData[i]["paramValue"],
                        "paramType": sysData[i]["paramType"],
                        "ifNull":sysData[i]["ifNull"]
                    });
                }
                var operatorId = $("#linkPopup_operatorId").val();
                $("#" + operatorId).attr("data",JSON.stringify(gridData));
                systemParamGrid.getInst(parentIds).setDataSource(null);
                inParamGrid.getInst(parentIds).setDataSource(null);
                $("#" + parentIds).find("#linkOperatePopupDetail_saveBtn").trigger("afterClick");
            });
        }
    }
    //入参tabstrip
    var linkOperatePopupDetail_tabstrip = {
        getInst: function (parentIds) {
            return $("#" + parentIds).find("#linkOperatePopupDetail_tabstrip").data("wandaTabStrip");
        },
        init:function (parentIds) {
            if($("#linkOperatePopupDetail_endFlag").val() == "true"){
                $("#linkOperatePopupDetail_tabstrip").find("li:eq(1)").text("输出参数");
            }else{
                $("#linkOperatePopup_tabstrip").find("li:eq(1)").text("下节点入参");
            }
            $("#" + parentIds).find("#linkOperatePopupDetail_tabstrip").wandaTabStrip({
                tabPosition: "top",
                animation: {open: {effects: "fadeIn"}}
            });
            if($("#linkOperatePopupDetail_endFlag").val() == "true"){
                var tabStrip = linkOperatePopupDetail_tabstrip.getInst(parentIds);
                tabStrip.disable(tabStrip.tabGroup.children().eq(0));
                linkOperatePopupDetail_tabstrip.getInst(parentIds).select(1);
            }else{
                var tabStrip = linkOperatePopupDetail_tabstrip.getInst(parentIds);
                tabStrip.enable(tabStrip.tabGroup.children().eq(0));
                linkOperatePopupDetail_tabstrip.getInst(parentIds).select(0);
            }
        }
    };
     //系统参数
    var systemParamGrid = {
        gridColums:[
            {
                field: "paramName",
                title: "<em class='color_red'>*</em>参数名",
                width: "230px"
            },
            {
                field: "paramValue",
                title: "<em class='color_red'>*</em>参数值"
            },
            {
                field: "paramType",
                title: "<em class='color_red'>*</em>参数类型",
                width: "150px"
            },
            {
                field: "ifNull",
                title: "<em class='color_red'>*</em>是否必填",
                width: "100px"
            }
        ],
        init:function (parentIds) {
            systemParamGrid.getInst(parentIds).init();
        },
        inst: {},
        getInst: function (parentIds) {
            if (systemParamGrid.inst) {
                systemParamGrid.inst = new wandaComp.wandaGrid("linkOperatePopupDetail_systemParamGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,false);
            }
            return systemParamGrid.inst;
        },
        isEditable:function () {
            var editArry = [];
            editArry[0] = {
                "name":"paramName",
                "type":"text",
                "readonly":false
            }
            editArry[1] = {
                "name":"paramValue",
                "type":"text",
                "readonly":false
            }
            editArry[2] = {
                "name":"paramType",
                "type":"select",
                "readonly":false,
                "values":[{"text":"常量", "value":"1"},{"text":"上节点输出", "value":"2"}]
            }
            editArry[3] = {
                "name":"ifNull",
                "type":"select",
                "readonly":false,
                "values":[{"text" :"是", "value" :"1"},{"text" :"否", "value" :"2"}]
            }
            return editArry;
        },
        getDataSource: function (number) {
            if (number) {
                return systemParamGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return systemParamGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            systemParamGrid.getInst().addRow();
        },
        addDataSource: function (dataArry) {
            var dataSource = systemParamGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "paramName": dataArry[i]["paramName"],
                    "paramValue": dataArry[i]["paramValue"],
                    "paramType": dataArry[i]["paramType"],
                    "ifNull":dataArry[i]["ifNull"]
                });
            }
        }
    };
    // 下节点入参
    var inParamGrid = {
        gridColums:[
            {
                field: "paramName",
                title: "<em class='color_red'>*</em>参数名",
                width: "230px"
            },
            {
                field: "paramValue",
                title: "<em class='color_red'>*</em>参数值"
            },
            {
                field: "paramType",
                title: "<em class='color_red'>*</em>参数类型",
                width: "150px"
            },
            {
                field: "ifNull",
                title: "<em class='color_red'>*</em>是否必填",
                width: "100px"
            }
        ],
        init:function (parentIds) {
            inParamGrid.getInst(parentIds).init();
        },
        inst: {},
        getInst: function (parentIds) {
            if (inParamGrid.inst) {
                inParamGrid.inst = new wandaComp.wandaGrid("linkOperatePopupDetail_inParamGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,false);
            }
            return inParamGrid.inst;
        },
        isEditable:function () {
            var editArry = [];
            editArry[0] = {
                "name":"paramName",
                "type":"text",
                "readonly":false
            }
            editArry[1] = {
                "name":"paramValue",
                "type":"text",
                "readonly":false
            }
            editArry[2] = {
                "name": "paramType",
                "type": "select",
                "readonly": false,
                "values": [{"text": "常量", "value": "1"}, {"text": "上节点输出", "value": "2"}, {"text": "系统", "value": "3"}]
            };
            editArry[3] = {
                "name":"ifNull",
                "type":"select",
                "readonly":false,
                "values":[{"text" :"是", "value" :"1"},{"text" :"否", "value" :"2"}]
            }
            return editArry;
        },
        getDataSource: function (number) {
            if (number) {
                return inParamGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return inParamGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var inData = inParamGrid.getDataSource()["_data"];
            var sysData = systemParamGrid.getDataSource()["_data"];
            for(var i=0;i<inData.length;i++){
                if(inData[i]["paramType"]=="3"){
                    var flag = false;
                    for(var j=0;j<sysData.length;j++){
                        if(sysData[j]["paramName"] == inData[i]["paramName"]){
                            flag = true;
                            break;
                        }
                    }
                    if(!flag){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "系统参数"+inData[i]["paramName"]+"不存在！"
                        });
                        return false;
                    }
                }
            }
            inParamGrid.getInst().addRow();
        },
        addDataSource: function (dataArry) {
            var dataSource = inParamGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "paramName": dataArry[i]["paramName"],
                    "paramValue": dataArry[i]["paramValue"],
                    "paramType": dataArry[i]["paramType"],
                    "ifNull":dataArry[i]["ifNull"]
                });
            }
        }
    };
    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        linkOperatePopupDetail_tabstrip.init(parentId);
        link_cancelBtn.init(parentId);
        systemParamGrid.init(parentId);
        inParamGrid.init(parentId);
    };
    return {
        init: init,
        systemParam:systemParamGrid,
        inParam:inParamGrid
    };
});

