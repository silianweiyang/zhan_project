define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {

    // 自定义过滤器
    var descApiDetailCustomSetting_inConsGrid = {
        customValue: {
            filterValue: [],  //select下拉框的数据
            gateValue: []    //所有过滤器相关数据
        },
        editArry:[],
        gridColums:[
            {
                field: "filterId",
                title: "插件名称",
                width: "164px"
            },
            {
                field: "filterClass",
                title: "插件路径",
                width: "246px"
            },
            {
                field: "filterOrder",
                title: "执行顺序",
                width: "82px"
            },
            {
                field: "filterPos",
                title: "执行位置",
                width: "82px"
            },
            {
                field: "filterValue",
                title: "插件参数",
                width: "246px"
            }
        ],
        init:function () {
            descApiDetailCustomSetting_inConsGrid.getInst().init();
            descApiDetailCustomSetting_inConsGrid.getCustomValue();
        },
        inst: {},
        getInst: function () {
            if (descApiDetailCustomSetting_inConsGrid.inst) {
                descApiDetailCustomSetting_inConsGrid.inst = new wandaComp.wandaGrid("descApiDetailCustomSetting_inConsGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,false);
            }
            return descApiDetailCustomSetting_inConsGrid.inst;
        },
        getCustomValue:function () {
            common.ajaxGet("api/gateApi/queryGateFilters",{},function (datas) {
                descApiDetailCustomSetting_inConsGrid.customValue.gateValue = datas["gateFilters"];
                if(descApiDetailCustomSetting_inConsGrid.customValue.gateValue.length > 0){
                    for(var i=0;i<descApiDetailCustomSetting_inConsGrid.customValue.gateValue.length;i++){
                        var temp = {
                            "text":descApiDetailCustomSetting_inConsGrid.customValue.gateValue[i]["FILTER_NAME"],
                            "value":descApiDetailCustomSetting_inConsGrid.customValue.gateValue[i]["FILTER_ID"]
                        }
                        descApiDetailCustomSetting_inConsGrid.customValue.filterValue[i] = temp;
                    }
                }
            },null,false,$("#APICustomSetting_popup"));
        },
        isEditable:function () {
            descApiDetailCustomSetting_inConsGrid.editArry[0] = {
                "name":"filterId",
                "type":"select",
                "values":descApiDetailCustomSetting_inConsGrid.customValue.filterValue
            }
            descApiDetailCustomSetting_inConsGrid.editArry[1] = {
                "name":"filterClass",
                "type":"text"
            }
            descApiDetailCustomSetting_inConsGrid.editArry[2] = {
                "name":"filterOrder",
                "type":"text"
            }
            descApiDetailCustomSetting_inConsGrid.editArry[3] = {
                "name":"filterPos",
                "type":"text"
            }
            descApiDetailCustomSetting_inConsGrid.editArry[4] = {
                "name":"filterValue",
                "type":"text"
            }
            return descApiDetailCustomSetting_inConsGrid.editArry;
        },
        getDataSource: function (number) {
            if (number) {
                return descApiDetailCustomSetting_inConsGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiDetailCustomSetting_inConsGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiDetailCustomSetting_inConsGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "filterId": dataArry[i]["filterId"],
                    "filterClass": dataArry[i]["filterClass"],
                    "filterOrder": dataArry[i]["filterOrder"],
                    "filterPos": dataArry[i]["filterPos"],
                    "filterValue":dataArry[i]["value"]
                });
            }
        }
    };

    //取消
    var descApiDetailCustomSetting_cancelBtn = {
        init:function () {
            $("#descApiDetailCustomSetting_cancelBtn").unbind("click");
            $("#descApiDetailCustomSetting_cancelBtn").click(function () {
                $("#descApiDetailCustomSetting_cancelBtn").trigger("afterClick");
            });
        }
    }

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        descApiDetailCustomSetting_inConsGrid.init();
        descApiDetailCustomSetting_cancelBtn.init();
    };
    return {
        init: init,
        inConst:descApiDetailCustomSetting_inConsGrid
    };
});

