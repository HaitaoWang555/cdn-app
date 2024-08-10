import { defineComponent as x, computed as b, resolveComponent as P, openBlock as r, createBlock as C, withCtx as _, createVNode as V, TransitionGroup as ve, createElementBlock as p, Fragment as W, renderList as ee, createTextVNode as K, toDisplayString as k, ref as L, normalizeClass as M, createElementVNode as g, renderSlot as I, unref as f, createCommentVNode as E, pushScopeId as _e, popScopeId as ge, normalizeStyle as ce, resolveDynamicComponent as we, normalizeProps as be, guardReactiveProps as ye, watch as ue, nextTick as Z, onMounted as de, watchEffect as Ve, withModifiers as oe, withDirectives as Se, vShow as xe, Transition as Ce, provide as Ae } from "vue";
import { defineStore as te } from "pinia";
import { useRoute as Q, useRouter as ne } from "vue-router";
import { buildLocaleContext as $e, ElDropdown as Ee, ElDropdownItem as Le, ElDropdownMenu as Pe, ElMenu as Te, ElMenuItem as ke, ElSubMenu as Ie, ElScrollbar as Be, ElBreadcrumb as Me, ElBreadcrumbItem as Oe } from "element-plus";
function J() {
  return window["pro-layout-localStoragePrefix"] || "sidebarStatus";
}
const he = te({
  id: "useAppStore",
  state: () => ({
    sidebar: {
      opened: localStorage.getItem(J()) ? !!+localStorage.getItem(J()) : !0,
      withoutAnimation: !1
    },
    device: "desktop"
  }),
  getters: {},
  actions: {
    async toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened, this.sidebar.withoutAnimation = !1, this.sidebar.opened ? localStorage.setItem(J(), "1") : localStorage.setItem(J(), "0");
    },
    async closeSideBar(e) {
      localStorage.setItem(J(), "0"), this.sidebar.opened = !1, this.sidebar.withoutAnimation = e;
    },
    async toggleDevice(e) {
      this.device = e;
    }
  }
}), F = te({
  id: "useSettingsStore",
  state: () => ({
    showHeader: !0,
    showSider: !0,
    showChangeLocal: !0,
    showSettings: !0,
    sidebarLogo: !1,
    tagsView: !0,
    breadcrumb: !0,
    logoUrl: "",
    componyTitle: "",
    locale: void 0
  }),
  getters: {},
  actions: {
    async changeSetting({ key: e, value: t }) {
      this.hasOwnProperty(e) && (this[e] = t);
    },
    async changeLocale(e) {
      this.locale = e;
    }
  }
});
function Re(e) {
  for (var t = [], a = 0; a < e.length; ) {
    var s = e[a];
    if (s === "*" || s === "+" || s === "?") {
      t.push({ type: "MODIFIER", index: a, value: e[a++] });
      continue;
    }
    if (s === "\\") {
      t.push({ type: "ESCAPED_CHAR", index: a++, value: e[a++] });
      continue;
    }
    if (s === "{") {
      t.push({ type: "OPEN", index: a, value: e[a++] });
      continue;
    }
    if (s === "}") {
      t.push({ type: "CLOSE", index: a, value: e[a++] });
      continue;
    }
    if (s === ":") {
      for (var i = "", n = a + 1; n < e.length; ) {
        var o = e.charCodeAt(n);
        if (
          // `0-9`
          o >= 48 && o <= 57 || // `A-Z`
          o >= 65 && o <= 90 || // `a-z`
          o >= 97 && o <= 122 || // `_`
          o === 95
        ) {
          i += e[n++];
          continue;
        }
        break;
      }
      if (!i)
        throw new TypeError("Missing parameter name at ".concat(a));
      t.push({ type: "NAME", index: a, value: i }), a = n;
      continue;
    }
    if (s === "(") {
      var l = 1, u = "", n = a + 1;
      if (e[n] === "?")
        throw new TypeError('Pattern cannot start with "?" at '.concat(n));
      for (; n < e.length; ) {
        if (e[n] === "\\") {
          u += e[n++] + e[n++];
          continue;
        }
        if (e[n] === ")") {
          if (l--, l === 0) {
            n++;
            break;
          }
        } else if (e[n] === "(" && (l++, e[n + 1] !== "?"))
          throw new TypeError("Capturing groups are not allowed at ".concat(n));
        u += e[n++];
      }
      if (l)
        throw new TypeError("Unbalanced pattern at ".concat(a));
      if (!u)
        throw new TypeError("Missing pattern at ".concat(a));
      t.push({ type: "PATTERN", index: a, value: u }), a = n;
      continue;
    }
    t.push({ type: "CHAR", index: a, value: e[a++] });
  }
  return t.push({ type: "END", index: a, value: "" }), t;
}
function Ne(e, t) {
  t === void 0 && (t = {});
  for (var a = Re(e), s = t.prefixes, i = s === void 0 ? "./" : s, n = "[^".concat(De(t.delimiter || "/#?"), "]+?"), o = [], l = 0, u = 0, d = "", h = function(H) {
    if (u < a.length && a[u].type === H)
      return a[u++].value;
  }, c = function(H) {
    var q = h(H);
    if (q !== void 0)
      return q;
    var Y = a[u], m = Y.type, w = Y.index;
    throw new TypeError("Unexpected ".concat(m, " at ").concat(w, ", expected ").concat(H));
  }, A = function() {
    for (var H = "", q; q = h("CHAR") || h("ESCAPED_CHAR"); )
      H += q;
    return H;
  }; u < a.length; ) {
    var R = h("CHAR"), N = h("NAME"), y = h("PATTERN");
    if (N || y) {
      var v = R || "";
      i.indexOf(v) === -1 && (d += v, v = ""), d && (o.push(d), d = ""), o.push({
        name: N || l++,
        prefix: v,
        suffix: "",
        pattern: y || n,
        modifier: h("MODIFIER") || ""
      });
      continue;
    }
    var $ = R || h("ESCAPED_CHAR");
    if ($) {
      d += $;
      continue;
    }
    d && (o.push(d), d = "");
    var z = h("OPEN");
    if (z) {
      var v = A(), B = h("NAME") || "", U = h("PATTERN") || "", X = A();
      c("CLOSE"), o.push({
        name: B || (U ? l++ : ""),
        pattern: B && !U ? n : U,
        prefix: v,
        suffix: X,
        modifier: h("MODIFIER") || ""
      });
      continue;
    }
    c("END");
  }
  return o;
}
function He(e, t) {
  return qe(Ne(e, t), t);
}
function qe(e, t) {
  t === void 0 && (t = {});
  var a = ze(t), s = t.encode, i = s === void 0 ? function(u) {
    return u;
  } : s, n = t.validate, o = n === void 0 ? !0 : n, l = e.map(function(u) {
    if (typeof u == "object")
      return new RegExp("^(?:".concat(u.pattern, ")$"), a);
  });
  return function(u) {
    for (var d = "", h = 0; h < e.length; h++) {
      var c = e[h];
      if (typeof c == "string") {
        d += c;
        continue;
      }
      var A = u ? u[c.name] : void 0, R = c.modifier === "?" || c.modifier === "*", N = c.modifier === "*" || c.modifier === "+";
      if (Array.isArray(A)) {
        if (!N)
          throw new TypeError('Expected "'.concat(c.name, '" to not repeat, but got an array'));
        if (A.length === 0) {
          if (R)
            continue;
          throw new TypeError('Expected "'.concat(c.name, '" to not be empty'));
        }
        for (var y = 0; y < A.length; y++) {
          var v = i(A[y], c);
          if (o && !l[h].test(v))
            throw new TypeError('Expected all "'.concat(c.name, '" to match "').concat(c.pattern, '", but got "').concat(v, '"'));
          d += c.prefix + v + c.suffix;
        }
        continue;
      }
      if (typeof A == "string" || typeof A == "number") {
        var v = i(String(A), c);
        if (o && !l[h].test(v))
          throw new TypeError('Expected "'.concat(c.name, '" to match "').concat(c.pattern, '", but got "').concat(v, '"'));
        d += c.prefix + v + c.suffix;
        continue;
      }
      if (!R) {
        var $ = N ? "an array" : "a string";
        throw new TypeError('Expected "'.concat(c.name, '" to be ').concat($));
      }
    }
    return d;
  };
}
function De(e) {
  return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function ze(e) {
  return e && e.sensitive ? "" : "i";
}
const Ue = /* @__PURE__ */ x({
  __name: "base-breadcrumb",
  setup(e) {
    const t = Q();
    function a(n) {
      const { params: o } = t;
      return He(n)(o);
    }
    const s = () => {
      let n = [];
      return t && t.matched && (n = t.matched.filter((o) => o.meta && o.meta.title && o.meta.breadcrumb !== !1)), n;
    }, i = b(() => s());
    return (n, o) => {
      const l = P("el-breadcrumb-item"), u = P("el-breadcrumb");
      return r(), C(u, {
        class: "app-breadcrumb",
        separator: "/"
      }, {
        default: _(() => [
          V(ve, { name: "breadcrumb" }, {
            default: _(() => [
              (r(!0), p(W, null, ee(i.value, (d, h) => (r(), C(l, {
                key: d.path,
                to: h === i.value.length - 1 ? "" : { path: a(d.path) }
              }, {
                default: _(() => {
                  var c;
                  return [
                    K(k((c = d.meta) == null ? void 0 : c.title), 1)
                  ];
                }),
                _: 2
              }, 1032, ["to"]))), 128))
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
}), O = (e, t) => {
  const a = e.__vccOpts || e;
  for (const [s, i] of t)
    a[s] = i;
  return a;
}, We = /* @__PURE__ */ O(Ue, [["__scopeId", "data-v-a628ee6d"]]), Fe = {
  key: 1,
  class: "el-breadcrumb"
}, je = /* @__PURE__ */ x({
  __name: "app-main",
  props: {
    isMicroAppSingle: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    const t = e, a = F(), s = b(() => a.breadcrumb), i = L(window.__MICRO_APP_BASE_APPLICATION__ && !t.isMicroAppSingle);
    return (n, o) => (r(), p("section", {
      class: M(["app-main", { hasBreadcrumb: s.value }])
    }, [
      s.value ? (r(), C(We, {
        key: 0,
        class: "breadcrumb"
      })) : (r(), p("div", Fe)),
      g("div", {
        class: M(["app-content", { "micro-main-app": i.value }])
      }, [
        I(n.$slots, "default", {}, void 0, !0)
      ], 2)
    ], 2));
  }
}), Ge = /* @__PURE__ */ O(je, [["__scopeId", "data-v-24793c37"]]), Ke = {
  name: "zh-cn",
  el: {
    tagsView: {
      refresh: "刷新",
      close: "关闭",
      closeOthers: "关闭其它",
      closeAll: "关闭所有"
    },
    settings: {
      title: "系统布局配置",
      theme: "主题色",
      tagsView: "开启 Tags-View",
      fixedHeader: "固定 Header",
      sidebarLogo: "侧边栏 Logo"
    }
  }
}, pe = {
  name: "en",
  el: {
    tagsView: {
      refresh: "Refresh",
      close: "Close",
      closeOthers: "Close Others",
      closeAll: "Close All"
    },
    settings: {
      title: "Page style setting",
      theme: "Theme Color",
      tagsView: "Open Tags-View",
      fixedHeader: "Fixed Header",
      sidebarLogo: "Sidebar Logo"
    }
  }
}, Xe = {
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em"
}, Ye = /* @__PURE__ */ g("path", {
  fill: "currentColor",
  d: "m12.87 15.07l-2.54-2.51l.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5l3.11 3.11l.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
}, null, -1), Je = [
  Ye
];
function Qe(e, t) {
  return r(), p("svg", Xe, [...Je]);
}
const Ze = { name: "ic-baseline-translate", render: Qe }, et = /* @__PURE__ */ x({
  __name: "change-lang",
  setup(e) {
    const t = F(), a = b(() => {
      var i;
      return (i = t.locale) == null ? void 0 : i.name;
    });
    function s(i) {
      switch (i) {
        case "en":
          t.changeLocale(pe);
          break;
        case "zh-cn":
          t.changeLocale(Ke);
          break;
      }
    }
    return (i, n) => {
      const o = P("el-dropdown-item"), l = P("el-dropdown-menu"), u = P("el-dropdown");
      return f(t).showChangeLocal ? (r(), C(u, {
        key: 0,
        trigger: "click"
      }, {
        dropdown: _(() => [
          V(l, null, {
            default: _(() => [
              V(o, {
                class: M({ active: a.value === "zh-cn" }),
                onClick: n[0] || (n[0] = (d) => s("zh-cn"))
              }, {
                default: _(() => [
                  K("简体中文")
                ]),
                _: 1
              }, 8, ["class"]),
              V(o, {
                class: M({ active: a.value === "en" }),
                onClick: n[1] || (n[1] = (d) => s("en"))
              }, {
                default: _(() => [
                  K("English")
                ]),
                _: 1
              }, 8, ["class"])
            ]),
            _: 1
          })
        ]),
        default: _(() => [
          V(f(Ze), { class: "action" })
        ]),
        _: 1
      })) : E("", !0);
    };
  }
}), tt = /* @__PURE__ */ O(et, [["__scopeId", "data-v-1ab7c21d"]]), at = { class: "navbar" }, nt = { style: { display: "flex", flex: "1" } }, st = { style: { flex: "1" } }, it = { class: "right" }, ot = /* @__PURE__ */ x({
  __name: "base-navbar",
  setup(e) {
    return (t, a) => (r(), p("div", at, [
      V(f(Zt)),
      g("div", nt, [
        g("div", st, [
          I(t.$slots, "center", {}, void 0, !0)
        ]),
        g("div", it, [
          V(tt),
          I(t.$slots, "default", {}, void 0, !0)
        ])
      ])
    ]));
  }
}), rt = /* @__PURE__ */ O(ot, [["__scopeId", "data-v-624cd92e"]]), lt = (e) => (_e("data-v-e395354d"), e = e(), ge(), e), ct = /* @__PURE__ */ lt(() => /* @__PURE__ */ g("path", { d: "M6.432 7.967a.448.448 0 01-.318.133h-.228a.46.46 0 01-.318-.133L2.488 4.85a.305.305 0 010-.43l.427-.43a.293.293 0 01.42 0L6 6.687l2.665-2.699a.299.299 0 01.426 0l.42.431a.305.305 0 010 .43L6.432 7.967z" }, null, -1)), ut = [
  ct
], dt = /* @__PURE__ */ x({
  __name: "base-hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: !1,
      required: !1
    }
  },
  emits: ["toggleClick"],
  setup(e, { emit: t }) {
    const a = t, s = () => {
      a("toggleClick");
    };
    return (i, n) => (r(), p("div", {
      class: "wrap",
      onClick: s
    }, [
      (r(), p("svg", {
        class: M([{ "is-active": e.isActive }, "hamburger"]),
        width: "1em",
        height: "1em",
        viewBox: "0 0 12 12",
        fill: "currentColor",
        "aria-hidden": "true"
      }, ut, 2))
    ]));
  }
}), ht = /* @__PURE__ */ O(dt, [["__scopeId", "data-v-e395354d"]]), pt = { key: 1 }, re = /* @__PURE__ */ x({
  __name: "base-item",
  props: {
    icon: {},
    title: {}
  },
  setup(e) {
    const t = e;
    return (a, s) => (r(), p(W, null, [
      t.icon ? (r(), C(f(me), {
        key: 0,
        "icon-class": t.icon
      }, null, 8, ["icon-class"])) : E("", !0),
      t.title ? (r(), p("span", pt, [
        I(a.$slots, "title", {}, () => [
          K(k(t.title), 1)
        ])
      ])) : E("", !0)
    ], 64));
  }
}), ft = /* @__PURE__ */ x({
  __name: "base-redirect",
  setup(e) {
    const t = Q(), a = ne(), { params: s, query: i } = t, { path: n } = s;
    return a.replace({ path: "/" + n, query: i }), (o, l) => (r(), p("div"));
  }
}), mt = {
  viewBox: "0 0 1024 1024",
  width: "1em",
  height: "1em"
}, vt = /* @__PURE__ */ g("path", {
  fill: "currentColor",
  d: "M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088l-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36l-116.224-25.088l-65.28 113.152l79.68 88.192l-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136l-79.808 88.192l65.344 113.152l116.224-25.024l22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152l24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296l116.288 25.024l65.28-113.152l-79.744-88.192l1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136l79.808-88.128l-65.344-113.152l-116.288 24.96l-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384a192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256a128 128 0 0 0 0-256z"
}, null, -1), _t = [
  vt
];
function gt(e, t) {
  return r(), p("svg", mt, [..._t]);
}
const wt = { name: "ep-setting", render: gt }, bt = /* @__PURE__ */ x({
  __name: "base-right-panel",
  props: {
    buttonTop: {
      default: 250,
      type: Number
    }
  },
  setup(e) {
    const t = L(!1), a = L("#1890ff");
    return (s, i) => {
      const n = P("el-drawer");
      return r(), p(W, null, [
        t.value ? E("", !0) : (r(), p("div", {
          key: 0,
          class: "handle-button",
          style: ce({ top: e.buttonTop + "px", "background-color": a.value }),
          onClick: i[0] || (i[0] = (o) => t.value = !t.value)
        }, [
          V(f(wt))
        ], 4)),
        V(n, {
          modelValue: t.value,
          "onUpdate:modelValue": i[1] || (i[1] = (o) => t.value = o),
          direction: "rtl",
          "with-header": !1
        }, {
          default: _(() => [
            I(s.$slots, "default", {}, void 0, !0)
          ]),
          _: 3
        }, 8, ["modelValue"])
      ], 64);
    };
  }
}), yt = /* @__PURE__ */ O(bt, [["__scopeId", "data-v-17ca50e6"]]), fe = () => {
  const e = F(), t = b(() => e.locale);
  return $e(b(() => t.value || pe));
}, Vt = { class: "drawer-container" }, St = { class: "drawer-title" }, xt = { class: "drawer-item" }, Ct = { class: "drawer-item" }, At = /* @__PURE__ */ x({
  __name: "base-settings",
  setup(e) {
    const t = F(), { t: a } = fe(), s = b({
      get: () => t.tagsView,
      set: (n) => {
        t.changeSetting({
          key: "tagsView",
          value: n
        });
      }
    }), i = b({
      get: () => t.sidebarLogo,
      set: (n) => {
        t.changeSetting({
          key: "sidebarLogo",
          value: n
        });
      }
    });
    return (n, o) => {
      const l = P("el-switch");
      return r(), p("div", Vt, [
        g("div", null, [
          g("h3", St, k(f(a)("el.settings.title")), 1),
          g("div", xt, [
            g("span", null, k(f(a)("el.settings.tagsView")), 1),
            V(l, {
              modelValue: s.value,
              "onUpdate:modelValue": o[0] || (o[0] = (u) => s.value = u),
              class: "drawer-switch"
            }, null, 8, ["modelValue"])
          ]),
          g("div", Ct, [
            g("span", null, k(f(a)("el.settings.sidebarLogo")), 1),
            V(l, {
              modelValue: i.value,
              "onUpdate:modelValue": o[1] || (o[1] = (u) => i.value = u),
              class: "drawer-switch"
            }, null, 8, ["modelValue"])
          ])
        ])
      ]);
    };
  }
}), $t = /* @__PURE__ */ O(At, [["__scopeId", "data-v-e610982b"]]);
function ae(e) {
  return /^(https?:|mailto:|tel:)/.test(e);
}
const Et = /* @__PURE__ */ x({
  __name: "sidebar-link",
  props: {
    to: {
      type: String,
      default: "",
      required: !0
    },
    query: {
      type: Object,
      default: null
    },
    iframe: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    const t = e, a = b(() => ae(t.to)), s = b(() => a.value ? "a" : "router-link"), i = (n) => a.value ? {
      href: n,
      target: "_blank",
      rel: "noopener"
    } : t.query ? {
      to: {
        path: n,
        query: t.query
      }
    } : {
      to: n
    };
    return (n, o) => (r(), C(we(s.value), be(ye(i(e.to))), {
      default: _(() => [
        I(n.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Lt = { key: 0 }, Pt = /* @__PURE__ */ x({
  __name: "sidebar-item",
  props: {
    item: {
      type: Object,
      default: () => ({}),
      required: !0
    },
    isNest: {
      type: Boolean,
      default: !1,
      required: !1
    },
    basePath: {
      type: String,
      default: "",
      required: !1
    }
  },
  setup(e) {
    const t = e, a = L(), s = (n = [], o) => {
      const l = n.filter((u) => {
        var d;
        return (d = u.meta) != null && d.hidden ? !1 : (a.value = f(u), !0);
      });
      return l.length === 1 ? !0 : l.length === 0 ? (a.value = { ...o, path: "", noShowingChildren: !0 }, !0) : !1;
    }, i = (n) => {
      if (ae(n))
        return n;
      if (ae(t.basePath))
        return t.basePath;
      const o = t.basePath === "/" ? "" : "/";
      let l;
      return n.startsWith("/") ? l = n : n ? l = t.basePath + o + n : l = t.basePath, l.replace(/\/+/g, "/");
    };
    return (n, o) => {
      var h;
      const l = P("el-menu-item"), u = P("sidebar-item", !0), d = P("el-sub-menu");
      return (h = e.item.meta) != null && h.hidden ? E("", !0) : (r(), p("div", Lt, [
        s(e.item.children, e.item) && (!(a.value.children && a.value.children.length > 0) || a.value.noShowingChildren) && !e.item.alwaysShow ? (r(), p(W, { key: 0 }, [
          a.value.meta ? (r(), C(Et, {
            key: 0,
            to: i(a.value.path),
            query: a.value.meta.query,
            iframe: a.value.meta.iframe
          }, {
            default: _(() => [
              V(l, {
                index: i(a.value.path),
                class: M({ "submenu-title-noDropdown": !e.isNest })
              }, {
                title: _(() => [
                  K(k(a.value.meta.title), 1)
                ]),
                default: _(() => [
                  V(re, {
                    icon: a.value.meta.icon || e.item.meta && e.item.meta.icon
                  }, null, 8, ["icon"])
                ]),
                _: 1
              }, 8, ["index", "class"])
            ]),
            _: 1
          }, 8, ["to", "query", "iframe"])) : E("", !0)
        ], 64)) : (r(), C(d, {
          key: 1,
          index: i(e.item.path)
        }, {
          title: _(() => [
            e.item.meta ? (r(), C(re, {
              key: 0,
              icon: e.item.meta && e.item.meta.icon,
              title: e.item.meta.title
            }, null, 8, ["icon", "title"])) : E("", !0)
          ]),
          default: _(() => [
            (r(!0), p(W, null, ee(e.item.children, (c) => (r(), C(u, {
              key: c.path,
              "is-nest": !0,
              item: c,
              "base-path": i(c.path),
              class: "nest-menu"
            }, null, 8, ["item", "base-path"]))), 128))
          ]),
          _: 1
        }, 8, ["index"]))
      ]));
    };
  }
}), Tt = te({
  id: "useRoutesStore",
  state: () => ({
    addRoutes: [],
    finalRouterPath: ""
  }),
  actions: {
    async setRoutes(e) {
      this.addRoutes = e;
    },
    async setFinalRouterPath(e) {
      this.finalRouterPath = e;
    }
  }
}), kt = "/:pathMatch(.*)*", It = /* @__PURE__ */ x({
  __name: "base-sidebar",
  props: {
    isMicroAppSingle: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    function t(y) {
      return function(v, $) {
        let z = v.meta ? v.meta[y] : 0, B = $.meta ? $.meta[y] : 0;
        return z - B;
      };
    }
    function a(y) {
      for (let v = 0; v < y.length; v++) {
        let $ = y[v];
        $.children && $.children.length > 0 && $.children.sort(t("sortNo"));
      }
      y.sort(t("sortNo"));
    }
    const s = e, i = he(), n = Tt(), o = Q(), l = L(!0), u = b(() => i.sidebar), d = b(() => n.addRoutes.filter((y) => y.path !== kt));
    a(d.value);
    const h = b(() => {
      const { meta: y, path: v } = o;
      return y.activeMenu ? y.activeMenu : window.__MICRO_APP_BASE_APPLICATION__ && !s.isMicroAppSingle && n.finalRouterPath ? n.finalRouterPath : v;
    }), c = getComputedStyle(document.body), A = L({
      menuBg: c.getPropertyValue("--sidebar-menu-bg"),
      menuText: c.getPropertyValue("--sidebar-menu-text"),
      menuActiveText: c.getPropertyValue("--sidebar-menu-active-text")
    }), R = b(() => !u.value.opened), N = () => {
      i.toggleSideBar();
    };
    return ue(
      () => d.value,
      () => {
        window.__MICRO_APP_BASE_APPLICATION__ && (u.value.opened || (l.value = !1, i.toggleSideBar(), Z(() => {
          l.value = !0, i.closeSideBar(!0);
        })));
      }
    ), (y, v) => {
      const $ = P("el-menu"), z = P("el-scrollbar");
      return r(), p("div", null, [
        V(ht, {
          "is-active": f(i).sidebar.opened,
          class: "hamburger-container",
          onToggleClick: N
        }, null, 8, ["is-active"]),
        V(z, { "wrap-class": "scrollbar-wrapper" }, {
          default: _(() => [
            V($, {
              "default-active": h.value,
              collapse: R.value,
              "background-color": A.value.menuBg,
              "text-color": A.value.menuText,
              "unique-opened": !1,
              "active-text-color": A.value.menuActiveText,
              "collapse-transition": !1,
              mode: "vertical"
            }, {
              default: _(() => [
                (r(!0), p(W, null, ee(d.value, (B, U) => (r(), C(Pt, {
                  key: B.path + U,
                  item: B,
                  "base-path": B.path
                }, null, 8, ["item", "base-path"]))), 128))
              ]),
              _: 1
            }, 8, ["default-active", "collapse", "background-color", "text-color", "active-text-color"])
          ]),
          _: 1
        })
      ]);
    };
  }
}), Bt = te({
  id: "useTagsViewStore",
  state: () => ({
    visitedViews: [],
    cachedViews: []
  }),
  getters: {},
  actions: {
    async addView(e) {
      this.addVisitedView(e), this.addCachedView(e);
    },
    async addVisitedView(e) {
      var t;
      this.visitedViews.some((a) => a.path === e.path) || this.visitedViews.push(
        Object.assign({}, e, {
          title: ((t = e.meta) == null ? void 0 : t.title) || "no-name"
        })
      );
    },
    async addCachedView(e) {
      var t;
      this.cachedViews.includes(e.name) || (t = e.meta) != null && t.noCache || this.cachedViews.push(e.name);
    },
    async delView(e) {
      return new Promise(async (t) => {
        await this.delVisitedView(e), await this.delCachedView(e), t({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        });
      });
    },
    async delVisitedView(e) {
      return new Promise((t) => {
        for (const [a, s] of this.visitedViews.entries())
          if (s.path === e.path) {
            this.visitedViews.splice(a, 1);
            break;
          }
        t([...this.visitedViews]);
      });
    },
    async delCachedView(e) {
      return new Promise((t) => {
        const a = this.cachedViews.indexOf(e.name);
        a > -1 && this.cachedViews.splice(a, 1), t([...this.cachedViews]);
      });
    },
    async delOthersViews(e) {
      return new Promise(async (t) => {
        await this.delOthersVisitedViews(e), await this.delOthersCachedViews(e), t({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        });
      });
    },
    async delOthersVisitedViews(e) {
      return new Promise((t) => {
        this.visitedViews = this.visitedViews.filter((a) => {
          var s;
          return ((s = a.meta) == null ? void 0 : s.affix) || a.path === e.path;
        }), t([...this.visitedViews]);
      });
    },
    async delOthersCachedViews(e) {
      return new Promise((t) => {
        const a = this.cachedViews.indexOf(e.name);
        a > -1 ? this.cachedViews = this.cachedViews.slice(a, a + 1) : this.cachedViews = [], t([...this.cachedViews]);
      });
    },
    async delAllViews() {
      return new Promise(async (e) => {
        await this.delAllVisitedViews(), await this.delAllCachedViews(), e({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        });
      });
    },
    async delAllVisitedViews() {
      return new Promise((e) => {
        const t = this.visitedViews.filter((a) => {
          var s;
          return (s = a.meta) == null ? void 0 : s.affix;
        });
        this.visitedViews = t, e([...this.visitedViews]);
      });
    },
    async delAllCachedViews() {
      return new Promise((e) => {
        this.cachedViews = [], e([...this.cachedViews]);
      });
    },
    async updateVisitedView(e) {
      for (let t of this.visitedViews)
        if (t.path === e.path) {
          t = Object.assign(t, e);
          break;
        }
    }
  }
}), Mt = {
  viewBox: "0 0 1024 1024",
  width: "1em",
  height: "1em"
}, Ot = /* @__PURE__ */ g("path", {
  fill: "currentColor",
  d: "M764.288 214.592L512 466.88L259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512L214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
}, null, -1), Rt = [
  Ot
];
function Nt(e, t) {
  return r(), p("svg", Mt, [...Rt]);
}
const Ht = { name: "ep-close", render: Nt }, qt = ["data-path", "data-fullPath", "onClick", "onContextmenu"], Dt = ["onClick"], zt = { style: { width: "100%", position: "relative" } }, le = 4, Ut = /* @__PURE__ */ x({
  __name: "base-tags-view",
  setup(e) {
    const { t } = fe(), a = L(), s = L(), i = L(!1), n = L(0), o = L(0), l = L({}), u = L([]), d = Bt(), h = Q(), c = ne(), A = b(() => d.visitedViews);
    function R(m) {
      return m.path === h.path;
    }
    function N(m) {
      return m.meta && m.meta.affix;
    }
    function y(m) {
      d.delCachedView(m).then(() => {
        const { fullPath: w } = m;
        Z().then(() => {
          c.replace({
            path: "/redirect" + w
          });
        });
      });
    }
    function v(m) {
      d.delView(m).then(({ visitedViews: w }) => {
        R(m) && B(w, m);
      });
    }
    function $() {
      c.push(l.value), d.delOthersViews(l.value).then(() => {
        Y();
      });
    }
    function z(m) {
      d.delAllViews().then(({ visitedViews: w }) => {
        u.value.some((T) => T.path === m.path) || B(w, m);
      });
    }
    function B(m, w) {
      const T = m.slice(-1)[0];
      T ? c.push(T.fullPath) : w.name === "Dashboard" ? c.replace({ path: "/redirect" + w.fullPath }) : c.push("/");
    }
    function U(m, w) {
      const j = a.value.getBoundingClientRect().left, G = a.value.offsetWidth - 105, D = w.clientX - j + 15;
      D > G ? o.value = G : o.value = D, n.value = w.clientY - 84, i.value = !0, l.value = m;
    }
    function X() {
      i.value = !1;
    }
    function H() {
      X();
    }
    function q() {
      const { name: m } = h;
      return m && d.addView(h), !1;
    }
    function Y() {
      Z().then(() => {
        if (!s.value)
          return;
        const m = document.querySelectorAll('#tags-view-container span[role="link"] '), w = s.value.$el.offsetWidth, T = document.querySelector("#tags-view-container .el-scrollbar__wrap");
        Array.prototype.forEach.call(m, function(j, S) {
          if (j.dataset.path === h.path) {
            if (S === 0)
              s.value.setScrollLeft(0);
            else if (S === m.length - 1)
              s.value.setScrollLeft(T.scrollWidth - w);
            else {
              const G = m[S - 1], D = m[S + 1], se = D.offsetLeft + D.offsetWidth + le, ie = G.offsetLeft - le;
              se > T.scrollLeft + w ? T.scrollLeft = se - w : ie < T.scrollLeft && (T.scrollLeft = ie);
            }
            j.dataset.fullPath !== h.fullPath && d.updateVisitedView(h);
          }
        });
      });
    }
    return de(() => {
      q();
    }), ue(
      () => h.path,
      () => {
        q(), Y();
      }
    ), Ve(() => {
      i.value ? document.body.addEventListener("click", X) : document.body.removeEventListener("click", X);
    }), (m, w) => {
      const T = P("router-link"), j = P("el-scrollbar");
      return r(), p("div", {
        id: "tags-view-container",
        ref_key: "tagsView",
        ref: a,
        class: "tags-view-container"
      }, [
        V(j, {
          ref_key: "refScrollPane",
          ref: s,
          class: "tags-view-wrapper",
          onScroll: H
        }, {
          default: _(() => [
            (r(!0), p(W, null, ee(A.value, (S) => (r(), C(T, {
              key: S.path,
              to: { path: S.path, query: S.query },
              custom: ""
            }, {
              default: _(({ navigate: G }) => [
                g("span", {
                  role: "link",
                  class: M([R(S) ? "active" : "", "tags-view-item"]),
                  "data-path": S.path,
                  "data-fullPath": S.fullPath,
                  onClick: G,
                  onContextmenu: oe((D) => U(S, D), ["prevent"])
                }, [
                  K(k(S.meta.title) + " ", 1),
                  N(S) ? E("", !0) : (r(), p("span", {
                    key: 0,
                    class: "el-icon-close",
                    onClick: oe((D) => v(S), ["prevent", "stop"])
                  }, [
                    V(f(Ht))
                  ], 8, Dt))
                ], 42, qt)
              ]),
              _: 2
            }, 1032, ["to"]))), 128))
          ]),
          _: 1
        }, 512),
        g("div", zt, [
          Se(g("ul", {
            style: ce({ left: o.value + "px", top: n.value + "px" }),
            class: "contextmenu"
          }, [
            g("li", {
              onClick: w[0] || (w[0] = (S) => y(l.value))
            }, k(f(t)("el.tagsView.refresh")), 1),
            N(l.value) ? E("", !0) : (r(), p("li", {
              key: 0,
              onClick: w[1] || (w[1] = (S) => v(l.value))
            }, k(f(t)("el.tagsView.close")), 1)),
            g("li", { onClick: $ }, k(f(t)("el.tagsView.closeOthers")), 1),
            g("li", {
              onClick: w[2] || (w[2] = (S) => z(l.value))
            }, k(f(t)("el.tagsView.closeAll")), 1)
          ], 4), [
            [xe, i.value]
          ])
        ])
      ], 512);
    };
  }
}), Wt = /* @__PURE__ */ O(Ut, [["__scopeId", "data-v-98c27f77"]]), Ft = { class: "sidebar-logo-container" }, jt = {
  key: "collapse",
  class: "sidebar-logo-link",
  href: "/"
}, Gt = ["src"], Kt = {
  key: 1,
  class: "sidebar-title"
}, Xt = {
  key: "expand",
  class: "sidebar-logo-link",
  href: "/"
}, Yt = ["src"], Jt = { class: "sidebar-title" }, Qt = /* @__PURE__ */ x({
  __name: "sidebar-logo",
  props: {
    collapse: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    const t = F();
    return (a, s) => (r(), p("div", Ft, [
      V(Ce, { name: "sidebarLogoFade" }, {
        default: _(() => [
          e.collapse ? (r(), p("a", jt, [
            f(t).logoUrl ? (r(), p("img", {
              key: 0,
              src: f(t).logoUrl,
              class: "sidebar-logo"
            }, null, 8, Gt)) : (r(), p("h1", Kt, k(f(t).componyTitle), 1))
          ])) : (r(), p("a", Xt, [
            f(t).logoUrl ? (r(), p("img", {
              key: 0,
              src: f(t).logoUrl,
              class: "sidebar-logo"
            }, null, 8, Yt)) : E("", !0),
            g("h1", Jt, k(f(t).componyTitle), 1)
          ]))
        ]),
        _: 1
      })
    ]));
  }
}), Zt = /* @__PURE__ */ O(Qt, [["__scopeId", "data-v-1e052dae"]]), ea = ["xlink:href"], ta = /* @__PURE__ */ x({
  __name: "svg-icon",
  props: {
    iconClass: {},
    className: {}
  },
  setup(e) {
    const t = e, a = b(() => `#icon-${t.iconClass}`), s = b(() => t.className ? "svg-icon " + t.className : "svg-icon");
    return (i, n) => (r(), p("svg", {
      class: M(s.value),
      "aria-hidden": "true"
    }, [
      g("use", { "xlink:href": a.value }, null, 8, ea)
    ], 2));
  }
}), me = /* @__PURE__ */ O(ta, [["__scopeId", "data-v-c52cbd5b"]]), aa = ["src", "height"], da = /* @__PURE__ */ x({
  __name: "base-iframe",
  setup(e) {
    const t = Q(), a = b(() => t.query.url), s = L(0);
    return de(() => {
      Z().then(() => {
        const i = document.querySelector(".app-main .app-content");
        s.value = i ? i.clientHeight - 36 : 0;
      });
    }), (i, n) => s.value ? (r(), p("iframe", {
      key: 0,
      src: a.value,
      frameborder: "0",
      width: "100%",
      height: s.value
    }, null, 8, aa)) : E("", !0);
  }
}), na = /* @__PURE__ */ x({
  __name: "LayoutBase",
  props: {
    isMicroAppSingle: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    const t = F(), a = he(), s = b(() => a.sidebar), i = b(() => t.showSettings), n = b(() => t.tagsView), o = b(() => ({
      hideSidebar: !s.value.opened,
      openSidebar: s.value.opened,
      withoutAnimation: s.value.withoutAnimation
    }));
    return (l, u) => (r(), p("div", {
      class: M([o.value, "app-wrapper"])
    }, [
      g("div", {
        class: M(["fixed-header", { "no-header": !f(t).showHeader }])
      }, [
        f(t).showHeader ? (r(), C(f(rt), { key: 0 }, {
          center: _(() => [
            I(l.$slots, "navBarCenter", {}, void 0, !0)
          ]),
          default: _(() => [
            I(l.$slots, "navBarRight", {}, void 0, !0)
          ]),
          _: 3
        })) : E("", !0),
        g("div", null, [
          f(t).showSider ? (r(), C(f(It), {
            key: 0,
            "is-micro-app-single": e.isMicroAppSingle,
            class: "sidebar-container"
          }, null, 8, ["is-micro-app-single"])) : E("", !0),
          g("div", {
            class: M([{ hasTagsView: n.value }, "main-container"])
          }, [
            n.value ? (r(), C(f(Wt), { key: 0 })) : E("", !0),
            V(f(Ge), { "is-micro-app-single": e.isMicroAppSingle }, {
              default: _(() => [
                I(l.$slots, "default", {}, void 0, !0)
              ]),
              _: 3
            }, 8, ["is-micro-app-single"])
          ], 2)
        ])
      ], 2),
      i.value ? (r(), C(f(yt), { key: 0 }, {
        default: _(() => [
          V(f($t))
        ]),
        _: 1
      })) : E("", !0)
    ], 2));
  }
}), sa = /* @__PURE__ */ O(na, [["__scopeId", "data-v-94120d02"]]), ia = /* @__PURE__ */ x({
  __name: "ProLayout",
  props: {
    settings: {
      type: Object,
      default: () => ({})
    },
    isMicroAppSingle: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    const t = F(), a = e;
    t.$patch(a.settings);
    const s = b(() => {
      var o;
      return (o = t.locale) == null ? void 0 : o.name;
    });
    Ae("APP_LOCAL", s);
    const i = ne(), n = {
      path: "/redirect/:path(.*)",
      component: ft,
      meta: { hidden: !0 }
    };
    return i.addRoute(n), (o, l) => (r(), C(sa, { "is-micro-app-single": e.isMicroAppSingle }, {
      navBarRight: _(() => [
        I(o.$slots, "navRight")
      ]),
      navBarCenter: _(() => [
        I(o.$slots, "navCenter")
      ]),
      default: _(() => [
        I(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["is-micro-app-single"]));
  }
}), ha = {
  install: (e) => {
    e.component("ProLayout", ia), e.component("SvgIcon") || e.component("SvgIcon", me), oa(e);
  }
};
function oa(e) {
  e.component("ElDropdown", Ee), e.component("ElDropdownItem", Le), e.component("ElDropdownMenu", Pe), e.component("ElMenu", Te), e.component("ElMenuItem", ke), e.component("ElSubMenu", Ie), e.component("ElScrollbar", Be), e.component("ElBreadcrumb", Me), e.component("ElBreadcrumbItem", Oe);
}
export {
  da as IFrame,
  ia as ProLayout,
  ha as default,
  oa as elComponent,
  pe as en,
  he as useAppStore,
  Tt as useRoutesStore,
  F as useSettingsStore,
  Bt as useTagsViewStore,
  Ke as zhCn
};
