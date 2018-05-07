define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/resourceMgr/resourceDirPubMgr/js/resourceDirPub_popup"], function ($, common, compont, wandaComp, wandaCompR,resourceDirPub_popup) {
    var dir_status = {};
    var currPubDirId = "";
    var currPubDirName = "";
    //资源目录列表初始化
    var resourceDirPubListGrid = {
        rows: "10",
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
                    var html = "<a class='btn btn-default' style='margin-left: 10px;' onclick='showPubDirDetail(\""+dirId+"\")'>查看</a>";
                    if(data.dirStatus==5){
                        var changeStatus = "3";
                        var hadFolder = data.hadFolder;
                        html += "<a class='btn btn-danger'  style='margin-left: 10px;' onclick='updateDirPubStatus(\""+dirId+"\","+changeStatus+","+hadFolder+")'>取消</a>";
                    }else if(data.dirStatus==2){
                        var changeStatus = "5";
                        var hadFolder = data.hadFolder;
                        html += "<a class='btn btn-primary'  style='margin-left: 10px;' onclick='updateDirPubStatus(\""+dirId+"\","+changeStatus+","+hadFolder+")'>发布</a>";
                    }
                    return html;
                }
            }],
        paramObj:{},
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    "page": page + "",
                    "rows": resourceDirPubListGrid.rows
                },
                paramObj:resourceDirPubListGrid.paramObj
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                resourceDirPubListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxPost("resourceContentMgr/resourceDirPubList", param, successFun, null, false, $("#resourceDirPubList"));
        },
        pagerCallBack: function (e) {
            resourceDirPubListGrid.refreshDatas(e.index);
        },
        getGridSelectValue: function () {
            var selectEdit = resourceDirPubListGrid.getInst().getSelect();
            return selectEdit;

        },
        inst: {},
        getInst: function () {
            if (resourceDirPubListGrid.inst) {
                resourceDirPubListGrid.inst = new wandaComp.wandaGrid("resourcePubDirListGrid", resourceDirPubListGrid.gridColums, true, this.pagerCallBack);
            }
            return resourceDirPubListGrid.inst;
        },
        init: function () {
            resourceDirPubListGrid.getInst().init();
            resourceDirPubListGrid.paramObj={};
            resourceDirPubListGrid.refreshDatas();
        }
    };
    //初始化列表查询按钮
    var resourceDirPubList_searchBtn = {
        init: function () {
            $("#resourceDirPubList_searchBtn").click(function() {
                var dirName = $("#resourceDirListSearch_dirName").val();
                resourceDirPubListGrid.paramObj={
                    "dirName":dirName
                }
                resourceDirPubListGrid.refreshDatas();
            });
        }
    };
    //资源目录树查询按钮
    var resourceDirTreeList_dirSearch = {
        init: function () {
            $("#resourceDirTreeList_dirSearch").click(function() {
                $("#resourcePubDir_tree").empty();
                resourcePubDir_tree.params={
                    "dirName":$("#resourceDirPubTree_dirName").val()
                }
                resourcePubDir_tree.init();
            });
        }
    };
    //加载资源目录树
    var resourcePubDir_tree = {
        wandaTreeView: "",
        queryDataCall: "",
        querySuccessFun: function(data) {
            resourcePubDir_tree.queryDataCall(data.datas);
        },
        params:{
            "dirName":$("#resourceDirPubTree_dirName").val()
        },
        queryErrorFun: function() {
            common.jqConfirm.alert({
                title: 0,
                content: "加载失败！"
            });
        },
        onSelect: function(dataItem) {
            resourceDirPubListGrid.paramObj={
                "pDirId":dataItem["dirId"]
            }
            resourceDirPubListGrid.refreshDatas();
        },
        queryData: function(id, fun) {
            resourcePubDir_tree.queryDataCall = fun;
            resourcePubDir_tree.params.dirId = id;
            common.ajaxPost("resourceContentMgr/loadPubContentTree", resourcePubDir_tree.params, resourcePubDir_tree.querySuccessFun, resourcePubDir_tree.queryErrorFun, null, $("#resourceDirPubList"));
        },
        option: null,
        init: function() {
            resourcePubDir_tree.option = {
                childKey: "children",
                textKey: "dirName",
                noCache: false,
                treeDom: $("#resourcePubDir_tree"),
                queryKey: "dirId",
                openKey:"open",
                checkKey:"checked",
                queryData: resourcePubDir_tree.queryData,
                onSelect: resourcePubDir_tree.onSelect,
                template: "<span style='color: #= item.color #'>#= item.orgName # </span>"
            };
            resourcePubDir_tree.wandaTreeView = new wandaComp.wandaTreeView(resourcePubDir_tree.option);
            resourcePubDir_tree.wandaTreeView.init();
        },
        reloadTree: function(dirId) {
            resourcePubDir_tree.wandaTreeView.refresh(dirId);
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

    //查看
    var resourceDirPubList_detailBtn = {
        inst: {},
        optionObj: {
            minWidth: 400,
            minHeight: 250,
            maxWidth: 500,
            maxHeight: "",
            title: "查看资源目录信息",
            content: "biz/resourceMgr/resourceDirPubMgr/html/resourceDirPub_popup.html"
        },
        getInst: function () {
            if (resourceDirPubList_detailBtn.inst) {
                resourceDirPubList_detailBtn.inst = new wandaComp.wandaWindow("resourceDirPubList_detailBtn", "resourceDirPub_popup", resourceDirPubList_detailBtn.optionObj);
            }
            return resourceDirPubList_detailBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        submitBtnCallBack: function () {
            var plusPopup = $("#resourceDirPub_popup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#resourceDirPub_popup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            resourceDirPubList_detailBtn.getInst().init(function () {
                var modeParam={
                    dirId:doPubDirId
                }
                common.initExeByAttr("resourceDirPub_popup", "opt='cancel'", function () {
                    resourceDirPub_popup.init("resourceDirPub_popup",modeParam);
                });
            });
            resourceDirPubList_detailBtn.getInst().callBack("opt='submit'", resourceDirPubList_detailBtn.submitBtnCallBack);
            resourceDirPubList_detailBtn.getInst().callBack("opt='cancel'", resourceDirPubList_detailBtn.cancelBtnCallBack);
        }
    };

    //列表发布或取消按钮
    var resourceDirPubList_pubOrCancelBtn = {
        init:function(){
            $('#resourceDirPubList_pubOrCancelBtn').on('click',function(){
                var statuFlag = true;
                if(statuFlag){
                    var successFun = function(data){
                        common.jqConfirm.alert({
                            title: 1,
                            content:data["msg"],
                            call: function () {
                                resourceDirPubListGrid.refreshDatas();
                            }
                        });
                    }
                    var idArray = [];
                    idArray.push(doPubDirId);
                    var param = {
                        ids:idArray,
                        dirStatus:doPubDirStatus+''
                    }
                    var content = getContent(doPubDirId,doPubDirStatus,doPubHadFolder);
                    common.jqConfirm.confirm({
                        content: content,
                        call: function () {
                            common.ajaxPost("resourceContentMgr/pubOrCancelResourceDir", param, successFun, null, null, null);
                        }
                    });
                };

            });
        }
    };
    //获取提示信息
    var getContent = function(dirId,dirStatus,hadFolder){
        var content = "";
        if(hadFolder=="1"){//有子目录时判断是否有子目录信息
            var flag = false;
            var param = {
                "dirId":dirId
            }
            var successFun = function(data){
                var dirs = data.datas;
                if(dirs.length>0){
                    if(dirStatus=="3"){
                        content="检测到该目录下有子目录，将取消发布其所有子目录，是否确认取消发布？";
                    }else if(dirStatus=="5"){
                        content="将发布该目录及其上级目录，是否确认发布？"
                    }
                }else{
                    if(dirStatus=="3"){
                        content="是否确认取消发布？";
                    }else if(dirStatus=="5"){
                        content="将发布该目录及其上级目录，是否确认发布？"
                    }
                }
            }
            common.ajaxPost("resourceContentMgr/getChildDirById",param,successFun,null,false,null);
        }else if(hadFolder=="0"){
            if(dirStatus=="3"){
                content="是否确认取消发布？";
            }else if(dirStatus=="5"){
                content="将发布该目录及其上级目录，是否确认发布？"
            }
        }
        return content;
    };

    //批量发布按钮
    var resourceDirPubList_pubBtn = {
        init:function(){
            $('#resourceDirPubList_pubBtn').on('click',function(){
                var gridSelects = resourceDirPubListGrid.getGridSelectValue();
                if(gridSelects.length < 1 ){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请先选择资源目录！"
                    });
                    return false;
                }
                var selectArray = [];//用来存放选择的行
                for (var i = 0; i < gridSelects.length; i++) {
                    selectArray.push(gridSelects[i]["dirId"]);
                    if(gridSelects[i]["dirStatus"]=="5"){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "已发布状态的资源目录，无法再次进行发布操作！"
                        });
                        return false;
                    }
                }
                var successFun = function(data){
                    var title = 0;
                    if(data["msg"]=="发布成功！" || data["msg"]=="取消成功！"){
                        title=1;
                    }
                    common.jqConfirm.alert({
                        title: title,
                        content:data["msg"],
                        call: function () {
                            resourceDirPubListGrid.refreshDatas();
                            $("#resourcePubDir_tree").empty();
                            resourcePubDir_tree.init();
                        }
                    });
                }
                var param = {
                    "dirStatus":"5",
                    "ids":selectArray
                }
                common.jqConfirm.confirm({
                    content: "将发布选中目录及其上级目录，是否确认发布？",
                    call: function () {
                        common.ajaxPost("resourceContentMgr/batchPubOrCancelResourceDirs", param, successFun, false, null, null);
                    }
                });
            });
        }
    };
   //批量取消按钮
    var resourceDirPubList_CancelBtn = {
        init:function(){
            $('#resourceDirPubList_CancelBtn').on('click',function(){
                var gridSelects = resourceDirPubListGrid.getGridSelectValue();
                if(gridSelects.length < 1 ){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请先选择资源目录！"
                    });
                    return false;
                }
                var selectArray = [];//用来存放选择的行
                for (var i = 0; i < gridSelects.length; i++) {
                    selectArray.push(gridSelects[i]["dirId"]);
                }
                var successFun = function(data){
                    common.jqConfirm.alert({
                        title: 1,
                        content:data["msg"],
                        call: function () {
                            resourceDirPubListGrid.refreshDatas();
                            $("#resourcePubDir_tree").empty();
                            resourcePubDir_tree.init();
                        }
                    });
                }
                var param = {
                    "dirStatus":"3",
                    "ids":selectArray
                }
                common.jqConfirm.confirm({
                    content: "将取消发布选中目录及其下所有子目录，是否确认取消发布？",
                    call: function () {
                        common.ajaxPost("resourceContentMgr/batchPubOrCancelResourceDirs", param, successFun, false, null, null);
                    }
                });
            });
        }
    };
    var init = function () {
        wandaComp.elementControl($("#resourceDirPubList"));
        initDirStatus.init();
        resourcePubDir_tree.params={};
        resourceDirPubListGrid.init();
        resourcePubDir_tree.init();
        resourceDirTreeList_dirSearch.init();
        resourceDirPubList_searchBtn.init();
        resourceDirPubList_detailBtn.init();
        resourceDirPubList_pubOrCancelBtn.init();
        resourceDirPubList_pubBtn.init();
        resourceDirPubList_CancelBtn.init();
    };
    return {
        init: init
    }
});

var doPubDirId="" ;
var doPubDirStatus="";
var doPubHadFolder = "";
//查看
function showPubDirDetail(id){
    doPubDirId = id;
    $("#resourceDirPubList_detailBtn").trigger("click");
};

//
function updateDirPubStatus(id,status,hadFolder){
    doPubDirId = id;
    doPubDirStatus = status;
    doPubHadFolder = hadFolder;
    $("#resourceDirPubList_pubOrCancelBtn").trigger("click");
}