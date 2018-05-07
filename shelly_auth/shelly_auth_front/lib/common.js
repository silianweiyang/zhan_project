define(["jquery", "jqConfirm"], function($) {
    var baseUrl = "service/";
    var session = {};
    var debugTag = false;
    var routerParams;
    var initExeOut = function(eleId, fun) {
        return function() {
            initExe(eleId, fun);
        }
    };
    var initExe = function(eleId, fun) {
        var isLoad = $("#" + eleId).length;
        if (isLoad == 1) {
            fun();
        } else {
            setTimeout(initExeOut(eleId, fun), 500);
        }
    };

    var initExeByAttrOut = function(rootId, attr, fun) {
        return function() {
            initExeByAttr(rootId, attr, fun);
        }
    };
    var initExeByAttr = function(rootId, attr, fun) {
        var isLoad = $("#" + rootId).find("[" + attr + "]").length;
        if (isLoad == 1) {
            fun();
        } else {
            setTimeout(initExeByAttrOut(rootId, attr, fun), 500);
        }
    };
    var setRouterParams = function(rParams) {
        routerParams = rParams;
    }
    var getRouterParams = function() {
        var param = routerParams;
        routerParams = "";
        return param;
    }


    var setSession = function(sess) {
        session = sess;
    };
    var getSession = function() {
        return session;
    };
    var getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
    var userInfo = {
        getUserUrl: "app/login/currentUser",
        getCurrentUser: function() {
            var session = getSession();
            if (session["userInfo"]) {
                return session;
            } else {
                ajaxGet(userInfo.getUserUrl, null, function(data) {
                    setSession(data)
                }, function () {
                    if(!window.redirect){
                        window.parent.parent.location.href = "Login.html";
                    }
                }, false);
                return getSession();
            }
        }
    }
    var contentHeight = function() {
        var winHeight = ((window.innerHeight - $("#top")[0].offsetHeight) - 42) + 'px';
        return winHeight
    };
    var login = {
        loginUrl: "app/login/signIn",
        logOutUrl: "app/login/signUp",
        signIn: function signIn(accountCode, passward, fromOrg, successFun, errorFun) {
            //var param = {"accountCode":accountCode,"orgId":fromOrg, "password": passward};
            var param = { "accountCode": accountCode, "password": passward };
            ajaxPost(this.loginUrl, param, successFun, errorFun, false);
        },
        signUp: function singUp() {
            var successFun = function(data) {
                window.location.href = "Login.html";
            };
            ajaxPost(this.logOutUrl, null, successFun, function(){}, false);
        }
    };
    var showError = function(title, message) {
        var notificationElement = $("#notification").wandaNotification({
            autoHideAfter: false,
            position: {
                bottom: 50,
                right: 30
            },
            templates: [{
                type: "wrong",
                template: ' <div id="notificationDiv" class="wrong-pass"> <img src="images/error-icon.png" />  <h3>#= title #</h3> <p>#= message #</p> </div>'
            }]
        });

        var notificationWidget = notificationElement.data("wandaNotification");
        notificationWidget.show({
            title: title,
            message: message
        }, "wrong");
    }
    var ajaxGet = function(url, param, successFun, errFun, isAsync, loadDom) {
        if (isAsync == null || isAsync == undefined) {
            isAsync = true;
        }
        var par = { "map": JSON.stringify(param) }
        $.ajax({
            url: baseUrl + url,
            type: 'GET',
            headers: { "Content-Type": "application/json" },
            data: par,
            async: isAsync,
            cache: false,
            timeout: 10000,
            success: function(data) {
                if (data["returnTag"] == 0) {
                    successFun(data["returnData"]);
                } else if (data["returnTag"] == 404) {
                    window.parent.parent.location.href = "Login.html";
                } else {
                    if (errFun) {
                        errFun(data);
                    } else {
                        jqConfirm.alert({
                            title: 0,
                            content: "失败！:" + data["returnMsg"]
                        });
                    }
                }

            },
            error: function (XMLHttpRequest,textStatus, errorThrown) {
                    var redirect = XMLHttpRequest.status;
                    if(redirect==401) {
                       var isRedirct =  XMLHttpRequest.getResponseHeader("REDIRECT");
                       var path =  XMLHttpRequest.getResponseHeader("CONTEXTPATH");
                        if (isRedirct) {
                            window.redirect = isRedirct;
                        }
                        if (path) {
                            window.redirectHref =path;
                        }
                        if (window.redirect == "REDIRECT") {
                            var win = window;
                            while (win != win.top) {
                                win = win.top;
                            }
                            win.location.href = window.redirectHref;
                        }
                    }
                if (errFun) {
                    errFun();
                } else if (errorThrown == "timeout") {
                    jqConfirm.alert({
                        title: 0,
                        content: "服务超时！"
                    });
                } else {
                    jqConfirm.alert({
                        title: 0,
                        content: textStatus.status + ":" + textStatus.statusText
                    });
                }
            },
            beforeSend: function() {
                if (loadDom) {
                    wanda.ui.progress(loadDom, true);
                }

            },
            complete: function() {
                if (loadDom) {
                    wanda.ui.progress(loadDom, false);
                }
            }
        });
    }
    var ajaxPost = function(url, param, successFun, errFun, isAsync, loadDom) {
        if (isAsync == null || isAsync == undefined) {
            isAsync = true;
        }
        $.ajax({
            url: baseUrl + url,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(param),
            async: isAsync,
            cache: false,
            timeout: 10000,
            success: function(data) {
                if (data["returnTag"] == 0) {
                    successFun(data["returnData"]);
                } else if (data["returnTag"] == 404) {
                    window.parent.parent.location.href = "Login.html";
                } else {
                    if (errFun) {
                        errFun(data);
                    } else {
                        jqConfirm.alert({
                            title: 0,
                            content: "失败信息：" + data["returnMsg"]
                        });
                    }
                }
            },
            error: function (XMLHttpRequest,textStatus, errorThrown) {
                var redirect = XMLHttpRequest.status;
                if(redirect==401) {
                    var isRedirct =  XMLHttpRequest.getResponseHeader("REDIRECT");
                    var path =  XMLHttpRequest.getResponseHeader("CONTEXTPATH");
                    if (isRedirct) {
                        window.redirect = isRedirct;
                    }
                    if (path) {
                        window.redirectHref =path;
                    }
                    if (window.redirect == "REDIRECT") {
                        var win = window;
                        while (win != win.top) {
                            win = win.top;
                        }
                        win.location.href = window.redirectHref;
                    }
                }
                if (errFun) {
                    errFun();
                } else if (errorThrown == "timeout") {
                    jqConfirm.alert({
                        title: 0,
                        content: "服务超时！"
                    });
                } else {
                    jqConfirm.alert({
                        title: 0,
                        content: textStatus.status + ":" + textStatus.statusText
                    });
                }
            },
            beforeSend: function() {
                if (loadDom) {
                    wanda.ui.progress(loadDom, true);
                }

            },
            complete: function() {
                if (loadDom) {
                    wanda.ui.progress(loadDom, false);
                }
            }
        });
    };

    var ajaxPut = function(url, param, successFun, errFun, isAsync, loadDom) {
        if (isAsync == null || isAsync == undefined) {
            isAsync = true;
        }
        $.ajax({
            url: baseUrl + url,
            type: 'PUT',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(param),
            async: isAsync,
            cache: false,
            timeout: 10000,
            success: function(data) {
                if (data["returnTag"] == 0) {
                    successFun(data["returnData"]);
                } else if (data["returnTag"] == 404) {
                    window.parent.parent.location.href = "Login.html";
                } else {
                    if (errFun) {
                        errFun(data);
                    } else {
                        jqConfirm.alert({
                            title: 0,
                            content: "失败信息：" + data["returnMsg"]
                        });
                    }
                }
            },
            error: function (XMLHttpRequest,textStatus, errorThrown) {
                var redirect = XMLHttpRequest.status;
                if(redirect==401) {
                    var isRedirct =  XMLHttpRequest.getResponseHeader("REDIRECT");
                    var path =  XMLHttpRequest.getResponseHeader("CONTEXTPATH");
                    if (isRedirct) {
                        window.redirect = isRedirct;
                    }
                    if (path) {
                        window.redirectHref =path;
                    }
                    if (window.redirect == "REDIRECT") {
                        var win = window;
                        while (win != win.top) {
                            win = win.top;
                        }
                        win.location.href = window.redirectHref;
                    }
                }
                if (errFun) {
                    errFun();
                } else if (errorThrown == "timeout") {
                    jqConfirm.alert({
                        title: 0,
                        content: "服务超时！"
                    });
                } else {
                    jqConfirm.alert({
                        title: 0,
                        content: textStatus.status + ":" + textStatus.statusText
                    });
                }
            },
            beforeSend: function() {
                if (loadDom) {
                    wanda.ui.progress(loadDom, true);
                }

            },
            complete: function() {
                if (loadDom) {
                    wanda.ui.progress(loadDom, false);
                }
            }
        });
    };
    var ajaxDelete = function(url, param, successFun, errFun, isAsync, loadDom) {
        if (isAsync == null || isAsync == undefined) {
            isAsync = true;
        }
        $.ajax({
            url: baseUrl + url,
            type: 'DELETE',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(param),
            async: isAsync,
            cache: false,
            timeout: 10000,
            success: function(data) {
                if (data["returnTag"] == 0) {
                    successFun(data["returnData"]);
                } else if (data["returnTag"] == 404) {
                    window.parent.parent.location.href = "Login.html";
                } else {
                    if (errFun) {
                        errFun(data);
                    } else {
                        jqConfirm.alert({
                            title: 0,
                            content: "失败信息：" + data["returnMsg"]
                        });
                    }
                }
            },
            error: function (XMLHttpRequest,textStatus, errorThrown) {
                var redirect = XMLHttpRequest.status;
                if(redirect==401) {
                    var isRedirct =  XMLHttpRequest.getResponseHeader("REDIRECT");
                    var path =  XMLHttpRequest.getResponseHeader("CONTEXTPATH");
                    if (isRedirct) {
                        window.redirect = isRedirct;
                    }
                    if (path) {
                        window.redirectHref =path;
                    }
                    if (window.redirect == "REDIRECT") {
                        var win = window;
                        while (win != win.top) {
                            win = win.top;
                        }
                        win.location.href = window.redirectHref;
                    }
                }
                if (errFun) {
                    errFun();
                } else if (errorThrown == "timeout") {
                    jqConfirm.alert({
                        title: 0,
                        content: "服务超时！"
                    });
                } else {
                    jqConfirm.alert({
                        title: 0,
                        content: textStatus.status + ":" + textStatus.statusText
                    });
                }
            },
            beforeSend: function() {
                if (loadDom) {
                    wanda.ui.progress(loadDom, true);
                }

            },
            complete: function() {
                if (loadDom) {
                    wanda.ui.progress(loadDom, false);
                }
            }
        });
    };

    var dateFormat = function(_date) {
        var y = _date.getFullYear();
        var m = _date.getMonth() + 1;
        var d = _date.getDate();
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    };
    var jqConfirm = {
        _lastErrTime: null,
        _errInterval: 1000,
        alert: function(option) {
            if (option.title !== 1 && jqConfirm._lastErrTime !== null) {
                var diff = new Date().getTime() - jqConfirm._lastErrTime;
                if (diff <= jqConfirm._errInterval) {
                    jqConfirm._lastErrTime = new Date().getTime();
                    return;
                }
            }
            if (option.title !== 1) {
                jqConfirm._lastErrTime = new Date().getTime();
            }
            var title = option.title == 1 ? "成功" : "失败";
            var call = typeof option.call == "function" ? option.call : function() {};
            $.alert({
                closeIcon: false,
                title: title,
                content: option.content,
                buttons: {
                    ok: {
                        text: '确定',
                        keys: ['enter'],
                        action: call
                    }
                }
            });
        },
        confirm: function(option) {
            var title = "确认框";
            var call = typeof option.call == "function" ? option.call : function() {};
            $.confirm({
                closeIcon: false,
                title: title,
                content: option.content,
                buttons: {
                    ok: {
                        text: '确定',
                        keys: ['enter'],
                        action: call
                    },
                    cancel: {
                        text: '取消'
                    }
                }
            });
        }

    };
    ////////////////TEST///////////////////////////////////
    //function ajaxGet(url,param,successFun,errFun,isAsync) {
    //   var data ={"data":{}};
    //   var getUserUrl= "app/login/currentUser";
    //    if(url==getUserUrl){
    //        var ret = testData.session;
    //        data = ret["returnData"];
    //    }
    //    successFun(data);
    //}
    //function ajaxPost(url,param,successFun,errFun,isAsync) {
    //    var data ={"returnData":{}};
    //    var loginUrl= "app/login/signIn";
    //    var logOutUrl= "app/login/signUp";
    //    if(url==loginUrl){
    //        data = testData.session["returnData"];
    //     }else if(url==logOutUrl){
    //        data={};
    //    }
    //    successFun(data);
    //}

    ////////////////TEST///////////////////////////////////


    return {
        baseUrl: baseUrl,
        ajaxGet: ajaxGet,
        ajaxPost: ajaxPost,
        ajaxPut: ajaxPut,
        ajaxDelete: ajaxDelete,
        contentHeight: contentHeight,
        login: login,
        getCurrentUser: userInfo.getCurrentUser,
        debugTag: debugTag,
        getUrlParam: getUrlParam,
        showError: showError,
        initExe: initExe,
        initExeByAttr: initExeByAttr,
        dateFormat: dateFormat,
        jqConfirm: jqConfirm,
        setRouterParams: setRouterParams,
        getRouterParams: getRouterParams
    }
});