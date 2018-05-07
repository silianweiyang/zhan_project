define(["jquery", "common", "compont", "wandaComp", "wandaCompR","date_time_Picker"], function ($, common, compont, wandaComp, wandaCompR,dtp) {

   var temp = {};
   var setauthcancelbtn = {
       init:function(){
           $('#set_auth_cancel_btn').unbind('click');
           $('#set_auth_cancel_btn').on('click',function(){
                $('#set_auth_cancel_btn').trigger("afterClick");
           });
       }
   }

   var panelInit = {
       init:function(data){
           $('#auth_benginTime_div').html("<input id='auth_beginTime' />");
           $('#auth_endTimee_div').html("<input id='auth_endTime' />");
           new dtp.wandaDatePicker("auth_beginTime","").init();
           new dtp.wandaDatePicker("auth_endTime","").init();
           new dtp.validate("wandaDatePicker", "auth_beginTime", "auth_endTime").init();
           $('#user_auth').html(data.authCode);
       }
   }

   var setAuthBtn = {
       init:function(){
           $('#set_auth_submit_btn').unbind('click');
           $('#set_auth_submit_btn').on('click',function(){
               var dataName = $('#auth_dataName').val();
               var startTime = $('#auth_beginTime').val();
               var endTime = $('#auth_endTime').val();
               var takeStyle=$('input[name="takeStyle"]:checked').map(function(){
                   return $(this).val();
               }).get().join(",");
               var go = true;
               var checkNodes = resouceTree.tree.getCheckedNodes();
               if(checkNodes.length==0){
                   common.jqConfirm.alert({
                       title:1,
                       content:"请选择资源!!!"
                   });
                   go = false;
               }
               var cekIds = $.map(checkNodes,function(dat){
                   return dat.data["rid"];
               }).join(",");
               if(!startTime){
                   common.jqConfirm.alert({
                       title:0,
                       content:"请输入开始时间!!!"
                   });
                   go = false;
               }
               if(!endTime){
                   common.jqConfirm.alert({
                       title:0,
                       content:"请输入结束时间!!!"
                   });
                   go = false;
               }
               if(!dataName){
                   common.jqConfirm.alert({
                       title:0,
                       content:"请输入数据包名!!!"
                   });
                   go = false;
               }
               if(!takeStyle){
                   common.jqConfirm.alert({
                       title:0,
                       content:"请勾选获取方式!!!"
                   });
                   go = false;
               }
               if(!go){
                   return false;
               }
               var par = {
                   "userid":temp.userid,
                   "dataName":dataName,
                   "startTime":startTime,
                   "endTime":endTime,
                   "takeStyle":takeStyle,
                   "cekIds":cekIds,
                   "authType":"1"
               }
               common.ajaxPost("auth/save",par,function(rda){
                   common.jqConfirm.alert({
                       title:1,
                       content:rda.msg
                   });
               },null,false,null);
               $('#set_auth_submit_btn').trigger("afterClick");
           });
       }
   }

   var resouceTree = {
       tree:{},
       init:function(){
           var option = {
               childKey: "list",
               textKey: "name",
               noCache: false,
               treeDom: $("#resTree"),
               queryKey: "rid",
               queryData: function(id, fun) {
                   var userid = temp.userid;
                   var startTime = $('#auth_beginTime').val();
                   var endTime = $('#auth_endTime').val();
                   var go = true;
                   if(id){//如果不是加载
                       if(!startTime){
                           common.jqConfirm.alert({
                               title:0,
                               content:"请先输入开始时间!!!"
                           });
                           go = false;
                       }
                       if(!endTime){
                           common.jqConfirm.alert({
                               title:0,
                               content:"请先输入结束时间!!!"
                           });
                           go = false;
                       }
                   }
                   if(!go){
                       return false;
                   }
                   if(!id){
                       id = "";
                   }
                   common.ajaxPost("auth/resTree",
                       {"rid":id,
                       "startTime":startTime,
                       "endTime":endTime,
                       "userid":userid},
                       function(data){
                           fun(data.treeList);
                       },
                       function(){
                           common.jqConfirm.alert({
                               title: 0,
                               content: "加载失败！"
                           });
                       },
                       null, null);
               },
               onSelect: function(data) {
               },
               checkOption: {
                   checkChildren: true,
                   onCheck: function(treeId, treeNode) {
                   }
               }
           };
           resouceTree.tree = new wandaComp.wandaTreeView(option);
           resouceTree.tree.init();
       }
   }

    var cancelBtn = {
        init: function () {
            $("#cancel").unbind("click");
            $("#cancel").click(function () {
                $("#cancel").trigger("afterClick");
            });
        }
    };

    var clean = {
        init:function(){
            $('#auth_dataName').val("");
            $('#auth_beginTime').val("");
            $('#auth_endTime').val("");
        }
    }

   var init = function(data){
       $('#resTree').html("");
       clean.init();
       temp = data;
       setauthcancelbtn.init();
       panelInit.init(data);
       setAuthBtn.init();
       resouceTree.init();
       cancelBtn.init();
   }
   return {
	   init :init
   }
});

