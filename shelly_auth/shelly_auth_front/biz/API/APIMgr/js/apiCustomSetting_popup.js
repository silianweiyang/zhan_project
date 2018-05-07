define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {

    // 自定义过滤器
    var APICustomMgr_inConstConvertGrid = {
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
            APICustomMgr_inConstConvertGrid.getInst().init();
            APICustomMgr_inConstConvertGrid.getCustomValue();
        },
        inst: {},
        getInst: function () {
            if (APICustomMgr_inConstConvertGrid.inst) {
                APICustomMgr_inConstConvertGrid.inst = new wandaComp.wandaGrid("APICustomMgr_inConsGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return APICustomMgr_inConstConvertGrid.inst;
        },
        getCustomValue:function () {
            common.ajaxGet("api/gateApi/queryGateFilters",{},function (datas) {
                APICustomMgr_inConstConvertGrid.customValue.gateValue = datas["gateFilters"];
                if(APICustomMgr_inConstConvertGrid.customValue.gateValue.length > 0){
                    for(var i=0;i<APICustomMgr_inConstConvertGrid.customValue.gateValue.length;i++){
                        var temp = {
                            "text":APICustomMgr_inConstConvertGrid.customValue.gateValue[i]["FILTER_NAME"],
                            "value":APICustomMgr_inConstConvertGrid.customValue.gateValue[i]["FILTER_ID"]
                        }
                        APICustomMgr_inConstConvertGrid.customValue.filterValue[i] = temp;
                    }
                }
            },null,false,$("#APICustomSetting_popup"));
        },
        isEditable:function (data) {
            var firstValue = {
                "FILTER_ID":"",
                "FILTER_CLASS":"",
                "FILTER_ORDER":"",
                "FILTER_POS":""
            };
            //新增
            if(APICustomMgr_inConstConvertGrid.customValue.gateValue.length > 0) {
                if(null == data["current"]){
                    firstValue = APICustomMgr_inConstConvertGrid.customValue.gateValue[0];
                } else {
                    var filterInfo = data["current"]["filterId"];
                    for (var i = 0; i < APICustomMgr_inConstConvertGrid.customValue.gateValue.length; i++) {
                        if (filterInfo == APICustomMgr_inConstConvertGrid.customValue.gateValue[i]["FILTER_ID"]) {
                            firstValue = APICustomMgr_inConstConvertGrid.customValue.gateValue[i];
                            break;
                        }
                        if (filterInfo == APICustomMgr_inConstConvertGrid.customValue.gateValue[i]["FILTER_NAME"]) {
                            firstValue = APICustomMgr_inConstConvertGrid.customValue.gateValue[i];
                            break;
                        }
                    }
                }
            }
            APICustomMgr_inConstConvertGrid.editArry[0] = {
                "name":"filterId",
                "type":"select",
                "readonly":false,
                "value":firstValue["FILTER_ID"],
                "values":APICustomMgr_inConstConvertGrid.customValue.filterValue,
                "events":{
                    "change":function(e){
                        var filterId = this.value();
                        for(var i=0;i<APICustomMgr_inConstConvertGrid.customValue.gateValue.length;i++){
                            if(filterId == APICustomMgr_inConstConvertGrid.customValue.gateValue[i]["FILTER_ID"]){
                                APICustomMgr_inConstConvertGrid.refreshDataSource(APICustomMgr_inConstConvertGrid.customValue.gateValue[i]);
                                break;
                            }
                        }
                    }
                }
            }
            APICustomMgr_inConstConvertGrid.editArry[1] = {
                "name":"filterClass",
                "type":"text",
               "value":firstValue["FILTER_CLASS"],
                "readonly":true
            }
            APICustomMgr_inConstConvertGrid.editArry[2] = {
                "name":"filterOrder",
                "type":"text",
                "value":firstValue["FILTER_ORDER"],
                "readonly":true
            }
            APICustomMgr_inConstConvertGrid.editArry[3] = {
                "name":"filterPos",
                "type":"text",
                "value":firstValue["FILTER_POS"],
                "readonly":true
            }
            APICustomMgr_inConstConvertGrid.editArry[4] = {
                "name":"filterValue",
                "type":"text",
                "readonly":false
            }
            return APICustomMgr_inConstConvertGrid.editArry;
        },
        addRow:function () {
            if(APICustomMgr_inConstConvertGrid.customValue.gateValue.length <= 0){
                common.jqConfirm.alert({
                    title: 0,
                    content: "没有可供选择的扩展插件！"
                });
                return false;
            } else {
                APICustomMgr_inConstConvertGrid.getInst().addRow();
            }
        },
        getDataSource: function (number) {
            if (number) {
                return APICustomMgr_inConstConvertGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return APICustomMgr_inConstConvertGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = APICustomMgr_inConstConvertGrid.getDataSource();
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
            APICustomMgr_inConstConvertGrid.getInst().refreshEdit(_data);
        }
    };

    //新增
    var APICustomMgr_inConsGrid_dataAdd = {
        init:function () {
            $("#APICustomMgr_inConsGrid_dataAdd").unbind("click");
            $("#APICustomMgr_inConsGrid_dataAdd").click(function () {
                $("#APIMgr_isAddHis").val("yes");
                APICustomMgr_inConstConvertGrid.addRow();
            });
        }
    }

    //取消
    var APICustomSetting_cancelBtn = {
        init:function () {
            $("#APICustomSetting_cancelBtn").unbind("click");
            $("#APICustomSetting_cancelBtn").click(function () {
                APICustomMgr_inConstConvertGrid.getInst().setDataSource(null);
                $("#APICustomSetting_cancelBtn").trigger("afterClick");
            });
        }
    }

    //保存
    var APICustomSetting_saveBtn = {
        objSize:function (datas) {
            var count = 0;
            for(var i in datas){
               count ++;
            }
            return count;
        },
        init: function (parentIds) {
            $("#APICustomSetting_saveBtn").unbind("click");
            $("#APICustomSetting_saveBtn").click(function () {
                //判重
                APICustomMgr_inConstConvertGrid.getInst().saveAll();
                var custom_data = APICustomMgr_inConstConvertGrid.getDataSource()["_data"];
                var json_str = {};
                if(custom_data && custom_data.length > 0){
                     for(var i=0;i<custom_data.length;i++){
                         json_str[custom_data[i]["filterId"]] = "remove repetition";
                     }
                }
                if(APICustomSetting_saveBtn.objSize(json_str) != custom_data.length){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "插件名称不可重复！"
                    });
                    return false;
                }
                $("#APIMgr_extendFilter").val("");
                $("#APICustomSetting_saveBtn").trigger("afterClick");
            });
        }
    };

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        APICustomMgr_inConstConvertGrid.init();
        APICustomMgr_inConsGrid_dataAdd.init();
        APICustomSetting_cancelBtn.init();
        APICustomSetting_saveBtn.init();
    };
    return {
        init: init,
        inConst:APICustomMgr_inConstConvertGrid
    };
});

