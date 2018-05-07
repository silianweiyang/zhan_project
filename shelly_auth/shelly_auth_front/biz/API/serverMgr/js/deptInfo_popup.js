define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {


    var orgTreeview = function (root) {
        var wandaTreeView, dom;
        this.orgInfo_popup_queryOrgBtn = function () {
            $("#" + root).find("#orgInfo_popup_queryOrg").on("click", function () {
                var orgName = $("#" + root).find("#orgInfo_popup_orgSerchPara").val();
                var params = {
                    "orgName": orgName,
                    "state": "0"
                };

                var successFun = function (data) {
                    var orgs = data.datas;
                    if (orgs instanceof Array) {
                        for (var i = 0; i < orgs.length; i++) {
                            var state = orgs[i].isTarget;
                            /*  if(state!="true"){
                             orgs[i]["color"]="" ;
                             }else{
                             orgs[i]["color"]="blue" ;
                             }*/
                        }
                    }
                    wandaTreeView.setDataSource(dom, orgs);
                };
                var errorFun = function () {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "加载失败！"
                    });
                };
                common.ajaxGet("sysManagement/org/queryGradeOrgTreeByName", params, successFun, errorFun, null, $("#orgInfoMgr_leftTree"));

            })
        };

        this.rootId = root;
        this.wandaTreeView;

        this.params = {
            "orgId": "",
            "state": "0"
        };
        this.onSelect = function (dataItem) {

            var selected = {"orgId": dataItem.orgId, "orgName": dataItem.orgName};
            $("#" + root).find("#orgInfo_popup_selected").val(JSON.stringify(selected));
        };

        this.queryData = function (id, fun) {
            var queryDataCall = fun;
            var orgName = $("#" + root).find("#orgInfo_popup_orgSerchPara").val();
            var params = {
                "orgName": orgName,
                "orgId": id,
                "state": "0"
            };
            var querySuccessFun = function (data) {
                var orgs = data.datas;
                if (orgs instanceof Array) {
                    for (var i = 0; i < orgs.length; i++) {
                        var state = orgs[i].isTarget;
                        /* if(state!="true"){
                         orgs[i]["color"]="" ;
                         }else{
                         orgs[i]["color"]="blue" ;
                         }*/
                    }
                }

                queryDataCall(orgs);
            };
            var queryErrorFun = function () {
                common.jqConfirm.alert({
                    title: 0,
                    content: "加载失败！"
                });
            };
            common.ajaxGet("sysManagement/org/queryGradeOrgTreeByName", params, querySuccessFun, queryErrorFun, null, $("#orgInfoMgr_leftTree"));
        };
        this.init = function () {
            var user = common.getCurrentUser();
            var option = {
                childKey: "childOrgs",
                textKey: "orgName",
                synchronized: true
            };
            option["treeDom"] = $("#" + this.rootId).find("#orgTreeview");
            option["selectEve"] = this.onSelect;
            option["queryData"] = this.queryData;
            option["queryKey"] = "orgId";
            option["initParam"] = "";
            option["template"] = "<span style='color: #= item.color #'>#= item.orgName # </span>";

            this.wandaTreeView = new wandaComp.wandaTreeView(option);
            this.wandaTreeView.init();
            wandaTreeView = this.wandaTreeView;
            dom = $("#" + this.rootId).find("#orgTreeview");
            this.orgInfo_popup_queryOrgBtn();
        };
        this.reloadTree = function () {
            this.wandaTreeView.refresh("", $("#" + this.rootId).find("#orgTreeview"));
        };

        this.selected = function (rootId) {
            return $("#" + rootId).find("#orgInfo_popup_selected")
        }

    };

    return {
        init: orgTreeview
    }

});

