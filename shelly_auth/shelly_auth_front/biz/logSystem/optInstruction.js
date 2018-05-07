define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {

    var download = function () {
        $("#signXml").attr("href",common.baseUrl+"download/fileDownload?fileName=SignXml");
        $("#sinatureDemo").attr("href",common.baseUrl+"download/fileDownload?fileName=sinatureDemo");
    }
    var leftInit = function () {
        $("#instruction_nav1").click(function(){
            $(this).find("a").addClass("selected");
            $(this).siblings().find("a").removeClass("selected");
            $("#instruction_tab1").show();
            $("#instruction_tab2").hide();
            $("#instruction_tab3").hide();
            $("#instruction_tab4").hide();
        })
        $("#instruction_nav2").click(function(){
            $(this).find("a").addClass("selected");
            $(this).siblings().find("a").removeClass("selected");
            $("#instruction_tab2").show();
            $("#instruction_tab1").hide();
            $("#instruction_tab3").hide();
            $("#instruction_tab4").hide();

        })
        $("#instruction_nav3").click(function(){
            $(this).find("a").addClass("selected");
            $(this).siblings().find("a").removeClass("selected");
            $("#instruction_tab3").show();
            $("#instruction_tab2").hide();
            $("#instruction_tab1").hide();
            $("#instruction_tab4").hide();

        })
        $("#instruction_nav4").click(function(){
            $(this).find("a").addClass("selected");
            $(this).siblings().find("a").removeClass("selected");
            $("#instruction_tab4").show();
            $("#instruction_tab2").hide();
            $("#instruction_tab1").hide();
            $("#instruction_tab3").hide();
        })
    }
    var extendInit = function () {
        download();
        leftInit();
    };
    return {
        init: extendInit
    };
});