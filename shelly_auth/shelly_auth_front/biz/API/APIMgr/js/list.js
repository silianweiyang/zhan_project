define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup","biz/API/APIMgr/js/apiTest_popup"], function ($, common, compont, wandaComp, wandaCompR, orgInfo_popup,apiTest_popup) {
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
                    var orgName = wandaCompR.getCurrentDom(parentIds, "APIList_orgName");
                    orgName.val(orgSelected.orgName);
                    var userInfo_orgId = wandaCompR.getCurrentDom(parentIds, "APIList_orgId");
                    userInfo_orgId.val(orgSelected.orgCode);
                    APIList_serverName.init();
                }
            });
            this.inst.callBack("opt='cancel'", function () {

                var orgName = wandaCompR.getCurrentDom(parentIds, "APIList_orgName");
                orgName.val("");
                var orgId = wandaCompR.getCurrentDom(parentIds, "APIList_orgId");
                orgId.val("");

                var parStr = parentIds.join("_");

                this.getPopUpValue(parStr + "_" + operId).val("");

                /*var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("wandaTreeView");
                orgtree.select($()); // clears selection*/
                APIList_serverName.init();
            });
        }
    };
    //应用名称
    var APIList_serverName = {
        value: "",
        getInst: function () {
            return $("#APIList_serverName").data("wandaDropDownList");
        },
        setValue: function (value) {
            APIList_serverName.value = value;
            APIList_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#APIList_serverName").data("wandaDropDownList").setDataSource(data);
            if (APIList_serverName.value) {
                APIList_serverName.getInst().value(APIList_serverName.value);
            }
        },
        init: function () {
            $("#APIList_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "全部",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0
            });
            var param = {
                "orgCode": $("#APIList_orgId").val(),
                "isAuth": "yes"
            };
            common.ajaxGet("api/gateService/queryGateServiceAll", param, APIList_serverName.successFun, null, null, $("#APIList"));
        }
    };
    /*表格——任务示意*/
    showFunc = function (data) {
        var state = JSON.parse(data.STATE);
        var apiId = JSON.parse(data.API_ID);
        if(1 == state){
            return "<div class='checkbox'><input type='checkbox' class='checkbox-checked' checked style='margin:0px;' onclick='APIList_stateupdate("+apiId+","+state+")'/><label></label></div>";
        }else {
            return "<div class='checkbox'><input type='checkbox' style='margin:0px;' onclick='APIList_stateupdate(" + apiId + "," + state + ")'/><label></label></div>";
        }
    };
    apiTypeFunc = function (data) {
        var  apiType = data.IS_RAW_API,msg = "";
        if (apiType === "1") {
            msg = "普通";
        } else if (apiType === "2") {
            msg = "组合";
        }
        return msg;
    };
    //列表
    var APIListGrid = {
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
                field: "SERVICE_NAME",
                title: "应用名称"
            }, {
                field: "API_DESC",
                title: "API描述"
            }, {
                field: "CREATE_DATE",
                title: "发布时间",
                width: "85px"
            }, {
                field: "CREATE_USER_NAME",
                title: "发布人",
                width: "65px"
            }, {
                field: "IS_RAW_API",
                title: "类型",
                width: "50px",
                template: "#=apiTypeFunc(data)#"
            },
            {
                command: [ {
                    className: "k-button-info",
                    name: "query",
                    text: "API发布历史&nbsp;&nbsp;|&nbsp;&nbsp;",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var queryParam = {
                            "apiName": $("#APIList_name").val(),
                            "serverId": $("#APIList_serverName").val(),
                            "apiState": $("#APIList_state").val()
                        }
                        common.setRouterParams({
                            "apiId": data["API_ID"],
                            "apiName": data["API_NAME"],
                            "serverId": data["SERVICE_ID"],
                            "queryParam":JSON.stringify(queryParam)
                        });
                        router.navigate('100605?opt=API发布历史');
                        return false;
                    }
                }, {
                    className: "k-button-info",
                    name: "analysis",
                    text: "API统计分析",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var queryParam = {
                            "apiName": $("#APIList_name").val(),
                            "serverId": $("#APIList_serverName").val(),
                            "apiState": $("#APIList_state").val()
                        }
                        common.setRouterParams(
                            {"apiId": data["API_ID"],
                             "apiName": data["API_NAME"],
                             "serverId": data["SERVICE_ID"],
                                "queryParam":JSON.stringify(queryParam)
                            }
                        );
                        router.navigate('10060202?opt=API统计分析');
                        return false;
                    }
                }], title: "快捷入口", width: "180px"
            },{
                command: [ {
                    className: "info",
                    name: "edit",
                    imageClass: "",
                    iconClass: "",
                    text: "<i class=\"fa fa-edit fa_icon\" title='修改' style='color:#e2971f'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var apiId = data["API_ID"];
                        var isRowId = data["IS_RAW_API"];
                        var _param = {"isAdd": "false", "apiId": apiId};
                        common.setRouterParams(_param);
                        if(isRowId == "2"){
                            router.navigate('100705?opt=API修改');
                        }else{
                            router.navigate('10060201?opt=API修改');
                        }
                        return false;
                    }
                }, {
                    className: "info",
                    name: "remove",
                    imageClass: "",
                    iconClass: "",
                    text: "<i class=\"fa fa-trash-o fa_icon\" title='删除' style='color:#e70720'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var nodeDeleteInfos = {"apiIds": [data["API_ID"]]};
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    APIListGrid.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认删除？",
                            call: function () {
                                common.ajaxDelete("api/gateApi/delPublishApi", nodeDeleteInfos, successFun, null, null, $("#APIList"));
                            }
                        });
                        return false;
                    }
                },{
                    className: "info",
                    name: "more",
                    imageClass: "",
                    iconClass: "",
                    text: "<i class=\"fa fa-eye fa_icon\" title='API发布详情' style='color:#66a5ae'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var isRowId = data["IS_RAW_API"];
                        var queryParam = {
                            "apiName": $("#APIList_name").val(),
                            "serverId": $("#APIList_serverName").val(),
                            "apiState": $("#APIList_state").val()
                        }
                        var _param = {
                            "isAdd": "false",
                            "apiId": data["API_ID"],
                            "menuCode":"100602",
                            "queryParam":JSON.stringify(queryParam)
                        };
                        common.setRouterParams(_param);
                        if(isRowId == "2"){
                            router.navigate('10070502?opt=API发布详情');
                        }else{
                            router.navigate('10060203?opt=API发布详情');
                        }

                        return false;
                    }
                }], title: "操作", width: "130px"
            }, {
                command:[{
                        className: "k-button-info",
                        name: "test",
                        text: "API测试",
                        click: function (e) {
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            $("#APIList_testBtn").attr("API_ID",data["API_ID"]);
                            $("#APIList_testBtn").trigger("click");
                            return false;
                        }
                    }
                ], title: "测试", width: "60px"
            },{
                field: "STATE",
                title: "发布状态",
                template: "#=showFunc(data)#",
                width: "65px"
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: APIListGrid.rows
                },
                paramObj: APIListGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                APIListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateApi/queryGateApiList", param, successFun, null, null, $("#APIList"));
        },
        getSubPageValue: function () {
            var selectEdit = APIListGrid.getInst().getSelect();
            return selectEdit;
        },
        pagerCallBack: function (e) {
            APIListGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (APIListGrid.inst) {
                APIListGrid.inst = new wandaComp.wandaGrid("APIListGrid", this.gridColums, true, this.pagerCallBack);
            }
            return APIListGrid.inst;
        },
        init: function () {
            APIListGrid.getInst().init();
            APIListGrid.pagerParam = {
                "apiId": "",
                "apiName": $("#APIList_name").val(),
                "apiDesc": "",
                "orgCode": "",
                "serviceId": APIList_serverName.value,
                "state": APIList_state.value
            };
            APIListGrid.refreshDatas();
        }
    };
    //修改API状态
     APIList_stateupdate =  function (apiId, state) {
        var title = "确认要下线？";
        var changeState = "2";
        if (state == "2") {
            title = "确认要上线？";
            changeState = "1";
        }
        var successFun = function (data) {
            common.jqConfirm.alert({
                title: 1,
                content: "操作成功！",
                call: function () {
                    APIListGrid.refreshDatas();
                }
            });
        }
        common.jqConfirm.confirm({
            content: title,
            call: function () {
                var param = {
                    "apiId": apiId,
                    "state": changeState
                }
                common.ajaxPut("api/gateApi/updateGateApiState", param, successFun, null, null, $("#APIList"));
            }
        });
        }

    //查询button
    var APIList_SearchBtn = {
        init: function () {
            $("#APIList_SearchBtn").click(function () {
                var APIList_name = $("#APIList_name").val();
                var APIList_serverName = $("#APIList_serverName").val();
                var APIList_state = $("#APIList_state").val();
                var APIList_orgId = $("#APIList_orgId").val();
                var APIList_id = $("#APIList_id").val();
                var APIList_desc = $("#APIList_desc").val()
                APIListGrid.pagerParam = {
                    "apiId": APIList_id,
                    "apiName": APIList_name,
                    "apiDesc": APIList_desc,
                    "orgCode": APIList_orgId,
                    "serviceId": APIList_serverName,
                    "state": APIList_state
                };
                APIListGrid.refreshDatas();
            });
        }
    };
    //修改button
    var APIList_editBtn = {
        navigatePage: function () {
            var selectEdit = APIListGrid.getSubPageValue();
            if (selectEdit.length == 1) {
                var apiId = selectEdit[0]["API_ID"];
                var _param = {"isAdd": "false", "apiId": apiId};
                common.setRouterParams(_param);
                router.navigate('10060201?opt=API修改');
            } else if (selectEdit.length == 0) {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择一条服务信息!"
                });
            } else {
                common.jqConfirm.alert({
                    title: 0,
                    content: "只能选择一条服务信息!"
                });
            }
        },
        init: function () {
            $("#APIList_editBtn").on("click", APIList_editBtn.navigatePage)
        }
    };
    //增加button
    var APIList_plusBtn = {
        navigatePage: function () {
            var _param = {"isAdd": "true","serverId":APIList_serverName.value};
            common.setRouterParams(_param);
            router.navigate('10060201?opt=API发布');
        },
        init: function () {
            $("#APIList_plusBtn").on("click", APIList_plusBtn.navigatePage)
        }
    };
    //删除button
    var APIList_delBtn = {
        init: function () {
            $("#APIList_delBtn").on("click", function () {
                var selectEdit = APIListGrid.getInst().getSelect();
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
                            selectArray.push(selectEdit[i]["API_ID"]);
                        }
                        var nodeDeleteInfos = {"apiIds": selectArray};
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    APIListGrid.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认删除？",
                            call: function () {
                                common.ajaxDelete("api/gateApi/delPublishApi", nodeDeleteInfos, successFun, null, null, $("#APIList"));
                            }
                        });
                    }
                }
            });
        }
    };
    //测试按钮
    var APIList_testPopupWin = {
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
            if (APIList_testPopupWin.inst) {
                APIList_testPopupWin.inst = new wandaComp.wandaWindow("APIList_testBtn", "APIList_testPopup", APIList_testPopupWin.optionObj);
            }
            return APIList_testPopupWin.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = APIListGrid.getInst().getSelect();
            return selectEdit;
        },
        setSubPageValue: function () {
            $("#APITest_popup_outparamDemo").val("");
            $("#APITest_popup_inparamDemo").val("");
            var apiId = $("#APIList_testBtn").attr("API_ID");
            apiTest_popup.initDetail.init(apiId);
        },
        submitBtnCallBack: function (closeFun) {

        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIList_testPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            APIList_testPopupWin.getInst().init(function () {
                var isOk = APIList_testPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = apiTest_popup.init;
                common.initExeByAttr("APIList_testPopup", "opt='submit'", function () {
                    initFun("APIList_testPopup");
                });
            });
            APIList_testPopupWin.getInst().callBack("opt='submit'", APIList_testPopupWin.submitBtnCallBack, true);
            APIList_testPopupWin.getInst().callBack("opt='cancel'", APIList_testPopupWin.cancelBtnCallBack);
        }
    };
    //状态
    var APIList_state = {
        value:"",
        getInst:function () {
            return $("#APIList_state").data("wandaDropDownList");
        },
        setValue:function (value) {
            APIList_state.getInst().value(value);
            APIList_state.value = value;
        },
        successFun: function (data) {
            $("#APIList_state").data("wandaDropDownList").setDataSource(data);
            if(APIList_state.value){
                APIList_state.setValue(APIList_state.value);
            }
        },
        init: function () {
            $("#APIList_state").wandaDropDownList({
                optionLabel: {
                    text: "全部",
                    value: ""
                },
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, APIList_state.successFun, null, null, $("#APIList"));
        }
    };

    var initParam = function () {
        var _params = common.getRouterParams();
        if (_params) {
            if(_params["serverId"]){
                APIList_serverName.setValue(_params["serverId"] + "");
            }
            if(_params["apiName"]){
                $("#APIList_name").val(_params["apiName"]);
            }
            if(_params["apiState"]){
                APIList_state.setValue(_params["apiState"]);
            }

        } else {
            APIList_serverName.value = "";
            APIList_state.setValue("");
            APIList_serverName.setValue("");
        }
        APIListGrid.init();
    };
    var init = function () {
        wandaComp.elementControl($("#APIList"));
        new orgPopupWindow(["APIList"], "APIList_orgSearch").init();
        APIList_serverName.init();
        APIList_SearchBtn.init();
        APIList_state.init();
        APIList_editBtn.init();
        APIList_plusBtn.init();
        APIList_delBtn.init();
        APIList_testPopupWin.init();
        //compont.searchParam.init("APIList");
        initParam();
    };
    return {
        init: init
    }
});

