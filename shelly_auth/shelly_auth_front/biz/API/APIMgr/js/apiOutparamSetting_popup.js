define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var APIOutParamSetting_popup_saveBtn = {
        init: function (parentIds) {
            $("#APIOutParamSetting_popup_saveBtn").unbind("click");
            $("#APIOutParamSetting_popup_saveBtn").click(function () {
                APIMgr_outparamConvertGrid.getInst().saveAll();
                var outparamConvertData = APIMgr_outparamConvertGrid.getDataSource()["_data"];
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
                $("#APIMgr_responseParamConvert").val("");
                $("#APIOutParamSetting_popup_saveBtn").trigger("afterClick");
            });
        }
    };

    var APIOutParamSetting_popup_cancelBtn = {
        init:function () {
            $("#APIOutParamSetting_popup_cancelBtn").unbind("click");
            $("#APIOutParamSetting_popup_cancelBtn").click(function () {
                APIMgr_outparamConvertGrid.getInst().setDataSource(null);
                $("#APIMgr_outParamFilterGrid").find("tbody").html("");
                $("#APIOutParamSetting_popup_cancelBtn").trigger("afterClick");
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
            APIMgr_outparamConvertGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (APIMgr_outparamConvertGrid.inst) {
                APIMgr_outparamConvertGrid.inst = new wandaComp.wandaGrid("APIOutParamSetting_popup_outParamGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
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

    var APIMgr_outParamConvertGrid_dataAdd = {
        init:function () {
            $("#APIOutParamSetting_popup_outParamGrid_dataAdd").unbind("click");
            $("#APIOutParamSetting_popup_outParamGrid_dataAdd").click(function (e) {
                $("#APIMgr_isAddHis").val("yes");
                APIMgr_outparamConvertGrid.getInst().addRow();
            });
        }
    }
    //本次改造新增 字段过滤
    var APIMgr_outParamFilterGrid_dataAdd = {
        init:function () {
            $("#APIMgr_outParamFilterGrid_dataAdd").unbind("click");
            $("#APIMgr_outParamFilterGrid_dataAdd").click(function () {
                $("#APIMgr_isAddHis").val("yes");
                var count = $("#APIMgr_outParamFilterGrid").find("tbody").find("td").length;
                if(count == 0){
                    $("#APIMgr_outParamFilterGrid").css("width","25%");
                }else if(count == 1){
                    $("#APIMgr_outParamFilterGrid").css("width","50%");
                }else if(count == 2){
                    $("#APIMgr_outParamFilterGrid").css("width","75%");
                }else if(count >= 3){
                    $("#APIMgr_outParamFilterGrid").css("width","100%");
                }
                if(count==0 || count %4 ==0){
                    $("#APIMgr_outParamFilterGrid").append("<tr></tr>");
                }
                $("#APIMgr_outParamFilterGrid").find("tbody").find("tr:last").append("<td style='border: 0px;padding-left:0px;padding-bottom:0px'><input class='k-textbox' style='width:85%' onchange='changeNode(this)'/><i class='fa fa-trash-o fa_icon' style='vertical-align:middle' title='删除' onclick='deleteNode(this)'></i></td>");
            })
        }
    }

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        APIOutParamSetting_popup_saveBtn.init();
        APIOutParamSetting_popup_cancelBtn.init();
        APIMgr_outparamConvertGrid.init();
        APIMgr_outParamConvertGrid_dataAdd.init();
        APIMgr_outParamFilterGrid_dataAdd.init();
    };
    return {
        init: init,
        outParam:APIMgr_outparamConvertGrid
    };
});

