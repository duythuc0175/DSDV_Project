!function (a, b) {
    "use strict";
    if ("object" == typeof exports) module.exports = b(require("d3v3")); else if ("function" == typeof define && define.amd) define(["d3v3"], function (c) {
        return a.dimple = b(c), a.dimple
    }); else if (a.d3v3) a.dimple = b(a.d3v3); else {
        if (!console || !console.warn) throw "dimple requires d3v3 to run.  Are you missing a reference to the d3v3 library?";
        console.warn("dimple requires d3v3 to run.  Are you missing a reference to the d3v3 library?")
    }
}(this, function (a) {
    "use strict";
    var b = {version: "2.1.6", plot: {}, aggregateMethod: {}};
    return b.axis = function (c, d, e, f, g, h) {
        this.chart = c, this.position = d, this.categoryFields = null === g || void 0 === g ? e : [].concat(g), this.measure = f, this.timeField = g, this.floatingBarWidth = 5, this.hidden = !1, this.showPercent = !1, this.colors = null, this.overrideMin = null, this.overrideMax = null, this.shapes = null, this.showGridlines = null, this.gridlineShapes = null, this.titleShape = null, this.dateParseFormat = null, this.tickFormat = null, this.timePeriod = null, this.timeInterval = 1, this.useLog = !1, this.logBase = 10, this.title = void 0, this.clamp = !0, this.ticks = null, this.fontSize = "10px", this.fontFamily = "sans-serif", this.autoRotateLabel = null === h || void 0 === h ? !0 : h, this._slaves = [], this._scale = null, this._min = 0, this._max = 0, this._previousOrigin = null, this._origin = null, this._orderRules = [], this._groupOrderRules = [], this._draw = null, this._getAxisData = function () {
            var a, b, c = [], d = !1;
            if (this.chart && this.chart.series) {
                for (a = 0; a < this.chart.series.length; a += 1) b = this.chart.series[a], b[this.position] === this && (b.data && b.data.length > 0 ? c = c.concat(b.data) : d = !0);
                d && this.chart.data && (c = c.concat(this.chart.data))
            }
            return c
        }, this._getFontSize = function () {
            var a;
            return a = this.fontSize && "auto" !== this.fontSize.toString().toLowerCase() ? isNaN(this.fontSize) ? this.fontSize : this.fontSize + "px" : (this.chart._heightPixels() / 35 > 10 ? this.chart._heightPixels() / 35 : 10) + "px"
        }, this._getFormat = function () {
            var b, c, d, e, f, g, h;
            return null !== this.tickFormat && void 0 !== this.tickFormat ? b = this._hasTimeField() ? a.time.format(this.tickFormat) : a.format(this.tickFormat) : this.showPercent ? b = a.format("%") : this.useLog && null !== this.measure ? b = function (b) {
                var c = Math.floor(Math.abs(b), 0).toString().length, d = Math.min(Math.floor((c - 1) / 3), 4),
                    e = "kmBT".substring(d - 1, d),
                    f = "0" === Math.round(b / Math.pow(1e3, d) * 10).toString().slice(-1) ? 0 : 1;
                return 0 === b ? 0 : a.format(",." + f + "f")(b / Math.pow(1e3, d)) + e
            } : null !== this.measure ? (c = Math.floor(Math.abs(this._max), 0).toString(), d = Math.floor(Math.abs(this._min), 0).toString(), e = Math.max(d.length, c.length), e > 3 ? (f = Math.min(Math.floor((e - 1) / 3), 4), g = "kmBT".substring(f - 1, f), h = 1 >= e - 3 * f ? 1 : 0, b = function (b) {
                return 0 === b ? 0 : a.format(",." + h + "f")(b / Math.pow(1e3, f)) + g
            }) : (h = -Math.floor(Math.log(this._tick_step) / Math.LN10), b = a.format(",." + h + "f"))) : b = function (a) {
                return a
            }, b
        }, this._getTimePeriod = function () {
            var b = this.timePeriod, c = 30, d = this._max - this._min;
            return this._hasTimeField() && !this.timePeriod && (b = c >= d / 1e3 ? a.time.seconds : c >= d / 6e4 ? a.time.minutes : c >= d / 36e5 ? a.time.hours : c >= d / 864e5 ? a.time.days : c >= d / 6048e5 ? a.time.weeks : c >= d / 26298e5 ? a.time.months : a.time.years), b
        }, this._getTooltipText = function (b, c) {
            if (this._hasTimeField()) c[this.position + "Field"][0] && b.push(this.timeField + ": " + this._getFormat()(c[this.position + "Field"][0])); else if (this._hasCategories()) this.categoryFields.forEach(function (a, d) {
                null !== a && void 0 !== a && c[this.position + "Field"][d] && b.push(a + (c[this.position + "Field"][d] !== a ? ": " + c[this.position + "Field"][d] : ""))
            }, this); else if (this._hasMeasure()) switch (this.position) {
                case"x":
                    b.push(this.measure + ": " + this._getFormat()(c.width));
                    break;
                case"y":
                    b.push(this.measure + ": " + this._getFormat()(c.height));
                    break;
                case"p":
                    b.push(this.measure + ": " + this._getFormat()(c.angle) + " (" + a.format("%")(c.piePct) + ")");
                    break;
                default:
                    b.push(this.measure + ": " + this._getFormat()(c[this.position + "Value"]))
            }
        }, this._getTopMaster = function () {
            var a = this;
            return null !== this.master && void 0 !== this.master && (a = this.master._getTopMaster()), a
        }, this._hasCategories = function () {
            return null !== this.categoryFields && void 0 !== this.categoryFields && this.categoryFields.length > 0
        }, this._hasMeasure = function () {
            return null !== this.measure && void 0 !== this.measure
        }, this._hasTimeField = function () {
            return null !== this.timeField && void 0 !== this.timeField
        }, this._parseDate = function (b) {
            var c;
            return c = null === this.dateParseFormat || void 0 === this.dateParseFormat ? isNaN(b) ? Date.parse(b) : new Date(b) : a.time.format(this.dateParseFormat).parse(b)
        }, this._update = function (c) {
            var d, e, f, g, h = [], i = this.ticks || 10, j = function (a, c, d) {
                var e, f, g = a.categoryFields[0], h = a._getAxisData(), i = g, j = !1, k = !0, l = null;
                for (e = 0; e < h.length; e += 1) if (l = a._parseDate(h[e][g]), null !== l && void 0 !== l && isNaN(l)) {
                    k = !1;
                    break
                }
                return k || a.chart.series.forEach(function (b) {
                    b[c] === a && b[d]._hasMeasure() && (i = b[d].measure, j = !0)
                }, this), f = a._orderRules.concat({ordering: i, desc: j}), b._getOrderedList(h, g, f)
            };
            if (this._min = this.showPercent && this._min < -1 ? -1 : this._min, this._max = this.showPercent && this._max > 1 ? 1 : this._max, this._min = null !== this.overrideMin ? this.overrideMin : this._min, this._max = null !== this.overrideMax ? this.overrideMax : this._max, "x" !== this.position || null !== this._scale && !c) {
                if ("y" !== this.position || null !== this._scale && !c) this.position.length > 0 && "z" === this.position[0] && null === this._scale ? this.useLog ? this._scale = a.scale.log().range([this.chart._heightPixels() / 300, this.chart._heightPixels() / 10]).domain([0 === this._min ? Math.pow(this.logBase, -1) : this._min, 0 === this._max ? -1 * Math.pow(this.logBase, -1) : this._max]).clamp(this.clamp).base(this.logBase) : this._scale = a.scale.linear().range([1, this.chart._heightPixels() / 10]).domain([this._min, this._max]).clamp(this.clamp) : this.position.length > 0 && "p" === this.position[0] && null === this._scale ? this.useLog ? this._scale = a.scale.log().range([0, 360]).domain([0 === this._min ? Math.pow(this.logBase, -1) : this._min, 0 === this._max ? -1 * Math.pow(this.logBase, -1) : this._max]).clamp(this.clamp).base(this.logBase) : this._scale = a.scale.linear().range([0, 360]).domain([this._min, this._max]).clamp(this.clamp) : this.position.length > 0 && "c" === this.position[0] && null === this._scale && (this._scale = a.scale.linear().range([0, null === this.colors || 1 === this.colors.length ? 1 : this.colors.length - 1]).domain([this._min, this._max]).clamp(this.clamp)); else if (this._hasTimeField() ? this._scale = a.time.scale().range([this.chart._yPixels() + this.chart._heightPixels(), this.chart._yPixels()]).domain([this._min, this._max]).clamp(this.clamp) : this.useLog ? this._scale = a.scale.log().range([this.chart._yPixels() + this.chart._heightPixels(), this.chart._yPixels()]).domain([0 === this._min ? Math.pow(this.logBase, -1) : this._min, 0 === this._max ? -1 * Math.pow(this.logBase, -1) : this._max]).clamp(this.clamp).base(this.logBase).nice() : null === this.measure || void 0 === this.measure ? (h = j(this, "y", "x"), null !== this._slaves && void 0 !== this._slaves && this._slaves.forEach(function (a) {
                    h = h.concat(j(a, "y", "x"))
                }, this), this._scale = a.scale.ordinal().rangePoints([this.chart._yPixels() + this.chart._heightPixels(), this.chart._yPixels()]).domain(h.concat([""]))) : this._scale = a.scale.linear().range([this.chart._yPixels() + this.chart._heightPixels(), this.chart._yPixels()]).domain([this._min, this._max]).clamp(this.clamp).nice(), !this.hidden) switch (this.chart._axisIndex(this, "y")) {
                    case 0:
                        this._draw = a.svg.axis().orient("left").scale(this._scale), this.ticks && this._draw.ticks(i);
                        break;
                    case 1:
                        this._draw = a.svg.axis().orient("right").scale(this._scale), this.ticks && this._draw.ticks(i)
                }
            } else if (this._hasTimeField() ? this._scale = a.time.scale().range([this.chart._xPixels(), this.chart._xPixels() + this.chart._widthPixels()]).domain([this._min, this._max]).clamp(this.clamp) : this.useLog ? this._scale = a.scale.log().range([this.chart._xPixels(), this.chart._xPixels() + this.chart._widthPixels()]).domain([0 === this._min ? Math.pow(this.logBase, -1) : this._min, 0 === this._max ? -1 * Math.pow(this.logBase, -1) : this._max]).clamp(this.clamp).base(this.logBase).nice() : null === this.measure || void 0 === this.measure ? (h = j(this, "x", "y"), null !== this._slaves && void 0 !== this._slaves && this._slaves.forEach(function (a) {
                h = h.concat(j(a, "x", "y"))
            }, this), this._scale = a.scale.ordinal().rangePoints([this.chart._xPixels(), this.chart._xPixels() + this.chart._widthPixels()]).domain(h.concat([""]))) : this._scale = a.scale.linear().range([this.chart._xPixels(), this.chart._xPixels() + this.chart._widthPixels()]).domain([this._min, this._max]).clamp(this.clamp).nice(), !this.hidden) switch (this.chart._axisIndex(this, "x")) {
                case 0:
                    this._draw = a.svg.axis().orient("bottom").scale(this._scale), this.ticks && this._draw.ticks(i);
                    break;
                case 1:
                    this._draw = a.svg.axis().orient("top").scale(this._scale), this.ticks && this._draw.ticks(i)
            }
            return null !== this._slaves && void 0 !== this._slaves && this._slaves.length > 0 && this._slaves.forEach(function (a) {
                a._scale = this._scale
            }, this), null !== c && void 0 !== c && c !== !1 || this._hasTimeField() || null === this._scale || null === this._scale.ticks || void 0 === this._scale.ticks || !(this._scale.ticks(i).length > 0) || "x" !== this.position && "y" !== this.position || (d = this._scale.ticks(i), e = d[1] - d[0], f = ((this._max - this._min) % e).toFixed(0), this._tick_step = e, 0 !== f && (this._max = Math.ceil(this._max / e) * e, this._min = Math.floor(this._min / e) * e, this._update(!0))), g = null !== h && void 0 !== h && h.length > 0 ? this._scale.copy()(h[0]) : this._min > 0 ? this._scale.copy()(this._min) : this._max < 0 ? this._scale.copy()(this._max) : this._scale.copy()(0), this._origin !== g && (this._previousOrigin = null === this._origin ? g : this._origin, this._origin = g), this
        }, this.addGroupOrderRule = function (a, b) {
            this._groupOrderRules.push({ordering: a, desc: b})
        }, this.addOrderRule = function (a, b) {
            this._orderRules.push({ordering: a, desc: b})
        }
    }, b.chart = function (c, d) {
        this.svg = c, this.x = "10%", this.y = "10%", this.width = "80%", this.height = "80%", this.data = d, this.noFormats = !1, this.axes = [], this.series = [], this.legends = [], this.storyboard = null, this.titleShape = null, this.shapes = null, this.ease = "cubic-in-out", this.staggerDraw = !1, this._group = c.append("g"), this._tooltipGroup = null, this._assignedColors = {}, this._assignedClasses = {}, this._nextColor = 0, this._nextClass = 0, this._axisIndex = function (a, b) {
            var c = 0, d = 0, e = -1;
            for (c = 0; c < this.axes.length; c += 1) {
                if (this.axes[c] === a) {
                    e = d;
                    break
                }
                (null === b || void 0 === b || b[0] === this.axes[c].position[0]) && (d += 1)
            }
            return e
        }, this._getAllData = function () {
            var a = [];
            return null !== this.data && void 0 !== this.data && this.data.length > 0 && (a = a.concat(this.data)), null !== this.series && void 0 !== this.series && this.series.length > 0 && this.series.forEach(function (b) {
                null !== b.data && void 0 !== b.data && b.data.length > 0 && (a = a.concat(b.data))
            }), a
        }, this._getData = function (c, d, e, f, g, h, i, j, k, l) {
            var m, n, o = [], p = function (a, b) {
                    var c = [];
                    return null !== a && (a._hasTimeField() ? c.push(a._parseDate(b[a.timeField])) : a._hasCategories() && a.categoryFields.forEach(function (a) {
                        c.push(b[a])
                    }, this)), c
                }, q = {x: !1, y: !1, z: !1, p: !1, c: !1}, r = {x: [], y: []}, s = {x: [], y: [], z: [], p: []},
                t = {min: null, max: null}, u = {x: [], y: [], z: [], p: []}, v = [], w = {},
                x = {x: 0, y: 0, z: 0, p: 0}, y = "", z = [], A = [], B = [], C = "", D = [], E = "", F = [], G = "",
                H = [], I = [], J = c, K = [];
            this.storyboard && this.storyboard.categoryFields.length > 0 && (y = this.storyboard.categoryFields[0], z = b._getOrderedList(J, y, this.storyboard._orderRules)), h && h._hasCategories() && h._hasMeasure() && (C = h.categoryFields[0], D = b._getOrderedList(J, C, h._orderRules.concat([{
                ordering: h.measure,
                desc: !0
            }]))), i && i._hasCategories() && i._hasMeasure() && (E = i.categoryFields[0], F = b._getOrderedList(J, E, i._orderRules.concat([{
                ordering: i.measure,
                desc: !0
            }]))), k && k._hasCategories() && k._hasMeasure() && (G = k.categoryFields[0], H = b._getOrderedList(J, G, k._orderRules.concat([{
                ordering: k.measure,
                desc: !0
            }]))), J.length > 0 && d && d.length > 0 && (I = [].concat(f), A = [], d.forEach(function (a) {
                void 0 !== J[0][a] && A.push(a)
            }, this), k && k._hasMeasure() ? I.push({
                ordering: k.measure,
                desc: !0
            }) : l && l._hasMeasure() ? I.push({
                ordering: l.measure,
                desc: !0
            }) : j && j._hasMeasure() ? I.push({
                ordering: j.measure,
                desc: !0
            }) : h && h._hasMeasure() ? I.push({
                ordering: h.measure,
                desc: !0
            }) : i && i._hasMeasure() && I.push({
                ordering: i.measure,
                desc: !0
            }), B = b._getOrderedList(J, A, I)), J.sort(function (a, b) {
                var c, d, e, f, g, h, i = 0;
                if ("" !== y && (i = z.indexOf(a[y]) - z.indexOf(b[y])), "" !== C && 0 === i && (i = D.indexOf(a[C]) - D.indexOf(b[C])), "" !== E && 0 === i && (i = F.indexOf(a[E]) - F.indexOf(b[E])), "" !== G && 0 === i && (i = H.indexOf(a[G]) - F.indexOf(b[G])), A && A.length > 0 && 0 === i) for (c = [].concat(A), i = 0, e = 0; e < B.length; e += 1) {
                    for (d = [].concat(B[e]), g = !0, h = !0, f = 0; f < c.length; f += 1) g = g && a[c[f]] === d[f], h = h && b[c[f]] === d[f];
                    if (g && h) {
                        i = 0;
                        break
                    }
                    if (g) {
                        i = -1;
                        break
                    }
                    if (h) {
                        i = 1;
                        break
                    }
                }
                return i
            }), J.forEach(function (a) {
                var b, c, f, g, m, n = -1, r = p(h, a), s = p(i, a), t = p(j, a), u = p(k, a), v = [];
                if (d && 0 !== d.length) for (f = 0; f < d.length; f += 1) void 0 === a[d[f]] ? v.push(d[f]) : v.push(a[d[f]]); else v = ["All"];
                for (b = v.join("/") + "_" + r.join("/") + "_" + s.join("/") + "_" + u.join("/") + "_" + t.join("/"), c = 0; c < o.length; c += 1) if (o[c].key === b) {
                    n = c;
                    break
                }
                -1 === n && (g = {
                    key: b,
                    aggField: v,
                    xField: r,
                    xValue: null,
                    xCount: 0,
                    yField: s,
                    yValue: null,
                    yCount: 0,
                    pField: u,
                    pValue: null,
                    pCount: 0,
                    zField: t,
                    zValue: null,
                    zCount: 0,
                    cValue: 0,
                    cCount: 0,
                    x: 0,
                    y: 0,
                    xOffset: 0,
                    yOffset: 0,
                    width: 0,
                    height: 0,
                    cx: 0,
                    cy: 0,
                    xBound: 0,
                    yBound: 0,
                    xValueList: [],
                    yValueList: [],
                    zValueList: [],
                    pValueList: [],
                    cValueList: [],
                    fill: {},
                    stroke: {}
                }, o.push(g), n = o.length - 1), m = function (b, c) {
                    var d, f, g = !0, h = {value: 0, count: 1}, i = {value: 0, count: 1}, j = "";
                    null !== c && (d = c.getFrameValue(), c.categoryFields.forEach(function (b, c) {
                        c > 0 && (j += "/"), j += a[b], g = j === d
                    }, this)), null !== b && void 0 !== b && g && (f = o[n], b._hasMeasure() && null !== a[b.measure] && void 0 !== a[b.measure] && (-1 === f[b.position + "ValueList"].indexOf(a[b.measure]) && f[b.position + "ValueList"].push(a[b.measure]), isNaN(parseFloat(a[b.measure])) && (q[b.position] = !0), h.value = f[b.position + "Value"], h.count = f[b.position + "Count"], i.value = a[b.measure], f[b.position + "Value"] = e(h, i), f[b.position + "Count"] += 1))
                }, m(h, this.storyboard), m(i, this.storyboard), m(j, this.storyboard), m(k, this.storyboard), m(l, this.storyboard)
            }, this), h && h._hasCategories() && h.categoryFields.length > 1 && void 0 !== r.x && (K = [], i._hasMeasure() && K.push({
                ordering: i.measure,
                desc: !0
            }), r.x = b._getOrderedList(J, h.categoryFields[1], h._groupOrderRules.concat(K))), i && i._hasCategories() && i.categoryFields.length > 1 && void 0 !== r.y && (K = [], h._hasMeasure() && K.push({
                ordering: h.measure,
                desc: !0
            }), r.y = b._getOrderedList(J, i.categoryFields[1], i._groupOrderRules.concat(K)), r.y.reverse()), o.forEach(function (a) {
                null !== h && (q.x === !0 && (a.xValue = a.xValueList.length), m = (s.x[a.xField.join("/")] || 0) + (i._hasMeasure() ? Math.abs(a.yValue) : 0), s.x[a.xField.join("/")] = m), null !== i && (q.y === !0 && (a.yValue = a.yValueList.length), m = (s.y[a.yField.join("/")] || 0) + (h._hasMeasure() ? Math.abs(a.xValue) : 0), s.y[a.yField.join("/")] = m), null !== k && (q.p === !0 && (a.pValue = a.pValueList.length), m = (s.p[a.pField.join("/")] || 0) + (k._hasMeasure() ? Math.abs(a.pValue) : 0), s.p[a.pField.join("/")] = m), null !== j && (q.z === !0 && (a.zValue = a.zValueList.length), m = (s.z[a.zField.join("/")] || 0) + (j._hasMeasure() ? Math.abs(a.zValue) : 0), s.z[a.zField.join("/")] = m), null !== l && ((null === t.min || a.cValue < t.min) && (t.min = a.cValue), (null === t.max || a.cValue > t.max) && (t.max = a.cValue))
            }, this);
            for (n in s.x) s.x.hasOwnProperty(n) && (x.x += s.x[n]);
            for (n in s.y) s.y.hasOwnProperty(n) && (x.y += s.y[n]);
            for (n in s.p) s.p.hasOwnProperty(n) && (x.p += s.p[n]);
            for (n in s.z) s.z.hasOwnProperty(n) && (x.z += s.z[n]);
            return o.forEach(function (b) {
                var c, d, e, f, m, n = function (a, c, d) {
                    var e, f, h, i, j;
                    null !== a && void 0 !== a && (i = a.position, a._hasCategories() ? a._hasMeasure() ? (e = b[a.position + "Field"].join("/"), f = a.showPercent ? s[a.position][e] / x[a.position] : s[a.position][e], -1 === v.indexOf(e) && (w[e] = f + (v.length > 0 ? w[v[v.length - 1]] : 0), v.push(e)), h = b[i + "Bound"] = b["c" + i] = "x" !== i && "y" !== i || !g ? f : w[e], b[d] = f, b[i] = h - ("x" === i && f >= 0 || "y" === i && 0 >= f ? f : 0)) : (b[i] = b["c" + i] = b[i + "Field"][0], b[d] = 1, void 0 !== r[i] && null !== r[i] && r[i].length >= 2 && (b[i + "Offset"] = r[i].indexOf(b[i + "Field"][1]), b[d] = 1 / r[i].length)) : (f = a.showPercent ? b[i + "Value"] / s[c][b[c + "Field"].join("/")] : b[i + "Value"], e = b[c + "Field"].join("/") + (b[i + "Value"] >= 0), j = u[i][e] = (null === u[i][e] || void 0 === u[i][e] || "z" === i || "p" === i ? 0 : u[i][e]) + f, h = b[i + "Bound"] = b["c" + i] = "x" !== i && "y" !== i || !g ? f : j, b[d] = f, b[i] = h - ("x" === i && f >= 0 || "y" === i && 0 >= f ? f : 0)))
                };
                n(h, "y", "width"), n(i, "x", "height"), n(j, "z", "r"), n(k, "p", "angle"), null !== l && null !== t.min && null !== t.max && (t.min === t.max && (t.min -= .5, t.max += .5), t.min = l.overrideMin || t.min, t.max = l.overrideMax || t.max, b.cValue = b.cValue > t.max ? t.max : b.cValue < t.min ? t.min : b.cValue, e = a.scale.linear().range([0, null === l.colors || 1 === l.colors.length ? 1 : l.colors.length - 1]).domain([t.min, t.max]), f = e(b.cValue), m = f - Math.floor(f), b.cValue === t.max && (m = 1), l.colors && 1 === l.colors.length ? (c = a.rgb(l.colors[0]), d = a.rgb(this.getColor(b.aggField.slice(-1)[0]).fill)) : l.colors && l.colors.length > 1 ? (c = a.rgb(l.colors[Math.floor(f)]), d = a.rgb(l.colors[Math.ceil(f)])) : (c = a.rgb("white"), d = a.rgb(this.getColor(b.aggField.slice(-1)[0]).fill)), c.r = Math.floor(c.r + (d.r - c.r) * m), c.g = Math.floor(c.g + (d.g - c.g) * m), c.b = Math.floor(c.b + (d.b - c.b) * m), b.fill = c.toString(), b.stroke = c.darker(.5).toString())
            }, this), o
        }, this._getDelay = function (a, c, d) {
            return function (e) {
                var f = 0;
                return d && c.staggerDraw && (d.x._hasCategories() ? f = b._helpers.cx(e, c, d) / c._widthPixels() * a : d.y._hasCategories() && (f = (1 - b._helpers.cy(e, c, d) / c._heightPixels()) * a)), f
            }
        }, this._getSeriesData = function () {
            null !== this.series && void 0 !== this.series && this.series.forEach(function (a) {
                var b, c, d, e, f, g, h = a.data || this.data || [], i = [].concat(a.categoryFields || "All"),
                    j = this._getData(h, i, a.aggregate, a._orderRules, a._isStacked(), a.x, a.y, a.z, a.p, a.c),
                    k = [], l = {}, m = a.startAngle * (Math.PI / 180) || 0, n = (a.endAngle || 360) * (Math.PI / 180);
                if (m > n && (m -= 2 * Math.PI), a.p && i.length > 0) {
                    if (a.x && a.y) {
                        for (i.pop(), k = this._getData(h, ["__dimple_placeholder__"].concat(i), a.aggregate, a._orderRules, a._isStacked(), a.x, a.y, a.z, a.p, a.c), b = 0; b < j.length; b += 1) for (d = ["__dimple_placeholder__"].concat(j[b].aggField), d.pop(), a.x && a.x._hasCategories() && (d = d.concat(j[b].xField)), a.y && a.y._hasCategories() && (d = d.concat(j[b].yField)), e = d.join("|"), c = 0; c < k.length; c += 1) if (f = [].concat(k[c].aggField), a.x && a.x._hasCategories() && (f = f.concat(k[c].xField)), a.y && a.y._hasCategories() && (f = f.concat(k[c].yField)), g = f.join("|"), e === g) {
                            j[b].xField = k[c].xField, j[b].xValue = k[c].xValue, j[b].xCount = k[c].xCount, j[b].yField = k[c].yField, j[b].yValue = k[c].yValue, j[b].yCount = k[c].yCount, j[b].zField = k[c].zField, j[b].zValue = k[c].zValue, j[b].zCount = k[c].zCount, j[b].x = k[c].x, j[b].y = k[c].y, j[b].r = k[c].r, j[b].xOffset = k[c].xOffset, j[b].yOffset = k[c].yOffset, j[b].width = k[c].width, j[b].height = k[c].height, j[b].cx = k[c].cx, j[b].cy = k[c].cy, j[b].xBound = k[c].xBound, j[b].yBound = k[c].yBound, j[b].xValueList = k[c].xValueList, j[b].yValueList = k[c].yValueList, j[b].zValueList = k[c].zValueList, j[b].cValueList = k[c].cValueList, j[b].pieKey = k[c].key, j[b].value = j.pValue, l[k[c].key] || (l[k[c].key] = {
                                total: 0,
                                angle: m
                            }), l[k[c].key].total += j[b].pValue;
                            break
                        }
                    } else for (b = 0; b < j.length; b += 1) j[b].pieKey = "All", j[b].value = j.pValue, l[j[b].pieKey] || (l[j[b].pieKey] = {
                        total: 0,
                        angle: m
                    }), l[j[b].pieKey].total += j[b].pValue;
                    for (b = 0; b < j.length; b += 1) j[b].piePct = j[b].pValue / l[j[b].pieKey].total, j[b].startAngle = l[j[b].pieKey].angle, j[b].endAngle = j[b].startAngle + j[b].piePct * (n - m), l[j[b].pieKey].angle = j[b].endAngle
                }
                a._positionData = j
            }, this)
        }, this._handleTransition = function (a, b, c, d) {
            var e = null;
            return e = 0 === b ? a : a.transition().duration(b).delay(c._getDelay(b, c, d)).ease(c.ease)
        }, this._heightPixels = function () {
            return b._parseYPosition(this.height, this.svg.node())
        }, this._registerEventHandlers = function (c) {
            null !== c._eventHandlers && c._eventHandlers.length > 0 && c._eventHandlers.forEach(function (d) {
                var e, f = function (e) {
                    var f = new b.eventArgs;
                    null !== c.chart.storyboard && (f.frameValue = c.chart.storyboard.getFrameValue()), f.seriesValue = e.aggField, f.xValue = e.x, f.yValue = e.y, f.zValue = e.z, f.pValue = e.p, f.colorValue = e.cValue, f.seriesShapes = c.shapes, f.selectedShape = a.select(this), d.handler(f)
                };
                if (null !== d.handler && "function" == typeof d.handler) if (null !== c._markers && void 0 !== c._markers) for (e in c._markers) c._markers.hasOwnProperty(e) && c._markers[e].on(d.event, f); else c.shapes.on(d.event, f)
            }, this)
        }, this._widthPixels = function () {
            return b._parseXPosition(this.width, this.svg.node())
        }, this._xPixels = function () {
            return b._parseXPosition(this.x, this.svg.node())
        }, this._yPixels = function () {
            return b._parseYPosition(this.y, this.svg.node())
        }, this.addAxis = function (a, c, d, e) {
            var f = null, g = null;
            if (null !== c && void 0 !== c && (c = [].concat(c)), "string" == typeof a || a instanceof String) f = new b.axis(this, a, c, d, e), this.axes.push(f); else {
                if (g = a, f = new b.axis(this, g.position, c, d, e), f._hasMeasure() !== g._hasMeasure()) throw "You have specified a composite axis where some but not all axes have a measure - this is not supported, all axes must be of the same type.";
                if (f._hasTimeField() !== g._hasTimeField()) throw "You have specified a composite axis where some but not all axes have a time field - this is not supported, all axes must be of the same type.";
                if ((null === f.categoryFields || void 0 === f.categoryFields ? 0 : f.categoryFields.length) !== (null === g.categoryFields || void 0 === g.categoryFields ? 0 : g.categoryFields.length)) throw "You have specified a composite axis where axes have differing numbers of category fields - this is not supported, all axes must be of the same type.";
                g._slaves.push(f)
            }
            return f
        }, this.addCategoryAxis = function (a, b) {
            return this.addAxis(a, b, null)
        }, this.addColorAxis = function (a, b) {
            var c = this.addAxis("c", null, a);
            return c.colors = null === b || void 0 === b ? null : [].concat(b), c
        }, this.addLegend = function (a, c, d, e, f, g) {
            g = null === g || void 0 === g ? this.series : [].concat(g), f = null === f || void 0 === f ? "left" : f;
            var h = new b.legend(this, a, c, d, e, f, g);
            return this.legends.push(h), h
        }, this.addLogAxis = function (a, b, c) {
            var d = this.addAxis(a, null, b, null);
            return null !== c && void 0 !== c && (d.logBase = c), d.useLog = !0, d
        }, this.addMeasureAxis = function (a, b) {
            return this.addAxis(a, null, b)
        }, this.addPctAxis = function (a, b, c) {
            var d = null;
            return d = null !== c && void 0 !== c ? this.addAxis(a, c, b) : this.addMeasureAxis(a, b), d.showPercent = !0, d
        }, this.addSeries = function (a, c, d) {
            (null === d || void 0 === d) && (d = this.axes), (null === c || void 0 === c) && (c = b.plot.bubble);
            var e, f = null, g = null, h = null, i = null, j = null;
            return d.forEach(function (a) {
                null !== a && c.supportedAxes.indexOf(a.position) > -1 && (null === f && "x" === a.position[0] ? f = a : null === g && "y" === a.position[0] ? g = a : null === h && "z" === a.position[0] ? h = a : null === i && "c" === a.position[0] ? i = a : null === i && "p" === a.position[0] && (j = a))
            }, this), a && (a = [].concat(a)), e = new b.series(this, a, f, g, h, i, j, c, b.aggregateMethod.sum, c.stacked), this.series.push(e), e
        }, this.addTimeAxis = function (a, b, c, d) {
            var e = this.addAxis(a, null, null, b);
            return e.tickFormat = d, e.dateParseFormat = c, e
        }, this.assignClass = function (a, b) {
            return this._assignedClasses[a] = b, this._assignedClasses[a]
        }, this.assignColor = function (a, c, d, e) {
            return this._assignedColors[a] = new b.color(c, d, e), this._assignedColors[a]
        }, this.customClassList = {
            axisLine: "dimple-custom-axis-line",
            axisLabel: "dimple-custom-axis-label",
            axisTitle: "dimple-custom-axis-title",
            tooltipBox: "dimple-custom-tooltip-box",
            tooltipLabel: "dimple-custom-tooltip-label",
            tooltipDropLine: "dimple-custom-tooltip-dropline",
            lineMarker: "dimple-custom-line-marker",
            legendLabel: "dimple-custom-legend-label",
            legendKey: "dimple-custom-legend-key",
            areaSeries: "dimple-custom-series-area",
            barSeries: "dimple-custom-series-bar",
            bubbleSeries: "dimple-custom-series-bubble",
            lineSeries: "dimple-custom-series-line",
            pieSeries: "dimple-custom-series-pie",
            gridline: "dimple-custom-gridline",
            colorClasses: ["dimple-custom-format-1", "dimple-custom-format-2", "dimple-custom-format-3", "dimple-custom-format-4", "dimple-custom-format-5", "dimple-custom-format-6", "dimple-custom-format-7", "dimple-custom-format-8", "dimple-custom-format-9", "dimple-custom-format-10"]
        }, this.defaultColors = [new b.color("#80B1D3"), new b.color("#FB8072"), new b.color("#FDB462"), new b.color("#B3DE69"), new b.color("#FFED6F"), new b.color("#BC80BD"), new b.color("#8DD3C7"), new b.color("#CCEBC5"), new b.color("#FFFFB3"), new b.color("#BEBADA"), new b.color("#FCCDE5"), new b.color("#D9D9D9")], this.draw = function (b, c) {
            b = b || 0;
            var d, e, f = null, g = null, h = !1, i = !1, j = this._xPixels(), k = this._yPixels(),
                l = this._widthPixels(), m = this._heightPixels();
            return (void 0 === c || null === c || c === !1) && this._getSeriesData(), this.axes.forEach(function (a) {
                a._scale = null
            }, this), this.axes.forEach(function (a) {
                if (a._min = 0, a._max = 0, e = [], a._hasMeasure()) {
                    var b = !1;
                    this.series.forEach(function (c) {
                        if (c._deepMatch(a)) {
                            var d = c._axisBounds(a.position);
                            a._min > d.min && (a._min = d.min), a._max < d.max && (a._max = d.max), b = !0
                        }
                    }, this), b || this._getAllData().forEach(function (b) {
                        a._min > b[a.measure] && (a._min = b[a.measure]), a._max < b[a.measure] && (a._max = b[a.measure])
                    }, this)
                } else a._hasTimeField() ? (a._min = null, a._max = null, this.series.forEach(function (b) {
                    b._deepMatch(a) && null !== b[a.position].timeField && void 0 !== b[a.position].timeField && -1 === e.indexOf(b[a.position].timeField) && e.push(b[a.position].timeField)
                }, this), a._getAxisData().forEach(function (b) {
                    e.forEach(function (c) {
                        var d = a._parseDate(b[c]);
                        (null === a._min || d < a._min) && (a._min = d), (null === a._max || d > a._max) && (a._max = d)
                    }, this)
                }, this)) : a._hasCategories() && (a._min = 0, d = [], this.series.forEach(function (b) {
                    b._deepMatch(a) && null !== b[a.position].categoryFields[0] && void 0 !== b[a.position].categoryFields[0] && -1 === e.indexOf(b[a.position].categoryFields[0]) && e.push(b[a.position].categoryFields[0])
                }, this), a._getAxisData().forEach(function (a) {
                    e.forEach(function (b) {
                        -1 === d.indexOf(a[b]) && d.push(a[b])
                    }, this)
                }, this), a._max = d.length);
                null !== a._slaves && void 0 !== a._slaves && a._slaves.length > 0 && a._slaves.forEach(function (b) {
                    b._min = a._min, b._max = a._max
                }, this), a._update(), null === f && "x" === a.position ? f = a : null === g && "y" === a.position && (g = a)
            }, this), this.axes.forEach(function (c) {
                var d = !1, e = null, n = 0, o = null, p = !1, q = 0, r = {l: null, t: null, r: null, b: null}, s = 0,
                    t = 0, u = "", v = this, w = function (a) {
                        var c;
                        return c = null === e || 0 === b || d ? a : v._handleTransition(a, b, v)
                    }, x = function () {
                        var b = a.select(this).selectAll("text");
                        return !c.measure && c._max > 0 && ("x" === c.position ? b.attr("x", l / c._max / 2) : "y" === c.position && b.attr("y", -1 * (m / c._max) / 2)), c.categoryFields && c.categoryFields.length > 0 && (c !== f || null !== g.categoryFields && 0 !== g.categoryFields.length || b.attr("y", k + m - g._scale(0) + 9), c !== g || null !== f.categoryFields && 0 !== f.categoryFields.length || b.attr("x", -1 * (f._scale(0) - j) - 9)), this
                    }, y = function (b) {
                        return function () {
                            var c = a.select(this).attr("class") || "";
                            return -1 === c.indexOf(b) && (c += " " + b), c.trim()
                        }
                    };
                null === c.gridlineShapes ? (c.showGridlines || null === c.showGridlines && !c._hasCategories() && (!h && "x" === c.position || !i && "y" === c.position)) && (c.gridlineShapes = this._group.append("g").attr("class", "dimple-gridline"), "x" === c.position ? h = !0 : i = !0) : "x" === c.position ? h = !0 : i = !0, null === c.shapes && (c.shapes = this._group.append("g").attr("class", "dimple-axis dimple-axis-" + c.position).each(function () {
                    v.noFormats || a.select(this).style("font-family", c.fontFamily).style("font-size", c._getFontSize())
                }), d = !0), c === f && null !== g ? (e = "translate(0, " + (null === g.categoryFields || 0 === g.categoryFields.length ? g._scale(0) : k + m) + ")", o = "translate(0, " + (c === f ? k + m : k) + ")", n = -m) : c === g && null !== f ? (e = "translate(" + (null === f.categoryFields || 0 === f.categoryFields.length ? f._scale(0) : j) + ", 0)", o = "translate(" + (c === g ? j : j + l) + ", 0)", n = -l) : "x" === c.position ? (o = e = "translate(0, " + (c === f ? k + m : k) + ")", n = -m) : "y" === c.position && (o = e = "translate(" + (c === g ? j : j + l) + ", 0)", n = -l), null !== e && null !== c._draw && (c._hasTimeField() ? w(c.shapes).call(c._draw.ticks(c._getTimePeriod(), c.timeInterval).tickFormat(c._getFormat())).attr("transform", e).each(x) : c.useLog ? w(c.shapes).call(c._draw.ticks(4, c._getFormat())).attr("transform", e).each(x) : w(c.shapes).call(c._draw.tickFormat(c._getFormat())).attr("transform", e).each(x), null !== c.gridlineShapes && w(c.gridlineShapes).call(c._draw.tickSize(n, 0, 0).tickFormat("")).attr("transform", o)), w(c.shapes.selectAll("text")).attr("class", y(v.customClassList.axisLabel)).call(function () {
                    v.noFormats || this.style("font-family", c.fontFamily).style("font-size", c._getFontSize())
                }), w(c.shapes.selectAll("path, line")).attr("class", y(v.customClassList.axisLine)).call(function () {
                    v.noFormats || this.style("fill", "none").style("stroke", "black").style("shape-rendering", "crispEdges")
                }), null !== c.gridlineShapes && w(c.gridlineShapes.selectAll("line")).attr("class", y(v.customClassList.gridline)).call(function () {
                    v.noFormats || this.style("fill", "none").style("stroke", "lightgray").style("opacity", .8)
                }), (null === c.measure || void 0 === c.measure) && (c.autoRotateLabel ? c === f ? (q = 0, c.shapes.selectAll("text").each(function () {
                    var a = this.getComputedTextLength();
                    q = a > q ? a : q
                }), q > l / c.shapes.selectAll("text")[0].length ? (p = !0, c.shapes.selectAll("text").style("text-anchor", "start").each(function () {
                    var b = this.getBBox();
                    a.select(this).attr("transform", "rotate(90," + b.x + "," + (b.y + b.height / 2) + ") translate(-5, 0)")
                })) : (p = !1, c.shapes.selectAll("text").style("text-anchor", "middle").attr("transform", ""))) : "x" === c.position && (q = 0, c.shapes.selectAll("text").each(function () {
                    var a = this.getComputedTextLength();
                    q = a > q ? a : q
                }), q > l / c.shapes.selectAll("text")[0].length ? (p = !0, c.shapes.selectAll("text").style("text-anchor", "end").each(function () {
                    var b = this.getBBox();
                    a.select(this).attr("transform", "rotate(90," + (b.x + b.width) + "," + (b.y + b.height / 2) + ") translate(5, 0)")
                })) : (p = !1, c.shapes.selectAll("text").style("text-anchor", "middle").attr("transform", ""))) : (p = !1, c.shapes.selectAll("text").style("text-anchor", "middle").attr("transform", ""))), null !== c.titleShape && void 0 !== c.titleShape && c.titleShape.remove(), c.shapes.selectAll("text").each(function () {
                    var a = this.getBBox();
                    (null === r.l || -9 - a.width < r.l) && (r.l = -9 - a.width), (null === r.r || a.x + a.width > r.r) && (r.r = a.x + a.width), p ? ((null === r.t || a.y + a.height - a.width < r.t) && (r.t = a.y + a.height - a.width), (null === r.b || a.height + a.width > r.b) && (r.b = a.height + a.width)) : ((null === r.t || a.y < r.t) && (r.t = a.y), (null === r.b || 9 + a.height > r.b) && (r.b = 9 + a.height))
                }), "x" === c.position ? (t = c === f ? k + m + r.b + 5 : k + r.t - 10, s = j + l / 2) : "y" === c.position && (s = c === g ? j + r.l - 10 : j + l + r.r + 20, t = k + m / 2, u = "rotate(270, " + s + ", " + t + ")"), c.hidden || "x" !== c.position && "y" !== c.position || null === c.title || (c.titleShape = this._group.append("text").attr("class", "dimple-axis dimple-title " + v.customClassList.axisTitle + " dimple-axis-" + c.position), c.titleShape.attr("x", s).attr("y", t).attr("text-anchor", "middle").attr("transform", u).text(void 0 !== c.title ? c.title : null === c.categoryFields || void 0 === c.categoryFields || 0 === c.categoryFields.length ? c.measure : c.categoryFields.join("/")).each(function () {
                    v.noFormats || a.select(this).style("font-family", c.fontFamily).style("font-size", c._getFontSize())
                }), c === f ? c.titleShape.each(function () {
                    a.select(this).attr("y", t + this.getBBox().height / 1.65)
                }) : c === g && c.titleShape.each(function () {
                    a.select(this).attr("x", s + this.getBBox().height / 1.65)
                }))
            }, this), this.series.forEach(function (a) {
                a.plot.draw(this, a, b), this._registerEventHandlers(a)
            }, this), this.legends.forEach(function (a) {
                a._draw()
            }, this), this.storyboard && (this.storyboard._drawText(), this.storyboard.autoplay && this.storyboard.startAnimation()), this
        }, this.getClass = function (a) {
            return this._assignedClasses[a] || (this._assignedClasses[a] = this.customClassList.colorClasses[this._nextClass], this._nextClass = (this._nextClass + 1) % this.customClassList.colorClasses.length), this._assignedClasses[a]
        }, this.getColor = function (a) {
            return (null === this._assignedColors[a] || void 0 === this._assignedColors[a]) && (this._assignedColors[a] = this.defaultColors[this._nextColor], this._nextColor = (this._nextColor + 1) % this.defaultColors.length), this._assignedColors[a]
        }, this.setBounds = function (a, c, d, e) {
            return this.x = a, this.y = c, this.width = d, this.height = e, this._xPixels = function () {
                return b._parseXPosition(this.x, this.svg.node())
            }, this.draw(0, !0), this._yPixels = function () {
                return b._parseYPosition(this.y, this.svg.node())
            }, this._widthPixels = function () {
                return b._parseXPosition(this.width, this.svg.node())
            }, this._heightPixels = function () {
                return b._parseYPosition(this.height, this.svg.node())
            }, this
        }, this.setMargins = function (a, c, d, e) {
            return this.x = a, this.y = c, this.width = 0, this.height = 0, this._xPixels = function () {
                return b._parseXPosition(this.x, this.svg.node())
            }, this._yPixels = function () {
                return b._parseYPosition(this.y, this.svg.node())
            }, this._widthPixels = function () {
                return b._parentWidth(this.svg.node()) - this._xPixels() - b._parseXPosition(d, this.svg.node())
            }, this._heightPixels = function () {
                return b._parentHeight(this.svg.node()) - this._yPixels() - b._parseYPosition(e, this.svg.node())
            }, this.draw(0, !0), this
        }, this.setStoryboard = function (a, c) {
            return this.storyboard = new b.storyboard(this, a), null !== c && void 0 !== c && (this.storyboard.onTick = c), this.storyboard
        }
    }, b.color = function (b, c, d) {
        this.fill = b, this.stroke = null === c || void 0 === c ? a.rgb(b).darker(.5).toString() : c, this.opacity = null === d || void 0 === d ? .8 : d
    }, b.eventArgs = function () {
        this.seriesValue = null, this.xValue = null, this.yValue = null, this.zValue = null, this.pValue = null, this.colorValue = null, this.frameValue = null, this.seriesShapes = null, this.selectedShape = null
    }, b.legend = function (c, d, e, f, g, h, i) {
        this.chart = c, this.series = i, this.x = d, this.y = e, this.width = f, this.height = g, this.horizontalAlign = h, this.shapes = null, this.fontSize = "10px", this.fontFamily = "sans-serif", this._draw = function () {
            var c, d = this._getEntries(), e = 0, f = 0, g = 0, h = 0, i = 15, j = 9, k = 5, l = this;
            this.shapes && this.shapes.remove(), c = this.chart._group.selectAll(".dimple-dont-select-any").data(d).enter().append("g").attr("class", function (a) {
                return "dimple-legend " + b._createClass(a.aggField)
            }).attr("opacity", 1), c.append("text").attr("class", function (a) {
                return "dimple-legend dimple-legend-text " + b._createClass(a.aggField) + " " + l.chart.customClassList.legendLabel
            }).text(function (a) {
                return a.key
            }).call(function () {
                l.chart.noFormats || this.style("font-family", l.fontFamily).style("font-size", l._getFontSize()).style("shape-rendering", "crispEdges")
            }).each(function () {
                var a = this.getBBox();
                a.width > e && (e = a.width), a.height > f && (f = a.height)
            }), c.append("rect").attr("class", function (a) {
                return "dimple-legend dimple-legend-key " + b._createClass(a.aggField)
            }).attr("height", j).attr("width", i), f = (j > f ? j : f) + l._getVerticalPadding(), e += i + l._getHorizontalPadding(), c.each(function (c) {
                g + e > l._widthPixels() && (g = 0, h += f), h > l._heightPixels() ? a.select(this).remove() : (a.select(this).select("text").attr("x", "left" === l.horizontalAlign ? l._xPixels() + i + k + g : l._xPixels() + (l._widthPixels() - g - e) + i + k).attr("y", function () {
                    return l._yPixels() + h + this.getBBox().height / 1.65
                }).attr("width", l._widthPixels()).attr("height", l._heightPixels()), a.select(this).select("rect").attr("class", function (a) {
                    return "dimple-legend dimple-legend-key " + b._createClass(a.aggField) + " " + l.chart.customClassList.legendKey + " " + a.css
                }).attr("x", "left" === l.horizontalAlign ? l._xPixels() + g : l._xPixels() + (l._widthPixels() - g - e)).attr("y", l._yPixels() + h).attr("height", j).attr("width", i).call(function () {
                    l.chart.noFormats || this.style("fill", c.fill).style("stroke", c.stroke).style("opacity", c.opacity).style("shape-rendering", "crispEdges")
                }), g += e)
            }), this.shapes = c
        }, this._getEntries = function () {
            var a = [];
            return this.series && this.series.forEach(function (b) {
                var c = b._positionData;
                c.forEach(function (c) {
                    var d, e = -1,
                        f = b.plot.grouped && !b.x._hasCategories() && !b.y._hasCategories() && c.aggField.length < 2 ? "All" : c.aggField.slice(-1)[0];
                    for (d = 0; d < a.length; d += 1) if (a[d].key === f) {
                        e = d;
                        break
                    }
                    -1 === e && b.chart._assignedColors[f] && (a.push({
                        key: f,
                        fill: b.chart._assignedColors[f].fill,
                        stroke: b.chart._assignedColors[f].stroke,
                        opacity: b.chart._assignedColors[f].opacity,
                        css: b.chart._assignedClasses[f],
                        series: b,
                        aggField: c.aggField
                    }), e = a.length - 1)
                })
            }, this), a
        }, this._getFontSize = function () {
            var a;
            return a = this.fontSize && "auto" !== this.fontSize.toString().toLowerCase() ? isNaN(this.fontSize) ? this.fontSize : this.fontSize + "px" : (this.chart._heightPixels() / 35 > 10 ? this.chart._heightPixels() / 35 : 10) + "px"
        }, this._getHorizontalPadding = function () {
            var a;
            return a = isNaN(this.horizontalPadding) ? 20 : this.horizontalPadding
        }, this._getVerticalPadding = function () {
            var a;
            return a = isNaN(this.verticalPadding) ? 2 : this.verticalPadding
        }, this._heightPixels = function () {
            return b._parseYPosition(this.height, this.chart.svg.node())
        }, this._widthPixels = function () {
            return b._parseXPosition(this.width, this.chart.svg.node())
        }, this._xPixels = function () {
            return b._parseXPosition(this.x, this.chart.svg.node())
        }, this._yPixels = function () {
            return b._parseYPosition(this.y, this.chart.svg.node())
        }
    }, b.series = function (a, b, c, d, e, f, g, h, i, j) {
        this.chart = a, this.x = c, this.y = d, this.z = e, this.c = f, this.p = g, this.plot = h, this.categoryFields = b, this.aggregate = i, this.stacked = j, this.barGap = .2, this.clusterBarGap = .1, this.lineWeight = 2, this.lineMarkers = !1, this.afterDraw = null, this.interpolation = "linear", this.tooltipFontSize = "10px", this.tooltipFontFamily = "sans-serif", this.radius = "auto", this._eventHandlers = [], this._positionData = [], this._orderRules = [], this._axisBounds = function (a) {
            var b, c, d, e = {min: 0, max: 0}, f = null, g = null, h = [], i = 0, j = this._positionData;
            return "x" === a ? (f = this.x, g = this.y) : "y" === a ? (f = this.y, g = this.x) : "z" === a ? f = this.z : "p" === a ? f = this.p : "c" === a && (f = this.c), f.showPercent ? j.forEach(function (a) {
                a[f.position + "Bound"] < e.min && (e.min = a[f.position + "Bound"]), a[f.position + "Bound"] > e.max && (e.max = a[f.position + "Bound"])
            }, this) : null === g || null === g.categoryFields || 0 === g.categoryFields.length ? j.forEach(function (a) {
                !this._isStacked() || "x" !== f.position && "y" !== f.position ? (a[f.position + "Value"] < e.min && (e.min = a[f.position + "Value"]), a[f.position + "Value"] > e.max && (e.max = a[f.position + "Value"])) : a[f.position + "Value"] < 0 ? e.min = e.min + a[f.position + "Value"] : e.max = e.max + a[f.position + "Value"]
            }, this) : (b = f.position + "Value", c = g.position + "Field", d = [], j.forEach(function (a) {
                var e = a[c].join("/"), f = d.indexOf(e);
                -1 === f && (d.push(e), f = d.length - 1), void 0 === h[f] && (h[f] = {
                    min: 0,
                    max: 0
                }, f >= i && (i = f + 1)), this.stacked ? a[b] < 0 ? h[f].min = h[f].min + a[b] : h[f].max = h[f].max + a[b] : (a[b] < h[f].min && (h[f].min = a[b]), a[b] > h[f].max && (h[f].max = a[b]))
            }, this), h.forEach(function (a) {
                void 0 !== a && (a.min < e.min && (e.min = a.min), a.max > e.max && (e.max = a.max))
            }, this)), e
        }, this._deepMatch = function (a) {
            var b = !1;
            return this[a.position] === a ? b = !0 : void 0 !== a._slaves && null !== a._slaves && a._slaves.length > 0 && a._slaves.forEach(function (a) {
                b = b || this._deepMatch(a)
            }, this), b
        }, this._dropLineOrigin = function () {
            var a = 0, b = 0, c = {x: null, y: null}, d = {x: null, y: null};
            return this.chart.axes.forEach(function (a) {
                "x" === a.position && null === d.x ? a._hasTimeField() ? d.x = this.chart._xPixels() : d.x = a._origin : "y" === a.position && null === d.y && (a._hasTimeField() ? d.y = this.chart._yPixels() + this.chart._heightPixels() : d.y = a._origin)
            }, this), this.chart.axes.forEach(function (e) {
                "x" !== e.position || this.x.hidden ? "y" !== e.position || this.y.hidden || (this._deepMatch(e) && (0 === b ? c.x = d.x : 1 === b && (c.x = this.chart._xPixels() + this.chart._widthPixels())), b += 1) : (this._deepMatch(e) && (0 === a ? c.y = d.y : 1 === a && (c.y = this.chart._yPixels())), a += 1)
            }, this), c
        }, this._getTooltipFontSize = function () {
            var a;
            return a = this.tooltipFontSize && "auto" !== this.tooltipFontSize.toString().toLowerCase() ? isNaN(this.tooltipFontSize) ? this.tooltipFontSize : this.tooltipFontSize + "px" : (this.chart._heightPixels() / 35 > 10 ? this.chart._heightPixels() / 35 : 10) + "px"
        }, this._isStacked = function () {
            return this.stacked && (this.x._hasCategories() || this.y._hasCategories())
        }, this.addEventHandler = function (a, b) {
            this._eventHandlers.push({event: a, handler: b})
        }, this.addOrderRule = function (a, b) {
            this._orderRules.push({ordering: a, desc: b})
        }, this.getTooltipText = function (a) {
            var b = [];
            return null !== this.categoryFields && void 0 !== this.categoryFields && this.categoryFields.length > 0 && this.categoryFields.forEach(function (c, d) {
                null !== c && void 0 !== c && null !== a.aggField[d] && void 0 !== a.aggField[d] && b.push(c + (a.aggField[d] !== c ? ": " + a.aggField[d] : ""))
            }, this), this.p ? (this.x && this.x._hasCategories() && this.x._getTooltipText(b, a), this.y && this.y._hasCategories() && this.y._getTooltipText(b, a), this.z && this.z._hasCategories() && this.z._getTooltipText(b, a), this.p._getTooltipText(b, a)) : (this.x && this.x._getTooltipText(b, a), this.y && this.y._getTooltipText(b, a), this.z && this.z._getTooltipText(b, a)), this.c && this.c._getTooltipText(b, a), b.filter(function (a, c) {
                return b.indexOf(a) === c
            })
        }
    }, b.storyboard = function (a, b) {
        null !== b && void 0 !== b && (b = [].concat(b)), this.chart = a, this.categoryFields = b, this.autoplay = !0, this.frameDuration = 3e3, this.storyLabel = null, this.onTick = null, this.fontSize = "10px", this.fontFamily = "sans-serif", this._frame = 0, this._animationTimer = null, this._categories = [], this._cachedCategoryFields = [], this._orderRules = [], this._drawText = function () {
            if (!this.storyLabel) {
                var a = this.chart, b = this, c = 0;
                this.chart.axes.forEach(function (a) {
                    "x" === a.position && (c += 1)
                }, this), this.storyLabel = this.chart._group.append("text").attr("class", "dimple-storyboard-label").attr("opacity", 1).attr("x", this.chart._xPixels() + .01 * this.chart._widthPixels()).attr("y", this.chart._yPixels() + (this.chart._heightPixels() / 35 > 10 ? this.chart._heightPixels() / 35 : 10) * (c > 1 ? 1.25 : -1)).call(function () {
                    a.noFormats || this.style("font-family", b.fontFamily).style("font-size", b._getFontSize())
                })
            }
            this.storyLabel.text(this.categoryFields.join("\\") + ": " + this.getFrameValue())
        }, this._getCategories = function () {
            return this._categoryFields !== this._cachedCategoryFields && (this._categories = [], this.chart._getAllData().forEach(function (a) {
                var b = -1, c = "";
                null !== this.categoryFields && (this.categoryFields.forEach(function (b, d) {
                    d > 0 && (c += "/"), c += a[b]
                }, this), b = this._categories.indexOf(c), -1 === b && (this._categories.push(c), b = this._categories.length - 1))
            }, this), this._cachedCategoryFields = this._categoryFields), this._categories
        }, this._getFontSize = function () {
            var a;
            return a = this.fontSize && "auto" !== this.fontSize.toString().toLowerCase() ? isNaN(this.fontSize) ? this.fontSize : this.fontSize + "px" : (this.chart._heightPixels() / 35 > 10 ? this.chart._heightPixels() / 35 : 10) + "px"
        }, this._goToFrameIndex = function (a) {
            this._frame = a % this._getCategories().length, this.chart.draw(this.frameDuration / 2)
        }, this.addOrderRule = function (a, b) {
            this._orderRules.push({ordering: a, desc: b})
        }, this.getFrameValue = function () {
            var a = null;
            return this._frame >= 0 && this._getCategories().length > this._frame && (a = this._getCategories()[this._frame]), a
        }, this.goToFrame = function (a) {
            if (this._getCategories().length > 0) {
                var b = this._getCategories().indexOf(a);
                this._goToFrameIndex(b)
            }
        }, this.pauseAnimation = function () {
            null !== this._animationTimer && (window.clearInterval(this._animationTimer), this._animationTimer = null)
        }, this.startAnimation = function () {
            null === this._animationTimer && (null !== this.onTick && this.onTick(this.getFrameValue()), this._animationTimer = window.setInterval(function (a) {
                return function () {
                    a._goToFrameIndex(a._frame + 1), null !== a.onTick && a.onTick(a.getFrameValue()), a._drawText(a.frameDuration / 2)
                }
            }(this), this.frameDuration))
        }, this.stopAnimation = function () {
            null !== this._animationTimer && (window.clearInterval(this._animationTimer), this._animationTimer = null, this._frame = 0)
        }
    }, b.aggregateMethod.avg = function (a, b) {
        return a.value = null === a.value || void 0 === a.value ? 0 : parseFloat(a.value), a.count = null === a.count || void 0 === a.count ? 1 : parseFloat(a.count), b.value = null === b.value || void 0 === b.value ? 0 : parseFloat(b.value), b.count = null === b.count || void 0 === b.count ? 1 : parseFloat(b.count), (a.value * a.count + b.value * b.count) / (a.count + b.count)
    }, b.aggregateMethod.count = function (a, b) {
        return a.count = null === a.count || void 0 === a.count ? 0 : parseFloat(a.count), b.count = null === b.count || void 0 === b.count ? 0 : parseFloat(b.count), a.count + b.count
    }, b.aggregateMethod.max = function (a, b) {
        return a.value = null === a.value || void 0 === a.value ? 0 : parseFloat(a.value), b.value = null === b.value || void 0 === b.value ? 0 : parseFloat(b.value), a.value > b.value ? a.value : b.value
    }, b.aggregateMethod.min = function (a, b) {
        return null === a.value ? parseFloat(b.value) : parseFloat(a.value) < parseFloat(b.value) ? parseFloat(a.value) : parseFloat(b.value)
    }, b.aggregateMethod.sum = function (a, b) {
        return a.value = null === a.value || void 0 === a.value ? 0 : parseFloat(a.value), b.value = null === b.value || void 0 === b.value ? 0 : parseFloat(b.value), a.value + b.value
    }, b.plot.area = {
        stacked: !0, grouped: !0, supportedAxes: ["x", "y", "c"], draw: function (c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B = d._positionData, C = [], D = null,
                E = "dimple-series-" + c.series.indexOf(d), F = d.x._hasCategories() || d.y._hasCategories() ? 0 : 1,
                G = !1, H = {}, I = [], J = [], K = function () {
                    return function (c, d, e, f) {
                        a.select(d).style("opacity", 1), b._showPointTooltip(c, d, e, f)
                    }
                }, L = function (c) {
                    return function (d, e, f, g) {
                        a.select(e).style("opacity", g.lineMarkers || c.data.length < 2 ? b._helpers.opacity(d, f, g) : 0), b._removeTooltip(d, e, f, g)
                    }
                }, M = function (a, f) {
                    b._drawMarkers(a, c, d, e, E, G, K(a), L(a), f)
                }, N = function (a, e) {
                    var f;
                    return "step" === d.interpolation && d[a]._hasCategories() ? (f = b._helpers[a](e, c, d) + ("y" === a ? b._helpers.height(e, c, d) : 0), d[a].categoryFields.length < 2 && (f += ("y" === a ? 1 : -1) * b._helpers[a + "Gap"](c, d))) : f = b._helpers["c" + a](e, c, d), parseFloat(f)
                }, O = function (b, c) {
                    return a.svg.line().x(function (a) {
                        return d.x._hasCategories() || !c ? a.x : d.x[c]
                    }).y(function (a) {
                        return d.y._hasCategories() || !c ? a.y : d.y[c]
                    }).interpolate(b)
                }, P = function (a, b) {
                    return parseFloat(a) - parseFloat(b)
                }, Q = function (a, b) {
                    return parseFloat(a.x) - parseFloat(b.x)
                }, R = function (a, b, c) {
                    var d, e, f = b[b.length - 1], g = 9999, h = f;
                    for (d = 0; d < a.length; d += 1) (a[d].x !== f.x || a[d].y !== f.y) && (e = 180 - Math.atan2(a[d].x - f.x, a[d].y - f.y) * (180 / Math.PI), e > c && g > e && (h = a[d], g = e));
                    return b.push(h), g
                };
            for (f = "step" === d.interpolation ? "step-after" : d.interpolation, o = b._getSeriesOrder(d.data || c.data, d), d.c && (d.x._hasCategories() && d.y._hasMeasure() || d.y._hasCategories() && d.x._hasMeasure()) && (G = !0), d.x._hasCategories() ? (z = "x", A = "y") : d.y._hasCategories() && (z = "y", A = "x"), g = 0; g < B.length; g += 1) {
                for (j = [], l = -1, i = F; i < B[g].aggField.length; i += 1) j.push(B[g].aggField[i]);
                for (k = b._createClass(j), i = 0; i < C.length; i += 1) if (C[i].keyString === k) {
                    l = i;
                    break
                }
                -1 === l && (l = C.length, C.push({
                    key: j,
                    keyString: k,
                    color: "white",
                    data: [],
                    points: [],
                    area: {},
                    entry: {},
                    exit: {},
                    group: z && B[g][z + "Field"] && B[g][z + "Field"].length >= 2 ? B[g][z + "Field"][0] : "All"
                })), C[l].data.push(B[g])
            }
            for (o && C.sort(function (a, c) {
                return b._arrayIndexCompare(o, a.key, c.key)
            }), g = 0; g < C.length; g += 1) {
                for (C[g].data.sort(b._getSeriesSortPredicate(c, d, o)), h = 0; h < C[g].data.length; h += 1) C[g].points.push({
                    x: N("x", C[g].data[h]),
                    y: N("y", C[g].data[h])
                }), z && (H[C[g].group] || (H[C[g].group] = {}), H[C[g].group][C[g].points[C[g].points.length - 1][z]] = d[A]._origin);
                p = C[g].points, "step" === d.interpolation && p.length > 1 && z && (d.x._hasCategories() ? (p.push({
                    x: 2 * p[p.length - 1].x - p[p.length - 2].x,
                    y: p[p.length - 1].y
                }), H[C[g].group][p[p.length - 1][z]] = d[A]._origin) : d.y._hasCategories() && (p = [{
                    x: p[0].x,
                    y: 2 * p[0].y - p[1].y
                }].concat(p), H[C[g].group][p[0][z]] = d[A]._origin, C[g].points = p))
            }
            for (s in H) if (H.hasOwnProperty(s)) {
                I[s] = [];
                for (t in H[s]) H[s].hasOwnProperty(t) && I[s].push(parseFloat(t));
                I[s].sort(P)
            }
            for (g = 0; g < C.length; g += 1) {
                if (p = C[g].points, u = C[g].group, q = [], J = [], G && b._addGradient(C[g].key, "fill-area-gradient-" + C[g].keyString, d.x._hasCategories() ? d.x : d.y, B, c, e, "fill"), I[u] && I[u].length > 0) for (h = 0, i = 0; h < I[u].length; h += 1) I[u][h] >= p[0][z] && I[u][h] <= p[p.length - 1][z] && (r = {}, r[z] = I[u][h], r[A] = H[u][I[u][h]], q.push(r), p[i][z] > I[u][h] ? J.push(r) : (J.push(p[i]), H[C[g].group][I[u][h]] = p[i][A], i += 1)); else if (d._orderRules && d._orderRules.length > 0) J = p.concat(p[0]); else {
                    p = p.sort(Q), J.push(p[0]), y = 0;
                    do y = R(p, J, y); while (J.length <= p.length && (J[0].x !== J[J.length - 1].x || J[0].y !== J[J.length - 1].y))
                }
                q = q.reverse(), v = O(f, "_previousOrigin")(J), w = O("step-after" === f ? "step-before" : "step-before" === f ? "step-after" : f, "_previousOrigin")(q), x = O("linear", "_previousOrigin")(J), C[g].entry = v + (w && w.length > 0 ? "L" + w.substring(1) : "") + (x && x.length > 0 ? "L" + x.substring(1, x.indexOf("L")) : 0), v = O(f)(J), w = O("step-after" === f ? "step-before" : "step-before" === f ? "step-after" : f)(q), x = O("linear")(J), C[g].update = v + (w && w.length > 0 ? "L" + w.substring(1) : "") + (x && x.length > 0 ? "L" + x.substring(1, x.indexOf("L")) : 0), v = O(f, "_origin")(J), w = O("step-after" === f ? "step-before" : "step-before" === f ? "step-after" : f, "_origin")(q), x = O("linear", "_origin")(J), C[g].exit = v + (w && w.length > 0 ? "L" + w.substring(1) : "") + (x && x.length > 0 ? "L" + x.substring(1, x.indexOf("L")) : 0), C[g].color = c.getColor(C[g].key.length > 0 ? C[g].key[C[g].key.length - 1] : "All"), C[g].css = c.getClass(C[g].key.length > 0 ? C[g].key[C[g].key.length - 1] : "All")
            }
            null !== c._tooltipGroup && void 0 !== c._tooltipGroup && c._tooltipGroup.remove(), D = null === d.shapes || void 0 === d.shapes ? c._group.selectAll("." + E).data(C) : d.shapes.data(C, function (a) {
                return a.key
            }), D.enter().append("path").attr("id", function (a) {
                return b._createClass([a.key])
            }).attr("class", function (a) {
                return E + " dimple-line " + a.keyString + " " + c.customClassList.areaSeries + " " + a.css
            }).attr("d", function (a) {
                return a.entry
            }).call(function () {
                c.noFormats || this.attr("opacity", function (a) {
                    return G ? 1 : a.color.opacity
                }).style("fill", function (a) {
                    return G ? "url(#" + b._createClass(["fill-area-gradient-" + a.keyString]) + ")" : a.color.fill
                }).style("stroke", function (a) {
                    return G ? "url(#" + b._createClass(["stroke-area-gradient-" + a.keyString]) + ")" : a.color.stroke
                }).style("stroke-width", d.lineWeight)
            }).each(function (a) {
                a.markerData = a.data, M(a, this)
            }), m = c._handleTransition(D, e, c).attr("d", function (a) {
                return a.update
            }).each(function (a) {
                a.markerData = a.data, M(a, this)
            }), n = c._handleTransition(D.exit(), e, c).attr("d", function (a) {
                return a.exit
            }).each(function (a) {
                a.markerData = [], M(a, this)
            }), b._postDrawHandling(d, m, n, e), d.shapes = D
        }
    }, b.plot.bar = {
        stacked: !0, grouped: !1, supportedAxes: ["x", "y", "c"], draw: function (a, c, d) {
            var e, f, g = c._positionData, h = null, i = ["dimple-series-" + a.series.indexOf(c), "dimple-bar"],
                j = !c._isStacked() && c.x._hasMeasure(), k = !c._isStacked() && c.y._hasMeasure(), l = "none";
            c.x._hasCategories() && c.y._hasCategories() ? l = "both" : c.x._hasCategories() ? l = "x" : c.y._hasCategories() && (l = "y"), null !== a._tooltipGroup && void 0 !== a._tooltipGroup && a._tooltipGroup.remove(), h = null === c.shapes || void 0 === c.shapes ? a._group.selectAll("." + i.join(".")).data(g) : c.shapes.data(g, function (a) {
                return a.key
            }), h.enter().append("rect").attr("id", function (a) {
                return b._createClass([a.key])
            }).attr("class", function (c) {
                var d = [];
                return d = d.concat(c.aggField), d = d.concat(c.xField), d = d.concat(c.yField), i.join(" ") + " " + b._createClass(d) + " " + a.customClassList.barSeries + " " + b._helpers.css(c, a)
            }).attr("x", function (d) {
                var e = c.x._previousOrigin;
                return "x" === l ? e = b._helpers.x(d, a, c) : "both" === l && (e = b._helpers.cx(d, a, c)), e
            }).attr("y", function (d) {
                var e = c.y._previousOrigin;
                return "y" === l ? e = b._helpers.y(d, a, c) : "both" === l && (e = b._helpers.cy(d, a, c)), e
            }).attr("width", function (d) {
                return "x" === l ? b._helpers.width(d, a, c) : 0
            }).attr("height", function (d) {
                return "y" === l ? b._helpers.height(d, a, c) : 0
            }).on("mouseover", function (d) {
                b._showBarTooltip(d, this, a, c)
            }).on("mouseleave", function (d) {
                b._removeTooltip(d, this, a, c)
            }).call(function () {
                a.noFormats || this.attr("opacity", function (d) {
                    return b._helpers.opacity(d, a, c)
                }).style("fill", function (d) {
                    return b._helpers.fill(d, a, c)
                }).style("stroke", function (d) {
                    return b._helpers.stroke(d, a, c)
                })
            }), e = a._handleTransition(h, d, a, c).attr("x", function (d) {
                return j ? b._helpers.cx(d, a, c) - c.x.floatingBarWidth / 2 : b._helpers.x(d, a, c)
            }).attr("y", function (d) {
                return k ? b._helpers.cy(d, a, c) - c.y.floatingBarWidth / 2 : b._helpers.y(d, a, c)
            }).attr("width", function (d) {
                return j ? c.x.floatingBarWidth : b._helpers.width(d, a, c)
            }).attr("height", function (d) {
                return k ? c.y.floatingBarWidth : b._helpers.height(d, a, c)
            }).call(function () {
                a.noFormats || this.attr("fill", function (d) {
                    return b._helpers.fill(d, a, c)
                }).attr("stroke", function (d) {
                    return b._helpers.stroke(d, a, c)
                })
            }), f = a._handleTransition(h.exit(), d, a, c).attr("x", function (d) {
                var e = c.x._origin;
                return "x" === l ? e = b._helpers.x(d, a, c) : "both" === l && (e = b._helpers.cx(d, a, c)), e
            }).attr("y", function (d) {
                var e = c.y._origin;
                return "y" === l ? e = b._helpers.y(d, a, c) : "both" === l && (e = b._helpers.cy(d, a, c)), e
            }).attr("width", function (d) {
                return "x" === l ? b._helpers.width(d, a, c) : 0
            }).attr("height", function (d) {
                return "y" === l ? b._helpers.height(d, a, c) : 0
            }), b._postDrawHandling(c, e, f, d), c.shapes = h
        }
    }, b.plot.bubble = {
        stacked: !1, grouped: !1, supportedAxes: ["x", "y", "z", "c"], draw: function (a, c, d) {
            var e, f, g = c._positionData, h = null, i = ["dimple-series-" + a.series.indexOf(c), "dimple-bubble"];
            null !== a._tooltipGroup && void 0 !== a._tooltipGroup && a._tooltipGroup.remove(), h = null === c.shapes || void 0 === c.shapes ? a._group.selectAll("." + i.join(".")).data(g) : c.shapes.data(g, function (a) {
                return a.key
            }), h.enter().append("circle").attr("id", function (a) {
                return b._createClass([a.key])
            }).attr("class", function (c) {
                var d = [];
                return d = d.concat(c.aggField), d = d.concat(c.xField), d = d.concat(c.yField), d = d.concat(c.zField), i.join(" ") + " " + b._createClass(d) + " " + a.customClassList.bubbleSeries + " " + b._helpers.css(c, a)
            }).attr("cx", function (d) {
                return c.x._hasCategories() ? b._helpers.cx(d, a, c) : c.x._previousOrigin
            }).attr("cy", function (d) {
                return c.y._hasCategories() ? b._helpers.cy(d, a, c) : c.y._previousOrigin
            }).attr("r", 0).on("mouseover", function (d) {
                b._showPointTooltip(d, this, a, c)
            }).on("mouseleave", function (d) {
                b._removeTooltip(d, this, a, c)
            }).call(function () {
                a.noFormats || this.attr("opacity", function (d) {
                    return b._helpers.opacity(d, a, c)
                }).style("fill", function (d) {
                    return b._helpers.fill(d, a, c)
                }).style("stroke", function (d) {
                    return b._helpers.stroke(d, a, c)
                })
            }), e = a._handleTransition(h, d, a, c).attr("cx", function (d) {
                return b._helpers.cx(d, a, c)
            }).attr("cy", function (d) {
                return b._helpers.cy(d, a, c)
            }).attr("r", function (d) {
                return b._helpers.r(d, a, c)
            }).call(function () {
                a.noFormats || this.attr("fill", function (d) {
                    return b._helpers.fill(d, a, c)
                }).attr("stroke", function (d) {
                    return b._helpers.stroke(d, a, c)
                })
            }), f = a._handleTransition(h.exit(), d, a, c).attr("r", 0).attr("cx", function (d) {
                return c.x._hasCategories() ? b._helpers.cx(d, a, c) : c.x._origin
            }).attr("cy", function (d) {
                return c.y._hasCategories() ? b._helpers.cy(d, a, c) : c.y._origin
            }), b._postDrawHandling(c, e, f, d), c.shapes = h
        }
    }, b.plot.line = {
        stacked: !1, grouped: !0, supportedAxes: ["x", "y", "c"], draw: function (c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p = d._positionData, q = [], r = null,
                s = "dimple-series-" + c.series.indexOf(d), t = d.x._hasCategories() || d.y._hasCategories() ? 0 : 1,
                u = !1, v = function () {
                    return function (c, d, e, f) {
                        a.select(d).style("opacity", 1), b._showPointTooltip(c, d, e, f)
                    }
                }, w = function (c) {
                    return function (d, e, f, g) {
                        a.select(e).style("opacity", g.lineMarkers || c.data.length < 2 ? b._helpers.opacity(d, f, g) : 0), b._removeTooltip(d, e, f, g)
                    }
                }, x = function (a, f) {
                    b._drawMarkers(a, c, d, e, s, u, v(a), w(a), f)
                }, y = function (a, e) {
                    var f;
                    return "step" === d.interpolation && d[a]._hasCategories() ? (d.barGap = 0, d.clusterBarGap = 0, f = b._helpers[a](e, c, d) + ("y" === a ? b._helpers.height(e, c, d) : 0)) : f = b._helpers["c" + a](e, c, d), parseFloat(f.toFixed(1))
                }, z = function (b, c) {
                    return a.svg.line().x(function (a) {
                        return d.x._hasCategories() || !c ? a.x : d.x[c]
                    }).y(function (a) {
                        return d.y._hasCategories() || !c ? a.y : d.y[c]
                    }).interpolate(b)
                };
            for (f = "step" === d.interpolation ? "step-after" : d.interpolation, o = b._getSeriesOrder(d.data || c.data, d), d.c && (d.x._hasCategories() && d.y._hasMeasure() || d.y._hasCategories() && d.x._hasMeasure()) && (u = !0), g = 0; g < p.length; g += 1) {
                for (j = [], l = -1, i = t; i < p[g].aggField.length; i += 1) j.push(p[g].aggField[i]);
                for (k = b._createClass(j), i = 0; i < q.length; i += 1) if (q[i].keyString === k) {
                    l = i;
                    break
                }
                -1 === l && (l = q.length, q.push({
                    key: j,
                    keyString: k,
                    color: "white",
                    data: [],
                    markerData: [],
                    points: [],
                    line: {},
                    entry: {},
                    exit: {}
                })), q[l].data.push(p[g])
            }
            for (o && q.sort(function (a, c) {
                return b._arrayIndexCompare(o, a.key, c.key)
            }), g = 0; g < q.length; g += 1) {
                for (q[g].data.sort(b._getSeriesSortPredicate(c, d, o)), u && b._addGradient(q[g].key, "fill-line-gradient-" + q[g].keyString, d.x._hasCategories() ? d.x : d.y, p, c, e, "fill"), h = 0; h < q[g].data.length; h += 1) q[g].points.push({
                    x: y("x", q[g].data[h]),
                    y: y("y", q[g].data[h])
                });
                "step" === d.interpolation && q[g].points.length > 1 && (d.x._hasCategories() ? q[g].points.push({
                    x: 2 * q[g].points[q[g].points.length - 1].x - q[g].points[q[g].points.length - 2].x,
                    y: q[g].points[q[g].points.length - 1].y
                }) : d.y._hasCategories() && (q[g].points = [{
                    x: q[g].points[0].x,
                    y: 2 * q[g].points[0].y - q[g].points[1].y
                }].concat(q[g].points))), q[g].entry = z(f, "_previousOrigin")(q[g].points), q[g].update = z(f)(q[g].points), q[g].exit = z(f, "_origin")(q[g].points), q[g].color = c.getColor(q[g].key.length > 0 ? q[g].key[q[g].key.length - 1] : "All"), q[g].css = c.getClass(q[g].key.length > 0 ? q[g].key[q[g].key.length - 1] : "All")
            }
            null !== c._tooltipGroup && void 0 !== c._tooltipGroup && c._tooltipGroup.remove(), r = null === d.shapes || void 0 === d.shapes ? c._group.selectAll("." + s).data(q) : d.shapes.data(q, function (a) {
                return a.key
            }), r.enter().append("path").attr("id", function (a) {
                return b._createClass([a.key])
            }).attr("class", function (a) {
                return s + " dimple-line " + a.keyString + " " + c.customClassList.lineSeries + " " + a.css
            }).attr("d", function (a) {
                return a.entry
            }).call(function () {
                c.noFormats || this.attr("opacity", function (a) {
                    return u ? 1 : a.color.opacity
                }).style("fill", "none").style("stroke", function (a) {
                    return u ? "url(#" + b._createClass(["fill-line-gradient-" + a.keyString]) + ")" : a.color.stroke
                }).style("stroke-width", d.lineWeight)
            }).each(function (a) {
                a.markerData = a.data, x(a, this)
            }), m = c._handleTransition(r, e, c).attr("d", function (a) {
                return a.update
            }).each(function (a) {
                a.markerData = a.data, x(a, this)
            }), n = c._handleTransition(r.exit(), e, c).attr("d", function (a) {
                return a.exit
            }).each(function (a) {
                a.markerData = [], x(a, this)
            }), b._postDrawHandling(d, m, n, e), d.shapes = r
        }
    }, b.plot.pie = {
        stacked: !1, grouped: !1, supportedAxes: ["x", "y", "c", "z", "p"], draw: function (c, d, e) {
            var f, g, h = d._positionData, i = null, j = ["dimple-series-" + c.series.indexOf(d), "dimple-pie"],
                k = function (a) {
                    var e;
                    return e = d.x && d.y ? b._helpers.r(a, c, d) : c._widthPixels() < c._heightPixels() ? c._widthPixels() / 2 : c._heightPixels() / 2
                }, l = function (a) {
                    var c = k(a);
                    return d.outerRadius && (c = b._parsePosition(d.outerRadius, c)), Math.max(c, 0)
                }, m = function (a) {
                    var c = 0;
                    return d.innerRadius && (c = b._parsePosition(d.innerRadius, k(a))), Math.max(c, 0)
                }, n = function (b) {
                    var c;
                    return (c = a.svg.arc().innerRadius(m(b)).outerRadius(l(b)))(b)
                }, o = function (b) {
                    b.innerRadius = m(b), b.outerRadius = l(b);
                    var c, d = a.interpolate(this._current, b);
                    return c = a.svg.arc().innerRadius(function (a) {
                        return a.innerRadius
                    }).outerRadius(function (a) {
                        return a.outerRadius
                    }), this._current = d(0), function (a) {
                        return c(d(a))
                    }
                }, p = function (a) {
                    return function (e) {
                        var f, g;
                        return d.x && d.y ? (f = !a || d.x._hasCategories() ? b._helpers.cx(e, c, d) : d.x._previousOrigin, g = !a || d.y._hasCategories() ? b._helpers.cy(e, c, d) : d.y._previousOrigin) : (f = c._xPixels() + c._widthPixels() / 2, g = c._yPixels() + c._heightPixels() / 2), "translate(" + f + "," + g + ")"
                    }
                };
            null !== c._tooltipGroup && void 0 !== c._tooltipGroup && c._tooltipGroup.remove(), i = null === d.shapes || void 0 === d.shapes ? c._group.selectAll("." + j.join(".")).data(h) : d.shapes.data(h, function (a) {
                return a.key
            }), i.enter().append("path").attr("id", function (a) {
                return b._createClass([a.key])
            }).attr("class", function (a) {
                var d = [];
                return d = d.concat(a.aggField), d = d.concat(a.pField), j.join(" ") + " " + b._createClass(d) + " " + c.customClassList.pieSeries + " " + b._helpers.css(a, c)
            }).attr("d", n).on("mouseover", function (a) {
                b._showBarTooltip(a, this, c, d)
            }).on("mouseleave", function (a) {
                b._removeTooltip(a, this, c, d)
            }).call(function () {
                c.noFormats || this.attr("opacity", function (a) {
                    return b._helpers.opacity(a, c, d)
                }).style("fill", function (a) {
                    return b._helpers.fill(a, c, d)
                }).style("stroke", function (a) {
                    return b._helpers.stroke(a, c, d)
                })
            }).attr("transform", p(!0)).each(function (a) {
                this._current = a, a.innerRadius = m(a), a.outerRadius = l(a)
            }), f = c._handleTransition(i, e, c, d).call(function () {
                e && e > 0 ? this.attrTween("d", o) : this.attr("d", n), c.noFormats || this.attr("fill", function (a) {
                    return b._helpers.fill(a, c, d)
                }).attr("stroke", function (a) {
                    return b._helpers.stroke(a, c, d)
                })
            }).attr("transform", p(!1)), g = c._handleTransition(i.exit(), e, c, d).attr("transform", p(!0)).attr("d", n), b._postDrawHandling(d, f, g, e), d.shapes = i
        }
    }, b._addGradient = function (a, c, d, e, f, g, h) {
        var i = [].concat(a), j = f.svg.select("#" + b._createClass([c])), k = [], l = d.position + "Field", m = !0,
            n = [];
        e.forEach(function (a) {
            -1 === k.indexOf(a[l]) && a.aggField.join("_") === i.join("_") && k.push(a[l])
        }, this), k = k.sort(function (a, b) {
            return d._scale(a) - d._scale(b)
        }), null === j.node() && (m = !1, j = f.svg.append("defs").append("linearGradient").attr("id", b._createClass([c])).attr("gradientUnits", "userSpaceOnUse").attr("x1", "x" === d.position ? d._scale(k[0]) + f._widthPixels() / k.length / 2 : 0).attr("y1", "y" === d.position ? d._scale(k[0]) - f._heightPixels() / k.length / 2 : 0).attr("x2", "x" === d.position ? d._scale(k[k.length - 1]) + f._widthPixels() / k.length / 2 : 0).attr("y2", "y" === d.position ? d._scale(k[k.length - 1]) - f._heightPixels() / k.length / 2 : 0)), k.forEach(function (a, b) {
            var c = {}, d = 0;
            for (d = 0; d < e.length; d += 1) if (e[d].aggField.join("_") === i.join("_") && e[d][l].join("_") === a.join("_")) {
                c = e[d];
                break
            }
            n.push({offset: Math.round(b / (k.length - 1) * 100) + "%", color: c[h]})
        }, this), m ? f._handleTransition(j.selectAll("stop").data(n), g, f).attr("offset", function (a) {
            return a.offset
        }).attr("stop-color", function (a) {
            return a.color
        }) : j.selectAll("stop").data(n).enter().append("stop").attr("offset", function (a) {
            return a.offset
        }).attr("stop-color", function (a) {
            return a.color
        })
    }, b._arrayIndexCompare = function (a, b, c) {
        var d, e, f, g, h, i;
        for (e = 0; e < a.length; e += 1) {
            for (g = !0, h = !0, i = [].concat(a[e]), f = 0; f < b.length; f += 1) g = g && b[f] === i[f];
            for (f = 0; f < c.length; f += 1) h = h && c[f] === i[f];
            if (g && h) {
                d = 0;
                break
            }
            if (g) {
                d = -1;
                break
            }
            if (h) {
                d = 1;
                break
            }
        }
        return d
    }, b._createClass = function (a) {
        var b, c, d = [];
        if (c = function (a) {
            var b = a.charCodeAt(0), c = "-";
            return b >= 65 && 90 >= b && (c = a.toLowerCase()), c
        }, a.length > 0) for (b = 0; b < a.length; b += 1) a[b] && d.push("dimple-" + a[b].toString().replace(/[^a-z0-9]/g, c)); else d = ["dimple-all"];
        return d.join(" ")
    }, b._drawMarkerBacks = function (c, d, e, f, g, h) {
        var i, j, k, l = ["dimple-marker-back", g, c.keyString];
        e.lineMarkers && (i = null === e._markerBacks || void 0 === e._markerBacks || void 0 === e._markerBacks[c.keyString] ? d._group.selectAll("." + l.join(".")).data(c.markerData) : e._markerBacks[c.keyString].data(c.markerData, function (a) {
            return a.key
        }), k = h.nextSibling && h.nextSibling.id ? i.enter().insert("circle", "#" + h.nextSibling.id) : i.enter().append("circle"), k.attr("id", function (a) {
            return b._createClass([a.key + " Marker Back"])
        }).attr("class", function (a) {
            var c = [];
            return e.x._hasCategories() && (c = c.concat(a.xField)), e.y._hasCategories() && (c = c.concat(a.yField)), b._createClass(c) + " " + l.join(" ")
        }).attr("cx", function (a) {
            return e.x._hasCategories() ? b._helpers.cx(a, d, e) : e.x._previousOrigin
        }).attr("cy", function (a) {
            return e.y._hasCategories() ? b._helpers.cy(a, d, e) : e.y._previousOrigin
        }).attr("r", 0).attr("fill", "white").attr("stroke", "none"), d._handleTransition(i, f, d).attr("cx", function (a) {
            return b._helpers.cx(a, d, e)
        }).attr("cy", function (a) {
            return b._helpers.cy(a, d, e)
        }).attr("r", 2 + e.lineWeight), j = d._handleTransition(i.exit(), f, d).attr("cx", function (a) {
            return e.x._hasCategories() ? b._helpers.cx(a, d, e) : e.x._origin
        }).attr("cy", function (a) {
            return e.y._hasCategories() ? b._helpers.cy(a, d, e) : e.y._origin
        }).attr("r", 0), 0 === f ? j.remove() : j.each("end", function () {
            a.select(this).remove()
        }), (void 0 === e._markerBacks || null === e._markerBacks) && (e._markerBacks = {}), e._markerBacks[c.keyString] = i)
    }, b._drawMarkers = function (c, d, e, f, g, h, i, j, k) {
        var l, m, n, o = ["dimple-marker", g, c.keyString];
        l = null === e._markers || void 0 === e._markers || void 0 === e._markers[c.keyString] ? d._group.selectAll("." + o.join(".")).data(c.markerData) : e._markers[c.keyString].data(c.markerData, function (a) {
            return a.key
        }), n = k.nextSibling && k.nextSibling.id ? l.enter().insert("circle", "#" + k.nextSibling.id) : l.enter().append("circle"), n.attr("id", function (a) {
            return b._createClass([a.key + " Marker"])
        }).attr("class", function (a) {
            var c = [], f = d.getClass(a.aggField.length > 0 ? a.aggField[a.aggField.length - 1] : "All");
            return e.x._hasCategories() && (c = c.concat(a.xField)), e.y._hasCategories() && (c = c.concat(a.yField)), b._createClass(c) + " " + o.join(" ") + " " + d.customClassList.lineMarker + " " + f
        }).on("mouseover", function (a) {
            i(a, this, d, e)
        }).on("mouseleave", function (a) {
            j(a, this, d, e)
        }).attr("cx", function (a) {
            return e.x._hasCategories() ? b._helpers.cx(a, d, e) : e.x._previousOrigin
        }).attr("cy", function (a) {
            return e.y._hasCategories() ? b._helpers.cy(a, d, e) : e.y._previousOrigin
        }).attr("r", 0).attr("opacity", e.lineMarkers || c.data.length < 2 ? c.color.opacity : 0).call(function () {
            d.noFormats || this.attr("fill", "white").style("stroke-width", e.lineWeight).attr("stroke", function (a) {
                return h ? b._helpers.fill(a, d, e) : c.color.stroke
            })
        }), d._handleTransition(l, f, d).attr("cx", function (a) {
            return b._helpers.cx(a, d, e)
        }).attr("cy", function (a) {
            return b._helpers.cy(a, d, e)
        }).attr("r", 2 + e.lineWeight).attr("opacity", e.lineMarkers || c.data.length < 2 ? c.color.opacity : 0).call(function () {
            d.noFormats || this.attr("fill", "white").style("stroke-width", e.lineWeight).attr("stroke", function (a) {
                return h ? b._helpers.fill(a, d, e) : c.color.stroke
            })
        }), m = d._handleTransition(l.exit(), f, d).attr("cx", function (a) {
            return e.x._hasCategories() ? b._helpers.cx(a, d, e) : e.x._origin
        }).attr("cy", function (a) {
            return e.y._hasCategories() ? b._helpers.cy(a, d, e) : e.y._origin
        }).attr("r", 0), 0 === f ? m.remove() : m.each("end", function () {
            a.select(this).remove()
        }), (void 0 === e._markers || null === e._markers) && (e._markers = {}), e._markers[c.keyString] = l, b._drawMarkerBacks(c, d, e, f, g, k)
    }, b._getOrderedList = function (a, c, d) {
        var e, f = [], g = [], h = [].concat(c), i = [].concat(c), j = [];
        return null !== d && void 0 !== d && (j = j.concat(d)), j = j.concat({
            ordering: h,
            desc: !1
        }), j.forEach(function (b) {
            var c, d = [], e = [];
            if ("function" == typeof b.ordering) {
                if (a && a.length > 0) for (c in a[0]) a[0].hasOwnProperty(c) && -1 === i.indexOf(c) && i.push(c)
            } else if (b.ordering instanceof Array) {
                for (c = 0; c < b.ordering.length; c += 1) a && a.length > 0 && a[0].hasOwnProperty(b.ordering[c]) && e.push(b.ordering[c]), d.push(b.ordering[c]);
                e.length > d.length / 2 ? i.concat(e) : b.values = d
            } else i.push(b.ordering)
        }, this), e = b._rollUp(a, h, i), j.length >= 1 && (j.forEach(function (a) {
            var b = null === a.desc || void 0 === a.desc ? !1 : a.desc, c = a.ordering, d = [], e = function (a) {
                var b, c = 0;
                for (b = 0; b < a.length; b += 1) {
                    if (isNaN(a[b])) {
                        c = void 0;
                        break
                    }
                    c += parseFloat(a[b])
                }
                return c
            }, g = function (a, b) {
                var c = 0, d = e(a), f = e(b);
                return isNaN(d) || isNaN(f) ? isNaN(Date.parse(a[0])) || isNaN(Date.parse(b[0])) ? a[0] < b[0] ? c = -1 : a[0] > b[0] && (c = 1) : c = Date.parse(a[0]) - Date.parse(b[0]) : c = parseFloat(d) - parseFloat(f), c
            };
            "function" == typeof c ? f.push(function (a, d) {
                return (b ? -1 : 1) * c(a, d)
            }) : a.values && a.values.length > 0 ? (a.values.forEach(function (a) {
                d.push([].concat(a).join("|"))
            }, this), f.push(function (a, c) {
                var e, f, g, i = "", j = "";
                for (g = 0; g < h.length; g += 1) g > 0 && (i += "|", j += "|"), i += a[h[g]], j += c[h[g]];
                return e = d.indexOf(i), f = d.indexOf(j), e = 0 > e ? b ? -1 : d.length : e, f = 0 > f ? b ? -1 : d.length : f, (b ? -1 : 1) * (e - f)
            })) : [].concat(a.ordering).forEach(function (a) {
                f.push(function (c, d) {
                    var e = 0;
                    return void 0 !== c[a] && void 0 !== d[a] && (e = g([].concat(c[a]), [].concat(d[a]))), (b ? -1 : 1) * e
                })
            })
        }), e.sort(function (a, b) {
            for (var c = 0, d = 0; c < f.length && 0 === d;) d = f[c](a, b), c += 1;
            return d
        }), e.forEach(function (a) {
            var b, c = [];
            if (1 === h.length) g.push(a[h[0]]); else {
                for (b = 0; b < h.length; b += 1) c.push(a[h[b]]);
                g.push(c)
            }
        }, this)), g
    }, b._getSeriesOrder = function (a, c) {
        var d = [].concat(c._orderRules), e = c.categoryFields, f = [];
        return null !== e && void 0 !== e && e.length > 0 && (null !== c.c && void 0 !== c.c && c.c._hasMeasure() && d.push({
            ordering: c.c.measure,
            desc: !0
        }), c.x._hasMeasure() && d.push({
            ordering: c.x.measure,
            desc: !0
        }), c.y._hasMeasure() && d.push({ordering: c.y.measure, desc: !0}), f = b._getOrderedList(a, e, d)), f
    }, b._getSeriesSortPredicate = function (a, c, d) {
        return function (e, f) {
            var g = 0;
            return c.x._hasCategories() && (g = b._helpers.cx(e, a, c) - b._helpers.cx(f, a, c)), 0 === g && c.y._hasCategories() && (g = b._helpers.cy(e, a, c) - b._helpers.cy(f, a, c)), 0 === g && d && (g = b._arrayIndexCompare(d, e.aggField, f.aggField)), g
        }
    }, b._helpers = {
        cx: function (a, c, d) {
            var e = 0;
            return e = null !== d.x.measure && void 0 !== d.x.measure ? d.x._scale(a.cx) : d.x._hasCategories() && d.x.categoryFields.length >= 2 ? d.x._scale(a.cx) + b._helpers.xGap(c, d) + (a.xOffset + .5) * (c._widthPixels() / d.x._max - 2 * b._helpers.xGap(c, d)) * a.width : d.x._scale(a.cx) + c._widthPixels() / d.x._max / 2
        }, cy: function (a, c, d) {
            var e = 0;
            return e = null !== d.y.measure && void 0 !== d.y.measure ? d.y._scale(a.cy) : null !== d.y.categoryFields && void 0 !== d.y.categoryFields && d.y.categoryFields.length >= 2 ? d.y._scale(a.cy) - c._heightPixels() / d.y._max + b._helpers.yGap(c, d) + (a.yOffset + .5) * (c._heightPixels() / d.y._max - 2 * b._helpers.yGap(c, d)) * a.height : d.y._scale(a.cy) - c._heightPixels() / d.y._max / 2
        }, r: function (a, b, c) {
            var d = 0, e = 1;
            return null === c.z || void 0 === c.z ? d = c.radius && "auto" !== c.radius ? c.radius : 5 : (c.radius && "auto" !== c.radius && c.radius > 1 && (e = c.radius / c.z._scale(c.z._max)), d = c.z._hasMeasure() ? c.z._scale(a.r) * e : c.z._scale(b._heightPixels() / 100) * e), d
        }, xGap: function (a, b) {
            var c = 0;
            return (null === b.x.measure || void 0 === b.x.measure) && b.barGap > 0 && (c = a._widthPixels() / b.x._max * (b.barGap > .99 ? .99 : b.barGap) / 2), c
        }, xClusterGap: function (a, c, d) {
            var e = 0;
            return null !== d.x.categoryFields && void 0 !== d.x.categoryFields && d.x.categoryFields.length >= 2 && d.clusterBarGap > 0 && !d.x._hasMeasure() && (e = a.width * (c._widthPixels() / d.x._max - 2 * b._helpers.xGap(c, d)) * (d.clusterBarGap > .99 ? .99 : d.clusterBarGap) / 2), e
        }, yGap: function (a, b) {
            var c = 0;
            return (null === b.y.measure || void 0 === b.y.measure) && b.barGap > 0 && (c = a._heightPixels() / b.y._max * (b.barGap > .99 ? .99 : b.barGap) / 2), c
        }, yClusterGap: function (a, c, d) {
            var e = 0;
            return null !== d.y.categoryFields && void 0 !== d.y.categoryFields && d.y.categoryFields.length >= 2 && d.clusterBarGap > 0 && !d.y._hasMeasure() && (e = a.height * (c._heightPixels() / d.y._max - 2 * b._helpers.yGap(c, d)) * (d.clusterBarGap > .99 ? .99 : d.clusterBarGap) / 2), e
        }, x: function (a, c, d) {
            var e = 0;
            return e = d.x._hasTimeField() ? d.x._scale(a.x) - b._helpers.width(a, c, d) / 2 : null !== d.x.measure && void 0 !== d.x.measure ? d.x._scale(a.x) : d.x._scale(a.x) + b._helpers.xGap(c, d) + a.xOffset * (b._helpers.width(a, c, d) + 2 * b._helpers.xClusterGap(a, c, d)) + b._helpers.xClusterGap(a, c, d)
        }, y: function (a, c, d) {
            var e = 0;
            return e = d.y._hasTimeField() ? d.y._scale(a.y) - b._helpers.height(a, c, d) / 2 : null !== d.y.measure && void 0 !== d.y.measure ? d.y._scale(a.y) : d.y._scale(a.y) - c._heightPixels() / d.y._max + b._helpers.yGap(c, d) + a.yOffset * (b._helpers.height(a, c, d) + 2 * b._helpers.yClusterGap(a, c, d)) + b._helpers.yClusterGap(a, c, d)
        }, width: function (a, c, d) {
            var e = 0;
            return e = null !== d.x.measure && void 0 !== d.x.measure ? Math.abs(d.x._scale(a.x < 0 ? a.x - a.width : a.x + a.width) - d.x._scale(a.x)) : d.x._hasTimeField() ? d.x.floatingBarWidth : a.width * (c._widthPixels() / d.x._max - 2 * b._helpers.xGap(c, d)) - 2 * b._helpers.xClusterGap(a, c, d)
        }, height: function (a, c, d) {
            var e = 0;
            return e = d.y._hasTimeField() ? d.y.floatingBarWidth : null !== d.y.measure && void 0 !== d.y.measure ? Math.abs(d.y._scale(a.y) - d.y._scale(a.y <= 0 ? a.y + a.height : a.y - a.height)) : a.height * (c._heightPixels() / d.y._max - 2 * b._helpers.yGap(c, d)) - 2 * b._helpers.yClusterGap(a, c, d)
        }, opacity: function (a, b, c) {
            var d = 0;
            return d = null !== c.c && void 0 !== c.c ? a.opacity : b.getColor(a.aggField.slice(-1)[0]).opacity
        }, fill: function (a, b, c) {
            var d = 0;
            return d = null !== c.c && void 0 !== c.c ? a.fill : b.getColor(a.aggField.slice(-1)[0]).fill
        }, stroke: function (a, b, c) {
            var d = 0;
            return d = null !== c.c && void 0 !== c.c ? a.stroke : b.getColor(a.aggField.slice(-1)[0]).stroke
        }, css: function (a, b) {
            return b.getClass(a.aggField.slice(-1)[0])
        }
    }, b._parentHeight = function (a) {
        var c = a.offsetHeight;
        return (0 >= c || null === c || void 0 === c) && (c = a.clientHeight), (0 >= c || null === c || void 0 === c) && (c = null === a.parentNode || void 0 === a.parentNode ? 0 : b._parentHeight(a.parentNode)), c
    }, b._parentWidth = function (a) {
        var c = a.offsetWidth;
        return (!c || 0 > c) && (c = a.clientWidth), (!c || 0 > c) && (c = a.parentNode ? b._parentWidth(a.parentNode) : 0), c
    }, b._parsePosition = function (a, b) {
        var c, d = 0;
        return a && (c = a.toString().split(","), c.forEach(function (c) {
            c && (isNaN(c) ? "%" === c.slice(-1) ? d += b * (parseFloat(c.slice(0, c.length - 1)) / 100) : "px" === c.slice(-2) ? d += parseFloat(c.slice(0, c.length - 2)) : d = a : d += parseFloat(c))
        }, this)), 0 > d && (d = b + d), d
    }, b._parseXPosition = function (a, c) {
        return b._parsePosition(a, b._parentWidth(c))
    }, b._parseYPosition = function (a, c) {
        return b._parsePosition(a, b._parentHeight(c))
    }, b._postDrawHandling = function (b, c, d, e) {
        0 === e ? (c.each(function (a, c) {
            null !== b.afterDraw && void 0 !== b.afterDraw && b.afterDraw(this, a, c)
        }), d.remove()) : (c.each("end", function (a, c) {
            null !== b.afterDraw && void 0 !== b.afterDraw && b.afterDraw(this, a, c)
        }), d.each("end", function () {
            a.select(this).remove()
        }))
    }, b._removeTooltip = function (a, b, c, d) {
        c._tooltipGroup && c._tooltipGroup.remove()
    }, b._rollUp = function (a, b, c) {
        var d = [];
        return b = null !== b && void 0 !== b ? [].concat(b) : [], a.forEach(function (a) {
            var e = -1, f = {}, g = !0;
            d.forEach(function (c, d) {
                -1 === e && (g = !0, b.forEach(function (b) {
                    g = g && a[b] === c[b]
                }, this), g && (e = d))
            }, this), -1 !== e ? f = d[e] : (b.forEach(function (b) {
                f[b] = a[b]
            }, this), d.push(f), e = d.length - 1), c.forEach(function (c) {
                -1 === b.indexOf(c) && (void 0 === f[c] && (f[c] = []), f[c] = f[c].concat(a[c]))
            }, this), d[e] = f
        }, this), d
    }, b._showBarTooltip = function (b, c, d, e) {
        var f, g, h, i, j, k, l = 5, m = 10, n = 750, o = a.select(c), p = o.node().getBBox().x,
            q = o.node().getBBox().y, r = o.node().getBBox().width, s = o.node().getBBox().height,
            t = o.attr("opacity"), u = o.attr("fill"), v = e._dropLineOrigin(),
            w = a.rgb(a.rgb(u).r + .6 * (255 - a.rgb(u).r), a.rgb(u).g + .6 * (255 - a.rgb(u).g), a.rgb(u).b + .6 * (255 - a.rgb(u).b)),
            x = a.rgb(a.rgb(u).r + .8 * (255 - a.rgb(u).r), a.rgb(u).g + .8 * (255 - a.rgb(u).g), a.rgb(u).b + .8 * (255 - a.rgb(u).b)),
            y = e.getTooltipText(b), z = 0, A = 0, B = 0, C = function (a, b) {
                var c = o.node().getCTM(), e = d.svg.node().createSVGPoint();
                return e.x = a || 0, e.y = b || 0, e.matrixTransform(c)
            };
        null !== d._tooltipGroup && void 0 !== d._tooltipGroup && d._tooltipGroup.remove(), d._tooltipGroup = d.svg.append("g"), e.p || (k = e._isStacked() ? 1 : r / 2, e.x._hasCategories() || null === v.y || d._tooltipGroup.append("line").attr("class", "dimple-tooltip-dropline " + d.customClassList.tooltipDropLine).attr("x1", p < e.x._origin ? p + k : p + r - k).attr("y1", q < v.y ? q + s : q).attr("x2", p < e.x._origin ? p + k : p + r - k).attr("y2", q < v.y ? q + s : q).call(function () {
            d.noFormats || this.style("fill", "none").style("stroke", u).style("stroke-width", 2).style("stroke-dasharray", "3, 3").style("opacity", t)
        }).transition().delay(n / 2).duration(n / 2).ease("linear").attr("y2", q < v.y ? v.y - 1 : v.y + 1), k = e._isStacked() ? 1 : s / 2, e.y._hasCategories() || null === v.x || d._tooltipGroup.append("line").attr("class", "dimple-tooltip-dropline " + d.customClassList.tooltipDropLine).attr("x1", p < v.x ? p + r : p).attr("y1", q < e.y._origin ? q + k : q + s - k).attr("x2", p < v.x ? p + r : p).attr("y2", q < e.y._origin ? q + k : q + s - k).call(function () {
            d.noFormats || this.style("fill", "none").style("stroke", u).style("stroke-width", 2).style("stroke-dasharray", "3, 3").style("opacity", t)
        }).transition().delay(n / 2).duration(n / 2).ease("linear").attr("x2", p < v.x ? v.x - 1 : v.x + 1)), f = d._tooltipGroup.append("g"), g = f.append("rect").attr("class", "dimple-tooltip " + d.customClassList.tooltipBox), f.selectAll(".dimple-dont-select-any").data(y).enter().append("text").attr("class", "dimple-tooltip " + d.customClassList.tooltipLabel).text(function (a) {
            return a
        }).call(function () {
            d.noFormats || this.style("font-family", e.tooltipFontFamily).style("font-size", e._getTooltipFontSize())
        }), f.each(function () {
            A = this.getBBox().width > A ? this.getBBox().width : A, B = this.getBBox().width > B ? this.getBBox().height : B
        }), f.selectAll("text").attr("x", 0).attr("y", function () {
            return z += this.getBBox().height, z - this.getBBox().height / 2
        }), g.attr("x", -l).attr("y", -l).attr("height", Math.floor(z + l) - .5).attr("width", A + 2 * l).attr("rx", 5).attr("ry", 5).call(function () {
            d.noFormats || this.style("fill", x).style("stroke", w).style("stroke-width", 2).style("opacity", .95)
        }), C(p + r + l + m + A).x < parseFloat(d.svg.node().getBBox().width) ? (h = p + r + l + m, i = q + s / 2 - (z - (B - l)) / 2) : C(p - (l + m + A)).x > 0 ? (h = p - (l + m + A), i = q + s / 2 - (z - (B - l)) / 2) : C(0, q + s + z + m + l).y < parseFloat(d.svg.node().getBBox().height) ? (h = p + r / 2 - (2 * l + A) / 2, h = h > 0 ? h : m, h = h + A < parseFloat(d.svg.node().getBBox().width) ? h : parseFloat(d.svg.node().getBBox().width) - A - m, i = q + s + 2 * l) : (h = p + r / 2 - (2 * l + A) / 2, h = h > 0 ? h : m, h = h + A < parseFloat(d.svg.node().getBBox().width) ? h : parseFloat(d.svg.node().getBBox().width) - A - m, i = q - z - (B - l)), j = C(h, i), f.attr("transform", "translate(" + j.x + " , " + j.y + ")")
    }, b._showPointTooltip = function (c, d, e, f) {
        var g, h, i, j, k = 5, l = 10, m = 750, n = a.select(d), o = parseFloat(n.attr("cx")),
            p = parseFloat(n.attr("cy")), q = parseFloat(n.attr("r")), r = b._helpers.opacity(c, e, f),
            s = n.attr("stroke"), t = f._dropLineOrigin(),
            u = a.rgb(a.rgb(s).r + .6 * (255 - a.rgb(s).r), a.rgb(s).g + .6 * (255 - a.rgb(s).g), a.rgb(s).b + .6 * (255 - a.rgb(s).b)),
            v = a.rgb(a.rgb(s).r + .8 * (255 - a.rgb(s).r), a.rgb(s).g + .8 * (255 - a.rgb(s).g), a.rgb(s).b + .8 * (255 - a.rgb(s).b)),
            w = 0, x = 0, y = 0, z = f.getTooltipText(c);
        null !== e._tooltipGroup && void 0 !== e._tooltipGroup && e._tooltipGroup.remove(), e._tooltipGroup = e.svg.append("g"), e._tooltipGroup.append("circle").attr("cx", o).attr("cy", p).attr("r", q).call(function () {
            e.noFormats || this.attr("opacity", 0).style("fill", "none").style("stroke", s).style("stroke-width", 1)
        }).transition().duration(m / 2).ease("linear").attr("r", q + f.lineWeight + 2).call(function () {
            e.noFormats || this.attr("opacity", 1).style("stroke-width", 2)
        }), null !== t.y && e._tooltipGroup.append("line").attr("class", "dimple-tooltip-dropline " + e.customClassList.tooltipDropLine).attr("x1", o).attr("y1", p < t.y ? p + q + f.lineWeight + 2 : p - q - f.lineWeight - 2).attr("x2", o).attr("y2", p < t.y ? p + q + f.lineWeight + 2 : p - q - f.lineWeight - 2).call(function () {
            e.noFormats || this.style("fill", "none").style("stroke", s).style("stroke-width", 2).style("stroke-dasharray", "3, 3").style("opacity", r)
        }).transition().delay(m / 2).duration(m / 2).ease("linear").attr("y2", p < t.y ? t.y - 1 : t.y + 1), null !== t.x && e._tooltipGroup.append("line").attr("class", "dimple-tooltip-dropline " + e.customClassList.tooltipDropLine).attr("x1", o < t.x ? o + q + f.lineWeight + 2 : o - q - f.lineWeight - 2).attr("y1", p).attr("x2", o < t.x ? o + q + f.lineWeight + 2 : o - q - f.lineWeight - 2).attr("y2", p).call(function () {
            e.noFormats || this.style("fill", "none").style("stroke", s).style("stroke-width", 2).style("stroke-dasharray", "3, 3").style("opacity", r)
        }).transition().delay(m / 2).duration(m / 2).ease("linear").attr("x2", o < t.x ? t.x - 1 : t.x + 1), g = e._tooltipGroup.append("g"), h = g.append("rect").attr("class", "dimple-tooltip " + e.customClassList.tooltipBox), g.selectAll(".dont-select-any").data(z).enter().append("text").attr("class", "dimple-tooltip " + e.customClassList.tooltipLabel).text(function (a) {
            return a
        }).call(function () {
            e.noFormats || this.style("font-family", f.tooltipFontFamily).style("font-size", f._getTooltipFontSize())
        }), g.each(function () {
            x = this.getBBox().width > x ? this.getBBox().width : x, y = this.getBBox().width > y ? this.getBBox().height : y
        }), g.selectAll("text").attr("x", 0).attr("y", function () {
            return w += this.getBBox().height, w - this.getBBox().height / 2
        }), h.attr("x", -k).attr("y", -k).attr("height", Math.floor(w + k) - .5).attr("width", x + 2 * k).attr("rx", 5).attr("ry", 5).call(function () {
            e.noFormats || this.style("fill", v).style("stroke", u).style("stroke-width", 2).style("opacity", .95)
        }), o + q + k + l + x < parseFloat(e.svg.node().getBBox().width) ? (i = o + q + k + l, j = p - (w - (y - k)) / 2) : o - q - (k + l + x) > 0 ? (i = o - q - (k + l + x), j = p - (w - (y - k)) / 2) : p + q + w + l + k < parseFloat(e.svg.node().getBBox().height) ? (i = o - (2 * k + x) / 2, i = i > 0 ? i : l, i = i + x < parseFloat(e.svg.node().getBBox().width) ? i : parseFloat(e.svg.node().getBBox().width) - x - l, j = p + q + 2 * k) : (i = o - (2 * k + x) / 2, i = i > 0 ? i : l, i = i + x < parseFloat(e.svg.node().getBBox().width) ? i : parseFloat(e.svg.node().getBBox().width) - x - l, j = p - w - (y - k)), g.attr("transform", "translate(" + i + " , " + j + ")")
    }, b.filterData = function (a, b, c) {
        var d = a;
        return null !== b && null !== c && (null !== c && void 0 !== c && (c = [].concat(c)), d = [], a.forEach(function (a) {
            null === a[b] ? d.push(a) : c.indexOf([].concat(a[b]).join("/")) > -1 && d.push(a)
        }, this)), d
    }, b.getUniqueValues = function (a, b) {
        var c = [];
        return null !== b && void 0 !== b && (b = [].concat(b), a.forEach(function (a) {
            var d = "";
            b.forEach(function (b, c) {
                c > 0 && (d += "/"), d += a[b]
            }, this), -1 === c.indexOf(d) && c.push(d)
        }, this)), c
    }, b.newSvg = function (b, c, d) {
        var e = null;
        if ((null === b || void 0 === b) && (b = "body"), e = a.select(b), e.empty()) throw "The '" + b + "' selector did not match any elements.  Please prefix with '#' to select by id or '.' to select by class";
        return e.append("svg").attr("width", c).attr("height", d)
    }, b
});