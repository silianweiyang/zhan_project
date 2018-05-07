define(["jquery", "common", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup"], function ($, common, wandaComp, wandaCompR, orgInfo_popup) {
    var validate = {
        helper:null,
        init:function (parentIds) {
            validate.helper =  wandaComp.commonValidator("serverMgr");
        }
    }
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
                    var orgName = wandaCompR.getCurrentDom(parentIds, "serverMgr_orgName");
                    orgName.val(orgSelected.orgName);
                    var serverMgr_orgId = wandaCompR.getCurrentDom(parentIds, "serverMgr_orgId");
                    serverMgr_orgId.val(orgSelected.orgCode);
                }
            });
            this.inst.callBack("opt='cancel'", function () {

                var orgName = wandaCompR.getCurrentDom(parentIds, "serverMgr_orgName");
                orgName.val("");
                var orgId = wandaCompR.getCurrentDom(parentIds, "serverMgr_orgId");
                orgId.val("");

                var parStr = parentIds.join("_");

                getPopUpValue(parStr + "_" + operId).val("");

                /*var orgTreeview = wandaCompR.getCurrentDom([parStr + "_" + operId], "orgTreeview");
                var orgtree = orgTreeview.data("wandaTreeView");
                orgtree.select($()); // clears selection*/
            });
        }
    };

    var verification = function () {
        if(validate.helper.validate()){
            var orgId = $("#serverMgr_orgId").val();
            //var serverName = $("#serverMgr_serverName").val();
            if (orgId === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择应用归属！"
                });
                return false;
            } /*else if (serverName === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入应用名称！"
                });
                return false;
            }*/
            return true;

        }else{
            return false;
        }
    };

    var getFormValue = function () {
        var orgId = $("#serverMgr_orgId").val();
        var serverName = $("#serverMgr_serverName").val();
        var serverDesc = $("#serverMgr_serverDesc").val();
        var serviceId = $("#serverMgr_serverCode").val();
        var userKey = $("#serverMgr_identifyCode").val();
        var userPassword = $("#serverMgr_userPassword").val();
        var params = {
            "orgCode": orgId,
            "serviceName": serverName,
            "serviceDesc": serverDesc,
            "userKey":userKey,
            "userPassword":userPassword
        };
        if($("#serverMgr_isAdd").val()=="false"){
            params["serviceId"] = serviceId;
        }
        return params;
    };

    var saveBtn = {
        init: function () {
            $("#serverMgr_save").unbind("click");
            $("#serverMgr_save").click(function (e) {
                e.stopPropagation();
                if (verification()) {
                    var _param = getFormValue();
                    if($("#serverMgr_isAdd").val()=="false"){
                        common.ajaxPut("api/gateService/updateGateService", _param, function () {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    router.navigate("100601");
                                }
                            });
                        }, null, null, $("#serverMgr"));
                    }else{
                        common.ajaxPost("api/gateService/addGateService", _param, function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "系统自动生成身份编码:"+data["userKey"]+",密钥:"+data["userPassword"]+" 请妥善保管！",
                                call: function () {
                                    router.navigate("100601");
                                }
                            });
                        }, null, null, $("#serverMgr"));
                    }
                }
            });
        }
    };
    var cancelBtn = {
        init: function () {
            $("#serverMgr_cancel").click(function () {
                var search_serverList_name = $("#search_serverList_name").val();
                var search_serverList_orgId = $("#search_serverList_orgId").val();
                var search_serverList_orgName = $("#search_serverList_orgName").val();
                var search_serverList_desc = $("#search_serverList_desc").val();
                var param = {
                    "serviceName":search_serverList_name,
                    "orgCode":search_serverList_orgId,
                    "orgName":search_serverList_orgName,
                    "serviceDesc":search_serverList_desc
                }
                common.setRouterParams(param);
                router.navigate("100601");
            });
        }
    };
    //修改获取API数据详情
    var serviceDetail = {
        init: function (serviceId) {
            var successFun = function (data) {
                if(data && data.length>0){
                    var obj = data[0];
                    $("#serverMgr_orgId").val(obj["ORG_CODE"]);
                    $("#serverMgr_orgName").val(obj["ORG_NAME"]);
                    $("#serverMgr_serverName").val(obj["SERVICE_NAME"]);
                    $("#serverMgr_serverDesc").val(obj["SERVICE_DESC"]);
                    $("#serverMgr_serverCode").val(obj["SERVICE_ID"]);
                    $("#serverMgr_identifyCode").val(obj["USER_KEY"]);
                    $("#serverMgr_userPassword").val(obj["USER_PASSWORD"]);
                    $("#serverMgr_files").val(obj["FILE_NAME"]);
                }
            };
            var param = {"serviceId": serviceId};
            common.ajaxGet("api/gateService/queryGateServiceDetail", param, successFun, null, null, $("#serverMgr"));

        }
    };

    var serverMgr_resetPassword = {
        init:function () {
            $("#serverMgr_resetPassword").click(function (e) {
                var successFun = function (data) {
                    $("#serverMgr_userPassword").val(data["userPassword"]);
                };
                var serviceId = $("#serverMgr_serverCode").val();
                var param = {"serviceId": serviceId};
                common.ajaxPut("api/gateService/updateUserPassword", param, successFun, null, null, $("#serverMgr"));
            })
        }
    };
    var  fileupload = {
        init:function (serviceId) {
            $('#serverMgr_fileupload').fileupload({
                url: "",
                autoUpload: false,
                singleFileUploads: true,
                done: function (e, data) {
                    if(data["_response"]["result"]["returnTag"] == 0){
                        router.navigate("100601");
                    }else{
                        common.jqConfirm.alert({
                            title: 0,
                            content: data["_response"]["result"]["returnMsg"]
                        });
                    }
                }
            }).on('fileuploadadd', function (e, data) {
                var uploadErrors = [];

                var acceptFileTypes = /\/(rar|zip)$/i;
                var name = data.originalFiles[0]["name"];
                var style = name.split(".");
                if(style.length>1 && (style[style.length-1] == "zip"||style[style.length-1] == "rar")){
                }else{
                    uploadErrors.push('文档格式不正确');
                }
                if (data.originalFiles[0]['size'] > 100*1024*1024) {
                    uploadErrors.push('文档大小不能超过100M');
                }
                if(uploadErrors.length > 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: uploadErrors
                    });
                } else {
                    $.each(data.files, function (index, file) {
                        $('#serverMgr_files').val(file.name);
                    });
                    $("#serverMgr_save").unbind("click");
                    $("#serverMgr_save").click(function (e) {
                        e.stopPropagation();
                        if(verification()){
                            var _param = getFormValue();
                            if($("#serverMgr_isAdd").val()=="false"){
                                common.ajaxPut("api/gateService/updateGateService", _param, function (obj) {
                                    common.jqConfirm.alert({
                                        title: 1,
                                        content: "操作成功！",
                                        call: function () {
                                            var url = $('#serverMgr_fileupload').fileupload("option","url",common.baseUrl + "api/gateService/upLoadAppRecommend?serviceId="+obj["serviceId"]+"&serviceName="+obj["serviceName"]);
                                            data.submit();
                                        }
                                    });
                                }, null, null, null);
                            }else{
                                common.ajaxPost("api/gateService/addGateService", _param, function (obj) {
                                    common.jqConfirm.alert({
                                        title: 1,
                                        content: "系统自动生成身份编码:"+obj["userKey"]+",密钥:"+obj["userPassword"]+" 请妥善保管！",
                                        call: function () {
                                            var url = $('#serverMgr_fileupload').fileupload("option","url",common.baseUrl + "api/gateService/upLoadAppRecommend?serviceId="+obj["serviceId"]+"&serviceName="+obj["serviceName"]);
                                            data.submit();
                                        }
                                    });
                                }, null, null, null);
                            }

                        }
                    });

                }
            })
        }
    }
    var initParams = function () {
        var _params = common.getRouterParams();
        $("#serverMgr_isAdd").val(_params["isAdd"]);
        $("#search_serverList_name").val(_params["search_serverList_name"]);
        $("#search_serverList_orgId").val(_params["search_serverList_orgId"]);
        $("#search_serverList_orgName").val(_params["search_serverList_orgName"]);
        $("#search_serverList_desc").val(_params["search_serverList_desc"]);
        if(_params["isAdd"]=="false"){
            serviceDetail.init(_params["serviceId"]);
            $("#serverMgr_resetPassword").show();
        }else{
            $("#serverMgr_resetPassword").hide();
        }
        $("#serverMgr_identifyCode").val(_params["userKey"]);
        $("#serverMgr_userPassword").val(_params["userPassword"]);
        $("#serverMgr_identifyCode").attr("readonly","readonly").css("background-color","#fff");
        $("#serverMgr_userPassword").attr("readonly","readonly").css("background-color","#fff");
    };
    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        wandaComp.elementControl($("#serverMgr"));
        new orgPopupWindow(["serverMgr"], "serverMgr_orgSearch").init();
        initParams();

        cancelBtn.init();
        saveBtn.init();
        serverMgr_resetPassword.init();
        fileupload.init();
        validate.init();
    };
    return {
        init: init
    };
});

