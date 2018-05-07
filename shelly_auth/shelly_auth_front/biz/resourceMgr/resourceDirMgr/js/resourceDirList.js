define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/resourceMgr/resourceDirMgr/js/resourceDir_popup"], function ($, common, compont, wandaComp, wandaCompR,resourceDir_popup) {
    var dir_status = {};
    var currDirId = "";
    var currDirName = "";
    var dirLevel=1;
    //资源目录列表初始化
    var resourceDirListGrid = {
        rows: "10",
        pageParam:{},
        gridColums: [
            {
                width: '30px',
                template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
            }, {
                field: "dirCode",
                title: "资源代码",
                width: '120px'
            }, {
                field: "dirName",
                title: "资源名称"
            },{
                title: "开放性",
                width: '70px',
                template:function(data){
                    if(data.isOpen==0){
                        return "否";
                    }else if(data.isOpen==1){
                        return "是";
                    }
                }
            },{
                title: "状态",
                template: function (data) {
                    var dirStatus = data.dirStatus;
                    for(var i =0 ;i<dir_status.length;i++){
                        if(dirStatus==dir_status[i].CODE){
                            return dir_status[i].NAME;
                        }
                    }
                },
                width: '70px'
            },{
                title:"操作",
                template:function(data){
                    var dirId = data.dirId;
                    var html = "<a class='btn btn-default' style='margin-left: 10px;' onclick='showDetail(\""+dirId+"\")'>查看</a>";
                    if(data.dirStatus==1||data.dirStatus==3){
                        var changeStatus = "2";
                        html += "<a class='btn btn-primary'  style='margin-left: 10px;' onclick='updateStatus(\""+dirId+"\","+changeStatus+")'>启用</a>";
                    }else if(data.dirStatus==2||data.dirStatus==5){
                        var changeStatus = "3";
                        html += "<a class='btn btn-danger'  style='margin-left: 10px;' onclick='updateStatus(\""+dirId+"\","+changeStatus+")'>停用</a>";
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
                    "page": page + "",
                    "rows": resourceDirListGrid.rows
                },
                paramObj: resourceDirListGrid.pageParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                resourceDirListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxPost("resourceContentMgr/resourceDirList", param, successFun, null, false, $("#resourceDirList"));
        },
        pagerCallBack: function (e) {
            resourceDirListGrid.refreshDatas(e.index);
        },
        getGridSelectValue: function () {
            var selectEdit = resourceDirListGrid.getInst().getSelect();
            return selectEdit;

        },
        inst: {},
        getInst: function () {
            if (resourceDirListGrid.inst) {
                resourceDirListGrid.inst = new wandaComp.wandaGrid("resourceDirListGrid", resourceDirListGrid.gridColums, true, this.pagerCallBack);
            }
            return resourceDirListGrid.inst;
        },
        init: function () {
            resourceDirListGrid.getInst().init();
            resourceDirListGrid.pageParam={};
            resourceDirListGrid.refreshDatas();
        }
    };

    //资源目录查询按钮
    var resourceDirList_dirSearch = {
        init: function () {
            $("#resourceDirList_dirSearch").click(function() {
                $("#resourceDir_tree").empty();
                resourceDirList_tree.params={
                    "dirName":$("#resourceDirList_dirName").val()
                }
                resourceDirList_tree.init();
            });
        }
    };

    //加载资源目录树
    var resourceDirList_tree = {
        wandaTreeView: "",
        queryDataCall: "",
        params: {
            "dirName": $("#resourceCfgList_dirName").val()
        },
        querySuccessFun: function(data) {
            var treeList = data.datas;
            resourceDirList_tree.queryDataCall(data.datas);
        },
        queryErrorFun: function() {
            common.jqConfirm.alert({
                title: 0,
                content: "加载失败！"
            });
        },
        selectValue:{

        },
        onSelect: function(dataItem) {
            resourceDirList_tree.selectValue={
                "currDirId" : dataItem.dirId,
                "currDirName" : dataItem.dirName,
                "dirLevel" : dataItem.dirLevel,
                "hadFolder": dataItem.hadFolder
            }
            resourceDirListGrid.pageParam={
                "pDirId": dataItem.dirId
            }
            resourceDirListGrid.refreshDatas();
        },
        queryData: function(id, fun) {
            resourceDirList_tree.queryDataCall = fun;
            resourceDirList_tree.params.dirId = id;
            common.ajaxPost("resourceContentMgr/loadContentTree", resourceDirList_tree.params, resourceDirList_tree.querySuccessFun, resourceDirList_tree.queryErrorFun, null, $("#resourceDirList"));
        },
        option: null,
        init: function() {
            resourceDirList_tree.option = {
                childKey: "children",
                textKey: "dirName",
                noCache: false,
                treeDom: $("#resourceDir_tree"),
                queryKey: "dirId",
                openKey:"open",
                checkKey:"checked",
                queryData: resourceDirList_tree.queryData,
                onSelect: resourceDirList_tree.onSelect,
                template: "<span style='color: #= item.color #'>#= item.orgName # </span>"
            };
            resourceDirList_tree.wandaTreeView = new wandaComp.wandaTreeView(resourceDirList_tree.option);
            resourceDirList_tree.wandaTreeView.init();
            resourceDirList_tree.selectValue={};
        },
        reloadTree: function(dirId) {
            resourceDirList_tree.wandaTreeView.refresh(dirId);
        }
    };
    //初始化资源状态字典项
    var initDirStatus ={
        init:function(){
            var successFun = function(data){
                dir_status = data.datas;
            }
            var param = {
                "paramObj": {
                    "type": "DIR_STATUS"
                }
            };
            common.ajaxGet("dictionary/dicList", param, successFun, null, false, null);
        }
    };

    //初始化状态搜索下拉框
    var initDirStatusDownList = {
        getInst: function () {
            return $("#resourceDirListSearch_dirStatus").data("wandaDropDownList");
        },
        setValue: function (value) {
            initDirStatusDownList.getInst().value(value);
        },
        init:function(){
            $("#resourceDirListSearch_dirStatus").wandaDropDownList({
                dataSource: [
                    { NAME: "请选择",
                        CODE:""
                    }
                ],
                dataTextField: "NAME",
                dataValueField: "CODE"
            });
            var dropdownlist = $("#resourceDirListSearch_dirStatus").data("wandaDropDownList");
            for(var i=0;i<dir_status.length;i++){
                if(dir_status[i].CODE!=4){
                    dropdownlist.dataSource.add({ NAME: dir_status[i].NAME,CODE:dir_status[i].CODE });
                }
            }
        }
    };
    //初始化列表查询按钮
    var resourceDirListSearchBtn = {
        init: function () {
            $("#resourceDirList_searchBtn").click(function() {
                var dirName = $("#resourceDirListSearch_dirName").val();
                var dirStatus = $("#resourceDirListSearch_dirStatus").val();
                resourceDirListGrid.pageParam={
                    "dirName":dirName,
                    "dirStatus":dirStatus
                }
                resourceDirListGrid.refreshDatas();
            });
        }
    };

    //增加按钮
    var resourceDirList_addBtn = {
        inst: {},
        optionObj: {
            minWidth: 400,
            minHeight: 250,
            maxWidth: 500,
            maxHeight: "",
            title: "新增资源子目录",
            content: "biz/resourceMgr/resourceDirMgr/html/resourceDir_popup.html"
        },
        getInst: function () {
            if (resourceDirList_addBtn.inst) {
                resourceDirList_addBtn.inst = new wandaComp.wandaWindow("resourceDirList_addBtn", "resourceDir_popup", resourceDirList_addBtn.optionObj);
            }
            return resourceDirList_addBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#resourceDir_popup").data("wandaWindow");
            plusPopup.close();
            resourceDirListGrid.refreshDatas();
            resourceDirList_tree.reloadTree("");
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#resourceDir_popup").data("wandaWindow");
            plusPopup.close();
        },

        init: function () {
            resourceDirList_addBtn.getInst().init(function () {
                var treeData = resourceDirList_tree.selectValue;
                var dataItem = {};
                var a = treeData["currDirId"];
                if( a==undefined ){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择一条资源目录！"
                    });
                    return false;
                };
                dataItem = treeData;
                if(dataItem["hadFolder"]==0){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "该资源目录没有设置子目录,无法新增子资源目录！"
                    });
                    return false;
                }

                var modeParam={
                    divModel:"addDir",
                    pDirId:dataItem["currDirId"],
                    dirLevel:dataItem["dirLevel"]
                };
                common.initExeByAttr("resourceDir_popup", "opt='cancel'", function () {
                    resourceDir_popup.init("resourceDir_popup",modeParam);
                });
                resourceDirList_addBtn.getInst().callBack("opt='submit'", resourceDirList_addBtn.submitBtnCallBack);
                resourceDirList_addBtn.getInst().callBack("opt='cancel'", resourceDirList_addBtn.cancelBtnCallBack);
                resourceDirList_addBtn.getInst().callBack("opt='enable'", resourceDirList_addBtn.submitBtnCallBack);
            });

        }
    };

    //新增根目录按钮
    /*var resourceDirList_addRootDirBtn = {
        inst: {},
        optionObj: {
            minWidth: 400,
            minHeight: 250,
            maxWidth: 500,
            maxHeight: "",
            title: "新增资源目录根目录",
            content: "biz/resourceMgr/resourceDirMgr/html/resourceDir_popup.html"
        },
        getInst: function () {
            if (resourceDirList_addRootDirBtn.inst) {
                resourceDirList_addRootDirBtn.inst = new wandaComp.wandaWindow("resourceDirList_addRootDirBtn", "resourceDir_popup", resourceDirList_addRootDirBtn.optionObj);
            }
            return resourceDirList_addRootDirBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#resourceDir_popup").data("wandaWindow");
            plusPopup.close();
            resourceDirListGrid.refreshDatas();
            resourceDirList_tree.reloadTree("");
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#resourceDir_popup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            resourceDirList_addRootDirBtn.getInst().init(function () {
                var modeParam={
                    divModel:"addRootDir",
                    pDirId:"0",
                    dirLevel:dirLevel
                };
                common.initExeByAttr("resourceDir_popup", "opt='cancel'", function () {
                    resourceDir_popup.init("resourceDir_popup",modeParam);
                });

                // dataSource_popup.init(dataSourceTypeDic,dataBaseTypeDic,dataBaseVersionDic,"dataSource_add",modeParam);
            });
            resourceDirList_addRootDirBtn.getInst().callBack("opt='submit'", resourceDirList_addRootDirBtn.submitBtnCallBack);
            resourceDirList_addRootDirBtn.getInst().callBack("opt='cancel'", resourceDirList_addRootDirBtn.cancelBtnCallBack);
            resourceDirList_addRootDirBtn.getInst().callBack("opt='enable'", resourceDirList_addRootDirBtn.submitBtnCallBack);
        }
    };*/

    //初始化删除按钮
    var resourceDirList_delBtn = {
        //获取选中的记录值
        gridSelectValue: function () {
            var selectEdit = resourceDirListGrid.getInst().getSelect();
            return selectEdit;
        },
        //初始化单击事件的操作
        init: function () {
            $("#resourceDirList_delBtn").on("click", function () {
                var selectDelete = resourceDirListGrid.getGridSelectValue();
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
                        deletArray.push(selectDelete[i]["dirId"]);
                        if(selectDelete[i]["dirStatus"]=="5" || selectDelete[i]["dirStatus"]=="2"){
                            common.jqConfirm.alert({
                                title: 0,
                                content: "启用或发布状态下的资源目录，无法进行删除操作！"
                            });
                            return false;
                        }
                    }
                   // if(deletArray.length==0){
                   //     var param = {"dirIds":[currDirId]};
                   // }else{
                   //     var param = {"dirIds": deletArray};
                   // }
                    var param = {"dirIds":deletArray};
                    var successFun = function (data) {
                        common.jqConfirm.alert({
                            title: 1,
                            content: "操作成功！",
                            call: function () {
                                resourceDirListGrid.refreshDatas();
                                resourceDirList_tree.reloadTree("");
                            }
                        });
                    };
                    common.jqConfirm.confirm({
                        content: "将删除选中目录及目录下所有资源目录，是否确认删除？",
                        call: function () {
                            common.ajaxPost("resourceContentMgr/deleteResourceDir", param, successFun, null, null, null);
                        }
                    });
                }
            });
        }
    };

    //启用/停用按钮
    var resourceDir_updateStatus = {
        init:function(){
            $('#resourceDir_updateStatus').on('click',function(){
                var successFun = function(data){
                    common.jqConfirm.alert({
                        title: 1,
                        content:data["msg"],
                        call: function () {
                            resourceDirListGrid.refreshDatas();
                        }
                    });
                }
                var param = {
                    dirId:doDirId,
                    dirStatus:doDirStatus
                }
                var content = "是否确认修改资源目录？";
                if(doDirStatus=="2"){
                    content = "将启用该目录及其对应的上级目录，是否确认启用？"
                }else if(doDirStatus=="3"){
                    content = "将停用该目录及目录下所有资源目录，是否确认停用？"
                }
                common.jqConfirm.confirm({
                    content: content,
                    call: function () {
                        common.ajaxPost("resourceContentMgr/updateResourceDirStatus", param, successFun, null, null, null);
                    }

                });
            });
        }
    };
    //查看按钮
    var resourceDir_detailBtn = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 800,
            maxHeight: "",
            title: "查看资源目录信息",
            content: "biz/resourceMgr/resourceDirMgr/html/resourceDir_popup.html"
        },
        getInst: function () {
            if (resourceDir_detailBtn.inst) {
                resourceDir_detailBtn.inst = new wandaComp.wandaWindow("resourceDir_detailBtn", "resourceDir_popup", resourceDir_detailBtn.optionObj);
            }
            return resourceDir_detailBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#resourceDir_popup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#resourceDir_popup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            resourceDir_detailBtn.getInst().init(function () {
                var modeParam={
                    divModel:"detailDir",
                    dirId:doDirId
                }
                common.initExeByAttr("resourceDir_popup", "opt='cancel'", function () {
                    resourceDir_popup.init("resourceDir_popup",modeParam);
                });
                resourceDir_detailBtn.getInst().callBack("opt='submit'", resourceDir_detailBtn.cancelBtnCallBack);
                resourceDir_detailBtn.getInst().callBack("opt='cancel'", resourceDir_detailBtn.cancelBtnCallBack);
                resourceDir_detailBtn.getInst().callBack("opt='enable'", resourceDir_detailBtn.cancelBtnCallBack);
            });

        }
    };

    //修改弹出框
    var resourceDirList_updateBtn = {
        inst: {},
        optionObj: {
            minWidth: 400,
            minHeight: 250,
            maxWidth: 500,
            maxHeight: "",
            title: "修改资源目录",
            content: "biz/resourceMgr/resourceDirMgr/html/resourceDir_popup.html"
        },
        getInst: function () {
            if (resourceDirList_updateBtn.inst) {
                resourceDirList_updateBtn.inst = new wandaComp.wandaWindow("resourceDirList_updateBtn", "resourceDir_popup", resourceDirList_updateBtn.optionObj);
            }
            return resourceDirList_updateBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#resourceDir_popup").data("wandaWindow");
            plusPopup.close();
            resourceDirListGrid.refreshDatas();
            resourceDirList_tree.reloadTree("");
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#resourceDir_popup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            resourceDirList_updateBtn.getInst().init(function () {
                var modeParam = {};
                var selectDelete = resourceDirListGrid.getGridSelectValue();
                if ( selectDelete.length!=1){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择一条数据！"
                    });
                    return false;
                } else {
                    //用于存放已勾选的应用id

                    var id = "";
                    for (var i = 0; i < selectDelete.length; i++) {
                        id = selectDelete[i]["dirId"];
                        if(selectDelete[i]["dirStatus"]=="5" || selectDelete[i]["dirStatus"]=="2"){
                            common.jqConfirm.alert({
                                title: 0,
                                content: "启用或发布状态下的资源目录，无法进行修改操作！"
                            });
                            return false;
                        }
                    }
                    modeParam = {
                                "dirId": id,
                                "divModel":"updateDir"
                                 };
                    common.initExeByAttr("resourceDir_popup", "opt='cancel'", function () {
                        resourceDir_popup.init("resourceDir_popup", modeParam);
                    });
                }
                resourceDirList_updateBtn.getInst().callBack("opt='submit'", resourceDirList_updateBtn.submitBtnCallBack);
                resourceDirList_updateBtn.getInst().callBack("opt='cancel'", resourceDirList_updateBtn.cancelBtnCallBack);
                resourceDirList_updateBtn.getInst().callBack("opt='enable'", resourceDirList_updateBtn.submitBtnCallBack);
                });

        }
    };

    var init = function () {
        wandaComp.elementControl($("#resourceDirList"));
        initDirStatus.init();
        resourceDirList_tree.params={};
        resourceDirList_tree.init();
        resourceDirListGrid.init();
        resourceDirList_dirSearch.init();
        initDirStatusDownList.init();
        resourceDirListSearchBtn.init();
        resourceDirList_addBtn.init();
        // resourceDirList_addRootDirBtn.init();
        resourceDirList_delBtn.init();
        resourceDir_updateStatus.init();
        resourceDir_detailBtn.init();
        resourceDirList_updateBtn.init();
    };
    return {
        init: init
    }
});

var doDirId="" ;
var doDirStatus="";
//查看
function showDetail(id){
    doDirId = id;
    $("#resourceDir_detailBtn").trigger("click");
};

//
function updateStatus(id,status){
    doDirId = id;
    doDirStatus = status;
    $("#resourceDir_updateStatus").trigger("click");
}