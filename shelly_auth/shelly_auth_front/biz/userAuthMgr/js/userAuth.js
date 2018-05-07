var setauthPar = {};
var creatauthPar = {};
var dictObj = {};
define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/userAuthMgr/js/user_auth_pop","biz/userAuthMgr/js/set_auth_pop"], function ($, common, compont, wandaComp, wandaCompR,userAuthPop,setAuthPop) {

   var initDictObj = {
       init:function(){
           //加载用户界别
           common.ajaxGet("dictionary/dicList",{
               "paramObj":{
                   'type':'ENCRYPT_LEVEL'
               }
           },function(data){
               var dicMap = {};
               var dat = data.datas;
               for(var p in dat){
                   dicMap[dat[p]['CODE']] = dat[p]['NAME'];
               }
              dictObj['ENCRYPT_LEVEL'] = {
                  "dicMap":dicMap,
                  "datas":data.datas
              };
           },null,false,null);
           common.ajaxGet("dictionary/dicList",{
               "paramObj":{
                   'type':"GENDER"
               }
           },function(data){
               var dicMap = {};
               var dat = data.datas;
               for(var p in dat){
                   dicMap[dat[p]['CODE']] = dat[p]['NAME'];
               }
               dictObj['GENDER'] = {
                   "dicMap":dicMap,
                   "datas":data.datas
               };
           },null,false,null);
       }
   }

   var setAuthPopWin = {
       inst:{},
       optionObj:{
           minWidth:650,
           minHeight:550,
           maxWidth:650,
           maxHeiht:550,
           title:'用户授权',
           content:'biz/userAuthMgr/html/set_auth_pop.html'
       },
       getInst:function(){
           if(setAuthPopWin.inst){
               setAuthPopWin.inst = new wandaComp.wandaWindow("userAuth_auth_pop_btn","userAuth_setauth_pop_div",setAuthPopWin.optionObj);
           }
           return setAuthPopWin.inst;
       },
       cancelBtnCallBack:function(){
           var plusPopup = $("#userAuth_setauth_pop_div").data("wandaWindow");
           plusPopup.close();
           userAuthGrid.refreshDatas(1);
       },
       init:function(){
           setAuthPopWin.getInst().init(function(){
               var initFun = setAuthPop.init;
               initFun(setauthPar);
           });
           setAuthPopWin.getInst().callBack("opt='cancel'", setAuthPopWin.cancelBtnCallBack);
           setAuthPopWin.getInst().callBack("opt='submit'", setAuthPopWin.cancelBtnCallBack);
       }
   }

   var userAuthPopWin = {
       inst:{},
       optionObj:{
          minWidth:300,
          minHeight:150,
          maxWidth:300,
          maxHeiht:150,
          title:'用户授权',
          content:'biz/userAuthMgr/html/user_auth_pop.html'
       },
       getInst:function(){
           if(userAuthPopWin.inst){
               userAuthPopWin.inst = new wandaComp.wandaWindow("userAuth_createAuth_pop_btn","userAuth_createAuth_pop_div",userAuthPopWin.optionObj);
           }
           return userAuthPopWin.inst;
       },
       cancelBtnCallBack:function(){
           userAuthPopWin.inst.close();
           userAuthGrid.refreshDatas(1);
       },
       init:function(){
           userAuthPopWin.getInst().init(function(){
               var initFun = userAuthPop.init;
               initFun(creatauthPar);
           });
           userAuthPopWin.getInst().callBack("opt='cancel'", userAuthPopWin.cancelBtnCallBack);
       }

   }

   var userAuth_searchBtn = {
       init:function(){
           $('#userAuth_searchBtn').on('click',function(){
               var loginName = $('#userAuth_name').val();
               userAuthGrid.pagerParam = {
                   "LOGIN_NAME": loginName
               };
               userAuthGrid.refreshDatas();
           });
       }
   }

   var userAuthGrid = {
	        rows: "10",
	        pagerParam: {},
	        gridColums: [
	            {
	                width: '30px',
                    template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
                    headerTemplate: '<input type="checkbox" id="check-all" title="全选"/>'
                }, {
                    field: "USER_NAME",
                    title: "用户名称"
	            }, {
	                field: "LOGIN_NAME",
	                title: "登陆名"
	            },{
	                field: "GENDER",
	                title: "性别",
                    template:"#= dictObj['GENDER']['dicMap'][data.GENDER] #"
	            },{
	                field: "PHONE_NO",
	                title: "所属机构"
	            },{
	                field: "ORG_NAME",
	                title: "电话"
	            },{
	                field: "AUTH_CODE",
	                title: "授权码"
	            },{
	                field: "ENCRYPT_LEVEL",
	                title: "用户级别",
                    template:"#= dictObj['ENCRYPT_LEVEL']['dicMap'][data.ENCRYPT_LEVEL] #"
	            },{
                    template:function(data){
                        var id = data['USERID'];
                        var authCode = data['AUTH_CODE'];
                        var userLevel = data['ENCRYPT_LEVEL'];
                        if(data['AUTH_CODE']){
                            return "<a href='#' class='btn btn-primary' onclick='setAuthFun("+id+","+authCode+");'>授权</a>";
                        }else{
                            return "<a href='#' class='btn btn-default' onclick='createAuthFun("+id+");'>生成授权码</a>";
                        }
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
	                    rows: userAuthGrid.rows
	                },
	                paramObj: userAuthGrid.pagerParam
	            };
	            var successFun = function (data) {
	                var pageBean = data.pageBean;
	                var gridData = new wanda.data.DataSource({
	                    data: data.datas,
	                    pageSize: 10
	                });
                    userAuthGrid.getInst().setDataSource(gridData, pageBean);

	            };
	            common.ajaxPost("user/list", param, successFun, null, null, $("#userAuth"));
	        },
	        pagerCallBack: function (e) {
                userAuthGrid.refreshDatas(e.index);
	        },
	        inst: {},
	        getInst: function () {
	            if (userAuthGrid.inst) {
                    userAuthGrid.inst = new wandaComp.wandaGrid("userAuthGrid", userAuthGrid.gridColums, true, this.pagerCallBack);
	            }
	            return userAuthGrid.inst;
	        },
	        init: function () {
                userAuthGrid.getInst().init();
                userAuthGrid.pagerParam = {
	                "LOGIN_NAME": ""
	            };
                userAuthGrid.refreshDatas();
	        }
	    }
   
   var init = function(){
       initDictObj.init();
       userAuth_searchBtn.init();
       userAuthGrid.init();
       userAuthPopWin.init();
       setAuthPopWin.init();
   }
   return {
	   init :init
   }
});

function createAuthFun(data){
    creatauthPar['userid'] = data;
    $('#userAuth_createAuth_pop_btn').trigger('click');
}

function setAuthFun(userid,authCode){
    setauthPar["userid"] =userid;
    setauthPar["authCode"]=authCode;
    $('#userAuth_auth_pop_btn').trigger('click');
}

