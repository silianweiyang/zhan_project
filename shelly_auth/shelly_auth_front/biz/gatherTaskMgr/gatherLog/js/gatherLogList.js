define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/gatherTaskMgr/gatherLog/js/gatherLogDetailList"], function ($, common, compont, wandaComp, wandaCompR,gatherLogD_popup) {

    var gatherTypeDic =[{"NAME":"全量","CODE":"1"},{"NAME":"增量","CODE":"2"}];
    //列表Grid
    var serverListGrid = {
        rows: "10",
        pagerParam: {
        },
        gridColums: [
            {
                field: "taskName",
                title: "任务名称"
            },
            {
                title: "采集方式",
                template:function(data){
                    var gatherType = data.gatherType;
                    if(gatherType==null) return "";
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
                    var gatherFrequency = data.gatherFrequency;
                    if(gatherFrequency==undefined || gatherFrequency==null) gatherFrequency="";
                    var runName = "" ;
                    if (gatherFrequency.indexOf("****-**-**")>-1) runName="每日";
                    else if(gatherFrequency.indexOf("****-**")>-1) runName="每月";
                    else if(gatherFrequency.indexOf("****")>-1) runName="每年";
                    else runName="一次性";

                    runName = runName +"("+ gatherFrequency+")";
                    runName = runName.replace("****-","");
                    runName = runName.replace("**-","");
                    runName = runName.replace("**","");
                    return runName;
                }
            },
            {
                title:"执行时间",
                template:function(data){

                    var t= new Date(data.runTime);
                    return t.toLocaleDateString().replace(/\//g, "-") + " " + t.toTimeString().substr(0, 8)
                }
            },
            {
                title:"完成时间",
                template:function(data){
                    if(data.finishTime==null){
                        return "";
                    }
                    var t= new Date(data.finishTime);
                    return t.toLocaleDateString().replace(/\//g, "-") + " " + t.toTimeString().substr(0, 8)
                 }

            },
            {
                title:"抽取成功记录数",
                field:"successCount"
            },
            {
                title:"抽取失败记录数",
               field:"failCount"
            },
            {
                title:"说明",
                field:"runResult"
            },
            {
                title:"操作",
                template:function(data){
                    var id = data["logId"];
                    var html = "";
                    html="<a class='btn btn-default' style='margin-left: 10px; ' onclick='showDetail("+id+")'>查看</a>";
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
            common.ajaxPost("gatherLog/list", param, successFun, null, null, $("#gatherTaskLogList"));
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
                serverListGrid.inst = new wandaComp.wandaGrid("serverGatherLogListGrid", serverListGrid.gridColums, true, this.pagerCallBack);
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
        init: function () {
            $('#serverList_searchBtn').on('click', function () {
                serverListGrid.pagerParam = {
                    "taskName": $("#searchTaskName").val()
                }
                serverListGrid.refreshDatas();
            });
        }
    }

    //查看按钮
    var serverList_detailBtn2 = {
        navigatePage: function () {
            common.setRouterParams(
                {"logId": logId
                }
            );
            router.navigate('DATA_SAFETY_CJRWGL_CJRZMX?opt=采集日志明细');
        },
        init: function () {
            $("#serverList_detailBtn").on("click", serverList_detailBtn.navigatePage);
        }
    };


    //查看按钮
    var serverList_detailBtn = {
        inst: {},
        optionObj: {
            minWidth: 800,
            minHeight:400,
            maxWidth: 1000,
            maxHeight: 550,
            title: "查看日志明细",
            content: "biz/gatherTaskMgr/gatherLog/html/gatherLogDetailList.html"
        },
        getInst: function () {
            if (serverList_detailBtn.inst) {
                serverList_detailBtn.inst = new wandaComp.wandaWindow("serverList_detailBtn", "gatherLog_add", serverList_detailBtn.optionObj);
            }
            return serverList_detailBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#gatherLog_add").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            serverList_detailBtn.getInst().init(function () {
                var modeParam={
                    logId:logId
                }
                gatherLogD_popup.init(modeParam);


            });
            serverList_detailBtn.getInst().callBack("opt='cancel'", serverList_detailBtn.cancelBtnCallBack);
        }
    };

    var init = function () {
        wandaComp.elementControl($("#gatherTaskList"));
        userList_searchBtn.init();
        serverListGrid.init();
        serverList_detailBtn.init();
    };
    return {
        init: init
    }
});

var logId="" ;

//查看详情
function showDetail(id) {
    logId = id+"";
    $("#serverList_detailBtn").trigger("click");
}


