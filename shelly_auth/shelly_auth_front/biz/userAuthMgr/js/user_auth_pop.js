define(["jquery", "common", "compont", "wandaComp", "wandaCompR"], function ($, common, compont, wandaComp, wandaCompR) {

   var authPanel = {
     init:function(data){
         var par = {
             "userid":data['userid']
         };
         common.ajaxPost("user/createAuthCode",par,function(rda){
             $('#auth_code').html(rda['authCode']);
         },null,false,null);
     }
   };

    var createAuthBtn = {
        init:function(){
            $('#createAuth_btn').unbind('click');
            $('#createAuth_btn').on('click',function(){
                $('#createAuth_btn').trigger("afterClick");
            });
        }
    }

   var init = function(data){
       authPanel.init(data);
       createAuthBtn.init();
   }
   return {
	   init :init
   }
});

