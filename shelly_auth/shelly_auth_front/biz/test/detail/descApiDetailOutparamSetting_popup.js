define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var descApiDetailOutparamSetting_cancelBtn = {
        init:function () {
            $("#descApiDetailOutparamSetting_popup_cancelBtn").unbind("click");
            $("#descApiDetailOutparamSetting_popup_cancelBtn").click(function () {
                $("#descApiDetailOutparamSetting_popup_cancelBtn").trigger("afterClick");
            });
        }
    }
    //出参转换
    var descApiDetailOutparamSetting_outParamGrid = {
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
            descApiDetailOutparamSetting_outParamGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descApiDetailOutparamSetting_outParamGrid.inst) {
                descApiDetailOutparamSetting_outParamGrid.inst = new wandaComp.wandaGrid("descApiDetailOutparamSetting_outParamGrid", this.gridColums, false, this.pagerCallBack);
            }
            return descApiDetailOutparamSetting_outParamGrid.inst;
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
                return descApiDetailOutparamSetting_outParamGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiDetailOutparamSetting_outParamGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiDetailOutparamSetting_outParamGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "srcPath": dataArry[i]["srcPath"],
                    "desPath": dataArry[i]["desPath"]
                });
            }
        }
    };

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        descApiDetailOutparamSetting_cancelBtn.init();
        descApiDetailOutparamSetting_outParamGrid.init();
    };
    return {
        init: init,
        outParam:descApiDetailOutparamSetting_outParamGrid
    };
});

