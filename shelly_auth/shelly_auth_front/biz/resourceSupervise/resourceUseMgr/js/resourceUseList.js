define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/resourceMgr/resourceCfgMgr/js/resourceCfg_popup"], function ($, common, compont, wandaComp, wandaCompR, resourceCfg_popup) {
    var currDirId = "";
    var optTypeArr = [];
    //日志类型下拉框初始化
    var optType_DropDownList = {
        successFun : function(data){
            var res_status = $("#resourceCfgList_optType").data("wandaDropDownList");
            var arr = [];
            $.each(data.datas,function (i, v) {
                if(v.TYPE == "OPERATE_TYPE" && (v.CODE == 14 || v.CODE == 15 || v.CODE == 16)){
                    arr.push(v);
                }
            });
            optTypeArr = arr;
            res_status.setDataSource(arr);
        },
        init: function () {
            $("#resourceCfgList_optType").wandaDropDownList({
                optionLabel: {
                    NAME: "全部",
                    CODE: ""
                },
                dataTextField: "NAME",
                dataValueField: "CODE",
                index: 0
            });
            var param = {
                paramObj:{}
            };
            common.ajaxGet("dictionary/dicList", param, optType_DropDownList.successFun, null, false, $("#resourceCfgList"));
        }
    }

    //日志列表Grid
    var logListGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
            }, {
                title: "操作类型",
                width: '150px',
                template: function (data) {
                    for(var i=0;i< optTypeArr.length;i++){
                        if(data.operateType == Number(optTypeArr[i]["CODE"])){
                            return optTypeArr[i]["NAME"]
                        }
                    }
                }
            }, {
                field: "operateTable",
                title: "操作的资源"
            },{
                field: "operatorCode",
                title: "操作人"
            },{
                title: "操作时间",
                template:function (data) {
                    var dateTime = new Date(data.operateTime) ;
                    return dateTime.toLocaleString();
                }
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: logListGrid.rows
                },
                paramObj: logListGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                //塞入数据
                logListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxPost("log/logList", param, successFun, null, null, $("#resourceUseList"));
        },
        pagerCallBack: function (e) {
            logListGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function (roldId) {
            if (logListGrid.inst) {
                logListGrid.inst = new wandaComp.wandaGrid("resourceUseListGrid", logListGrid.gridColums, true, this.pagerCallBack);
            }
            return logListGrid.inst;
        },
        init: function () {
            logListGrid.getInst().init();
            var _params = common.getRouterParams();
            if (_params == null || _params == ""){
                _params = {
                    "operateTypeStr": "14,15,16"
                };
            }
            $("#resourceCfgList_optType").val("");
            logListGrid.pagerParam = {
                "operateTypeStr": _params["operateTypeStr"]
            };
            logListGrid.refreshDatas();
        }
    };


    //查询按钮
    var logList_searchBtn = {
        init: function () {
            $("#resourceUseList_searchBtn").click(function () {
                var optType = $("#resourceCfgList_optType").val();
                logListGrid.pagerParam = {
                    operateType: optType,
                    operateTypeStr:"14,15,16"
                };
                logListGrid.refreshDatas();
            });
        }
    };




    var init = function () {
        wandaComp.elementControl($("#resourceUseList"));
        optType_DropDownList.init();
        logListGrid.init();
        logList_searchBtn.init();
    };
    return {
        init: init
    }
});



