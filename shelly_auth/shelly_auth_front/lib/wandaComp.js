define(["jquery", "wanda", "common", "main", "lib/jqgrid/js/wdgrid", "lib/ztree/js/wdtree"], function ($, wanda, common, main,wonderGrid,wonderTree) {
        var wandaGrid = function (gridId, columns, isPager, callback, removeCheck, isEdit, dataBound) {
            this.removeCheck = removeCheck;
            this.isEdit = isEdit;
            this.gridId = gridId;
            this.columns = columns;
            this.isPager = isPager;
            this.pagerChangeCall = callback;
            this.gridDom = $("#" + this.gridId);
            this.gridPagerDom = $("#" + this.gridId + "Pager");
            this.dataBound = dataBound;
        };
        wandaGrid.prototype.init = function () {
            var isEdit = this.isEdit == true ? true : false;
            this.gridDom.wandaGrid({
                editable: {
                    confirmation: false,
                    update: isEdit
                },
                allowCopy: true,
                columns: this.columns,
                dataBound: this.dataBound,
                sortable: true,
                change: this.gridChange,
                selectable: "multiple, row",
                scrollable: true,
                noRecords: true,
                messages: {
                    noRecords: "无数据！"
                }
            });
            if (this.isPager) {
                this.gridPagerDom.wandaPager({
                    input: true,
                    numeric: false,
                    messages: {
                        display: "当前第{0}条-第{1}条数据  共{2}条数据",
                        page: "跳转至第",
                        empty: " ",
                        of: "页,共{0}页"

                    },

                    change: this.pagerChangeCall

                    //linkTemplate: '<li><a href="\\#" class="k-link" data-#=ns#page="#=idx#"><strong>#=text#</strong></a></li>'
                });
            }
            return this.gridDom.data("wandaGrid");
        };
        wandaGrid.prototype.getwandaGrid = function () {
            return this.gridDom.data("wandaGrid");
        };
        wandaGrid.prototype.gridChange = function (e) {
            var selectedRows = this.select();
            var gridId = $(this.element).attr("id");
            var selectedDataItems = [];
            $("#" + gridId).find(".gridCheckBox").prop("checked", false);
            for (var i = 0; i < selectedRows.length; i++) {
                var dataItem = this.dataItem(selectedRows[i]);
                selectedDataItems.push(dataItem);
                $("#" + dataItem.uid).prop("checked", true);
            }
            // grid.select("tr[data-uid='" + uid + "']");
        };
        wandaGrid.prototype.setDataSource = function (gridData, pageBean) {
            var grid = this.gridDom.data("wandaGrid");
            grid.setDataSource(gridData);
            if (this.isPager) {
                if (!pageBean) {
                    pageBean = {"total": 0, "rows": 10, "page": 1};
                }
                var pager = this.gridPagerDom.data("wandaPager");
                pager.setDataSource(
                    new wanda.data.DataSource({
                        schema: {
                            total: function (response) {
                                return pageBean["total"];
                            }
                        },
                        pageSize: pageBean["rows"],
                        page: pageBean["page"]
                    })
                );

            }
            $("#" + this.gridId).find(".gridCheckBox").on("click", null, this, this.checkBoxClick);
            $("#" + this.gridId).find("#check-all").on("click", null, this, this.checkBoxClickAll);
        };
        wandaGrid.prototype.checkBoxClick = function (e) {
            var isChecked = $(this).prop("checked");
            var grid = $("#" + e.data.gridId).data("wandaGrid");
            if (isChecked) {

                grid.select("tr[data-uid='" + $(this).attr("id") + "']");
            } else {
                var selectRow = grid.select();
                for (var i = 0; i < selectRow.length; i++) {
                    var dataItem = grid.dataItem(selectRow[i]);
                    if (dataItem.uid == $(this).attr("id")) {
                        selectRow.splice(jQuery.inArray(selectRow[i], selectRow), 1);
                    }
                }
                grid.clearSelection();
                grid.select(selectRow);
            }
            console.log(e)

        };
        wandaGrid.prototype.checkBoxClickAll = function (e) {
            var isChecked = $(this).prop("checked");
            var grid = $("#" + e.data.gridId).data("wandaGrid");
            if (isChecked) {
                $("#" + e.data.gridId).find(".gridCheckBox").each(function () {
                    $(this).prop("checked", true); //此处设置每行的checkbox选中，必须用prop方法
                    //$(this).attr("value")  记录好每行的id
                    $(this).closest("tr").addClass("k-state-selected");  //设置grid 每一行选中
                });
            } else {
                $("#" + e.data.gridId).find(".gridCheckBox").each(function () {
                    $(this).prop("checked", false); //此处设置每行的checkbox不选中，必须用prop方法
                    //$(this).attr("value")  移除每行的id
                    $(this).closest("tr").removeClass("k-state-selected");  //设置grid 每一行不选中
                });
            }
        };
        wandaGrid.prototype.getSelect = function () {
            var selectedRows = this.gridDom.data("wandaGrid").select();
            var selectedDataItems = [];
            for (var i = 0; i < selectedRows.length; i++) {
                var dataItem = this.gridDom.data("wandaGrid").dataItem(selectedRows[i]);
                selectedDataItems.push(dataItem);
            }
            return selectedDataItems;
        };

        var wandaWindow = function (operId, windowId, optionObj, tabClass) {
            this.operId = operId;
            this.windowId = windowId;
            this.optionObj = optionObj;
            this.tabClass = tabClass;
            this.operDom;
        }
        wandaWindow.prototype.init = function (clickCallBack) {
            $("#" + this.windowId).wandaWindow({
                actions:this.optionObj["actions"] == undefined ? ["Close"]:this.optionObj["actions"],
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
            if (this.tabClass) {
                var root = $("." + this.tabClass).attr("aria-controls");
                this.operDom = $("#" + root).find("#" + this.operId);
            } else {
                this.operDom = $("#" + this.operId);
            }
            //关闭主页面销毁该window
            var contentDom = this.operDom.parents("[role='tabpanel']");
            var contentId = contentDom.attr("id");
            var tab = $("[aria-controls='" + contentId + "']")
            var id = tab.attr("tabId");
            closeTabListener(id, function () {
                $("#" + windowId).data("wandaWindow").destroy();
            });


            this.operDom.unbind("click");
            this.operDom.on("click", function (e) {
                if ('undefined' != (typeof clickCallBack)) {
                    var isOk = clickCallBack();
                    if (isOk == false)
                        return;
                }
                ;
                $("#" + windowId).data("wandaWindow").center().open();
                return false;
            });


        };
        wandaWindow.prototype.close = function (id) {
            var windowId = this.windowId;
            if (id) {
                windowId = id;
            }
            $("#" + windowId).data("wandaWindow").close();
        }
        wandaWindow.prototype.callBack = function (elePos, func, isCaLLBack) {
            var close = this.close;
            var windowId = this.windowId;
            var fun
            if ("undefined" == (typeof func) && "function" == typeof elePos) {
                fun = elePos;
                common.initExe(windowId, fun);
            } else {
                fun = function () {
                    var ele = $("#" + windowId).find("[" + elePos + "]");
                    ele.unbind("afterClick").bind("afterClick", function () {
                        if (isCaLLBack) {
                            func(function () {
                                close(windowId);
                            });
                        } else {
                            func();
                            close(windowId);
                        }
                    });
                }
                common.initExeByAttr(windowId, elePos, fun);
            }

        }

        var wandaTabStrip = {

            closeTabByCurrentDomId: function (currentDom) {
                var contentDom = currentDom.parents("[role='tabpanel']");
                var contentId = contentDom.attr("id");
                var tab = $("[aria-controls='" + contentId + "']")
                var id = tab.attr("tabId");
                wandaTabStrip.closeTab(id);
            },
            openTab: function (id, name, url, callBack) {
                main.mainPage.openTab(id, name, url, callBack);

            },
            closeTab: function (id) {
                var tabDiv = $("#tabstrip");
                var tabStrip = tabDiv.wandaTabStrip().data("wandaTabStrip");
                var opened = wandaTabStrip.getDom(id);
                main.mainPage.closeTab(tabStrip, opened);
            },
            getDom: function (id) {
                var tabDiv = $("#tabstrip");
                return tabDiv.find("ul").find("li").filter("." + id);
            },
            clickCallBack: function (id, elementAttr, callbackFunc) {
                var tab = wandaTabStrip.getDom(id);
                var tabId = tab.attr("aria-controls");
                common.initExeByAttr(tabId, elementAttr, function () {
                    var submitBtn = $("#" + tabId).find("[" + elementAttr + "]");
                    submitBtn.unbind("afterClick");
                    submitBtn.bind("afterClick", function (e, param) {
                        callbackFunc(e, param);
                    })
                });
            }

        };
        var closeTabListener = function (pageId, func) {
            // main.mainPage.addCloseTabListener(pageId, func);
        };


        function isArray(object) {
            return object && typeof object === 'object' && Array == object.constructor;
        };


        var treeUtil = function () {
            this.treeDepthArray = [];
            this.treeRow = [];

            this.getMergRows = function (tree, key) {
                this.getRows(tree);
                var depth = Math.max.apply(null, this.treeDepthArray.slice(0));
                var srcRows = JSON.parse(JSON.stringify(this.treeRow));
                for (var i = 0; i < depth - 1; i++) {
                    for (var j = 0; j < srcRows.length; j++) {
                        var srcCol = srcRows[j][i];
                        if (!srcCol) {
                            continue;
                        }
                        for (var k = j + 1; k < srcRows.length; k++) {
                            var srcColCode = srcCol[key];
                            var comParColCode = "undefined";
                            if (srcRows[k][i]) {
                                comParColCode = srcRows[k][i][key];
                            }
                            j = k - 1;
                            if (srcColCode == comParColCode) {
                                srcCol["rowspan"] = srcCol["rowspan"] == undefined ? 2 : srcCol["rowspan"] + 1;
                                srcRows[k][i] = "";
                            } else {
                                break;
                            }

                        }


                    }

                }
                this.treeRow = srcRows
                return this;
            };
            this.getRows = function (tree, number, parCol) {
                for (var i = 0; i < tree.length; i++) {
                    var nbr = number;
                    if (!nbr) {
                        nbr = 1;
                        parCol = [];
                    }
                    var colData = parCol.slice(0);
                    var childs = tree[i].childItems;
                    colData.push(tree[i]);
                    if (isArray(childs)) {
                        nbr++
                        this.getRows(childs, nbr, colData);
                    } else {
                        var treeRow = this.treeRow;
                        treeRow.push(colData.slice(0));
                        colData = [];
                        this.treeDepthArray.push(nbr);
                    }
                }
                //Math.max.apply(null, this.treeDepthArray);
                return this;
            };
        };

        var treeDirTableForm = function (option) {
            this.isMerge = option.isMerge,
                this.tableId = option.tableId;
            this.dirKey = option.dirKey;
            this.dirArray = option.dirArray;
            this.operObj;
            this.depth;
            this.titleOperObj;
            this.titleDepth;
            this.titleKey = option.titleKey;
            this.explainArray = option.explainArray;
            this.titleItems = option.titleItems;
            this.backColorCnt = 0;
            this.lastbackColor = false;
            this._setBackColor = function (cols, j, td) {
                var rowSpan = cols[j]["rowspan"];
                if (j == 0 && this.backColorCnt < 1) {
                    if (!rowSpan) {
                        this.backColorCnt = -9;
                    } else {
                        this.backColorCnt = rowSpan;
                    }
                }

                if (this.backColorCnt > 0 && this.lastbackColor) {
                    td.addClass("tdbg");
                } else if (this.backColorCnt == -9 && this.lastbackColor) {
                    td.addClass("tdbg");
                }

            };
            this._minusBackColorCnt = function () {
                if ((this.backColorCnt == -9 || this.backColorCnt == 1) && this.lastbackColor) {
                    this.lastbackColor = false;
                } else if ((this.backColorCnt == -9 || this.backColorCnt == 1) && !this.lastbackColor) {
                    this.lastbackColor = true;
                }
                this.backColorCnt--;
            };
            this._createTableContent = function () {
                for (var i = 0; i < this.operObj.treeRow.length; i++) {
                    var cols = JSON.parse(JSON.stringify(this.operObj.treeRow[i]));
                    var tr = $("<tr>");
                    tr.addClass("content");
                    for (var j = 0; j < cols.length; j++) {
                        var td = $("<td>");
                        this._setBackColor(cols.slice(0), j, td);
                        var mergColNbr = this.depth - cols.length + 1;
                        if (mergColNbr > 0 && j == (cols.length - 1)) {
                            td.attr("colspan", mergColNbr)
                        }
                        var rowSpan = cols[j]["rowspan"];
                        if (rowSpan) {
                            td.attr("rowspan", rowSpan);
                        }
                        var text = this.dirKey["text"];
                        var key = this.dirKey["key"];
                        var click = this.dirKey["click"];
                        var col = cols[j][text];
                        if (col) {

                            if (click) {
                                var order = click["order"];
                                var level = click["level"];
                                var href = click["href"];
                                var RegExp = /#\w+#/g;
                                var replacKeys = href.match(RegExp);
                                if (replacKeys) {
                                    for (var k = 0; k < replacKeys.length; k++) {
                                        var clickKey = replacKeys[k].replace(/#/g, "");
                                        href = href.replace(replacKeys[k], cols[j][clickKey]);
                                    }
                                }
                                if (order == "desc") {
                                    if (j == cols.length - level) {
                                        td.append($(href));
                                    }
                                } else {
                                    if (j == level - 1) {
                                        td.append($(href));
                                    }
                                }
                            } else {
                                td.text(cols[j][text]);
                            }
                            tr.append(td);


                            if (j == cols.length - 1) {
                                for (var k = 0; k < this.explainArray.length; k++) {
                                    var tmpExPlain = this.explainArray[k];
                                    if (tmpExPlain[key] == cols[j][key]) {
                                        for (var p = 0; p < this.explainKeys.length; p++) {
                                            var td = $("<td>");
                                            this._setBackColor(cols.slice(0), j, td);
                                            if (this.explainKeys[p]["type"] == "input") {
                                                var input = $("<input>");
                                                if (this.explainKeys[p]["attrData"] == true) {
                                                    for (var tmpKey in tmpExPlain) {
                                                        input.attr(tmpKey, tmpExPlain[tmpKey]);
                                                    }

                                                }
                                                input.attr("id", this.tableId + "_" + this.explainKeys[p]["key"] + "_" + tmpExPlain[key]);
                                                input.attr("value", tmpExPlain[this.explainKeys[p]["key"]]);
                                                input.addClass(this.explainKeys[p]["key"]);
                                                input.attr("type", "text");
                                                input.attr("style", "width:50%;");
                                                input.addClass("k-input");
                                                td.attr("style", "text-align:center;padding-left:0px;");
                                                td.append(input);
                                            } else {
                                                td.attr("id", this.tableId + "_" + this.explainKeys[p]["key"] + "_" + tmpExPlain[key]);
                                                td.text(tmpExPlain[this.explainKeys[p]["key"]]);
                                                td.addClass(this.explainKeys[p]["key"]);
                                                if (this.explainKeys[p]["attrData"] == true) {
                                                    for (var tmpKey in tmpExPlain) {
                                                        td.attr(tmpKey, tmpExPlain[tmpKey]);
                                                    }

                                                }
                                            }

                                            tr.append(td);
                                        }
                                        break;
                                    }
                                }

                            }


                        }
                    }
                    this._minusBackColorCnt();
                    $("#" + this.tableId).append(tr);
                }
            };
            this._procTitleParam = function () {
                var key = this.titleKey["key"];
                this.titleOperObj = new treeUtil().getMergRows(this.titleItems, key);
                this.titleDepth = Math.max.apply(null, this.titleOperObj.treeDepthArray);
                var titleItems = this.titleItems;
                this.explainKeys = [];
                for (var i = 0; i < titleItems.length; i++) {
                    var titleItem = titleItems[i];
                    if (titleItem["type"] == "dir") {
                        this.dirId = this.tableId + "_" + titleItem[key];
                        var pxPos = titleItem["width"].indexOf("px");
                        var itemWidth = titleItem["width"];
                        if (pxPos != -1) {
                            itemWidth = titleItem["width"].substr(0, pxPos);
                            this.dirWidth = Number(itemWidth) + "px";
                        } else {
                            this.dirWidth = Number(itemWidth);
                        }
                        break;
                    }
                }
                var titleArray = this.titleOperObj["treeRow"];
                for (var i = 0; i < titleArray.length; i++) {
                    for (var j = 0; j < titleArray[i].length; j++) {
                        if (titleArray[i][j]["type"] == "explain" && titleArray[i][j][this.titleKey["colCode"]]) {
                            var explainKey = {
                                "key": titleArray[i][j][this.titleKey["colCode"]],
                                "type": titleArray[i][j]["show"],
                                "attrData": titleArray[i][j]["attrData"]
                            }
                            this.explainKeys.push(explainKey);
                        }
                    }

                }
            };

            this._mergTitleCol = function () {
                var dir = $("#" + this.dirId);
                var isNbr = typeof this.dirWidth == "number";
                var dirWidth = this.dirWidth;
                this.depth = isFinite(this.depth) == true ? this.depth : 1;
                if (!isNbr) {
                    var pxPos = this.dirWidth.indexOf("px");
                    dirWidth = this.dirWidth.substr(0, pxPos);
                    var wt = dirWidth * this.depth;
                    dir.attr("width", wt + "px");
                } else {
                    var wt = dirWidth * this.depth;
                    dir.attr("width", wt + "%");
                }
                dir.attr("colspan", this.depth);
                return true;
            };
            this._createTitle = function () {
                var key = this.titleKey["key"];
                var tableDom = $("#" + this.tableId);
                this.titleOperObj = new treeUtil().getMergRows(this.titleItems, key);
                this.titleDepth = Math.max.apply(null, this.titleOperObj.treeDepthArray);
                var tileArray = this.titleOperObj.treeRow;
                for (var i = 0; i < this.titleDepth; i++) {
                    var tr = $("<tr>");
                    tr.attr("style", "background:#B9D4F5;text-align: center;text-indent:15px;font:700 14px/32px simsun; border-top:1px solid #e8eef7;");
                    for (var j = 0; j < tileArray.length; j++) {
                        if (tileArray[j][i]) {
                            var td = $("<td>");
                            var titleName = $("<b>");
                            td.attr("id", this.tableId + "_" + tileArray[j][i][key]);
                            if (tileArray[j][i]["width"] && tileArray[j][i]["type"] != "dir") {
                                var pxPos = tileArray[j][i]["width"].indexOf("px");
                                if (pxPos != -1) {
                                    td.attr("width", tileArray[j][i]["width"]);
                                } else {
                                    td.attr("width", tileArray[j][i]["width"] + "%");
                                }

                            }

                            titleName.text(tileArray[j][i][this.titleKey["text"]]);
                            td.append(titleName);
                            if (tileArray[j][i]["rowspan"]) {
                                td.attr("colspan", tileArray[j][i]["rowspan"]);
                            }
                            var mergColNbr = this.titleDepth - tileArray[j].length + 1;
                            if (mergColNbr > 0 && i == tileArray[j].length - 1) {
                                td.attr("rowspan", mergColNbr)
                            }
                            tr.append(td);
                        }
                    }
                    tableDom.append(tr);
                }
                return this._mergTitleCol();


            };
        };

        treeDirTableForm.prototype.create = function () {
            if (this.isMerge) {
                this.operObj = new treeUtil().getMergRows(this.dirArray, this.dirKey["key"]);
            } else {
                this.operObj = new treeUtil().getRows(this.dirArray);
            }
            this.depth = Math.max.apply(null, this.operObj.treeDepthArray);
            this._procTitleParam();
            var idOk = this._createTitle();
            if (idOk) {
                this._createTableContent();
            }
        };

        var commonValidator = function (divDom) {
            var validator = $("#" + divDom).wandaValidator({
                rules: {
                    required: function (input) {
                        if (input.attr("validate") && input.attr("validate").indexOf("required")>0) {
                            return $.trim(input.val()) !== "";// 选中所有input不为空*/
                        }
                        return true;
                    },
                    phone: function (input) {
                        var reg = /^\d{8}$|^\d{11}$/;//判断为8位或11位数字
                        if (input.attr("validate") && input.attr("validate").indexOf("phone")>0) {
                            return reg.test(input.val());
                        }
                        return true;
                    },
                    password: function (input) {
                        var reg = /^[0-9a-zA-Z]{8}$/; //判断为8位数字或字母；
                        if (input.attr("validate") && input.attr("validate").indexOf("password")>0) {
                            return reg.test(input.val());
                        }
                        return true;
                    },
                    email: function (input) {
                        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;///判断为邮箱；
                        if (input.attr("validate") && input.attr("validate").indexOf("email")>0) {
                            return reg.test(input.val());
                        }
                        return true;
                    },
                    accountCode: function (input) {
                        var reg = /^[0-9a-zA-Z]*$/g;///判断只能为字母或数字；
                        if (input.attr("validate") && input.attr("validate").indexOf("accountCode")>0) {
                            return reg.test(input.val());
                        }
                        return true;
                    },
                    checkNum: function (input) {
                        var reg = /^\+?[1-9]\d*$/;
                        if (input.attr("validate") && input.attr("validate").indexOf("checkNum")>0) {
                            return reg.test(input.val());
                        }
                        return true;
                    },
                    ip: function (input) {
                        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                        if (input.attr("validate") && input.attr("validate").indexOf("ip")>0) {
                            return reg.test(input.val());
                        }
                        return true;
                    },
                    MAC: function (input) {
                        var reg = /[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}/;
                        if (input.attr("validate") && input.attr("validate").indexOf("MAC")>0) {
                            return reg.test(input.val());
                        }
                        return true;
                    },
                    URL: function (input) {
                        var reg = /^(?=[A-Za-z0-9/.\-_]*[A-Za-z][A-Za-z0-9/.\-_]*)[A-Za-z0-9/.\-_]{1,}$/;
                        if (input.attr("validate") && input.attr("validate").indexOf("URL")>0) {
                            return reg.test(input.val());
                        }
                        return true;
                    }
                },
                messages: {
                    required: "不能为空",
                    phone: "8位或11位电话号码",
                    password: "8位数字或字母",
                    email: "邮箱格式错误",
                    accountCode: "只能由数字或字母组成",
                    checkNum: "考核分值必须为大于0的整数",
                    ip: "ip地址格式错误",
                    MAC: "MAC地址格式错误",
                    URL: "只能由数字、字母及字符(/-_.)组成，字母至少出现一次"
                }
            });

            var tooltip = $("#" + divDom).wandaTooltip({
                filter: ".k-invalid",
                content: function (e) {
                    var name = e.target.attr("name") || e.target.closest(".k-widget").find(".k-invalid:input").attr("name");
                    var errorMessage = $("#" + divDom).find("[data-for=" + name + "]");

                    return errorMessage.text();
                },
                show: function () {
                    this.refresh();
                }
            });
            return validator.data("wandaValidator");
        };

        var wandaPanelBar = {
            titleTileTemplete: "",
            _getTile: function (title) {
                if (wandaPanelBar.titleTileTemplete == "") {
                    var spanText = $("<span>");
                    spanText.attr("style", "font-size: 14px;font-weight: bold;padding-left:5px;");
                    spanText.text("#title#");
                    var li = $("<li>");
                    var ul = $("<ul>");
                    var div = $("<div>");
                    div.addClass("row padding0");
                    var span = $("<span>");
                    li.append(spanText);
                    ul.append(li);
                    div.append(ul);
                    span.append(div);
                    var outDiv = $("<div>");
                    outDiv.append(span);
                    wandaPanelBar.titleTileTemplete = outDiv.html();
                }
                return wandaPanelBar.titleTileTemplete.replace("#title#", title);

            },
            _getContent: function (content) {
                var div = $("<div>");
                div.attr("style", "margin-left: 5px;margin-top: 5px;margin-right: 5px;");
                // div.addClass("main");
                div.append(content);
                var outDiv = $("<div>");
                outDiv.append(div);
                return outDiv.html();
            },
            init: function (panelDom, panelContent) {
                if (!panelContent) {
                    alert("panelContent参数为空！")
                }
                panelDom.wandaPanelBar();
                var panelBar = panelDom.data("wandaPanelBar");
                var appendPanel = [];
                for (var i = 0; i < panelContent.length; i++) {
                    var panel = {};
                    var title = panelContent[i]["title"];
                    var titleHtml = wandaPanelBar._getTile(title);
                    var content = panelContent[i]["content"];
                    var contentHtml = wandaPanelBar._getContent(content);

                    panel["text"] = titleHtml;
                    panel["encoded"] = false;
                    panel["content"] = contentHtml;
                    appendPanel.push(panel);
                }
                panelBar.append(appendPanel);
            }
        };

        var wandaTreeView = function (option) {
            //this.selectEve = option.selectEve;
            // this.queryData = option.queryData;
            this.initParam = option.initParam;
            this.synchronized = option.synchronized;
            this.queryData = option.queryData;
            this.treeDom = option.treeDom;
            this.childKey = option.childKey;
            this.textKey = option.textKey;
            this.queryKey = option.queryKey;
            this.template = option.template;
            this.checkboxes = option.checkboxes;


            this._selectEve = function (e) {
                var dataItem = this.dataItem(e.node);
                if (option.selectEve) {
                    option.selectEve(dataItem);
                }
            }
            this._expandEve = function (e) {
                var treeview = option.treeDom.data("wandaTreeView");
                var currentNode = e.node;
                if (currentNode.childNodes[1]) {
                    var child = currentNode.childNodes[1].childNodes;
                    var lastLength = child.length;
                    for (var i = 0; i < child.length;) {
                        treeview.remove(child[i]);
                        if (lastLength == child.length) {
                            break;
                        } else {
                            lastLength = child.length;
                        }
                    }
                }
                var key = this.dataItem(e.node)[option.queryKey];
                option.queryData(key, function (data) {
                    var nodes = data;
                    if (nodes) {
                        treeview.append(nodes, $(currentNode));
                    }
                });


            }
            this.init = function () {
                var _selectEve = this._selectEve;
                if (this.synchronized == true) {
                    var _expandEve = this._expandEve;
                }
                var textKey = this.textKey;
                var treeDom = this.treeDom;
                var initParam = this.initParam;
                var template = this.template;
                var checkboxes = false;
                var check = "";
                var loadOnDemand = true;
                if (this.checkboxes) {
                    checkboxes = this.checkboxes["checkboxes"];
                    check = this.checkboxes["checkEve"];
                    loadOnDemand = false;
                }
                option.queryData(initParam, function (data) {
                    var dataS = {
                        data: data,
                        schema: {
                            model: {
                                children: option.childKey
                            }
                        }
                    };

                    treeDom.wandaTreeView({
                        template: template,
                        dataSource: dataS,
                        select: _selectEve,
                        autoScroll: true,
                        loadOnDemand: loadOnDemand,
                        messages: {
                            loading: "正在加载..."
                        },
                        expand: _expandEve,
                        dataTextField: textKey,
                        checkboxes: checkboxes,
                        check: check
                    });
                });
            };
            this.refresh = function (queryKey, dom, call) {
                var treeDom;
                if (dom) {
                    treeDom = dom;
                } else {
                    treeDom = this.treeDom;
                }

                var textKey = this.textKey;
                var setDataSource = this.setDataSource;
                option.queryData(queryKey, function (data) {
                    setDataSource(treeDom, data);
                    if (call) {
                        call();
                    }


                });
            }

            this.setDataSource = function (dom, data) {
                var treeview = dom.data("wandaTreeView");
                var dataS = {
                    data: data,
                    schema: {
                        model: {
                            children: option.childKey
                        }
                    }
                };
                treeview.setDataSource(dataS);
            }
        };

        var elementControl = function (eleId) {
            //var tab = getTabDomByEleId(eleId);
            var eleRight = common.getCurrentUser()["buttonsList"];
            if (eleRight) {
                for (var i = 0; i < eleRight.length; i++) {
                    var eleTag = eleRight[i]["eleTag"];
                    var operTag = eleRight[i]["operTag"];
                    var tagRights = eleId.find("[contrEleTag='" + eleTag + "']");

                    if (tagRights) {
                        tagRights.removeClass("hideRight");
                        if (operTag == "1") {
                            tagRights.attr("disabled", "disabled")
                        }
                    }
                }
            }
        };
        var getTabDomByEleId = function (operDom) {
            var contentDom = operDom.parents("[role='tabpanel']");
            return contentDom;
        }


        var routerControl = {
            init: function (basePage, routers) {
                router = new wanda.Router({root: "/"});
                router.bind("back", function (e) {
                    var url = e.to;
                    if (url == "") {
                        router.navigate(basePage);
                    }
                });
                router.bind("routeMissing", function (e) {
                    var routes = router.routes;
                    if (routes.length == 0) {
                        routerControl.addRouters(routers);
                    }
                    var url = e.url;
                    if (url == "index") {
                        router.navigate("/");
                    } else if (url != "/") {
                        router.navigate(url);
                    }
                });
                router.bind("change",function (e) {
                    var opt = e["params"]["opt"];
                    if(opt){
                        $("#currentPoint").find("a").each(function (index,e) {
                            if($(this).text().indexOf(opt)>0){
                                $("#currentPoint a:gt("+(index-1)+")").remove();
                            }
                        });
                        $("#currentPoint").append("<a>&nbsp;&nbsp;--&nbsp;&nbsp;"+opt+"</a>");
                    }else{
                        $("#currentPoint a:gt(2)").remove();
                    }
                });
                routerControl.addRouters(routers);
                router.start();
            },
            addRoute: function (key, url) {
                router.route(key, function () {
                    $("body").load(url);
                });
            },
            addRouters: function (routers) {
                for (var key in routers) {
                    router.route(key, routers[key]);
                }
            }
        }

        return {
            wandaGrid: wonderGrid.wonderGrid,
            wandaWindow: wandaWindow,
            wandaTabStrip: wandaTabStrip,
            closeTabListener: closeTabListener,
            treeDirTableForm: treeDirTableForm,
            wandaPanelBar: wandaPanelBar,
            wandaTreeView: wonderTree.wonderTree,
            elementControl: elementControl,
            commonValidator: commonValidator,
            routerControl: routerControl
        }
    }
);






