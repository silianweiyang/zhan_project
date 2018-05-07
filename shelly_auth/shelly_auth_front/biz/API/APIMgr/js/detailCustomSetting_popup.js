define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {

    // 自定义过滤器
    var APICustomDetailMgr_inConstConvertGrid = {
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
            APICustomDetailMgr_inConstConvertGrid.getInst().init();
            APICustomDetailMgr_inConstConvertGrid.getCustomValue();
        },
        inst: {},
        getInst: function () {
            if (APICustomDetailMgr_inConstConvertGrid.inst) {
                APICustomDetailMgr_inConstConvertGrid.inst = new wandaComp.wandaGrid("detailCustomMgr_inConsGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,false);
            }
            return APICustomDetailMgr_inConstConvertGrid.inst;
        },
        getCustomValue:function () {
            common.ajaxGet("api/gateApi/queryGateFilters",{},function (datas) {
                APICustomDetailMgr_inConstConvertGrid.customValue.gateValue = datas["gateFilters"];
                if(APICustomDetailMgr_inConstConvertGrid.customValue.gateValue.length > 0){
                    for(var i=0;i<APICustomDetailMgr_inConstConvertGrid.customValue.gateValue.length;i++){
                        var temp = {
                            "text":APICustomDetailMgr_inConstConvertGrid.customValue.gateValue[i]["FILTER_NAME"],
                            "value":APICustomDetailMgr_inConstConvertGrid.customValue.gateValue[i]["FILTER_ID"]
                        }
                        APICustomDetailMgr_inConstConvertGrid.customValue.filterValue[i] = temp;
                    }
                }
            },null,false,$("#APICustomSetting_popup"));
        },
        isEditable:function () {
            APICustomDetailMgr_inConstConvertGrid.editArry[0] = {
                "name":"filterId",
                "type":"select",
                "values":APICustomDetailMgr_inConstConvertGrid.customValue.filterValue
            }
            APICustomDetailMgr_inConstConvertGrid.editArry[1] = {
                "name":"filterClass",
                "type":"text"
            }
            APICustomDetailMgr_inConstConvertGrid.editArry[2] = {
                "name":"filterOrder",
                "type":"text"
            }
            APICustomDetailMgr_inConstConvertGrid.editArry[3] = {
                "name":"filterPos",
                "type":"text"
            }
            APICustomDetailMgr_inConstConvertGrid.editArry[4] = {
                "name":"filterValue",
                "type":"text"
            }
            return APICustomDetailMgr_inConstConvertGrid.editArry;
        },
        getDataSource: function (number) {
            if (number) {
                return APICustomDetailMgr_inConstConvertGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return APICustomDetailMgr_inConstConvertGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = APICustomDetailMgr_inConstConvertGrid.getDataSource();
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
    var APIDetailSetting_cancelBtn = {
        init:function () {
            $("#APIDetailSetting_cancelBtn").unbind("click");
            $("#APIDetailSetting_cancelBtn").click(function () {
                $("#APIDetailSetting_cancelBtn").trigger("afterClick");
            });
        }
    }

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        APICustomDetailMgr_inConstConvertGrid.init();
        APIDetailSetting_cancelBtn.init();
    };
    return {
        init: init,
        inConst:APICustomDetailMgr_inConstConvertGrid
    };
});

