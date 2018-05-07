define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var gateStatus_DropDownList = {
        value: "",
        setValue: function (value) {
            $("#gateStatus").data("wandaDropDownList").value(value);
            gateStatus_DropDownList.value = value;
        },
        successFun: function (data) {
            var gateStatus= $("#gateStatus").data("wandaDropDownList");
            gateStatus.setDataSource(data);
            gateStatus_DropDownList.setValue(gateStatus_DropDownList.value);
        },
        init: function () {
            $("#gateStatus").wandaDropDownList({
                optionLabel: {
                    text: "全部",
                    value: ""
                },
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change: function (e) {
                }
            });
            var url = "syscommpara/getBaseAttr";
            /*replaceUrl(url);*/
            var param = {
                "key": "operationState"
            };
            common.ajaxGet(url, param, gateStatus_DropDownList.successFun, null, null, $("#engineHealth"));
        }
    };

    statusFunc = function (data) {
        var _class = "", msg = "", imgSrc = "", status = data.STATE;
        if (status === "1") {
            _class = "online";
            msg = "运行中";
            imgSrc = "fa-spin";
        } else if (status === "0") {
            _class = "offline";
            msg = "已停止";
            imgSrc = "";
        }
        return "<div style='text-align:center;font-size: 10px;'><div class='" + _class + "'><i class='fa fa-sun-o "+imgSrc+"' style='margin-right: 10px;font-size: 16px;'></i>" + msg + "</div></div>";
    };

    //列表Grid
    var engineHealthGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'  //非必写
            },{
                field: "IP",
                title: "IP地址"
            },{
                field: "PORT",
                title: "端口"
            }, {
                field: "CREATE_DATE",
                title: "上次启动时间",
                width: "160px"
            }, {
                field: "STATE",
                title: "运行状态",
                template: "#=statusFunc(data)#",
                width:"150px"
            }, {
                field: "ALARM_DATE",
                title: "故障时间",
                width:"160px"
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: engineHealthGrid.rows
                },
                paramObj: engineHealthGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                engineHealthGrid.getInst().setDataSource(gridData, pageBean);
            };
            var url = "api/engineState/queryGateApiStateList";
            /*replaceUrl(url);*/
            common.ajaxGet(url, param, successFun, null, null, $("#engineHealth"));
        },
        pagerCallBack: function (e) {
            engineHealthGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (engineHealthGrid.inst) {
                engineHealthGrid.inst = new wandaComp.wandaGrid("engineHealthGrid", this.gridColums, true, this.pagerCallBack);
            }
            return engineHealthGrid.inst;
        },
        init: function () {
            engineHealthGrid.getInst().init();
            engineHealthGrid.pagerParam = {
                "ip": "",
                "state": ""
            };
            engineHealthGrid.refreshDatas();
        }
    };
    //删除button
    var engineHealth_delBtn = {
        init: function () {
            $("#engineHealth_delBtn").on("click", function () {
                var selectEdit = engineHealthGrid.getInst().getSelect();
                var selectArray = [];
                if (selectEdit.length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请至少选择一条数据！"
                    });
                    return false;
                } else {
                    for (var i = 0; i < selectEdit.length; i++) {
                        for (var i = 0; i < selectEdit.length; i++) {
                            if(selectEdit[i]["STATE"] == "1"){
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "运行中的不能删除！"
                                });
                                selectArray = [];
                                return false;
                            }
                            selectArray.push(selectEdit[i]["ID"]);
                        }
                        var nodeDeleteInfos = {"apiIds": selectArray};
                        var successFun = function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    engineHealthGrid.refreshDatas();
                                }
                            });
                        };
                        common.jqConfirm.confirm({
                            content: "是否确认删除？",
                            call: function () {
                                common.ajaxDelete("api/engineState/delGateApiState", selectArray, successFun, null, null, $("#engineHealth"));
                            }
                        });
                    }
                }
            });
        }
    };
    var engineHealth_searchBtn = {
        init: function () {
            $("#searchBtn").click(function () {
                var gateHost = $("#gateHost").val();
                var hostReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                var gateStatus= $("#gateStatus").data("wandaDropDownList").value();

                    engineHealthGrid.pagerParam = {
                        "ip": gateHost,
                        "state": gateStatus
                    };
                    engineHealthGrid.refreshDatas();

            });
        }
    };

    var initParams = function () {
        var _params = common.getRouterParams();
        if (_params) {
            var gateHost = _params["gateHost"] === undefined ? "" : _params["gateHost"];
            var gateStatus= _params["gateStatus"] === undefined ? "" : _params["gateStatus"];
            $("#gateHost").val(gateHost);
            gateStatus_DropDownList.setValue(gateStatus);

            engineHealthGrid.pagerParam = {
                "ip": gateHost,
                "gateHost": gateStatus
            };
            engineHealthGrid.refreshDatas();
        }
    };

    var extendInit = function () {
        $("#gateHost").val("");
        gateStatus_DropDownList.value = "";
        gateStatus_DropDownList.init();
        engineHealth_searchBtn.init();
        engineHealthGrid.init();
        engineHealth_delBtn.init();
        initParams();
    };
    return {
        init: extendInit
    };
});