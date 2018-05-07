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
            }
        ],
        init:function (parentIds) {
            decideContPopup_grid.getInst(parentIds).init();
        },
        inst: {},
        getInst: function (parentIds) {
            if (decideContPopup_grid.inst) {
                decideContPopup_grid.inst = new wandaComp.wandaGrid(parentIds, this.gridColums, false, this.pagerCallBack,this.isEditable,false);
            }
            return decideContPopup_grid.inst;
        },
        isEditable:function () {
            var editArry = [];
            editArry[0] = {
                "name":"SOURCE",
                "type":"select",
                "readonly":false,
                "values": [{"text": "上节点输出", "value": "2"}, {"text": "系统", "value": "3"}]
            }
            editArry[1] = {
                "name":"PATH",
                "type":"text",
                "readonly":false
            }
            editArry[2] = {
                "name":"DECIDE",
                "type":"select",
                "readonly":false,
                "values":[{"text":"=", "value":"="},{"text":">", "value":">"},{"text":"<", "value":"<"
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

    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        decideContPopup_grid.init(parentId);
    };
    return {
        init: init,
        decideContGrid:decideContPopup_grid
    };
});

