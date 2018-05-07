define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {

    /*  var workerId_DropDownList = {
     successFun: function (data) {
     var workerId = $("#workerId").data("wandaDropDownList");
     workerId.setDataSource(data.datas);
     },
     init: function () {
     $("#workerId").wandaDropDownList({
     dataTextField: "name",
     dataValueField: "id",
     /!*  dataSource: workerId_DropDownList.data,*!/
     index: 0
     });
     var param = {
     paramObj: {}
     };
     var url = "logService/logworker/logstash/search";
     replaceUrl(url);
     common.ajaxPost(url, param, workerId_DropDownList.successFun, null, null, $("#logstashDeploy"));
     }
     };

     var configId_DropDownList = {
     successFun: function (data) {
     var configId = $("#configId").data("wandaDropDownList");
     configId.setDataSource(data.datas);
     },
     init: function () {
     $("#configId").wandaDropDownList({
     dataTextField: "name",
     dataValueField: "id",
     /!* dataSource: configId_DropDownList.data,*!/
     index: 0
     });
     var param = {
     paramObj: {}
     };
     var url = "logService/logworker/logstash/config/search";
     replaceUrl(url);
     common.ajaxPost("logService/logworker/logstash/config/search", param, configId_DropDownList.successFun, null, null, $("#logstashDeploy"));
     }
     };*/

    /*   taskFunc = function (data) {
     var data = JSON.parse(data.jsonConfig);
     var srcImg = data.input.type + ".svg";
     var dstImg = data.output.type + ".svg";
     return "<div style='text-align: center'><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' " +
     "viewBox='0 0 180 50' width='150px' height='60px' xml:space='preserve'><g>	<g>		" +
     "<image opacity='1' x='0' y='0' width='60' height='60' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='svg/" + srcImg + "'></image>" +
     "		<image opacity='1' x='55' y='0' width='60' height='60' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='svg/arrow.gif'></image>	" +
     "	<image opacity='1' x='115' y='0' width='60' height='60' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='svg/" + dstImg + "'></image>	</g></g></svg></div>";
     };
     */

    /*   inputFunc = function (data) {
     var data = JSON.parse(data.jsonConfig);
     var src = data.input.type;
     return src
     };

     outputFunc = function (data) {
     var data = JSON.parse(data.jsonConfig);
     var dst = data.output.type;
     return dst
     };*/

    //列表Grid
    var logstashDeployGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                field: "SERVICE_NAME",
                title: "采集代理",
                width: 300
            }, {
                field: "NAME",
                title: "采集任务",
                width: 300
            }, /* {
             field: "jsonConfig",
             title: "任务示意",
             template: "#=taskFunc(data)#",
             width: 300
             },*//* {
             field: "jsonConfig",
             title: "数据源类型",
             template: "#=inputFunc(data)#"
             }, {
             field: "jsonConfig",
             title: "输出类型",
             template: "#=outputFunc(data)#"
             },*/{
                title: "数据源类型",
                template: "<span class='input_type'></span>"
            }, {

                title: "输出类型",
                template: "<span class='output_type'></span>"
            }, {
                command: [{
                    className: "info",
                    name: "monitorDatasBtn",
                    imageClass: "",
                    iconClass: "",
                    text: "<i class=\"fa fa-search fa_icon\" title='查看监控数据'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var menucode = window.location.hash.substr(1, window.location.hash.length);
                        var _param = {
                            "recordId": data.RECORDID,
                            "prePageParam": {
                                "prePageParam": prePage.prePageParam,
                                "menuCode": menucode
                            }
                        };
                        common.setRouterParams(_param);
                        router.navigate('10070102');
                        return false;
                    }
                }], title: "操作", width: "100px"
            }
        ],
        dataBound: function () {
            var grid = this;
            this.tbody.find("tr[role='row']").each(function () {
                var row = this;
                var rowDatas = grid.dataItem(row);
                var datas = JSON.parse(rowDatas.JSONCONFIG);
                var input = datas.input.type;
                var output = datas.output.type;
                $(this).find(".input_type").text(input);
                $(this).find(".output_type").text(output);
            });
        },
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var serviceId = $("#serviceId").val();
            var param = {
                pageBean: {
                    page: page + "",
                    rows: logstashDeployGrid.rows
                },
                paramObj: {
                    "serviceId": serviceId
                }
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                /*      $("#logstashDeployGrid table").bind("DOMNodeInserted", function (e) {
                 if (e.target.cells && e.target.cells.length === 4) {
                 var cell = e.target.insertCell(2);
                 cell.style.textAlign = "center";
                 var data = JSON.parse($("#logstashDeployGrid").data("wandaGrid").dataItem(e.target).get("jsonConfig"));
                 console.log(data);
                 var srcImg = data.input.type + ".svg";
                 var dstImg = data.output.type + ".svg";
                 cell.innerHTML = "<div><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' " +
                 "viewBox='0 0 180 50' width='200px' height='80px' xml:space='preserve'><g>	<g>		" +
                 "<image opacity='1' x='0' y='0' width='60' height='60' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='svg/" + srcImg + "'></image>" +
                 "		<image opacity='1' x='55' y='0' width='60' height='60' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='svg/arrow.gif'></image>	" +
                 "	<image opacity='1' x='115' y='0' width='60' height='60' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='svg/" + dstImg + "'></image>	</g></g></svg></div>";
                 }
                 });*/
                logstashDeployGrid.getInst().setDataSource(gridData, pageBean);

            };
            var url = "logworker/logstash/config/deploy/queryLogStashConfigRecordList";
            /*replaceUrl(url);*/
            common.ajaxPost(url, param, successFun, null, null, $("#logstashDeploy"));
        },
        pagerCallBack: function (e) {
            logstashDeployGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (logstashDeployGrid.inst) {
                logstashDeployGrid.inst = new wandaComp.wandaGrid("logstashDeployGrid", this.gridColums, true, this.pagerCallBack, null, null, this.dataBound);
            }
            return logstashDeployGrid.inst;
        },
        init: function () {
            logstashDeployGrid.getInst().init();
            logstashDeployGrid.refreshDatas();
        }
    };

    /*   //新增btn——PopupWin
     var logstashDeploy_addPopup = {
     inst: {},
     optionObj: {
     minWidth: 500,
     minHeight: 300,
     maxWidth: "",
     maxHeight: "",
     title: "部署",
     content: "biz/logSystem/logstashDeploy_popup.html"
     },
     getInst: function () {
     if (logstashDeploy_addPopup.inst) {
     logstashDeploy_addPopup.inst = new wandaComp.wandaWindow("addBtn", "logstashDeploy_addPopup", logstashDeploy_addPopup.optionObj);
     }
     return logstashDeploy_addPopup.inst;
     },
     setSubPageValue: function () {
     $("#logstashDeploy_addPopup").find("#workerId").val("0");
     $("#logstashDeploy_addPopup").find("#configId").val("0");
     },
     submitBtnCallBack: function (closeFun) {
     var workerId = $("#logstashDeploy_addPopup").find("#workerId").val();
     var configId = $("#logstashDeploy_addPopup").find("#configId").val();
     var addPararm = {
     "workerId": workerId,
     "configId": configId
     };
     var successFun = function (data) {
     common.jqConfirm.alert({
     title: 1,
     content: "操作成功！",
     call: function () {
     logstashDeployGrid.refreshDatas();
     var plusPopup = $("#logstashDeploy_addPopup").data("wandaWindow");
     plusPopup.close();
     }
     });
     };
     var url = "logService/logworker/logstash/config/deploy";
     replaceUrl(url);
     common.ajaxPost(url, addPararm, successFun);
     },
     cancelBtnCallBack: function () {
     },
     init: function () {
     logstashDeploy_addPopup.getInst().init(function () {
     logstashDeploy_addPopup.setSubPageValue();
     var initFun = logstashDeploy_popup.init;
     common.initExeByAttr("logstashDeploy_addPopup", "opt='submit'", function () {
     initFun("logstashDeploy_addPopup");
     });
     });
     logstashDeploy_addPopup.getInst().callBack("opt='submit'", logstashDeploy_addPopup.submitBtnCallBack, true);
     logstashDeploy_addPopup.getInst().callBack("opt='cancel'", logstashDeploy_addPopup.cancelBtnCallBack);
     }
     };*/

    /*   var logstashDeploy_searchBtn = {
     init: function () {
     $("#searchBtn").click(function () {
     var workerId = $("#workerId").val();
     var configId = $("#configId").val();
     logstashDeployGrid.pagerParam = {
     "workerId": workerId,
     "configId": configId
     };
     logstashDeployGrid.refreshDatas();
     });
     }
     };*/

    /*  var logstashDeploy_deltBtn = {
     gridSelectValue: function () {
     var selectEdit = logstashDeployGrid.getInst().getSelect();
     return selectEdit;
     },
     init: function () {
     $("#deltBtn").on("click", function () {
     var selectDelet = logstashDeploy_deltBtn.gridSelectValue();
     if (selectDelet.length == 1) {
     var deltParam = selectDelet[0]["id"];
     var successFun = function (data) {
     common.jqConfirm.alert({
     title: 1,
     content: "操作成功！",
     call: function () {
     logstashDeployGrid.refreshDatas();
     }
     });
     };
     common.jqConfirm.confirm({
     content: "是否确认删除？",
     call: function () {
     var url = "logService/logworker/logstash/config/deploy/search/" + deltParam;
     replaceUrl(url);
     common.ajaxDelete(url, deltParam, successFun, null, null, $("#logstashDeploy"));
     }
     });
     } else {
     common.jqConfirm.alert({
     title: 0,
     content: "请选择一条数据！"
     });
     return false;
     }
     })
     }
     };*/

    /* var replaceUrl = function (url) {
     var ajaxFunc = $.ajax;
     $.ajax = function () {
     arguments[0].url = url;
     ajaxFunc.apply($, arguments);
     $.ajax = ajaxFunc;
     };
     };
     */
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
            var serviceId = _params["serviceId"] === undefined ? "" : _params["serviceId"];
            prePage.prePageParam = _params["prePageParam"];
            $("#serviceId").val(serviceId);
        }
    };
    var extendInit = function () {
        /*      workerId_DropDownList.init();
         configId_DropDownList.init();*/
        /*  logstashDeploy_searchBtn.init();
         logstashDeploy_addPopup.init();
         logstashDeploy_deltBtn.init();*/
        initParams();
        logstashDeployGrid.init();
        prePage.init();
    };
    return {
        init: extendInit
    };
});