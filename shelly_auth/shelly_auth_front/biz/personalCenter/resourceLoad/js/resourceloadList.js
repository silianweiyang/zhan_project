define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/personalCenter/resourceLoad/js/resourceloadPopup"], function ($, common, compont, wandaComp, wandaCompR, resourceloadPopup) {

    var statusTypeDic =[{"NAME":"生成中","CODE":"1"},{"NAME":"已生成","CODE":"2"},{"NAME":"已失效","CODE":"3"}];
    //列表Grid
    var serverListGrid = {
        rows: "10",
        pagerParam: {
        },
        gridColums: [
            {
                field: "dataName",
                title: "订阅数据包名称"
            },
            {
                title: "描述",
                field:"downloadDesc"
            },
            {
                title:"订阅时间",
                template:function(data){
                    var t= new Date(data.subscripTime);
                    return t.toLocaleDateString().replace(/\//g, "-") + " " + t.toTimeString().substr(0, 8)
                }
            },
            {
                title: "截止时间",
                template: function (data) {
                    var t = new Date(data.loseTime);
                    return t.toLocaleDateString().replace(/\//g, "-") + " " + t.toTimeString().substr(0, 8)
                }

            },
            {
                title:"状态",
                template:function(data){
                    var gatherType = data.downloadStatus;
                    if(gatherType==null || gatherType==undefined) gatherType="";
                    for(var i =0 ;i<statusTypeDic.length;i++){
                        if(gatherType==statusTypeDic[i].CODE){
                            return statusTypeDic[i].NAME;
                        }
                    }
                }
            },
            {
                title:"操作",
                template:function(data){
                    var id = data["id"];
                    var html = "";
                    html="<a class='btn btn-default' style='margin-left: 10px; ' onclick='showDetail("+id+")'>查看</a>";
                    if(data.downloadStatus=2){
                        var href=common.baseUrl+'resourcedownload/download?fileId='+id;
                        html+="<a class='btn btn-primary' style='margin-left: 10px;' href='"+href+"' target='_blank'>下载</a>";
                    }
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
            common.ajaxPost("resourcedownload/list", param, successFun, null, null, $("#resourceloadList"));
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
                serverListGrid.inst = new wandaComp.wandaGrid("serverListGrid", serverListGrid.gridColums, true, this.pagerCallBack);
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
                    "dataName": $("#searchDataName").val()
                }
                serverListGrid.refreshDatas();
            });
        }
    }

    //查看按钮
    var serverList_detailBtn = {
        inst: {},
        optionObj: {
            minWidth: 400,
            minHeight:400,
            maxWidth: 600,
            maxHeight: 550,
            title: "查看资源订阅明细",
            content: "biz/personalCenter/resourceLoad/html/resourceloadPopup.html"
        },
        getInst: function () {
            if (serverList_detailBtn.inst) {
                serverList_detailBtn.inst = new wandaComp.wandaWindow("serverList_detailBtn", "resourceLoad_add", serverList_detailBtn.optionObj);
            }
            return serverList_detailBtn.inst;
        },
        getGridSelectValue: function () {
        },
        setSubPageValue: function () {
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#resourceLoad_add").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            serverList_detailBtn.getInst().init(function () {

                resourceloadPopup.init(fileId);
                $("#see_auth_cancel_btn").click(serverList_detailBtn.cancelBtnCallBack);
            });
        }
    };

    var serverList_DownLoadBtn = {

        download: function (id) {
            var rootPath = common.baseUrl;//getRootPaht()自定义的方法，自行拼装
            if(id){
                if($("#data_resdown")) $("#data_resdown").empty();
                var form=$("<form id='data_resdown'>");//定义一个form表单
                form.attr("style","display:none");
                form.attr("target","");
                form.attr("method","post");
                form.attr("action",rootPath+'resourcedownload/download');
                var fileInput=$("<input>");
                fileInput.attr("type","hidden");
                fileInput.attr("id","data_"+id);//设置属性的名字
                fileInput.attr("name","fileId");//设置属性的名字
                fileInput.attr("value",id);//设置属性的值
                $("body").append(form);//将表单放置在web中
                form.append(fileInput);
                form.submit();//表单提交
            }
        },
        init: function () {
            $("#serverList_downLoadBtn").click(function(){
                serverList_DownLoadBtn.download(fileId);
            });
        }
    };

    var init = function () {
        wandaComp.elementControl($("#resourceloadList"));
        userList_searchBtn.init();
        serverListGrid.init();
        serverList_detailBtn.init();
        serverList_DownLoadBtn.init();
    };
    return {
        init: init
    }
});

var fileId="" ;

//查看详情
function showDetail(id) {
    fileId = id;
    $("#serverList_detailBtn").trigger("click");
}

function downLoad(obj,id){
    fileId = id;
    $("#serverList_downLoadBtn").trigger("click");
}


