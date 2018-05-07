define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var APIInParamSetting_saveBtn = {
        init: function (parentIds) {
            $("#APIInParamSetting_saveBtn").unbind("click");
            $("#APIInParamSetting_saveBtn").click(function () {
                APIMgr_inConstConvertGrid.getInst().saveAll();
                var inConstConvertData = APIMgr_inConstConvertGrid.getDataSource()["_data"];
                if(inConstConvertData && inConstConvertData.length > 0){
                    for(var i =0;i<inConstConvertData.length;i++){
                        if (inConstConvertData[i]["path"] == "" || inConstConvertData[i]["value"] == "") {
                            common.jqConfirm.alert({
                                title: 0,
                                content: "请完成入参常量转换配置！"
                            });
                            return false;
                        }
                        if(inConstConvertData[i]["type"] == "number"){
                            if(!Number(inConstConvertData[i]["value"])){
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "常量转换的第"+(i+1)+"行的值不是number类型"
                                });
                                return false;
                            }
                        }
                    }
                }
                APIMgr_inparamConvertGrid.getInst().saveAll();
                var inparamConvertData = APIMgr_inparamConvertGrid.getDataSource()["_data"];
                for(var i = 0;i<inparamConvertData.length;i++) {
                    if (inparamConvertData[i]["srcPath"] == "" || inparamConvertData[i]["desPath"] == "") {
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请完成入参参数转换配置！"
                        });
                        return false;
                    }
                }
                $("#APIMgr_requestParamConvert").val("");
                $("#APIInParamSetting_saveBtn").trigger("afterClick");
            });
        }
    };

    var APIInParamSetting_cancelBtn = {
        init:function () {
            $("#APIInParamSetting_cancelBtn").unbind("click");
            $("#APIInParamSetting_cancelBtn").click(function () {
                APIMgr_inConstConvertGrid.getInst().setDataSource(null);
                APIMgr_inparamConvertGrid.getInst().setDataSource(null);
                $('input[name="APIMgr_inParamType"]').eq(0).attr("checked","checked");
                $('input[name="APIMgr_inParamType"]').eq(1).attr("checked",false);
                $("#APIInParamSetting_cancelBtn").trigger("afterClick");
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
                width: "200px"
            },
            {
                field: "type",
                title: "<em class='color_red'>*</em>类型",
                width: "200px"
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
            APIMgr_inConstConvertGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (APIMgr_inConstConvertGrid.inst) {
                APIMgr_inConstConvertGrid.inst = new wandaComp.wandaGrid("APIMgr_inConsGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
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

    var APIMgr_inConsGrid_dataAdd = {
        init:function () {
            $("#APIMgr_inConsGrid_dataAdd").unbind("click");
            $("#APIMgr_inConsGrid_dataAdd").click(function () {
                $("#APIMgr_isAddHis").val("yes");
                APIMgr_inConstConvertGrid.getInst().addRow();
            });
        }
    }
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
                width: "350px"
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
            APIMgr_inparamConvertGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (APIMgr_inparamConvertGrid.inst) {
                APIMgr_inparamConvertGrid.inst = new wandaComp.wandaGrid("APIMgr_inParamGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
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

    var APIMgr_inParamGrid_dataAdd = {
        init:function () {
            $("#APIMgr_inParamGrid_dataAdd").unbind("click");
            $("#APIMgr_inParamGrid_dataAdd").click(function (e) {
                $("#APIMgr_isAddHis").val("yes");
                APIMgr_inparamConvertGrid.getInst().addRow();
            });
        }
    }

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        APIInParamSetting_saveBtn.init();
        APIInParamSetting_cancelBtn.init();
        APIMgr_inConstConvertGrid.init();
        APIMgr_inparamConvertGrid.init();
        APIMgr_inConsGrid_dataAdd.init();
        APIMgr_inParamGrid_dataAdd.init();
    };
    return {
        init: init,
        inConst:APIMgr_inConstConvertGrid,
        inParam:APIMgr_inparamConvertGrid
    };
});

