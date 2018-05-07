define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var APIOutParamSetting_popup_cancelBtn = {
        init:function () {
            $("#detailOutParamSetting_popup_cancelBtn").unbind("click");
            $("#detailOutParamSetting_popup_cancelBtn").click(function () {
                $("#detailOutParamSetting_popup_cancelBtn").trigger("afterClick");
            });
        }
    }
    //出参转换
    var APIMgr_outparamConvertGrid = {
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
            APIMgr_outparamConvertGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (APIMgr_outparamConvertGrid.inst) {
                APIMgr_outparamConvertGrid.inst = new wandaComp.wandaGrid("detailOutParamSetting_popup_outParamGrid", this.gridColums, false, this.pagerCallBack);
            }
            return APIMgr_outparamConvertGrid.inst;
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
                return APIMgr_outparamConvertGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return APIMgr_outparamConvertGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = APIMgr_outparamConvertGrid.getDataSource();
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
        APIOutParamSetting_popup_cancelBtn.init();
        APIMgr_outparamConvertGrid.init();
    };
    return {
        init: init,
        outParam:APIMgr_outparamConvertGrid
    };
});

