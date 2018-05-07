define(["jquery", "common", "wandaComp", "wandaCompR","date_time_Picker","biz/resourceMgr/resourceCfgMgr/js/resourceList_popup"], function ($, common, wandaComp, wandaCompR,myDatePicker,resourcePopup) {
    var poptaskStatusDic,poptaskRunStatusDic;
    var initParams = function (param) {
        $("#divModel").val(param["divModel"]);
        $("#data_taskName").removeAttr("readonly");
        $("#data_gatherType").removeAttr("readonly");
        $("#data_resName").removeAttr("readonly");
        $("#data_runType").removeAttr("readonly");
        $("#data_gatherFrequency").removeAttr("readonly");
        $("#data_beginTime").removeAttr("readonly");
        $("#data_endTime").removeAttr("readonly");
        $("#submit").show();
        if(param["divModel"]=="add"){//如果是新增时清空输入床内容
            $("#data_taskName").val("");
            $("#data_gatherType").val("");
            $("#data_resId").val("");
            $("#data_resName").val("");
            $("#data_runType").val("");
            $("#data_gatherFrequency").val("");
            $("#data_beginTime").val("");
            $("#data_endTime").val("");
            $("#data_taskStatus").val("");
            $("#data_taskRunStatus").val("");
        }
        if(param["divModel"] == "update"){//如果是修改发送ajax请求获取id信息
            $("#taskId").val(param["taskId"]);
            var initUpdatePage = function(data){
                var dsDataSource = data.datas;
                runTypeSelect.setValue(dsDataSource["runType"]);
                gatherTypeSelect.setValue(dsDataSource["gatherType"]);

                $("#data_taskName").val(dsDataSource["taskName"]);

                $("#data_resId").val(dsDataSource["resId"]);
                $("#data_resName").val(data["resName"]);
                $("#data_gatherFrequency").val(dsDataSource["gatherFrequency"]);
                $("#data_beginTime").val(dsDataSource["beginTime"]);
                $("#data_endTime").val(dsDataSource["endTime"]);
                $("#data_taskStatus").val(ConvertStatusName.getName(dsDataSource["taskStatus"],poptaskStatusDic) );
                $("#data_taskRunStatus").val(ConvertStatusName.getName(dsDataSource["taskRunStatus"],poptaskRunStatusDic));
            };
            var paramObj={
                taskId:param["taskId"],
            };
            common.ajaxPost("gatherTask/get",paramObj,initUpdatePage,null,null,null);
        }

        if(param["divModel"] == "show"){//如果是详情展示页面发送ajax请求根据id获取信息
            $("#submit").hide();
            var initUpdatePage = function(data){
                var dsDataSource = data.datas;
                $("#taskId").val(dsDataSource["taskId"]);
                $("#data_taskName").val(dsDataSource["taskName"]);
                runTypeSelect.setValue(dsDataSource["runType"]);
                gatherTypeSelect.setValue(dsDataSource["gatherType"]);

                $("#data_taskStatus").val(ConvertStatusName.getName(dsDataSource["taskStatus"],poptaskStatusDic) );
                $("#data_taskRunStatus").val(ConvertStatusName.getName(dsDataSource["taskRunStatus"],poptaskRunStatusDic));

                $("#data_resId").val(dsDataSource["resId"]);
                $("#data_resName").val(data["resName"]);
                $("#data_runType").val(dsDataSource["runType"]);
                $("#data_gatherFrequency").val(dsDataSource["gatherFrequency"]);
                $("#data_beginTime").val(dsDataSource["beginTime"]);
                $("#data_endTime").val(dsDataSource["endTime"]);

                $("#data_taskName").attr("readonly","readonly");
                $("#data_gatherType").attr("readonly","readonly");
                $("#data_resName").attr("readonly","readonly");
                $("#data_runType").attr("readonly","readonly");
                $("#data_gatherFrequency").attr("readonly","readonly");
                $("#data_beginTime").attr("readonly","readonly");
                $("#data_endTime").attr("readonly","readonly");

            };
            var paramObj={
                taskId:param["taskId"]
            };
            common.ajaxPost("gatherTask/get",paramObj,initUpdatePage,null,null,null);
        }
    };

    //表单验证
    var verification = function(){
        if($("#data_taskName").val()==''){
            common.jqConfirm.alert("任务名称不能为空!");
            return false;
        }
        return true;
    }

    var saveBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#submit").unbind("click");
            $("#" + parentIds).find("#submit").click(function () {
                if (verification) {
                    var _param = getFormValue($("#divModel").val());
                    var alertFun =  function(data){
                        common.jqConfirm.alert({
                            title: 1,
                            content: data['msg']
                        });
                    };
                    //判断是否为新增操作，传入对应url
                    if( $("#divModel").val() == "update"){
                        common.ajaxPost("gatherTask/update",_param,alertFun,null,null,null);
                    }else if($("#divModel").val() == "add"){
                        common.ajaxPost("gatherTask/add", _param,alertFun, null, null, null);
                    }
                }
                $("#" + parentIds).find("#submit").trigger("afterClick");
            });
        }

    };

    var cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#cancel").unbind("click");
            $("#" + parentIds).find("#cancel").click(function () {
                $("#" + parentIds).find("#cancel").trigger("afterClick");
            });
        }
    };

    //获取表单数据
    var getFormValue = function (opt) {
        var taskId = $("#taskId").val();
        var taskName = $("#data_taskName").val();
        var gatherType = $("#data_gatherType").val();
        var resId = $("#data_resId").val();
        var resName = $("#data_resName").val();
        var runType = $("#data_runType").val();
        var gatherFrequency = $("#data_gatherFrequency").val();
        var beginTime = $("#data_beginTime").val();
        var endTime = $("#data_endTime").val();

        if(opt == "add"){  //新增操作
            var params = {
                "taskId": taskId,
                "taskName": taskName,
                "gatherType": gatherType,
                "resId": resId,
                "runType": runType,
                "gatherFrequency": gatherFrequency,
                "beginTime": beginTime,
                "endTime": endTime
            };
            return params;
        }else if(opt =="update"){          //修改操作
            var params = {
                "taskId": taskId,
                "taskName": taskName,
                "gatherType": gatherType,
                "resId": resId,
                "runType": runType,
                "gatherFrequency": gatherFrequency,
                "beginTime": beginTime,
                "endTime": endTime
            };
            return params;
        }

    };
    var formatDateTime = function (date,t) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h=h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second=date.getSeconds();
        second=second < 10 ? ('0' + second) : second;
        if(t==1){
            y ="****";
        }else if(t==2){
            y ="****";
            m ="**";
        }else if(t==3){
            y = "****";
            m = "**";
            d = "**";
        }


        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    };
    //运行方式下拉框
    var runTypeSelect = {
        getInst: function () {
            return $("#data_runType").data("wandaDropDownList");
        },
        setValue: function (value) {
            runTypeSelect.getInst().value(value);
        },

    init:function(runTypeDic){
            $("#panelrunType").empty();
            $("#panelrunType").append('<input id="data_runType"/>');

            $("#data_runType").wandaDropDownList({
                dataSource: [
                    { NAME: "请选择",
                        CODE:""
                    }
                ],
                dataTextField: "NAME",
                dataValueField: "CODE"
            });
            var dropdownlist = $("#data_runType").data("wandaDropDownList");
            for(var i=0;i<runTypeDic.length;i++){
                dropdownlist.dataSource.add({ NAME: runTypeDic[i].NAME,CODE:runTypeDic[i].CODE });
            }
            $("#data_runType").on("change",function(){

                var t=  $(this).val() ;
                var st =st = formatDateTime(new Date(),t);
                $("#data_gatherFrequency").val(st);
            });
        }
    };

    //采集方式下拉框
    var gatherTypeSelect = {
        getInst: function () {
            return $("#data_gatherType").data("wandaDropDownList");
        },
        setValue: function (value) {
            gatherTypeSelect.getInst().value(value);
        },
        init:function(gatherTypeDic){
            $("#panelgatherType").empty();
            $("#panelgatherType").append('<input id="data_gatherType" />');
            $("#data_gatherType").wandaDropDownList({
                dataSource: [
                    {   NAME: "请选择",
                        CODE:""
                    }
                ],
                dataTextField: "NAME",
                dataValueField: "CODE"
            });
            var dropdownlist = $("#data_gatherType").data("wandaDropDownList");
            for(var i=0;i<gatherTypeDic.length;i++){
                dropdownlist.dataSource.add({ NAME: gatherTypeDic[i].NAME,CODE:gatherTypeDic[i].CODE });
            }

        }
    };
    var ConvertStatusName={
        getName:function(code,Dic){
            if(code==null) return "";
            for(var i=0;Dic.length;i++){
                if(code==Dic[i]["CODE"]){
                    return Dic[i]["NAME"];
                }
            }
        }
    };
    var datePicker = {
        init:function () {
            $("#panelBeginTime").empty();
            $("#panelBeginTime").append('<input id="data_beginTime" name="beginTime" style="width: 100%;"/>');

            $("#panelEndTime").empty();
            $("#panelEndTime").append('<input id="data_endTime" name="endTime" style="width: 100%;"/>');

            new myDatePicker.wandaDatePicker("data_endTime", "").init();
            new myDatePicker.wandaDatePicker("data_beginTime", "").init();
        }
    }

    //选资源初始化
    var orgPopupWindow = {
        inst : {},
        optionObj : {
            minWidth: 600,
            minHeight: 350,
            maxWidth: 600,
            maxHeight: "",
            title: "选择数据源资源",
            content: "biz/resourceMgr/resourceCfgMgr/html/resourceList_popup.html"
        },
        getInst : function(){
            if (orgPopupWindow.inst) {
                orgPopupWindow.inst = new wandaComp.wandaWindow( "appList_resSearch","resPanel", orgPopupWindow.optionObj);
            }
            return orgPopupWindow.inst;
        },
        cancelBtnCallBack:function(){
            var plusPopup = $("#resPanel").data("wandaWindow");
            plusPopup.close();
        },
        init : function () {
            orgPopupWindow.getInst().init(function () {
                var modeParam={

                };
                common.initExeByAttr("resPanel", "opt='cancel'", function () {
                    resourcePopup.init();
                });
                $("#resPopcancel").bind("click",orgPopupWindow.cancelBtnCallBack);
                //orgPopupWindow.getInst().callBack("opt='resPopcancel'", orgPopupWindow.cancelBtnCallBack);
            });

        }
    };

    var init = function (runTypeDic,gatherDic,taskStatusDic,taskRunStatusDic,parentId,param) {
        poptaskStatusDic = taskStatusDic ;
        poptaskRunStatusDic = taskRunStatusDic;
        saveBtn.init(parentId);
        cancelBtn.init(parentId);
        datePicker.init();
        runTypeSelect.init(runTypeDic);
        gatherTypeSelect.init(gatherDic);
        initParams(param);
        orgPopupWindow.init("resPanel");
    };
    return {
        init: init
    }
});

function getSelectValue(resid,resName){
    //alert(resName);
    $("#data_resId").val(resid);
    $("#data_resName").val(resName);
    $("#resPopcancel").trigger("click");
}
