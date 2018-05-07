define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "biz/resourceMgr/resourceCfgMgr/js/resourceCfg_popup"], function ($, common, compont, wandaComp, wandaCompR, resourceCfg_popup) {
    var resSattusArr = [];
    var currDirId = "";

    //资源目录树
    var resourceCfgList_tree = {
            wandaTreeView: "",
            queryDataCall: "",
            params: {
                "dirName": $("#resourceCfgList_dirName").val(),
                "dirStatusStr" : "2,5"
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
                        "resStatusStr":"1,2,3"
                    };
                    resourceCfgListGrid.refreshDatas();
                }
            },
            queryData: function(id, fun) {
                resourceCfgList_tree.queryDataCall = fun;
                resourceCfgList_tree.params.pdirId = id;
                common.ajaxPost("resourceConfig/resourceDirTree",resourceCfgList_tree.params, resourceCfgList_tree.querySuccessFun, resourceCfgList_tree.queryErrorFun, null, $("#resourceCfgList"));
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
                title: "资源名称",
                width: '150px'
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
                width: "200px",
                template:function (data) {
                    var html = '';
                    if(data.resStatus == 1){    //暂存
                        html += '<a name="edit" class="btn btn-success" href="javascript:void(0);" onclick="editOne(\''+data.resId+'\')">修改</a>';
                        html += '<a name="remove" class="btn btn-warning" style="margin-left: 10px;" href="javascript:void(0);" onclick="removeOne(\''+data.resId+'\')">删除</a>';
                        html += '<a name="start" class="btn btn-primary" style="margin-left: 10px;" href="javascript:void(0);" onclick="startOne(\''+data.resId+'\')">启用</a>';
                    }else if(data.resStatus == 2){    //启用
                        html += '<a name="stop" class="btn btn-danger" href="javascript:void(0);" onclick="stopOne(\''+data.resId+'\')">停用</a>';
                        html += '<a name="detail" class="btn btn-default" style="margin-left: 10px;" href="javascript:void(0);" onclick="detailOne(\''+data.resId+'\')">查看</a>';
                    }else if(data.resStatus == 3){    //停用
                        html += '<a name="edit" class="btn btn-success" href="javascript:void(0);" onclick="editOne(\''+data.resId+'\')">修改</a>';
                        html += '<a name="start" class="btn btn-primary" style="margin-left: 10px;" href="javascript:void(0);" onclick="startOne(\''+data.resId+'\')">启用</a>';
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
                    "resStatusStr": "1,2,3"
                };
            }
            $("#resourceCfgList_resStatus").val("");
            resourceCfgListGrid.pagerParam = {
                "resStatusStr": _params["resStatusStr"]
            };
            resourceCfgListGrid.refreshDatas();
        }
    };

    //列表右侧操作列修改按钮
    var curObj = null;
    window.editOne = function (resId) {
        $("#submit").css("display", "inline-block");
        var successFun = function (data) {
            var dataItem = data.datas[0];
            curObj = dataItem;  //设置为全局对象，便于弹出时传值使用
            $("#resourceCfgList_hidBtn").trigger("click");
            //初始化弹出内容
            $("#res_code").val(dataItem.resCode);
            $("#res_code").prop("readonly",true);
            $("#res_name").val(dataItem.resName);
            $("#is_open0").prop("checked",false);
            $("#is_open1").prop("checked",false);
            $("#is_open"+dataItem.isOpen).prop("checked",true);
            $("#is_increment0").prop("checked",false);
            $("#is_increment1").prop("checked",false);
            $("#is_increment"+dataItem.isIncrement).prop("checked",true);
            $("#resource_source1").prop("checked",false);
            $("#resource_source2").prop("checked",false);
            $("#resource_source"+dataItem.resSource).prop("checked",true);
            $("#resource_storageSource").val(dataItem.storageId);
            $("#restable_name").val(dataItem.restableName);
            $("#resource_describe").val(dataItem.describe);

            $("#btnOpt").val("UPDATE");
            $("#resourceCfgList_plusPopup_wnd_title").text("修改资源");
            $("#start").css("display","none");
        }
        var param = {
            paramObj: {resId:resId}
        };
        common.ajaxPost("resourceConfig/queryResourceList",param,successFun,null,null,$("#resourceCfgList"));
    }

    //列表右侧操作列删除按钮
    removeOne = function(resId){
        var param = {paramObj: [{status:"4",resId:resId}]};
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
            content: "是否确认删除？",
            call: function () {
                common.ajaxDelete("resourceConfig/delete", param, successFun, null, null, $("#resourceCfgList"));
            }
        });
    }

    //列表右侧操作列启用按钮
    window.startOne = function (resId) {
        var param = {paramObj: [{status:"2",resId:resId}]};
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

    //列表右侧操作列停用按钮
    window.stopOne = function (resId) {
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
            content: "是否确认停用？",
            call: function () {
                common.ajaxPut("resourceConfig/updateStatus", param, successFun, null, null, $("#resourceCfgList"));
            }
        });
    }

    //列表右侧操作列查看按钮
    window.detailOne = function (resId) {
        var successFun = function (data) {
            var dataItem = data.datas[0];
            curObj = dataItem;  //设置为全局对象，便于弹出时传值使用
            $("#resourceCfgList_hidBtn").trigger("click");
            //初始化弹出内容
            $("#res_code").val(dataItem.resCode);
            $("#res_name").val(dataItem.resName);
            $("#is_open0").prop("checked", false);
            $("#is_open1").prop("checked", false);
            $("#is_open" + dataItem.isOpen).prop("checked", true);
            $("#is_increment0").prop("checked", false);
            $("#is_increment1").prop("checked", false);
            $("#is_increment" + dataItem.isIncrement).prop("checked", true);
            $("#resource_source1").prop("checked", false);
            $("#resource_source2").prop("checked", false);
            $("#resource_source" + dataItem.resSource).prop("checked", true);
            $("#resource_storageSource").val(dataItem.storageId);
            $("#restable_name").val(dataItem.restableName);
            $("#resource_describe").val(dataItem.describe);

            $("#btnOpt").val("UPDATE");
            $("#resourceCfgList_plusPopup_wnd_title").text("查看资源");
            $("#submit").css("display", "none");
            $("#start").css("display","none");
        }
        var param = {
            paramObj: {resId:resId}
        };
        common.ajaxPost("resourceConfig/queryResourceList",param,successFun,null,null,$("#resourceCfgList"));
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
                    "resStatusStr":"1,2,3"
                };
                resourceCfgListGrid.refreshDatas();
            });
        }
    };

    //增加按钮
    var resourceCfgList_addBtn = {
        init:function(){
            $("#resourceCfgList_addBtn").click(function(){
                if(currDirId == "" || typeof(currDirId) == undefined){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择没有子目录的资源的目录！"
                    });
                }else{
                    curObj = null;  //清空存储在全局的当前对象
                    $("#resourceCfgList_hidBtn").trigger("click");
                    //清空内容
                    $("#res_code").val("");
                    $("#res_code").prop("readonly",false);
                    $("#res_name").val("");
                    $("#restable_name").val("");
                    $("#resource_describe").val("");
                    $("#is_open0").prop("checked",false);
                    $("#is_open1").prop("checked",true);
                    $("#is_increment0").prop("checked",true);
                    $("#is_increment1").prop("checked",false);
                    $("#resource_source1").prop("checked",false);
                    $("#resource_source2").prop("checked",true);
                    $("#resource_field_list").html("");
                    $("#source_table_list").empty();
                    $("#btnOpt").val("ADD");

                    $("#resourceCfgList_plusPopup_wnd_title").text("新增资源");
                    //修改时显示启用按钮
                    $("#start").css("display","inline-block");
                    $("#submit").css("display", "inline-block");
                }
            });
        }
    }

    //修改按钮
    var resourceCfgList_updateBtn = {
        init: function () {
            $("#resourceCfgList_updateBtn").click(function () {
                var selectEdit =resourceCfgListGrid.getInst().getSelect();
                if (selectEdit.length != 1) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择一条数据！"
                    });
                    return false;
                }else {
                    if(selectEdit[0].resStatus != 1){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "只有暂存状态下才能修改！"
                        });
                        return false;
                    }
                    $("#resourceCfgList_hidBtn").trigger("click");
                    //初始化弹出内容
                    $("#res_code").val(selectEdit[0].resCode);
                    $("#res_code").prop("readonly",true);
                    $("#res_name").val(selectEdit[0].resName);
                    $("#is_open0").prop("checked",false);
                    $("#is_open1").prop("checked",false);
                    $("#is_open"+selectEdit[0].isOpen).prop("checked",true);
                    $("#is_increment0").prop("checked",false);
                    $("#is_increment1").prop("checked",false);
                    $("#is_increment"+selectEdit[0].isIncrement).prop("checked",true);
                    $("#resource_source1").prop("checked",false);
                    $("#resource_source2").prop("checked",false);
                    $("#resource_source"+selectEdit[0].resSource).prop("checked",true);
                    $("#restable_name").val(selectEdit[0].restableName);
                    $("#resource_describe").val(selectEdit[0].describe);
                    $("#btnOpt").val("UPDATE");

                    $("#resourceCfgList_plusPopup_wnd_title").text("修改资源");
                    $("#submit").css("display", "inline-block");
                }
            });
        }
    };

    //弹出框
    var resourceCfgList_plusPopup = {
        inst: {},
        optionObj: {
            minWidth: 600,
            minHeight: 300,
            maxWidth: 1100,
            maxHeight: "",
            title: "新增资源",
            content: "biz/resourceMgr/resourceCfgMgr/html/resourceCfg_popup.html"
        },
        getInst: function () {
            if (resourceCfgList_plusPopup.inst) {
                resourceCfgList_plusPopup.inst = new wandaComp.wandaWindow("resourceCfgList_hidBtn", "resourceCfgList_plusPopup", resourceCfgList_plusPopup.optionObj);
            }
            return resourceCfgList_plusPopup.inst;
        },
        getGridSelectValue: function () {
            return resourceCfgListGrid.getInst().getSelect();
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#resourceCfgList_plusPopup").data("wandaWindow");
            plusPopup.close();
            resourceCfgListGrid.refreshDatas();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#resourceCfgList_plusPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            resourceCfgList_plusPopup.getInst().init(function () {
                common.initExeByAttr("resourceCfgList_plusPopup", "opt='cancel'", function () {
                    var selectItem = resourceCfgList_plusPopup.getGridSelectValue();
                    if(curObj != null){
                        //如果对象不为空，则表示此操作来自于右侧操作列单击的触发的弹窗事件，所以取该按钮传的对象curObj
                        selectItem = [];
                        selectItem.push(curObj);
                    }
                    resourceCfg_popup.init("resourceCfgList_plusPopup",currDirId, selectItem[0]);
                });
            });
            resourceCfgList_plusPopup.getInst().callBack("opt='submit'", resourceCfgList_plusPopup.submitBtnCallBack);
            resourceCfgList_plusPopup.getInst().callBack("opt='cancel'", resourceCfgList_plusPopup.cancelBtnCallBack);
        }
    };

    //删除按钮
    var resourceCfgList_delBtn = {
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
            $("#resourceCfgList_delBtn").click(function () {
                var selectEdit =resourceCfgListGrid.getInst().getSelect();
                if (selectEdit.length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择要删除的数据！"
                    });
                    return false;
                }else {
                    var params = [];
                    $.each(selectEdit,function (i,v) {
                        if (v.resStatus == 1) {
                            var obj = {status: "4", resId: v.resId};
                            params.push(obj);
                        }
                    });
                    if(params.length == 0){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "暂存状态下才能删除！"
                        });
                        return false;
                    }
                    var param = {
                        paramObj:params
                    };
                    common.jqConfirm.confirm({
                        content: "是否确认删除？",
                        call: function () {
                            common.ajaxDelete("resourceConfig/delete", param, resourceCfgList_delBtn.successFun, null, null, $("#resourceCfgList"));
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
        resourceCfgList_plusPopup.init();
        resourceCfgList_addBtn.init();
        resourceCfgList_updateBtn.init();
        resourceCfgList_delBtn.init();
    };
    return {
        init: init
    }
});
