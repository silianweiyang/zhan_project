define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup"], function ($, common, compont, wandaComp, wandaCompR, orgInfo_popup) {

    //应用名称下来框数据初始化
    var app_DropDownList = {
        successFun:function(data){
            var server = $("#appList_app").data("wandaDropDownList");
            server.setDataSource(data.datas);
        },
        init: function (ip) {
            $("#appList_app").wandaDropDownList({
                optionLabel: {
                    serverName: "全部",
                    serverCode: ""
                },
                dataTextField: "serverName",
                dataValueField: "serverCode",
                index: 0,
                change: function (e) {
                },
                open: function (e) {
                    $("#appList_app-list").css("height", "auto");
                    $("#appList_app-list").css("overflow", "hidden");
                }
            });
            var orgCode = $("#appList_orgId").val();
            ip = (ip == undefined) ? $("#serverList_nodeName").val() : ip;
            var param = {
                "paramObj": {
                    "ip": ip,
                    "serverName": "",
                    "orgCode": orgCode,
                    "state": "1"
                }
            };
            /*common.ajaxGet("state/monitorServer/queryMonitorServerList", param, app_DropDownList.successFun, null, null, $("#appList"));*/
        }
    }

    //归属机构树初始化
    var orgPopupWindow = function (parentIds, operId) {
        this.inst = "";
        this.optionObj = {
            minWidth: 400,
            minHeight: 350,
            title: "归属机构",
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
                        content: "请选择归属机构！"
                    });
                    return true;
                } else {
                    var orgSelected = JSON.parse(selectedStr);
                    var orgName = wandaCompR.getCurrentDom(parentIds, "appList_orgName");
                    orgName.val(orgSelected.orgName);
                    var serverList_orgId = wandaCompR.getCurrentDom(parentIds, "appList_orgId");
                    serverList_orgId.val(orgSelected.orgCode);
                }
            });
            this.inst.callBack("opt='cancel'", function () {

                var orgName = wandaCompR.getCurrentDom(parentIds, "appList_orgName");
                orgName.val("");
                var orgId = wandaCompR.getCurrentDom(parentIds, "appList_orgId");
                orgId.val("");

                var parStr = parentIds.join("_");

                getPopUpValue(parStr + "_" + operId).val("");

                /*var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("wandaTreeView");
                orgtree.select($()); // clears selection*/
            });
        }
    };

    //初始化查询按钮
    var appList_searchBtn = {
        init: function () {
            $("#appList_searchBtn").click(function () {
                var app = $("#appList_app").val();
                var appText =  $("#appList_app").data("wandaDropDownList").text();
                var appName = (app == "" && appText == "全部")?"":appText;
                var appDesc = $("#appList_appDesc").val().trim();
                var orgId = wandaCompR.getCurrentDom(["appList"], "appList_orgId").val();
                appListGrid.pagerParam = {
                    "serverId": app,
                    "serverName": appName,
                    "serviceDesc": appDesc,
                    "orgCode": orgId
                };
                appListGrid.refreshDatas();
            });
        }
    }

    //初始化新增按钮
    var appList_addBtn = {
        //页面跳转方法
        navigatePage: function () {
            var menucode = window.location.hash.substr(1, window.location.hash.length);
            var _param = {"isAdd": true, "menuCode": menucode};
            common.setRouterParams(_param);
            router.navigate('10060901');
        },
        //初始化单击事件，调用页面跳转方法
        init: function () {
            $("#appList_addBtn").on("click", appList_addBtn.navigatePage);
        }
    }

    //初始化编辑按钮
    var appList_editBtn = {
        //获取选中的记录值
        gridSelectValue: function () {
            var selectEdit = appListGrid.getInst().getSelect();
            return selectEdit;
        },
        //页面跳转方法
        navigatePage: function () {
            var selectEdit = appList_editBtn.gridSelectValue();
            if (selectEdit.length == 1) {
                var menucode = window.location.hash.substr(1, window.location.hash.length);
                var serverCode = selectEdit[0]["SERVICE_ID"];
                var orgCode = selectEdit[0]["ORG_CODE"];
                var orgName = selectEdit[0]["ORG_NAME"];
                var serverName = selectEdit[0]["SERVICE_NAME"];
                var serverDesc = selectEdit[0]["SERVICE_DESC"];
                var _param = {"isAdd": false, "menuCode": menucode, "serverCode": serverCode, "orgCode":orgCode, "orgName":orgName, "serverName":serverName, "serverDesc":serverDesc};
                common.setRouterParams(_param);
                router.navigate('10060901');
            } else if (selectEdit.length == 0) {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择一条应用信息!"
                });
            } else {
                common.jqConfirm.alert({
                    title: 0,
                    content: "只能选择一条应用信息!"
                });
            }
        },
        //初始化单击事件，调用页面跳转方法
        init: function () {
            $("#appList_editBtn").on("click", appList_editBtn.navigatePage);
        }
    }

    //初始化删除按钮
    var appList_delBtn = {
        //获取选中的记录值
        gridSelectValue: function () {
            var selectEdit = appListGrid.getInst().getSelect();
            return selectEdit;
        },
        //初始化单击事件的操作
        init: function () {
            $("#appList_delBtn").on("click", function () {
                var selectDelet = appList_delBtn.gridSelectValue();
                if (selectDelet.length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请至少选择一条数据！"
                    });
                    return false;
                } else {
                    //用于存放已勾选的应用id
                    var deletArray = [];
                    for (var i = 0; i < selectDelet.length; i++) {
                        deletArray.push(selectDelet[i]["SERVICE_ID"]);
                    }
                    var param = {"serviceId": deletArray};
                    var successFun = function (data) {
                        common.jqConfirm.alert({
                            title: 1,
                            content: "操作成功！",
                            call: function () {
                                appListGrid.refreshDatas();
                            }
                        });
                    };
                    common.jqConfirm.confirm({
                        content: "是否确认删除？",
                        call: function () {
                            common.ajaxDelete("api/gateService/delGateService", param, successFun, null, null, $("#appList"));
                        }
                    });
                }
            });
        }
    }

    //加载应用列表
    var appListGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
            }, {
                field: "SERVICE_NAME",
                title: "应用名称",
                width: '200px'
            },{
                field: "SERVICE_DESC",
                title: "应用描述",
                width: '200px'
            }, {
                field: "ORG_NAME",
                title: "归属机构"
            }, {
                field: "CREATE_DATE",
                title: "创建时间",
                width: '100px'
            }, {
                field: "CREATE_USER_NAME",
                title: "创建人",
                width: '80px'
            }, {
                field: "UPDATE_DATE",
                title: "修改时间",
                width: '100px'
            }, {
                field: "UPDATE_USER_NAME",
                title: "修改人",
                width: '100px'
            },{
                command: [{
                    className:"info",name: "query",imageClass:"",iconClass: "", text: "<i class=\"fa fa-search fa_icon\" title='查看'></i>", click: function (e) {
                        alert("查看");
                        return false;
                    }
                }], title: "API管理", width: "100px"
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
                    rows: appListGrid.rows
                },
                paramObj: appListGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                appListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxGet("api/gateService/queryGateServiceList", param, successFun, null, null, $("#appList"));
        },
        pagerCallBack: function (e) {
            appListGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (appListGrid.inst) {
               appListGrid.inst = new wandaComp.wandaGrid("appListGrid", this.gridColums, true, this.pagerCallBack);
            }
            return appListGrid.inst;
        },
        init: function () {
            appListGrid.getInst().init();
            appListGrid.pagerParam = {
                "orgCode": "",
                "serverCode": ""
            };
            appListGrid.refreshDatas();
        }
    };



    var init = function () {
        wandaComp.elementControl($("#appList"));
        app_DropDownList.init();
        new orgPopupWindow(["appList"],"appList_orgSearch").init();
        appList_searchBtn.init();
        appList_addBtn.init();
        appList_editBtn.init();
        appList_delBtn.init();
        appListGrid.init();
    };
    return {
        init: init
    }
});

