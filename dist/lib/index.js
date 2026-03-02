import { defineComponent as Ie, ref as K, computed as N, watch as Ne, nextTick as Fe, resolveComponent as W, openBlock as p, createElementBlock as h, createElementVNode as R, createVNode as P, withCtx as q, createBlock as X, mergeProps as We, Fragment as C, renderList as A, toDisplayString as $, createTextVNode as V, createCommentVNode as U, normalizeStyle as qe, normalizeClass as Be } from "vue";
const Z = (t) => {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}, z = (t) => {
  const e = String(t ?? "").trim(), o = e.match(/^(\d{2})\.(\d{2})\.(\d{4})$/), r = e.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!o && !r) return null;
  const s = Number(o ? o[3] : r[1]), l = Number(o ? o[2] : r[2]), c = Number(o ? o[1] : r[3]), g = new Date(s, l - 1, c);
  return g.setHours(0, 0, 0, 0), g.getFullYear() !== s || g.getMonth() !== l - 1 || g.getDate() !== c ? null : g;
}, me = (t) => {
  const e = Z(t), o = String(e.getDate()).padStart(2, "0"), r = String(e.getMonth() + 1).padStart(2, "0"), s = e.getFullYear();
  return `${o}.${r}.${s}`;
}, Pe = (t) => (Z(t).getDay() + 6) % 7, Ve = (t = "en-US") => {
  const e = new Intl.DateTimeFormat(t, { weekday: "long" }), o = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (r, s) => {
    const l = new Date(o);
    return l.setDate(o.getDate() + s), e.format(l);
  });
}, ze = (t, e, o = /* @__PURE__ */ new Date()) => {
  const r = Z(o), s = Pe(r), l = new Date(r);
  if (t === "last") {
    const g = (s - e + 7) % 7 || 7;
    return l.setDate(r.getDate() - g), l;
  }
  const c = (e - s + 7) % 7 || 7;
  return l.setDate(r.getDate() + c), l;
}, He = (t) => {
  const e = Z(t), o = (e.getDay() + 6) % 7, r = new Date(e);
  r.setDate(e.getDate() - o + 3);
  const s = r.getFullYear(), l = new Date(s, 0, 4), c = (l.getDay() + 6) % 7;
  return l.setDate(l.getDate() - c + 3), { weekNo: 1 + Math.round((r.getTime() - l.getTime()) / 6048e5), weekYear: s };
}, Ge = (t, e = "en-US") => {
  const o = z(t);
  if (!o) return "";
  const r = new Intl.DateTimeFormat(e, {
    weekday: "long"
  }).format(o), { weekNo: s, weekYear: l } = He(o);
  return `KW ${String(s).padStart(2, "0")}/${l} - ${r}`;
}, Y = (t) => String(t ?? "").replace(/[^0-9]/g, ""), _e = (t) => {
  const e = Y(t);
  return e ? e.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(t ?? "");
}, J = (t, e) => {
  if (e.accessor)
    return String(e.accessor(t) ?? "");
  const o = e.key;
  return String(t[o] ?? "");
}, Ke = (t, e) => {
  if (!e.length)
    return t.columns.filter((s) => s.searchable !== !1);
  const o = new Set(e), r = /* @__PURE__ */ new Set();
  return t.columns.forEach((s) => {
    o.has(s.key) && s.scopeGroup && r.add(s.scopeGroup);
  }), t.columns.filter((s) => !o.has(s.key) && !r.has(s.scopeGroup ?? "") ? !1 : s.searchable !== !1);
}, Ue = (t, e, o) => {
  const r = e.columns.find((s) => s.key === o);
  return r ? J(t, r) : String(t[o] ?? "");
}, ce = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ue = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"), ke = () => typeof globalThis > "u" || typeof globalThis.navigator > "u" || !Array.isArray(globalThis.navigator.languages) ? "en-US" : globalThis.navigator.languages.find((t) => String(t).toLowerCase().startsWith("en")) ?? "en-US", Ye = (t, e) => {
  const o = ue(t), r = e.map((s) => String(s || "").trim()).filter((s) => s.length > 0);
  return r.length ? r.reduce((s, l) => {
    const c = Y(l), k = c.length > 0 && c === String(l) ? c.split("").map((_) => ce(_)).join("[^0-9]*") : ce(ue(l)), a = new RegExp(k, "gi");
    return s.replace(a, (_) => `<mark>${_}</mark>`);
  }, o) : o;
}, je = (t) => ({
  fullTextTokens: t.filter((e) => e.type === "fulltext"),
  exactTokens: t.filter((e) => !["fulltext", "scope"].includes(e.type)),
  scopedColumnKeys: t.filter((e) => e.type === "scope" && e.key).map((e) => e.key)
}), Qe = (t) => t.type === "date_before" || t.type === "date_after" || t.type === "date_exact" || t.type === "date_relative", Xe = (t) => t.key ?? (t.type.startsWith("date_") || t.type === "date_relative" ? "date" : t.type), ne = (t, e, o) => {
  const { fullTextTokens: r, exactTokens: s, scopedColumnKeys: l } = je(o), c = Ke(e, l);
  return t.filter((g) => {
    for (const k of s) {
      const a = Xe(k), _ = e.columns.find((v) => v.key === a), y = _ ? J(g, _) : "";
      if (Qe(k)) {
        const v = z(y), M = z(k.rawTitle || k.title);
        if (!v || !M) return !1;
        const d = v.getTime(), b = M.getTime();
        if ((k.type === "date_before" || k.direction === "before") && !(d < b) || (k.type === "date_after" || k.direction === "after") && !(d > b) || (k.type === "date_exact" || k.direction === "on") && d !== b)
          return !1;
        continue;
      }
      if (_?.valueType === "number-like") {
        if (Y(y) !== Y(k.title))
          return !1;
        continue;
      }
      if (String(y).toLowerCase() !== String(k.title || "").toLowerCase())
        return !1;
    }
    for (const k of r) {
      const a = String(k.title || "").toLowerCase();
      if (!a) continue;
      if (!c.some(
        (y) => String(J(g, y)).toLowerCase().includes(a)
      )) return !1;
    }
    return !0;
  });
}, Je = 1, Ze = 300, et = 200, tt = 100, nt = 1e4, rt = 1e3, ot = 40, st = 50, at = 30, lt = 6, de = 3, it = (t, e) => `${t}|${e}`, fe = (t) => t.valueType === "number-like", ge = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ct = (t) => {
  const e = t.trim().toLowerCase();
  if (!e)
    return null;
  const o = e.startsWith("date ") ? e.slice(5).trim() : e, r = o.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
  if (r) {
    const l = String(r[1]).toLowerCase(), c = String(r[2] || "").toLowerCase() || null, g = String(r[3] || "").trim().toLowerCase();
    return g ? { direction: l, anchor: c, weekdayPart: g, needle: o } : null;
  }
  const s = o.match(/^(last|next)\s+(.+)$/i);
  if (s) {
    const l = String(s[1]).toLowerCase(), c = String(s[2] || "").trim().toLowerCase();
    return c ? { direction: "on", anchor: l, weekdayPart: c, needle: o } : null;
  }
  return null;
}, ut = (t, e) => t === "before" ? e === "last" ? "before last" : "before next" : t === "after" ? e === "last" ? "after last" : "after next" : e === "last" ? "on last" : "on next", dt = (t) => t === "before" ? "date before" : t === "after" ? "date after" : "date exact", ft = (t, e, o) => {
  if (String(o || "").trim().length < 4 || e.some((y) => y.type === "date_relative"))
    return [];
  const r = ct(o);
  if (!r)
    return [];
  const s = t.locale ?? ke(), l = Ve(s).map((y, v) => ({
    weekday: y,
    weekdayIndexMonday: v,
    weekdayLower: y.toLowerCase()
  })).filter((y) => y.weekdayLower.startsWith(r.weekdayPart)), c = r.anchor ? [r.anchor] : ["last", "next"], g = l.slice(), k = [], a = /* @__PURE__ */ new Set();
  g.forEach((y) => {
    c.forEach((v) => {
      const M = ze(v, y.weekdayIndexMonday), d = me(M), E = `${ut(r.direction, v)} ${y.weekday}`;
      a.has(E) || (a.add(E), k.push({
        uid: `date_relative|${r.direction}|${v}|${y.weekdayIndexMonday}|${d}`,
        type: "date_relative",
        title: E,
        rawTitle: d,
        category: dt(r.direction),
        icon: "event_repeat",
        direction: r.direction,
        anchor: v
      }));
    });
  });
  const _ = (y) => {
    const v = y.toLowerCase();
    return v === r.needle ? 3 : v.startsWith(r.needle) ? 2 : v.includes(r.needle) ? 1 : 0;
  };
  return k.sort((y, v) => _(v.title) - _(y.title)).slice(0, t.maxWeekdaySuggestions ?? 4);
}, gt = (t, e) => {
  const o = z(e);
  if (!o)
    return [];
  const r = new Set(t.map((c) => c.type)), s = me(o);
  return [
    { type: "date_before", category: "date before", icon: "event_busy" },
    { type: "date_after", category: "date after", icon: "event_available" },
    { type: "date_exact", category: "date exact", icon: "event" }
  ].filter((c) => !r.has(c.type)).map((c) => ({
    uid: `${c.type}|${s}`,
    type: c.type,
    title: s,
    rawTitle: s,
    category: c.category,
    icon: c.icon
  }));
}, pt = (t, e) => {
  if (!e)
    return 0;
  const o = t.indexOf(e);
  return o < 0 ? -1 : o === 0 ? Ze : o + e.length === t.length ? tt : et;
}, yt = (t, e) => {
  if (!e)
    return 0;
  const o = String(t || "").split(/\s+/).filter((s) => s.length > 0);
  let r = -1;
  return o.forEach((s, l) => {
    const c = pt(s, e);
    if (c < 0)
      return;
    const g = nt - l * rt + c;
    g > r && (r = g);
  }), r;
}, Se = (t, e, o) => {
  if (!o)
    return 1;
  const r = String(t || "").toLowerCase(), s = yt(r, o);
  if (s < 0)
    return -1;
  const c = String(e || "").toLowerCase().includes(o) ? ot : 0, g = r === o ? st : 0, k = Math.min(
    at,
    Math.floor(r.length / lt)
  );
  return s + c + g - k;
}, ht = (t, e) => {
  const o = String(t ?? "").toLowerCase();
  if (!o || !e)
    return 0;
  const r = Y(e), l = r.length > 0 && r === String(e) ? r.split("").map((k) => ge(k)).join("[^0-9]*") : ge(String(e)), c = new RegExp(l, "gi"), g = o.match(c);
  return g ? g.length : 0;
}, mt = (t, e, o, r) => {
  if (!r.length)
    return 0;
  const s = [o];
  return t.reduce((l, c) => {
    const g = r.reduce((k, a) => {
      const _ = s.reduce((y, v) => y + ht(Ue(c, e, v), a), 0);
      return k + _;
    }, 0);
    return l + g;
  }, 0);
}, pe = (t, e, o, r) => {
  const s = new Set(
    o.map((d) => d.type).filter((d) => d && !["fulltext", "scope"].includes(d))
  ), l = [], c = /* @__PURE__ */ new Set(), g = ne(t, e, o);
  e.columns.filter((d) => d.suggestionEnabled !== !1).forEach((d) => {
    s.has(d.key) || new Set(g.map((b) => J(b, d))).forEach((b) => {
      const E = String(b ?? "");
      if (!E) return;
      const H = it(d.key, E);
      if (c.has(H)) return;
      c.add(H);
      const F = fe(d) ? _e(E) : E, j = fe(d) ? E : F, G = Se(j, d.label, r);
      G < 0 && r.length > 0 || l.push({
        uid: H,
        type: d.key,
        key: d.key,
        title: F,
        rawTitle: E,
        category: d.label,
        icon: d.icon,
        _score: G,
        _columnType: d.key
      });
    });
  });
  const k = (d, b) => b._score !== d._score ? b._score - d._score : d.title.localeCompare(b.title), a = l.slice().sort(k), _ = [], y = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set();
  a.slice(0, de).forEach((d) => {
    y.has(d.uid) || (y.add(d.uid), v.add(d._columnType), _.push(d));
  });
  const M = a.slice(de);
  return M.forEach((d) => {
    y.has(d.uid) || v.has(d._columnType) || (y.add(d.uid), v.add(d._columnType), _.push(d));
  }), M.forEach((d) => {
    y.has(d.uid) || (y.add(d.uid), _.push(d));
  }), _.map((d) => {
    const b = { ...d };
    return delete b._score, delete b._columnType, b;
  });
}, _t = (t, e, o, r) => {
  const s = o.filter((a) => a.type === "fulltext").map((a) => String(a.title || "").toLowerCase()).filter((a) => a.length > 0), l = o.filter((a) => !["fulltext", "scope"].includes(a.type)), c = ne(t, e, l), g = new Set(
    o.filter((a) => a.type === "scope" && a.key).map((a) => a.key)
  );
  return e.columns.filter((a) => a.searchable !== !1).filter((a) => !g.has(a.key)).map((a) => {
    const _ = mt(c, e, a.key, s), y = r.length === 0 ? 1 : Se(a.label, "Fulltext scope", r);
    return {
      uid: `scope|${a.key}`,
      type: "scope",
      key: a.key,
      title: a.label,
      category: "Fulltext scope",
      icon: a.icon,
      matchCount: _,
      _score: y
    };
  }).filter((a) => a.matchCount > 0).filter((a) => r.length === 0 || a._score >= 0).sort((a, _) => _.matchCount !== a.matchCount ? _.matchCount - a.matchCount : _._score !== a._score ? _._score - a._score : a.title.localeCompare(_.title)).map((a) => {
    const _ = { ...a };
    return delete _._score, _;
  });
}, ye = (...t) => {
  const e = [], o = /* @__PURE__ */ new Set();
  return t.flat().forEach((r) => {
    o.has(r.uid) || (o.add(r.uid), e.push(r));
  }), e;
}, kt = (t, e, o, r) => {
  const s = String(r || "").trim().toLowerCase(), l = e.maxSuggestions ?? 7, c = gt(o, r), g = ft(e, o, r);
  if (o.some((a) => a.type === "fulltext")) {
    const a = _t(t, e, o, s), _ = pe(t, e, o, s);
    return ye(c, g, a, _).slice(0, l);
  }
  return c.length > 0 || g.length > 0 ? ye(c, g).slice(0, l) : s.length < Je ? [] : pe(t, e, o, s).slice(0, l);
}, St = () => ke(), Bt = (t, e) => Ye(t, e), vt = (t, e, o) => ne(t, e, o), he = (t, e, o, r) => kt(t, e, o, r), xt = { class: "table-suggest" }, wt = { class: "search-wrap" }, Tt = { key: 0 }, Ct = { key: 1 }, bt = { class: "data-table" }, Dt = ["onClick"], $t = { class: "sort-icon-slot" }, Et = { key: 0 }, Lt = ["title"], Rt = { key: 0 }, Ot = ["title"], Mt = { key: 0 }, At = ["title"], It = { key: 0 }, Nt = /* @__PURE__ */ Ie({
  __name: "TableSuggest",
  props: {
    items: {},
    annotations: {}
  },
  setup(t) {
    const e = t, o = K(""), r = K([]), l = K({ key: e.annotations.columns.find((n) => !n.renderAsSublineOf && n.sortable !== !1)?.key ?? "", asc: !0 }), c = K([]), g = K(null), k = N(() => e.annotations.locale ?? St()), a = N(
      () => new Intl.Collator(k.value, { numeric: !0, sensitivity: "base" })
    ), _ = N(
      () => he(e.items, e.annotations, r.value, o.value)
    ), y = N(
      () => e.annotations.columns.filter((n) => !n.renderAsSublineOf)
    ), v = N(() => {
      const n = /* @__PURE__ */ new Map();
      return e.annotations.columns.forEach((i) => {
        const u = i.renderAsSublineOf;
        if (!u) return;
        const m = n.get(u) ?? [];
        n.set(u, [...m, i]);
      }), n;
    }), M = N(() => vt(e.items, e.annotations, r.value)), d = N(() => {
      const n = e.annotations.columns.find((u) => u.key === l.value.key), i = M.value.slice();
      return !n || n.sortable === !1 || i.sort((u, m) => {
        const x = (L) => n.accessor ? String(n.accessor(L) ?? "") : String(L[n.key] ?? ""), w = x(u), O = x(m);
        if (n.key === "date") {
          const L = z(w), B = z(O);
          if (L && B) {
            const f = L.getTime(), T = B.getTime();
            return l.value.asc ? f - T : T - f;
          }
        }
        return l.value.asc ? a.value.compare(w, O) : a.value.compare(O, w);
      }), i;
    }), b = N(
      () => r.value.filter((n) => n.type === "fulltext").map((n) => n.title)
    ), E = N(
      () => r.value.filter((n) => n.type === "scope" && n.key).map((n) => n.key)
    ), H = (n) => {
      if (!b.value.length) return !1;
      if (!E.value.length) return !0;
      const i = new Set(E.value), u = e.annotations.columns.filter((w) => i.has(w.key)), m = new Set(u.map((w) => w.scopeGroup).filter(Boolean));
      if (i.has(n)) return !0;
      const x = e.annotations.columns.find((w) => w.key === n);
      return x?.scopeGroup ? m.has(x.scopeGroup) : !1;
    }, F = (n) => e.annotations.columns.find((i) => i.key === n), j = (n) => v.value.get(n) ?? [], G = (n) => String(n).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), xe = (n) => String(n || "").replace(/[^0-9]/g, ""), we = (n) => {
      const i = xe(n);
      return i.length > 0 && i === n ? i.split("").map((m) => G(m)).join("[^0-9]*") : G(n);
    }, Te = (n) => {
      if (!n.length) return [];
      const i = n.slice().sort((m, x) => m.start - x.start), u = [i[0]];
      return i.slice(1).forEach((m) => {
        const x = u[u.length - 1];
        if (m.start <= x.end) {
          x.end = Math.max(x.end, m.end);
          return;
        }
        u.push({ ...m });
      }), u;
    }, re = (n, i) => {
      const u = String(n ?? ""), m = Array.from(
        new Set(i.map((S) => String(S || "").trim()).filter((S) => S.length > 0))
      );
      if (!m.length)
        return [{ text: u, highlighted: !1 }];
      const x = m.slice().sort((S, D) => D.length - S.length).map((S) => we(S)).join("|"), w = new RegExp(x, "gi"), O = [];
      let L = w.exec(u);
      for (; L; ) {
        const S = L[0] ?? "";
        S.length > 0 && O.push({ start: L.index, end: L.index + S.length }), S.length === 0 && (w.lastIndex += 1), L = w.exec(u);
      }
      if (!O.length)
        return [{ text: u, highlighted: !1 }];
      const B = Te(O), f = [];
      let T = 0;
      return B.forEach((S) => {
        S.start > T && f.push({ text: u.slice(T, S.start), highlighted: !1 }), f.push({ text: u.slice(S.start, S.end), highlighted: !0 }), T = S.end;
      }), T < u.length && f.push({ text: u.slice(T), highlighted: !1 }), f;
    }, oe = (n, i) => {
      const u = F(i), m = (w) => u?.valueType === "number-like" ? _e(w) : String(w ?? "");
      return u?.accessor ? m(u.accessor(n)) : m(n[i]);
    }, se = (n) => {
      if (r.value.some((i) => i.uid === n.uid)) {
        o.value = "", c.value = [];
        return;
      }
      r.value = [...r.value, n], o.value = "", c.value = [];
    };
    Ne(r, (n) => {
      const i = n.filter(
        (m, x, w) => w.findIndex((O) => O.uid === m.uid) === x
      );
      if (i.length !== n.length) {
        r.value = i;
        return;
      }
      if (!n.some((m) => m.type === "fulltext") && n.some((m) => m.type === "scope")) {
        r.value = n.filter((m) => m.type !== "scope");
        return;
      }
      o.value = "", c.value = [], Fe(() => {
        g.value?.updateInputValue?.("", !0, !0), g.value?.hidePopup?.();
      });
    });
    const Ce = (n) => {
      const i = String(n || "").trim();
      if (!i) return;
      const u = i.toLowerCase(), m = he(
        e.items,
        e.annotations,
        r.value,
        i
      ).find((x) => String(x.type).startsWith("date_") ? String(x.title || "").trim().toLowerCase() === u : !1);
      if (m) {
        se(m);
        return;
      }
      se({
        uid: `fulltext|${i}`,
        type: "fulltext",
        title: i,
        category: "Fulltext",
        icon: "search"
      });
    }, be = (n) => {
      const u = {
        date_before: "Date before",
        date_after: "Date after",
        date_exact: "Date exact",
        date_relative: "Date",
        fulltext: "Full-Text",
        scope: "In Column"
      }[n.type];
      if (u) return u;
      const m = n.key ?? n.type;
      return F(m)?.label ?? n.category ?? n.type;
    }, ee = {
      fulltext: "teal-9",
      scope: "green-8",
      subcolumn: "light-blue-9"
    }, De = (n) => {
      if (ee[n.type]) return ee[n.type];
      const i = n.key ?? n.type;
      if (F(i)?.renderAsSublineOf)
        return ee.subcolumn;
    }, ae = (n, i, u) => i?.[n.type] ?? De(n) ?? u ?? e.annotations.tokenDefaultColor ?? "indigo-9", te = (n) => ae(n, e.annotations.tokenColorByType), $e = (n) => ae(n, e.annotations.optionBadgeColorByType, te(n)), Ee = (n, i) => {
      Ce(n), i(null);
    }, Le = (n, i) => {
      i(() => {
        o.value = n, c.value = _.value.filter((u) => u.type !== "fulltext");
      });
    }, le = (n, i) => {
      const u = F(i);
      return u?.tooltipHint ? typeof u.tooltipHint == "function" ? u.tooltipHint(n) : u.tooltipHint : "";
    }, Re = (n) => {
      if (F(n)?.sortable !== !1) {
        if (l.value.key !== n) {
          l.value = { key: n, asc: !0 };
          return;
        }
        l.value = { key: n, asc: !l.value.asc };
      }
    }, ie = (n) => l.value.key !== n ? null : l.value.asc ? "arrow_upward" : "arrow_downward", Q = (n, i) => {
      const u = oe(n, i);
      return H(i) ? re(u, b.value) : [{ text: u, highlighted: !1 }];
    }, Oe = (n) => re(n, [o.value]), Me = (n) => {
      const i = oe(n, "date");
      return Ge(i, k.value);
    };
    return (n, i) => {
      const u = W("q-avatar"), m = W("q-chip"), x = W("q-item-label"), w = W("q-icon"), O = W("q-item-section"), L = W("q-item"), B = W("q-select");
      return p(), h("div", xt, [
        R("div", wt, [
          P(B, {
            ref_key: "qSelectRef",
            ref: g,
            modelValue: r.value,
            "onUpdate:modelValue": i[0] || (i[0] = (f) => r.value = f),
            class: "search-field",
            "input-class": "search-input",
            label: "Search",
            "use-input": "",
            "use-chips": "",
            multiple: "",
            "input-debounce": "0",
            "option-label": "title",
            "option-value": "uid",
            options: c.value,
            onNewValue: Ee,
            onFilter: Le
          }, {
            "selected-item": q((f) => [
              P(m, {
                removable: "",
                dense: "",
                class: "chip",
                color: te(f.opt),
                "text-color": "white",
                onRemove: (T) => f.removeAtIndex(f.index)
              }, {
                default: q(() => [
                  f.opt.icon ? (p(), X(u, {
                    key: 0,
                    color: "white",
                    "text-color": te(f.opt),
                    icon: f.opt.icon
                  }, null, 8, ["text-color", "icon"])) : U("", !0),
                  R("span", null, $(be(f.opt)) + ":", 1),
                  R("span", null, $(f.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: q((f) => [
              f.opt.type !== "fulltext" ? (p(), X(L, We({ key: 0 }, f.itemProps, { class: "suggest-item" }), {
                default: q(() => [
                  P(O, null, {
                    default: q(() => [
                      P(x, { class: "suggest-title" }, {
                        default: q(() => [
                          (p(!0), h(C, null, A(Oe(f.opt.title), (T, S) => (p(), h(C, {
                            key: `${f.opt.uid}-title-${S}`
                          }, [
                            T.highlighted ? (p(), h("mark", Tt, $(T.text), 1)) : (p(), h(C, { key: 1 }, [
                              V($(T.text), 1)
                            ], 64))
                          ], 64))), 128))
                        ]),
                        _: 2
                      }, 1024),
                      P(x, {
                        caption: "",
                        class: "suggest-meta"
                      }, {
                        default: q(() => [
                          f.opt.icon ? (p(), X(w, {
                            key: 0,
                            name: f.opt.icon,
                            color: $e(f.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : U("", !0),
                          V(" " + $(f.opt.category), 1),
                          (f.opt.matchCount ?? 0) > 0 ? (p(), h("span", Ct, " - " + $(f.opt.matchCount) + " x", 1)) : U("", !0)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1040)) : U("", !0)
            ]),
            _: 1
          }, 8, ["modelValue", "options"])
        ]),
        R("table", bt, [
          R("colgroup", null, [
            (p(!0), h(C, null, A(y.value, (f) => (p(), h("col", {
              key: `col-${f.key}`,
              style: qe(f.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          R("thead", null, [
            R("tr", null, [
              (p(!0), h(C, null, A(y.value, (f) => (p(), h("th", {
                key: f.key,
                onClick: (T) => Re(f.key)
              }, [
                f.icon ? (p(), X(w, {
                  key: 0,
                  name: f.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : U("", !0),
                R("span", null, $(f.label), 1),
                R("span", $t, [
                  P(w, {
                    name: ie(f.key) ?? "arrow_upward",
                    size: "14px",
                    class: Be(["sort-icon", { "sort-icon--hidden": !ie(f.key) }])
                  }, null, 8, ["name", "class"])
                ])
              ], 8, Dt))), 128))
            ])
          ]),
          R("tbody", null, [
            (p(!0), h(C, null, A(d.value, (f, T) => (p(), h("tr", { key: T }, [
              (p(!0), h(C, null, A(y.value, (S) => (p(), h("td", {
                key: S.key
              }, [
                j(S.key).length > 0 ? (p(), h(C, { key: 0 }, [
                  R("div", null, [
                    (p(!0), h(C, null, A(Q(f, S.key), (D, I) => (p(), h(C, {
                      key: `${S.key}-${T}-${I}`
                    }, [
                      D.highlighted ? (p(), h("mark", Et, $(D.text), 1)) : (p(), h(C, { key: 1 }, [
                        V($(D.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (p(!0), h(C, null, A(j(S.key), (D) => (p(), h("span", {
                    key: `${S.key}-${D.key}-${T}`,
                    class: "subline-value",
                    title: le(f, D.key)
                  }, [
                    R("span", null, [
                      (p(!0), h(C, null, A(Q(f, D.key), (I, Ae) => (p(), h(C, {
                        key: `${D.key}-${T}-${Ae}`
                      }, [
                        I.highlighted ? (p(), h("mark", Rt, $(I.text), 1)) : (p(), h(C, { key: 1 }, [
                          V($(I.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, Lt))), 128))
                ], 64)) : S.key === "date" ? (p(), h("span", {
                  key: 1,
                  title: Me(f)
                }, [
                  (p(!0), h(C, null, A(Q(f, S.key), (D, I) => (p(), h(C, {
                    key: `date-${T}-${I}`
                  }, [
                    D.highlighted ? (p(), h("mark", Mt, $(D.text), 1)) : (p(), h(C, { key: 1 }, [
                      V($(D.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, Ot)) : (p(), h("span", {
                  key: 2,
                  title: le(f, S.key)
                }, [
                  (p(!0), h(C, null, A(Q(f, S.key), (D, I) => (p(), h(C, {
                    key: `${S.key}-${T}-${I}`
                  }, [
                    D.highlighted ? (p(), h("mark", It, $(D.text), 1)) : (p(), h(C, { key: 1 }, [
                      V($(D.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, At))
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]);
    };
  }
}), Ft = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [r, s] of e)
    o[r] = s;
  return o;
}, Wt = /* @__PURE__ */ Ft(Nt, [["__scopeId", "data-v-41dbeb5c"]]), Pt = {
  install(t) {
    t.component("TableSuggest", Wt);
  }
}, ve = /* @__PURE__ */ new WeakMap(), Vt = (t, e) => {
  ve.set(t, e);
}, zt = (t) => {
  const e = ve.get(t);
  if (!e)
    throw new Error(`No model annotations registered for ${t.name}`);
  return e;
};
export {
  Wt as TableSuggest,
  Pt as TableSuggestPlugin,
  he as buildSuggestions,
  Pt as default,
  Vt as defineModelAnnotations,
  vt as filterItems,
  me as formatDate,
  ze as getAnchorWeekdayDate,
  Ge as getDateMouseoverLabel,
  He as getIsoWeekInfo,
  Ve as getLocalizedWeekdaysMondayFirst,
  zt as getModelAnnotations,
  Pe as getMondayIndexFromDate,
  Bt as highlightText,
  z as parseDateInput,
  Pt as plugin,
  St as resolveEnglishLocale,
  Z as startOfDay
};
