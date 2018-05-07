define(["jquery", "wanda", "jqZtree"], function(h, e, k) {
    e = function(b) {
        var a = this;
        this.option = b;
        this.checkStates = {};
        this.setting = {
            view: {
                showLine: !1,
                showIcon: !1,
                dblClickExpand: !1
            },
            callback: {
                onClick: function(b, d, f) {
                    if (a.option.onSelect) a.option.onSelect(f.data)
                },
                beforeExpand: function(c, d) {
                    a.zTree.removeChildNodes(d);
                    d.isParent = !0;
                    a.zTree.updateNode(d);
                    a.option.queryData(d.data[b.queryKey], function(c) {
                        if (c) {
                            for (var f = [], e = 0; e < c.length; e++) {
                                var g = a._dataToNode(c[e]);
                                g.checked = void 0 !== a.checkStates[g.data[b.queryKey]] ?
                                    a.checkStates[g.data[b.queryKey]] : d.checked;
                                f.push(g)
                            }
                            a.zTree.addNodes(d, -1, f, !0)
                        }
                    });
                    return !0
                }
            }
        };
        void 0 !== this.option.checkOption && (this.setting.check = {
            enable: !0,
            chkStyle: "checkbox",
            chkboxType: this.option.checkOption.checkChildren ? {
                Y: "ps",
                N: "ps"
            } : {
                Y: "",
                N: ""
            }
        }, this.setting.callback.onCheck = function(c, d, f) {
            a.checkStates[f.data[b.queryKey]] = f.checked;
            var e = function(c) {
                if (c.children)
                    for (var d = 0; d < c.children.length; d++) a.checkStates[c.children[d].data[b.queryKey]] = void 0, e(c.children[d])
            };
            e(f);
            console.log(a.checkStates);
            if (a.option.checkOption.onCheck) a.option.checkOption.onCheck(d, f)
        })
    };
    e.prototype.init = function() {
        var b = this;
        this.option.queryData(this.option.initParam, function(a) {
            b.setDataSource(b.option.treeDom, a)
        })
    };
    e.prototype.refresh = function(b, a, c) {
        var d = this,
            e = null === a ? this.option.treeDom : a;
        this.option.queryData(b, function(a) {
            d.setDataSource(e, a);
            c && c()
        })
    };
    e.prototype.setDataSource = function(b, a) {
        void 0 === this.treeId && (this.treeId = "zTree" + (new Date).valueOf(), this.dom = h('<ul id="' + this.treeId + '" class="ztree"></ul>'),
            this.dom.appendTo(b));
        b = [];
        if (a && 0 < a.length)
        	for (var c = 0; c < a.length; c++) b.push(this._dataToNode(a[c]));
        this.zTree = h.fn.zTree.init(this.dom, this.setting, b)
    };
    e.prototype._dataToNode = function(b) {
        var a = {};
        a.data = b;
        a.name = b[this.option.textKey];
        a.isParent = !0;
        if(this.option.openKey) a.open = b[this.option.openKey];
        if(this.option.checkKey) a.checked = b[this.option.checkKey];
        if(a.checked){
            this.checkStates[b[this.option.queryKey]] = a.checked;
        }
        b = b[this.option.childKey];
        if(b != null){
            for (var c = [], d = 0; d < b.length; d++) c.push(this._dataToNode(b[d]));
            a.children = c;
        }
        return a
    };
    e.prototype.getNodeIndex = function(index) {
        return this.zTree.getNodeIndex(index);
    };
    e.prototype.getNodeById = function(id) {
        return this.zTree.getNodeByTId(id);
    };
    e.prototype.getCheckedNodes = function() {
        return this.zTree.getCheckedNodes(!0)
    };
    e.prototype.checkNodesByAttr = function(b) {
        for (var a = this.zTree.transformToArray(this.zTree.getNodes()),
                 c = 0; c < a.length; c++)
            for (var d = a[c].data[b.name], e = 0; e < b.values.length; e++)
                if (d === b.values[e]) {
                    this.zTree.checkNode(a[c], !0, this.option.checkOption.checkChildren, !0);
                    break
                }
    };
    return {
        wonderTree: e
    }
});