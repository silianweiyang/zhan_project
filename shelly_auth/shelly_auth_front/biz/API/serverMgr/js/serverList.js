define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup","biz/API/serverMgr/js/serverDetail_popup","biz/API/serverMgr/js/serverUpload_popup"], function ($, common, compont, wandaComp, wandaCompR, orgInfo_popup,serverDetail_popup,serverUpload_popup) {
    var orgPopupWindow = function (parentIds, operId) {
        this.inst = "";
        this.optionObj = {
            minWidth: 400,
            minHeight: 350,
            title: "应用归属",
            content: "biz/html/orgInfo_popup.html"
        };
        this.getInst = function (parentIds, operId) {
            this.inst = new wandaCompR.wandaWindowR(parentIds, operId, this.optionObj);
        };
        this.init = function () {
            this.getInst(parentIds, operId);
            this.inst.init(function () {
                treeView.reloadTree();
            });
            var treeView, getPopUpValue;
            this.inst.callBack(function () {
                var parStr = parentIds.join("_");
                common.initExeByAttr(parStr + "_" + operId, "opt='orgTree'", function () {
                    treeView = new orgInfo_popup.init(parStr + "_" + operId);
                    getPopUpValue = treeView.selected;
                    treeView.init();
                });
            });
            this.inst.callBack("opt='submit'", function () {
                var parStr = parentIds.join("_");
                var selectedStr = getPopUpValue(parStr + "_" + operId).val();
                if (typeof(selectedStr) === "undefined" || selectedStr === "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择应用归属！"
                    });
                    return true;
                } else {
                    var orgSelected = JSON.parse(selectedStr);
                    var orgName = wandaCompR.getCurrentDom(parentIds, "serverList_orgName");
                    orgName.val(orgSelected.orgName);
                    var serverList_orgId = wandaCompR.getCurrentDom(parentIds, "serverList_orgId");
                    serverList_orgId.val(orgSelected.orgCode);
                }
            });
            this.inst.callBack("opt='cancel'", function () {

                var orgName = wandaCompR.getCurrentDom(parentIds, "serverList_orgName");
                orgName.val("");
                var orgId = wandaCompR.getCurrentDom(parentIds, "serverList_orgId");
                orgId.val("");

                var parStr = parentIds.join("_");

                getPopUpValue(parStr + "_" + operId).val("");

               /* var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("wandaTreeView");
                orgtree.select($()); // clears selection*/
            });
        }
    };

    //列表Grid
    var serverListGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
            }, {
                field: "SERVICE_NAME",
                title: "应用名称"
            }, {
                field: "ORG_NAME",
                title: "应用归属"
            },{
                field: "SERVICE_DESC",
                title: "应用描述"
            },{
                field: "UPDATE_DATE",
                title: "发布时间",
                width: '80px'
            },{
                field: "UPDATE_USER_NAME",
                title: "发布人",
                width: '70px'
            },{
                command: [{
                    className: "k-button-info",
                    name: "publish",
                    text: "我的API&nbsp;&nbsp;|&nbsp;&nbsp;",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        $(".level-1").find("li").each(function () {
                            if($(this).val()=="100602"){
                                $(this).addClass("active-item");
                                $(this).find("a").addClass("a_hover");
                                $(this).siblings().removeClass("active-item");
                                $(this).siblings().find("a").removeClass("a_hover");
                            }
                        });
                        $("#currentPoint").find("a:eq(2)").html("&nbsp;&nbsp;--&nbsp;&nbsp;我的API");
                        common.setRouterParams({"serverId": data["SERVICE_ID"]});
                        router.navigate('100602');
                        return false;
                    }
                }, {
                    className: "k-button-info",
                    name: "order",
                    text: "我的订阅",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        $(".level-1").find("li").each(function () {
                            if($(this).val()=="100604"){
                                $(this).addClass("active-item");
                                $(this).find("a").addClass("a_hover");
                                $(this).siblings().removeClass("active-item");
                                $(this).siblings().find("a").removeClass("a_hover");
                            }
                        });
                        $("#currentPoint").find("a:eq(2)").html("&nbsp;&nbsp;--&nbsp;&nbsp;我的订阅");
                        common.setRouterParams({"serverName": data["SERVICE_ID"]});
                        router.navigate('100604');
                        return false;
                    }
                }
                ], title: "快捷入口", width: "100px"
            }, {
                command: [{
                    className: "info",
                    name: "edit",
                    text: "<i class=\"fa fa-edit fa_icon\" title='修改' style='color:#e2971f'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var search_serverList_name = $("#serverList_name").val();
                        var search_serverList_orgId = $("#serverList_orgId").val();
                        var search_serverList_orgName = $("#serverList_orgName").val();
                        var search_serverList_desc = $("#serverList_desc").val();
                        var _param = {
                            "isAdd": "false",
                            "serviceId": data["SERVICE_ID"],
                            "search_serverList_name":search_serverList_name,
                            "search_serverList_orgId":search_serverList_orgId,
                            "search_serverList_orgName":search_serverList_orgName,
                            "search_serverList_desc":search_serverList_desc
                        };
                        common.setRouterParams(_param);
                        router.navigate('10060101?opt=应用修改');
                        return false;
                    }
                }, {
                    className: "info",
                    name: "remove",
                    text: "<i class=\"fa fa-trash-o fa_icon\" title='删除' style='color:#e70720'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var nodeDeleteInfos = [];
                            nodeDeleteInfos.push(data["SERVICE_ID"]);
                        var param = {"serviceId": nodeDeleteInfos};
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    serverListGrid.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认删除？",
                            call: function () {
                                common.ajaxDelete("api/gateService/delGateService", param, successFun, null, null, $("#serverList"));
                            }
                        });
                        return false;
                    }
                },{
                    className: "info",
                    name: "detail",
                    text: "<i class=\"fa fa-eye fa_icon\" id='#= SERVICE_ID #' title='应用详情' style='color:#66a5ae'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var _param = {"isAdd": "false", "serviceId": data["SERVICE_ID"]};
                        $("#serverList_detailBtn").trigger("click");
                        //return false;
                    }
                }], title: "操作", width: "135px"
            }],
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
            common.ajaxGet("api/gateService/queryGateServiceList", param, successFun, null, null, $("#serverList"));
        },
        pagerCallBack: function (e) {
            serverListGrid.refreshDatas(e.index);
        },

        inst: {},
        getInst: function (roldId) {
            if (serverListGrid.inst) {
                var newGridColums = [];
                $.each(serverListGrid.gridColums,function (index,value) {
                    if(index == 6){
                        var obj = value;
                        var newCommand6 = [];
                        newCommand6["width"] = "70px";
                        newCommand6["title"] = "快捷入口";
                        newCommand6["command"] = [];
                        if(roldId == 2){
                            newCommand6["command"].push(obj["command"][0]);
                            newCommand6["command"][0]["text"] = '我的API';
                        }else if(roldId == 1){
                            newCommand6["command"].push(obj["command"][1]);
                        }else{
                            newCommand6["command"] = obj["command"];
                            newCommand6["width"] = "140px";
                        }
                        newGridColums.push(newCommand6);
                    }else{
                        newGridColums.push(value);
                    }

                });
                serverListGrid.inst = new wandaComp.wandaGrid("serverListGrid", newGridColums, true, this.pagerCallBack);
            }
            return serverListGrid.inst;
        },
        init: function (roldId) {
            serverListGrid.getInst(roldId).init();
            var _params = common.getRouterParams();
            if (_params == null || _params == ""){
                _params = {
                    "orgCode": "",
                    "serviceDesc": "",
                    "serviceName": ""
                };
            }
            $("#serverList_name").val(_params["serviceName"]);
            $("#serverList_orgId").val(_params["orgCode"]);
            $("#serverList_orgName").val(_params["orgName"]);
            $("#serverList_desc").val(_params["serviceDesc"]);
            serverListGrid.pagerParam = {
                "orgCode": _params["orgCode"],
                "serviceDesc": _params["serviceDesc"],
                "serviceName": _params["serviceName"]
            };
            serverListGrid.refreshDatas();
        }
    };
    //查询按钮
    var serverList_searchBtn = {
        init: function () {
            $("#serverList_searchBtn").click(function () {
                var orgId = wandaCompR.getCurrentDom(["serverList"], "serverList_orgId").val();
                var serverList_name = $("#serverList_name").val();
                var serverList_desc = $("#serverList_desc").val();
                serverListGrid.pagerParam = {
                    "orgCode": orgId,
                    "serviceName": serverList_name,
                    "serviceDesc": serverList_desc
                };
                serverListGrid.refreshDatas();
            });
        }
    };
    //增加按钮
    var serverList_addBtn = {
        navigatePage: function () {
            var menucode = window.location.hash.substr(1, window.location.hash.length);
            var _param;
            var successFun = function (data) {
                var search_serverList_name = $("#serverList_name").val();
                var search_serverList_orgId = $("#serverList_orgId").val();
                var search_serverList_orgName = $("#serverList_orgName").val();
                var search_serverList_desc = $("#serverList_desc").val();
                _param =  {
                    "isAdd": "true",
                    "userKey":data.userKey,
                    "userPassword":data.userPassword,
                    "menuCode": menucode,
                    "search_serverList_name":search_serverList_name,
                    "search_serverList_orgId":search_serverList_orgId,
                    "search_serverList_orgName":search_serverList_orgName,
                    "search_serverList_desc":search_serverList_desc
                };
                common.setRouterParams(_param);
                router.navigate('10060101?opt=应用新增');
            };
            //获取用户名和密码
            common.ajaxPost("api/gateService/preAddGateService", {}, successFun, null, null, $("#serverList"));
        },
        init: function () {
            $("#serverList_addBtn").on("click", serverList_addBtn.navigatePage)
        }
    };

    //删除按钮
    var serverList_delBtn = {
        gridSelectValue: function () {
            var selectEdit = serverListGrid.getInst().getSelect();
            return selectEdit;
        },
        init: function () {
            $("#serverList_delBtn").on("click", function () {
                var selectDelet = serverList_delBtn.gridSelectValue();
                var deletArray = [];
                if (selectDelet.length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请至少选择一条数据！"
                    });
                    return false;
                } else {
                    for (var i = 0; i < selectDelet.length; i++) {
                        deletArray.push(selectDelet[i]["SERVICE_ID"]);
                    }
                    var param = {"serviceId": deletArray};
                    var successFun = function (data) {
                        common.jqConfirm.alert({
                            title: 1,
                            content: "操作成功！",
                            call: function () {
                                serverListGrid.refreshDatas();
                            }
                        });
                    };
                    common.jqConfirm.confirm({
                        content: "是否确认删除？",
                        call: function () {
                            common.ajaxDelete("api/gateService/delGateService", param, successFun, null, null, $("#serverList"));
                        }
                    });

                }
            })
        }

    };
//新增btn——PopupWin
    var serverList_plusPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 800,
            maxHeight: "",
            title: "应用详情",
            content: "biz/API/serverMgr/html/serverDetail_popup.html"
        },
        getInst: function () {
            if (serverList_plusPopupWin.inst) {
                serverList_plusPopupWin.inst = new wandaComp.wandaWindow("serverList_detailBtn", "serverList_plusPopup", serverList_plusPopupWin.optionObj);
            }
            return serverList_plusPopupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = serverListGrid.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
            var selectEdit = serverList_plusPopupWin.getGridSelectValue();
            if (selectEdit.length != 1) {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择一条数据！"
                });
                return false;
            } else {
                if(selectEdit[0]["FILE_NAME"]!=null&&selectEdit[0]["FILE_NAME"].length>0){
                    $("#serverList_plusPopup").find("#serverMgrDetail_download").show();
                }else{
                    $("#serverList_plusPopup").find("#serverMgrDetail_download").hide();
                }
                $("#serverList_plusPopup").find("#serverMgrDetail_files").val(selectEdit[0]["FILE_NAME"]);
                $("#serverList_plusPopup").find("#serverMgrDetail_serverCode").val(selectEdit[0]["SERVICE_ID"]);
                $("#serverList_plusPopup").find("#serverMgrDetail_orgName").val(selectEdit[0]["ORG_NAME"]);
                $("#serverList_plusPopup").find("#serverMgrDetail_serverName").val(selectEdit[0]["SERVICE_NAME"]);
                $("#serverList_plusPopup").find("#serverMgrDetail_identifyCode").val(selectEdit[0]["USER_KEY"]);
                $("#serverList_plusPopup").find("#serverMgrDetail_userPassword").val(selectEdit[0]["USER_PASSWORD"]);
                $("#serverList_plusPopup").find("#serverMgrDetail_serverDesc").val(selectEdit[0]["SERVICE_DESC"]);
            }
        },
        submitBtnCallBack: function (closeFun) {

        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#serverList_plusPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            serverList_plusPopupWin.getInst().init(function () {
                var isOk = serverList_plusPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = serverDetail_popup.init;
                common.initExeByAttr("serverList_plusPopup", "opt='submit'", function () {
                    initFun("serverList_plusPopup");
                });
            });
            serverList_plusPopupWin.getInst().callBack("opt='submit'", serverList_plusPopupWin.submitBtnCallBack, true);
            serverList_plusPopupWin.getInst().callBack("opt='cancel'", serverList_plusPopupWin.cancelBtnCallBack);
        }
    };
    //文档上传弹出层
    var serverList_uploadPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 600,
            minHeight: 120,
            maxWidth: 800,
            maxHeight: "",
            title: "文档上传",
            content: "biz/API/serverMgr/html/serverUpload_popup.html"
        },
        getInst: function () {
            if (serverList_uploadPopupWin.inst) {
                serverList_uploadPopupWin.inst = new wandaComp.wandaWindow("serverList_uploadBtn", "serverList_uploadPopup", serverList_uploadPopupWin.optionObj);
            }
            return serverList_uploadPopupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = serverListGrid.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
            var selectEdit = serverList_uploadPopupWin.getGridSelectValue();
            if (selectEdit.length != 1) {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择一条数据！"
                });
                return false;
            } else {
                $("#serverList_uploadPopup").find("#serverMgrUpload_files").val("");
                $("#serverList_uploadPopup").find("#serverMgrUpload_serverId").val(selectEdit[0]["SERVICE_ID"]);
                $("#serverList_uploadPopup").find("#serverMgrUpload_serviceName").val(selectEdit[0]["SERVICE_NAME"]);
                serverUpload_popup.load.init();
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#serverList_uploadPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#serverList_uploadPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            serverList_uploadPopupWin.getInst().init(function () {
                var isOk = serverList_uploadPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = serverUpload_popup.init;
                common.initExeByAttr("serverList_uploadPopup", "opt='submit'", function () {
                    initFun("serverList_uploadPopup");
                });
            });
            serverList_uploadPopupWin.getInst().callBack("opt='submit'", serverList_uploadPopupWin.submitBtnCallBack, true);
            serverList_uploadPopupWin.getInst().callBack("opt='cancel'", serverList_uploadPopupWin.cancelBtnCallBack);
        }
    };

    var getRole = function () {
        var roldId = compont.checkRole();
        //roldId = 2;
        serverListGrid.init(roldId);
    }
    var init = function () {
        wandaComp.elementControl($("#serverList"));
        new orgPopupWindow(["serverList"], "serverList_orgSearch").init();
        serverList_searchBtn.init();
        serverList_addBtn.init();
        serverList_delBtn.init();
        serverList_plusPopupWin.init();
        serverList_uploadPopupWin.init();
        getRole();
    };
    return {
        init: init
    }
});

