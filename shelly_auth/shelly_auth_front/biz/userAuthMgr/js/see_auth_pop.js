define(["jquery", "common", "compont", "wandaComp", "wandaCompR","date_time_Picker"], function ($, common, compont, wandaComp, wandaCompR,dtp) {

   var temp = {};
   var seeauthcancelbtn = {
       init:function(){
           $('#see_auth_cancel_btn').unbind('click');
           $('#see_auth_cancel_btn').on('click',function(){
                $('#see_auth_cancel_btn').trigger("afterClick");
           });
       }
   }

   var panelInit = {
        init:function(data){
            var authId = temp.authId;
            common.ajaxPost("auth/byId",
                {"authId":authId},
                function(data){
                    $('#seeAuth_auth').html(data['authCode']);
                    $('#seeAuth_dataname').html(data['dataName']);
                    $('#seeAuth_startTime').html(data['beginTime']);
                    $('#seeAuth_endTime').html(data['endTime']);
                    var takeStyles = data['takeStyle'].split(",");
                    var map = {
                        "1":"webService方式",
                        "2":"网页下载"
                    }
                    var takStr = "";
                    for(var p in takeStyles){
                        takStr += map[takeStyles[p]+""]+" ";
                    }
                    $('#takeStyle').html(takStr);
                },
                function(){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "加载失败！"
                    });
                },
                null, null);
            common.ajaxPost("auth/seeRes",
                {"authId":temp.authId},
                function(data){
                    var list = []
                    for(var i in data.treeList){
                        var treeNode = showTreeNode(data.treeList[i]);
                        list.push(treeNode)
                    }
                    temp['zTreeNodes'] = list;
                },
                function(){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "加载失败！"
                    });
                },
            false, null);
        }
   }

   function showTreeNode(d){
       var a = {};
       a['name'] = d['name'];
       a['children'] = [];
       a['open']=true;
       if(d['list']&&d['list'].length>0){
           for(var p in d['list']){
            var td = showTreeNode(d['list'][p]);
            a['children'].push(td);
          }
       }
       return a;
   }

//   var resouceTree = {
//       tree:{},
//       init:function(){
//           var option = {
//               childKey: "list",
//               textKey: "name",
//               openKey:'open',
//               checkKey:'checked',
//               noCache: false,
//               treeDom: $("#resTree1"),
//               queryKey: "rid",
//               queryData: function(id, fun) {
//                   var authId = temp.authId;
//                   if(temp["first"]){
//                       common.ajaxPost("auth/seeRes",
//                           {"authId":authId},
//                           function(data){
//                               fun(data.treeList);
//                           },
//                           function(){
//                               common.jqConfirm.alert({
//                                   title: 0,
//                                   content: "加载失败！"
//                               });
//                           },
//                           false, null);
//                       temp["first"] = false;
//                   }
//               }
//           };
//           resouceTree.tree = new wandaComp.wandaTreeView(option);
//           resouceTree.tree.init();
//       }
//   }

   var resouceTree ={
       init:function(){
           var setting = {
               view: {
                   showIcon: false,
                   showLine: false
               }
           };
           var treeId = "zTree" + (new Date).valueOf();
           var dom = $('<ul id="' + treeId + '" class="ztree"></ul>');
           dom.appendTo($("#resTree1"));
           $.fn.zTree.init(dom, setting, temp['zTreeNodes']);
       }
   }

   var init = function(data){
       $('#resTree1').html("");
       temp = data;
       seeauthcancelbtn.init();
       panelInit.init(data);
       resouceTree.init();
   }
   return {
	   init :init
   }
});

