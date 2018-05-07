define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup", "biz/API/orderMgr/js/detail_popup"], function ($, common, compont, wandaComp, wandaCompR, orgInfo_popup, detail_popup) {

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
                    var orgName = wandaCompR.getCurrentDom(parentIds, "APIFound_orgName");
                    orgName.val(orgSelected.orgName);
                    var APIFound_orgId = wandaCompR.getCurrentDom(parentIds, "APIFound_orgId");
                    APIFound_orgId.val(orgSelected.orgCode);
                }
            });
            this.inst.callBack("opt='cancel'", function () {

                var orgName = wandaCompR.getCurrentDom(parentIds, "APIFound_orgName");
                orgName.val("");
                var orgId = wandaCompR.getCurrentDom(parentIds, "APIFound_orgId");
                orgId.val("");

                var parStr = parentIds.join("_");

                getPopUpValue(parStr + "_" + operId).val("");

                var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("wandaTreeView");
                orgtree.select($()); // clears selection
            });
        }
    };

    //应用名称
    var APIFound_orderServiceId = {
        value: "",
        getInst: function () {
            return $("#APIFound_orderServiceId").data("wandaDropDownList");
        },
        setValue: function (value) {
            APIFound_orderServiceId.value = value;
            APIFound_orderServiceId.getInst().value(value);
        },
        successFun: function (data) {
            if (data && data.length == 0) {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请先添加应用！"
                });
                return false;
            } else {
                $("#APIFound_orderServiceId").data("wandaDropDownList").setDataSource(data);
                if (APIFound_orderServiceId.value) {
                    var cs = APIFound_orderServiceId.getInst();
                    APIFound_orderServiceId.getInst().value(APIFound_orderServiceId.value);
                }else{
                    APIFound_orderServiceId.getInst().select(0);
                }
                onChange.init();
                APIFound_initParams.init();
            }
        },
        init: function () {
            $("#APIFound_orderServiceId").wandaDropDownList({
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#APIFound_orderServiceId-list").css("height","auto");
                    $("#APIFound_orderServiceId-list").css("overflow","hidden");
                }
            });
            var param = {
                "isAuth": "yes",
                "serviceId":APIFound_apiGrid.pagerParam.serviceId

            };
            common.ajaxGet("api/gateService/queryGateServiceAll", param, APIFound_orderServiceId.successFun, null, null, $("#APIFound_api"));
        }
    };

    var onChange = {
        init: function () {
            $("#APIFound_orderServiceId").change(function () {
                APIFound_apiGrid.refreshDatas();
            });
        }
    };

    //api详情；
    orderDetailFunc = function (e) {
        var data = $("#APIFound_apiGrid").data("wandaGrid").dataItem($(e).closest("tr"));
        var orderServiceId = $("#APIFound_orderServiceId").val();
        var serviceId = APIFound_apiGrid.pagerParam.serviceId;
        var search_serviceId = $("#APIFound_api_search_serviceId").val();
        var search_serviceDesc = $("#APIFound_api_search_serviceDesc").val();
        var search_orgCode = $("#APIFound_api_search_orgCode").val();
        var search_orgName = $("#APIFound_api_search_orgName").val();
        var menuCode = $("#APIFound_api_menuCode").val();
        var queryParam = {
            "serviceId": serviceId,
            "search_serviceId": search_serviceId,
            "search_serviceDesc": search_serviceDesc,
            "search_orgCode": search_orgCode,
            "search_orgName": search_orgName,
            "orderServiceId": orderServiceId,
            "menuCode": menuCode,
            "opt": "API列表"
        };
        var _param = {
            "isOrder": "true",
            "menuCode": "10060301",
            "orderServiceId": orderServiceId,
            "publishServiceId": serviceId,
            "apiId": data.API_ID,
            "subscribe": data.SUBSCRIBE,
            "queryParam": JSON.stringify(queryParam)
        };
        /* common.setRouterParams(_param);
         router.navigate('10060401?opt=API详情');//api详情；*/
        $("#APIFound_hideBtn").attr("_param", JSON.stringify(_param));
        $("#APIFound_hideBtn").trigger("click");
    };

    //修改btn——PopupWin
    var detail_popupWin = {
        inst: {},
        optionObj: {
            minWidth: 800,
            minHeight: 250,
            maxWidth: 1000,
            maxHeight: "",
            title: "API详情",
            content: "biz/API/orderMgr/html/detail_popup.html"
        },
        getInst: function () {
            if (detail_popupWin.inst) {
                detail_popupWin.inst = new wandaComp.wandaWindow("APIFound_hideBtn", "detail_popupDiv", detail_popupWin.optionObj);
            }
            return detail_popupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = APIFound_apiGrid.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
            var aaa = $("#APIFound_hideBtn").attr("_param");
        },
        submitBtnCallBack: function (closeFun) {
            /*var detail_popupDiv = $("#detail_popupDiv").data("kendoWindow");
             detail_popupDiv.close();*/
        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            detail_popupWin.getInst().init(function () {
                var isOk = detail_popupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = detail_popup.init;
                common.initExeByAttr("detail_popupDiv", "opt='submit'", function () {
                    initFun("detail_popupDiv");
                });
            });
            detail_popupWin.getInst().callBack("opt='submit'", detail_popupWin.submitBtnCallBack, true);
            detail_popupWin.getInst().callBack("opt='cancel'", detail_popupWin.cancelBtnCallBack);
        }
    };

    var APIFound_apiGrid = {
        rows: "10",
        pagerParam: {
            "serviceId": ""
        },
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            }, {
                field: "API_NAME",
                title: "API名称",
                width: "200px"
            }, {
                field: "SERVICE_NAME",
                title: "应用名称",
                width: "200px"
            }, {
                field: "ORG_NAME",
                title: "应用归属",
                width: "200px"
            }, {
                field: "API_DESC",
                title: "API描述"
            }, {
                field: "UPDATE_DATE",
                title: "发布时间",
                width: "90px"
            }, {
                field: "UPDATE_USER_NAME",
                title: "发布人",
                width: "80px"
            }, {
                field: "SUBSCRIBE",
                title: "是否订阅",
                width: "80px"
            },
            {
                title: "操作",
                width: "55px",
                command: [{
                    className: "info",
                    name: "more",
                    imageClass: "",
                    iconClass: "",
                    text: "<i class=\"fa fa-eye fa_icon\" title='API详情' style='color:#66a5ae'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var orderServiceId = $("#APIFound_orderServiceId").val();
                        var serviceId = APIFound_apiGrid.pagerParam.serviceId;
                        var search_serviceId = $("#APIFound_api_search_serviceId").val();
                        var search_serviceDesc = $("#APIFound_api_search_serviceDesc").val();
                        var search_orgCode = $("#APIFound_api_search_orgCode").val();
                        var search_orgName = $("#APIFound_api_search_orgName").val();
                        var menuCode = $("#APIFound_api_menuCode").val();
                        var queryParam = {
                            "serviceId": serviceId,
                            "search_serviceId": search_serviceId,
                            "search_serviceDesc": search_serviceDesc,
                            "search_orgCode": search_orgCode,
                            "search_orgName": search_orgName,
                            "orderServiceId": orderServiceId,
                            "menuCode": menuCode,
                            "opt": "API列表"
                        };
                        var _param = {
                            "isOrder": "true",
                            "menuCode": "10060301",
                            "orderServiceId": orderServiceId,
                            "publishServiceId": serviceId,
                            "apiId": data.API_ID,
                            "subscribe": data.SUBSCRIBE,
                            "queryParam": JSON.stringify(queryParam)
                        };
                        /* common.setRouterParams(_param);
                         router.navigate('10060401?opt=API详情');//api详情；*/
                        $("#APIFound_hideBtn").attr("_param", JSON.stringify(_param));
                        $("#APIFound_hideBtn").trigger("click");
                        return false;
                    }
                }]
            }],
        filterData: function (datas, orderServiceId, publishServiceId) {
            var param = {
                "orderServiceId": orderServiceId,
                "publishServiceId": publishServiceId
            };
            var successFun = function (retData) {
                var retDatas = retData.datas;
                for (var i = 0; i < datas.length; i++) {
                    var flag = false;
                    for(var j = 0;j < retDatas.length; j++){
                        if(retDatas[j]["apiId"] == datas[i]["API_ID"]){
                            flag = true;
                            datas[i]["SUBSCRIBE"] = retDatas[j].orderState;
                        }
                    }
                    if(!flag){
                        datas[i]["SUBSCRIBE"] = "否";
                    }
                }
                var gridData = new wanda.data.DataSource({
                    data: datas
                });
                APIFound_apiGrid.getInst().setDataSource(gridData);
            };
            common.ajaxGet("api/gateApiOrder/queryIsOrderApiByServiceId", param, successFun, null, null, $("#APIFound_api"));
        },
        refreshDatas: function () {
            var param = APIFound_apiGrid.pagerParam;
            var successFun = function (data) {
                var orderServiceId = $("#APIFound_orderServiceId").val();
                var publishServiceId = APIFound_apiGrid.pagerParam.serviceId;
                APIFound_apiGrid.filterData(data.datas, orderServiceId, publishServiceId);
            };
            common.ajaxGet("api/gateApiOrder/queryOrderApiByServiceId", param, successFun, null, null, $("#APIFound_api"));
        },
        getSubPageValue: function () {
            var selectEdit = APIFound_apiGrid.getInst().getSelect();
            return selectEdit;
        },
        inst: {},
        getInst: function () {
            if (APIFound_apiGrid.inst) {
                APIFound_apiGrid.inst = new wandaComp.wandaGrid("APIFound_apiGrid", this.gridColums, false, this.pagerCallBack);
            }
            return APIFound_apiGrid.inst;
        },
        init: function () {
            APIFound_apiGrid.getInst().init();
        }
    };

    //订阅btn
    var APIFound_orderBtn = {
        init: function () {
            $("#APIFound_orderBtn").click(function () {
                var selectEdit = APIFound_apiGrid.getInst().getSelect();
                var selectArray = [];
                if (selectEdit.length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请至少选择一条数据！"
                    });
                    return false;
                } else {
                    var bz = false;
                    for (var i = 0; i < selectEdit.length; i++) {
                        selectArray.push(selectEdit[i]["API_ID"].toString());
                        if ("已通过" == selectEdit[i]["SUBSCRIBE"] || "待审批" == selectEdit[i]["SUBSCRIBE"]) {
                            bz = true;
                            break;
                        }
                    }
                    var orderServiceId = $("#APIFound_orderServiceId").val();
                    var publishServiceId = APIFound_apiGrid.pagerParam.serviceId;
                    var orderInfos = {
                        "serviceId": orderServiceId,
                        "publishServiceId": publishServiceId,
                        "apiIds": selectArray
                    };
                    var successFun = function (data) {
                        common.jqConfirm.alert({
                            title: 1,
                            content: "操作成功！",
                            call: function () {
                                APIFound_apiGrid.refreshDatas();
                            }
                        });
                    };
                    if (bz) {
                        common.jqConfirm.alert({
                            title: 0,
                            content: "不可重复订阅！",
                            call: function () {
                                APIFound_apiGrid.refreshDatas();
                            }
                        });
                    } else {
                        common.jqConfirm.confirm({
                            content: "是否确认订阅？",
                            call: function () {
                                common.ajaxPost("api/gateApiOrder/addOrderApi", orderInfos, successFun, null, null, $("#APIFound_api"));
                            }
                        });
                    }
                }
            });

        }
    };

    //取消按钮
    var APIFound_closeBtn = {
        init: function () {
            $("#APIFound_closeBtn").click(function () {
                var search_serviceId = $("#APIFound_api_search_serviceId").val();
                var search_serviceDesc = $("#APIFound_api_search_serviceDesc").val();
                var search_orgCode = $("#APIFound_api_search_orgCode").val();
                var search_orgName = $("#APIFound_api_search_orgName").val();
                var _param = {
                    "serviceId": search_serviceId,
                    "serviceDesc": search_serviceDesc,
                    "orgCode": search_orgCode,
                    "orgName": search_orgName
                };
                common.setRouterParams(_param);
                router.navigate("100603");
            })
        }
    };

    //api初始化
    var APIFound_initParams = {
        init: function () {
            var _params = common.getRouterParams();
            $("#APIFound_api_menuCode").val(_params["menuCode"]);
            $("#APIFound_api_search_serviceId").val(_params["search_serviceId"]);
            $("#APIFound_api_search_serviceDesc").val(_params["search_serviceDesc"]);
            $("#APIFound_api_search_orgCode").val(_params["search_orgCode"]);
            $("#APIFound_api_search_orgName").val(_params["search_orgName"]);
            if ("" == _params["orderServiceId"]) {
                _params["orderServiceId"] = $("#APIFound_orderServiceId").val();
            }
            APIFound_orderServiceId.setValue(_params["orderServiceId"]);
            APIFound_apiGrid.refreshDatas();
        }
    };

    var init = function () {
        wandaComp.elementControl($("#APIFound_api"));
        new orgPopupWindow(["APIFound_api"], "APIFound_orgSearch").init();
        APIFound_apiGrid.init();
        var _params = common.getRouterParams();
        APIFound_apiGrid.pagerParam.serviceId = _params["serviceId"];
        common.setRouterParams(_params);
        //js 去除记忆  value每次都会记住上次值
        APIFound_orderServiceId.value = "";
        APIFound_orderServiceId.init();
        /* APIFound_state.init();*/
        APIFound_orderBtn.init();
        APIFound_closeBtn.init();
        detail_popupWin.init();
    };
    return {
        init: init
    }
});