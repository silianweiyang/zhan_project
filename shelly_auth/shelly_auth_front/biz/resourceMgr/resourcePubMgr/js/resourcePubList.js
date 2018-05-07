define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/resourceMgr/resourceCfgMgr/js/resourceCfg_popup"], function ($, common, compont, wandaComp, wandaCompR, resourceCfg_popup) {
    var resSattusArr = [];
    var currDirId = "";

    //资源目录树
    var resourceCfgList_tree = {
        wandaTreeView: "",
        queryDataCall: "",
        params: {
            "dirName": $("#resourceCfgList_dirName").val(),
            "dirStatusStr" : "5"
        },
        querySuccessFun: function(data) {
            console.log(data.datas);
            resourceCfgList_tree.queryDataCall(data.datas);
        },
        queryErrorFun: function() {
            common.jqConfirm.alert({
                title: 0,
                content: "加载失败！"
            });
        },
        onSelect: function(dataItem) {
            if(dataItem.hadFolder == 0){
                currDirId = dataItem.dirId;
                resourceCfgListGrid.pagerParam = {
                    "dirId": dataItem.dirId,
                    "resStatusStr":"2,5"
                };
                resourceCfgListGrid.refreshDatas();
            }
        },
        queryData: function(id, fun) {
            resourceCfgList_tree.queryDataCall = fun;
            resourceCfgList_tree.params.pdirId = id;
            common.ajaxPost("resourceConfig/resourceDirTree", resourceCfgList_tree.params, resourceCfgList_tree.querySuccessFun, resourceCfgList_tree.queryErrorFun, null, $("#resourceCfgList"));
        },
        option: null,
        init: function() {
            resourceCfgList_tree.option = {
                childKey: "children",
                textKey: "dirName",
                noCache: false,
                treeDom: $("#resourceCfg_tree"),
                queryKey: "dirId",
                openKey:"open",
                checkKey:"checked",
                queryData: resourceCfgList_tree.queryData,
                onSelect: resourceCfgList_tree.onSelect,
                template: "<span style='color: #= item.color #'>#= item.dirName # </span>"
            };
            resourceCfgList_tree.wandaTreeView = new wandaComp.wandaTreeView(resourceCfgList_tree.option);
            resourceCfgList_tree.wandaTreeView.init();
        },
        reloadTree: function(dirId) {
            resourceCfgList_tree.wandaTreeView.refresh(dirId);
        }
    };

    //资源目录查询按钮
    var resourceCfgList_dirSearch = {
        init: function () {
            $("#resourceCfgList_dirSearch").click(function() {
                $("#resourceCfg_tree").empty();
                resourceCfgList_tree.params.dirName = $("#resourceCfgList_dirName").val();
                resourceCfgList_tree.init();
            });
        }
    }

    //资源状态下拉框初始化
    var resStatus_DropDownList = {
        successFun : function(data){
            var res_status = $("#resourceCfgList_resStatus").data("wandaDropDownList");
            res_status.setDataSource(data.datas);
            resSattusArr = data.datas;
        },
        init: function () {
            $("#resourceCfgList_resStatus").wandaDropDownList({
                optionLabel: {
                    NAME: "全部",
                    CODE: ""
                },
                dataTextField: "NAME",
                dataValueField: "CODE",
                index: 0,
                change: function (e) {
                },
                open: function (e) {
                    $("#resourceCfgList_resStatus-list").css("height", "auto");
                    $("#resourceCfgList_resStatus-list").css("overflow", "hidden");
                }
            });
            var param = {
                "paramObj": {
                    "type": "RES_STATUS"
                }
            };
            common.ajaxGet("dictionary/dicList", param, resStatus_DropDownList.successFun, null, false, $("#resourceCfgList"));
        }
    }

    //资源目录列表Grid
    var resourceCfgListGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
            }, {
                field: "resCode",
                title: "资源代码",
                width: '120px'
            }, {
                field: "resName",
                title: "资源名称"
            },{
                title: "开放性",
                width: '70px',
                template: function (data) {
                    if(data.isOpen == 1){
                        return "是";
                    }else{
                        return "否";
                    }
                }
            },{
                title: "状态",
                width: '70px',
                template: function (data) {
                    for(var i = 0;i<resSattusArr.length;i++){
                        if(data.resStatus == Number(resSattusArr[i].CODE)){
                            return resSattusArr[i].NAME;
                        }
                    }
                }
            },{
                field: "describe",
                title: "说明"
            },{
                title: "操作",
                width: "135px",
                template:function (data) {
                     var html = "";
                     if(data.resStatus == 2){    //启用
                         html += '<a name="publish" class="btn btn-primary" href="javascript:void(0);" onclick="publish(\''+data.resId+'\')">发布资源</a>';
                     }else if(data.resStatus == 5){    //发布
                         html += '<a name="cancel" class="btn btn-danger" href="javascript:void(0);" onclick="cancelPublish(\''+data.resId+'\')">取消发布</a>';
                     }
                     return html;
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
                    rows: resourceCfgListGrid.rows
                },
                paramObj: resourceCfgListGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                //塞入数据
                resourceCfgListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxPost("resourceConfig/queryResourceList", param, successFun, null, null, $("#resourceCfgList"));
        },
        pagerCallBack: function (e) {
            resourceCfgListGrid.refreshDatas(e.index);
        },

        inst: {},
        getInst: function (roldId) {
            if (resourceCfgListGrid.inst) {
                resourceCfgListGrid.inst = new wandaComp.wandaGrid("resourceCfgListGrid", resourceCfgListGrid.gridColums, true, this.pagerCallBack);
            }
            return resourceCfgListGrid.inst;
        },
        init: function () {
            resourceCfgListGrid.getInst().init();
            var _params = common.getRouterParams();
            if (_params == null || _params == ""){
                _params = {
                    "resStatusStr": "2,5"
                };
            }
            $("#resourceCfgList_resStatus").val("");
            resourceCfgListGrid.pagerParam = {
                "resStatusStr": _params["resStatusStr"]
            };
            resourceCfgListGrid.refreshDatas();
        }
    };

    //列表右侧操作列发布按钮
    window.publish = function (resId) {
        var param = {paramObj: [{status:"5",resId:resId}]};
        var successFun = function (data) {
            common.jqConfirm.alert({
                title: 1,
                content: "操作成功！",
                call: function () {
                    resourceCfgListGrid.refreshDatas();
                }
            });
        };
        common.ajaxPut("resourceConfig/updateStatus", param, successFun, null, null, $("#resourceCfgList"))
    }

    //列表右侧操作列取消发布按钮
    window.cancelPublish = function (resId) {
        var param = {paramObj: [{status:"3",resId:resId}]};
        var successFun = function (data) {
            common.jqConfirm.alert({
                title: 1,
                content: "操作成功！",
                call: function () {
                    resourceCfgListGrid.refreshDatas();
                }
            });
        };
        common.jqConfirm.confirm({
            content: "是否确认取消发布？",
            call: function () {
                common.ajaxPut("resourceConfig/updateStatus", param, successFun, null, null, $("#resourceCfgList"));
            }
        });
    }

    //查询按钮
    var resCfgList_searchBtn = {
        init: function () {
            $("#resourceCfgList_searchBtn").click(function () {
                var resName = $("#resourceCfgList_resName").val();
                var resStatus = $("#resourceCfgList_resStatus").val();
                resourceCfgListGrid.pagerParam = {
                    "resName": resName,
                    "resStatus": resStatus,
                    "dirId":currDirId,
                    "resStatusStr":"2,5"
                };
                resourceCfgListGrid.refreshDatas();
            });
        }
    };

    //批量发布按钮
    var resourceCfgList_publishBtn = {
        successFun: function (data) {
            common.jqConfirm.alert({
                title: 1,
                content: "操作成功！",
                call: function () {
                    resourceCfgListGrid.refreshDatas();
                }
            });
        },
        init:function () {
            $("#resourceCfgList_publishBtn").click(function () {
                var selectEdit =resourceCfgListGrid.getInst().getSelect();
                if (selectEdit.length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择要发布的数据！"
                    });
                    return false;
                }else {
                    var params = [];
                    $.each(selectEdit,function (i,v) {
                        var obj = {status:"5",resId:v.resId};
                        params.push(obj);
                    });
                    var param = {
                        paramObj:params
                    };
                    common.ajaxPut("resourceConfig/updateStatus", param, resourceCfgList_publishBtn.successFun, null, null, $("#resourceCfgList"));

                }
            });
        }
    }

    //批量取消发布按钮
    var resourceCfgList_cancelBtn = {
        successFun: function (data) {
            common.jqConfirm.alert({
                title: 1,
                content: "操作成功！",
                call: function () {
                    resourceCfgListGrid.refreshDatas();
                }
            });
        },
        init:function () {
            $("#resourceCfgList_cancelBtn").click(function () {
                var selectEdit =resourceCfgListGrid.getInst().getSelect();
                if (selectEdit.length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择要取消发布的数据！"
                    });
                    return false;
                }else {
                    var flag = false;
                    var params = [];
                    $.each(selectEdit,function (i,v) {
                        if(v.resStatus == 2){
                            flag = true;
                            return false;
                        }
                        var obj = {status:"3",resId:v.resId};
                        params.push(obj);
                    });
                    if(flag){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请选择去掉状态为“启用”的数据！"
                        });
                        return;
                    }
                    var param = {
                        paramObj:params
                    };
                    common.jqConfirm.confirm({
                        content: "是否确认取消发布？",
                        call: function () {
                            common.ajaxPut("resourceConfig/updateStatus", param, resourceCfgList_cancelBtn.successFun, null, null, $("#resourceCfgList"));
                        }
                    });
                }
            });
        }
    }




    var init = function () {
        wandaComp.elementControl($("#resourceCfgList"));
        resourceCfgList_dirSearch.init();
        resourceCfgList_tree.init();
        resStatus_DropDownList.init();
        resourceCfgListGrid.init();
        resCfgList_searchBtn.init();
        resourceCfgList_publishBtn.init();
        resourceCfgList_cancelBtn.init();
    };
    return {
        init: init
    }
});



