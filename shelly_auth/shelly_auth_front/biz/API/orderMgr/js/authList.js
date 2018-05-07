define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup", "biz/API/orderMgr/js/auth_popup"], function ($, common, compont, wandaComp, wandaCompR, orgInfo_popup, auth_popup) {
    var tabstrip = {
        getInst:function () {
          return $("#tabstrip").data("wandaTabStrip");
        },
        init: function () {
            $("#tabstrip").wandaTabStrip({
                animation: {
                    open: {effects: "fadeIn"}
                },
                select: tabstrip.onSelect
            });
            $("#tabstrip").data("wandaTabStrip").select(0);
        },
        onSelect:function (e) {
            $("#tabstrip").show();
            if("已拒绝" == $(e.item).find("> .k-link").text().trim()){
                $("#AuthList_refuseAuthBtn").hide();
                $("#AuthList_authBtn").show();
            }else if("已通过" == $(e.item).find("> .k-link").text().trim()){
                $("#AuthList_refuseAuthBtn").show();
                $("#AuthList_authBtn").hide();
            }else{
                $("#AuthList_refuseAuthBtn").show();
                $("#AuthList_authBtn").show();
            }
        }
    };
    //应用归属
    var orgPopupWindow = function (parentIds, operId) {
        this.getPopUpValue;
        this.treeView;
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
                this.treeView.reloadTree();

            });
            this.inst.callBack(function () {
                var parStr = parentIds.join("_");
                common.initExeByAttr(parStr + "_" + operId, "opt='orgTree'", function () {
                    this.treeView = new orgInfo_popup.init(parStr + "_" + operId);
                    this.getPopUpValue = this.treeView.selected;
                    this.treeView.init();
                });

            });
            this.inst.callBack("opt='submit'", function () {
                var parStr = parentIds.join("_");
                var selectedStr = this.getPopUpValue(parStr + "_" + operId).val();
                if (typeof(selectedStr) === "undefined" || selectedStr === "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择服务归属！"
                    });
                    return true;
                } else {
                    var orgSelected = JSON.parse(selectedStr);
                    var orgName = wandaCompR.getCurrentDom(parentIds, "AuthList_orgName");
                    orgName.val(orgSelected.orgName);
                    var userInfo_orgId = wandaCompR.getCurrentDom(parentIds, "AuthList_orgId");
                    userInfo_orgId.val(orgSelected.orgCode);
                    AuthList_serverName.init();
                }
            });
            this.inst.callBack("opt='cancel'", function () {

                var orgName = wandaCompR.getCurrentDom(parentIds, "AuthList_orgName");
                orgName.val("");
                var orgId = wandaCompR.getCurrentDom(parentIds, "AuthList_orgId");
                orgId.val("");

                var parStr = parentIds.join("_");

                this.getPopUpValue(parStr + "_" + operId).val("");

                /*var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("wandaTreeView");
                orgtree.select($()); // clears selection*/
                AuthList_serverName.init();
            });
        }
    };
    //应用名称
    var AuthList_serverName = {
        value:"",
        getInst: function () {
            return $("#AuthList_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            AuthList_serverName.value = value;
            AuthList_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#AuthList_serverName").data("wandaDropDownList").setDataSource(data);
            if (AuthList_serverName.value) {
                AuthList_serverName.getInst().value(AuthList_serverName.value);
            }
        },
        init: function () {
            $("#AuthList_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "全部",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#AuthList_serverName-list").css("height","auto");
                    $("#AuthList_serverName-list").css("overflow","hidden");
                }
            });
            var param = {
                "orgCode": $("#AuthList_orgId").val(),
                "isAuth": "yes"
            };
            common.ajaxGet("api/gateService/queryGateServiceAll", param, AuthList_serverName.successFun, null, null, $("#AuthList"));
        }
    };
    //待审批列表
    var AuthListGrid0 = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            }, {
                field: "PUBLISHSERVICENAME",
                title: "发布应用名称"
            },{
                field: "PUBLISH_ORG_NAME",
                title: "发布归属单位",
                width: "180px"
            }, {
                field: "SERVICE_NAME",
                title: "订阅应用名称"
            }, {
                field: "ORDER_ORG_NAME",
                title: "订阅归属单位",
                width: "180px"
            },  {
                field: "ORDER_DATE",
                title: "订阅时间",
                width: "85px"
            },
            {
                title: "快捷入口",
                width: "90px",
                command: [{
                    className: "k-button-info",
                    name: "query",
                    text: "API订阅列表",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var _param = {
                            "orderServiceId": data["ORDERSERVICEID"],
                            "publishServiceId":data["PUBLISHSERVICEID"],
                            "orderState":data["ORDER_STATE"],
                            "serverName":$("#AuthList_serverName").val(),
                            "orgName":$("#AuthList_orgName").val(),
                            "orgId":$("#AuthList_orgId").val()
                        };
                        common.setRouterParams(_param);
                        router.navigate("10060701?opt=API授权列表");
                        return false;
                    }
                }]
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: AuthListGrid0.rows
                },
                paramObj: AuthListGrid0.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                AuthListGrid0.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateApiOrder/queryAuthApp", param, successFun, null, null, $("#AuthList"));
        },
        getSubPageValue: function () {
            var selectEdit = AuthListGrid0.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            AuthListGrid0.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (AuthListGrid0.inst) {
                AuthListGrid0.inst = new wandaComp.wandaGrid("AuthListGrid0", this.gridColums, true, this.pagerCallBack);
            }
            return AuthListGrid0.inst;
        },
        init: function () {
            AuthListGrid0.getInst().init();
            AuthListGrid0.pagerParam = {
                "serviceId":$("#AuthList_serverName").val(),
                "orgCode":$("#AuthList_orgId").val(),
                "orderState": "0"
            };
            AuthListGrid0.refreshDatas();
        }
    };
    //已审批列表
    var AuthListGrid1 = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            }, {
                field: "PUBLISHSERVICENAME",
                title: "发布应用名称"
            },{
                field: "PUBLISH_ORG_NAME",
                title: "发布归属单位",
                width: "150px"
            }, {
                field: "SERVICE_NAME",
                title: "订阅应用名称"
            }, {
                field: "ORDER_ORG_NAME",
                title: "订阅归属单位",
                width: "150px"
             },  {
                field: "ORDER_DATE",
                title: "订阅时间",
                width: "85px"
            },{
                field: "AUTH_DATE",
                title: "审批时间",
                width: "85px"
            },
            {
                title: "快捷入口",
                width: "90px",
                command: [{
                    className: "k-button-info",
                    name: "query",
                    text: "API订阅列表",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var _param = {
                            "orderServiceId": data["ORDERSERVICEID"],
                            "publishServiceId":data["PUBLISHSERVICEID"],
                            "orderState":data["ORDER_STATE"],
                            "serverName":$("#AuthList_serverName").val(),
                            "orgName":$("#AuthList_orgName").val(),
                            "orgId":$("#AuthList_orgId").val()
                        };
                        common.setRouterParams(_param);
                        router.navigate("10060701?opt=API授权列表");
                        return false;
                    }
                }]
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: AuthListGrid1.rows
                },
                paramObj: AuthListGrid1.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                AuthListGrid1.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateApiOrder/queryAuthApp", param, successFun, null, null, $("#AuthList"));
        },
        getSubPageValue: function () {
            var selectEdit = AuthListGrid1.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            AuthListGrid1.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (AuthListGrid1.inst) {
                AuthListGrid1.inst = new wandaComp.wandaGrid("AuthListGrid1", this.gridColums, true, this.pagerCallBack);
            }
            return AuthListGrid1.inst;
        },
        init: function () {
            AuthListGrid1.getInst().init();
            AuthListGrid1.pagerParam = {
                "serviceId":$("#AuthList_serverName").val(),
                "orgCode":$("#AuthList_orgId").val(),
                "orderState": "1"
            };
            AuthListGrid1.refreshDatas();
        }
    };
    //已拒绝列表
    var AuthListGrid2 = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            }, {
                field: "PUBLISHSERVICENAME",
                title: "发布应用名称"
            },{
                field: "PUBLISH_ORG_NAME",
                title: "发布归属单位",
                width: "150px"
            }, {
                field: "SERVICE_NAME",
                title: "订阅应用名称"
            }, {
                 field: "ORDER_ORG_NAME",
                 title: "订阅归属单位",
                width: "150px"
             }, {
                field: "ORDER_DATE",
                title: "订阅时间",
                width: "85px"
            }, {
                field: "AUTH_DATE",
                title: "审批时间",
                width: "85px"
            },
            {
                title: "快捷入口",
                width: "90px",
                command: [{
                    className: "k-button-info",
                    name: "query",
                    text: "API授权列表",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var _param = {
                            "orderServiceId": data["ORDERSERVICEID"],
                            "publishServiceId":data["PUBLISHSERVICEID"],
                            "orderState":data["ORDER_STATE"],
                            "serverName":$("#AuthList_serverName").val(),
                            "orgName":$("#AuthList_orgName").val(),
                            "orgId":$("#AuthList_orgId").val()
                        };
                        common.setRouterParams(_param);
                        router.navigate("10060701?opt=API授权列表");
                        return false;
                    }
                }]
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: AuthListGrid2.rows
                },
                paramObj: AuthListGrid2.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                AuthListGrid2.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateApiOrder/queryAuthApp", param, successFun, null, null, $("#AuthList"));
        },
        getSubPageValue: function () {
            var selectEdit = AuthListGrid2.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            AuthListGrid2.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (AuthListGrid2.inst) {
                AuthListGrid2.inst = new wandaComp.wandaGrid("AuthListGrid2", this.gridColums, true, this.pagerCallBack);
            }
            return AuthListGrid2.inst;
        },
        init: function () {
            AuthListGrid2.getInst().init();
            AuthListGrid2.pagerParam = {
                "serviceId":$("#AuthList_serverName").val(),
                "orgCode":$("#AuthList_orgId").val(),
                "orderState": "2"
            };
            AuthListGrid2.refreshDatas();
        }
    };
    //查询button
    var AuthList_SearchBtn = {
        init: function () {
            $("#AuthList_SearchBtn").click(function () {
                var AuthList_orgId = $("#AuthList_orgId").val();
                var AuthList_serverName = $("#AuthList_serverName").val();

                AuthListGrid0.pagerParam = {
                    "serviceId": AuthList_serverName,
                    "orderState": "0",
                    "orgCode": AuthList_orgId
                };
                AuthListGrid0.refreshDatas();

                AuthListGrid1.pagerParam = {
                    "serviceId": AuthList_serverName,
                    "orderState": "1",
                    "orgCode": AuthList_orgId
                };
                AuthListGrid1.refreshDatas();

                AuthListGrid2.pagerParam = {
                    "serviceId": AuthList_serverName,
                    "orderState": "2",
                    "orgCode": AuthList_orgId
                };
                AuthListGrid2.refreshDatas();
            });
        }
    };
    var AuthList_authBtn = {
        init:function () {
            $("#AuthList_authBtn").on("click", function () {
                var tab0 = $("#tabstrip").find(".k-state-active").find("#AuthListGrid0").length;
                var tab1 = $("#tabstrip").find(".k-state-active").find("#AuthListGrid1").length;
                var tab2 = $("#tabstrip").find(".k-state-active").find("#AuthListGrid2").length;
                var selectEdit = [],currentState = "";
                if (tab0 === 1) {
                    selectEdit = AuthListGrid0.getInst().getSelect();
                    currentState = "0";
                } else if (tab1 === 1) {
                    selectEdit = AuthListGrid1.getInst().getSelect();
                    currentState = "1";
                } else if (tab2 === 1) {
                    selectEdit = AuthListGrid2.getInst().getSelect();
                    currentState = "2";
                }
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
                            selectArray.push({
                                "orderServiceId":selectEdit[i]["ORDERSERVICEID"]+"",
                                "publishServiceId":selectEdit[i]["PUBLISHSERVICEID"]+""
                            });
                        }
                        var refuseAuthInfos = {
                            "startDate": dateConvert(new Date()),
                            "endDate": "2050/12/30",
                            "serviceIdList": selectArray,
                            "orderState": "1",
                            "currentState":currentState
                        };
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    AuthListGrid0.refreshDatas();
                                    AuthListGrid1.refreshDatas();
                                    AuthListGrid2.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认授权通过？",
                            call: function () {
                                common.ajaxPost("api/gateApiOrder/addAuthApiByApp", refuseAuthInfos, successFun, null, null, $("#AuthList"));
                            }
                        });
                    }
                }
            });
        }
    }
    //授权撤销
    var AuthList_refuseAuthBtn = {
        init: function () {
            $("#AuthList_refuseAuthBtn").on("click", function () {
                var tab0 = $("#tabstrip").find(".k-state-active").find("#AuthListGrid0").length;
                var tab1 = $("#tabstrip").find(".k-state-active").find("#AuthListGrid1").length;
                var tab2 = $("#tabstrip").find(".k-state-active").find("#AuthListGrid2").length;
                var selectEdit = [],currentState = "";;
                if (tab0 === 1) {
                    selectEdit = AuthListGrid0.getInst().getSelect();
                    currentState = "0";
                } else if (tab1 === 1) {
                    selectEdit = AuthListGrid1.getInst().getSelect();
                    currentState = "1";
                } else if (tab2 === 1) {
                    selectEdit = AuthListGrid2.getInst().getSelect();
                    currentState = "2";
                }
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
                            selectArray.push({
                                "orderServiceId":selectEdit[i]["ORDERSERVICEID"]+"",
                                "publishServiceId":selectEdit[i]["PUBLISHSERVICEID"]+""
                            });
                        }
                        var refuseAuthInfos = {"serviceIdList": selectArray, "orderState": "2","currentState":currentState};
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    AuthListGrid0.refreshDatas();
                                    AuthListGrid1.refreshDatas();
                                    AuthListGrid2.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认撤销授权？",
                            call: function () {
                                common.ajaxPost("api/gateApiOrder/addAuthApiByApp", refuseAuthInfos, successFun, null, null, $("#AuthList"));
                            }
                        });
                    }
                }
            });
        }
    };

    var dateConvert = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return y + '/' + (m < 10 ? '0' + m : m) + '/' + (d < 10 ? '0' + d : d);
    };
    var initParam = function () {
        var _params = common.getRouterParams();
        if(_params){
            var orderState = _params["orderState"];
            var serverName = _params["serverName"];
            var orgName = _params["orgName"];
            var orgId = _params["orgId"];
            $("#AuthList_orgId").val(orgId);
            $("#AuthList_orgName").val(orgName);
            $("#AuthList_serverName").val(serverName);
            AuthList_serverName.setValue(serverName);
            tabstrip.getInst().select(parseInt(orderState));
            AuthListGrid0.init();
            AuthListGrid1.init();
            AuthListGrid2.init();
        }else{
            AuthListGrid0.init();
            AuthListGrid1.init();
            AuthListGrid2.init();
        }

    }
    var init = function () {
        tabstrip.init();
        wandaComp.elementControl($("#AuthList"));
        new orgPopupWindow(["AuthList"], "AuthList_orgSearch").init();
        AuthList_serverName.init();
        AuthList_SearchBtn.init();
        AuthList_authBtn.init();
        AuthList_refuseAuthBtn.init();
        initParam();
    };
    return {
        init: init
    }
});

