import { defineComponent as Ie, ref as K, computed as N, watch as Ne, nextTick as Fe, resolveComponent as W, openBlock as y, createElementBlock as h, createElementVNode as L, createVNode as V, withCtx as q, createBlock as X, mergeProps as We, Fragment as C, renderList as M, toDisplayString as $, createTextVNode as P, createCommentVNode as U, normalizeStyle as qe, normalizeClass as Be } from "vue";
const Z = (t) => {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}, z = (t) => {
  const e = String(t ?? "").trim(), r = e.match(/^(\d{2})\.(\d{2})\.(\d{4})$/), n = e.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!r && !n) return null;
  const s = Number(r ? r[3] : n[1]), l = Number(r ? r[2] : n[2]), c = Number(r ? r[1] : n[3]), p = new Date(s, l - 1, c);
  return p.setHours(0, 0, 0, 0), p.getFullYear() !== s || p.getMonth() !== l - 1 || p.getDate() !== c ? null : p;
}, me = (t) => {
  const e = Z(t), r = String(e.getDate()).padStart(2, "0"), n = String(e.getMonth() + 1).padStart(2, "0"), s = e.getFullYear();
  return `${r}.${n}.${s}`;
}, Ve = (t) => (Z(t).getDay() + 6) % 7, Pe = (t = "en-US") => {
  const e = new Intl.DateTimeFormat(t, { weekday: "long" }), r = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (n, s) => {
    const l = new Date(r);
    return l.setDate(r.getDate() + s), e.format(l);
  });
}, ze = (t, e, r = /* @__PURE__ */ new Date()) => {
  const n = Z(r), s = Ve(n), l = new Date(n);
  if (t === "last") {
    const p = (s - e + 7) % 7 || 7;
    return l.setDate(n.getDate() - p), l;
  }
  const c = (e - s + 7) % 7 || 7;
  return l.setDate(n.getDate() + c), l;
}, He = (t) => {
  const e = Z(t), r = (e.getDay() + 6) % 7, n = new Date(e);
  n.setDate(e.getDate() - r + 3);
  const s = n.getFullYear(), l = new Date(s, 0, 4), c = (l.getDay() + 6) % 7;
  return l.setDate(l.getDate() - c + 3), { weekNo: 1 + Math.round((n.getTime() - l.getTime()) / 6048e5), weekYear: s };
}, Ge = (t, e = "en-US") => {
  const r = z(t);
  if (!r) return "";
  const n = new Intl.DateTimeFormat(e, {
    weekday: "long"
  }).format(r), { weekNo: s, weekYear: l } = He(r);
  return `KW ${String(s).padStart(2, "0")}/${l} - ${n}`;
}, Y = (t) => String(t ?? "").replace(/[^0-9]/g, ""), _e = (t) => {
  const e = Y(t);
  return e ? e.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(t ?? "");
}, J = (t, e) => {
  if (e.accessor)
    return String(e.accessor(t) ?? "");
  const r = e.key;
  return String(t[r] ?? "");
}, Ke = (t, e) => {
  if (!e.length)
    return t.columns.filter((s) => s.searchable !== !1);
  const r = new Set(e), n = /* @__PURE__ */ new Set();
  return t.columns.forEach((s) => {
    r.has(s.key) && s.scopeGroup && n.add(s.scopeGroup);
  }), t.columns.filter((s) => !r.has(s.key) && !n.has(s.scopeGroup ?? "") ? !1 : s.searchable !== !1);
}, Ue = (t, e, r) => {
  const n = e.columns.find((s) => s.key === r);
  return n ? J(t, n) : String(t[r] ?? "");
}, ce = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ue = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"), ke = () => typeof globalThis > "u" || typeof globalThis.navigator > "u" || !Array.isArray(globalThis.navigator.languages) ? "en-US" : globalThis.navigator.languages.find((t) => String(t).toLowerCase().startsWith("en")) ?? "en-US", Ye = (t, e) => {
  const r = ue(t), n = e.map((s) => String(s || "").trim()).filter((s) => s.length > 0);
  return n.length ? n.reduce((s, l) => {
    const c = Y(l), k = c.length > 0 && c === String(l) ? c.split("").map((u) => ce(u)).join("[^0-9]*") : ce(ue(l)), a = new RegExp(k, "gi");
    return s.replace(a, (u) => `<mark>${u}</mark>`);
  }, r) : r;
}, je = (t) => ({
  fullTextTokens: t.filter((e) => e.type === "fulltext"),
  exactTokens: t.filter((e) => !["fulltext", "scope"].includes(e.type)),
  scopedColumnKeys: t.filter((e) => e.type === "scope" && e.key).map((e) => e.key)
}), Qe = (t) => t.type === "date_before" || t.type === "date_after" || t.type === "date_exact" || t.type === "date_relative", Xe = (t) => t.key ?? (t.type.startsWith("date_") || t.type === "date_relative" ? "date" : t.type), ne = (t, e, r) => {
  const { fullTextTokens: n, exactTokens: s, scopedColumnKeys: l } = je(r), c = Ke(e, l);
  return t.filter((p) => {
    for (const k of s) {
      const a = Xe(k), u = e.columns.find((D) => D.key === a), _ = u ? J(p, u) : "";
      if (Qe(k)) {
        const D = z(_), R = z(k.rawTitle || k.title);
        if (!D || !R) return !1;
        const g = D.getTime(), x = R.getTime();
        if ((k.type === "date_before" || k.direction === "before") && !(g < x) || (k.type === "date_after" || k.direction === "after") && !(g > x) || (k.type === "date_exact" || k.direction === "on") && g !== x)
          return !1;
        continue;
      }
      if (u?.valueType === "number-like") {
        if (Y(_) !== Y(k.title))
          return !1;
        continue;
      }
      if (String(_).toLowerCase() !== String(k.title || "").toLowerCase())
        return !1;
    }
    for (const k of n) {
      const a = String(k.title || "").toLowerCase();
      if (!a) continue;
      if (!c.some(
        (_) => String(J(p, _)).toLowerCase().includes(a)
      )) return !1;
    }
    return !0;
  });
}, Je = 1, Ze = 300, et = 200, tt = 100, nt = 1e4, ot = 1e3, rt = 40, st = 50, at = 30, lt = 6, de = 3, it = (t, e) => `${t}|${e}`, fe = (t) => t.valueType === "number-like", ge = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ct = (t) => {
  const e = t.trim().toLowerCase();
  if (!e) return null;
  const r = e.startsWith("date ") ? e.slice(5).trim() : e, n = r.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
  if (n) {
    const l = String(n[1]).toLowerCase(), c = String(n[2] || "").toLowerCase() || null, p = String(n[3] || "").trim().toLowerCase();
    return p ? { direction: l, anchor: c, weekdayPart: p, needle: r } : null;
  }
  const s = r.match(/^(last|next)\s+(.+)$/i);
  if (s) {
    const l = String(s[1]).toLowerCase(), c = String(s[2] || "").trim().toLowerCase();
    return c ? { direction: "on", anchor: l, weekdayPart: c, needle: r } : null;
  }
  return null;
}, ut = (t, e, r) => {
  if (String(r || "").trim().length < 4 || e.some((u) => u.type === "date_relative")) return [];
  const n = ct(r);
  if (!n) return [];
  const s = t.locale ?? ke(), l = Pe(s).map((u, _) => ({
    weekday: u,
    weekdayIndexMonday: _,
    weekdayLower: u.toLowerCase()
  })).filter((u) => u.weekdayLower.startsWith(n.weekdayPart)), c = n.anchor ? [n.anchor] : n.direction === "before" ? ["last", "next"] : ["next", "last"], p = [], k = /* @__PURE__ */ new Set();
  c.forEach((u) => {
    l.forEach((_) => {
      const D = ze(u, _.weekdayIndexMonday), R = me(D), x = `${n.direction === "before" ? u === "last" ? "before last" : "before next" : n.direction === "after" ? u === "last" ? "after last" : "after next" : u === "last" ? "on last" : "on next"} ${_.weekday}`;
      k.has(x) || (k.add(x), p.push({
        uid: `date_relative|${n.direction}|${u}|${_.weekdayIndexMonday}|${R}`,
        type: "date_relative",
        title: x,
        rawTitle: R,
        category: n.direction === "before" ? "date before" : n.direction === "after" ? "date after" : "date exact",
        icon: "event_repeat",
        direction: n.direction,
        anchor: u
      }));
    });
  });
  const a = (u) => {
    const _ = u.toLowerCase();
    return _ === n.needle ? 3 : _.startsWith(n.needle) ? 2 : _.includes(n.needle) ? 1 : 0;
  };
  return p.sort((u, _) => {
    const D = a(_.title) - a(u.title);
    return D !== 0 ? D : u.title.localeCompare(_.title);
  }).slice(0, t.maxWeekdaySuggestions ?? 3);
}, dt = (t, e) => {
  const r = z(e);
  if (!r) return [];
  const n = new Set(t.map((c) => c.type)), s = me(r);
  return [
    { type: "date_before", category: "date before", icon: "event_busy" },
    { type: "date_after", category: "date after", icon: "event_available" },
    { type: "date_exact", category: "date exact", icon: "event" }
  ].filter((c) => !n.has(c.type)).map((c) => ({
    uid: `${c.type}|${s}`,
    type: c.type,
    title: s,
    rawTitle: s,
    category: c.category,
    icon: c.icon
  }));
}, ft = (t, e) => {
  if (!e) return 0;
  const r = t.indexOf(e);
  return r < 0 ? -1 : r === 0 ? Ze : r + e.length === t.length ? tt : et;
}, gt = (t, e) => {
  if (!e) return 0;
  const r = String(t || "").split(/\s+/).filter((s) => s.length > 0);
  let n = -1;
  return r.forEach((s, l) => {
    const c = ft(s, e);
    if (c < 0) return;
    const p = nt - l * ot + c;
    p > n && (n = p);
  }), n;
}, Se = (t, e, r) => {
  if (!r) return 1;
  const n = String(t || "").toLowerCase(), s = gt(n, r);
  if (s < 0) return -1;
  const c = String(e || "").toLowerCase().includes(r) ? rt : 0, p = n === r ? st : 0, k = Math.min(
    at,
    Math.floor(n.length / lt)
  );
  return s + c + p - k;
}, pt = (t, e) => {
  const r = String(t ?? "").toLowerCase();
  if (!r || !e) return 0;
  const n = Y(e), l = n.length > 0 && n === String(e) ? n.split("").map((k) => ge(k)).join("[^0-9]*") : ge(String(e)), c = new RegExp(l, "gi"), p = r.match(c);
  return p ? p.length : 0;
}, yt = (t, e, r, n) => {
  if (!n.length) return 0;
  const s = [r];
  return t.reduce((l, c) => {
    const p = n.reduce((k, a) => {
      const u = s.reduce((_, D) => _ + pt(Ue(c, e, D), a), 0);
      return k + u;
    }, 0);
    return l + p;
  }, 0);
}, pe = (t, e, r, n) => {
  const s = new Set(
    r.map((g) => g.type).filter((g) => g && !["fulltext", "scope"].includes(g))
  ), l = [], c = /* @__PURE__ */ new Set(), p = ne(t, e, r);
  e.columns.filter((g) => g.suggestionEnabled !== !1).forEach((g) => {
    s.has(g.key) || new Set(p.map((x) => J(x, g))).forEach((x) => {
      const A = String(x ?? "");
      if (!A) return;
      const H = it(g.key, A);
      if (c.has(H)) return;
      c.add(H);
      const F = fe(g) ? _e(A) : A, j = fe(g) ? A : F, G = Se(j, g.label, n);
      G < 0 && n.length > 0 || l.push({
        uid: H,
        type: g.key,
        key: g.key,
        title: F,
        rawTitle: A,
        category: g.label,
        icon: g.icon,
        _score: G,
        _columnType: g.key
      });
    });
  });
  const k = (g, x) => x._score !== g._score ? x._score - g._score : g.title.localeCompare(x.title), a = l.slice().sort(k), u = [], _ = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Set();
  a.slice(0, de).forEach((g) => {
    _.has(g.uid) || (_.add(g.uid), D.add(g._columnType), u.push(g));
  });
  const R = a.slice(de);
  return R.forEach((g) => {
    _.has(g.uid) || D.has(g._columnType) || (_.add(g.uid), D.add(g._columnType), u.push(g));
  }), R.forEach((g) => {
    _.has(g.uid) || (_.add(g.uid), u.push(g));
  }), u.map((g) => {
    const x = { ...g };
    return delete x._score, delete x._columnType, x;
  });
}, ht = (t, e, r, n) => {
  const s = r.filter((a) => a.type === "fulltext").map((a) => String(a.title || "").toLowerCase()).filter((a) => a.length > 0), l = r.filter((a) => !["fulltext", "scope"].includes(a.type)), c = ne(t, e, l), p = new Set(
    r.filter((a) => a.type === "scope" && a.key).map((a) => a.key)
  );
  return e.columns.filter((a) => a.searchable !== !1).filter((a) => !p.has(a.key)).map((a) => {
    const u = yt(c, e, a.key, s), _ = n.length === 0 ? 1 : Se(a.label, "Fulltext scope", n);
    return {
      uid: `scope|${a.key}`,
      type: "scope",
      key: a.key,
      title: a.label,
      category: "Fulltext scope",
      icon: a.icon,
      matchCount: u,
      _score: _
    };
  }).filter((a) => a.matchCount > 0).filter((a) => n.length === 0 || a._score >= 0).sort((a, u) => u.matchCount !== a.matchCount ? u.matchCount - a.matchCount : u._score !== a._score ? u._score - a._score : a.title.localeCompare(u.title)).map((a) => {
    const u = { ...a };
    return delete u._score, u;
  });
}, ye = (...t) => {
  const e = [], r = /* @__PURE__ */ new Set();
  return t.flat().forEach((n) => {
    r.has(n.uid) || (r.add(n.uid), e.push(n));
  }), e;
}, mt = (t, e, r, n) => {
  const s = String(n || "").trim().toLowerCase(), l = e.maxSuggestions ?? 7, c = dt(r, n), p = ut(e, r, n);
  if (r.some((a) => a.type === "fulltext")) {
    const a = ht(t, e, r, s), u = pe(t, e, r, s);
    return ye(c, p, a, u).slice(0, l);
  }
  return c.length > 0 || p.length > 0 ? ye(c, p).slice(0, l) : s.length < Je ? [] : pe(t, e, r, s).slice(0, l);
}, _t = () => ke(), Wt = (t, e) => Ye(t, e), kt = (t, e, r) => ne(t, e, r), he = (t, e, r, n) => mt(t, e, r, n), St = { class: "table-suggest" }, vt = { class: "search-wrap" }, xt = { key: 0 }, wt = { key: 1 }, Tt = { class: "data-table" }, Ct = ["onClick"], bt = { class: "sort-icon-slot" }, Dt = { key: 0 }, $t = ["title"], Et = { key: 0 }, Lt = ["title"], Ot = { key: 0 }, Rt = ["title"], Mt = { key: 0 }, At = /* @__PURE__ */ Ie({
  __name: "TableSuggest",
  props: {
    items: {},
    annotations: {}
  },
  setup(t) {
    const e = t, r = K(""), n = K([]), l = K({ key: e.annotations.columns.find((o) => !o.renderAsSublineOf && o.sortable !== !1)?.key ?? "", asc: !0 }), c = K([]), p = K(null), k = N(() => e.annotations.locale ?? _t()), a = N(
      () => new Intl.Collator(k.value, { numeric: !0, sensitivity: "base" })
    ), u = N(
      () => he(e.items, e.annotations, n.value, r.value)
    ), _ = N(
      () => e.annotations.columns.filter((o) => !o.renderAsSublineOf)
    ), D = N(() => {
      const o = /* @__PURE__ */ new Map();
      return e.annotations.columns.forEach((i) => {
        const d = i.renderAsSublineOf;
        if (!d) return;
        const m = o.get(d) ?? [];
        o.set(d, [...m, i]);
      }), o;
    }), R = N(() => kt(e.items, e.annotations, n.value)), g = N(() => {
      const o = e.annotations.columns.find((d) => d.key === l.value.key), i = R.value.slice();
      return !o || o.sortable === !1 || i.sort((d, m) => {
        const v = (E) => o.accessor ? String(o.accessor(E) ?? "") : String(E[o.key] ?? ""), w = v(d), O = v(m);
        if (o.key === "date") {
          const E = z(w), B = z(O);
          if (E && B) {
            const f = E.getTime(), T = B.getTime();
            return l.value.asc ? f - T : T - f;
          }
        }
        return l.value.asc ? a.value.compare(w, O) : a.value.compare(O, w);
      }), i;
    }), x = N(
      () => n.value.filter((o) => o.type === "fulltext").map((o) => o.title)
    ), A = N(
      () => n.value.filter((o) => o.type === "scope" && o.key).map((o) => o.key)
    ), H = (o) => {
      if (!x.value.length) return !1;
      if (!A.value.length) return !0;
      const i = new Set(A.value), d = e.annotations.columns.filter((w) => i.has(w.key)), m = new Set(d.map((w) => w.scopeGroup).filter(Boolean));
      if (i.has(o)) return !0;
      const v = e.annotations.columns.find((w) => w.key === o);
      return v?.scopeGroup ? m.has(v.scopeGroup) : !1;
    }, F = (o) => e.annotations.columns.find((i) => i.key === o), j = (o) => D.value.get(o) ?? [], G = (o) => String(o).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), xe = (o) => String(o || "").replace(/[^0-9]/g, ""), we = (o) => {
      const i = xe(o);
      return i.length > 0 && i === o ? i.split("").map((m) => G(m)).join("[^0-9]*") : G(o);
    }, Te = (o) => {
      if (!o.length) return [];
      const i = o.slice().sort((m, v) => m.start - v.start), d = [i[0]];
      return i.slice(1).forEach((m) => {
        const v = d[d.length - 1];
        if (m.start <= v.end) {
          v.end = Math.max(v.end, m.end);
          return;
        }
        d.push({ ...m });
      }), d;
    }, oe = (o, i) => {
      const d = String(o ?? ""), m = Array.from(
        new Set(i.map((S) => String(S || "").trim()).filter((S) => S.length > 0))
      );
      if (!m.length)
        return [{ text: d, highlighted: !1 }];
      const v = m.slice().sort((S, b) => b.length - S.length).map((S) => we(S)).join("|"), w = new RegExp(v, "gi"), O = [];
      let E = w.exec(d);
      for (; E; ) {
        const S = E[0] ?? "";
        S.length > 0 && O.push({ start: E.index, end: E.index + S.length }), S.length === 0 && (w.lastIndex += 1), E = w.exec(d);
      }
      if (!O.length)
        return [{ text: d, highlighted: !1 }];
      const B = Te(O), f = [];
      let T = 0;
      return B.forEach((S) => {
        S.start > T && f.push({ text: d.slice(T, S.start), highlighted: !1 }), f.push({ text: d.slice(S.start, S.end), highlighted: !0 }), T = S.end;
      }), T < d.length && f.push({ text: d.slice(T), highlighted: !1 }), f;
    }, re = (o, i) => {
      const d = F(i), m = (w) => d?.valueType === "number-like" ? _e(w) : String(w ?? "");
      return d?.accessor ? m(d.accessor(o)) : m(o[i]);
    }, se = (o) => {
      if (n.value.some((i) => i.uid === o.uid)) {
        r.value = "", c.value = [];
        return;
      }
      n.value = [...n.value, o], r.value = "", c.value = [];
    };
    Ne(n, (o) => {
      const i = o.filter(
        (m, v, w) => w.findIndex((O) => O.uid === m.uid) === v
      );
      if (i.length !== o.length) {
        n.value = i;
        return;
      }
      if (!o.some((m) => m.type === "fulltext") && o.some((m) => m.type === "scope")) {
        n.value = o.filter((m) => m.type !== "scope");
        return;
      }
      r.value = "", c.value = [], Fe(() => {
        p.value?.updateInputValue?.("", !0, !0), p.value?.hidePopup?.();
      });
    });
    const Ce = (o) => {
      const i = String(o || "").trim();
      if (!i) return;
      const d = i.toLowerCase(), m = he(
        e.items,
        e.annotations,
        n.value,
        i
      ).find((v) => String(v.type).startsWith("date_") ? String(v.title || "").trim().toLowerCase() === d : !1);
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
    }, be = (o) => {
      const d = {
        date_before: "Date before",
        date_after: "Date after",
        date_exact: "Date exact",
        date_relative: "Date",
        fulltext: "Full-Text",
        scope: "In Column"
      }[o.type];
      if (d) return d;
      const m = o.key ?? o.type;
      return F(m)?.label ?? o.category ?? o.type;
    }, ee = {
      fulltext: "teal-9",
      scope: "green-8",
      subcolumn: "light-blue-9"
    }, De = (o) => {
      if (ee[o.type]) return ee[o.type];
      const i = o.key ?? o.type;
      if (F(i)?.renderAsSublineOf)
        return ee.subcolumn;
    }, ae = (o, i, d) => i?.[o.type] ?? De(o) ?? d ?? e.annotations.tokenDefaultColor ?? "indigo-9", te = (o) => ae(o, e.annotations.tokenColorByType), $e = (o) => ae(o, e.annotations.optionBadgeColorByType, te(o)), Ee = (o, i) => {
      Ce(o), i(null);
    }, Le = (o, i) => {
      i(() => {
        r.value = o, c.value = u.value.filter((d) => d.type !== "fulltext");
      });
    }, le = (o, i) => {
      const d = F(i);
      return d?.tooltipHint ? typeof d.tooltipHint == "function" ? d.tooltipHint(o) : d.tooltipHint : "";
    }, Oe = (o) => {
      if (F(o)?.sortable !== !1) {
        if (l.value.key !== o) {
          l.value = { key: o, asc: !0 };
          return;
        }
        l.value = { key: o, asc: !l.value.asc };
      }
    }, ie = (o) => l.value.key !== o ? null : l.value.asc ? "arrow_upward" : "arrow_downward", Q = (o, i) => {
      const d = re(o, i);
      return H(i) ? oe(d, x.value) : [{ text: d, highlighted: !1 }];
    }, Re = (o) => oe(o, [r.value]), Me = (o) => {
      const i = re(o, "date");
      return Ge(i, k.value);
    };
    return (o, i) => {
      const d = W("q-avatar"), m = W("q-chip"), v = W("q-item-label"), w = W("q-icon"), O = W("q-item-section"), E = W("q-item"), B = W("q-select");
      return y(), h("div", St, [
        L("div", vt, [
          V(B, {
            ref_key: "qSelectRef",
            ref: p,
            modelValue: n.value,
            "onUpdate:modelValue": i[0] || (i[0] = (f) => n.value = f),
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
              V(m, {
                removable: "",
                dense: "",
                class: "chip",
                color: te(f.opt),
                "text-color": "white",
                onRemove: (T) => f.removeAtIndex(f.index)
              }, {
                default: q(() => [
                  f.opt.icon ? (y(), X(d, {
                    key: 0,
                    color: "white",
                    "text-color": te(f.opt),
                    icon: f.opt.icon
                  }, null, 8, ["text-color", "icon"])) : U("", !0),
                  L("span", null, $(be(f.opt)) + ":", 1),
                  L("span", null, $(f.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: q((f) => [
              f.opt.type !== "fulltext" ? (y(), X(E, We({ key: 0 }, f.itemProps, { class: "suggest-item" }), {
                default: q(() => [
                  V(O, null, {
                    default: q(() => [
                      V(v, { class: "suggest-title" }, {
                        default: q(() => [
                          (y(!0), h(C, null, M(Re(f.opt.title), (T, S) => (y(), h(C, {
                            key: `${f.opt.uid}-title-${S}`
                          }, [
                            T.highlighted ? (y(), h("mark", xt, $(T.text), 1)) : (y(), h(C, { key: 1 }, [
                              P($(T.text), 1)
                            ], 64))
                          ], 64))), 128))
                        ]),
                        _: 2
                      }, 1024),
                      V(v, {
                        caption: "",
                        class: "suggest-meta"
                      }, {
                        default: q(() => [
                          f.opt.icon ? (y(), X(w, {
                            key: 0,
                            name: f.opt.icon,
                            color: $e(f.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : U("", !0),
                          P(" " + $(f.opt.category), 1),
                          (f.opt.matchCount ?? 0) > 0 ? (y(), h("span", wt, " - " + $(f.opt.matchCount) + " x", 1)) : U("", !0)
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
        L("table", Tt, [
          L("colgroup", null, [
            (y(!0), h(C, null, M(_.value, (f) => (y(), h("col", {
              key: `col-${f.key}`,
              style: qe(f.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          L("thead", null, [
            L("tr", null, [
              (y(!0), h(C, null, M(_.value, (f) => (y(), h("th", {
                key: f.key,
                onClick: (T) => Oe(f.key)
              }, [
                f.icon ? (y(), X(w, {
                  key: 0,
                  name: f.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : U("", !0),
                L("span", null, $(f.label), 1),
                L("span", bt, [
                  V(w, {
                    name: ie(f.key) ?? "arrow_upward",
                    size: "14px",
                    class: Be(["sort-icon", { "sort-icon--hidden": !ie(f.key) }])
                  }, null, 8, ["name", "class"])
                ])
              ], 8, Ct))), 128))
            ])
          ]),
          L("tbody", null, [
            (y(!0), h(C, null, M(g.value, (f, T) => (y(), h("tr", { key: T }, [
              (y(!0), h(C, null, M(_.value, (S) => (y(), h("td", {
                key: S.key
              }, [
                j(S.key).length > 0 ? (y(), h(C, { key: 0 }, [
                  L("div", null, [
                    (y(!0), h(C, null, M(Q(f, S.key), (b, I) => (y(), h(C, {
                      key: `${S.key}-${T}-${I}`
                    }, [
                      b.highlighted ? (y(), h("mark", Dt, $(b.text), 1)) : (y(), h(C, { key: 1 }, [
                        P($(b.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (y(!0), h(C, null, M(j(S.key), (b) => (y(), h("span", {
                    key: `${S.key}-${b.key}-${T}`,
                    class: "subline-value",
                    title: le(f, b.key)
                  }, [
                    L("span", null, [
                      (y(!0), h(C, null, M(Q(f, b.key), (I, Ae) => (y(), h(C, {
                        key: `${b.key}-${T}-${Ae}`
                      }, [
                        I.highlighted ? (y(), h("mark", Et, $(I.text), 1)) : (y(), h(C, { key: 1 }, [
                          P($(I.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, $t))), 128))
                ], 64)) : S.key === "date" ? (y(), h("span", {
                  key: 1,
                  title: Me(f)
                }, [
                  (y(!0), h(C, null, M(Q(f, S.key), (b, I) => (y(), h(C, {
                    key: `date-${T}-${I}`
                  }, [
                    b.highlighted ? (y(), h("mark", Ot, $(b.text), 1)) : (y(), h(C, { key: 1 }, [
                      P($(b.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, Lt)) : (y(), h("span", {
                  key: 2,
                  title: le(f, S.key)
                }, [
                  (y(!0), h(C, null, M(Q(f, S.key), (b, I) => (y(), h(C, {
                    key: `${S.key}-${T}-${I}`
                  }, [
                    b.highlighted ? (y(), h("mark", Mt, $(b.text), 1)) : (y(), h(C, { key: 1 }, [
                      P($(b.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, Rt))
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]);
    };
  }
}), It = (t, e) => {
  const r = t.__vccOpts || t;
  for (const [n, s] of e)
    r[n] = s;
  return r;
}, Nt = /* @__PURE__ */ It(At, [["__scopeId", "data-v-41dbeb5c"]]), qt = {
  install(t) {
    t.component("TableSuggest", Nt);
  }
}, ve = /* @__PURE__ */ new WeakMap(), Bt = (t, e) => {
  ve.set(t, e);
}, Vt = (t) => {
  const e = ve.get(t);
  if (!e)
    throw new Error(`No model annotations registered for ${t.name}`);
  return e;
};
export {
  Nt as TableSuggest,
  qt as TableSuggestPlugin,
  he as buildSuggestions,
  qt as default,
  Bt as defineModelAnnotations,
  kt as filterItems,
  me as formatDate,
  ze as getAnchorWeekdayDate,
  Ge as getDateMouseoverLabel,
  He as getIsoWeekInfo,
  Pe as getLocalizedWeekdaysMondayFirst,
  Vt as getModelAnnotations,
  Ve as getMondayIndexFromDate,
  Wt as highlightText,
  z as parseDateInput,
  qt as plugin,
  _t as resolveEnglishLocale,
  Z as startOfDay
};
