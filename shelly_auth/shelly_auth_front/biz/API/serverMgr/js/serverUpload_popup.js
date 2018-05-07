define(["jquery", "common", "wandaComp","fileupload"], function ($, common, wandaComp,fileupload) {
    var cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#serverMgrUpload_cancel").unbind("click");
            $("#" + parentIds).find("#serverMgrUpload_cancel").click(function () {
                $("#" + parentIds).find("#serverMgrUpload_cancel").trigger("afterClick");
            });
        }
    };
    var  fileupload = {
        init:function () {
            var serverId = $("#serverMgrUpload_serverId").val();
            var serverName = $("#serverMgrUpload_serviceName").val();
            var url = common.baseUrl + "api/gateService/upLoadAppRecommend?serviceId="+serverId+"&serviceName="+serverName;
            $('#serverMgrUpload_fileupload').fileupload({
                url: url,
                dataType: 'json',
                singleFileUploads: true,
                autoUpload: false,
                done: function (e, data) {
                    if(data["_response"]["result"]["returnTag"] == 0){
                        /*$("#serverMgrUpload_result").html("");
                        $("#serverMgrUpload_result").append('<div class="form-group">' +
                            '<label class="control-label col-xs-2 p0">上传结果:</label> ' +
                            '<div class="col-xs-8" style="padding-top: 7px">'+data["files"][0]["name"]+'  上传成功' +
                            '</div> ' +
                            '</div>');*/
                        common.jqConfirm.alert({
                            title: 1,
                            content: "文档上传成功",
                            call:function () {
                                $("#serverMgrUpload_fileupload").removeAttr("disabled");
                                $("#serverMgrUpload_cancel").trigger("afterClick");
                            }
                        });
                    }else{
                        common.jqConfirm.alert({
                            title: 0,
                            content: data["_response"]["result"]["returnMsg"]
                        });
                    }
                }
            }).on("fileuploadadd",function (e,data) {
                var uploadErrors = [];

                var acceptFileTypes = /\/(rar|zip)$/i;
                var name = data.originalFiles[0]["name"];
                var style = name.split(".");
                if (style.length > 1 && (style[style.length-1] == "zip" || style[style.length-1] == "rar")) {
                } else {
                    uploadErrors.push('文档格式不正确');
                }
                if (data.originalFiles[0]['size'] > 100 * 1024 * 1024) {
                    uploadErrors.push('文档大小不能超过100M');
                }
                if (uploadErrors.length > 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: uploadErrors
                    });
                } else {
                    $.each(data.files, function (index, file) {
                        $('#serverMgrUpload_files').val(file.name);
                    });
                    $("#serverMgrUpload_save").click(function () {
                        $("#serverMgrUpload_cancel").trigger("afterClick");
                        data.submit();
                    });
                }
               }
            );

        }
    }
    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        cancelBtn.init("serverList_uploadPopup");
    };
    return {
        init: init,
        load:fileupload
    };
});

