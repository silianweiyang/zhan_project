define(["jquery", "wanda", "common", "main"], function ($, wanda, common, main) {

    var closeTabListener = function (pageId, func) {
        main.mainPage.addCloseTabListener(pageId, func);
    };

    var getCurrentDom = function (parentIds, operId) {
        var parNbr = parentIds.length;
        var dom = $("#" + parentIds[0]);
        for (var i =1; i <parNbr; i++) {
            if (dom) {
                dom = dom.find("#" + parentIds[i]);
            } else {
                dom = null;
                break;
            }
        }
        dom = dom.find("#" + operId);
        return dom;
    };
    var wandaWindowR = function (parentIds, operId, optionObj) {
        this.parentIds=parentIds.join("_");
        this.operId = operId;
        this.windowId = this.parentIds+"_"+this.operId ;
        this.operDom = getCurrentDom(parentIds, this.operId);
        var winDom =  $("<div/>");
        winDom.attr("id",this.windowId);
        this.operDom.append(winDom);

        this.optionObj = optionObj;

        this.windowDom = getCurrentDom(parentIds, this.windowId);
    };


    wandaWindowR.prototype.init = function (clickCallBack) {
        $("#"+this.windowId).wandaWindow({
            visible: false,
            draggable: false,
            title: this.optionObj["title"],
            minWidth: this.optionObj["minWidth"],
            minHeight: this.optionObj["minHeight"],
            maxWidth: this.optionObj["maxWidth"],
            maxHeight: this.optionObj["maxHeight"],
            modal: true,
            resizable: false,
            content: this.optionObj["content"]
        });



        var windowId = this.windowId;
        //关闭主页面销毁该window
        var contentDom = this.operDom.parents("[role='tabpanel']");
        var contentId = contentDom.attr("id");
        var tab = $("[aria-controls='" + contentId + "']")
        var id = tab.attr("tabId");
        closeTabListener(id, function () {
            $("#" + windowId).data("wandaWindow").destroy();
        });


        this.operDom.on("click", function () {
            if ('undefined' != (typeof clickCallBack)) {
                var isError = clickCallBack();
                if(isError){
                    return;
                }
            };
            $("#" + windowId).data("wandaWindow").center().open();
        });


    };
    wandaWindowR.prototype.callBack = function (elePos, callBack) {
        var windowId = this.windowId;
        var fun
        if ("undefined" == (typeof callBack) && "function" == typeof elePos) {
            fun = elePos;
            common.initExe(windowId, fun);
        } else {
            fun = function () {
                var ele = $("#" + windowId).find("[" + elePos + "]");
                ele.on("click", function () {
                   var isError =  callBack();
                    if(!isError){
                        $("#" + windowId).data("wandaWindow").close();
                    }

                });
            }
            common.initExeByAttr(windowId, elePos, fun);
        }

    }


    return {
        wandaWindowR: wandaWindowR,
        getCurrentDom:getCurrentDom
    }
});





