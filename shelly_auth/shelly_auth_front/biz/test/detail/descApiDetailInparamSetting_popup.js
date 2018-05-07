define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var descApiDetailInparamSetting_cancelBtn = {
        init:function () {
            $("#descApiDetailInparamSetting_cancelBtn").unbind("click");
            $("#descApiDetailInparamSetting_cancelBtn").click(function () {
                $("#descApiDetailInparamSetting_cancelBtn").trigger("afterClick");
            });
        }
    }
    // 入参常量转换
    var descApiDetailInparamSetting_inConsGrid = {
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
            descApiDetailInparamSetting_inConsGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descApiDetailInparamSetting_inConsGrid.inst) {
                descApiDetailInparamSetting_inConsGrid.inst = new wandaComp.wandaGrid("descApiDetailInparamSetting_inConsGrid", this.gridColums, false, this.pagerCallBack);
            }
            return descApiDetailInparamSetting_inConsGrid.inst;
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
                return descApiDetailInparamSetting_inConsGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiDetailInparamSetting_inConsGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiDetailInparamSetting_inConsGrid.getDataSource();
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
    var descApiDetailInparamSetting_inParamGrid = {
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
            descApiDetailInparamSetting_inParamGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descApiDetailInparamSetting_inParamGrid.inst) {
                descApiDetailInparamSetting_inParamGrid.inst = new wandaComp.wandaGrid("descApiDetailInparamSetting_inParamGrid", this.gridColums, false, this.pagerCallBack);
            }
            return descApiDetailInparamSetting_inParamGrid.inst;
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
                return descApiDetailInparamSetting_inParamGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiDetailInparamSetting_inParamGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiDetailInparamSetting_inParamGrid.getDataSource();
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
        descApiDetailInparamSetting_cancelBtn.init();
        descApiDetailInparamSetting_inConsGrid.init();
        descApiDetailInparamSetting_inParamGrid.init();
    };
    return {
        init: init,
        inConst:descApiDetailInparamSetting_inConsGrid,
        inParam:descApiDetailInparamSetting_inParamGrid
    };
});

