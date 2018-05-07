define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "../../nodeMgr/js/node_popup", "../../nodeMgr/js/deptInfo_popup"], function ($, common, compont, wandaComp, wandaCompR, node_popup, deptInfo_popup) {
    //列表Grid
    var serverListGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选" />'  //非必写
            }, {
                field: "nodeName",
                title: "主机名称"
            }, {
                field: "ip",
                title: "主机IP",
                width: "130px"
            },{
                field: "createDate",
                title: "创建时间",
                width: '100px'
            }, {
                field: "createUserName",
                title: "创建人",
                width: '80px'
            }, {
                field: "updateDate",
                title: "修改时间",
                width: '100px'
            }, {
                field: "updateUserName",
                title: "修改人",
                width: '80px'
            },
            {
                command: [
                    {
                        className: "info",
                        name: "query",
                        imageClass: "",
                        iconClass: "",
                        text: "<i class=\"fa fa-search fa_icon\" title='查看API'></i>",
                        click: function (e) {
                            alert("查看API");
                            return false;
                        }
                    }], title: "操作", width: "50px"
            }
        ],

        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: serverListGrid.rows
                },
                paramObj: serverListGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                serverListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("state/monitorNode/queryMonitorNodeList", param, successFun, null, null, $("#serverList"));
        },
        pagerCallBack: function (e) {
            serverListGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (serverListGrid.inst) {
                serverListGrid.inst = new wandaComp.wandaGrid("serverListGrid", this.gridColums, true, this.pagerCallBack);
            }
            return serverListGrid.inst;
        },
        init: function () {
            serverListGrid.getInst().init();
            serverListGrid.pagerParam = {
                "nodeName": "",
                "state": "",
                "ip": "",
                "orgId": ""
            };
            serverListGrid.refreshDatas();
        }
    };

    //查询button
    var serverList_search = {
        init: function () {
            $("#serverList_search").click(function () {
                var name = $("#serverList_name").val();
                serverListGrid.pagerParam = {
                    "nodeName": name

                };
                serverListGrid.refreshDatas();
            });
        }
    };

    //新增btn——PopupWin
    var serverList_PlusPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 200,
            maxWidth: "",
            maxHeight: "",
            title: "新增主机配置",
            content: "biz/monitorManage/nodeMgr/html/node_popup.html"
        },
        getInst: function () {
            if (serverList_PlusPopupWin.inst) {
                serverList_PlusPopupWin.inst = new wandaComp.wandaWindow("serverList_add", "serverList_plusPopup", serverList_PlusPopupWin.optionObj);
            }
            return serverList_PlusPopupWin.inst;
        },
        setSubPageValue: function () {
            $("#nodeList_plusPopup").find("#nodeList_popup_nodeName").val("");
            $("#nodeList_plusPopup").find("#nodeList_popup_nodePos").val("");
            $("#nodeList_plusPopup").find("#nodeList_popup_ip").val("");
            $("#nodeList_plusPopup").find("#nodeList_popup_state").val("");
            $("#nodeList_plusPopup").find("#nodeList_popup_createOrg").val("");
            $("#nodeList_popup_state_div").hide();
        },
        submitBtnCallBack: function (closeFun) {
            var nodeName = $("#serverList_plusPopup").find("#nodeList_popup_nodeName").val();
            var ip = $("#serverList_plusPopup").find("#nodeList_popup_ip").val();
            var macAddress = $("#serverList_plusPopup").find("#nodeList_popup_macAddress").val();
            var addFrameInfos = {
                "nodeName": nodeName,
                "nodePos": "",
                "ip": ip,
                "macAddress": macAddress,
                "state": "1"
            };

            var successFun = function (data) {
                common.jqConfirm.alert({
                    title: 1,
                    content: "操作成功！",
                    call: function () {
                        serverListGrid.refreshDatas();
                        var plusPopup = $("#serverList_plusPopup").data("wandaWindow");
                        plusPopup.close();
                    }
                });
            };
            common.ajaxPost("state/monitorNode/addMonitorNode", addFrameInfos, successFun);

        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            serverList_PlusPopupWin.getInst().init(function () {
                serverList_PlusPopupWin.setSubPageValue();
                var initFun = node_popup.init;
                common.initExeByAttr("serverList_plusPopup", "opt='submit'", function () {
                    initFun("serverList_plusPopup");
                });
            });
            serverList_PlusPopupWin.getInst().callBack("opt='submit'", serverList_PlusPopupWin.submitBtnCallBack, true);
            serverList_PlusPopupWin.getInst().callBack("opt='cancel'", serverList_PlusPopupWin.cancelBtnCallBack);
        }
    };

    //修改btn——PopupWin
    var serverList_EditPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 300,
            maxWidth: "",
            maxHeight: "",
            title: "修改主机配置",
            content: "biz/monitorManage/nodeMgr/html/node_popup.html"
        },
        getInst: function () {
            if (serverList_EditPopupWin.inst) {
                serverList_EditPopupWin.inst = new wandaComp.wandaWindow("serverList_edit", "serverList_editPopup", serverList_EditPopupWin.optionObj);
            }
            return serverList_EditPopupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = serverList_EditPopupWin.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
            var selectEdit = serverList_EditPopupWin.getGridSelectValue();
            if (selectEdit.length != 1) {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择一条数据！"
                });
                return false;
            } else {
                $("#nodeList_editPopup").find("#nodeList_popup_nodeCode").val(selectEdit[0]["nodeCode"]);
                $("#nodeList_editPopup").find("#nodeList_popup_nodeName").val(selectEdit[0]["nodeName"]);
                $("#nodeList_editPopup").find("#nodeList_popup_nodePos").val(selectEdit[0]["nodePos"]);
                $("#nodeList_editPopup").find("#nodeList_popup_ip").val(selectEdit[0]["ip"]);
                $("#nodeList_editPopup").find("#nodeList_popup_createOrg").val(selectEdit[0]["createOrg"]);
                $("#nodeList_editPopup").find("#nodeList_popup_macAddress").val(selectEdit[0]["macAddress"]);
                $("#nodeList_editPopup").find("#nodeList_popup_state").val(selectEdit[0]["state"]);
            }
        },
        submitBtnCallBack: function (closeFun) {
            var nodeCode = $("#nodeList_editPopup").find("#nodeList_popup_nodeCode").val();
            var nodeName = $("#nodeList_editPopup").find("#nodeList_popup_nodeName").val();
            var nodePos = $("#nodeList_editPopup").find("#nodeList_popup_nodePos").val();
            var ip = $("#nodeList_editPopup").find("#nodeList_popup_ip").val();
            var createOrg = $("#nodeList_editPopup").find("#nodeList_popup_createOrg").val();
            var macAddress = $("#nodeList_editPopup").find("#nodeList_popup_macAddress").val();
            var state = $("#nodeList_editPopup").find("#nodeList_popup_state").val();
            var updateNodeInfos = {
                "nodeCode": nodeCode,
                "nodeName": nodeName,
                "nodePos": "",
                "ip": ip,
                "macAddress": macAddress,
                "state": state
            };
            var successFun = function (data) {
                common.jqConfirm.alert({
                    title: 1,
                    content: "操作成功！",
                    call: function () {
                        serverListGrid.refreshDatas();
                        var nodeList_editPopup = $("#nodeList_editPopup").data("wandaWindow");
                        nodeList_editPopup.close();
                    }
                });
            };
            common.ajaxPut("state/monitorNode/modMonitorNode", updateNodeInfos, successFun);

        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            serverList_EditPopupWin.getInst().init(function () {
                var isOk = serverList_EditPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = node_popup.init;
                common.initExeByAttr("serverList_editPopup", "opt='submit'", function () {
                    initFun("serverList_editPopup");
                });
            });
            serverList_EditPopupWin.getInst().callBack("opt='submit'", serverList_EditPopupWin.submitBtnCallBack, true);
            serverList_EditPopupWin.getInst().callBack("opt='cancel'", serverList_EditPopupWin.cancelBtnCallBack);
        }
    };

    //删除（注销）
    var serverList_delete = {
        init: function () {
            $("#serverList_delete").on("click", function () {
                var selectEdit = serverListGrid.getInst().getSelect();
                var selectArray = [];
                if (selectEdit.length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请至少选择一条数据！"
                    });
                    return false;
                } else {
                    for (var i = 0; i < selectEdit.length; i++) {
                        for (var i = 0; i < selectEdit.length; i++) {
                            selectArray.push(selectEdit[i]["nodeCode"]);
                        }
                        var nodeDeleteInfos = {"nodeCodes": selectArray};
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    nodeListGrid.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认删除？",
                            call: function () {
                                common.ajaxDelete("state/monitorNode/delMonitorNode", nodeDeleteInfos, successFun, null, null, $("#nodeList"));
                            }
                        });
                    }
                }
            });
        }
    };
    var init = function () {
        serverList_search.init();
        serverListGrid.init();
        serverList_PlusPopupWin.init();
        serverList_EditPopupWin.init();
        serverList_delete.init();
    };
    return {
        init: init
    }
});