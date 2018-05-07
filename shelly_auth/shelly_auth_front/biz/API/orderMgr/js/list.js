define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup"], function ($, common, compont, wandaComp, wandaCompR, orgInfo_popup) {
    var tabstrip = {
        getInst:function () {
            return $("#tabstrip").data("wandaTabStrip");
        },
        init: function () {
            $("#tabstrip").wandaTabStrip({
                animation: {
                    open: {effects: "fadeIn"}
                },
                select:function () {
                    $("#tabstrip").show();
                }
            });
            $("#tabstrip").data("wandaTabStrip").select(1);
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
                    var orgName = wandaCompR.getCurrentDom(parentIds, "APIOrderList_orgName");
                    orgName.val(orgSelected.orgName);
                    var userInfo_orgId = wandaCompR.getCurrentDom(parentIds, "APIOrderList_orgId");
                    userInfo_orgId.val(orgSelected.orgCode);
                    APIOrderList_serverName.init();
                }
            });
            this.inst.callBack("opt='cancel'", function () {

                var orgName = wandaCompR.getCurrentDom(parentIds, "APIOrderList_orgName");
                orgName.val("");
                var orgId = wandaCompR.getCurrentDom(parentIds, "APIOrderList_orgId");
                orgId.val("");

                var parStr = parentIds.join("_");

                this.getPopUpValue(parStr + "_" + operId).val("");

                /*var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("wandaTreeView");
                orgtree.select($()); // clears selection*/
                APIOrderList_serverName.init();
            });
        }
    };
    //应用名称
    var APIOrderList_serverName = {
        value: "",
        setValue: function (value) {
            APIOrderList_serverName.value = value;
            $("#APIOrderList_serverName").data("wandaDropDownList").value(value);
        },
        successFun: function (data) {
            $("#APIOrderList_serverName").data("wandaDropDownList").setDataSource(data);
            if (APIOrderList_serverName.value) {
                $("#APIOrderList_serverName").data("wandaDropDownList").value(APIOrderList_serverName.value);
            }
        },
        init: function () {
            $("#APIOrderList_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "全部",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#APIOrderList_serverName-list").css("height","auto");
                    $("#APIOrderList_serverName-list").css("overflow","hidden");
                }
            });
            var param = {
                "orgCode": $("#APIList_orgId").val(),
                "isAuth": "yes"
            };
            common.ajaxGet("api/gateService/queryGateServiceAll", param, APIOrderList_serverName.successFun, null, null, $("#APIOrderList"));
        }
    };
    //查询列表——待审批；
    var APIOrderListGrid0 = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            }, {
                field: "ORDERSERVICENAME",
                title: "订阅应用名称"
            }, {
                field: "ORDERORGNAME",
                title: "订阅归属单位",
                width: "180px"
            }, {
                field: "PUBLISHSERVICENAME",
                title: "发布应用名称"
            },{
                field: "PUBLISHORGNAME",
                title: "发布归属单位",
                width: "180px"
            }, {
                field: "ORDER_DATE",
                title: "订阅时间",
                width: "85px"
            },
            {
                title: "快捷入口",
                width: "93px",
                command: [{
                    className: "k-button-info",
                    name: "query",
                    text: "API订阅列表",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var _param = {
                            "orderServiceId": data["SERVICE_ID"],
                            "publishServiceId":data["PUBLISH_SERVICE_ID"],
                            "orderState":"0",
                            "serverName":$("#APIOrderList_serverName").val(),
                            "orgName":$("#APIOrderList_orgName").val(),
                            "orgId":$("#APIOrderList_orgId").val()
                        };
                        common.setRouterParams(_param);
                        router.navigate("10060402?opt=API订阅列表");
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
                    rows: APIOrderListGrid0.rows
                },
                paramObj: APIOrderListGrid0.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                APIOrderListGrid0.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateApiOrder/queryOrderApp", param, successFun, null, null, $("#APIOrderList"));
        },
        getSubPageValue: function () {
            var selectEdit = APIOrderListGrid0.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            APIOrderListGrid0.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (APIOrderListGrid0.inst) {
                APIOrderListGrid0.inst = new wandaComp.wandaGrid("APIOrderListGrid0", this.gridColums, true, this.pagerCallBack);
            }
            return APIOrderListGrid0.inst;
        },
        init: function () {
            APIOrderListGrid0.getInst().init();
            APIOrderListGrid0.pagerParam = {
                "orgCode": $("#APIOrderList_orgId").val(),
                "serviceId": $("#APIOrderList_serverName").val(),
                "orderState": "0"
            };
            APIOrderListGrid0.refreshDatas();
        }
    };
    //查询列表——已通过；
    var APIOrderListGrid1 = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            }, {
                field: "ORDERSERVICENAME",
                title: "订阅应用名称"
            }, {
                field: "ORDERORGNAME",
                title: "订阅归属单位",
                width: "150px"
            }, {
                field: "PUBLISHSERVICENAME",
                title: "发布应用名称"
            },{
                field: "PUBLISHORGNAME",
                title: "发布归属单位",
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
                width: "150px",
                command: [{
                    className: "k-button-info",
                    name: "query",
                    text: "API订阅列表&nbsp;&nbsp;|&nbsp;&nbsp;",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var _param = {
                            "orderServiceId": data["SERVICE_ID"],
                            "publishServiceId":data["PUBLISH_SERVICE_ID"],
                            "orderState":"1",
                            "serverName":$("#APIOrderList_serverName").val(),
                            "orgName":$("#APIOrderList_orgName").val(),
                            "orgId":$("#APIOrderList_orgId").val()
                        };
                        common.setRouterParams(_param);
                        router.navigate("10060402?opt=API订阅列表");
                        return false;
                    }
                },{
                    className: "k-button-info",
                    name: "download",
                    text: "文档下载",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var serviceId = data["PUBLISH_SERVICE_ID"];
                        var fileName = data["FILE_NAME"];
                        if(fileName == null){
                            common.jqConfirm.alert({
                                title: 0,
                                content: "文档还未上传！"
                            });
                            return false;
                        }else{
                            try {
                                var elemIF = document.createElement("iframe");
                                elemIF.src = common.baseUrl+"api/gateService/downLoadRecommend?serviceId="+serviceId;
                                elemIF.style.display = "none";
                                document.body.appendChild(elemIF);
                                $(elemIF).load(function(e){                             //  等iframe加载完毕
                                    var retData = $(this)[0]["contentDocument"]["activeElement"]["innerText"];
                                    common.jqConfirm.alert({
                                        title: 0,
                                        content: JSON.parse(retData)["returnMsg"]
                                    });
                                });
                            }catch(e){
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "文档不存在！"
                                });
                            }
                        }
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
                    rows: APIOrderListGrid1.rows
                },
                paramObj: APIOrderListGrid1.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                APIOrderListGrid1.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateApiOrder/queryOrderApp", param, successFun, null, null, $("#APIOrderList"));
        },
        getSubPageValue: function () {
            var selectEdit = APIOrderListGrid1.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            APIOrderListGrid1.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (APIOrderListGrid1.inst) {
                APIOrderListGrid1.inst = new wandaComp.wandaGrid("APIOrderListGrid1", this.gridColums, true, this.pagerCallBack);
            }
            return APIOrderListGrid1.inst;
        },
        init: function () {
            APIOrderListGrid1.getInst().init();
            APIOrderListGrid1.pagerParam = {
                "orgCode": $("#APIOrderList_orgId").val(),
                "serviceId": $("#APIOrderList_serverName").val(),
                "orderState": "1"
            };
            APIOrderListGrid1.refreshDatas();
        }
    };
    //查询列表——已拒绝；
    var APIOrderListGrid2 = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            },{
                field: "ORDERSERVICENAME",
                title: "订阅应用名称"
            }, {
                field: "ORDERORGNAME",
                title: "订阅归属单位",
                width: "150px"
            },{
                field: "PUBLISHSERVICENAME",
                title: "发布应用名称"
            },{
                field: "PUBLISHORGNAME",
                title: "发布归属单位",
                width: "150px"
            },{
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
                width: "93px",
                command: [{
                    className: "k-button-info",
                    name: "query",
                    text: "API订阅列表",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var _param = {
                            "orderServiceId": data["SERVICE_ID"],
                            "publishServiceId":data["PUBLISH_SERVICE_ID"],
                            "orderState":"2",
                            "serverName":$("#APIOrderList_serverName").val(),
                            "orgName":$("#APIOrderList_orgName").val(),
                            "orgId":$("#APIOrderList_orgId").val()
                        };
                        common.setRouterParams(_param);
                        router.navigate("10060402?opt=API订阅列表");
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
                    rows: APIOrderListGrid2.rows
                },
                paramObj: APIOrderListGrid2.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                APIOrderListGrid2.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateApiOrder/queryOrderApp", param, successFun, null, null, $("#APIOrderList"));
        },
        getSubPageValue: function () {
            var selectEdit = APIOrderListGrid2.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            APIOrderListGrid2.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (APIOrderListGrid2.inst) {
                APIOrderListGrid2.inst = new wandaComp.wandaGrid("APIOrderListGrid2", this.gridColums, true, this.pagerCallBack);
            }
            return APIOrderListGrid2.inst;
        },
        init: function () {
            APIOrderListGrid2.getInst().init();
            APIOrderListGrid2.pagerParam = {
                "orgCode": $("#APIOrderList_orgId").val(),
                "serviceId": $("#APIOrderList_serverName").val(),
                "orderState": "2"
            };
            APIOrderListGrid2.refreshDatas();
        }
    };


    //查询button
    var APIOrderList_SearchBtn = {
        init: function () {
            $("#APIOrderList_SearchBtn").click(function () {
                var APIOrderList_orgId = $("#APIOrderList_orgId").val();
                var APIOrderList_serverName = $("#APIOrderList_serverName").val();

                APIOrderListGrid0.pagerParam = {
                    "orgCode": APIOrderList_orgId,
                    "serviceId": APIOrderList_serverName,
                    "orderState": "0"
                };
                APIOrderListGrid0.refreshDatas();

                APIOrderListGrid1.pagerParam = {
                    "orgCode": APIOrderList_orgId,
                    "serviceId": APIOrderList_serverName,
                    "orderState": "1"
                };
                APIOrderListGrid1.refreshDatas();

                APIOrderListGrid2.pagerParam = {
                    "orgCode": APIOrderList_orgId,
                    "serviceId": APIOrderList_serverName,
                    "orderState": "2"
                };
                APIOrderListGrid2.refreshDatas();

            });
        }
    };

    //删除button
    var APIOrderList_delBtn = {
        init: function () {
            $("#APIOrderList_delBtn").on("click", function () {
                var tab0 = $("#tabstrip").find(".k-state-active").find("#APIOrderListGrid0").length;
                var tab1 = $("#tabstrip").find(".k-state-active").find("#APIOrderListGrid1").length;
                var tab2 = $("#tabstrip").find(".k-state-active").find("#APIOrderListGrid2").length;
                var selectEdit = [];
                if (tab0 === 1) {
                    selectEdit = APIOrderListGrid0.getInst().getSelect();
                } else if (tab1 === 1) {
                    selectEdit = APIOrderListGrid1.getInst().getSelect();
                } else if (tab2 === 1) {
                    selectEdit = APIOrderListGrid2.getInst().getSelect();
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
                                "orderServiceId":selectEdit[i]["SERVICE_ID"]+"",
                                "publishServiceId":selectEdit[i]["PUBLISH_SERVICE_ID"]+"",
                                "orderState":selectEdit[i]["ORDER_STATE"]
                            });
                        }
                        var deleteInfos = {"delOrderApiMess": selectArray};
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    APIOrderListGrid0.refreshDatas();
                                    APIOrderListGrid1.refreshDatas();
                                    APIOrderListGrid2.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认删除？",
                            call: function () {
                                common.ajaxDelete("api/gateApiOrder/delOrderApp", deleteInfos, successFun, null, null, $("#APIOrderList"));
                            }
                        });
                    }
                }
            });
        }
    };
    var initParam = function () {
        var _params = common.getRouterParams();
        if(_params){
            var orderState = _params["orderState"];
            var serverName = _params["serverName"];
            var orgName = _params["orgName"];
            var orgId = _params["orgId"];
            $("#APIOrderList_orgId").val(orgId);
            $("#APIOrderList_orgName").val(orgName);
            $("#APIOrderList_serverName").val(serverName);
            APIOrderList_serverName.setValue(serverName);
            tabstrip.getInst().select(parseInt(orderState));
            APIOrderListGrid0.init();
            APIOrderListGrid1.init();
            APIOrderListGrid2.init();
        }else{
            $("#APIOrderList_orgId").val("");
            $("#APIOrderList_orgName").val("");
            $("#APIOrderList_serverName").val("");
            APIOrderList_serverName.setValue("");
            APIOrderListGrid0.init();
            APIOrderListGrid1.init();
            APIOrderListGrid2.init();
        }
    };
    var init = function () {
        wandaComp.elementControl($("#APIOrderList"));
        new orgPopupWindow(["APIOrderList"], "APIOrderList_orgSearch").init();
        tabstrip.init();
        APIOrderList_serverName.init();
        APIOrderList_SearchBtn.init();
        APIOrderList_delBtn.init();
        initParam();
    };
    return {
        init: init
    }
});

