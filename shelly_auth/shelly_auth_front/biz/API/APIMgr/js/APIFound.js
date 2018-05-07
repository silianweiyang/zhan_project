define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup"], function ($, common, compont, wandaComp, wandaCompR, orgInfo_popup) {

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

                /*var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("wandaTreeView");
                orgtree.select($()); // clears selection*/
            });
        }
    };

    //应用名称
    var APIFound_serverName = {
        value:"",
        getInst:function () {
             return $("#APIFound_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            APIFound_serverName.value = value;
            APIFound_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#APIFound_serverName").data("wandaDropDownList").setDataSource(data);
            if (APIFound_serverName.value){
                var cs = APIFound_serverName.getInst();
                APIFound_serverName.getInst().value(APIFound_serverName.value);
            }
        },
        init: function () {
            $("#APIFound_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "全部",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#APIFound_serverName-list").css("height","auto");
                    $("#APIFound_serverName-list").css("overflow","hidden");
                }
            });
            var param = {};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, APIFound_serverName.successFun, null, null, $("#APIFound"));
        }
    };

    /*表格——列表*/
    orderFunc = function (e) {
        var data = $("#APIFoundGrid").data("wandaGrid").dataItem($(e).closest("tr"));
        var search_serviceId = $("#APIFound_serverName").val();
        var search_serviceDesc = $("#APIFound_desc").val();
        var search_orgCode = $("#APIFound_orgId").val();
        var search_orgName = $("#APIFound_orgName").val();
        var _param = {
            "menuCode": "100603",
            "serviceId": data.SERVICE_ID,
            "search_serviceId":search_serviceId,
            "search_serviceDesc":search_serviceDesc,
            "search_orgCode":search_orgCode,
            "search_orgName":search_orgName,
            "orderServiceId":""
         };
        common.setRouterParams(_param);
        router.navigate('10060301?opt=API列表');//订阅列表；
    };

    var APIFoundGrid = {
        rows: "10",
        pagerParam: {
            "serviceId": "",
            "serviceDesc": "",
            "orgCode": "",
            "orgName":""
        },
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            }, {
                field: "SERVICE_NAME",
                title: "发布应用名称",
                width: "230px"
            }, {
                field: "ORG_NAME",
                title: "发布应用归属",
                width: "230px"
            },{
                field: "SERVICE_DESC",
                title: "发布应用描述"
            },{
                field: "UPDATE_DATE",
                title: " 发布时间",
                width: "90px"
            },{
                field: "UPDATE_USER_NAME",
                title: "发布人",
                width: "80px"
            },{
                title: "快捷入口",
                width: "70px",
               /* template: "<a title='API列表' style='cursor:pointer;' onclick='orderFunc(this)'>API列表</a>",*/
                command: [{
                    className: "k-button-info",
                    name: "query",
                    text: "API列表",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var search_serviceId = $("#APIFound_serverName").val();
                        var search_serviceDesc = $("#APIFound_desc").val();
                        var search_orgCode = $("#APIFound_orgId").val();
                        var search_orgName = $("#APIFound_orgName").val();
                        var _param = {
                            "menuCode": "100603",
                            "serviceId": data.SERVICE_ID,
                            "search_serviceId":search_serviceId,
                            "search_serviceDesc":search_serviceDesc,
                            "search_orgCode":search_orgCode,
                            "search_orgName":search_orgName,
                            "orderServiceId":""
                        };
                        common.setRouterParams(_param);
                        router.navigate('10060301?opt=API列表');//订阅列表；
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
                    rows: APIFoundGrid.rows
                },
                paramObj: APIFoundGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                APIFoundGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateApiOrder/queryGateServiceForFind", param, successFun, null, null, $("#APIFound"));
        },
        getSubPageValue: function () {
            var selectEdit = APIFoundGrid.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            APIFoundGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (APIFoundGrid.inst) {
                APIFoundGrid.inst = new wandaComp.wandaGrid("APIFoundGrid", this.gridColums, true, this.pagerCallBack);
            }
            return APIFoundGrid.inst;
        },
        init: function () {
            APIFoundGrid.getInst().init();
        }
    };

    //查询button
    var APIFound_SearchBtn = {
        init: function () {
            $("#APIFound_SearchBtn").click(function () {
                var serviceId = $("#APIFound_serverName").val();
                var serviceDesc = $("#APIFound_desc").val();
                var orgCode = $("#APIFound_orgId").val();
                APIFoundGrid.pagerParam = {
                    "serviceId": serviceId,
                    "serviceDesc": serviceDesc,
                    "orgCode": orgCode,
                    "orgName":""
                };
                APIFoundGrid.refreshDatas();
            });
        }
    };

    //初始化
    var APIFoundParams =  {
        init:function() {
            var _params = common.getRouterParams();
            if (_params == null || _params == ""){
                _params = {
                    "serviceId": "",
                    "serviceDesc": "",
                    "orgCode": "",
                    "orgName":""
                };
            }
            APIFound_serverName.init();
            APIFound_serverName.setValue(_params["serviceId"]);
            new orgPopupWindow(["APIFound"], "APIFound_orgSearch").init();
            $("#APIFound_orgId").val(_params["orgCode"]);
            $("#APIFound_orgName").val(_params["orgName"]);
            APIFound_SearchBtn.init();
            APIFoundGrid.init();
            $("#APIFound_desc").val(_params["serviceDesc"]);
            APIFoundGrid.pagerParam.serviceId = _params["serviceId"];
            APIFoundGrid.pagerParam.serviceDesc = _params["serviceDesc"];
            APIFoundGrid.pagerParam.orgCode = _params["orgCode"];
            APIFoundGrid.pagerParam.orgName = _params["orgName"];
            APIFoundGrid.refreshDatas();
        }
    };

    var init = function () {
        wandaComp.elementControl($("#APIFound"));
        APIFoundParams.init();
        /* APIFound_state.init();*/
       /* APIFound_orderBtn.init();*/
    };
    return {
        init: init
    }
});

