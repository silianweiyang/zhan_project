var userid;
define(["jquery", "common", "compont", "wandaComp", "wandaCompR"], function ($, common, compont, wandaComp, wandaCompR) {

   var levelSelector = {
     init:function(data){
         var dic = data['dictObj']['datas'];
         userid = data['userid']
         $('#user_level').wandaDropDownList({
             dataSource:dic,
             dataTextField: "NAME",
             dataValueField: "CODE"
         });
         $("#user_level").data("wandaDropDownList").value(data['userLevel']);
     }
   };

   var submitBtn = {
       init:function(){
           $('#userLevel_submit_btn').unbind('click');
           $('#userLevel_submit_btn').on('click',function(){
               var level = $('#user_level').val();
               var par = {
                   "userid":userid,
                   "userLevel":level
               }
               common.ajaxPost("user/setLevel",par,function(rda){
                   common.jqConfirm.alert({
                        title:1,
                        content:rda.msg
                   });
                   $('#auth_code').html(rda['authCode']);
               },null,false,null);
               $('#userLevel_submit_btn').trigger("afterClick");
           });
       }
   }

   var cancelBtn = {
       init:function(){
           $('#userLevel_cancel_btn').unbind('click');
           $('#userLevel_cancel_btn').on('click',function(){
                $('#userLevel_cancel_btn').trigger("afterClick");
           });
       }
   }

   var init = function(data){
       levelSelector.init(data);
       cancelBtn.init();
       submitBtn.init();
   }
   return {
	   init :init
   }
});

