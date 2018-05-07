define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var descApiInparamSetting_saveBtn = {
        init: function (parentIds) {
            $("#descApiInparamSetting_saveBtn").unbind("click");
            $("#descApiInparamSetting_saveBtn").click(function () {
                descApiInparamSetting_inConsGrid.getInst().saveAll();
                var inConstConvertData = descApiInparamSetting_inConsGrid.getDataSource()["_data"];
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
                descApiInparamSetting_inParamGrid.getInst().saveAll();
                var inparamConvertData = descApiInparamSetting_inParamGrid.getDataSource()["_data"];
                for(var i = 0;i<inparamConvertData.length;i++) {
                    if (inparamConvertData[i]["srcPath"] == "" || inparamConvertData[i]["desPath"] == "") {
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请完成入参参数转换配置！"
                        });
                        return false;
                    }
                }
                $("#descApiPopup_requestParamConvert").val("");
                $("#descApiInparamSetting_saveBtn").trigger("afterClick");
            });
        }
    };

    var descApiInparamSetting_cancelBtn = {
        init:function () {
            $("#descApiInparamSetting_cancelBtn").unbind("click");
            $("#descApiInparamSetting_cancelBtn").click(function () {
                descApiInparamSetting_inConsGrid.getInst().setDataSource(null);
                descApiInparamSetting_inParamGrid.getInst().setDataSource(null);
                $('input[name="descApiInparamSetting_inParamType"]').eq(0).attr("checked","checked");
                $('input[name="descApiInparamSetting_inParamType"]').eq(1).attr("checked",false);
                $("#descApiInparamSetting_cancelBtn").trigger("afterClick");
            });
        }
    }
    // 入参常量转换
    var descApiInparamSetting_inConsGrid = {
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
            descApiInparamSetting_inConsGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descApiInparamSetting_inConsGrid.inst) {
                descApiInparamSetting_inConsGrid.inst = new wandaComp.wandaGrid("descApiInparamSetting_inConsGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return descApiInparamSetting_inConsGrid.inst;
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
                return descApiInparamSetting_inConsGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiInparamSetting_inConsGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiInparamSetting_inConsGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "path": dataArry[i]["path"],
                    "value": dataArry[i]["value"],
                    "type": dataArry[i]["type"]
                });
            }
        }
    };

    var descApiInparamSetting_inConsGrid_dataAdd = {
        init:function () {
            $("#descApiInparamSetting_inConsGrid_dataAdd").unbind("click");
            $("#descApiInparamSetting_inConsGrid_dataAdd").click(function () {
                $("#descApiPopup_isAdd").val("yes");
                descApiInparamSetting_inConsGrid.getInst().addRow();
            });
        }
    }
    //入参参数转换
    var descApiInparamSetting_inParamGrid = {
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
            descApiInparamSetting_inParamGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descApiInparamSetting_inParamGrid.inst) {
                descApiInparamSetting_inParamGrid.inst = new wandaComp.wandaGrid("descApiInparamSetting_inParamGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return descApiInparamSetting_inParamGrid.inst;
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
                return descApiInparamSetting_inParamGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiInparamSetting_inParamGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiInparamSetting_inParamGrid.getDataSource();
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

    var descApiInparamSetting_inParamGrid_dataAdd = {
        init:function () {
            $("#descApiInparamSetting_inParamGrid_dataAdd").unbind("click");
            $("#descApiInparamSetting_inParamGrid_dataAdd").click(function (e) {
                $("#descApiPopup_isAddHis").val("yes");
                descApiInparamSetting_inParamGrid.getInst().addRow();
            });
        }
    }

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        descApiInparamSetting_saveBtn.init();
        descApiInparamSetting_cancelBtn.init();
        descApiInparamSetting_inConsGrid.init();
        descApiInparamSetting_inParamGrid.init();
        descApiInparamSetting_inConsGrid_dataAdd.init();
        descApiInparamSetting_inParamGrid_dataAdd.init();
    };
    return {
        init: init,
        inConst:descApiInparamSetting_inConsGrid,
        inParam:descApiInparamSetting_inParamGrid
    };
});

