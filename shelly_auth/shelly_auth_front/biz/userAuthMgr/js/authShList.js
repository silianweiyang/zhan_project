var dictObj = {};
define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/userAuthMgr/js/see_auth_pop","biz/userAuthMgr/js/authSh_pop"], function ($, common, compont, wandaComp, wandaCompR,seeAuthPop,authShPop) {

   var seePar = {};
   var initDictObj = {
        init:function(){
            //加载状态
            common.ajaxGet("dictionary/dicList",{
                "paramObj":{
                    'type':'SUBCRIBE_STATUS'
                }
            },function(data){
                var dicMap = {};
                var dat = data.datas;
                for(var p in dat){
                    dicMap[dat[p]['CODE']] = dat[p]['NAME'];
                }
                dictObj['SUBCRIBE_STATUS'] = {
                    "dicMap":dicMap,
                    "datas":data.datas
                };
            },null,false,null);
        }
   }

   var authSh_searchBtn = {
       init:function(){
           $('#authSh_searchBtn').on('click',function(){
               var dataName = $('#dataName').val();
               authShGrid.pagerParam = {
                   "t.DATANAME": dataName
               };
               authShGrid.refreshDatas();
           });
       }
   }

   var authSh_shBtn = {
       init:function(){
           $('#authSh_shBtn').on('click',function(){
               var checked = authShGrid.getInst().getSelect();
               if(checked.length==0) {
                   common.jqConfirm.alert({title:0,content:"请勾选订阅"});
               }else{
                   for(var p in checked){
                       var status = checked[p]['STATUS']+"";
                       if(status!="1"){
                           common.jqConfirm.alert({title:0,content:"只能选择待审批的数据"});
                           return false;
                       }
                   }
                   var jsons = checked.map(function(val){
                       return val['AUTH_ID'];
                   }).join(",");
                   seePar["authId"] = jsons;
                   $('#authSh_shAuth_pop_btn').trigger('click');
               }
           });
       }
   }

   var authShGrid = {
	        rows: "10",
	        pagerParam: {},
	        gridColums: [
                {
                    width: '30px',
                    template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                    headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
                },{
	                field: "USER_NAME",
	                title: "申请人"
	            }, {
                    field: "DATA_NAME",
                    title: "数据包名称"
                }, {
                    field: "YXRQ",
                    title: "授权日期"
                },{
                    field: "CZRQ",
                    title: "申请日期"
                },{
                    field: "STATUS",
                    title: "状态",
                    template:"#= dictObj['SUBCRIBE_STATUS']['dicMap'][data.STATUS] #"
                },{
                    template:function(data){
                        var id = data['AUTH_ID'];
                        var authType = data["STATUS"];
                        var html = "<a href='#' class='btn btn-default' onclick='seeAuth("+id+");'>查看</a>&nbsp;&nbsp;";
                        var tjsh = "<a href='#' class='btn btn-primary' onclick='submitAuth("+id+");'>审核</a>&nbsp;&nbsp;";
                        if("1"==authType+""){//待审批
                            html += tjsh
                        }
                        return html;
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
	                    rows: authShGrid.rows
	                },
	                paramObj: authShGrid.pagerParam
	            };
	            var successFun = function (data) {
	                var pageBean = data.pageBean;
	                var gridData = new wanda.data.DataSource({
	                    data: data.datas,
	                    pageSize: 10
	                });
                    authShGrid.getInst().setDataSource(gridData, pageBean);

	            };
	            common.ajaxPost("auth/listForAdmin", param, successFun, null, null, $("#authShGrid"));
	        },
	        pagerCallBack: function (e) {
                authShGrid.refreshDatas(e.index);
	        },
	        inst: {},
	        getInst: function () {
	            if (authShGrid.inst) {
                    authShGrid.inst = new wandaComp.wandaGrid("authShGrid", authShGrid.gridColums, true, this.pagerCallBack);
	            }
	            return authShGrid.inst;
	        },
	        init: function () {
                authShGrid.getInst().init();
                authShGrid.pagerParam = {
	                "t.DATA_NAME": ""
	            };
                authShGrid.refreshDatas();
	        }
	    }

   var authShPopWin = {
       inst:{},
       optionObj:{
           minWidth:300,
           minHeight:260,
           maxWidth:300,
           maxHeiht:260,
           title:'审批',
           content:'biz/userAuthMgr/html/authSh_pop.html'
       },
       getInst:function(){
           if(authShPopWin.inst){
               authShPopWin.inst = new wandaComp.wandaWindow("authSh_shAuth_pop_btn","authSh_shAuth_pop_div",authShPopWin.optionObj);
           }
           return authShPopWin.inst;
       },
       cancelBtnCallBack:function(){
           var plusPopup = $("#authSh_shAuth_pop_div").data("wandaWindow");
           plusPopup.close();
           authShGrid.refreshDatas(1);
       },
       init:function(){
           authShPopWin.getInst().init(function(){
               var initFun = authShPop.init;
               initFun(seePar);
           });
           authShPopWin.getInst().callBack("opt='cancel'", authShPopWin.cancelBtnCallBack);
           authShPopWin.getInst().callBack("opt='submit'", authShPopWin.cancelBtnCallBack);
       }
   }

   var seeAuthPopWin = {
        inst:{},
        optionObj:{
            minWidth:650,
            minHeight:550,
            maxWidth:650,
            maxHeiht:550,
            title:'查看订阅',
            content:'biz/userAuthMgr/html/see_auth_pop.html'
        },
        getInst:function(){
            if(seeAuthPopWin.inst){
                seeAuthPopWin.inst = new wandaComp.wandaWindow("authSh_seeAuth_pop_btn","authSh_seeAuth_pop_div",seeAuthPopWin.optionObj);
            }
            return seeAuthPopWin.inst;
        },
        cancelBtnCallBack:function(){
            var plusPopup = $("#authSh_seeAuth_pop_div").data("wandaWindow");
            plusPopup.close();
        },
        init:function(){
            seeAuthPopWin.getInst().init(function(){
                var initFun = seeAuthPop.init;
                initFun(seePar);
            });
            seeAuthPopWin.getInst().callBack("opt='cancel'", seeAuthPopWin.cancelBtnCallBack);
        }
    }

    submitAuth = function(authId){
        seePar["authId"] = authId;
        $('#authSh_shAuth_pop_btn').trigger('click');
    }

    seeAuth = function(authId){
        seePar["authId"] = authId;
        $('#authSh_seeAuth_pop_btn').trigger('click');
    }

   var init = function(){
       initDictObj.init();
       authSh_searchBtn.init();
       authShGrid.init();
       seeAuthPopWin.init();
       authShPopWin.init();
       authSh_shBtn.init();
   }
   return {
	   init :init
   }


});


