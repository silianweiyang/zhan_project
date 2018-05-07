var router;
require.config({
    baseUrl: "",
    paths: {
        "jquery": "lib/wandaui/js/jquery.min",
        "nicescroll": "lib/jquery.nicescroll.min",
        "wanda": "lib/wandaui/js/wanda.all.min",
        "wandaCulture": "lib/wandaui/js/cultures/wanda.culture.zh-CN.min",
        "main": "lib/main",
        "common": "lib/common",
        "wandaComp": "lib/wandaComp",
        "wandaCompR": "lib/wandaCompReUse",
        /*"myDatePicker": "lib/myDatePicker",*/
        "date_time_Picker": "lib/date_time_Picker",
        "jqConfirm": "lib/jqconfirm/jquery-confirm.min",
        "echarts": 'lib/echart3/echarts.min',
        "compont":"lib/commonCompont",
        "jqueryCorner":"lib/jquery.corner",
        "jqZtree":"lib/ztree/js/jquery.ztree.all.min",
    },
    shim: {
        jqConfirm: {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        wanda: {
            deps: ['jquery'],
            exports: 'wanda'
        },
        nicescroll: {
            deps: ['jquery'],
            exports: 'nicescroll'
        },
        jqueryCorner: {
            deps: ['jquery'],
            exports: 'jqueryCorner'
        }
    }
});
require(["jquery", "common", "wandaComp", "wanda"], function ($, common, wandaComp) {
    var longinInit = function () {
        $("#errorinfo").text("");
        $("#downTool").attr("href", common.baseUrl + "download/fileDownload?fileName=chrome");
      /*  $("#accountCode").on("change", function () {
            var orgDom = $("#fromOrg");
            orgDom.html("");
            var accountCode = $("#accountCode").val();
            var param = {"accountCode": accountCode};
            var successFun = function (data) {
                $("#errorinfo").text("");
                var orgs = data.datas;
                if (orgs) {
                    for (var i = 0; i < orgs.length; i++) {
                        var opt = $("<option/>");
                        opt.val(orgs[i]["orgId"]);
                        opt.text(orgs[i]["orgName"]);
                        orgDom.append(opt);
                    }
                }
            };
            var errorFun = function (data) {
                $("#errorinfo").text(data["returnMsg"])
            };
            common.ajaxGet("sysManagement/org/queryOrgByAccountCode", param, successFun, errorFun, false);
        })*/
    }
    var initFun = function () {
        longinInit();
        $("#signInBtn").on("click", function () {
            var accountCode = $("#accountCode").val();
            var passward = $("#passward").val();
            //var fromOrg = $("#fromOrg").val();
            common.login.signIn(accountCode, passward, "", function (data) {
                var userInfo = data["datas"]["userinfo"];
                if (userInfo) {
                    window.location.href = "index.html";
                }
            }, function (data) {
                $("#errorinfo").text(data["returnMsg"]);
            });
        });

        $("html").keydown(function (e) {
            if ((e || event).keyCode == 13)
                $("#signInBtn").trigger("click");
        });


    };
    common.initExe("login", initFun);


});
