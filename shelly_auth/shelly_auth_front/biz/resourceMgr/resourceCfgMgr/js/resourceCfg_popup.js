define(["jquery", "common", "wandaComp", "wandaCompR"], function ($, common, wandaComp, wandaCompR) {
    var curObj = {};
    //数据源下拉框
    var resource_dataSource_DropDownList = {
        successFun : function(data){
            var res_dataSource = $("#resource_dataSource").data("wandaDropDownList");
            res_dataSource.setDataSource(data.datas);
        },
        init: function () {
            $("#resource_dataSource").wandaDropDownList({
                optionLabel: {
                    dataSourceName: "请选择",
                    dataSourceId: ""
                },
                dataTextField: "dataSourceName",
                dataValueField: "dataSourceId",
                index: 0,
                change: function (e) {
                    sourceTableList.init($("#resource_dataSource").val());
                    $("#resource_field_list").empty();
                },
                open: function (e) {
                    $("#resource_dataSource-list").css("height", "auto");
                    $("#resource_dataSource-list").css("overflow", "hidden");
                }
            });
            var param = {
                paramObj: {
                    type:"1",
                    status:"2"
                }
            };
            common.ajaxPost("dsDataSource/sourceList", param, resource_dataSource_DropDownList.successFun, null, null, $("#resourceCfgPopup"));
        }
    };

    var resource_dataSource_DropDownList_forUpdate = {
        successFun : function(data){
            $("#resource_dataSource").wandaDropDownList({
                dataSource: [{
                    dataSourceName: data.datas.dataSourceName,
                    dataSourceId: curObj.datasourceId
                }],
                dataTextField: "dataSourceName",
                dataValueField: "dataSourceId",
                index: 0
            });
        },
        init: function () {
            var param = {
                dataSourceId:curObj.datasourceId
            };
            common.ajaxPost("dsDataSource/loadDataSourceById", param, resource_dataSource_DropDownList_forUpdate.successFun, null, null, $("#resourceCfgPopup"));
        }
    };

    //存储源下拉框
    var resource_storageSource_DropDownList = {
        successFun : function(data){
            var res_storageSource = $("#resource_storageSource").data("wandaDropDownList");
            res_storageSource.setDataSource(data.datas);

            //设置默认选中值
            if($("#btnOpt").val() == "UPDATE"){
                res_storageSource.value(curObj.storageId)
            }
        },
        init: function () {
            $("#resource_storageSource").wandaDropDownList({
                optionLabel: {
                    dataSourceName: "请选择",
                    dataSourceId: ""
                },
                dataTextField: "dataSourceName",
                dataValueField: "dataSourceId",
                index: 0
            });
            var param = {
                paramObj: {
                    type:"2",
                    status:"2"
                }
            };
            common.ajaxPost("dsDataSource/sourceList", param, resource_storageSource_DropDownList.successFun, null, null, $("#resourceCfgPopup"));
        }
    };

    //接入源表
    var sourceTableList = {
        successFun:function (data) {
            var htmlText = '';
            $.each(data.datas,function (i,v) {
                htmlText += '<li value="'+v.TABLE_NAME+'">'+v.TABLE_NAME+'</li>';
            });
            $("#source_table_list").html(htmlText);
            $("#source_table_list li").bind("click",function(){
                $(this).addClass("source-table-list-li-active").siblings().removeClass("source-table-list-li-active");
                $("#restable_name").val($(this).text());
                loadFieldList.init($(this).text());
            });
        },
        init:function (dataSourceId) {
            var param = {
                dataSourceId:dataSourceId
            };
            common.ajaxPost("resourceConfig/querySourceTable", param, sourceTableList.successFun, null, null, $("#resourceCfgPopup"));
        }
    }

    var sourceTableList_forUpdate = {
        init:function (sourceTableName) {
            $("#source_table_list").html('<li class="source-table-list-li-active" value="'+sourceTableName+'">'+sourceTableName+'</li>');
        }
    }

    //加载字段列表
    var loadFieldList = {
        successFun: function (data) {
           var htmlText = '';
           $.each(data.datas,function(i,v){
               htmlText += '<tr>';
               htmlText += '<td><input type="checkbox" name="chk" id="'+v.FIELD_NAME+'"></td>';
               htmlText += '<td name="fieldName" id="fieldName_'+v.FIELD_NAME+'">'+v.FIELD_NAME+'</td>';
               if(v.FIELD_LENGTH != null && v.FIELD_PRECISION != null){
                   htmlText += '<td name="fieldType" id="fieldType_'+v.FIELD_NAME+'" fieldType="'+v.FIELD_TYPE +'" fieldLength="'+v.FIELD_LENGTH +'" fieldPrecision="'+v.FIELD_PRECISION+'">'+v.FIELD_TYPE+'('+v.FIELD_LENGTH +','+v.FIELD_PRECISION+')</td>';
               }else if(v.FIELD_LENGTH != null && v.FIELD_PRECISION == null){
                   htmlText += '<td name="fieldType" id="fieldType_'+v.FIELD_NAME+'" fieldType="'+v.FIELD_TYPE +'" fieldLength="'+v.FIELD_LENGTH +'" fieldPrecision="">'+v.FIELD_TYPE+'('+v.FIELD_LENGTH +')</td>';
               }else{
                   htmlText += '<td name="fieldType" id="fieldType_'+v.FIELD_NAME+'" fieldType="'+v.FIELD_TYPE +'" fieldLength="" fieldPrecision="">'+v.FIELD_TYPE+'</td>';
               }
               if(v.FIELD_DESC != null){
                   htmlText += '<td name="fieldDesc" id="fieldDesc_'+v.FIELD_NAME+'">'+v.FIELD_DESC+'</td>';
               }else{
                   htmlText += '<td name="fieldDesc" id="fieldDesc_'+v.FIELD_NAME+'"></td>';
               }
               var cls = '';
               if(Number(v.FIELD_PRIMARY) > 0){
                   cls = 'checked="checked"';
               }
               htmlText += '<td><input type="checkbox" name="isPrimary" id="isPrimary_'+v.FIELD_NAME+'" '+cls+'></td>';
               htmlText += '<td><input type="checkbox" name="isOpen" id="isOpen_'+v.FIELD_NAME+'"></td>';
               htmlText += '<td><input type="checkbox" name="isEncrypt" id="isEncrypt_'+v.FIELD_NAME+'"></td>';
               htmlText += '<td><select name="fieldLevel" id="fieldLevel_'+v.FIELD_NAME+'"><option value="1">1级</option><option  value="2">2级</option><option  value="3">3级</option></select></td>';
               htmlText += '<td><input type="radio" name="fieldIncrement" id="fieldIncrement_'+v.FIELD_NAME+'"></td>';
               htmlText += '</tr>';
           });
           $("#resource_field_list").html(htmlText);
            checkbox_click.init();
        },
        init:function (tableName) {
            var param = {
                "dataSourceId":$("#resource_dataSource").val(),
                "tableName": tableName
            }
            common.ajaxPost("resourceConfig/querySourceTableFields", param, loadFieldList.successFun, null, null, $("#resourceCfgPopup"));
        }
    }

    var loadFieldList_forUpdate = {
        resFields: [],
        successFun: function (data) {
            var htmlText = '';
            $.each(data.datas,function(i,v){
                var isHad = false;  //是否已勾选入配置
                var isPk = false;   //是否为主键
                var isOp = false;   //是否开放
                var isEn = false;   //是否加密
                var isIncre = false;//是否增量字段
                $.each(loadFieldList_forUpdate.resFields,function(ix,va){
                    if(v.FIELD_NAME == va.fieldName){
                        isHad = true;
                        isPk = va.isPrimary == 1?true:false;
                        isOp = va.isOpen == 1?true:false;
                        isEn = va.isEncrypt == 1?true:false;
                        isIncre = curObj.incrementField == va.fieldName?true:false;
                        v.FIELD_LEVEL = va.encryptLevel;
                        return false;
                    }
                });
                var fieldChk = '';
                if(isHad) fieldChk = 'checked="checked"';
                var pkChk = '';
                if(isPk) pkChk = 'checked="checked"';
                var openChk = '';
                if(isOp) openChk = 'checked="checked"';
                var encryChk = '';
                if(isEn) encryChk = 'checked="checked"';
                var increChk = '';
                if(isIncre) increChk = 'checked="checked"';

                htmlText += '<tr>';
                htmlText += '<td><input type="checkbox" name="chk" id="'+v.FIELD_NAME+'" '+fieldChk+'></td>';
                htmlText += '<td name="fieldName" id="fieldName_'+v.FIELD_NAME+'">'+v.FIELD_NAME+'</td>';
                if(v.FIELD_LENGTH != null && v.FIELD_PRECISION != null){
                    htmlText += '<td name="fieldType" id="fieldType_'+v.FIELD_NAME+'" fieldType="'+v.FIELD_TYPE +'" fieldLength="'+v.FIELD_LENGTH +'" fieldPrecision="'+v.FIELD_PRECISION+'">'+v.FIELD_TYPE+'('+v.FIELD_LENGTH +','+v.FIELD_PRECISION+')</td>';
                }else if(v.FIELD_LENGTH != null && v.FIELD_PRECISION == null){
                    htmlText += '<td name="fieldType" id="fieldType_'+v.FIELD_NAME+'" fieldType="'+v.FIELD_TYPE +'" fieldLength="'+v.FIELD_LENGTH +'" fieldPrecision="">'+v.FIELD_TYPE+'('+v.FIELD_LENGTH +')</td>';
                }else{
                    htmlText += '<td name="fieldType" id="fieldType_'+v.FIELD_NAME+'" fieldType="'+v.FIELD_TYPE +'" fieldLength="" fieldPrecision="">'+v.FIELD_TYPE+'</td>';
                }
                if(v.FIELD_DESC != null){
                    htmlText += '<td name="fieldDesc" id="fieldDesc_'+v.FIELD_NAME+'">'+v.FIELD_DESC+'</td>';
                }else{
                    htmlText += '<td name="fieldDesc" id="fieldDesc_'+v.FIELD_NAME+'"></td>';
                }
                htmlText += '<td><input type="checkbox" name="isPrimary" id="isPrimary_'+v.FIELD_NAME+'" '+pkChk+'></td>';
                htmlText += '<td><input type="checkbox" name="isOpen" id="isOpen_'+v.FIELD_NAME+'" '+openChk+'></td>';
                htmlText += '<td><input type="checkbox" name="isEncrypt" id="isEncrypt_'+v.FIELD_NAME+'" '+encryChk+'></td>';
                htmlText += '<td><select name="fieldLevel" id="fieldLevel_'+v.FIELD_NAME+'">';
                if(v.FIELD_LEVEL == 1){
                    htmlText += '<option value="1" selected="selected">1级</option>';
                }else{
                    htmlText += '<option value="1">1级</option>';
                }
                if(v.FIELD_LEVEL == 2){
                    htmlText += '<option value="2" selected="selected">2级</option>';
                }else{
                    htmlText += '<option value="2">2级</option>';
                }
                if(v.FIELD_LEVEL == 3){
                    htmlText += '<option value="3" selected="selected">3级</option>';
                }else{
                    htmlText += '<option value="3">3级</option>';
                }
                htmlText += '</select></td>';
                htmlText += '<td><input type="radio" name="fieldIncrement" id="fieldIncrement_'+v.FIELD_NAME+'" '+increChk+'></td>';
                htmlText += '</tr>';
            });
            $("#resource_field_list").html(htmlText);
            checkbox_click.init();
        },
        init:function (tableName,resFields) {
            loadFieldList_forUpdate.resFields = resFields;
            var param = {
                "dataSourceId":$("#resource_dataSource").val(),
                "tableName": tableName
            };
            common.ajaxPost("resourceConfig/querySourceTableFields", param, loadFieldList_forUpdate.successFun, null, null, $("#resourceCfgPopup"));
        }
    }

    var loadReourceFields = {
        tableName : "",
        successFun:function (data) {
            loadFieldList_forUpdate.init(loadReourceFields.tableName, data.datas);
        },
        init:function (resId,sourceTableName) {
            loadReourceFields.tableName = sourceTableName;
            var param = {
                "resId":resId
            };
            common.ajaxPost("resourceConfig/queryReourceFields", param, loadReourceFields.successFun, null, null, $("#resourceCfgPopup"));
        }
    }

    //全选
    var checkAll = {
        init:function () {
            $("#checkAll").unbind("click");
            $("#checkAll").click(function () {
                if($(this).prop("checked") == true){
                    $("input[name='chk']").each(function () {
                        $(this).prop("checked",true);
                        //是否开发也设置为全勾选
                        $("#isOpen_"+$(this).attr("id")).prop("checked",true);
                    });
                }else{
                    $("input[name='chk']").each(function () {
                        $(this).prop("checked",false);
                        //是否开发也取消全勾选
                        $("#isOpen_"+$(this).attr("id")).prop("checked",false);
                    });
                }
            });
        }
    }

    //checkbox绑定单击事件
    var checkbox_click = {
        init:function () {
            $("input[name='chk']").each(function () {
                var obj = this;
                $(obj).bind("click",function () {
                    //控制全选（非全选）
                    if($(this).prop("checked") == false){
                        $("#checkAll").prop("checked",false);
                        //是否开放取消勾选
                        $("#isOpen_"+$(this).attr("id")).prop("checked",false);
                    }else{
                        if($("input[name='chk']:checked").length == $("input[name='chk']").length){
                            $("#checkAll").prop("checked",true);
                        }
                        //是否开放设置为勾选
                        $("#isOpen_"+$(this).attr("id")).prop("checked",true);
                    }
                });
            });
        }
    }

    var submitForm = {
        validateForm:function(){
            if($("#res_code").val() == ""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入资源代码！"
                });
                return false;
            }
            if($("#res_name").val() == ""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入资源名称！"
                });
                return false;
            }
            if($("#resource_dataSource").val() == ""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择数据源！"
                });
                return false;
            }
            if($("input[name='isIncrement']:checked").val() == "1" && $("input[name='fieldIncrement']:checked").length == 0){
                common.jqConfirm.alert({
                    title: 0,
                    content: "支持增量采集时，请选择增量字段！"
                });
                return false;
            }
            if($("input[name='chk']:checked").length == 0){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请勾选资源字段！"
                });
                return false ;
            }
            if($("#resource_storageSource").val() == ""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请选择存储源！"
                });
                return false ;
            }
            return true
        },
        pupopId:"",
        successFun:function () {
            common.jqConfirm.alert({
                title: 1,
                content: "操作成功！",
                call: function () {
                    $("#" + submitForm.pupopId).find("#submit").trigger("afterClick");
                }
            });
        },
        init:function (parentIds,dirId,opt) {
            submitForm.pupopId = parentIds;
            var btn_id = "submit";
            if(opt == "2"){
                btn_id = "start";
            }
            $("#" + parentIds).find("#"+btn_id).unbind("click");
            $("#" + parentIds).find("#"+btn_id).click(function () {
                if(!submitForm.validateForm()){
                    return;
                }
                //获取选中的字段
                var fields = [];
                var allFileds = [];
                $("input[name='chk']").each(function(){
                    var _fieldName = $(this).attr("id");
                    var _fieldType = $("#fieldType_"+_fieldName).attr("fieldType");
                    var _fieldLength = $("#fieldType_"+_fieldName).attr("fieldLength");
                    var _fieldPrecision=$("#fieldType_"+_fieldName).attr("fieldPrecision");
                    var _fieldDesc = $("#fieldDesc_"+_fieldName).text();
                    var _isPrimary = $("#isPrimary_"+_fieldName).prop("checked");
                    var _fieldIsOpen = $("#isOpen_"+_fieldName).prop("checked");
                    var _filedIsEncrypt= $("#isEncrypt_"+_fieldName).prop("checked");
                    var _filedLevel= $("#fieldLevel_"+_fieldName).val();
                    var _fieldIncrement = $("#fieldIncrement_"+_fieldName).prop("checked");
                    var field = {
                        fieldName:_fieldName,
                        fieldType:_fieldType,
                        fieldLength:_fieldLength,
                        fieldPrecision:_fieldPrecision,
                        fieldDesc:_fieldDesc,
                        fieldPrimary:_isPrimary,
                        fieldIsOpen:_fieldIsOpen,
                        filedIsEncrypt:_filedIsEncrypt,
                        filedLevel:_filedLevel,
                        fieldIncrement:_fieldIncrement
                    };
                    if($(this).prop("checked")){
                        fields.push(field);
                    }
                    allFileds.push(field)
                });
                var param = {
                    dirId:dirId,
                    resCode:$("#res_code").val(),
                    isOpen:$("input[name='isOpen']:checked").val(),
                    resName:$("#res_name").val(),
                    isIncrement:$("input[name='isIncrement']:checked").val(),
                    dataSourceId:$("#resource_dataSource").val(),
                    resSource:$("input[name='resourceSource']:checked").val(),
                    sourcetableName:$(".source-table-list-li-active").text(),
                    storageId:$("#resource_storageSource").val(),
                    restableName:$("#restable_name").val(),
                    resStatus:opt,
                    describe:$("#resource_describe").val(),
                    fields:fields,
                    allFileds:allFileds
                };
                if($("#btnOpt").val() == "ADD"){
                    common.ajaxPost("resourceConfig/save",param,submitForm.successFun,null,null,null);
                }
                if($("#btnOpt").val() == "UPDATE"){
                    param.resId = curObj.resId;
                    common.ajaxPut("resourceConfig/update",param,submitForm.successFun,null,null,null)
                }
            });
        }
    }

    var startBtn = {
        init: function (parentIds, dirId) {
            submitForm.init(parentIds, dirId, "2");
        }
    };

    var saveBtn = {
        init: function (parentIds, dirId) {
            submitForm.init(parentIds, dirId, "1");
        }
    };

    var cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#cancel").unbind("click");
            $("#" + parentIds).find("#cancel").click(function () {
                $("#" + parentIds).find("#cancel").trigger("afterClick");
            });
        }

    };

    var init = function (parentId,dirId, selectItem) {
        curObj = selectItem;
        if(selectItem){ //selectItem不为undefined时为更新操作
            resource_dataSource_DropDownList_forUpdate.init();
            sourceTableList_forUpdate.init(selectItem.sourcetableName);
            loadReourceFields.init(selectItem.resId,selectItem.sourcetableName);
        }else{          //selectItem为undefined时为新增操作
            resource_dataSource_DropDownList.init();
        }
        resource_storageSource_DropDownList.init();
        checkAll.init();
        startBtn.init(parentId, dirId);
        saveBtn.init(parentId, dirId);
        cancelBtn.init(parentId);
    };
    return {
        init: init
    }
});
