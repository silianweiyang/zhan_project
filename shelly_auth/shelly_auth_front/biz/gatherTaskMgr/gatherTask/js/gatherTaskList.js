define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/gatherTaskMgr/gatherTask/js/gatherTask_popup"], function ($, common, compont, wandaComp, wandaCompR, gatherTask_popup) {

    var runTypeDic={};//运行状态字典
    var taskStatusDic={};//任务状态字典
    var gatherTypeDic =[{"NAME":"全量","CODE":"1"},{"NAME":"增量","CODE":"2"}];
    var taskRunStatusDic=[{"NAME":"未运行","CODE":"0"},{"NAME":"8","CODE":"锁定中"},{"NAME":"9","CODE":"分派中"},{"NAME":"运行中","CODE":"1"},{"NAME":"完成","CODE":"2"},{"NAME":"错误","CODE":"3"}];
    //列表Grid
    var serverListGrid = {
        rows: "10",
        pagerParam: {
        },
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
            },
            {
                field: "taskName",
                title: "任务名称"
            },
            {
                title: "采集方式",
                template:function(data){
                    var gatherType = data.gatherType;
                    for(var i =0 ;i<gatherTypeDic.length;i++){
                        if(gatherType==gatherTypeDic[i].CODE){
                            return gatherTypeDic[i].NAME;
                        }
                    }
                }
            },
            {
                title: "采集频率",
                template:function(data){
                    var runType = data.runType;
                    var runName = runType ;
                    for(var i =0 ;i<runTypeDic.length;i++){
                        if(runType==runTypeDic[i].CODE){
                            runName = runTypeDic[i].NAME;
                            break;
                        }
                    }
                    runName = runName +"("+ data.gatherFrequency+")";
                    runName = runName.replace("****-","");
                    runName = runName.replace("**-","");
                    runName = runName.replace("**","");
                    return runName;
                }
            },
            {
                title:"开始时间",
                field:"beginTime"
            },
            {
                title:"截止时间",
                field:"endTime"
            },
            {
                title:"任务状态",
                template:function(data){
                    var taskStatus = data.taskStatus;
                    for(var i =0 ;i<taskStatusDic.length;i++){
                        if(taskStatus==taskStatusDic[i].CODE){
                            return taskStatusDic[i].NAME;
                        }
                    }
                }
            },
            {
                title:"运行状态",
                template:function(data){
                    var taskStatus = data.taskRunStatus;
                    for(var i =0 ;i<taskRunStatusDic.length;i++){
                        if(taskStatus==taskRunStatusDic[i].CODE){
                            return taskRunStatusDic[i].NAME;
                        }
                    }
                }
            },
            {
                title:"操作",
                template:function(data){
                    var status = data["taskStatus"];
                    var id = data["taskId"];
                    var html = "";
                    html+="<a class='btn btn-default' style='margin-left: 10px; ' onclick='showDetail("+id+")'>查看</a>";
                    if(status==1||status==3){
                        var changeStatus = 2;
                        html+="<a class='btn btn-primary' style='margin-left: 10px;' onclick='updateStatus("+id+","+changeStatus+")'>启用</a>";
                    }else if(status==2){
                        var changeStatus = 3;

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
                //更新数字
                $("#taskCompleteNum").html(data.taskNum[0]["COMPLETENUM"]);
                $("#taskRuningNum").html(data.taskNum[0]["RUNNUM"]);
                $("#taskNum").html(data.taskNum[0]["ALLNUM"]);


            };
            common.ajaxPost("gatherTask/list", param, successFun, null, null, $("#gatherTaskList"));
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
                serverListGrid.inst = new wandaComp.wandaGrid("serverGatherListGrid", serverListGrid.gridColums, true, this.pagerCallBack);
            }
            return serverListGrid.inst;
        },
        init: function () {
            serverListGrid.getInst().init();
            serverListGrid.pagerParam = {
            };
            serverListGrid.refreshDatas();
        }
    };
    //查询按钮
    var userList_searchBtn = {
        init:function(){
            $('#serverList_searchBtn').on('click',function(){
                serverListGrid.pagerParam = {
                    "taskName":$("#searchTaskName").val(),
                    "taskRunStatus":$("#ptaskRunStatus").val()
                }
                serverListGrid.refreshDatas();
            });
        }
    }

    //增加按钮
    var serverList_addBtn = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 800,
            maxHeight: "",
            title: "新增采集任务",
            content: "biz/gatherTaskMgr/gatherTask/html/gatherTask_popup.html"
        },
        getInst: function () {
            if (serverList_addBtn.inst) {
                serverList_addBtn.inst = new wandaComp.wandaWindow("gatherTaskList_addBtn", "gatherTask_add", serverList_addBtn.optionObj);
            }
            return serverList_addBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#gatherTask_add").data("wandaWindow");
            plusPopup.close();
            serverListGrid.refreshDatas();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#gatherTask_add").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            serverList_addBtn.getInst().init(function () {
                var modeParam={
                    divModel:"add",
                };
                common.initExeByAttr("gatherTask_add", "opt='cancel'", function () {
                    gatherTask_popup.init(runTypeDic,gatherTypeDic,taskStatusDic,taskRunStatusDic,"gatherTask_add",modeParam);
                });
                $("#gatherTask_add_wnd_title").html(serverList_addBtn.optionObj.title);
                serverList_addBtn.getInst().callBack("opt='submit'", serverList_addBtn.submitBtnCallBack);
                serverList_addBtn.getInst().callBack("opt='cancel'", serverList_addBtn.cancelBtnCallBack);
            });

        }
    };

    //修改按钮
    var serverList_updateBtn = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 800,
            maxHeight: "",
            title: "修改采集任务",
            content: "biz/gatherTaskMgr/gatherTask/html/gatherTask_popup.html"
        },
        getInst: function () {
            if (serverList_updateBtn.inst) {
                serverList_updateBtn.inst = new wandaComp.wandaWindow("gatherTaskList_updateBtn", "gatherTask_add", serverList_updateBtn.optionObj);
            }
            return serverList_updateBtn.inst;
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
            }
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#gatherTask_add").data("wandaWindow");
            plusPopup.close();
            serverListGrid.refreshDatas();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#gatherTask_add").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            serverList_updateBtn.getInst().init(function () {
                var isOk = serverList_updateBtn.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var modeParam={
                    divModel:"update",
                    taskId:serverListGrid.getGridSelectValue()[0]["taskId"],
                }

                common.initExeByAttr("gatherTask_add", "opt='cancel'", function () {
                    gatherTask_popup.init(runTypeDic,gatherTypeDic,taskStatusDic,taskRunStatusDic,"gatherTask_add",modeParam);
                });
                $("#gatherTask_add_wnd_title").html(serverList_updateBtn.optionObj.title);
                serverList_updateBtn.getInst().callBack("opt='submit'", serverList_updateBtn.submitBtnCallBack);
                serverList_updateBtn.getInst().callBack("opt='cancel'", serverList_updateBtn.cancelBtnCallBack);
            });

        }
    };
    //初始化删除按钮
    var serverList_delBtn = {
        //获取选中的记录值
        gridSelectValue: function () {
            var selectEdit = serverListGrid.getInst().getSelect();
            return selectEdit;
        },
        //初始化单击事件的操作
        init: function () {
            $("#gatherTaskList_delBtn").on("click", function () {
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
                        deletArray.push(selectDelete[i]["taskId"]);
                    }
                    var param = {"ids": deletArray};
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
                            common.ajaxDelete("gatherTask/delete", param, successFun, null, null, $("#gatherTaskList"));
                        }
                    });
                }
            });
        }
    };

    //查看按钮
    var serverList_detailBtn = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 800,
            maxHeight: "",
            title: "查看采集任务",
            content: "biz/gatherTaskMgr/gatherTask/html/gatherTask_popup.html"
        },
        getInst: function () {
            if (serverList_detailBtn.inst) {
                serverList_detailBtn.inst = new wandaComp.wandaWindow("serverList_detailBtn", "gatherTask_add", serverList_detailBtn.optionObj);
            }
            return serverList_detailBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#gatherTask_add").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#gatherTask_add").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            serverList_detailBtn.getInst().init(function () {
                var modeParam={
                    divModel:"show",
                    taskId:taskId
                }
                common.initExeByAttr("gatherTask_add", "opt='cancel'", function () {
                    gatherTask_popup.init(runTypeDic,gatherTypeDic,taskStatusDic,taskRunStatusDic,"gatherTask_add",modeParam);
                });
                $("#gatherTask_add_wnd_title").html(serverList_detailBtn.optionObj.title);
            });
            serverList_detailBtn.getInst().callBack("opt='submit'", serverList_detailBtn.submitBtnCallBack);
            serverList_detailBtn.getInst().callBack("opt='cancel'", serverList_detailBtn.cancelBtnCallBack);
        }
    };

    //启用/停用按钮
    var serverList_updateStatus = {
        init:function(){
            $('#serverList_updateStatus').on('click',function(){
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
                    taskId:taskId,
                    taskStatus:taskStatus
                }
                common.jqConfirm.confirm({
                    content: "是否确认修改？",
                    call: function () {
                        common.ajaxPost("gatherTask/updateStatus", param, successFun, null, null, null);
                    }

                });
            });
        }
    };
    
   
    //初始化任务运行方式字典
    function initRunTypeDic(){
        var successFun = function(data){
            runTypeDic = data.datas;
        };
        var paramObj = {
            'type':'RUN_TYPE'
        }
        var param = {
            'paramObj' :paramObj
        };
        common.ajaxGet("dictionary/dicList",param,successFun,null,false,null);
    };

    //初始化数据源类型字典
    function initTaskStatusDic(){
        var successFun = function(data){
            taskStatusDic = data.datas;
        };
        var paramObj = {
            'type':"TASK_STATUS"
        }
        var param = {
            'paramObj' :paramObj
        };
        common.ajaxGet("dictionary/dicList",param ,successFun,null,false,null);
    };

    var init = function () {
        wandaComp.elementControl($("#gatherTaskList"));
        initRunTypeDic();
        initTaskStatusDic();
        userList_searchBtn.init();
        serverListGrid.init();
        serverList_addBtn.init();
        serverList_updateBtn.init();
        serverList_delBtn.init();
        serverList_detailBtn.init();
        serverList_updateStatus.init();
    };
    return {
        init: init
    }
});

var taskId="" ;
var taskStatus="";

//查看详情
function showDetail(id) {
    taskId = id;
    $("#serverList_detailBtn").trigger("click");
}
//启用停用按钮
function updateStatus(id,status){
    taskId = id;
    taskStatus = status;
    $("#serverList_updateStatus").trigger("click");
}

//状态查询
function  customSearch(param){
    $("#ptaskRunStatus").val(param);
    $("#serverList_searchBtn").trigger("click");
    $("#ptaskRunStatus").val("");
}
