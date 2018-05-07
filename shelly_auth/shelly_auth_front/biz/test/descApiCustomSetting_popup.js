define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {

    // 自定义过滤器
    var descApiCustomSetting_inConsGrid = {
        customValue: {
            filterValue: [],  //select下拉框的数据
            gateValue: []    //所有过滤器相关数据
        },
        editArry:[],
        gridColums:[
            {
                field: "filterId",
                title: "插件名称",
                width: "140px"
            },
            {
                field: "filterClass",
                title: "插件路径",
                width: "280px"
            },
            {
                field: "filterOrder",
                title: "执行顺序",
                width: "70px"
            },
            {
                field: "filterPos",
                title: "执行位置",
                width: "70px"
            },
            {
                field: "filterValue",
                title: "插件参数",
                width: "140px"
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
                        $("#APIMgr_isAddHis").val("yes");
                    }
                }], title: "操作", width: "80px"
            }
        ],
        init:function () {
            descApiCustomSetting_inConsGrid.getInst().init();
            descApiCustomSetting_inConsGrid.getCustomValue();
        },
        inst: {},
        getInst: function () {
            if (descApiCustomSetting_inConsGrid.inst) {
                descApiCustomSetting_inConsGrid.inst = new wandaComp.wandaGrid("descApiCustomSetting_inConsGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return descApiCustomSetting_inConsGrid.inst;
        },
        getCustomValue:function () {
            common.ajaxGet("api/gateApi/queryGateFilters",{},function (datas) {
                descApiCustomSetting_inConsGrid.customValue.gateValue = datas["gateFilters"];
                if(descApiCustomSetting_inConsGrid.customValue.gateValue.length > 0){
                    for(var i=0;i<descApiCustomSetting_inConsGrid.customValue.gateValue.length;i++){
                        var temp = {
                            "text":descApiCustomSetting_inConsGrid.customValue.gateValue[i]["FILTER_NAME"],
                            "value":descApiCustomSetting_inConsGrid.customValue.gateValue[i]["FILTER_ID"]
                        }
                        descApiCustomSetting_inConsGrid.customValue.filterValue[i] = temp;
                    }
                }
            },null,false,$("#descApiCustomSetting_popup"));
        },
        isEditable:function (data) {
            var firstValue = {
                "FILTER_ID":"",
                "FILTER_CLASS":"",
                "FILTER_ORDER":"",
                "FILTER_POS":""
            };
            //新增
            if(descApiCustomSetting_inConsGrid.customValue.gateValue.length > 0) {
                if(null == data["current"]){
                    firstValue = descApiCustomSetting_inConsGrid.customValue.gateValue[0];
                } else {
                    var filterInfo = data["current"]["filterId"];
                    for (var i = 0; i < descApiCustomSetting_inConsGrid.customValue.gateValue.length; i++) {
                        if (filterInfo == descApiCustomSetting_inConsGrid.customValue.gateValue[i]["FILTER_ID"]) {
                            firstValue = descApiCustomSetting_inConsGrid.customValue.gateValue[i];
                            break;
                        }
                        if (filterInfo == descApiCustomSetting_inConsGrid.customValue.gateValue[i]["FILTER_NAME"]) {
                            firstValue = descApiCustomSetting_inConsGrid.customValue.gateValue[i];
                            break;
                        }
                    }
                }
            }
            descApiCustomSetting_inConsGrid.editArry[0] = {
                "name":"filterId",
                "type":"select",
                "readonly":false,
                "value":firstValue["FILTER_ID"],
                "values":descApiCustomSetting_inConsGrid.customValue.filterValue,
                "events":{
                    "change":function(e){
                        var filterId = this.value();
                        for(var i=0;i<descApiCustomSetting_inConsGrid.customValue.gateValue.length;i++){
                            if(filterId == descApiCustomSetting_inConsGrid.customValue.gateValue[i]["FILTER_ID"]){
                                descApiCustomSetting_inConsGrid.refreshDataSource(descApiCustomSetting_inConsGrid.customValue.gateValue[i]);
                                break;
                            }
                        }
                    }
                }
            }
            descApiCustomSetting_inConsGrid.editArry[1] = {
                "name":"filterClass",
                "type":"text",
               "value":firstValue["FILTER_CLASS"],
                "readonly":true
            }
            descApiCustomSetting_inConsGrid.editArry[2] = {
                "name":"filterOrder",
                "type":"text",
                "value":firstValue["FILTER_ORDER"],
                "readonly":true
            }
            descApiCustomSetting_inConsGrid.editArry[3] = {
                "name":"filterPos",
                "type":"text",
                "value":firstValue["FILTER_POS"],
                "readonly":true
            }
            descApiCustomSetting_inConsGrid.editArry[4] = {
                "name":"filterValue",
                "type":"text",
                "readonly":false
            }
            return descApiCustomSetting_inConsGrid.editArry;
        },
        addRow:function () {
            if(descApiCustomSetting_inConsGrid.customValue.gateValue.length <= 0){
                common.jqConfirm.alert({
                    title: 0,
                    content: "没有可供选择的扩展插件！"
                });
                return false;
            } else {
                descApiCustomSetting_inConsGrid.getInst().addRow();
            }
        },
        getDataSource: function (number) {
            if (number) {
                return descApiCustomSetting_inConsGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiCustomSetting_inConsGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiCustomSetting_inConsGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "filterId": dataArry[i]["filterId"],
                    "filterClass": dataArry[i]["filterClass"],
                    "filterOrder": dataArry[i]["filterOrder"],
                    "filterPos": dataArry[i]["filterPos"],
                    "filterValue":dataArry[i]["value"]
                });
            }
        },
        refreshDataSource:function (data) {
            var _data = {
                "filterId": data["FILTER_ID"],
                "filterClass": data["FILTER_CLASS"],
                "filterOrder": data["FILTER_ORDER"],
                "filterPos": data["FILTER_POS"],
                "filterValue":""
            }
            descApiCustomSetting_inConsGrid.getInst().refreshEdit(_data);
        }
    };

    //新增
    var descApiCustomSetting_inConsGrid_dataAdd = {
        init:function () {
            $("#descApiCustomSetting_inConsGrid_dataAdd").unbind("click");
            $("#descApiCustomSetting_inConsGrid_dataAdd").click(function () {
                $("#descApiPopup_isAddHis").val("yes");
                descApiCustomSetting_inConsGrid.addRow();
            });
        }
    }

    //取消
    var descApiCustomSetting_cancelBtn = {
        init:function () {
            $("#descApiCustomSetting_cancelBtn").unbind("click");
            $("#descApiCustomSetting_cancelBtn").click(function () {
                descApiCustomSetting_inConsGrid.getInst().setDataSource(null);
                $("#descApiCustomSetting_cancelBtn").trigger("afterClick");
            });
        }
    }

    //保存
    var descApiCustomSetting_saveBtn = {
        objSize:function (datas) {
            var count = 0;
            for(var i in datas){
               count ++;
            }
            return count;
        },
        init: function (parentIds) {
            $("#descApiCustomSetting_saveBtn").unbind("click");
            $("#descApiCustomSetting_saveBtn").click(function () {
                //判重
                descApiCustomSetting_inConsGrid.getInst().saveAll();
                var custom_data = descApiCustomSetting_inConsGrid.getDataSource()["_data"];
                var json_str = {};
                if(custom_data && custom_data.length > 0){
                     for(var i=0;i<custom_data.length;i++){
                         json_str[custom_data[i]["filterId"]] = "remove repetition";
                     }
                }
                if(descApiCustomSetting_saveBtn.objSize(json_str) != custom_data.length){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "插件名称不可重复！"
                    });
                    return false;
                }
                $("#descApiPopup_extendFilter").val("");
                $("#descApiCustomSetting_saveBtn").trigger("afterClick");
            });
        }
    };

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        descApiCustomSetting_inConsGrid.init();
        descApiCustomSetting_inConsGrid_dataAdd.init();
        descApiCustomSetting_cancelBtn.init();
        descApiCustomSetting_saveBtn.init();
    };
    return {
        init: init,
        inConst:descApiCustomSetting_inConsGrid
    };
});

