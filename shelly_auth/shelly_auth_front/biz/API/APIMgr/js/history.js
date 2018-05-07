define(["jquery", "common","compont","wandaComp", "wandaCompR", "biz/js/orgInfo_popup","biz/API/orderMgr/js/detail_popup"], function ($, common,compont,wandaComp, wandaCompR, orgInfo_popup,detail_popup) {
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
                    this.getPopUpValue = this.treeView.selected
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
                    var orgName = wandaCompR.getCurrentDom(parentIds, "APIHistoryList_orgName");
                    orgName.val(orgSelected.orgName);
                    var userInfo_orgId = wandaCompR.getCurrentDom(parentIds, "APIHistoryList_orgId");
                    userInfo_orgId.val(orgSelected.orgCode);
                    APIHistoryList_serverName.init();
                }
            });
            this.inst.callBack("opt='cancel'", function () {

                var orgName = wandaCompR.getCurrentDom(parentIds, "APIHistoryList_orgName");
                orgName.val("");
                var orgId = wandaCompR.getCurrentDom(parentIds, "APIHistoryList_orgId");
                orgId.val("");

                var parStr = parentIds.join("_");

                this.getPopUpValue(parStr + "_" + operId).val("");

                /*var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("kendoTreeView");
                orgtree.select($()); // clears selection*/
                APIHistoryList_serverName.init();
            });
        }
    };
    //应用名称
    var APIHistoryList_serverName = {
        value:"",
        getInst: function () {
            return $("#APIHistoryList_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            APIHistoryList_serverName.value = value;
            if(APIHistoryList_serverName.getInst()){
                APIHistoryList_serverName.getInst().value(value);
            }
        },
        successFun: function (data) {
            data.unshift({
                SERVICE_NAME: "全部",
                SERVICE_ID: ""
            });
            $("#APIHistoryList_serverName").data("wandaDropDownList").setDataSource(data);
            if(APIHistoryList_serverName.value){
                APIHistoryList_serverName.getInst().value(APIHistoryList_serverName.value);
            }
        },
        init: function () {
            $("#APIHistoryList_serverName").wandaDropDownList({
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#APIHistoryList_serverName-list").css("height","auto");
                    $("#APIHistoryList_serverName-list").css("overflow","hidden");
                }
            });
            var param = {
                "orgCode":$("#APIHistoryList_orgId").val()
            };
            common.ajaxGet("api/gateService/queryGateServiceAll", param, APIHistoryList_serverName.successFun, null, null, $("#APIHistoryList"));
        }
    };
    var APIHistoryListGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
           {
                field: "API_VERSION",
                title: "版本号",
                 width: "60px"
            }, {
                field: "API_NAME",
                title: "API名称",
                width: "200px"
            }, {
                field: "SERVICE_NAME",
                title: "应用名称",
                width: "200px"
            },{
                field: "API_DESC",
                title: "API描述"
            }, {
                field: "STATENAME",
                title: "状态",
                width: "50px"
            }, {
                field: "UPDATE_USER_NAME",
                title: "发布人",
                width: "65px"
            },{
                field: "UPDATE_DATE",
                title: "发布时间",
                width: "140px"
            },
            {
                command: [{
                    className:"k-button-info",name: "next", text: "API详情&nbsp;&nbsp;|&nbsp;&nbsp;", click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var isRowId = data["IS_RAW_API"];
                        var queryParam = {
                            "opt":"API发布历史",
                            "apiId": data.API_ID,
                            "apiName":$("#APIHistoryList_name").val(),
                            "serverId":$("#APIHistoryList_serverName").val()
                        }
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var _param = {"isAdd": "false","menuCode": "100605","hisId":data["HIS_ID"], "apiId": data["API_ID"],"queryParam":JSON.stringify(queryParam)};

                        common.setRouterParams(_param);
                        if(isRowId == "2"){
                            router.navigate('10070502?opt=API发布详情');
                        }else{
                            router.navigate('10060203?opt=API发布详情');
                        }
                        return false;
                    }
                }, {
                    className:"k-button-info",name: "query", text: "切换至此版本", click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        APIHistoryList_change.init(data["API_ID"]+"",data["HIS_ID"]+"");
                        return false;
                    }
                }], title: "操作", width: "170px"
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: APIHistoryListGrid.rows
                },
                paramObj: APIHistoryListGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                APIHistoryListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateHisApi/queryGateApiHisList", param, successFun, null, null, $("#APIHistoryList"));
        },
        getSubPageValue: function () {
            var selectEdit = APIHistoryListGrid.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            APIHistoryListGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (APIHistoryListGrid.inst) {
                APIHistoryListGrid.inst = new wandaComp.wandaGrid("APIHistoryListGrid", this.gridColums, true, this.pagerCallBack);
            }
            return APIHistoryListGrid.inst;
        },
        init: function (apiId) {
            APIHistoryListGrid.getInst().init();
            APIHistoryListGrid.pagerParam = {
                "hisId": "",
                "apiId": apiId==undefined?"":apiId,
                "apiName": $("#APIHistoryList_name").val(),
                "apiDesc": "",
                "serviceId": $("#APIHistoryList_serverName").val()
        };
            APIHistoryListGrid.refreshDatas();
        }
    };
    //切换至此版本
    var APIHistoryList_change = {
        init:function (apiId,hisId) {
            var successFun = function () {
                common.jqConfirm.alert({
                    title: 1,
                    content: "操作成功！",
                    call: function () {
                        APIHistoryListGrid.refreshDatas();
                    }
                });
            }
            common.jqConfirm.confirm({
                content: "确定切换至此版本",
                call: function () {
                    var param = {
                        "apiId":apiId,
                        "hisId":hisId
                    };
                    common.ajaxPut("api/gateApi/changeGateApi", param,successFun, null, null, $("#APIHistoryList"));
                }
            });
        }
    }
    //查询button
    var APIHistoryList_SearchBtn = {
        init: function () {
            $("#APIHistoryList_SearchBtn").click(function () {
                var APIHistoryList_name = $("#APIHistoryList_name").val();
                var APIHistoryList_serverName = $("#APIHistoryList_serverName").val();
                var APIHistoryList_orgId = $("#APIHistoryList_orgId").val();
                var APIHistoryList_id = $("#APIHistoryList_id").val();
                var APIHistoryList_desc = $("#APIHistoryList_desc").val();
                var APIHistoryList_hisId = $("#APIHistoryList_hisId").val();
                var APIHistoryList_apiId = $("#APIHistoryList_apiId").val();
                APIHistoryListGrid.pagerParam = {
                    "apiId":APIHistoryList_apiId,
                    "hisId":APIHistoryList_hisId,
                    "apiName": APIHistoryList_name,
                    "apiDesc": APIHistoryList_desc,
                    "serviceId": APIHistoryList_serverName
                };
                APIHistoryListGrid.refreshDatas();
            });
        }
    };
    //返回按钮
    var APIHistoryList_backBtn = {
        init:function () {
            $("#APIHistoryList_backBtn").click(function () {
                var queryParam = $("#APIHistoryList_queryParam").val();
                if(queryParam && queryParam.length>0){
                    var param = JSON.parse(queryParam);
                    common.setRouterParams(param);
                }
                router.navigate("100602");
            });
        }
    };
    var APIHistoryList_plusPopupWin = {
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
            if (APIHistoryList_plusPopupWin.inst) {
                APIHistoryList_plusPopupWin.inst = new wandaComp.wandaWindow("APIFound_hideBtn", "APIHistoryList_plusPopup", APIHistoryList_plusPopupWin.optionObj);
            }
            return APIHistoryList_plusPopupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = APIHistoryListGrid.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
            var aaa = $("#APIFound_hideBtn").attr("_param");
        },
        submitBtnCallBack: function (closeFun) {

        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIHistoryList_plusPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            APIHistoryList_plusPopupWin.getInst().init(function () {
                var isOk = APIHistoryList_plusPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = detail_popup.init;
                common.initExeByAttr("APIHistoryList_plusPopup", "opt='submit'", function () {
                    initFun("APIHistoryList_plusPopup");
                });
            });
            APIHistoryList_plusPopupWin.getInst().callBack("opt='submit'", APIHistoryList_plusPopupWin.submitBtnCallBack, true);
            APIHistoryList_plusPopupWin.getInst().callBack("opt='cancel'", APIHistoryList_plusPopupWin.cancelBtnCallBack);
        }
    };
    var initParam = function () {
        var _params = common.getRouterParams();
        if(_params && _params["serverId"]){
            $("#APIHistoryList_queryParam").val(_params["queryParam"]);
            $("#APIHistoryList_name").val(_params["apiName"]);
            $("#APIHistoryList_apiId").val(_params["apiId"]);
            APIHistoryList_serverName.setValue(_params["serverId"]+"");
            APIHistoryListGrid.init(_params["apiId"]+"");
        }else{
            APIHistoryList_serverName.value = "";
            APIHistoryList_serverName.setValue("");
            APIHistoryListGrid.init();
        }
    }
    var init = function () {
        wandaComp.elementControl($("#APIHistoryList"));
        new orgPopupWindow(["APIHistoryList"],"APIHistoryList_orgSearch").init();
        APIHistoryList_serverName.init();
        APIHistoryList_SearchBtn.init();
        APIHistoryList_backBtn.init();
        APIHistoryList_plusPopupWin.init();
        initParam();
    };
    return {
        init: init
    }
});

