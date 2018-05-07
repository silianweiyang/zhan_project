define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup","biz/API/orderMgr/js/detail_popup","biz/API/orderMgr/js/apiSecretDetail","biz/API/APIMgr/js/apiTest_popup"], function ($, common, compont, wandaComp, wandaCompR, orgInfo_popup,detail_popup,secret_popup,apiTest_popup) {
    //API状态
    var APIOrderList_state = {
        value:"",
        getInst:function () {
            return $("#APIOrderList_state").data("wandaDropDownList");
        },
        setValue:function (value) {
            APIOrderList_state.getInst().value(value);
            APIOrderList_state.value = value;
        },
        successFun: function (data) {
            $("#APIOrderList_state").data("wandaDropDownList").setDataSource(data);
            if(APIOrderList_state.value){
                APIOrderList_state.getInst().value(APIOrderList_state.value);
            }
        },
        init: function () {
            $("#APIOrderList_state").wandaDropDownList({
                optionLabel: {
                    text: "全部",
                    value: ""
                },
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, APIOrderList_state.successFun, null, null, $("#APIOrderList"));
        }
    };
    //查询列表——全部；
    var APIOrderListGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            }, {
                field: "API_NAME",
                title: "API名称"
            },{
                field: "PUBLISHSERVICENAME",
                title: "发布应用名称"
            }, {
                field: "SERVICE_NAME",
                title: "订阅应用名称"
            }, {
                field: "STATE_NAME",
                title: "API状态",
                width: "60px"
            }, {
                field: "ORDER_STATE_NAME",
                title: "审批结果",
                width: "70px"
            }, {
                field: "ORDER_DATE",
                title: "订阅时间",
                width: "85px"
            }, {
                field: "CREATE_USER_NAME",
                title: "订阅人",
                width: "60px"
            }, {
                field: "AUTH_DATE",
                title: "审批时间",
                width: "85px"
            }, {
                field: "AUTH_USER_NAME",
                title: "审批人",
                width: "60px"
            },
            {
                title: "操作",
                width: "80px",
                command: [{
                    className: "k-button-info",
                    name: "info",
                    imageClass: "",
                    iconClass: "",
                    text: "<i class=\"fa fa-unlock-alt fa_icon\" title='API签名信息' style='color:#66a5ae'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var _param = {
                            "isOrder": "false",
                            "menuCode": "10060402",
                            "orderId":data.ORDER_ID
                        };
                        $("#APISecretFound_hideBtn").attr("_param",JSON.stringify(_param));
                        $("#APISecretFound_hideBtn").trigger("click");
                        return false;
                    }
                },{
                    className: "k-button-info",
                    name: "query",
                    imageClass: "",
                    iconClass: "",
                    text: "<i class=\"fa fa-eye fa_icon\" title='API详情' style='color:#66a5ae'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var queryParam = {
                            "opt":"API订阅列表",
                            "apiName":$("#APIOrderList_name").val(),
                            "apiState":$("#APIOrderList_state").val(),
                            "orderServiceId":$("#APIOrderList_orderServiceId").val(),
                            "publishServiceId":$("#APIOrderList_publishServiceId").val(),
                            "orderState":$("#APIOrderList_orderState").val(),
                            "serverName":$("#APIOrderList_serverName").val(),
                            "orgName":$("#APIOrderList_orgName").val(),
                            "orgId":$("#APIOrderList_orgId").val()
                        }
                        var _param = {
                            "isOrder": "false",
                            "menuCode": "10060402",
                            "apiId": data.API_ID,
                            "queryParam":JSON.stringify(queryParam)
                        };
                        /*common.setRouterParams(_param);
                         router.navigate("10060401?opt=API详情");*/
                        $("#APIFound_hideBtn").attr("_param",JSON.stringify(_param));
                        $("#APIFound_hideBtn").trigger("click");
                        return false;
                    }
                }]
            },{ title: "测试",
                width: "60px",
                hidden: true,
                command:[{
                    className: "k-button-info",
                    name: "test",
                    text: "API测试",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        $("#APIOrderList_testBtn").attr("API_ID",data["API_ID"]);
                        $("#APIOrderList_testBtn").trigger("click");
                        return false;
                    }
                }]
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = APIOrderListGrid.pagerParam;
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas
                });
                APIOrderListGrid.getInst().setDataSource(gridData);
            };
            common.ajaxGet("api/gateApiOrder/queryOrderApi", param, successFun, null, null, $("#APIOrderList"));
        },
        getSubPageValue: function () {
            var selectEdit = APIOrderListGrid.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            APIOrderListGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function (orderState) {
            if (APIOrderListGrid.inst) {
                if("0" == orderState){
                    APIOrderListGrid.gridColums[8]["hidden"] = true;
                    APIOrderListGrid.gridColums[9]["hidden"] = true;
                }else{
                    APIOrderListGrid.gridColums[8]["hidden"] = false;
                    APIOrderListGrid.gridColums[9]["hidden"] = false;
                    if("1" == orderState){
                        APIOrderListGrid.gridColums[11]["hidden"] = false;
                    }else{
                        APIOrderListGrid.gridColums[11]["hidden"] = true;
                    }
                }
                APIOrderListGrid.inst = new wandaComp.wandaGrid("APIOrderListGrid", APIOrderListGrid.gridColums, false, this.pagerCallBack);
            }
            return APIOrderListGrid.inst;
        },
        init: function (orderState) {
            APIOrderListGrid.getInst(orderState).init();
            APIOrderListGrid.pagerParam = {
                "apiName": $("#APIOrderList_name").val(),
                "state": $("#APIOrderList_state").val(),
                "orderServiceId": $("#APIOrderList_orderServiceId").val(),
                "publishServiceId": $("#APIOrderList_publishServiceId").val(),
                "orderState": $("#APIOrderList_orderState").val()
            };
            APIOrderListGrid.refreshDatas();
        }
    };

    //查询button
    var APIOrderList_SearchBtn = {
        init: function () {
            $("#APIOrderList_SearchBtn").click(function () {
                var APIOrderList_name = $("#APIOrderList_name").val();
                var APIOrderList_state = $("#APIOrderList_state").val();

                APIOrderListGrid.pagerParam = {
                    "apiName": APIOrderList_name,
                    "state": APIOrderList_state,
                    "orderServiceId": $("#APIOrderList_orderServiceId").val(),
                    "publishServiceId": $("#APIOrderList_publishServiceId").val(),
                    "orderState": $("#APIOrderList_orderState").val()
                };
                APIOrderListGrid.refreshDatas();
            });
        }
    };

    //删除button
    var APIOrderList_delBtn = {
        init: function () {
            $("#APIOrderList_delBtn").on("click", function () {
                var selectEdit = APIOrderListGrid.getInst().getSelect();
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
                            selectArray.push(selectEdit[i]["ORDER_ID"].toString());
                        }
                        var deleteInfos = {"orderIds": selectArray};
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    APIOrderListGrid.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认删除？",
                            call: function () {
                                common.ajaxDelete("api/gateApiOrder/delOrderApi", deleteInfos, successFun, null, null, $("#APIOrderList"));
                            }
                        });
                    }
                }
            });
        }
    };
    //取消button
    var APIOrderList_closeBtn = {
        init:function () {
            $("#APIOrderList_closeBtn").click(function () {
                var _param = {
                    "orderState":$("#APIOrderList_orderState").val(),
                    "serverName":$("#APIOrderList_serverName").val(),
                    "orgName":$("#APIOrderList_orgName").val(),
                    "orgId":$("#APIOrderList_orgId").val()
                };
                common.setRouterParams(_param);
                router.navigate("100604");
            })
        }
    };
    var APIOrderList_plusPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 1000,
            maxHeight: "",
            title: "API详情",
            content: "biz/API/orderMgr/html/detail_popup.html"
        },
        getInst: function () {
            if (APIOrderList_plusPopupWin.inst) {
                APIOrderList_plusPopupWin.inst = new wandaComp.wandaWindow("APIFound_hideBtn", "APIOrderList_plusPopup", APIOrderList_plusPopupWin.optionObj);
            }
            return APIOrderList_plusPopupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = APIOrderListGrid.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
            var aaa = $("#APIFound_hideBtn").attr("_param");
        },
        submitBtnCallBack: function (closeFun) {

        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIOrderList_plusPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            APIOrderList_plusPopupWin.getInst().init(function () {
                var isOk = APIOrderList_plusPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = detail_popup.init;
                common.initExeByAttr("APIOrderList_plusPopup", "opt='submit'", function () {
                    initFun("APIOrderList_plusPopup");
                });
            });
            APIOrderList_plusPopupWin.getInst().callBack("opt='submit'", APIOrderList_plusPopupWin.submitBtnCallBack, true);
            APIOrderList_plusPopupWin.getInst().callBack("opt='cancel'", APIOrderList_plusPopupWin.cancelBtnCallBack);
        }
    };

    //签名展示
    var APIOrderSecret_plusPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 1000,
            maxHeight: "",
            title: "API签名信息",
            content: "biz/API/orderMgr/html/apiSecretDetail.html"
        },
        getInst: function () {
            if (APIOrderSecret_plusPopupWin.inst) {
                APIOrderSecret_plusPopupWin.inst = new wandaComp.wandaWindow("APISecretFound_hideBtn", "APIOrderSecret_plusPopup", APIOrderSecret_plusPopupWin.optionObj);
            }
            return APIOrderSecret_plusPopupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = APIOrderSecret_plusPopupWin.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function (closeFun) {

        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIOrderSecret_plusPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            APIOrderSecret_plusPopupWin.getInst().init(function () {
                var isOk = APIOrderSecret_plusPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = secret_popup.init;
                common.initExeByAttr("APIOrderSecret_plusPopup", "opt='cancel'", function () {
                    initFun("APIOrderSecret_plusPopup");
                });
            });
            APIOrderSecret_plusPopupWin.getInst().callBack("opt='cancel'", APIOrderSecret_plusPopupWin.cancelBtnCallBack);
        }
    };

    //测试按钮
    var APIOrderList_testPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 1000,
            maxHeight: "",
            title: "API测试",
            content: "biz/API/APIMgr/html/apiTest_popup.html"
        },
        getInst: function () {
            if (APIOrderList_testPopupWin.inst) {
                APIOrderList_testPopupWin.inst = new wandaComp.wandaWindow("APIOrderList_testBtn", "APIOrderList_testPopup", APIOrderList_testPopupWin.optionObj);
            }
            return APIOrderList_testPopupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = APIOrderListGrid.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
            var apiId = $("#APIOrderList_testBtn").attr("API_ID");
            apiTest_popup.initDetail.init(apiId);
        },
        submitBtnCallBack: function (closeFun) {

        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIOrderList_testPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            APIOrderList_testPopupWin.getInst().init(function () {
                var isOk = APIOrderList_testPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = apiTest_popup.init;
                common.initExeByAttr("APIOrderList_testPopup", "opt='submit'", function () {
                    initFun("APIOrderList_testPopup");
                });
            });
            APIOrderList_testPopupWin.getInst().callBack("opt='submit'", APIOrderList_testPopupWin.submitBtnCallBack, true);
            APIOrderList_testPopupWin.getInst().callBack("opt='cancel'", APIOrderList_testPopupWin.cancelBtnCallBack);
        }
    };
    var initParam = function () {
        var _params = common.getRouterParams();
        var apiName = _params["apiName"];
        var apiState = _params["apiState"];
        var orderServiceId = _params["orderServiceId"];
        var publishServiceId = _params["publishServiceId"];
        var orderState = _params["orderState"];
        var serverName = _params["serverName"];
        var orgName = _params["orgName"];
        var orgId = _params["orgId"];

        $("#APIOrderList_name").val(apiName);
        $("#APIOrderList_state").val(apiState);
        APIOrderList_state.setValue(apiState);

        $("#APIOrderList_orderServiceId").val(orderServiceId);
        $("#APIOrderList_publishServiceId").val(publishServiceId);
        $("#APIOrderList_orderState").val(orderState);
        $("#APIOrderList_serverName").val(serverName);
        $("#APIOrderList_orgName").val(orgName);
        $("#APIOrderList_orgId").val(orgId);
        APIOrderListGrid.init(orderState);
    };
    var init = function () {
        APIOrderList_state.init();
        APIOrderList_SearchBtn.init();
        APIOrderList_delBtn.init();
        APIOrderList_closeBtn.init();
        APIOrderList_plusPopupWin.init();
        APIOrderSecret_plusPopupWin.init();
        APIOrderList_testPopupWin.init();
        initParam();
    };
    return {
        init: init
    }
});

