define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/dataSourceMgr/entryDataSource/js/dataSource_popup"], function ($, common, compont, wandaComp, wandaCompR,dataSource_popup) {
    var sourceType = "1";
    //列表Grid
    var serverListGrid = {
        rows: "10",
        pagerParam: {
            type:sourceType
        },
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
            }, {
                field: "dataSourceName",
                title: "数据源名称"
            },{
                title: "数据源类型",
                template:function(data){
                    var dataSourceType = data.dataSourceType;
                    for(var i =0 ;i<dataSourceTypeDic.length;i++){
                        if(dataSourceType==dataSourceTypeDic[i].CODE){
                            return dataSourceTypeDic[i].NAME;
                        }
                    }
                }
            },{

                field: "ip",
                title: "数据库ip"
            },{
                title: "数据库类型",
                template:function(data){
                    var dataBaseType = data.dataBaseType;
                    for(var i =0 ;i<dataBaseTypeDic.length;i++){
                        if(dataBaseType==dataBaseTypeDic[i].CODE){
                            return dataBaseTypeDic[i].NAME;
                        }
                    }
                }
            },{
                title: "状态",
                template:function(data){
                    var dataSourceStatus = data.status;
                    for(var i =0 ;i<dataSourceStatusDic.length;i++){
                        if(dataSourceStatus==dataSourceStatusDic[i].CODE){
                            return dataSourceStatusDic[i].NAME;
                        }
                    }
                }
            }, {
                title:"操作",
                template:function(data){
                    var status = data["status"];
                    var id = data["dataSourceId"];
                    var html = "";
                    if(status==1||status==3){
                        var changeStatus = 2;
                        html+="<a class='btn btn-default' style='margin-left: 10px;' onclick='showDetail("+id+")'>查看</a>";
                        html+="<a class='btn btn-primary' style='margin-left: 10px;' onclick='updateStatus("+id+","+changeStatus+")'>启用</a>";
                    }else if(status==2){
                        var changeStatus = 3;
                        html+="<a  class='btn btn-default' style='margin-left: 10px; ' onclick='showDetail("+id+")'>查看</a>";
                        html+="<a class='btn btn-danger' style='margin-left: 10px;'  onclick='updateStatus("+id+","+changeStatus+")'>停用</a>";
                    }
                    return html;
                }
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
                    rows: serverListGrid.rows
                },
                paramObj: serverListGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                serverListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxPost("dsDataSource/sourceList", param, successFun, null, false, $("#serverList"));
        },
        pagerCallBack: function (e) {
            serverListGrid.refreshDatas(e.index);
        },
        inst: {},
        getGridSelectValue: function () {
            var selectEdit = serverListGrid.getInst().getSelect();
            return selectEdit;

        },
        getInst: function () {
            if (serverListGrid.inst) {
                serverListGrid.inst = new wandaComp.wandaGrid("serverListGrid", serverListGrid.gridColums, true, this.pagerCallBack);
            }
            return serverListGrid.inst;
        },
        init: function () {
            serverListGrid.getInst().init();
            serverListGrid.pagerParam = {
                type:sourceType
            };
            serverListGrid.refreshDatas();
        }
    };


    //增加按钮
    var serverList_addBtn = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 800,
            maxHeight: "",
            title: "新增数据源",
            content: "biz/dataSourceMgr/entryDataSource/html/dataSource_popup.html"
        },
        getInst: function () {
            if (serverList_addBtn.inst) {
                serverList_addBtn.inst = new wandaComp.wandaWindow("serverList_addBtn", "dataSource_add", serverList_addBtn.optionObj);
            }
            return serverList_addBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            serverListGrid.refreshDatas();
            var plusPopup = $("#dataSource_add").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#dataSource_add").data("wandaWindow");
            plusPopup.close();
        },
        testBtnCallBack:function(){

        },
        init: function () {
             serverList_addBtn.getInst().init(function () {
                 var modeParam={
                     divModel:"add",
                     type:sourceType
                 };
                 common.initExeByAttr("dataSource_add", "opt='cancel'", function () {
                     dataSource_popup.init(dataSourceTypeDic,dataBaseTypeDic,dataBaseVersionDic,characterSetDic,"dataSource_add",modeParam);
                 });

                 serverList_addBtn.getInst().callBack("opt='submit'", serverList_addBtn.submitBtnCallBack);
                 serverList_addBtn.getInst().callBack("opt='cancel'", serverList_addBtn.cancelBtnCallBack);
                 serverList_addBtn.getInst().callBack("opt='enable'", serverList_addBtn.submitBtnCallBack);
             });

        }
    };

    //修改按钮
    var dataSourceList_updateBtn = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 800,
            maxHeight: "",
            title: "修改数据源",
            content: "biz/dataSourceMgr/entryDataSource/html/dataSource_popup.html"
        },
        getInst: function () {
            if (dataSourceList_updateBtn.inst) {
                dataSourceList_updateBtn.inst = new wandaComp.wandaWindow("dataSourceList_updateBtn", "dataSource_add", dataSourceList_updateBtn.optionObj);
            }
            return dataSourceList_updateBtn.inst;
        },
        getGridSelectValue: function () {
            var selectEdit = serverListGrid.getInst().getSelect();
            return selectEdit;

        },
        setSubPageValue: function () {
            var selectEdit = serverListGrid.getGridSelectValue();
            if (selectEdit.length != 1) {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择一条数据！"
                });
                return false;
            };
            if(selectEdit[0]["status"]==2){
                common.jqConfirm.alert({
                    title: 0,
                    content: "启用状态下的数据源无法进行修改操作！"
                });
                return false;
            };
        },
        submitBtnCallBack: function () {
            serverListGrid.refreshDatas();
            var plusPopup = $("#dataSource_add").data("wandaWindow");
            plusPopup.close();

        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#dataSource_add").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            dataSourceList_updateBtn.getInst().init(function () {
                var isOk = dataSourceList_updateBtn.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var modeParam={
                    divModel:"update",
                    dataSourceId:serverListGrid.getGridSelectValue()[0]["dataSourceId"],
                    type:sourceType
                }
                common.initExeByAttr("dataSource_add", "opt='cancel'", function () {
                    dataSource_popup.init(dataSourceTypeDic,dataBaseTypeDic,dataBaseVersionDic,characterSetDic,"dataSource_add",modeParam);
                });
                dataSourceList_updateBtn.getInst().callBack("opt='submit'", dataSourceList_updateBtn.submitBtnCallBack);
                dataSourceList_updateBtn.getInst().callBack("opt='enable'", dataSourceList_updateBtn.submitBtnCallBack);
                dataSourceList_updateBtn.getInst().callBack("opt='cancel'", dataSourceList_updateBtn.cancelBtnCallBack);
            });

        }
    };
    //初始化删除按钮
    var dataSourceList_delBtn = {
        //获取选中的记录值
        gridSelectValue: function () {
            var selectEdit = serverListGrid.getInst().getSelect();
            return selectEdit;
        },
        //初始化单击事件的操作
        init: function () {
            $("#dataSourceList_delBtn").on("click", function () {
                var selectDelete = serverListGrid.getGridSelectValue();
                if (selectDelete.length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请至少选择一条数据！"
                    });
                    return false;
                } else {
                    //用于存放已勾选的应用id
                    var deletArray = [];
                    for (var i = 0; i < selectDelete.length; i++) {
                        deletArray.push(selectDelete[i]["dataSourceId"]);
                        if(selectDelete[i]["status"]==2){
                            common.jqConfirm.alert({
                                title: 0,
                                content: "启用状态下的数据源无法进行删除操作！"
                            });
                            return false;
                        };
                    }
                    var param = {"dataSourceIds": deletArray};
                    var successFun = function (data) {
                        common.jqConfirm.alert({
                            title: 1,
                            content: "操作成功！",
                            call: function () {
                                serverListGrid.refreshDatas();
                            }
                        });
                    };
                    common.jqConfirm.confirm({
                        content: "是否确认删除？",
                        call: function () {
                            common.ajaxDelete("dsDataSource/deleteDataSource", param, successFun, null, null, $("#serverList"));
                        }
                    });
                }
            });
        }
    };
    //查询按钮
    var userList_searchBtn = {
        init:function(){
            $('#serverList_searchBtn').on('click',function(){
                serverListGrid.pagerParam = {
                    "type":sourceType,
                    "dataSourceName":$("#searchDataSourceName").val(),
                    "dataSourceType":$("#searchDataSourceType").val(),
                    "dataBaseType":$("#searchDataBaseType").val(),
                    "ip":$("#searchDataSourceIp").val(),
                    "port":$("#searchDataSourcePort").val()
                }
                serverListGrid.refreshDatas();
            });
        }
    }

    //查看按钮
    var dataSourceList_detailBtn = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 800,
            maxHeight: "",
            title: "查看数据数据源",
            content: "biz/dataSourceMgr/entryDataSource/html/dataSource_popup.html"
        },
        getInst: function () {
            if (dataSourceList_detailBtn.inst) {
                dataSourceList_detailBtn.inst = new wandaComp.wandaWindow("dataSourceList_detailBtn", "dataSource_add", dataSourceList_detailBtn.optionObj);
            }
            return dataSourceList_detailBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#dataSource_add").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#dataSource_add").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            dataSourceList_detailBtn.getInst().init(function () {
                var modeParam={
                    divModel:"show",
                    type:sourceType,
                    dataSourceId:doId
                }
                common.initExeByAttr("dataSource_add", "opt='cancel'", function () {
                    dataSource_popup.init(dataSourceTypeDic,dataBaseTypeDic,dataBaseVersionDic,characterSetDic,"dataSource_add",modeParam);
                });
                dataSourceList_detailBtn.getInst().callBack("opt='submit'", dataSourceList_detailBtn.cancelBtnCallBack);
                dataSourceList_detailBtn.getInst().callBack("opt='cancel'", dataSourceList_detailBtn.cancelBtnCallBack);
                dataSourceList_detailBtn.getInst().callBack("opt='enable'", dataSourceList_detailBtn.cancelBtnCallBack);
            });
        }
    };

    //启用/停用按钮
    var dataSourceList_updateStatus = {
        init:function(){
            $('#dataSourceList_updateStatus').on('click',function(){
                var successFun = function(data){
                    common.jqConfirm.alert({
                        title: 1,
                        content:data["msg"],
                        call: function () {
                            serverListGrid.refreshDatas();
                        }
                    });
                }
                var param = {
                    dataSourceId:doId,
                    status:doStatus
                }
                var content = "是否确认修改";
                if(doStatus=="2"){
                    content = "是否确认启用该数据源？";
                }else if(doStatus=="3"){
                    content = "是否确认停用该数据源？";
                }
                common.jqConfirm.confirm({
                    content: content,
                    call: function () {
                        common.ajaxPost("dsDataSource/updateStatus", param, successFun, null, null, null);
                    }

                });
            });
        }
    };
    //初始化数据源类型下拉框
    var searchDataSourceTypeSelect = {
        getInst: function () {
            return $("#searchDataSourceType").data("wandaDropDownList");
        },
        setValue: function (value) {
            searchDataSourceTypeSelect.getInst().value(value);
        },
        init:function(){
            $("#searchDataSourceType").wandaDropDownList({
                dataSource: [
                    { NAME: "请选择数据源类型",
                        CODE:""
                    }
                ],
                dataTextField: "NAME",
                dataValueField: "CODE"
            });
            var dropdownlist = $("#searchDataSourceType").data("wandaDropDownList");
            for(var i=0;i<dataSourceTypeDic.length;i++){
                dropdownlist.dataSource.add({ NAME: dataSourceTypeDic[i].NAME,CODE:dataSourceTypeDic[i].CODE });
            }
        }
    };
    //初始化数据库类型下拉框
    var searchDataBaseTypeSelect = {
        getInst: function () {
            return $("#searchDataBaseType").data("wandaDropDownList");
        },
        setValue: function (value) {
            searchDataSourceTypeSelect.getInst().value(value);
        },
        init:function(){
            $("#searchDataBaseType").wandaDropDownList({
                dataSource: [
                    { NAME: "请选择数据库类型",
                        CODE:""
                    }
                ],
                dataTextField: "NAME",
                dataValueField: "CODE"
            });
            var dropdownlist = $("#searchDataBaseType").data("wandaDropDownList");
            for(var i=0;i<dataBaseTypeDic.length;i++){
                dropdownlist.dataSource.add({ NAME: dataBaseTypeDic[i].NAME,CODE:dataBaseTypeDic[i].CODE });
            }
        }
    };
    //初始化数据库类型字典
    function initDataBaseTypeDic(){
        var successFun = function(data){
            console.log(111);
            dataBaseTypeDic = data.datas;
        };
        var paramObj = {
            'type':'DATABASE_TYPE'
        }
        var param = {
            'paramObj' :paramObj
        };
        common.ajaxGet("dictionary/dicList",param,successFun,null,false,null);
    };

    //初始化资源状态字典项
    function initCharacterSet(){
        var successFun = function(data){
            characterSetDic = data.datas;
        }
        var param = {
            "paramObj": {
                "type": "CHARACTER_SET"
            }
        };
        common.ajaxGet("dictionary/dicList", param, successFun, null, false, null);
    };
    //初始化数据源类型字典
    function initDataSourceTypeDic(){
        var successFun = function(data){
            dataSourceTypeDic = data.datas;
        };
        var paramObj = {
            'type':"DATASOURCE_TYPE"
        }
        var param = {
            'paramObj' :paramObj
        };
        common.ajaxGet("dictionary/dicList",param ,successFun,null,false,null);
    };

    //初始化数据源状态字典
    function initDataSourceStatus(){
        var successFun = function(data){
            dataSourceStatusDic = data.datas;
        };
        var paramObj = {
            'type':"DATASOURCE_STATUS"
        }

        var param = {
            'paramObj' :paramObj
        };
        common.ajaxGet("dictionary/dicList",param,successFun,null,false,null);
    };

    //初始化数据库版本字典
    function initDataBaseVersion(){
        var successFun = function(data){
            dataBaseVersionDic = data.datas;
        };
        var paramObj = {
            'type':"DATABASE_VERSION"
        }

        var param = {
            'paramObj' :paramObj
        };
        common.ajaxGet("dictionary/dicList",param,successFun,null,false,null);
    };
    var init = function () {
        wandaComp.elementControl($("#serverList"));
        initDataBaseTypeDic();
        initDataSourceTypeDic();
        initDataSourceStatus();
        initDataBaseVersion();
        initCharacterSet();
        searchDataSourceTypeSelect.init();
        searchDataBaseTypeSelect.init();
        userList_searchBtn.init();
        serverListGrid.init();
        serverList_addBtn.init();
        dataSourceList_updateBtn.init();
        dataSourceList_delBtn.init();
        dataSourceList_detailBtn.init();
        dataSourceList_updateStatus.init();

    };
    return {
        init: init
    }
    
});

var dataBaseTypeDic={};//数据库类型字典
var dataSourceStatusDic={};//数据源状态字典
var dataSourceTypeDic={};//数据源类型字典
var dataBaseVersionDic={}//数据库版本字典表
var characterSetDic={}
var doId="" ;
var doStatus="";
//查看详情
function showDetail(id) {
    doId = id;
    $("#dataSourceList_detailBtn").trigger("click");
}
//启用停用按钮
function updateStatus(id,status){
    doId = id;
    doStatus = status;
    $("#dataSourceList_updateStatus").trigger("click");
}
