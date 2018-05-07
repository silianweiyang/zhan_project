define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var queryALLSysExceptCurrent = function () {
        var operatorId = $("#linkOperatePopup_operatorId").val();
        var sysAllData = [],sysAndLinkMap = {};
        $(".flowchart-link").each(function (index,obj) {
            if($(this).attr("id") != operatorId){
                var data = $(this).attr("data");
                if(data){
                    var dataJson = JSON.parse(data);
                    if(dataJson && dataJson["sysParams"]){
                        var sysData = dataJson["sysParams"];
                        for(var i=0;i<sysData.length;i++){
                            sysAllData.push(sysData[i]["paramName"]);
                            sysAndLinkMap[sysData[i]["paramName"]] = $(this).attr("data-link_id");
                        }
                    }
                }
            }
        });
        return sysAndLinkMap;
    }
    //取消按钮
    var link_cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#linkOperatePopup_cancel").unbind("click");
            $("#" + parentIds).find("#linkOperatePopup_cancel").click(function () {
                systemParamGrid.editArry = [];
                $("#" + parentIds).find("#linkOperatePopup_cancel").trigger("afterClick");
            });
        }
    };
    //保存按钮
    var link_saveBtn = {
        init:function (parentIds) {
            $("#" + parentIds).find("#linkOperatePopup_saveBtn").unbind("click");
            $("#" + parentIds).find("#linkOperatePopup_saveBtn").click(function () {
                var patter = /^[A-Za-z0-9-_.~!@#$%^&*+=]*$/;
                var operatorId = $("#linkOperatePopup_operatorId").val();
                systemParamGrid.getInst(parentIds).saveAll();
                inParamGrid.getInst(parentIds).saveAll();
                var sysData = systemParamGrid.getDataSource()["_data"];
                var inData = inParamGrid.getDataSource()["_data"];
                var gridData = {};gridData["sysParams"] = [],gridData["inParams"] = [];
                var sysAndLinkMap = queryALLSysExceptCurrent();
                for(var i=0;i<sysData.length;i++){
                    if(sysData[i]["paramName"] == "" || sysData[i]["paramValue"] == ""){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请完成系统参数配置！"
                        });
                        return false;
                    }
                    if(!patter.test(sysData[i]["paramName"].trim())){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "系统参数\""+sysData[i]["paramName"]+"\"格式不正确！"
                        });
                        return false;
                    }
                    if(sysAndLinkMap.hasOwnProperty(sysData[i]["paramName"])){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "系统参数\""+sysData[i]["paramName"]+"\"在\"参数配置："+sysAndLinkMap[sysData[i]["paramName"]]+"\"中已经存在，请勿重复配置！"
                        });
                        return false;
                    }
                    gridData["sysParams"].push({
                        "paramName": sysData[i]["paramName"],
                        "paramValue": sysData[i]["paramValue"],
                        "paramType": sysData[i]["paramType"],
                        "ifNull":sysData[i]["ifNull"]
                    });
                    sysAndLinkMap[sysData[i]["paramName"]] = operatorId.split("_")[3];
                }
                var lastElementName = "下节点入参";
                lastElementName = linkOperatePopup_tabstrip.getInst(parentIds).items()[1].innerText;

                for(var i=0;i<inData.length;i++){
                    if(inData[i]["paramName"] =="" || inData[i]["paramValue"] == ""){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请完成"+lastElementName+"配置！"
                        });
                        return false;
                    }
                    if(!patter.test(inData[i]["paramName"].trim())){
                        common.jqConfirm.alert({
                            title: 0,
                            content: lastElementName+"\""+inData[i]["paramName"]+"\"格式不正确！"
                        });
                        return false;
                    }
                    if(inData[i]["paramType"] == "3"){
                        if(!sysAndLinkMap.hasOwnProperty(inData[i]["paramValue"])){
                            common.jqConfirm.alert({
                                title: 0,
                                content: lastElementName+"配置中的参数值\""+inData[i]["paramValue"]+"\"在系统参数中不存在！"
                            });
                            return false;
                        }
                    }
                    gridData["inParams"].push({
                        "paramName": inData[i]["paramName"],
                        "paramValue": inData[i]["paramValue"],
                        "paramType": inData[i]["paramType"],
                        "ifNull":inData[i]["ifNull"]
                    });
                }

                $("#" + operatorId).attr("data",JSON.stringify(gridData));
                systemParamGrid.editArry = [];
                systemParamGrid.getInst(parentIds).setDataSource(null);
                inParamGrid.getInst(parentIds).setDataSource(null);
                $("#" + parentIds).find("#linkOperatePopup_saveBtn").trigger("afterClick");
            });
        }
    }
    //入参tabstrip
    var linkOperatePopup_tabstrip = {
        getInst: function (parentIds) {
            return $("#" + parentIds).find("#linkOperatePopup_tabstrip").data("wandaTabStrip");
        },
        init:function (parentIds) {
            if($("#linkOperatePopup_endFlag").val() == "true"){
                $("#linkOperatePopup_tabstrip").find("li:eq(1)").text("输出参数");
            }else{
                $("#linkOperatePopup_tabstrip").find("li:eq(1)").text("下节点入参");
            }
            $("#" + parentIds).find("#linkOperatePopup_tabstrip").wandaTabStrip({
                tabPosition: "top",
                animation: {open: {effects: "fadeIn"}},
                activate:function (e) {
                    if("下节点入参" == $(e.item).find("> .k-link").text().trim()){
                        systemParamGrid.getInst(parentIds).saveAll();
                        var sysData = systemParamGrid.getDataSource()["_data"];
                        var sysAndLinkMap = queryALLSysExceptCurrent();
                        for(var i = 0;i < sysData.length; i++){
                            if(sysAndLinkMap.hasOwnProperty(sysData[i]["paramName"])){
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "系统参数\""+sysData[i]["paramName"]+"\"在\"参数配置："+sysAndLinkMap[sysData[i]["paramName"]]+"\"中已经存在，请勿重复配置！"
                                });
                                linkOperatePopup_tabstrip.getInst(parentIds).select(0);
                                return false;
                            }
                        }
                    }
                }
            });
            if($("#linkOperatePopup_endFlag").val() == "true"){
                var tabStrip = linkOperatePopup_tabstrip.getInst(parentIds);
                tabStrip.disable(tabStrip.tabGroup.children().eq(0));
                linkOperatePopup_tabstrip.getInst(parentIds).select(1);
            }else{
                var tabStrip = linkOperatePopup_tabstrip.getInst(parentIds);
                tabStrip.enable(tabStrip.tabGroup.children().eq(0));
                linkOperatePopup_tabstrip.getInst(parentIds).select(0);
            }
        }
    };
     //系统参数
    var systemParamGrid = {
        gridColums:[
            {
                field: "paramName",
                title: "<em class='color_red'>*</em>参数名"
            },
            {
                field: "paramValue",
                title: "<em class='color_red'>*</em>参数值",
                width: "230px"
            },
            {
                field: "paramType",
                title: "<em class='color_red'>*</em>参数类型",
                width: "100px"
            },
            {
                field: "ifNull",
                title: "<em class='color_red'>*</em>是否必填",
                width: "80px"
            },
            {
                command: [{
                    className: "info",
                    name: "delete",
                    text: "<i class=\"fa fa-trash-o fa_icon\" title='删除'></i>",
                    imageClass: "",
                    iconClass: "",
                    click:function (e) {
                        e.stopPropagation();
                        inParamGrid.getInst().refreshEdit();
                    }
                }], title: "操作", width: "100px"
            }
        ],
        init:function (parentIds) {
            systemParamGrid.getInst(parentIds).init();
        },
        inst: {},
        getInst: function (parentIds) {
            if (systemParamGrid.inst) {
                systemParamGrid.inst = new wandaComp.wandaGrid("linkOperatePopup_systemParamGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return systemParamGrid.inst;
        },
        editArry:[],
        isEditable:function () {
            var paramTypeArry = [{"text":"常量", "value":"1"}];
            var ifNullArry = [{"text" :"是", "value" :"1"},{"text" :"否", "value" :"2"}];
            if($("#linkOperatePopup_decideFlag").val() != "true"){
                paramTypeArry.push({"text":"上节点输出", "value":"2"});
            }
            if(systemParamGrid.editArry.length == 0){
                systemParamGrid.editArry[0] = {
                    "name":"paramName",
                    "type":"text",
                    "readonly":false
                }
                systemParamGrid.editArry[1] = {
                    "name":"paramValue",
                    "type":"text",
                    "readonly":false
                }
                systemParamGrid.editArry[2] = {
                    "name":"paramType",
                    "type":"select",
                    "readonly":false,
                    "values":paramTypeArry
                }
                systemParamGrid.editArry[3] = {
                    "name":"ifNull",
                    "type":"select",
                    "readonly":false,
                    "values":ifNullArry
                }
            }

            return systemParamGrid.editArry;
        },
        getDataSource: function (number) {
            if (number) {
                return systemParamGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return systemParamGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            systemParamGrid.getInst().saveAll();
            var sysData = systemParamGrid.getDataSource()["_data"];
            var sysAndLinkMap = queryALLSysExceptCurrent();
            for(var i = 0;i < sysData.length; i++){
                if(sysAndLinkMap.hasOwnProperty(sysData[i]["paramName"])){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "系统参数\""+sysData[i]["paramName"]+"\"在\"参数配置："+sysAndLinkMap[sysData[i]["paramName"]]+"\"中已经存在，请勿重复配置！"
                    });
                    return false;
                }
            }
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
    // 系统参数新增
    var systemParamGrid_dataAdd = {
        init: function (parentId) {
            $("#"+parentId).find("#linkOperatePopup_systemParamGrid_dataAdd").unbind("click");
            $("#"+parentId).find("#linkOperatePopup_systemParamGrid_dataAdd").click(function () {
                systemParamGrid.addRow();
            })
        }
    };
    // 下节点入参
    var inParamGrid = {
        gridColums:[
            {
                field: "paramName",
                title: "<em class='color_red'>*</em>参数名"
            },
            {
                field: "paramValue",
                title: "<em class='color_red'>*</em>参数值",
                width: "230px"
            },
            {
                field: "paramType",
                title: "<em class='color_red'>*</em>参数类型",
                width: "100px"
            },
            {
                field: "ifNull",
                title: "<em class='color_red'>*</em>是否必填",
                width: "80px"
            },
            {
                command: [{
                    className: "info",
                    name: "delete",
                    text: "<i class=\"fa fa-trash-o fa_icon\" title='删除'></i>",
                    imageClass: "",
                    iconClass: "",
                    click:function (e) {
                        e.stopPropagation();
                    }
                }], title: "操作", width: "100px"
            }
        ],
        init:function (parentIds) {
            inParamGrid.getInst(parentIds).init();
        },
        inst: {},
        getInst: function (parentIds) {
            if (inParamGrid.inst) {
                inParamGrid.inst = new wandaComp.wandaGrid("linkOperatePopup_inParamGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return inParamGrid.inst;
        },
        paramValueData:[],
        editStatus:1,
        getParamType:function () {
            var paraTypeDataSource = [];
            var sysData = systemParamGrid.getDataSource()["_data"];
            for(var i=0;i<sysData.length;i++){
                if(sysData[i]["paramName"] != ""){
                    paraTypeDataSource.push({
                        "text":sysData[i]["paramName"],
                        "value":sysData[i]["paramName"]
                    });
                }
            }
            return paraTypeDataSource;
        },
        isEditable:function (data) {
            var editArry = [];
            var paramTypeDataSource = [{"text":"常量", "value":"1"},{"text":"上节点输出", "value":"2"},{"text":"系统", "value":"3"}];
            var ifNullDataSource = [{"text" :"是", "value" :"1"},{"text" :"否", "value" :"2"}];
            if($("#linkOperatePopup_decideFlag").val() == "true"){
                paramTypeDataSource = [{"text":"常量", "value":"1"},{"text":"系统", "value":"3"}];
            }
            var paraTypeDataSource = inParamGrid.paramValueData.concat(inParamGrid.getParamType());
            var currentRowData = data["current"];
            if(currentRowData != null){
                inParamGrid.editStatus = 3;
            }
            editArry[0] = {
                "name": "paramName",
                "type": "text",
                "readonly": false
            }
            editArry[1] = {
                "name": "paramValue",
                "readonly": false
            }
            editArry[2] = {
                "name": "paramType",
                "type": "select",
                "readonly": false,
                "values": paramTypeDataSource,
                "events": {
                    "change": function (e) {
                        var value = this.value();
                        if ("3" == value) {
                            editArry[1]["type"] = "select";
                            editArry[1]["values"] = paraTypeDataSource;
                        }else{
                            editArry[1]["type"] = "text";
                            editArry[1]["value"] = "";
                        }
                        editArry[2]["value"] = value;
                        inParamGrid.getInst().refreshEdit();
                    }
                }

            }
            editArry[3] = {
                "name": "ifNull",
                "type": "select",
                "readonly": false,
                "values": ifNullDataSource
            }
            if(inParamGrid.editStatus == 2 || inParamGrid.editStatus == 1){ //新增的时候
                editArry[1]["type"] = "text";
                editArry[2]["value"] = "1";
                editArry[3]["value"] = "1"
            }else{
                if(currentRowData){
                    for(var i = 0;i < paramTypeDataSource.length;i++){
                        if(paramTypeDataSource[i]["text"] == currentRowData["paramType"]){
                            editArry[2]["value"] = paramTypeDataSource[i]["value"];
                            if(editArry[2]["value"] == "3"){
                                editArry[1]["type"] = "select";
                                editArry[1]["values"] = paraTypeDataSource;
                                if(currentRowData["paramValue"] == ""){
                                    if(paraTypeDataSource.length > 0){
                                        editArry[1]["value"] =  paraTypeDataSource[0]["value"];
                                    }else{
                                        editArry[1]["value"] =  "";
                                    }
                                }else{
                                    editArry[1]["value"] = currentRowData["paramValue"];
                                }
                            }
                            break;
                        }
                    }
                    for(var i = 0;i < ifNullDataSource.length;i++){
                        if(ifNullDataSource[i]["text"] == currentRowData["ifNull"]){
                            editArry[3]["value"] = ifNullDataSource[i]["value"];
                            break;
                        }
                    }
                }
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
            inParamGrid.editStatus = 2;
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
    // 下节点入参 新增
    var inParamGrid_dataAdd = {
        init: function (parentId) {
            $("#"+parentId).find("#linkOperatePopup_inParamGrid_dataAdd").unbind("click");
            $("#"+parentId).find("#linkOperatePopup_inParamGrid_dataAdd").click(function () {
                inParamGrid.addRow();
            })
        }
    };
    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        linkOperatePopup_tabstrip.init(parentId);
        link_cancelBtn.init(parentId);
        link_saveBtn.init(parentId);
        systemParamGrid.init(parentId);
        systemParamGrid_dataAdd.init(parentId);
        inParamGrid.init(parentId);
        inParamGrid_dataAdd.init(parentId);
    };
    return {
        init: init,
        systemParam:systemParamGrid,
        inParam:inParamGrid
    };
});

