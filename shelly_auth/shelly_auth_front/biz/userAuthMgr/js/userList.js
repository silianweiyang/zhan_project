var dictObj = {};
define(["jquery", "common", "compont", "wandaComp", "wandaCompR","biz/userAuthMgr/js/user_auth_pop","biz/userAuthMgr/js/user_level_pop"], function ($, common, compont, wandaComp, wandaCompR,userAuthPop,userLevelPop) {

   var creatauthPar = {};
   var levelPar;

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

   var userLevelPopWin = {
       inst:{},
       optionObj:{
           minWidth:300,
           minHeight:150,
           maxWidth:300,
           maxHeiht:150,
           title:'用户级别',
           content:'biz/userAuthMgr/html/user_level_pop.html'
       },
       getInst:function(){
           if(userLevelPopWin.inst){
               userLevelPopWin.inst = new wandaComp.wandaWindow("userList_level_pop_btn","userList_level_pop_div",userLevelPopWin.optionObj);
           }
           return userLevelPopWin.inst;
       },
       cancelBtnCallBack:function(){
           var plusPopup = $("#userList_level_pop_div").data("wandaWindow");
           plusPopup.close();
           userListGrid.refreshDatas(1);
       },
       init:function(){
           userLevelPopWin.getInst().init(function(){
               var initFuc = userLevelPop.init;
               initFuc(levelPar);
           });
           userLevelPopWin.getInst().callBack("opt='cancel'", userLevelPopWin.cancelBtnCallBack);
           userLevelPopWin.getInst().callBack("opt='submit'", userLevelPopWin.cancelBtnCallBack);
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
               userAuthPopWin.inst = new wandaComp.wandaWindow("userList_createAuth_pop_btn","userList_createAuth_pop_div",userAuthPopWin.optionObj);
           }
           return userAuthPopWin.inst;
       },
       cancelBtnCallBack:function(){
           var plusPopup = $("#userList_createAuth_pop_div").data("wandaWindow");
           plusPopup.close();
           userListGrid.refreshDatas(1);
       },
       init:function(){
           userAuthPopWin.getInst().init(function(){
               var initFun = userAuthPop.init;
               initFun(creatauthPar);
           });
           userAuthPopWin.getInst().callBack("opt='cancel'", userAuthPopWin.cancelBtnCallBack);
       }

   }

   var userList_searchBtn = {
       init:function(){
           $('#userList_searchBtn').on('click',function(){
               var loginName = $('#serverList_name').val();
               userListGrid.pagerParam = {
                   "LOGIN_NAME": loginName
               };
               userListGrid.refreshDatas();
           });
       }
   }


   var serverList_setLevel = {
       init:function(){
           $('#serverList_setLevel').on('click',function(){
               var checked = userListGrid.getInst().getSelect();
               if(checked.length==0) {
                   common.jqConfirm.alert({title:0,content:"请勾选用户"});
               }else{
                   var  jsons = checked.map(function(val){
                       return val['USERID'];
                   }).join(",");
                   var par = {
                       "userid":jsons
                   };
                   levelPar = {
                       "userid":jsons,
                       "userLevel":"1",
                       "dictObj":dictObj['ENCRYPT_LEVEL']
                   };
                   $('#userList_level_pop_btn').trigger("click");
               }
           });
       }
   }

   var userList_createAuth = {
       init:function(){
           $('#userList_createAuth').on('click',function(){
               var checked = userListGrid.getInst().getSelect();
               if(checked.length==0) {
                   common.jqConfirm.alert({title:0,content:"请勾选用户"});
               }else{
                   var  jsons = checked.map(function(val){
                       return val['USERID'];
                   }).join(",");
                   var par = {
                       "userid":jsons
                   };
                   common.ajaxPost("user/createAuthCode",par,function(rda){
                       if(rda['authCode']){
                           common.jqConfirm.alert({title:1,content:"授权成功"});
                           userListGrid.refreshDatas(1);
                       }
                   },null,false,null);
               }
           });

       }
   }

   var userList_addBtn = {
       init:function(){
           $('#userList_addBtn').on('click',function(){
               common.ajaxPost("user/syncUser",{},function(data){
                   common.jqConfirm.alert({
                       title:"1",
                       content:"同步了"+data.count+"位用户。"
                   });
                   userListGrid.refreshDatas(1);
               },null,false,null);
           });
       }
   }
   
   var userListGrid = {
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
                        var userLevel = data['ENCRYPT_LEVEL'];
                        if(data['AUTH_CODE']){
                            return "<a href='#' class='btn btn-primary' onclick='createAuthFun("+id+");'>修改授权码</a>" +
                                "&nbsp;&nbsp;<a class='btn btn-default' href='#' onclick='setLevel("+id+","+userLevel+");'>设置级别</a>";
                        }else{
                            return "<a href='#' class='btn btn-danger' onclick='createAuthFun("+id+");'>生成授权码</a>"+
                                "&nbsp;&nbsp;<a class='btn btn-default' href='#' onclick='setLevel("+id+","+userLevel+");'>设置级别</a>";
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
	                    rows: userListGrid.rows
	                },
	                paramObj: userListGrid.pagerParam
	            };
	            var successFun = function (data) {
	                var pageBean = data.pageBean;
	                var gridData = new wanda.data.DataSource({
	                    data: data.datas,
	                    pageSize: 10
	                });
	                userListGrid.getInst().setDataSource(gridData, pageBean);

	            };
	            common.ajaxPost("user/list", param, successFun, null, null, $("#userList"));
	        },
	        pagerCallBack: function (e) {
	        	userListGrid.refreshDatas(e.index);
	        },
	        inst: {},
	        getInst: function () {
	            if (userListGrid.inst) {
	                userListGrid.inst = new wandaComp.wandaGrid("userListGrid", userListGrid.gridColums, true, this.pagerCallBack);
	            }
	            return userListGrid.inst;
	        },
	        init: function () {
	        	userListGrid.getInst().init();
	            userListGrid.pagerParam = {
	                "LOGIN_NAME": ""
	            };
	            userListGrid.refreshDatas();
	        }
	    }
    createAuthFun =  function(data){
        creatauthPar['userid'] = data;
        $('#userList_createAuth_pop_btn').trigger('click');
    }

    setLevel = function(id,userlevel){
        levelPar = {
            "userid":id,
            "userLevel":userlevel,
            "dictObj":dictObj['ENCRYPT_LEVEL']
        };
        $('#userList_level_pop_btn').trigger("click");
    }

   var init = function(){
       initDictObj.init();
	   userList_searchBtn.init();
	   userListGrid.init();
       userList_createAuth.init();
       serverList_setLevel.init();
       userAuthPopWin.init();
       userLevelPopWin.init();
       userList_addBtn.init();
   }
   return {
	   init :init
   }
});




