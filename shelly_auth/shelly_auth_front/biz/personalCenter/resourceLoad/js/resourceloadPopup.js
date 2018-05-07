define(["jquery", "common", "compont", "wandaComp", "wandaCompR"], function ($, common, compont, wandaComp, wandaCompR) {

    var statusTypeDic =[{"NAME":"生成中","CODE":"1"},{"NAME":"已生成","CODE":"2"},{"NAME":"已失效","CODE":"3"}];

    var formData={

        successFun:function(data){

            $("#seeAuth_auth").html( data["authCode"]);
            $("#seeAuth_dataname").html(data["resdownload"]["dataName"]);

            var t= new Date(data["resdownload"]["subscripTime"]);
            var subtime = t.toLocaleDateString().replace(/\//g, "-") + " " + t.toTimeString().substr(0, 8)

            $("#seeAuth_startTime").html(subtime);
            var t= new Date(data["resdownload"]["loseTime"]);
            var loseTime = t.toLocaleDateString().replace(/\//g, "-") + " " + t.toTimeString().substr(0, 8)

            $("#seeAuth_endTime").html(loseTime);
            $("#seeRecordCount").html(data["resdownload"]["recordCount"]);
            $("#seeResourceDes").html(data["resdownload"]["downloadDesc"]);
            var status = data["resdownload"]["downloadStatus"] ;
            for(var i=0;i<statusTypeDic.length-1;i++){
                if(statusTypeDic[i]["CODE"]==status){
                    status=statusTypeDic[i]["NAME"];
                    break;
                }
            }

            $("#seeResourceStatus").html(status);
            $("#seeAuthfield").empty();
            var fields = data["authFields"];
            for(var i=0;i<fields.length-1;i++){
                var tr = $("<tr class=\"ui-jqgrid-labels\" role=\"row\"></tr>");
                var td = $("<td class=\"ui-th-column ui-th-ltr\">"+fields[i]["FIELD_NAME"]+"</td>");
                tr.append(td);
                var td = $("<td class=\"ui-th-column ui-th-ltr\">"+fields[i]["FIELD_TYPE"]+"</td>");
                tr.append(td);
                $("#seeAuthfield").append(tr);
            }


        },
        init:function(param) {
            common.ajaxGet("resourcedownload/getAuthResInfo?fileId="+param,null,formData.successFun,null,null,null);
        }
    }


    var init = function (param) {

        formData.init(param);
    };
    return {
        init: init
    }
});


