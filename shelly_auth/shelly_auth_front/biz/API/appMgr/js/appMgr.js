define(["jquery", "common", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup"], function ($, common, wandaComp, wandaCompR, orgInfo_popup) {
    //保存跳转时传入的参数：menuCode为菜单编码，返回用；isAdd为操作状态，标识是否为新增操作。
    var initParams = function () {
        var _params = common.getRouterParams();
        $("#menuCode").val(_params["menuCode"]);
        $("#isAdd").val(_params["isAdd"]);
        $("#appMgr_serverCode").val(_params["serverCode"]);
        $("#appMgr_orgId").val(_params["orgCode"]);
        $("#appMgr_orgName").val(_params["orgName"]);
        $("#appMgr_serverName").val(_params["serverName"]);
        $("#appMgr_serverDesc").val(_params["serverDesc"]);
    };

    //初始化机构树弹窗
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
                    var orgName = wandaCompR.getCurrentDom(parentIds, "appMgr_orgName");
                    orgName.val(orgSelected.orgName);
                    var serverMgr_orgId = wandaCompR.getCurrentDom(parentIds, "appMgr_orgId");
                    serverMgr_orgId.val(orgSelected.orgCode);
                }
            });
            this.inst.callBack("opt='cancel'", function () {

                var orgName = wandaCompR.getCurrentDom(parentIds, "appMgr_orgName");
                orgName.val("");
                var orgId = wandaCompR.getCurrentDom(parentIds, "appMgr_orgId");
                orgId.val("");

                var parStr = parentIds.join("_");

                getPopUpValue(parStr + "_" + operId).val("");

                /*var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("wandaTreeView");
                orgtree.select($()); // clears selection*/
            });
        }
    };

    //表单非空验证
    var verification = function () {
        var orgId = $("#appMgr_orgId").val();
        var serverName = $("#appMgr_serverName").val();
        if (orgId === "") {
            common.jqConfirm.alert({
                title: 0,
                content: "请选择归属机构！"
            });
            return false;
        } else if (serverName === "") {
            common.jqConfirm.alert({
                title: 0,
                content: "请输入应用名称！"
            });
            return false;
        }
        return true;
    };

    //获取表单数据
    var getFormValue = function (opt) {
        var serverId = $("#appMgr_serverCode").val();
        var orgId = $("#appMgr_orgId").val();
        var serverName = $("#appMgr_serverName").val();
        var serverDesc = $("#appMgr_serverDesc").val();
        if(opt == "true"){  //新增操作
            var params = {
                "orgCode": orgId,
                "serviceName": serverName,
                "serviceDesc": serverDesc
            };
            return params;
        }else{          //修改操作
            var params = {
                "serviceId": serverId,
                "serviceName": serverName,
                "serviceDesc": serverDesc
            };
            return params;
        }

    };

    //保存按钮单击事件初始化
    var saveBtn = {
        init: function () {
            $("#appMgr_save").click(function () {
                if (verification()) {
                    var _param = getFormValue($("#isAdd").val());
                    //判断是否为新增操作，传入对应url
                    if( $("#isAdd").val() == "false"){
                        common.ajaxPut("api/gateService/updateGateService",_param,function(){
                            saveBtn.navigate("操作成功！");
                        },null,null,null);
                    }else{
                        common.ajaxPost("api/gateService/addGateService", _param, function () {
                            saveBtn.navigate("操作成功！");
                        }, null, null, null);
                    }
                }
            });
        },
        navigate:function(msg){
            common.jqConfirm.alert({
                title: 1,
                content: msg,
                call: function () {
                    router.navigate($("#menuCode").val());
                }
            });
        }
    };

    //取消按钮单击事件初始化
    var cancelBtn = {
        init: function () {
            $("#appMgr_cancel").click(function () {
                router.navigate($("#menuCode").val());
            });
        }
    };

    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        wandaComp.elementControl($("#appMgr"));
        initParams();
        new orgPopupWindow(["appMgr"], "appMgr_orgSearch").init();
        saveBtn.init();
        cancelBtn.init();
    };
    return {
        init: init
    };
});

