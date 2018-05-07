define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup", "biz/API/orderMgr/js/auth_popup","biz/API/orderMgr/js/detail_popup"], function ($, common, compont, wandaComp, wandaCompR, orgInfo_popup, auth_popup,detail_popup) {
    //API状态
    var APIAuthList_state = {
        value:"",
        getInst:function () {
          return $("#APIAuthList_state").data("wandaDropDownList");
        },
        setValue:function (value) {
            APIAuthList_state.getInst().value(value);
            APIAuthList_state.value = value;
        },
        successFun: function (data) {
            $("#APIAuthList_state").data("wandaDropDownList").setDataSource(data);
            if(APIAuthList_state.value){
                APIAuthList_state.getInst().value(APIAuthList_state.value);
            }
        },
        init: function () {
            $("#APIAuthList_state").wandaDropDownList({
                optionLabel: {
                    text: "全部",
                    value: ""
                },
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, APIAuthList_state.successFun, null, null, $("#APIAuthList"));
        }
    };
    //查询列表
    var APIAuthListGrid = {
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
            }, {
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
                title: "订阅状态",
                width: "70px"
            }, {
                field: "ORDER_DATE",
                title: "订阅时间",
                width: "90px"
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
                width: "55px",
                command: [{
                    className: "k-button-info",
                    name: "query",
                    imageClass: "",
                    iconClass: "",
                    text: "<i class=\"fa fa-eye fa_icon\" title='API详情' style='color:#66a5ae'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var queryParam = {
                            "opt":"API授权列表",
                            "apiName":$("#APIAuthList_name").val(),
                            "apiState":$("#APIAuthList_state").val(),
                            "orderServiceId":$("#APIAuthList_orderServiceId").val(),
                            "publishServiceId":$("#APIAuthList_publishServiceId").val(),
                            "orderState":$("#APIAuthList_orderState").val(),
                            "serverName":$("#APIAuthList_serverName").val(),
                            "orgName":$("#APIAuthList_orgName").val(),
                            "orgId":$("#APIAuthList_orgId").val()
                        }
                        var _param = {
                            "isOrder": "false",
                            "menuCode": "10060701",
                            "apiId": data.API_ID,
                            "queryParam":JSON.stringify(queryParam)
                        };
                        //common.setRouterParams(_param);
                        //router.navigate("10060401?opt=API详情");
                        $("#APIFound_hideBtn").attr("_param",JSON.stringify(_param));
                        $("#APIFound_hideBtn").trigger("click");
                        return false;
                    }
                }]
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = APIAuthListGrid.pagerParam;
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas
                });
                APIAuthListGrid.getInst().setDataSource(gridData);
            };
            common.ajaxGet("api/gateApiOrder/queryAuthApi", param, successFun, null, null, $("#APIAuthList"));
        },
        getSubPageValue: function () {
            var selectEdit = APIAuthListGrid.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            APIAuthListGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function (orderState) {
            if (APIAuthListGrid.inst) {
                if("0" == orderState){
                    APIAuthListGrid.gridColums[8]["hidden"] = true;
                    APIAuthListGrid.gridColums[9]["hidden"] = true;
                }else{
                    APIAuthListGrid.gridColums[8]["hidden"] = false;
                    APIAuthListGrid.gridColums[8]["field"] = "AUTH_DATE";
                    APIAuthListGrid.gridColums[9]["hidden"] = false;
                    APIAuthListGrid.gridColums[9]["field"] = "AUTH_USER_NAME";
                }
                APIAuthListGrid.inst = new wandaComp.wandaGrid("APIAuthListGrid", APIAuthListGrid.gridColums, false, this.pagerCallBack);
            }
            return APIAuthListGrid.inst;
        },
        init: function (orderState) {
            APIAuthListGrid.getInst(orderState).init();
            APIAuthListGrid.pagerParam = {
                "apiName": $("#APIAuthList_name").val(),
                "state": $("#APIAuthList_state").val(),
                "orderServiceId": $("#APIAuthList_orderServiceId").val(),
                "publishServiceId": $("#APIAuthList_publishServiceId").val(),
                "orderState": $("#APIAuthList_orderState").val()
            };
            APIAuthListGrid.refreshDatas();
        }
    };

    //查询button
    var APIAuthList_SearchBtn = {
        init: function () {
            $("#APIAuthList_SearchBtn").click(function () {
                var APIAuthList_name = $("#APIAuthList_name").val();
                var APIAuthList_state = $("#APIAuthList_state").val();

                APIAuthListGrid.pagerParam = {
                    "apiName": APIAuthList_name,
                    "state": APIAuthList_state,
                    "orderServiceId": $("#APIAuthList_orderServiceId").val(),
                    "publishServiceId": $("#APIAuthList_publishServiceId").val(),
                    "orderState": $("#APIAuthList_orderState").val()
                };
                APIAuthListGrid.refreshDatas();
            });
        }
    };
    //取消button
    var APIAuthList_closeBtn = {
        init:function () {
            $("#APIAuthList_closeBtn").click(function () {
                var _param = {
                    "orderState":$("#APIAuthList_orderState").val(),
                    "serverName":$("#APIAuthList_serverName").val(),
                    "orgName":$("#APIAuthList_orgName").val(),
                    "orgId":$("#APIAuthList_orgId").val()
                };
                common.setRouterParams(_param);
                router.navigate("100607");
            })
        }
    }

    //授权button
    var APIAuthList_authBtn = {
        init:function () {
            $("#APIAuthList_authBtn").on("click", function () {
                var selectEdit = APIAuthListGrid.getInst().getSelect();
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
                        var refuseAuthInfos = {
                            "startDate": dateConvert(new Date()),
                            "endDate": "2050/12/30",
                            "orderIds": selectArray,
                            "orderState": "1"
                        };
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    APIAuthListGrid.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认授权通过？",
                            call: function () {
                                common.ajaxPost("api/gateApiOrder/addAuthApi", refuseAuthInfos, successFun, null, null, $("#APIAuthList"));
                            }
                        });
                    }
                }
            });
        }
    };
    //授权撤销
    var APIAuthList_refuseAuthBtn = {
        init: function () {
            $("#APIAuthList_refuseAuthBtn").on("click", function () {
                var selectEdit = [];
                selectEdit = APIAuthListGrid.getInst().getSelect();
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
                        var refuseAuthInfos = {"orderIds": selectArray, "orderState": "2"};
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    APIAuthListGrid.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认撤销授权？",
                            call: function () {
                                common.ajaxPost("api/gateApiOrder/addAuthApi", refuseAuthInfos, successFun, null, null, $("#APIAuthList"));
                            }
                        });
                    }
                }
            });
        }
    };

    var APIAuthList_plusPopupWin = {
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
            if (APIAuthList_plusPopupWin.inst) {
                APIAuthList_plusPopupWin.inst = new wandaComp.wandaWindow("APIFound_hideBtn", "APIAuthList_plusPopup", APIAuthList_plusPopupWin.optionObj);
            }
            return APIAuthList_plusPopupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = APIAuthListGrid.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
            var aaa = $("#APIFound_hideBtn").attr("_param");
        },
        submitBtnCallBack: function (closeFun) {

        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIAuthList_plusPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            APIAuthList_plusPopupWin.getInst().init(function () {
                var isOk = APIAuthList_plusPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = detail_popup.init;
                common.initExeByAttr("APIAuthList_plusPopup", "opt='submit'", function () {
                    initFun("APIAuthList_plusPopup");
                });
            });
            APIAuthList_plusPopupWin.getInst().callBack("opt='submit'", APIAuthList_plusPopupWin.submitBtnCallBack, true);
            APIAuthList_plusPopupWin.getInst().callBack("opt='cancel'", APIAuthList_plusPopupWin.cancelBtnCallBack);
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
        var apiName = _params["apiName"];
        var apiState = _params["apiState"];
        var orderServiceId = _params["orderServiceId"];
        var publishServiceId = _params["publishServiceId"];
        var orderState = _params["orderState"];
        var serverName = _params["serverName"];
        var orgName = _params["orgName"];
        var orgId = _params["orgId"];

        $("#APIAuthList_name").val(apiName);
        $("#APIAuthList_state").val(apiState);
        APIAuthList_state.setValue(apiState);

        $("#APIAuthList_orderServiceId").val(orderServiceId);
        $("#APIAuthList_publishServiceId").val(publishServiceId);
        $("#APIAuthList_orderState").val(orderState);
        $("#APIAuthList_serverName").val(serverName);
        $("#APIAuthList_orgName").val(orgName);
        $("#APIAuthList_orgId").val(orgId);
        if("0" == orderState){
            $("#APIAuthList_authBtn").show();
            $("#APIAuthList_refuseAuthBtn").show();
        }else if("1" == orderState){
            $("#APIAuthList_authBtn").hide();
            $("#APIAuthList_refuseAuthBtn").show();
        }else if("2" == orderState){
            $("#APIAuthList_authBtn").show();
            $("#APIAuthList_refuseAuthBtn").hide();
        }
        APIAuthListGrid.init(orderState);
    }
    var init = function () {
        APIAuthList_state.init();
        APIAuthList_SearchBtn.init();
        APIAuthList_authBtn.init();
        APIAuthList_refuseAuthBtn.init();
        APIAuthList_closeBtn.init();
        APIAuthList_plusPopupWin.init();
        initParam();
    };
    return {
        init: init
    }
});

