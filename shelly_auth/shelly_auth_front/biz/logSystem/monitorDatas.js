define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {

    //列表Grid
    var monitorDatasGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                field: "SERVICE_NAME",
                title: "采集代理",
                width: 200
            }, {
                field: "NAME",
                title: "采集任务",
                width: 200
            }, {
                field: "EVENTIN",
                title: "总输入流量",
                width: 100
            }, {
                field: "EVENTOUT",
                title: "总输出流量",
                width: 100
            }, {
                field: "EVENTMILLIS",
                title: "总时长",
                width: 80
            }, {
                field: "INPUTSNAME",
                title: "inputs名称",
                width: 100
            }, {
                field: "INPUTSOUT",
                title: "inputs输出流量",
                width: 100
            }, {
                field: "INPUTSPUSHMILLIS",
                title: "inputs入栈时长",
                width: 100
            }, {
                field: "FILTERSNAME",
                title: "filters名称",
                width: 100
            }, {
                field: "FILTERSIN",
                title: "filters输入流量",
                width: 100
            }, {
                field: "FILTERSOUT",
                title: "filters输出流量"
            }, {
                field: "FILTERSMILLIS",
                title: "filters时长",
                width: 80
            }, {
                field: "OUTPUTSNAME",
                title: "outputs名称",
                width: 100
            }, {
                field: "OUTPUTSIN",
                title: "outputs输入流量",
                width: 120
            }, {
                field: "OUTPUTSOUT",
                title: "outputs输出流量",
                width: 120
            }, {
                field: "OUTPUTSMILLIS",
                title: "outputs时长",
                width: 100
            }, {
                field: "CREATEDATE_FORMAT",
                title: "创建时间",
                width: 150
            }
        ],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }

            var record = $("#record").val();
            var param = {
                pageBean: {
                    page: page + "",
                    rows: monitorDatasGrid.rows
                },
                paramObj: {
                    "recordId": parseInt(record)
                }
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                monitorDatasGrid.getInst().setDataSource(gridData, pageBean);
            };
            var url = "logworker/logstash/monitor/queryLogStashMonitorList";
            /*replaceUrl(url);*/
            common.ajaxPost(url, param, successFun, null, null, $("#monitorDatas"));
        },
        pagerCallBack: function (e) {
            monitorDatasGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (monitorDatasGrid.inst) {
                monitorDatasGrid.inst = new wandaComp.wandaGrid("monitorDatasGrid", this.gridColums, true, this.pagerCallBack);
            }
            return monitorDatasGrid.inst;
        },
        init: function () {
            monitorDatasGrid.getInst().init();
            monitorDatasGrid.refreshDatas();
        }
    };


    /* var replaceUrl = function (url) {
     var ajaxFunc = $.ajax;
     $.ajax = function () {
     arguments[0].url = url;
     ajaxFunc.apply($, arguments);
     $.ajax = ajaxFunc;
     };
     };*/


    var prePage = {
        prePageParam: "",
        init: function () {
            $("#backButon").click(function () {
                common.setRouterParams(prePage.prePageParam);
                router.navigate(prePage.prePageParam["menuCode"]);
            });
        }
    };


    var initParams = function () {
        var _params = common.getRouterParams();
        if (_params) {
            var recordId = _params["recordId"] === undefined ? "" : _params["recordId"];
            prePage.prePageParam = _params["prePageParam"];
            $("#record").val(recordId);
        }
    };

    var extendInit = function () {
        initParams();
        monitorDatasGrid.init();
        prePage.init();
    };
    return {
        init: extendInit
    };
});