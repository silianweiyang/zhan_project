define(["jquery", "common", "compont", "wandaComp", "wandaCompR","date_time_Picker"], function ($, common, compont, wandaComp, wandaCompR,dtp) {

   var temp = {};
   var setAuthCancelBtn = {
       init:function(){
           $('#update_auth_cancel_btn').unbind('click');
           $('#update_auth_cancel_btn').on('click',function(){
                $('#update_auth_cancel_btn').trigger("afterClick");
           });
       }
   }

   var panelInit = {
        init:function(){
            $('#update_auth_dataName').val(temp['dataName']);
            $('#update_user_auth').html(temp['authCode']);
            $('#update_auth_beginTime_div').html("<input id='update_auth_beginTime' />");
            $('#update_auth_endTime_div').html("<input id='update_auth_endTime' />");
            var startTime = new Date(temp['beginTime']);
            var endTime = new Date(temp['endTime']);
            new dtp.wandaDatePicker("update_auth_beginTime",startTime).init();
            new dtp.wandaDatePicker("update_auth_endTime",endTime).init();
            new dtp.validate("wandaDatePicker", "update_auth_beginTime", "update_auth_endTime").init();
            var takeStyle = temp['takeStyle'].split(",");
            if(takeStyle){
                for(var i in takeStyle){
                    if("1" == takeStyle[i]+""){
                        $('#update_takeStyle_ws').attr("checked",true);
                    }
                    if("2" == takeStyle[i]+""){
                        $('#update_takeStyle_web').attr("checked",true);
                    }
                }
            }
        }
   }

   var setAuthBtn = {
       init:function(){
           $('#update_auth_submit_btn').unbind('click');
           $('#update_auth_submit_btn').on('click',function(){
               var dataName = $('#update_auth_dataName').val();
               var startTime = $('#update_auth_beginTime').val();
               var endTime = $('#update_auth_endTime').val();
               var takeStyle=$('input[name="update_takeStyle"]:checked').map(function(){
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
               if(!takeStyle){
                   common.jqConfirm.alert({
                       title:0,
                       content:"请勾选获取方式!!!"
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
               if(!go){
                   return false;
               }
               var par = {
                   "authId":temp['authId'],
                   "dataName":dataName,
                   "startTime":startTime,
                   "endTime":endTime,
                   "takeStyle":takeStyle,
                   "cekIds":cekIds
                   }
                   common.ajaxPost("auth/udpateAuth",par,function(rda){
                       common.jqConfirm.alert({
                           title:1,
                           content:rda.msg
                   });
               },null,false,null);
               $('#update_auth_submit_btn').trigger("afterClick");
           });
       }
   }

   var resouceTree = {
       tree:{},
       init:function(){
           var option = {
               childKey: "list",
               textKey: "name",
               checkKey:'checked',
               noCache: false,
               treeDom: $("#update_resTree"),
               queryKey: "rid",
               queryData: function(id, fun) {
                   var startTime = $('#update_auth_beginTime').val();
                   var endTime = $('#update_auth_endTime').val();
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
                   common.ajaxPost("auth/resTreeForUpdate",
                       {"rid":id,
                           "startTime":startTime,
                           "endTime":endTime,
                           "authId":temp['authId']},
                       function(data){
                           fun(data['treeList']);
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

    var clean = {
        init:function(){

        }
    }

   var init = function(data){
       clean.init();
       $('#update_resTree').html("");
       temp = data;
       setAuthCancelBtn.init();
       panelInit.init();
       setAuthBtn.init();
       resouceTree.init();
   }
   return {
	   init :init
   }
});

