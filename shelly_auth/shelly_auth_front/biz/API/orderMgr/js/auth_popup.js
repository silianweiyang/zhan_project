define(["jquery", "common", "wandaComp", "wandaCompR", "date_time_Picker", "biz/js/orgInfo_popup"], function ($, common, wandaComp, wandaCompR, myDatePicker, orgInfo_popup) {
    //开始时间  结束时间初始化
    var datetimepicker = {
        init: function () {
            var startDate = $("#APIAuth_popup_startDate").data("wandaDatePicker");
            var endDate = $("#APIAuth_popup_endDate").data("wandaDatePicker");
            if (startDate == undefined) {
                new myDatePicker.wandaDatePicker("APIAuth_popup_startDate", "").init();
                new myDatePicker.wandaDatePicker("APIAuth_popup_endDate", "").init();
                new myDatePicker.validate("wandaDatePicker", "APIAuth_popup_startDate", "APIAuth_popup_endDate").init();
            }
        }
    };
    //权限认证
    var APIAuth_popup_authFilter = {
        successFun: function (data) {
            $("#APIAuthList_authPopup").find("#APIAuth_popup_authFilter").data("wandaDropDownList").setDataSource(data);
        },
        init: function () {
            $("#APIAuthList_authPopup").find("#APIAuth_popup_authFilter").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                dataSource: [{
                    "text": "是",
                    "value": "1"
                }, {
                    "text": "否",
                    "value": "2"
                }]
            });
        }
    };
    //安全认证
    var APIAuth_popup_safetyFilter = {
        successFun: function (data) {
            $("#APIAuthList_authPopup").find("#APIAuth_popup_safetyFilter").data("wandaDropDownList").setDataSource(data);
        },
        init: function () {
            $("#APIAuthList_authPopup").find("#APIAuth_popup_safetyFilter").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                dataSource: [{
                    "text": "是",
                    "value": "1"
                }, {
                    "text": "否",
                    "value": "2"
                }]
            });
        }
    };
    //授权
    /* var APIAuth_popup_opt = {
     successFun: function (data) {
     $("#APIAuthList_authPopup").find("#APIAuth_popup_opt").data("wandaDropDownList").setDataSource(data);
     },
     init: function () {
     $("#APIAuthList_authPopup").find("#APIAuth_popup_opt").wandaDropDownList({
     dataTextField: "text",
     dataValueField: "value",
     index: 0,
     dataSource:[{
     "text":"通过",
     "value":"1"
     },{
     "text":"拒绝",
     "value":"2"
     }],
     change:function (e) {
     var value = this.value();
     if("2" == value){
     $("#APIAuthList_authPopup").find(".generalSrh").hide();
     }else{
     $("#APIAuthList_authPopup").find(".generalSrh").show();
     }
     }
     });
     }
     };*/

    var saveBtn = {
        init: function () {
            $("#APIAuthList_authPopup").find("#APIAuth_popup_saveBtn").unbind("click");
            $("#APIAuthList_authPopup").find("#APIAuth_popup_saveBtn").click(function () {
                /*var APIAuth_popup_startDate = $("#APIAuthList_authPopup").find("#APIAuth_popup_startDate").val();
                var APIAuth_popup_endDate = $("#APIAuthList_authPopup").find("#APIAuth_popup_endDate").val();
                /!*if($("#APIAuthList_authPopup").find("#APIAuth_popup_opt").val()=="1"){*!/
                if (APIAuth_popup_startDate == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择开始日期！"
                    });
                    return false;
                }
                if (APIAuth_popup_endDate == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择结束日期！"
                    });
                    return false;
                }*/
                /* }*/
                $("#APIAuthList_authPopup").find("#APIAuth_popup_saveBtn").trigger("afterClick");
            });
        }
    };

    var cancelBtn = {
        init: function () {
            $("#APIAuthList_authPopup").find("#APIAuth_popup_cancelBtn").unbind("click");
            $("#APIAuthList_authPopup").find("#APIAuth_popup_cancelBtn").click(function () {
                $("#APIAuthList_authPopup").find("#APIAuth_popup_cancelBtn").trigger("afterClick");
            });
        }
    };

    var init = function () {
        //datetimepicker.init();
        APIAuth_popup_authFilter.init();
        APIAuth_popup_safetyFilter.init();
        /*APIAuth_popup_opt.init();*/
        saveBtn.init();
        cancelBtn.init();
    };
    return {
        init: init
    }
});