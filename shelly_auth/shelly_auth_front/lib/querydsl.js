function QDSL() {
    this.finalExpr = {};
}
QDSL.prototype._isSimple = function(op) {
    return op !== "and" && op !== "or" && op !== "not";
};
QDSL.prototype._delEmptyNode = function(expr) {
    var toDelArr = [];
    for (var i = 0; i < expr.operand.length; i++) {
        if (!this._isSimple(expr.operand[i].operator)) {
            if (this._delEmptyNode(expr.operand[i])) {
                toDelArr.push(expr.operand[i]);
            }
        } else {
            if (expr.operand[i].operand === null || expr.operand[i].operand.length === 0) {
                toDelArr.push(expr.operand[i]);
            }
        }
    }
    // console.log(toDelArr.toString().split(","));
    for (var i = 0; i < toDelArr.length; i++) {
        // console.log("deling index: " + toDelArr[i]);
        var idx = expr.operand.indexOf(toDelArr[i]);
        expr.operand.splice(idx, 1);
    }
    // console.log("expr.operand size is: " + expr.operand.length)
    if (expr.operand.length === 0) {
        return true;
    } else {
        return false;
    }
};
QDSL.prototype._upcast = function(expr) {
    if (expr.operand.length === 1) {
        return this._upcast(expr.operand[0]);
    } else {
        return expr;
    }
};
QDSL.prototype.json = function() {
    if (this.finalExpr.operand.length === 0)
        return "{}";
    else
        return JSON.stringify(this.finalExpr);
};
QDSL.prototype.where = function(arg) {
    this.finalExpr = arg.expr();
    this._delEmptyNode(this.finalExpr);
    this.finalExpr = this._upcast(this.finalExpr);
    return this;
};
$and = function() {
    var arr = [];
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== null) {
            arr.push(arguments[i].expr());
        }
    }
    if (arr.length === 0)
        return null;
    var res = {};
    res.type = "bracket";
    res.expr = function() {
        return {
            operator: "and",
            operand: arr
        };
    };
    return res;
};
$or = function() {
    var arr = [];
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== null) {
            arr.push(arguments[i].expr());
        }
    }
    if (arr.length === 0)
        return null;
    var res = {};
    res.type = "bracket";
    res.expr = function() {
        return {
            operator: "or",
            operand: arr
        };
    };
    return res;
};
$not = function(arg) {
    if (arg === null)
        return null;
    var res = {};
    res.type = "bracket";
    res.expr = function() {
        return {
            operator: "not",
            operand: arg
        };
    };
    return res;
};
$E = function(field) {
    //相等表达式
    var op = this;
    op._field = field;
    op._res = function(value, operator) {
        var res = {};
        res.operator = operator;
        if (value !== null && value !== "")
            res.operand = [this._field, value];
        else
            res.operand = [];
        res.opStack = [];
        res.epStack = [{
            operator: res.operator,
            operand: res.operand,
        }];
        res.and = function(arg) {
            this.opStack.push("and");
            this.epStack.push(arg.expr());
            return this;
        };
        res.or = function(arg) {
            this.opStack.push("or");
            this.epStack.push(arg.expr());
            return this;
        };
        res.expr = function() {

            if (this.opStack.length === 0) {
                return {
                    operator: this.operator,
                    operand: this.operand,
                };
            } else {
                // console.log(this.opStack);
                // console.log(this.epStack);
                // console.log();
                var orStack = [];
                var tmpStack = [];
                var andHandler = function(epStack) {
                    if (tmpStack.length === 0) {
                        orStack.push(epStack.shift());
                    } else {
                        var arr = [];
                        while (tmpStack.length !== 0) {
                            arr.push(tmpStack.shift());
                        }
                        // console.log("tmpstack size is: " + tmpStack.length)
                        arr.push(epStack.shift());
                        // console.log("arr ==" + arr);
                        orStack.push({
                            operator: "and",
                            operand: arr
                        });
                    }
                };
                while (this.opStack.length !== 0) {
                    var curOp = this.opStack.shift();
                    if (curOp === "and") {
                        // var msg = " The " + this.epStack[0].operator + "->" + this.epStack[0].operand + " is push in";
                        // console.log(msg);
                        tmpStack.push(this.epStack.shift());
                    } else {
                        andHandler(this.epStack);
                    }
                }
                andHandler(this.epStack);
                // console.log(orStack);

                if (orStack.length == 1) {
                    return orStack.shift();
                } else {
                    return {
                        operator: "or",
                        operand: orStack
                    };
                }
            }
        };
        return res;
    };
    op.eq = function(value) {
        return this._res(value, "==");
    };
    op["=="] = op.eq;
    //不等表达式
    op.ne = function(value) {
        return this._res(value, "!=");
    };
    op["!="] = op.ne;
    //大于表达式
    op.gt = function(value) {
        return this._res(value, ">");
    };
    op[">"] = op.gt;
    //大于等于表达式
    op.ge = function(value) {
        return this._res(value, ">=");
    };
    op[">="] = op.ge;
    //小于表达式
    op.lt = function(value) {
        return this._res(value, "<");
    };
    op["<"] = op.lt;
    //小于等于表达式
    op.le = function(value) {
        return this._res(value, "<=");
    };
    op["<="] = op.le;
    //模糊匹配表达式
    op.lk = function(value) {
        return this._res(value, "like");
    };
    op.like = op.lk;
    return op;
};

if (define === undefined) {
    var define = function() {

    };
    // var exprLink = $and($E("name")["=="]("aa").and($E("sex")["=="]("male"))
    //     .or($E("name")["=="]("bb").and($E("sex")["=="]("female"))),
    //     $E("age")[">="]("30").and($E("age")["<="]("60")));
    // var exprLink = $E("name")["=="]("aa").and($E("sex")["=="]("male"))
    //     .or($E("name")["=="]("bb").and($E("sex")["=="]("female")));

    // var exprChain = $E("name")["=="]("").and($or($E("eye")["=="]("blue"), $E("eye")["=="]("black")))
    //     .or($E("age")[">="]("30").and($E("age")["<="]("60")));
    // var exprChain = $E("priority")["=="]("info")
    //     .and($E("startTime")[">="]("2017-05-01"))
    //     .and($E("endTime")["<="]("2017-06-01"))
    //     .and($E("ip")["!="]("127.0.0.1"))
    //     .and($E("class")["!="]("Main"))
    //     .and($E("thread")["!="]("MonitorThread"));
    // var qdsl = new QDSL().where(exprChain);
    // qdsl.json();
    // console.log("output: " + qdsl.json());
}

define([], function() {
    'use strict';
    return {
        $Q: QDSL,
        $E: $E
    };
});

//aa || bb || cc && dd || ee && ff