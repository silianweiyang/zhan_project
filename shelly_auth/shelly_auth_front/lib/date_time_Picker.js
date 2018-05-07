define(["jquery", "wanda", "common", "main"], function ($, wanda, common, main) {

        var wandaDateTimePicker = function (id, defVal, interval) {
            this.id = id;
            this.defVal = defVal;  //默认值
            this.interval = interval;  // 时间
        };
        wandaDateTimePicker.prototype.init = function () {
            var OpenFunc = function (e) {
                var id = e.sender.element[0].id;
                $("#" + id + "Clear").on("click", function () {
                    dateTimePicker.element[0].value = "";
                    dateTimePicker.close();
                    return false;
                })
            };
            var dateTimePicker = $("#" + this.id).wandaDateTimePicker({
                value: this.defVal,
                //change: function(){},
                open: OpenFunc,
                culture: "zh-CN",
                format: "yyyy/MM/dd HH:mm",
                interval: this.interval,
                footer: wanda.template("#: wanda.toString(data, 'd') #" +
                    "<span id='" + this.id + "Clear' style='float:right; margin-right:10px;'>清除</span>")
            }).data("wandaDateTimePicker");
            dateTimePicker.element[0].disabled = true;
        };
        wandaDateTimePicker.prototype.getwandaDateTimePicker = function () {
            return $("#" + this.id).data("wandaDateTimePicker");
        };

        var wandaDatePicker = function (id, defVal) {
            this.id = id;
            this.defVal = defVal;
        };
        wandaDatePicker.prototype.init = function () {
            var OpenFunc = function (e) {
                var id = e.sender.element[0].id;
                $("#" + id + "Clear").on("click", function () {
                    datePicker.element[0].value = "";
                    datePicker.close();
                    return false;
                })
            };
            var datePicker = $("#" + this.id).wandaDatePicker({
                value: this.defVal,//today当前日0点时间
                //change: function(){},
                open: OpenFunc,
                culture: "zh-CN",
                format: "yyyy/MM/dd",
                footer: wanda.template("#: wanda.toString(data, 'd') #" +
                    "<span id='" + this.id + "Clear' style='float:right; margin-right:10px;'>清除</span>")
            }).data("wandaDatePicker");
            datePicker.element[0].disabled = true;
        };
        wandaDatePicker.prototype.getwandaDatePicker = function () {
            return $("#" + this.id).data("wandaDatePicker");
        };

        var validate = function (type, startId, endId) {
            this.type = type;
            this.startId = startId;
            this.endId = endId;
        };
        validate.prototype.init = function () {
            var start, end;
            if (this.type === "wandaDateTimePicker") {
                start = $("#" + this.startId).data("wandaDateTimePicker");
                end = $("#" + this.endId).data("wandaDateTimePicker");
            } else if (this.type === "wandaDatePicker") {
                start = $("#" + this.startId).data("wandaDatePicker");
                end = $("#" + this.endId).data("wandaDatePicker");
            }
            var startChange = function () {
                var startDate = start.value(),
                    endDate = end.value();
                if (startDate) {
                    startDate = new Date(startDate);
                    startDate.setDate(startDate.getDate());
                    end.min(startDate);
                } else if (endDate) {
                    start.max(new Date(endDate));
                } else {
                    endDate = new Date();
                    start.max(endDate);
                    end.min(endDate);
                }
            };
            var endChange = function () {
                var endDate = end.value(),
                    startDate = start.value();
                if (endDate) {
                    endDate = new Date(endDate);
                    endDate.setDate(endDate.getDate());
                    start.max(endDate);
                } else if (startDate) {
                    end.min(new Date(startDate));
                } else {
                    endDate = new Date();
                    start.max(endDate);
                    end.min(endDate);
                }
            };
            start.bind("change", startChange);
            end.bind("change", endChange);
            start.max(end.value());
            end.min(start.value());
        };

        return {
            wandaDateTimePicker: wandaDateTimePicker,
            wandaDatePicker: wandaDatePicker,
            validate: validate
        }
    }
);






