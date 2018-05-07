define(["jquery", "common", "compont", "wandaComp", "wandaCompR"], function ($, common, compont, wandaComp, wandaCompR) {

    var logTypeDic =[{"NAME":"INFO","CODE":"1"},{"NAME":"ERROR","CODE":"0"}];
    var gatherTypeDic =[{"NAME":"全量","CODE":"1"},{"NAME":"增量","CODE":"2"}];
    //列表Grid
    var serverLogDetailListGrid = {
        rows: "10",
        pagerParam: {
        },
        gridColums: [
            {
                field: "tableName",
                title: "抽取的表名",
                width:120
            },
            {
                title: "级别",
                template:function(data){
                    var resStatus = data.resStatus;
                    for(var i =0 ;i<logTypeDic.length;i++){
                        if(resStatus==logTypeDic[i].CODE){
                            return logTypeDic[i].NAME;
                        }
                    }
                },
                width:55
            },
            {
                title: "日志描述",
                field:"failReason"

            },
            {
                title:"发生时间",
                width:150,
                template:function(data){
                    var t= new Date(data.createTime);
                    return t.toLocaleDateString().replace(/\//g, "-") + " " + t.toTimeString().substr(0, 8)
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
                    rows: serverLogDetailListGrid.rows
                },
                paramObj: serverLogDetailListGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                serverLogDetailListGrid.getInst().setDataSource(gridData, pageBean);


            };
            common.ajaxPost("gatherLog/logdetails", param, successFun, null, null, $("#gatherLogDetailList"));
        },
        pagerCallBack: function (e) {
            serverLogDetailListGrid.refreshDatas(e.index);
        },
        inst: {},
        getGridSelectValue: function () {
            var selectEdit = serverLogDetailListGrid.getInst().getSelect();
            return selectEdit;

        },
        getInst: function () {
            if (serverLogDetailListGrid.inst) {
                serverLogDetailListGrid.inst = new wandaComp.wandaGrid("serverListLogGrid", serverLogDetailListGrid.gridColums, true, this.pagerCallBack);
            }
            return serverLogDetailListGrid.inst;
        },
        init: function (param) {
            serverLogDetailListGrid.getInst().init();
            serverLogDetailListGrid.pagerParam = param;
            serverLogDetailListGrid.refreshDatas();
        }
    };



    var init = function (param) {
        wandaComp.elementControl($("#gatherLogDetailList"));
        serverLogDetailListGrid.init(param);
    };
    return {
        init: init
    }
});


