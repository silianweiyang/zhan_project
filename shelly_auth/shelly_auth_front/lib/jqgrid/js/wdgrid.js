define(["jquery", "wanda", "lib/bootstrap-3.3.7/js/bootstrap.min",
        "lib/jqgrid/js/jquery.jqGrid.min", "common", "lib/jqgrid/js/i18n/grid.locale-cn", "lib/jqgrid/js/grid.inlinedit"
    ],
    function($, wanda, bootstrap, jqgrid, common) {
        $.jgrid.defaults.styleUI = 'Bootstrap';

        var wonderDataSource = function(ui) {
            this.ui = ui;
        };

        var wonderGrid = function(gridId, columns, isPager, callback, editCallback, isEdit, dataBound) {
            if (wonderGrid.instMap[gridId]) {
                wonderGrid.instMap[gridId].initColDefine(columns);
                return wonderGrid.instMap[gridId];
            } else {
                wonderGrid.instMap[gridId] = this;
            }

            var selfObj = this;

            if (editCallback) {
                this.editCallback = function() {
                    if (editCallback) {
                        var dataView = selfObj.gridDom().jqGrid("getRowData");
                        var rowId = selfObj.gridDom().jqGrid("getGridParam", "selrow");
                        var rowData = null;
                        if (rowId !== null) {
                            rowData = selfObj.getRowDataByRowId(rowId);
                        }
                        var json = {
                            "dataView": dataView,
                            "current": rowData
                        };
                        return editCallback(json);
                    }
                }; //一般为null
            }
            this.isEdit = isEdit; //是否可编辑列，一般传null
            this.gridPid = gridId;
            this.gridId = gridId + "Table"; //表格id，分页id根据此生成
            // this.columns = columns; //列定义
            this.isPager = isPager; //是否支持分页，一般是true
            this.pagerChangeCall = callback; //分页换页事件回调，一般为null
            //alert("#" + gridId + "Pager");
            this.dataBound = dataBound; //列数据绑定事件
            wonderGrid.curPageBean[this.gridId] = null;
            this.multiselect = false;
            this.sortKey = null;
            this.sortOrder = null;
            this.onEditFuncArray = [];
            this.initColDefine(columns);
        };

        wonderGrid.instMap = {};
        wonderGrid.curPageBean = {};
        wonderGrid.curPageData = {};

        wonderGrid.prototype.initColDefine = function(columns) {
            var selfObj = this;
            var colDefines = [];

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].headerTemplate !== undefined && columns[i].headerTemplate.indexOf("全选") >= 0) {
                    this.multiselect = true;
                    continue;
                }
                var col = {};
                col.label = columns[i].title;
                col.name = columns[i].field;
                col.resizable = false;
                col.hidden = columns[i].hidden;
                col.sortable = false;
                if (columns[i].width !== undefined && columns[i].width !== null) {
                    col.width = columns[i].width;
                    col.fixed = true;
                }
                if (columns[i].template !== undefined) {
                    col.formatter = (function(temp) {
                        return function(cellvalue, options, rowObject) {
                            var data = null;
                            /*if (rowObject.id) { // 这里需要的id是rowId，但有可能返回的数据结果中有主键id，获取data就是null
                                data = selfObj.getRowDataByRowId(rowObject.id);
                            } else {
                                data = rowObject;
                            }*/
                            data = rowObject;
                            return wanda.template(temp)(data);
                        };
                    })(columns[i].template);
                    col.formatter.rowCache = {};
                    col.sortable = false;
                    col.title = false;
                }
                if (columns[i].command !== undefined) {
                    var cmd = columns[i].command;
                    col.actions = {};
                    var html = "";
                    for (var j = 0; j < cmd.length; j++) {
                        var dom = $("<a href='javascript:void(0);'><label style='cursor: pointer'>" + cmd[j].text + "</label></a>");
                        dom.addClass(cmd[j].className);
                        dom.attr("name", cmd[j].name);
                        html += dom.prop("outerHTML");
                        col.actions[cmd[j].name] = cmd[j].click;
                    }
                    col.formatter = function(cellvalue, options, rowObject) {
                        return arguments.callee.html;
                    };
                    col.formatter.html = html;
                    col.sortable = false;
                    col.title = false;
                }
                if (this.isEdit) {
                    col.sortable = false;
                }
                if (columns[i].template === undefined && columns[i].command === undefined && this.isEdit) {
                    col.editable = true;
                    col.edittype = 'custom';
                    col.editoptions = {
                        custom_element: function(value, options) {
                            return selfObj.createCustomElement(value, options);
                        },
                        custom_value: function(elem, operation, value) {
                            return selfObj.createCustomValue(elem, operation, value);
                        }
                    };
                }
                colDefines.push(col);
                this.columns = colDefines;
            }
        };

        wonderGrid.prototype.createCustomElement = function(value, options) {
            var map = this.getEditColMap();
            var col = map[options.name];
            var elem = null;
            if (col === undefined || col.readonly) {
                elem = $("<input type='text' class='k-textbox' />");
                elem.attr("readonly", "readonly");
            } else {
                if (col.type === "select") {
                    elem = $("<input />");
                    this.onEditFuncArray.push(function() {
                        var initProps = {
                            dataTextField: "text",
                            dataValueField: "value",
                            dataSource: col.values,
                            index: 0, // 当前默认选中项，索引从0开始。
                            dataBound: function(e) {
                                e.sender.span.attr("editControl", true);
                                e.sender.ul.find("li").attr("editControl", true);
                            }
                        }
                        if (col.events !== undefined) {
                            var attr = null;
                            for (attr in col.events) {
                                initProps[attr] = col.events[attr];
                            }
                        }
                        var dropDown = elem.wandaDropDownList(initProps);
                        dropDown.data("wandaDropDownList").value(col.value);
                        if (col && col.focus) {
                            dropDown.focus();
                        }
                    });
                } else {
                    elem = $("<input type='text' class='k-textbox' />");
                    this.onEditFuncArray.push(function() {
                        if (col && col.focus) {
                            $("#" + options.id)[0].focus();
                        }
                    });
                }
            }
            elem.attr("id", options.id);
            if(col == undefined || col.value == undefined || col.value == ""){
                elem.val(value);
            }else{
                elem.val(col["value"]);
            }

            return elem[0];
        };

        wonderGrid.prototype.getEditColMap = function() {
            var map = {};
            if (this.editCallback) {
                var colArr = this.editCallback();
                for (var i = 0; i < colArr.length; i++) {
                    map[colArr[i].name] = colArr[i];
                }
            }
            return map;
        };

        wonderGrid.prototype.createCustomValue = function(elem, operation, value) {
            if (operation === 'get') {
                var id = null;
                if (elem.id) {
                    id = elem.id;
                } else {
                    for (var i = 0; i < elem.length; i++) {
                        if (elem[i].id) {
                            id = elem[i].id;
                            break;
                        }
                    }
                }
                if ($("#" + id).attr('data-role') === 'dropdownlist') {
                    return $("#" + id).data("wandaDropDownList").text();
                } else {
                    var txt = document.createElement("textarea");
                    txt.innerText = $(elem).val();
                    if (txt.innerText !== txt.innerHTML) {
                        return txt.innerHTML;
                    } else {
                        return $(elem).val();
                    }
                }
            }
        };

        wonderGrid.prototype.gridDom = function() {
            return $("#" + this.gridId);
        };

        wonderGrid.prototype.gridPagerDom = function() {
            return $("#" + this.gridPid + "Pager");
        };

        wonderGrid.prototype._initPager = function() {
            var selfObj = this;
            selfObj.gridPagerDom().find(".ui-pg-input.form-control").val(0);
            selfObj.gridPagerDom().find(".ui-pg-input.form-control").attr("disabled", "disabled");
            selfObj.gridPagerDom().find(".glyphicon.glyphicon-step-backward").closest("td").addClass("ui-disabled");
            selfObj.gridPagerDom().find(".glyphicon.glyphicon-backward").closest("td").addClass("ui-disabled");
            selfObj.gridPagerDom().find(".glyphicon.glyphicon-step-forward").closest("td").addClass("ui-disabled");
            selfObj.gridPagerDom().find(".glyphicon.glyphicon-forward").closest("td").addClass("ui-disabled");
            var pageBean = wonderGrid.curPageBean[this.gridId];
            if (pageBean) {
                var start = pageBean.curRow;
                var end = parseInt(pageBean.curRow) + wonderGrid.curPageBean[this.gridId].countRow - 1;

                selfObj.gridPagerDom().find(".ui-pg-input.form-control").val(pageBean.page);
                selfObj.gridPagerDom().find(".ui-pg-input.form-control").removeAttr("disabled");
                selfObj.gridPagerDom().find(".ui-pg-input.form-control").next().text(pageBean.countPage);

                var pageInfo = "<span style='margin-right:8px'>第" + start + "条 - 第" + end + "条数据  共" + pageBean.total + "条数据</span>";
                selfObj.gridPagerDom().find(".ui-paging-info").html(pageInfo);
                if (parseInt(pageBean.page) > 1) {
                    selfObj.gridPagerDom().find(".glyphicon.glyphicon-step-backward").closest("td").removeClass("ui-disabled");
                    selfObj.gridPagerDom().find(".glyphicon.glyphicon-backward").closest("td").removeClass("ui-disabled");
                }
                if (parseInt(pageBean.page) < parseInt(pageBean.countPage)) {
                    selfObj.gridPagerDom().find(".glyphicon.glyphicon-forward").closest("td").removeClass("ui-disabled");
                    selfObj.gridPagerDom().find(".glyphicon.glyphicon-step-forward").closest("td").removeClass("ui-disabled");
                }
            }
        };

        wonderGrid.prototype._onGridComplete = function() {
            var selfObj = this;
            var trArr = $("#" + selfObj.gridId + " tr.jqgrow");
            for (var i = 0; i < trArr.length; i++) {
                if (i % 2 !== 0) {
                    $(trArr[i]).addClass("k-alt");
                } else {
                    $(trArr[i]).removeClass("k-alt");
                }
            }
        };

        wonderGrid.prototype._onLoadComplete = function() {

        };

        wonderGrid.prototype._onPagerTextKeyPress = function(event) {
            var selfObj = this;
            if (event.keyCode == "13") {
                var userPage = $.trim(selfObj.gridPagerDom().find(".ui-pg-input.form-control").val());
                userPage = parseInt(userPage);
                if ($.isNumeric(userPage) && userPage >= 1 && userPage <= parseInt(wonderGrid.curPageBean[selfObj.gridId].countPage)) {
                    selfObj.gridPagerDom().find(".ui-pg-input.form-control").css("outline", "");
                    selfObj.gridPagerDom().find(".ui-pg-input.form-control").blur();
                    selfObj._sendPageCallback("user", userPage);
                } else {
                    selfObj.gridPagerDom().find(".ui-pg-input.form-control").css("outline", "1px solid red");
                }
            }
        };

        wonderGrid.prototype.init = function() {
            var selfObj = this;
            $("#" + selfObj.gridPid).css("margin", "0");
            $("#" + selfObj.gridPid).css("padding", "0");
            $("#" + selfObj.gridPid).css("overflow-x", "hidden");
            $("#" + selfObj.gridPid).parent().css("overflow-x", "auto");

            $("#" + selfObj.gridPid).resize(function() {
                $("#" + selfObj.gridId).jqGrid('setGridWidth', $(this).width() - 3);
                $("#" + selfObj.gridId).closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "auto" });
                $("#" + selfObj.gridId).closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "auto" });
            });
            $("<table id='" + selfObj.gridId + "'></table>").
            appendTo($("#" + selfObj.gridPid));
            $("#" + selfObj.gridId).jqGrid({
                height: "100%",
                autowidth: true,
                regional: "cn",
                datatype: "local",
                emptyrecords: "",
                loadonce: true,
                colModel: selfObj.columns,
                viewrecords: true,
                rowNum: 10,
                rowList: [],
                rownumbers: false,
                rownumWidth: 0,
                multiselect: selfObj.multiselect,
                editurl: "clientArray",
            //gridview: false,
                //altRows: true,
                //altclass: 'k-alt',
                pager: selfObj.isEdit || !selfObj.isPager ? null : "#" + selfObj.gridPid + "Pager",
                resizeStart: function(event, index) {
                    $("#" + selfObj.gridId).css("display", "none");
                },
                resizeStop: function(newwidth, index) {
                    $("#" + selfObj.gridId).css("display", "none");
                },
                onPaging: function(pgBtn) {
                    selfObj._sendPageCallback(pgBtn);
                },
                onCellSelect: function(rowid, iCol, cellcontent, e) {
                    var targetObj = {};
                    targetObj.dataItem = function() {
                        return selfObj.getRowDataByRowId(rowid);
                    };
                    var link = $(e.target).closest('a');
                    var click = null;
                    if (selfObj.multiselect &&
                        parseInt(iCol) !== 0 &&
                        selfObj.columns[parseInt(iCol) - 1].actions !== undefined) {
                        click = selfObj.columns[parseInt(iCol) - 1].actions[link.attr("name")];
                    } else if (selfObj.columns[parseInt(iCol)].actions !== undefined) {
                        click = selfObj.columns[parseInt(iCol)].actions[link.attr("name")];
                    }

                    var clickHandler = function() {
                        if (click) {
                            var oldGetSelect = selfObj.getSelect;
                            selfObj.getSelect = function() {
                                return [selfObj.getRowDataByRowId(rowid)];
                            };
                            click.call(targetObj, e);
                            selfObj.getSelect = oldGetSelect;
                            if (!selfObj.multiselect) {
                                selfObj.singleSelection = selfObj.gridDom().jqGrid('getRowData', rowid);
                                selfObj.singleSelection.rowId = rowid;
                            }
                            selfObj.gridDom().jqGrid("setSelection", rowid);
                        } else {}
                    }

                    if (link.attr("name") === "deleteConfirm") {
                        common.jqConfirm.confirm({
                            content: "是否确认删除？",
                            call: function() {
                                selfObj.deleteRow(rowid);
                                clickHandler();
                            }
                        });
                    } else {
                        if (link.attr("name") === "delete") {
                            selfObj.deleteRow(rowid);
                        }
                        clickHandler();
                    }

                },
                onSortCol: function(index, iCol, sortorder) {
                    selfObj.sortKey = index;
                    selfObj.sortOrder = sortorder;
                },
                gridComplete: function() {
                    selfObj._onGridComplete();
                },
                loadComplete: function() {
                    selfObj._onLoadComplete();
                },
                onSelectRow: function(rowid, status) {
                    console.log(rowid);
                },
                ondblClickRow: function(rowid, iRow, iCol, e) {
                    selfObj.editRow(rowid);
                }
            });

            if (selfObj.isPager) {
                selfObj.gridPagerDom().find("#" + this.gridPid + "Pager_left").hide();
                selfObj.gridPagerDom().find("#" + this.gridPid + "Pager_center").attr("align", "left");
                selfObj.gridPagerDom().css("padding-top", "8px");
                selfObj.gridPagerDom().css("padding-bottom", "8px");
                selfObj.gridPagerDom().addClass("k-alt");

                selfObj.gridPagerDom().find(".ui-pg-selbox").on("change", function() {
                    $("#" + selfObj.gridPid).triggerHandler('resize');
                });
                selfObj.gridPagerDom().find(".ui-pager-control").unbind("keypress");
                selfObj.gridPagerDom().find(".ui-pager-control").bind("keypress", function(e) {
                    selfObj._onPagerTextKeyPress(e);
                });
            }
            return this.gridDom();
        };

        wonderGrid.prototype.saveAll = function() {
            var selfObj = this;
            if (selfObj.editId != null) {
                selfObj.gridDom().saveRow(selfObj.editId);
                wonderGrid.curPageData[selfObj.gridId] = selfObj.gridDom().jqGrid("getRowData");
                selfObj.editId = null;
            }
        };

        wonderGrid.prototype._sendPageCallback = function(pgType, userPage) {
            var selfObj = this;
            var pgAction = {};
            var page = parseInt(wonderGrid.curPageBean[selfObj.gridId].page);
            var countPage = parseInt(wonderGrid.curPageBean[selfObj.gridId].countPage);
            pgAction.first = function() {
                return 1;
            };
            pgAction.prev = function() {
                return (page > 1) ? (page - 1) : 1;
            };
            pgAction.next = function() {
                return (page < countPage) ? (page + 1) : countPage;
            };
            pgAction.last = function() {
                return countPage;
            };
            pgAction.user = function() {
                return userPage;
            };
            var e = {};
            e.index = pgAction[pgType]();
            if (e.index > 0) {
                this.pagerChangeCall(e);
            }
        };

        wonderGrid.prototype.deleteRow = function(rowid) {
            var selfObj = this;
            if (selfObj.editId != null) {
                selfObj.gridDom().saveRow(selfObj.editId);
                wonderGrid.curPageData[selfObj.gridId] = selfObj.gridDom().jqGrid("getRowData");
                selfObj.editId = null;
            }
            this.gridDom().delRowData(rowid);
            var rowData = selfObj.gridDom().jqGrid("getRowData");
            selfObj.gridDom().jqGrid('clearGridData');
            for (var i = 0; i <= rowData.length; i++) {
                selfObj._doRowInserting(i + 1, rowData[i]);
            }
            wonderGrid.curPageData[selfObj.gridId] = rowData;
            selfObj._onGridComplete();
        };

        wonderGrid.prototype.getRowDataByRowId = function(rowid) {
            var selfObj = this;
            var data = wonderGrid.curPageData[selfObj.gridId];
            if(data === null || data.length === 0)
                return null;
            if (selfObj.sortKey !== null && selfObj.sortOrder !== null) {
                data = data.sort(function(e1, e2) {
                    var res = e1[selfObj.sortKey] <= e2[selfObj.sortKey];
                    if (selfObj.sortOrder === "desc") {
                        res = !res;
                    }
                    if (res) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }
            return data[parseInt(rowid) - 1];
        };

        wonderGrid.prototype._doRowInserting = function(idx, obj) {
            var selfObj = this;
            var colMap = selfObj.getEditColMap();
            var txt = document.createElement("textarea");
            var attr = null;
            for (attr in obj) {
                if (attr !== "undefined" && colMap[attr] !== undefined && colMap[attr].values !== undefined) {
                    for (var j = 0; j < colMap[attr].values.length; j++) {
                        if (colMap[attr].values[j] !== undefined && colMap[attr].values[j].value === obj[attr]) {
                            obj[attr] = colMap[attr].values[j].text;
                            break;
                        }
                    }
                }
                txt.innerText = obj[attr];
                if (txt.innerText != txt.innerHTML) {
                    obj[attr] = txt.innerHTML;
                }
            }
            selfObj.gridDom().jqGrid('addRowData', idx, obj);
        };

        wonderGrid.prototype.setDataSource = function(gridData, pageBean) {
            var selfObj = this;
            $("#cb_" + selfObj.gridId).prop("checked", false);
            selfObj.gridDom().jqGrid('clearGridData'); //清空表格
            if (gridData !== null && gridData.options !== null &&
                gridData.options.data !== null && gridData.options.data.length > 0) {
                for (var i = 0; i <= gridData.options.data.length; i++) {
                    selfObj._doRowInserting(i + 1, gridData.options.data[i]);
                }
                wonderGrid.curPageData[selfObj.gridId] = gridData.options.data;
                if (pageBean !== undefined && pageBean !== null) {
                    wonderGrid.curPageBean[selfObj.gridId] = pageBean;
                    wonderGrid.curPageBean[selfObj.gridId].countRow = gridData.options.data.length;
                }
            } else {
                wonderGrid.curPageData[selfObj.gridId] = null;
                wonderGrid.curPageBean[selfObj.gridId] = null;
                var colspan = selfObj.columns.length;
                if (selfObj.multiselect) {
                    colspan += 1;
                }
                if (!selfObj.isEdit)
                    $("<tr><td align='center' colspan='" + colspan + "'><span style='margin-left:0px'>无数据</span></td></tr>").appendTo(selfObj.gridDom().find("tbody"));
            }
            selfObj._initPager();
        };

        wonderGrid.prototype.getSelect = function() {
            if (this.multiselect) {
                var ids = this.gridDom().jqGrid('getGridParam', 'selarrrow');
                var rowDatas = [];
                for (var i = 0; i < ids.length; i++) {
                    var rowData = this.getRowDataByRowId(ids[i]);
                    rowDatas.push(rowData);
                }
                return rowDatas;
            } else {
                return [this.getRowDataByRowId(this.singleSelection.rowId)]
            }
        };

        wonderGrid.prototype.isSelected = function(id) {
            var ids = this.gridDom().jqGrid('getGridParam', 'selarrrow');
            for (var i = 0; i < ids.length; i++) {
                if (ids[i] === id)
                    return true;
            }
            return false;
        };

        wonderGrid.prototype.data = function(name) {
            var selfObj = this;
            var colMap = selfObj.getEditColMap();
            var wrapper = {
                ui: selfObj,
                onChange: function(e) {
                    if (e.action === "itemchange" || e.action === "add") {
                        var data = this.data();
                        selfObj.gridDom().jqGrid('clearGridData');
                        var txt = document.createElement("textarea");
                        for (var i = 0; i <= data.length; i++) {
                            var attr = null;
                            for (attr in data[i]) {
                                txt.innerHTML = data[i][attr];
                                if (txt.innerText != txt.innerHTML) {
                                    data[i][attr] = txt.innerText;
                                }
                            }
                            selfObj._doRowInserting(i + 1, data[i]);
                        }
                        wonderGrid.curPageData[selfObj.gridId] = data;
                    }
                }
            };
            var rowDatas = selfObj.gridDom().jqGrid("getRowData");
            for (var i = 0; i < rowDatas.length; i++) {
                var obj = rowDatas[i];
                var attr = null;
                for (attr in obj) {
                    if (attr !== "undefined" && colMap[attr] !== undefined && colMap[attr].values !== undefined) {
                        for (var j = 0; j < colMap[attr].values.length; j++) {
                            if (colMap[attr].values[j].text === obj[attr]) {
                                obj[attr] = colMap[attr].values[j].value;
                                break;
                            }
                        }
                    }
                }
            }
            var ds = new wanda.data.DataSource({
                data: rowDatas
            });
            ds.fetch();
            ds.bind("change", wrapper.onChange);
            wrapper.dataSource = ds;
            return wrapper;
        };

        wonderGrid.prototype.addRow = function() {
            var selfObj = this;
            if (selfObj.isEdit) {
                if (selfObj.editId != null) {
                    selfObj.gridDom().saveRow(selfObj.editId);
                    wonderGrid.curPageData[selfObj.gridId] = selfObj.gridDom().jqGrid("getRowData");
                    selfObj.editId = null;
                }
                selfObj.gridDom().jqGrid('resetSelection');
                var rowData = selfObj.gridDom().jqGrid("getRowData");
                selfObj.gridDom().jqGrid("addRowData", rowData.length + 1, {});
                if (selfObj.editCallback) {
                    var colArr = selfObj.editCallback();
                    for (var i = 0; i < colArr.length; i++) {
                        if (colArr[i].value) {
                            selfObj.gridDom().jqGrid('setCell',
                                rowData.length + 1, colArr[i].name, colArr[i].value);
                        }
                    }
                }
                selfObj.curAddEvent = window.event;
                selfObj.editRow(rowData.length + 1);
            }
        };

        wonderGrid.prototype.refreshEdit = function(data) {
            var selfObj = this;
            selfObj.gridDom().saveRow(selfObj.editId);
            if(data !== undefined) {
                selfObj.gridDom().jqGrid("setRowData", selfObj.editId, data);
            }
            wonderGrid.curPageData[selfObj.gridId] = selfObj.gridDom().jqGrid("getRowData");
            var rowId = selfObj.editId;
            selfObj.editId = null;
            selfObj.editRow(rowId);
        }

        wonderGrid.prototype.editRow = function(newRowId) {
            var selfObj = this;
            if (selfObj.editId !== null && selfObj.editId != newRowId) {
                selfObj.gridDom().saveRow(selfObj.editId);
                wonderGrid.curPageData[selfObj.gridId] = selfObj.gridDom().jqGrid("getRowData");
            }
            selfObj.gridDom().editRow(newRowId, {
                keys: false,
                url: null,
                oneditfunc: function(rowid) {
                    selfObj.editId = rowid;
                    if (selfObj.onEditFuncArray.length > 0) {
                        for (var i = 0; i < selfObj.onEditFuncArray.length; i++) {
                            selfObj.onEditFuncArray[i]();
                        }
                        selfObj.onEditFuncArray = [];
                    }
                    var onBlur = function(event) {
                        if (event.originalEvent === selfObj.curAddEvent ||
                            $(event.target).hasClass("customelement") ||
                            $(event.target).hasClass("k-i-arrow-60-down") || $(event.target).parent("span").hasClass("k-dropdown-wrap") || //过滤弹出层的下拉图标
                            $(event.target).attr("editControl")) {
                            $("body").one("click", onBlur);
                            return;
                        }
                        if (selfObj.isEdit) {
                            if (selfObj.editId !== null) {
                                try {
                                    selfObj.gridDom().saveRow(selfObj.editId);
                                    wonderGrid.curPageData[selfObj.gridId] = selfObj.gridDom().jqGrid("getRowData");
                                }catch (e) {
                                    console.log(e);
                                }
                                selfObj.editId = null;
                            }
                        }
                    };
                    $("body").one("click", onBlur);
                },
                // aftersavefunc: function(rowid) {
                //     wonderGrid.curPageData[selfObj.gridId] = selfObj.gridDom().jqGrid("getRowData");
                //     selfObj._onGridComplete();
                //     selfObj.editId = null;
                // },
                // afterrestorefunc: function() {
                //     selfObj._onGridComplete();
                //     selfObj.editId = null;
                // }
            });
        };

        return {
            "wonderGrid": wonderGrid
        };

    });