define(["jquery", "common", "wandaComp", "wandaCompR"], function ($, common, wandaComp, wandaCompR) {
//获取wsdl的services
    var descApi_wsdlservices = {
        getInst: function () {
            return $("#descApi_wsdl_popup_services").data("wandaDropDownList");
        },
        init:function () {
            $("#descApi_wsdl_popup_services").wandaDropDownList({
                index: 0,
                change:function (e) {
                    var value = this.value();
                    descApi_wsdlserviceBinds.setDataSource(descApi_wsdlwsdlSearch.servicesBings[value]);
                },
                select:function (e) {

                }
            });
        },
        setDataSource:function (dataSource) {
            descApi_wsdlservices.getInst().setDataSource(dataSource);
            descApi_wsdlservices.getInst().select(0);
        }
    }
    //获取wsdl的serviceBinds
    var descApi_wsdlserviceBinds = {
        getInst: function () {
            return $("#descApi_wsdl_popup_serviceBinds").data("wandaDropDownList");
        },
        init:function () {
            $("#descApi_wsdl_popup_serviceBinds").wandaDropDownList({
                index: 0,
                change:function (e) {
                    var value = this.value();
                    descApi_wsdlbindOperations.setDataSource(descApi_wsdlwsdlSearch.bindAndOperations[value]["bindOperations"]);
                }
            });
        },
        setDataSource:function (dataSource) {
            descApi_wsdlserviceBinds.getInst().setDataSource(dataSource);
            descApi_wsdlserviceBinds.getInst().select(0);
        }
    }
    //获取wsdl的bindOperations
    var descApi_wsdlbindOperations = {
        getInst: function () {
            return $("#descApi_wsdl_popup_bindOperations").data("wandaDropDownList");
        },
        init:function () {
            $("#descApi_wsdl_popup_bindOperations").wandaDropDownList({
                index: 0,
                change:function (e) {

                }
            });
        },
        setDataSource:function (dataSource) {
            descApi_wsdlbindOperations.getInst().setDataSource(dataSource);
            descApi_wsdlbindOperations.getInst().select(0);
        }
    }

    var saveBtn = {
        init: function () {
            $("#descApi_wsdl_popup_saveBtn").unbind("click");
            $("#descApi_wsdl_popup_saveBtn").click(function () {
                var descApi_wsdl_popup_services = $("#descApi_wsdl_popup_services").val();
                var descApi_wsdl_popup_serviceBinds = $("#descApi_wsdl_popup_serviceBinds").val();
                var descApi_wsdl_popup_bindOperations = $("#descApi_wsdl_popup_bindOperations").val();
                if(descApi_wsdl_popup_services==""||descApi_wsdl_popup_serviceBinds==""||descApi_wsdl_popup_bindOperations==""){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "获取不到WSDL相关信息，请查看WSDL地址是否填写正确！"
                    });
                    return false;
                }
                $("#descApi_wsdl_popup_saveBtn").trigger("afterClick");
            });
        }
    };
    var descApi_wsdlwsdlSearch = {
        services:[],
        servicesBings:{},
        bindAndOperations:{},
        init:function () {
            var successFun = function (data) {
                if(data){
                    descApi_wsdlwsdlSearch.services = data["services"];
                    descApi_wsdlwsdlSearch.servicesBings = data["serviceBinds"];
                    descApi_wsdlwsdlSearch.bindAndOperations = data["bindAndOperations"];
                    descApi_wsdlservices.setDataSource(descApi_wsdlwsdlSearch.services);
                    var services_index = descApi_wsdlwsdlSearch.services[0];
                    descApi_wsdlserviceBinds.setDataSource(descApi_wsdlwsdlSearch.servicesBings[services_index]);
                    var servicesBings_index = descApi_wsdlwsdlSearch.servicesBings[services_index][0];
                    descApi_wsdlbindOperations.setDataSource(descApi_wsdlwsdlSearch.bindAndOperations[servicesBings_index]["bindOperations"]);
                }
            };
            var wsdlPath = $("#descApiPopup_wsdlPath").val();
            var param = {"wsdlPath": wsdlPath};
            common.ajaxGet("api/gateApi/getWSDLMess", param,successFun, null, null, $("#descApi_wsdl_popup"));
        }
    }
    var cancelBtn = {
        init: function () {
            $("#descApi_wsdl_popup_cancelBtn").unbind("click");
            $("#descApi_wsdl_popup_cancelBtn").click(function () {
                $("#descApi_wsdl_popup_cancelBtn").trigger("afterClick");
            });
        }
    };

    var init = function () {
        descApi_wsdlwsdlSearch.init();
        descApi_wsdlservices.init();
        descApi_wsdlserviceBinds.init();
        descApi_wsdlbindOperations.init();
        saveBtn.init();
        cancelBtn.init();
    };
    return {
        init: init,
        api_wsdlSearch:descApi_wsdlwsdlSearch
    }
});