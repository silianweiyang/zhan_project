define(["jquery", "common", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup"], function ($, common, wandaComp, wandaCompR, orgInfo_popup) {
    //选择框dropDownList
    var nodeServiceListGrid = {
        rows: "5",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template:"<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            }, /* {
             field: "collectCode",
             title: "资源编码"
             }, */{
                field: "collectName",
                title: "资源名称",
                width: '150px'
            }, {
                field: "refServerName",
                title: "服务名称"
            }, {
                field: "ip",
                title: "主机IP"
            }, {
                field: "collectTypeName",
                title: "资源类型"
            }, {
                field: "collectConfType",
                title: "资源子类型"
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: nodeServiceListGrid.rows
                },
                paramObj: nodeServiceListGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 5
                });
                nodeServiceListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("state/monitorServer/queryServerAbleRefInfo", param, successFun, null, null, $("#nodeServiceMgr_popup"));
        },
        pagerCallBack: function (e) {
            nodeServiceListGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (nodeServiceListGrid.inst) {
                nodeServiceListGrid.inst = new wandaComp.wandaGrid("nodeServiceMgr_popupGrid", this.gridColums, true, this.pagerCallBack);
            }
            return nodeServiceListGrid.inst;
        },
        init: function () {
            nodeServiceListGrid.getInst().init();
            nodeServiceListGrid.pagerParam = {
                "serverCode": $("#nodeServiceMgr_serverCode").val(),//新增的时候serverCode为""//修改的时候有severCode；
                "refServerCode": "",
                "nodeCode": ""
            };
            nodeServiceListGrid.refreshDatas();
        }
    };

    var nodeServiceMgr_popup_node = {
        nodeCompleteId: "nodeServiceMgr_popup_node",
        successFun:function (data) {
            $("#" + nodeServiceMgr_popup_node.nodeCompleteId).data("wandaAutoComplete").setDataSource(data.datas);
        },
        init: function () {
            $("#" + nodeServiceMgr_popup_node.nodeCompleteId).val("");
            $("#" + nodeServiceMgr_popup_node.nodeCompleteId).wandaAutoComplete({
                template: '<span title="#= nodeName #">#= ip #</span>',
                dataTextField: "ip",
                select: nodeServiceMgr_popup_node.textSelectCall,
                open: nodeServiceMgr_popup_node.textOpenCall
            });
            var param = {};
            common.ajaxGet("state/monitorNode/queryMonitorNodeList",param, nodeServiceMgr_popup_node.successFun, null, null, $("#nodeServiceMgr_popup"));
        },
        textSelectCall: function (e) {
            var dataItem = this.dataItem(e.item.index());
            server_DropDownList.init(dataItem["ip"]);
            $("#nodeServiceMgr_popup_nodeCode").val(dataItem["nodeCode"]);
        },
        textOpenCall: function (e) {
            server_DropDownList.init("");
        }
    };

    var server_DropDownList = {
        successFun: function (data) {
            var server = $("#nodeServiceMgr_popup_server").data("wandaDropDownList");
            server.setDataSource(data.datas);
        },
        init: function (ip) {
            $("#nodeServiceMgr_popup_server").wandaDropDownList({
                optionLabel: {
                    serverName: "全部",
                    serverCode: ""
                },
                dataTextField: "serverName",
                dataValueField: "serverCode",
                index: 0
            });
            ip = (ip == undefined) ? $("#nodeServiceMgr_popup_node").val() : ip;
            var param = {
                "paramObj": {
                    "ip": ip,
                    "orgCode": "",
                    "state": "1"
                }
            };
            common.ajaxGet("state/monitorServer/queryMonitorServerList", param, server_DropDownList.successFun, null, null, $("#nodeServiceMgr_popup"))
        }
    };

    var nodeServiceMgr_popup_saveBtn = {
        init: function () {
            $("#nodeServiceMgr_popup_saveBtn").unbind("click");
            $("#nodeServiceMgr_popup_saveBtn").click(function () {
                $("#nodeServiceMgr_popup_saveBtn").trigger("afterClick");
            });
        }
    };
    var nodeServiceMgr_popup_searchBtn = {
        init: function () {
            $("#nodeServiceMgr_popup_searchBtn").click(function () {
                var server = $("#nodeServiceMgr_popup_server").val();
                var nodeCode = $("#nodeServiceMgr_popup_nodeCode").val();
                nodeServiceListGrid.pagerParam = {
                    "serverCode": $("#nodeServiceMgr_serverCode").val(),//新增的时候serverCode为""//修改的时候有severCode；
                    "refServerCode": server,
                    "nodeCode": nodeCode
                };
                nodeServiceListGrid.refreshDatas();
            });
        }
    };

    var init = function () {
        nodeServiceListGrid.init();
        nodeServiceMgr_popup_node.init();
        server_DropDownList.init();
        nodeServiceMgr_popup_saveBtn.init();
        nodeServiceMgr_popup_searchBtn.init();
    };
    return {
        init: init,
        nodeServiceListGrid: nodeServiceListGrid
    }
});