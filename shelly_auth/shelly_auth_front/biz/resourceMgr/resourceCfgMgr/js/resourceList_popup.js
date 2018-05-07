define(["jquery", "common", "compont", "wandaComp", "wandaCompR"], function ($, common, compont, wandaComp, wandaCompR) {

    //资源目录列表Grid
    var resourceCfgListGrid = {
        rows: "10",
        pagerParam: {"resStatus":"2"},
        gridColums: [
             {
                field: "resCode",
                title: "资源代码"
            }, {
                field: "resName",
                title: "资源名称"
            },{
                field: "isOpen",
                title: "开放性",
                width: '70px'
            },{
                field: "describe",
                title: "说明"
            },
            {
                title: "操作",
                template:function(data){
                    var resid = data["resId"];
                    var resName = data["resName"];
                    var html = "";
                    html="<a class='btn btn-default' style='margin-left: 10px; ' onclick=\"getSelectValue('"+resid+"','"+resName+"')\" >选择</a>";
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
                resourceCfgListGrid.inst = new wandaComp.wandaGrid("resourceCfgListGrid",  resourceCfgListGrid.gridColums, true, this.pagerCallBack);
            }
            return resourceCfgListGrid.inst;
        },
        init: function () {
            resourceCfgListGrid.getInst().init();
            var _params = common.getRouterParams();
            if (_params == null || _params == ""){
                _params = {
                    "resName": "",
                    "resStatus": "5"
                };
            }

            resourceCfgListGrid.pagerParam = {
                "resName": _params["resName"],
                "resStatus": "5"
            };
            resourceCfgListGrid.refreshDatas();
        }
    };

    //查询按钮
    var resCfgList_searchBtn = {
        init: function () {
            $("#resourceCfgList_searchBtn").click(function () {
                var resName = $("#resourceCfgList_resName").val();
                resourceCfgListGrid.pagerParam = {
                    "resName": resName,
                    "resStatus": "5"
                };
                resourceCfgListGrid.refreshDatas();
            });
        }
    };
    var cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#resPopcancel").unbind("click");
            $("#" + parentIds).find("#resPopcancel").click(function () {
                $("#" + parentIds).find("#resPopcancel").trigger("afterClick");
            });
        }

    };
    var init = function (parentId) {
        wandaComp.elementControl($("#resourceCfgList"));
        resourceCfgListGrid.init();
        resCfgList_searchBtn.init();
        cancelBtn.init(parentId);
    };
    return {
        init: init
    }
});


