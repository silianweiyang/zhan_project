define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/userAuthMgr/js/see_auth_pop"], function ($, common, compont, wandaComp, wandaCompR,seeAuthPop) {
   var seeauthPar = {};
   var authLog_searchBtn = {
       init:function(){
           $('#authLog_searchBtn').on('click',function(){
               var loginName = $('#loginName').val();
               authLogGrid.pagerParam = {
                   "LOGIN_NAME": loginName
               };
               authLogGrid.refreshDatas();
           });
       }
   }

   var authLogGrid = {
	        rows: "10",
	        pagerParam: {},
	        gridColums: [
	            {
	                field: "CREATE_CODE",
	                title: "授权操作人"
	            },{
                    field: "USER_NAME",
                    title: "被授权用户"
                },{
	                field: "DATA_NAME",
	                title: "数据包名称"
	            },{
	                field: "AUTHTIME",
	                title: "授权有效日期"
	            },{
	                field: "CZRQ",
	                title: "操作日期"
	            },{
                    template:function(data){
                        var authId = data['AUTH_ID'];
                        return "<a href='#' class='btn btn-primary' onclick='seeAuthLog("+authId+");'>查看</a>";
                    }, title: "操作", width: "200px"
	            }],
	        refreshDatas: function (index) {
	            var page = "1";
	            if (index) {
	                page = index;
	            }
	            var param = {
	                pageBean: {
	                    page: page + "",
	                    rows: authLogGrid.rows
	                },
	                paramObj: authLogGrid.pagerParam
	            };
	            var successFun = function (data) {
	                var pageBean = data.pageBean;
	                var gridData = new wanda.data.DataSource({
	                    data: data.datas,
	                    pageSize: 10
	                });
                    authLogGrid.getInst().setDataSource(gridData, pageBean);

	            };
	            common.ajaxPost("auth/list", param, successFun, null, null, $("#authLog"));
	        },
	        pagerCallBack: function (e) {
                authLogGrid.refreshDatas(e.index);
	        },
	        inst: {},
	        getInst: function () {
	            if (authLogGrid.inst) {
                    authLogGrid.inst = new wandaComp.wandaGrid("authLogGrid", authLogGrid.gridColums, true, this.pagerCallBack);
	            }
	            return authLogGrid.inst;
	        },
	        init: function () {
                authLogGrid.getInst().init();
                authLogGrid.pagerParam = {
	                "LOGIN_NAME": ""
	            };
                authLogGrid.refreshDatas();
	        }
	    }

   var seeAuthPopWin = {
        inst:{},
        optionObj:{
            minWidth:650,
            minHeight:550,
            maxWidth:650,
            maxHeiht:550,
            title:'授权历史',
            content:'biz/userAuthMgr/html/see_auth_pop.html'
        },
        getInst:function(){
            if(seeAuthPopWin.inst){
                seeAuthPopWin.inst = new wandaComp.wandaWindow("authLog_auth_pop_btn","authLog_auth_pop_div",seeAuthPopWin.optionObj);
            }
            return seeAuthPopWin.inst;
        },
        cancelBtnCallBack:function(){
            var plusPopup = $("#authLog_auth_pop_div").data("wandaWindow");
            plusPopup.close();
        },
        init:function(){
            seeAuthPopWin.getInst().init(function(){
                var initFun = seeAuthPop.init;
                initFun(seeauthPar);
            });
            seeAuthPopWin.getInst().callBack("opt='cancel'", seeAuthPopWin.cancelBtnCallBack);
        }
    }

   seeAuthLog =  function(authId){
       seeauthPar["authId"] = authId;
       $('#authLog_auth_pop_btn').trigger('click');
   }

   var init = function(){
       authLog_searchBtn.init();
       authLogGrid.init();
       seeAuthPopWin.init();
   }
   return {
	   init :init
   }
});



