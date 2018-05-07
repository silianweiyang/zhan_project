define(["jquery", "common", "wandaComp", "wandaCompR"], function ($, common, wandaComp, wandaCompR) {
    var initParams = function (param) {
        $("#divModel").val(param["divModel"]);
        $("#dataSource_type").val(param["type"]);
        $("#dataSource_dataSourceName").removeAttr("readonly");
        // $("#dataSource_dataSourceType").removeAttr("disabled");
        // $("#dataSource_dataBaseType").removeAttr("disabled");
        // $("#dataSource_dataBaseVersion").removeAttr("disabled");
        $("#dataSource_ip").removeAttr("readonly");
        $("#dataSource_port").removeAttr("readonly");
        $("#dataSource_instanceName").removeAttr("readonly");
        $("#dataSource_account").removeAttr("readonly");
        $("#dataSource_password").removeAttr("readonly");
        $("#dataSource_describe").removeAttr("readonly");
        // $("#dataSource_characterSet").removeAttr("disabled");
        if(param["divModel"]=="add"){//如果是新增时清空输入床内容
            $("#dataSource_add_wnd_title").text("新增数据源");
            $("#dataSource_dataSourceName").val("");
            $("#dataSource_dataSourceType").val("");
            $("#dataSource_dataBaseType").val("");
            $("#dataSource_dataBaseVersion").val("");
            $("#dataSource_ip").val("");
            $("#dataSource_port").val("");
            $("#dataSource_instanceName").val("");
            $("#dataSource_account").val("");
            $("#dataSource_password").val("");
            $("#dataSource_describe").val("");
            $("#dataSource_characterSet").val("");
        }
        if(param["divModel"] == "update"){//如果是修改发送ajax请求获取id信息
            $("#dataSource_add_wnd_title").text("修改数据源");
            $("#dataSource_dataSourceId").val(param["dataSourceId"]);
            var initUpdatePage = function(data){
                var dsDataSource = data.datas;
                $("#dataSource_dataSourceId").val(dsDataSource["dataSourceId"]);
                $("#dataSource_dataSourceName").val(dsDataSource["dataSourceName"]);
                dataSourceTypeSelect.setValue(dsDataSource["dataSourceType"]);
                dataBaseTypeSelect.setValue(dsDataSource["dataBaseType"]);
                dataBaseVersionSelect.setValue(dsDataSource["dataBaseVersion"]);
                $("#dataSource_ip").val(dsDataSource["ip"]);
                $("#dataSource_port").val(dsDataSource["port"]);
                $("#dataSource_instanceName").val(dsDataSource["instanceName"]);
                $("#dataSource_account").val(dsDataSource["account"]);
                $("#dataSource_password").val(dsDataSource["passWord"]);
                $("#dataSource_describe").val(dsDataSource["describe"]);
                $("#dataSource_status").val(dsDataSource["status"]);
                characterSetSelect.setValue(dsDataSource["characterSet"]);
            };
            var paramObj={
                dataSourceId:param["dataSourceId"],
                type:"1"
            };
            common.ajaxPost("dsDataSource/loadDataSourceById",paramObj,initUpdatePage,null,null,null);
        }

        if(param["divModel"] == "show"){//如果是详情展示页面发送ajax请求根据id获取信息
            $("#dataSource_add_wnd_title").text("查看数据源");
            var initUpdatePage = function(data){
                var dsDataSource = data.datas;
                $("#dataSource_dataSourceId").val(dsDataSource["dataSourceId"]);
                $("#dataSource_dataSourceName").val(dsDataSource["dataSourceName"]);
                dataSourceTypeSelect.setValue(dsDataSource["dataSourceType"]);
                dataBaseTypeSelect.setValue(dsDataSource["dataBaseType"]);
                dataBaseVersionSelect.setValue(dsDataSource["dataBaseVersion"]);
                $("#dataSource_ip").val(dsDataSource["ip"]);
                $("#dataSource_port").val(dsDataSource["port"]);
                $("#dataSource_instanceName").val(dsDataSource["instanceName"]);
                $("#dataSource_account").val(dsDataSource["account"]);
                $("#dataSource_password").val(dsDataSource["passWord"]);
                $("#dataSource_describe").val(dsDataSource["describe"]);
                characterSetSelect.setValue(dsDataSource["characterSet"]);
                $("#dataSource_dataSourceName").attr("readonly","readonly");
                $("#dataSource_dataSourceName").attr("readonly","readonly");
                // $("#dataSource_dataSourceType").attr("disabled","disabled");
                // $("#dataSource_dataBaseType").attr("disabled","disabled");
                // $("#dataSource_dataBaseVersion").attr("disabled","disabled");
                $("#dataSource_ip").attr("readonly","readonly");
                $("#dataSource_instanceName").attr("readonly","readonly");
                $("#dataSource_account").attr("readonly","readonly");
                $("#dataSource_password").attr("readonly","readonly");
                $("#dataSource_describe").attr("readonly","readonly");
                // $("#dataSource_characterSet").attr("disabled","disabled");
            };
            var paramObj={
                dataSourceId:param["dataSourceId"]
            };
            common.ajaxPost("dsDataSource/loadDataSourceById",paramObj,initUpdatePage,null,null,null);
        }
    };

    //表单验证
    var verification = function(){
        if($("#dataSource_dataSourceName").val() == ""){
            common.jqConfirm.alert({
                title: 0,
                content: "请输入资源名称！"
            });
            return false;
        };
        if($("#dataSource_dataSourceType").val() == ""){
            common.jqConfirm.alert({
                title: 0,
                content: "请选择数据源类型！"
            });
            return false;
        };
        if($("#dataSource_dataBaseType").val() == ""){
            common.jqConfirm.alert({
                title: 0,
                content: "请选择数据源类型！"
            });
            return false;
        };
        if($("#dataSource_dataBaseVersion").val() == ""){
            common.jqConfirm.alert({
                title: 0,
                content: "请选择数据源类型！"
            });
            return false;
        };
        if($("#dataSource_ip").val() == ""){
            common.jqConfirm.alert({
                title: 0,
                content: "请输入数据源ip地址！"
            });
            return false;
        }else{
            var regx = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            var value= $("#dataSource_ip").val();
            if(!validateByReg(regx,value)){
                common.jqConfirm.alert({
                    title: 0,
                    content: "ip地址格式不正确，请重新输入！"
                });
                return false;
            }
        };
        if($("#dataSource_port").val()==""){
            common.jqConfirm.alert({
                title: 0,
                content: "请输入数据库端口号！"
            });
            return false;
        }else{
            var regx = /^[0-9]{1,10}$/;
            var value = $("#dataSource_port").val();
            if(!validateByReg(regx,value)){
                common.jqConfirm.alert({
                    title: 0,
                    content: "端口号格式不正确，请重新输入！"
                });
                return false;
            }
        };
        if($("#dataSource_instanceName").val()==""){
            common.jqConfirm.alert({
                title: 0,
                content: "请输入数据库实例名！"
            });
            return false;
        }else{
            var regx = /^[a-zA-Z0-9`~!@#$%^&*()_+<>?:"{},.\/;'[\]]{1,10}$/;
            var value = $("#dataSource_instanceName").val();
            if(!validateByReg(regx,value)){
                common.jqConfirm.alert({
                    title: 0,
                    content: "数据库实例名格式不正确，请重新输入！"
                });
                return false;
            }
        };
        if($("#dataSource_account").val()==""){
            common.jqConfirm.alert({
                title: 0,
                content: "请输入数据库账户！"
            });
            return false;
        }else{
            var regx = /^[a-zA-Z0-9`~!@#$%^&*()_+<>?:"{},.\/;'[\]]{1,10}$/;
            var value = $("#dataSource_account").val();
            if(!validateByReg(regx,value)){
                common.jqConfirm.alert({
                    title: 0,
                    content: "数据库账户格式不正确，请重新输入！"
                });
                return false;
            }
        };
        if($("#dataSource_password").val()==""){
            common.jqConfirm.alert({
                title: 0,
                content: "请输入数据库账户对应的密码！"
            });
            return false;
        }else{
            var regx = /^[a-zA-Z0-9`~!@#$%^&*()_+<>?:"{},.\/;'[\]]{1,10}$/;
            var value = $("#dataSource_password").val();
            if(!validateByReg(regx,value)){
                common.jqConfirm.alert({
                    title: 0,
                    content: "数据库账户对应的密码格式不正确，请重新输入！"
                });
                return false;
            }
        };
        if($("#dataSource_characterSet").val()==""){
            common.jqConfirm.alert({
                title: 0,
                content: "请选择数据库字符集！"
            });
            return false;
        }
        return true;
    };
    //正则表达式验证
    function validateByReg(regx,value){
        return regx.test(value);
    };
    var saveBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#submit").unbind("click");
            $("#" + parentIds).find("#submit").click(function () {
                if (verification()) {
                    var _param = getFormValue($("#divModel").val());
                    var alertFun =  function(data){
                        common.jqConfirm.alert({
                            title: 1,
                            content: data['msg'],
                            call:function(){
                                $("#" + parentIds).find("#submit").trigger("afterClick");
                            }
                        });
                    };
                    _param.status=1+'';
                    //判断是否为新增操作，传入对应url
                    if( $("#divModel").val() == "update"){
                        common.ajaxPost("dsDataSource/updateDataSource",_param,alertFun,null,null,null);
                    }else if($("#divModel").val() == "add"){
                        common.ajaxPost("dsDataSource/addDataSource", _param,alertFun, null, null, null);
                    }
                }
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
        var dataSourceId = $("#dataSource_dataSourceId").val();
        var dataSourceName = $("#dataSource_dataSourceName").val();
        var dataSourceType = $("#dataSource_dataSourceType").val();
        var dataBaseType = $("#dataSource_dataBaseType").val();
        var dataBaseVersion = $("#dataSource_dataBaseVersion").val();
        var ip = $("#dataSource_ip").val();
        var port = $("#dataSource_port").val();
        var instanceName = $("#dataSource_instanceName").val();
        var account = $("#dataSource_account").val();
        var password = $("#dataSource_password").val();
        var describe = $("#dataSource_describe").val();
        var type = $("#dataSource_type").val();
        var createTime = $("#dataSource_createTime").val();
        var createCode = $("#dataSource_createCode").val();
        var status = $("#dataSource_status").val();
        var characterSet = $("#dataSource_characterSet").val();
        if(opt == "add"){  //新增操作
            var params = {
                "dataSourceName": dataSourceName,
                "dataSourceType": dataSourceType,
                "dataBaseType": dataBaseType,
                "dataBaseVersion": dataBaseVersion,
                "ip": ip,
                "port": port,
                "instanceName": instanceName,
                "account": account,
                "passWord": password,
                "describe": describe,
                "type":type,
                "characterSet":characterSet
            };
            return params;
        }else if(opt =="update"){          //修改操作
            var params = {
                "dataSourceId":dataSourceId,
                "dataSourceName": dataSourceName,
                "dataSourceType": dataSourceType,
                "dataBaseType": dataBaseType,
                "dataBaseVersion": dataBaseVersion,
                "ip": ip,
                "port": port,
                "instanceName": instanceName,
                "account": account,
                "passWord": password,
                "describe": describe,
                "type":type,
                "createCode":createCode,
                "status":status,
                "characterSet":characterSet
            };
            return params;
        }else if(opt =="show"){          //修改操作
            var params = {
                "dataSourceId":dataSourceId,
                "dataSourceName": dataSourceName,
                "dataSourceType": dataSourceType,
                "dataBaseType": dataBaseType,
                "dataBaseVersion": dataBaseVersion,
                "ip": ip,
                "port": port,
                "instanceName": instanceName,
                "account": account,
                "passWord": password,
                "describe": describe,
                "type":type,
                "status":status,
                "characterSet":characterSet
            };
            return params;
        }

    };
    //初始化数据源类型下拉框
    var dataSourceTypeSelect = {
        getInst: function () {
            return $("#dataSource_dataSourceType").data("wandaDropDownList");
        },
        setValue: function (value) {
            dataSourceTypeSelect.getInst().value(value);
        },
        init:function(dataSourceTypeDic){
            $("#dataSource_dataSourceType").wandaDropDownList({
                dataSource: [
                    { NAME: "请选择",
                        CODE:""
                    }
                ],
                dataTextField: "NAME",
                dataValueField: "CODE"
            });
            var dropdownlist = $("#dataSource_dataSourceType").data("wandaDropDownList");
            for(var i=0;i<dataSourceTypeDic.length;i++){
                dropdownlist.dataSource.add({ NAME: dataSourceTypeDic[i].NAME,CODE:dataSourceTypeDic[i].CODE });
            }
        }
    };

    //初始化数据库类型下拉框
    var dataBaseTypeSelect = {
        getInst: function () {
            return $("#dataSource_dataBaseType").data("wandaDropDownList");
        },
        setValue: function (value) {
            dataBaseTypeSelect.getInst().value(value);
        },
        init:function(dataBaseTypeDic){
            $("#dataSource_dataBaseType").wandaDropDownList({
                dataSource: [
                    { NAME: "请选择",
                        CODE:""
                    }
                ],
                dataTextField: "NAME",
                dataValueField: "CODE"
            });
            var dropdownlist = $("#dataSource_dataBaseType").data("wandaDropDownList");
            for(var i=0;i<dataBaseTypeDic.length;i++){
                dropdownlist.dataSource.add({ NAME: dataBaseTypeDic[i].NAME,CODE:dataBaseTypeDic[i].CODE });
            }

        }
    };

    //初始化数据版本下拉框
    var dataBaseVersionSelect = {
        getInst: function () {
            return $("#dataSource_dataBaseVersion").data("wandaDropDownList");
        },
        setValue: function (value) {
            dataBaseVersionSelect.getInst().value(value);
        },
        init:function(dataBaseVersionDic){
            $("#dataSource_dataBaseVersion").wandaDropDownList({
                dataSource: [
                    { NAME: "请选择",
                        CODE:""
                    }
                ],
                dataTextField: "NAME",
                dataValueField: "CODE"
            });
            var dropdownlist = $("#dataSource_dataBaseVersion").data("wandaDropDownList");
            for(var i=0;i<dataBaseVersionDic.length;i++){
                dropdownlist.dataSource.add({ NAME: dataBaseVersionDic[i].NAME,CODE:dataBaseVersionDic[i].CODE });
            }

        }
    };
    //初始化数据版本下拉框
    var characterSetSelect = {
        getInst: function () {
            return $("#dataSource_characterSet").data("wandaDropDownList");
        },
        setValue: function (value) {
            characterSetSelect.getInst().value(value);
        },
        init:function(characterSetDic){
            $("#dataSource_characterSet").wandaDropDownList({
                dataSource: [
                    { NAME: "请选择",
                        CODE:""
                    }
                ],
                dataTextField: "NAME",
                dataValueField: "CODE"
            });
            var dropdownlist = $("#dataSource_characterSet").data("wandaDropDownList");
            for(var i=0;i<characterSetDic.length;i++){
                dropdownlist.dataSource.add({ NAME: characterSetDic[i].NAME,CODE:characterSetDic[i].CODE });
            }

        }
    };
    //测试按钮初始化
    var testBtn = {
        init:function(parentId){
            $("#" + parentId).find("#test").unbind("click");
            $("#" + parentId).find("#test").click(function () {
                if (verification()) {
                    var _param = getFormValue($("#divModel").val());
                    var alertFun =  function(data){
                        common.jqConfirm.alert({
                            title: 1,
                            content: data['msg']
                        });
                    };
                    _param.status=2+'';
                    //测试数据源连接
                    common.ajaxPost("dsDataSource/testDsDataSource",_param,alertFun,null,false,null);
                }
            });
        }
    };

    //启用按钮初始化
    var enableBtn = {
        init:function(parentId){
            $("#" + parentId).find("#enable").unbind("click");
            $("#" + parentId).find("#enable").click(function () {
                if (verification()) {
                    var _param = getFormValue($("#divModel").val());
                    var alertFun =  function(data){
                        common.jqConfirm.alert({
                            title: 1,
                            content: data['msg'],
                            call:function(){
                                $("#" + parentId).find("#enable").trigger("afterClick");
                            }
                        });
                    };
                    _param.status=2+'';
                    //判断是否为新增操作，传入对应url
                    if( $("#divModel").val() == "update"){
                        common.ajaxPost("dsDataSource/updateDataSource",_param,alertFun,null,null,null);
                    }else if($("#divModel").val() == "add"){
                        common.ajaxPost("dsDataSource/addDataSource", _param,alertFun, null, null, null);
                    }
                }

            });
        }
    }
    var init = function (dataSourceTypeDic,dataBaseTypeDic,dataBaseVersionDic,characterSetDic,parentId,param) {
        saveBtn.init(parentId);
        cancelBtn.init(parentId);
        testBtn.init(parentId);
        enableBtn.init(parentId);
        dataSourceTypeSelect.init(dataSourceTypeDic);
        dataBaseTypeSelect.init(dataBaseTypeDic);
        dataBaseVersionSelect.init(dataBaseVersionDic);
        characterSetSelect.init(characterSetDic);
        initParams(param);
    };
    return {
        init: init
    }
});
