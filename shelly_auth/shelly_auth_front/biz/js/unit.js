define(["jquery", "common", "wandaComp", "wandaCompR"], function($, common, wandaComp, wandaCompR) {
    var validate = {
        helper:null,
        init:function (parentIds) {
            validate.helper =  wandaComp.commonValidator("orgInfoMgr");
        }
    }
    var searchBtn = {
        init: function() {
            $("#orgInfoMgr_searchBtn").on("click", function() {
                /* var stateSelect = $("#orgInfoMgr_search").data("wandaDropDownList");
                 var state = stateSelect.value();
                 treeViewLeft.params["state"] = state;*/
                var orgName = $("#orgInfoMgr_search").val();
                treeViewLeft.params["orgName"] = orgName;
                treeViewLeft.reloadTree("");
            })
        }
    };

    var detailInfo = function(orgCode) {
        var successFun = function(data) {
            /*获取机构信息*/
            $("#parOrgCode").val(data.orgInfo.parOrgCode);
            $("#orgCode").val(data.orgInfo.orgCode);
            $("#orgName").val(data.orgInfo.orgName);
            $("#areaCode").val(data.orgInfo.areaCode);
            orgInfoMgr_orgState.setValue(data.orgInfo.state);
            $("#orgDesc").val(data.orgInfo.orgDesc);

            /*获取联系人信息*/
            if (data.alarmPersonInfo) {
                var alarmPersonInfoData = [];
                var stateText = "";
                for (var i = 0; i <= data.alarmPersonInfo.length - 1; i++) {
                    if (data.alarmPersonInfo[i].state === "1") {
                        stateText = "正常"
                    } else if (data.alarmPersonInfo[i].state === "2") {
                        stateText = "注销"
                    } else if (data.alarmPersonInfo[i].state === "") {
                        stateText = ""
                    }
                    alarmPersonInfoData.push({
                        "personCode": data.alarmPersonInfo[i].personCode,
                        "accountCode": data.alarmPersonInfo[i].accountCode,
                        "personName": data.alarmPersonInfo[i].personName,
                        "phoneNbr": data.alarmPersonInfo[i].phoneNbr,
                        "email": data.alarmPersonInfo[i].email,
                        "state": stateText
                    });
                }
                var dataSource = new wanda.data.DataSource({
                    data: alarmPersonInfoData
                });
            }
        };
        var param = { "orgCode": orgCode };
        common.ajaxGet("stateOrg/queryOrgDetail", param, successFun, null, false, $("#orgInfoMgr"));
    };
    var treeViewLeft = {
        wandaTreeView: "",
        queryDataCall: "",
        params: {
            "orgCode": "",
            "orgName": ""
        },
        querySuccessFun: function(data) {
            console.log(data.datas);
            treeViewLeft.queryDataCall(data.datas);
        },
        queryErrorFun: function() {
            common.jqConfirm.alert({
                title: 0,
                content: "加载失败！"
            });
        },
        onSelect: function(dataItem) {
            if(dataItem.state == "1"){
                $("#addBtn").show();
            }else{
                $("#addBtn").hide();
            }
            $(".addNoShow").show();
            $("#saveCloseBtn ,#closeBtn").hide();
            $("#editBtn").show();
            clearDatas();
            detailInfo(dataItem.orgCode);
        },
        queryData: function(id, fun) {
            treeViewLeft.queryDataCall = fun;
            treeViewLeft.params.orgCode = id;
            common.ajaxGet("stateOrg/manageOrgTree", treeViewLeft.params, treeViewLeft.querySuccessFun, treeViewLeft.queryErrorFun, null, $("#orgInfoMgr"));
        },
        option: null,
        init: function() {
            treeViewLeft.option = {
                childKey: "childOrgs",
                textKey: "orgName",
                noCache: false,
                treeDom: $("#orgInfoMgr_orgTree"),
                queryKey: "orgCode",
                queryData: treeViewLeft.queryData,
                onSelect: treeViewLeft.onSelect,
                template: "<span style='color: #= item.color #'>#= item.orgName # </span>"
            };
            treeViewLeft.wandaTreeView = new wandaComp.wandaTreeView(treeViewLeft.option);
            treeViewLeft.wandaTreeView.init();
        },
        reloadTree: function(orgCode) {
            var user = common.getCurrentUser();
            treeViewLeft.wandaTreeView.refresh(orgCode);
        }
    };


    // 右侧机构信息状态
    var orgInfoMgr_orgState = {
        data: [],
        getInst: function() {
            return $("#orgInfoMgr_orgState").data("wandaDropDownList");
        },
        setValue: function(value) {
            orgInfoMgr_orgState.getInst().value(value);
        },
        successFun: function(data) {
            orgInfoMgr_orgState.data = data;
            orgInfoMgr_orgState.getInst().setDataSource(data);
            orgInfoMgr_orgState.getInst().select(0);
        },
        init: function() {
            $("#orgInfoMgr_orgState").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value"
            });
            var param = { "key": "orgState" };
            common.ajaxGet("syscommpara/getBaseAttr", param, orgInfoMgr_orgState.successFun, null, false, $("#orgInfoMgr"));
        }
    };

    var addBtn = {
        init: function() {
            $("#addBtn").click(function() {
                if ($("#orgCode").val() === "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择单位！"
                    });
                    return false;
                }
                $("#isAdd").val("true");
                clearDatas();
                $(".addNoShow").hide();
                $("#saveCloseBtn ,#closeBtn").show();
                $("#addBtn,#editBtn").hide();
            });
        }
    };

    var editBtn = {
        init: function() {
            $("#editBtn").click(function() {
                if ($("#parOrgCode").val() === "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择单位！"
                    });
                    return false;
                }
                $("#isAdd").val("false");
                $(".addNoShow").show();
                $("#isAdd").val("false");
                var _param = getDatas();
                if (verification(_param)) {
                    common.ajaxPut("stateOrg/modOrg", _param, function() {
                        common.jqConfirm.alert({
                            title: 1,
                            content: "操作成功！",
                            call: function() {
                                treeViewLeft.reloadTree();
                                clearDatas();
                                $("#saveCloseBtn ,#closeBtn").hide();
                                $("#addBtn,#editBtn").show();
                            }
                        });
                    }, null, null, null);
                }
            });
        }
    };

    var saveCloseBtn = {
        init: function() {
            $("#saveCloseBtn").click(function() {
                var _param = getDatas();
                if (verification(_param)) {
                    var isAdd = $("#isAdd").val();
                    if (isAdd == "true") {
                        common.ajaxPost("stateOrg/addOrg", _param, function() {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function() {
                                    treeViewLeft.reloadTree();
                                    clearDatas();
                                    $("#saveCloseBtn ,#closeBtn").hide();
                                    $("#addBtn,#editBtn").show();
                                }
                            });
                        }, null, null, null);
                    } else {
                        common.ajaxPut("state/monitorOrg/modOrgAndAlarmPerson", _param, function() {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function() {
                                    treeViewLeft.reloadTree();
                                    clearDatas();
                                    $("#saveCloseBtn ,#closeBtn").hide();
                                    $("#addBtn,#editBtn").show();
                                }
                            });
                        }, null, null, null);
                    }
                }

            });

        }
    };

    var closeBtn = {
        init: function() {
            $("#closeBtn").click(function() {
                clearDatas();
                $(".addNoShow").show();
                detailInfo($("#orgCode").val());
                $("#saveCloseBtn ,#closeBtn").hide();
                $("#addBtn,#editBtn").show();
            });
        }
    };
    var filter = function(param) {
        var result = param;
        if (result === "正常") {
            result = "1";
        } else {
            result = "2";
        }
        return result;
    };

    //获取数据；
    var getDatas = function() {
        var params = {
            "orgInfo": {
                "orgName": $("#orgName").val(),
                "orgDesc": $("#orgDesc").val(),
                "areaCode": $("#areaCode").val()
            }
        };

        var isAdd = $("#isAdd").val();
        if (isAdd == "false") { //修改
            params.orgInfo.parOrgCode = $("#parOrgCode").val();
            params.orgInfo.orgCode = $("#orgCode").val();
            params.orgInfo.state = $("#orgInfoMgr_orgState").val();

        } else { //新增
            params.orgInfo.parOrgCode = $("#orgCode").val();
            params.orgInfo.state = "1";
        }
        return params;
    };


    //清除数据
    var clearDatas = function() {
        //清除机构信息
        $("#orgName,#areaCode,#orgDesc").val("");
        orgInfoMgr_orgState.setValue("1");
        //清除联系人
        var dataSource = new wanda.data.DataSource({
            data: []
        });
    };

    //校验数据
    var verification = function(param) {
        if (param == "false") {
            return false;
        }
        var orgInfo = param.orgInfo;
       /* if (orgInfo.orgName === "") {
            common.jqConfirm.alert({
                title: 0,
                content: "请输入单位名称！"
            });
            return false;
        }
        if (orgInfo.areaCode === "") {
            common.jqConfirm.alert({
                title: 0,
                content: "请输入区划代码！"
            });
            return false;
        }*/

        if(!validate.helper.validate()){
            return false;
        }
        var isAdd = $("#isAdd").val();
        if (isAdd === "false") { //新增
            if (orgInfo.state === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择单位状态！"
                });
                return false;
            }
        }
        return true;
    };

    var extendInit = function() {
        orgInfoMgr_orgState.init();
        searchBtn.init();
        treeViewLeft.init();
        addBtn.init();
        editBtn.init();
        saveCloseBtn.init();
        closeBtn.init();
        validate.init();
    };
    return {
        init: extendInit
    };
});