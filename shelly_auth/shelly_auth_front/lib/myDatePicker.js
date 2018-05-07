(function (f, define) {
    define(["jquery", "common", "wandaComp", "wandaCulture", "myDatePicker"], f);
})(
    function ($, common, wandaComp, wandaCulture, myDatePicker) {
        var __meta__ = {
            id: "mydatepicker",
            name: "myDatePicker",
            category: "web",
            description: "",
            depends: ["calendar", "popup"]
        };


        (function ($, undefined) {
            var wanda = window.wanda,
                ui = wanda.ui,
                Widget = ui.Widget;
            //???????不知道是什么作用
            //wanda.DateView = function(options){
            //    alert("wanda.DateView"+options);
            //};
            var datePicker = function (popupId, popAppendId, popAnchorId, popTriggerId, position, calendarId, calendarChangeCallBack) {
                this.popupId = popupId;
                this.popAppendId = popAppendId;
                this.popAnchorId = popAnchorId;
                this.position = position
                this.popTriggerId = popTriggerId;
                this.calendarId = calendarId;
                this.init = function () {

                    this.initCalendar();
                    this.clearDate();
                    this.initPopUp();
                    this.initTriggerBtn();
                };
                this.clearDate = function(){
                    var calendarId = this.calendarId;
                    $("#"+calendarId+"clear").on("click",function(e){
                        var calendar =  $("#" + calendarId).data("wandaCalendar");
                        if ("function" == typeof calendarChangeCallBack) {
                            calendarChangeCallBack("null");
                        }
                        $("#" + popupId).data("wandaPopup").close();
                      //  e.stopPropagation();
                        return false;
                    })
                }
                this.initCalendar = function () {
                    $("#" + this.calendarId).wandaCalendar({
                        max:new Date(),
                        culture: "zh-CN",
                        change: this.calendarChange,
                        footer: wanda.template( " <a  style='float:left ; margin-left:10px;'>#: wanda.toString(data, 'd') #</a>  "+"<span style='float:right ; margin-right:10px;' id='"+this.calendarId+"clear'>清除</span>")
                    });
                };
                this.initPopUp = function () {
                    $("#" + this.popupId).wandaPopup({
                        anchor: $("#" + this.popAnchorId),
                        appendTo: $("#" + this.popAppendId),
                        position: this.position
                    });
                };
                this.initTriggerBtn = function () {
                    var popup = $("#" + this.popupId).data("wandaPopup");
                    $("#" + this.popTriggerId).click(function () {
                        popup.open();
                    });
                };
                this.calendarChange = function () {
                    if ("function" == typeof calendarChangeCallBack) {
                        var value = common.dateFormat(this.value());
                        calendarChangeCallBack(value);
                    }
                    $("#" + popupId).data("wandaPopup").close();
                }

            }


            var DatePicker = Widget.extend({
                init: function (element, options) {
                    var that = this;
                    var root = $(element);
                    var rootId = root.attr("id");
                    var popId = rootId + "_popup";
                    var calendarId = rootId + "_calendar";
                    var selectIcoSpanId = rootId + "_selectIco";
                    var selectIcoSpan = $("<span/>");
                    var selectIco = $("<span/>");
                    selectIcoSpan.addClass("k-select");
                    //selectIcoSpan.attr("style", "position:relative; vertical-align: middle;z-index:100; display:inline-block;display:-moz-inline-box;");
                    selectIcoSpan.attr("id", selectIcoSpanId);
                    selectIco.addClass("k-icon");
                    selectIco.addClass("k-i-calendar");
                    selectIcoSpan.append(selectIco);
                    selectIcoSpan.appendTo(root);


                    var popUpSpan = $("<div/>");
                    var calendarSpan = $("<div/>");
                    popUpSpan.attr("id", popId);
                    calendarSpan.attr("id", calendarId);
                    calendarSpan.appendTo(popUpSpan);
                    popUpSpan.appendTo(root);


                    var endDateInput = {
                        init: function () {
                            var datePicker1 = new datePicker(popId, rootId, selectIcoSpanId, selectIcoSpanId, options["position"], calendarId, endDateInput.closeGetDate)
                            datePicker1.init();
                        },
                        closeGetDate: function (value) {
                            var _data = value;
                            that.trigger("close", _data);
                        }
                    };
                    endDateInput.init();
                    Widget.fn.init.call(this, element, options);
                },
                events: ["open", "close"],
                options: {
                    name: "MyDatePicker",
                    value: null,
                    position: "top left"
                },
                open: function () {
                    this.trigger("open");
                }
            });

            ui.plugin(DatePicker);

        })(window.wanda.jQuery);

        return window.wanda;

    }, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
        (a3 || a2)();
    });
