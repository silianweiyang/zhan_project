define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var APIInParamSetting_cancelBtn = {
        init:function () {
            $("#detailInParamSetting_cancelBtn").unbind("click");
            $("#detailInParamSetting_cancelBtn").click(function () {
                $("#detailInParamSetting_cancelBtn").trigger("afterClick");
            });
        }
    }
    // 入参常量转换
    var APIMgr_inConstConvertGrid = {
        gridColums:[
            {
                field: "path",
                title: "<em class='color_red'>*</em>路径",
                width: "300px"
            },
            {
                field: "value",
                title: "<em class='color_red'>*</em>值",
                width: "208px"
            },
            {
                field: "type",
                title: "<em class='color_red'>*</em>类型",
                width: "200px"
            }
        ],
        init:function () {
            APIMgr_inConstConvertGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (APIMgr_inConstConvertGrid.inst) {
                APIMgr_inConstConvertGrid.inst = new wandaComp.wandaGrid("detailMgr_inConsGrid", this.gridColums, false, this.pagerCallBack);
            }
            return APIMgr_inConstConvertGrid.inst;
        },
        isEditable:function () {
            var editArry = [];
            editArry[0] = {
                "name":"path",
                "type":"text",
                "readonly":false,
                "focus":true
            }
            editArry[1] = {
                "name":"value",
                "type":"text",
                "readonly":false
            }
            editArry[2] = {
                "name":"type",
                "type":"select",
                "readonly":false,
                "values":[{
                    "text":"String",
                    "value":"String"
                },{
                    "text":"number",
                    "value":"number"
                }]
            }
            return editArry;
        },
        getDataSource: function (number) {
            if (number) {
                return APIMgr_inConstConvertGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return APIMgr_inConstConvertGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = APIMgr_inConstConvertGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "path": dataArry[i]["path"],
                    "value": dataArry[i]["value"],
                    "type": dataArry[i]["type"]
                });
            }
        }
    };

    //入参参数转换
    var APIMgr_inparamConvertGrid = {
        gridColums:[
            {
                field: "srcPath",
                title: "<em class='color_red'>*</em>原路径",
                width: "358px"
            },
            {
                field: "desPath",
                title: "<em class='color_red'>*</em>目标路径",
                width: "360px"
            }
        ],
        init:function () {
            APIMgr_inparamConvertGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (APIMgr_inparamConvertGrid.inst) {
                APIMgr_inparamConvertGrid.inst = new wandaComp.wandaGrid("detailMgr_inParamGrid", this.gridColums, false, this.pagerCallBack);
            }
            return APIMgr_inparamConvertGrid.inst;
        },
        isEditable:function () {
            var editArry = [];
            editArry[0] = {
                "name":"srcPath",
                "type":"text",
                "readonly":false
            }
            editArry[1] = {
                "name":"desPath",
                "type":"text",
                "readonly":false,
            }
            return editArry;
        },
        getDataSource: function (number) {
            if (number) {
                return APIMgr_inparamConvertGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return APIMgr_inparamConvertGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = APIMgr_inparamConvertGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "srcPath": dataArry[i]["srcPath"],
                    "srcType": dataArry[i]["srcType"],
                    "desPath": dataArry[i]["desPath"],
                    "desType": dataArry[i]["desType"]
                });
            }
        }
    };

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        APIInParamSetting_cancelBtn.init();
        APIMgr_inConstConvertGrid.init();
        APIMgr_inparamConvertGrid.init();
    };
    return {
        init: init,
        inConst:APIMgr_inConstConvertGrid,
        inParam:APIMgr_inparamConvertGrid
    };
});

