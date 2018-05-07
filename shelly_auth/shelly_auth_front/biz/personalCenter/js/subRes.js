var dictObj = {};
define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/personalCenter/js/set_auth_pop","biz/userAuthMgr/js/see_auth_pop","biz/personalCenter/js/update_auth_pop"], function ($, common, compont, wandaComp, wandaCompR,setAuthPop,seeAuthPop,updateAuthPop) {
   var uptPar = {};
   var seePar = {};
   var userObj = {};
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

   var addAuthBtn = {
       init:function(){
           $('#personCenter_authList_addBtn').on('click',function(){
               if(!userObj["authCode"]){
                   common.jqConfirm.alert({
                       title:0,
                       content:"该用户还没有授权，请先授权!!!"
                   });
               }else{
                   $('#personCenter_authList_createAuth_pop_btn').trigger('click');
               }
           });
       }
   }

   var delAuthBtn = {
       init:function(){
           $('#personCenter_authList_delBtn').on('click',function(){
               var checked = authGrid.getInst().getSelect();
               if(checked.length==0) {
                   common.jqConfirm.alert({title:0,content:"请勾选用户！"});
               }else{
                   var  authIds = checked.map(function(val){
                       return val['AUTH_ID'];
                   }).join(",");
                   var stauts = checked.map(function(val){
                       return val['STATUS']
                   });
                   var canGo = true;
                   for(var sta in stauts){
                       if(stauts[sta]+"" != "0"){
                           common.jqConfirm.alert({
                               content:"勾选的对象部分不能删除，只能勾选状态为暂存的对象！"
                           });
                           canGo=false;
                           break;
                       }
                   }
                   if(canGo){
                       common.ajaxPost("auth/delAuth", {
                           "authIds":authIds
                       }, function(data){
                           common.jqConfirm.alert({
                               content:data.msg
                           });
                           authGrid.refreshDatas(1);
                       }, null, false, null);
                   }
               }
           });
       }
   }

    var updateAuthPopWin = {
        inst:{},
        optionObj:{
            minWidth:650,
            minHeight:550,
            maxWidth:650,
            maxHeiht:550,
            title:'修改订阅',
            content:'biz/personalCenter/html/update_auth_pop.html'
        },
        getInst:function(){
            if(updateAuthPopWin.inst){
                updateAuthPopWin.inst = new wandaComp.wandaWindow("personCenter_authList_updateAuth_pop_btn","personCenter_authList_updateAuth_pop_div",updateAuthPopWin.optionObj);
            }
            return updateAuthPopWin.inst;
        },
        cancelBtnCallBack:function(){
            var plusPopup = $("#personCenter_authList_updateAuth_pop_div").data("wandaWindow");
            plusPopup.close();
            authGrid.refreshDatas(1);
        },
        init:function(){
            updateAuthPopWin.getInst().init(function(){
                var initFun = updateAuthPop.init;
                initFun(uptPar);
            });
            updateAuthPopWin.getInst().callBack("opt='cancel'", updateAuthPopWin.cancelBtnCallBack);
            updateAuthPopWin.getInst().callBack("opt='submit'", updateAuthPopWin.cancelBtnCallBack);
        }
    }

    var seeAuthPopWin = {
        inst:{},
        optionObj:{
            minWidth:650,
            minHeight:550,
            maxWidth:650,
            maxHeiht:550,
            title:'订阅历史',
            content:'biz/userAuthMgr/html/see_auth_pop.html'
        },
        getInst:function(){
            if(seeAuthPopWin.inst){
                seeAuthPopWin.inst = new wandaComp.wandaWindow("personCenter_authList_seeAuth_pop_btn","personCenter_authList_seeAuth_pop_div",seeAuthPopWin.optionObj);
            }
            return seeAuthPopWin.inst;
        },
        cancelBtnCallBack:function(){
            var plusPopup = $("#personCenter_authList_seeAuth_pop_div").data("wandaWindow");
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

   var setAuthPopWin = {
       inst:{},
       optionObj:{
           minWidth:650,
           minHeight:550,
           maxWidth:650,
           maxHeiht:550,
           title:'资源订阅',
           content:'biz/personalCenter/html/set_auth_pop.html'
       },
       getInst:function(){
           if(setAuthPopWin.inst){
               setAuthPopWin.inst = new wandaComp.wandaWindow("personCenter_authList_createAuth_pop_btn","personCenter_authList_createAuth_pop_div",setAuthPopWin.optionObj);
           }
           return setAuthPopWin.inst;
       },
       cancelBtnCallBack:function(){
           var plusPopup = $("#personCenter_authList_createAuth_pop_div").data("wandaWindow");
           plusPopup.close();
           authGrid.refreshDatas(1);
       },
       init:function(){
           setAuthPopWin.getInst().init(function(){
               var initFun = setAuthPop.init;
               initFun(userObj);
           });
           setAuthPopWin.getInst().callBack("opt='cancel'", setAuthPopWin.cancelBtnCallBack);
           setAuthPopWin.getInst().callBack("opt='submit'", setAuthPopWin.cancelBtnCallBack);
       }}

   var searchBtn = {
       init:function(){
           $('#data_namepersonCenter_authList_searchBtn').on('click',function(){
               var dataName = $('#data_name').val();
               authGrid.pagerParam = {
                   "DATA_NAME": dataName
               };
               authGrid.refreshDatas();
           });
       }
   }

   var authGrid = {
	        rows: "10",
	        pagerParam: {},
	        gridColums: [
	            {
	                width: '30px',
                    template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                    headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
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
                        var html = "<a href='#' class='btn btn-default' onclick='sub_seeAuthFun("+id+");'>查看</a>&nbsp;&nbsp;";
                        var tjsh = "<a href='#' class='btn btn-primary' onclick='sub_submitAuthFun("+id+");'>提交审核</a>&nbsp;&nbsp;";
                        var xg = "<a href='#' class='btn btn-danger' onclick='sub_updateAuthFun("+id+");'>修改</a>&nbsp;&nbsp;";
                        var sc = "<a href='#' class='btn btn-warning' onclick='sub_delAuthFun("+id+");'>删除</a>&nbsp;&nbsp;";
                        var cxsq = "<a href='#' class='btn btn-info' onclick='sub_reAuthFun("+id+");'>重新申请</a>&nbsp;&nbsp;";
                        if("0"==authType+""){//暂存
                            html += tjsh+xg+sc;
                        }
                        if("1"==authType+""){//待审批

                        }
                        if("2"==authType+""){//通过
                        }
                        if("3"==authType+""){//不通过
                            html += cxsq;
                        }
                        return html;
                    }, title: "操作", width: "300px"
	            }],
	        refreshDatas: function (index) {
	            var page = "1";
	            if (index) {
	                page = index;
	            }
	            var param = {
	                pageBean: {
	                    page: page + "",
	                    rows: authGrid.rows
	                },
	                paramObj: authGrid.pagerParam
	            };
	            var successFun = function (data) {
                    userObj =data['user'];
	                var pageBean = data.pageBean;
	                var gridData = new wanda.data.DataSource({
	                    data: data.datas,
	                    pageSize: 10
	                });
                    authGrid.getInst().setDataSource(gridData, pageBean);

	            };
	            common.ajaxPost("auth/listForUser", param, successFun, null, null, $("#personCenter_authListGrid"));
	        },
	        pagerCallBack: function (e) {
                authGrid.refreshDatas(e.index);
	        },
	        inst: {},
	        getInst: function () {
	            if (authGrid.inst) {
                    authGrid.inst = new wandaComp.wandaGrid("personCenter_authListGrid", authGrid.gridColums, true, this.pagerCallBack);
	            }
	            return authGrid.inst;
	        },
	        init: function () {
                authGrid.getInst().init();
                authGrid.pagerParam = {
                    "DATA_NAME": ""
	            };
                authGrid.refreshDatas();
	        }
	    }

   sub_seeAuthFun = function(id){
        seePar["authId"] = id;
        $('#personCenter_authList_seeAuth_pop_btn').trigger("click");
   }

   sub_delAuthFun = function(id){
       common.jqConfirm.confirm({
           content:"确定删除？",
           call:function(){
               common.ajaxPost("auth/delAuth", {
                   "authIds":id
               }, function(data){
                    common.jqConfirm.alert({
                        title:"1",
                        content:data.msg
                    });
                   authGrid.refreshDatas(1);
               }, null, false, null);
           }
       });
   }

   sub_submitAuthFun = function(id){
       common.jqConfirm.confirm({
           content:"确定提交审核？",
           call:function(){
               common.ajaxPost("auth/submitAuth", {
                   "authId":id
               }, function(data){
                   common.jqConfirm.alert({
                       title:"1",
                       content:data.msg
                   });
                   authGrid.refreshDatas(1);
               }, null, false, null);
           }
       });
   }

   sub_updateAuthFun = function(id){
       common.jqConfirm.confirm({
           content:"确定修改订阅？",
           call:function(){
               common.ajaxPost("auth/resForUpdate", {
                   "authId":id
               }, function(data){
                   uptPar = data;
                   $('#personCenter_authList_updateAuth_pop_btn').trigger("click");
               }, null, false, null);
           }
       });
   }

   sub_reAuthFun = function(id){
       common.jqConfirm.confirm({
           content:"确定重新订阅？",
           call:function(){
               common.ajaxPost("auth/resForUpdate", {
                   "authId":id
               }, function(data){
                   uptPar = data;
                   $('#personCenter_authList_updateAuth_pop_btn').trigger("click");
               }, null, false, null);
           }
       });
   }
   
   var init = function(){
       initDictObj.init();
       searchBtn.init();
       authGrid.init();
       setAuthPopWin.init();
       addAuthBtn.init();
       seeAuthPopWin.init();
       delAuthBtn.init();
       updateAuthPopWin.init();
   }
   return {
	   init :init
   }
});



