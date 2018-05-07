define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
     // 条件关系
    var decideContPopup_grid = {
        gridColums:[
            {
                field: "SOURCE",
                title: "<em class='color_red'>*</em>参数来源",
                width: "100px"
            },
            {
                field: "PATH",
                title: "<em class='color_red'>*</em>参数路径",
                width: "350px"
            },
            {
                field: "DECIDE",
                title: "<em class='color_red'>*</em>计算符",
                width: "60px"
            },
            {
                field: "TYPE",
                title: "<em class='color_red'>*</em>参数类型",
                width: "90px"
            },
            {
                field: "VALUE",
                title: "<em class='color_red'>*</em>参数值"
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
                    }
                }], title: "操作", width: "100px"
            }
        ],
        init:function (parentIds) {
            decideContPopup_grid.getInst(parentIds).init();
        },
        inst: {},
        getInst: function (parentIds) {
            if (decideContPopup_grid.inst) {
                decideContPopup_grid.inst = new wandaComp.wandaGrid(parentIds, this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return decideContPopup_grid.inst;
        },
        paramValueData:[],
        editStatus:1,
        isEditable:function (data) {
            var editArry = [];
            var paraTypeDataSource = decideContPopup_grid.paramValueData;
            var sourceData = [{"text": "上节点输出", "value": "2"}, {"text": "系统", "value": "3"}];
            var currentRowData = data["current"];
            if(currentRowData != null){
                decideContPopup_grid.editStatus = 3;
            }
            editArry[1] = {
                "name":"PATH",
                "readonly":false
            }
            editArry[0] = {
                "name":"SOURCE",
                "type":"select",
                "readonly":false,
                "values": sourceData,
                "events": {
                    "change": function (e) {
                        var value = this.value();
                        if ("3" == value) {
                            editArry[1]["type"] = "select";
                            editArry[1]["values"] = paraTypeDataSource;
                        }else{
                            editArry[1]["type"] = "text";
                            editArry[1]["value"] = "";
                        }
                        editArry[0]["value"] = value;
                        decideContPopup_grid.getInst($("#decidePopup_objId").val()).refreshEdit();
                    }
                }
            }

            editArry[2] = {
                "name":"DECIDE",
                "type":"select",
                "readonly":false,
                "values":[{"text":"=", "value":"=="},{"text":">", "value":">"},{"text":"<", "value":"<"
                },{"text":"!=", "value":"!="},{"text":">=", "value":">="},{"text":"<=", "value":"<="}]
            }
            editArry[3] = {
                "name":"TYPE",
                "type":"select",
                "readonly":false,
                "values":[{"text":"String", "value":"String"},{"text":"number", "value":"number"}]
            }
            editArry[4] = {
                "name":"VALUE",
                "type":"text",
                "readonly":false
            }
            if(decideContPopup_grid.editStatus == 2 || decideContPopup_grid.editStatus == 1){
                editArry[0]["value"] = "2";
                editArry[1]["type"] = "text";
            }else{
                if(currentRowData){
                    for(var i = 0;i < sourceData.length;i++){
                        if(sourceData[i]["text"] == currentRowData["SOURCE"]){
                            editArry[0]["value"] = sourceData[i]["value"];
                            if(editArry[0]["value"] == "3"){
                                editArry[1]["type"] = "select";
                                editArry[1]["values"] = paraTypeDataSource;
                                if(paraTypeDataSource.length > 0){
                                    if(currentRowData["PATH"] == ""){
                                        editArry[1]["value"] =  paraTypeDataSource[0]["value"];
                                    }else{
                                        var existFlag = false;
                                        for(var j = 0; j < paraTypeDataSource.length;j++){
                                            if(paraTypeDataSource[j]["value"] == currentRowData["PATH"]){
                                                existFlag = true;
                                                break;
                                            }
                                        }
                                        if(existFlag){
                                            editArry[1]["value"] = currentRowData["PATH"];
                                        }else{
                                            editArry[1]["value"] = paraTypeDataSource[0]["value"];
                                        }
                                    }

                                }else{
                                    editArry[1]["value"] =  "";
                                }
                            }
                            break;
                        }
                    }
                }
            }
            return editArry;
        },
        getDataSource: function (number,parentIds) {
            if (number) {
                return decideContPopup_grid.getInst(parentIds).data("wandaGrid").dataSource.at(number);
            } else {
                return decideContPopup_grid.getInst(parentIds).data("wandaGrid").dataSource;
            }
        },
        addRow: function (parentIds) {
            decideContPopup_grid.editStatus = 2;
            decideContPopup_grid.getInst(parentIds).addRow();
        },
        addDataSource: function (number,parentIds,dataArry) {
            var dataSource = decideContPopup_grid.getDataSource(number,parentIds);
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "SOURCE":dataArry[i]["SOURCE"],
                    "PATH": dataArry[i]["PATH"],
                    "DECIDE": dataArry[i]["DECIDE"],
                    "TYPE": dataArry[i]["TYPE"],
                    "VALUE":dataArry[i]["VALUE"]
                });
            }
        }
    };
    // 新增条件关系
    var decideContPopup_grid_dataAdd = {
        init: function (parentId) {
            $("#"+parentId).unbind("click");
            $("#"+parentId).click(function () {
                var gridId = $(this).attr("data");
                decideContPopup_grid.addRow(gridId);
            })
        }
    };
    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        decideContPopup_grid.init(parentId);
        decideContPopup_grid_dataAdd.init(parentId);
    };
    return {
        init: init,
        decideContGrid:decideContPopup_grid,
        decideContAdd:decideContPopup_grid_dataAdd
    };
});

