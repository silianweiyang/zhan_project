define(["jquery", "common", "compont", "wandaComp", "wandaCompR"], function ($, common, compont, wandaComp, wandaCompR) {

   var temp = {};
   var levelSelector = {
     init:function(data){
         var dic =[{"NAME":"通过","CODE":"2"},{"NAME":"不通过","CODE":"3"}];
         $('#auth_status').wandaDropDownList({
             dataSource:dic,
             dataTextField: "NAME",
             dataValueField: "CODE"
         });
         $("#auth_status").data("wandaDropDownList").value(data['auth_status']);
     }
   };

   var submitBtn = {
       init:function(){
           $('#authShl_submit_btn').unbind('click');
           $('#authShl_submit_btn').on('click',function(){
               var status = $('#auth_status').val();
               var shyj = $('#shyj').val();
               if(status+""=="3"&&!shyj){
                   common.jqConfirm.alert({
                       title:0,
                       content:"不通过的请输入审核意见！！！"
                   });
                   return false;
               }
               var par = {
                   "authId":temp['authId'],
                   "status":status,
                   "shyj":shyj
               }
               common.ajaxPost("auth/submitSh",par,function(rda){
                   common.jqConfirm.alert({
                        title:1,
                        content:rda.msg
                   });
               },null,false,null);
               $('#authShl_submit_btn').trigger("afterClick");
           });
       }
   }

   var cancelBtn = {
       init:function(){
           $('#authSh_cancel_btn').unbind('click');
           $('#authSh_cancel_btn').on('click',function(){
                $('#authSh_cancel_btn').trigger("afterClick");
           });
       }
   }

   var init = function(data){
       temp = data;
       levelSelector.init(data);
       cancelBtn.init();
       submitBtn.init();
       $('#shyj').val("");
   }
   return {
	   init :init
   }
});

