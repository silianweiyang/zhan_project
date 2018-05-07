define(["jquery", "common", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup"], function ($, common, wandaComp, wandaCompR, orgInfo_popup) {
//获取wsdl的services
    var api_services = {
        getInst: function () {
            return $("#APIMgr_popup_services").data("wandaDropDownList");
        },
        init:function () {
            $("#APIMgr_popup_services").wandaDropDownList({
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_serviceBinds.setDataSource(api_wsdlSearch.servicesBings[value]);
                },
                select:function (e) {

                }
            });
        },
        setDataSource:function (dataSource) {
            api_services.getInst().setDataSource(dataSource);
            api_services.getInst().select(0);
        }
    }
    //获取wsdl的serviceBinds
    var api_serviceBinds = {
        getInst: function () {
            return $("#APIMgr_popup_serviceBinds").data("wandaDropDownList");
        },
        init:function () {
            $("#APIMgr_popup_serviceBinds").wandaDropDownList({
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_bindOperations.setDataSource(api_wsdlSearch.bindAndOperations[value]["bindOperations"]);
                }
            });
        },
        setDataSource:function (dataSource) {
            api_serviceBinds.getInst().setDataSource(dataSource);
            api_serviceBinds.getInst().select(0);
        }
    }
    //获取wsdl的bindOperations
    var api_bindOperations = {
        getInst: function () {
            return $("#APIMgr_popup_bindOperations").data("wandaDropDownList");
        },
        init:function () {
            $("#APIMgr_popup_bindOperations").wandaDropDownList({
                index: 0,
                change:function (e) {

                }
            });
        },
        setDataSource:function (dataSource) {
            api_bindOperations.getInst().setDataSource(dataSource);
            api_bindOperations.getInst().select(0);
        }
    }

    var saveBtn = {
        init: function () {
            $("#APIMgr_popup_saveBtn").unbind("click");
            $("#APIMgr_popup_saveBtn").click(function () {
                var APIMgr_popup_services = $("#APIMgr_popup_services").val();
                var APIMgr_popup_serviceBinds = $("#APIMgr_popup_serviceBinds").val();
                var APIMgr_popup_bindOperations = $("#APIMgr_popup_bindOperations").val();
                if(APIMgr_popup_services==""||APIMgr_popup_serviceBinds==""||APIMgr_popup_bindOperations==""){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "获取不到WSDL相关信息，请查看WSDL地址是否填写正确！"
                    });
                    return false;
                }
                $("#APIMgr_popup_saveBtn").trigger("afterClick");
            });
        }
    };
    var api_wsdlSearch = {
        services:[],
        servicesBings:{},
        bindAndOperations:{},
        init:function () {
            var successFun = function (data) {
                if(data){
                    api_wsdlSearch.services = data["services"];
                    api_wsdlSearch.servicesBings = data["serviceBinds"];
                    api_wsdlSearch.bindAndOperations = data["bindAndOperations"];
                    api_services.setDataSource(api_wsdlSearch.services);
                    var services_index = api_wsdlSearch.services[0];
                    api_serviceBinds.setDataSource(api_wsdlSearch.servicesBings[services_index]);
                    var servicesBings_index = api_wsdlSearch.servicesBings[services_index][0];
                    api_bindOperations.setDataSource(api_wsdlSearch.bindAndOperations[servicesBings_index]["bindOperations"]);
                }
            };
            var wsdlPath = $("#APIMgr_wsdlPath").val();
            var param = {"wsdlPath": wsdlPath};
            common.ajaxGet("api/gateApi/getWSDLMess", param,successFun, null, null, $("#APIMgr"));
        }
    }
    var cancelBtn = {
        init: function () {
            $("#APIMgr_popup_cancelBtn").unbind("click");
            $("#APIMgr_popup_cancelBtn").click(function () {
                $("#APIMgr_popup_cancelBtn").trigger("afterClick");
            });
        }
    };

    var init = function () {
        api_wsdlSearch.init();
        api_services.init();
        api_serviceBinds.init();
        api_bindOperations.init();
        saveBtn.init();
        cancelBtn.init();
    };
    return {
        init: init,
        api_wsdlSearch:api_wsdlSearch
    }
});