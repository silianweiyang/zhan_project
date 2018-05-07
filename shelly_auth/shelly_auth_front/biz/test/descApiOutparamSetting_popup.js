define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var descApiOutparamSetting_popup_saveBtn = {
        init: function (parentIds) {
            $("#descApiOutparamSetting_popup_saveBtn").unbind("click");
            $("#descApiOutparamSetting_popup_saveBtn").click(function () {
                descApiOutparamSetting_popup_outParamGrid.getInst().saveAll();
                var outparamConvertData = descApiOutparamSetting_popup_outParamGrid.getDataSource()["_data"];
                if(outparamConvertData && outparamConvertData.length > 0){
                    for(var i =0;i<outparamConvertData.length;i++){
                        if (outparamConvertData[i]["srcPath"] == "" || outparamConvertData[i]["desPath"] == "") {
                            common.jqConfirm.alert({
                                title: 0,
                                content: "请完成出参参数转换配置！"
                            });
                            return false;
                        }
                    }
                }
                $("#descApiPopup_responseParamConvert").val("");
                $("#descApiOutparamSetting_popup_saveBtn").trigger("afterClick");
            });
        }
    };

    var descApiOutparamSetting_popup_cancelBtn = {
        init:function () {
            $("#descApiOutparamSetting_popup_cancelBtn").unbind("click");
            $("#descApiOutparamSetting_popup_cancelBtn").click(function () {
                descApiOutparamSetting_popup_outParamGrid.getInst().setDataSource(null);
                $("#descApiOutparamSetting_outParamFilterGrid").find("tbody").html("");
                $("#descApiOutparamSetting_popup_cancelBtn").trigger("afterClick");
            });
        }
    }
    //出参转换
    var descApiOutparamSetting_popup_outParamGrid = {
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
                    click:function (e) {
                        //e.stopPropagation();
                        $("#APIMgr_isAddHis").val("yes");
                    }
                }], title: "操作", width: "80px"
            }
        ],
        init:function () {
            descApiOutparamSetting_popup_outParamGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descApiOutparamSetting_popup_outParamGrid.inst) {
                descApiOutparamSetting_popup_outParamGrid.inst = new wandaComp.wandaGrid("descApiOutparamSetting_popup_outParamGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return descApiOutparamSetting_popup_outParamGrid.inst;
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
                return descApiOutparamSetting_popup_outParamGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiOutparamSetting_popup_outParamGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiOutparamSetting_popup_outParamGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "srcPath": dataArry[i]["srcPath"],
                    "desPath": dataArry[i]["desPath"]
                });
            }
        }
    };

    var descApiOutparamSetting_popup_outParamGrid_dataAdd = {
        init:function () {
            $("#descApiOutparamSetting_popup_outParamGrid_dataAdd").unbind("click");
            $("#descApiOutparamSetting_popup_outParamGrid_dataAdd").click(function (e) {
                $("#descApiPopup_isAddHis").val("yes");
                descApiOutparamSetting_popup_outParamGrid.getInst().addRow();
            });
        }
    }
    //本次改造新增 字段过滤
    var descApiOutparamSetting_outParamFilterGrid_dataAdd = {
        init:function () {
            $("#descApiOutparamSetting_outParamFilterGrid_dataAdd").unbind("click");
            $("#descApiOutparamSetting_outParamFilterGrid_dataAdd").click(function () {
                $("#descApiPopup_isAddHis").val("yes");
                var count = $("#descApiOutparamSetting_outParamFilterGrid").find("tbody").find("td").length;
                if(count == 0){
                    $("#descApiOutparamSetting_outParamFilterGrid").css("width","25%");
                }else if(count == 1){
                    $("#descApiOutparamSetting_outParamFilterGrid").css("width","50%");
                }else if(count == 2){
                    $("#descApiOutparamSetting_outParamFilterGrid").css("width","75%");
                }else if(count >= 3){
                    $("#descApiOutparamSetting_outParamFilterGrid").css("width","100%");
                }
                if(count==0 || count %4 ==0){
                    $("#descApiOutparamSetting_outParamFilterGrid").append("<tr></tr>");
                }
                $("#descApiOutparamSetting_outParamFilterGrid").find("tbody").find("tr:last").append("<td style='border: 0px;padding-left:0px;padding-bottom:0px'><input class='k-textbox' style='width:85%' onchange='changeNode(this)'/><i class='fa fa-trash-o fa_icon' style='vertical-align:middle' title='删除' onclick='deleteNode(this)'></i></td>");
            })
        }
    }

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        descApiOutparamSetting_popup_saveBtn.init();
        descApiOutparamSetting_popup_cancelBtn.init();
        descApiOutparamSetting_popup_outParamGrid.init();
        descApiOutparamSetting_popup_outParamGrid_dataAdd.init();
        descApiOutparamSetting_outParamFilterGrid_dataAdd.init();
    };
    return {
        init: init,
        outParam:descApiOutparamSetting_popup_outParamGrid
    };
});

