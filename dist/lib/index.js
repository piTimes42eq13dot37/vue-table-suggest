import { defineComponent as Ae, ref as K, computed as N, watch as Ie, nextTick as Ne, resolveComponent as W, openBlock as y, createElementBlock as h, createElementVNode as L, createVNode as P, withCtx as q, createBlock as X, mergeProps as Fe, Fragment as T, renderList as M, toDisplayString as $, createTextVNode as V, createCommentVNode as U, normalizeStyle as We, normalizeClass as qe } from "vue";
const Z = (t) => {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}, H = (t) => {
  const e = String(t ?? "").trim(), r = e.match(/^(\d{2})\.(\d{2})\.(\d{4})$/), n = e.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!r && !n) return null;
  const s = Number(r ? r[3] : n[1]), l = Number(r ? r[2] : n[2]), i = Number(r ? r[1] : n[3]), p = new Date(s, l - 1, i);
  return p.setHours(0, 0, 0, 0), p.getFullYear() !== s || p.getMonth() !== l - 1 || p.getDate() !== i ? null : p;
}, ye = (t) => {
  const e = Z(t), r = String(e.getDate()).padStart(2, "0"), n = String(e.getMonth() + 1).padStart(2, "0"), s = e.getFullYear();
  return `${r}.${n}.${s}`;
}, Be = (t) => (Z(t).getDay() + 6) % 7, Pe = (t = "en-US") => {
  const e = new Intl.DateTimeFormat(t, { weekday: "long" }), r = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (n, s) => {
    const l = new Date(r);
    return l.setDate(r.getDate() + s), e.format(l);
  });
}, Ve = (t, e, r = /* @__PURE__ */ new Date()) => {
  const n = Z(r), s = Be(n), l = new Date(n);
  if (t === "last") {
    const p = (s - e + 7) % 7 || 7;
    return l.setDate(n.getDate() - p), l;
  }
  const i = (e - s + 7) % 7 || 7;
  return l.setDate(n.getDate() + i), l;
}, He = (t) => {
  const e = Z(t), r = (e.getDay() + 6) % 7, n = new Date(e);
  n.setDate(e.getDate() - r + 3);
  const s = n.getFullYear(), l = new Date(s, 0, 4), i = (l.getDay() + 6) % 7;
  return l.setDate(l.getDate() - i + 3), { weekNo: 1 + Math.round((n.getTime() - l.getTime()) / 6048e5), weekYear: s };
}, ze = (t, e = "en-US") => {
  const r = H(t);
  if (!r) return "";
  const n = new Intl.DateTimeFormat(e, {
    weekday: "long"
  }).format(r), { weekNo: s, weekYear: l } = He(r);
  return `KW ${String(s).padStart(2, "0")}/${l} - ${n}`;
}, Y = (t) => String(t ?? "").replace(/[^0-9]/g, ""), he = (t) => {
  const e = Y(t);
  return e ? e.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(t ?? "");
}, J = (t, e) => {
  if (e.accessor)
    return String(e.accessor(t) ?? "");
  const r = e.key;
  return String(t[r] ?? "");
}, Ge = (t, e) => {
  if (!e.length)
    return t.columns.filter((s) => s.searchable !== !1);
  const r = new Set(e), n = /* @__PURE__ */ new Set();
  return t.columns.forEach((s) => {
    r.has(s.key) && s.scopeGroup && n.add(s.scopeGroup);
  }), t.columns.filter((s) => !r.has(s.key) && !n.has(s.scopeGroup ?? "") ? !1 : s.searchable !== !1);
}, Ke = (t, e, r) => {
  const n = e.columns.find((s) => s.key === r);
  return n ? J(t, n) : String(t[r] ?? "");
}, ie = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ce = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"), me = () => typeof globalThis > "u" || typeof globalThis.navigator > "u" || !Array.isArray(globalThis.navigator.languages) ? "en-US" : globalThis.navigator.languages.find((t) => String(t).toLowerCase().startsWith("en")) ?? "en-US", Ue = (t, e) => {
  const r = ce(t), n = e.map((s) => String(s || "").trim()).filter((s) => s.length > 0);
  return n.length ? n.reduce((s, l) => {
    const i = Y(l), _ = i.length > 0 && i === String(l) ? i.split("").map((u) => ie(u)).join("[^0-9]*") : ie(ce(l)), a = new RegExp(_, "gi");
    return s.replace(a, (u) => `<mark>${u}</mark>`);
  }, r) : r;
}, Ye = (t) => ({
  fullTextTokens: t.filter((e) => e.type === "fulltext"),
  exactTokens: t.filter((e) => !["fulltext", "scope"].includes(e.type)),
  scopedColumnKeys: t.filter((e) => e.type === "scope" && e.key).map((e) => e.key)
}), je = (t) => t.type === "date_before" || t.type === "date_after" || t.type === "date_exact" || t.type === "date_relative", Qe = (t) => t.key ?? (t.type.startsWith("date_") || t.type === "date_relative" ? "date" : t.type), ne = (t, e, r) => {
  const { fullTextTokens: n, exactTokens: s, scopedColumnKeys: l } = Ye(r), i = Ge(e, l);
  return t.filter((p) => {
    for (const _ of s) {
      const a = Qe(_), u = e.columns.find((D) => D.key === a), m = u ? J(p, u) : "";
      if (je(_)) {
        const D = H(m), R = H(_.rawTitle || _.title);
        if (!D || !R) return !1;
        const g = D.getTime(), v = R.getTime();
        if ((_.type === "date_before" || _.direction === "before") && !(g < v) || (_.type === "date_after" || _.direction === "after") && !(g > v) || (_.type === "date_exact" || _.direction === "on") && g !== v)
          return !1;
        continue;
      }
      if (u?.valueType === "number-like") {
        if (Y(m) !== Y(_.title))
          return !1;
        continue;
      }
      if (String(m).toLowerCase() !== String(_.title || "").toLowerCase())
        return !1;
    }
    for (const _ of n) {
      const a = String(_.title || "").toLowerCase();
      if (!a) continue;
      if (!i.some(
        (m) => String(J(p, m)).toLowerCase().includes(a)
      )) return !1;
    }
    return !0;
  });
}, Xe = 1, Je = 300, Ze = 200, et = 100, tt = 1e4, nt = 1e3, ot = 40, rt = 50, st = 30, at = 6, ue = 3, lt = (t, e) => `${t}|${e}`, de = (t) => t.valueType === "number-like", fe = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), it = (t) => {
  const e = t.trim().toLowerCase();
  if (!e) return null;
  const r = e.startsWith("date ") ? e.slice(5).trim() : e, n = r.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
  if (n) {
    const l = String(n[1]).toLowerCase(), i = String(n[2] || "").toLowerCase() || null, p = String(n[3] || "").trim().toLowerCase();
    return p ? { direction: l, anchor: i, weekdayPart: p, needle: r } : null;
  }
  const s = r.match(/^(last|next)\s+(.+)$/i);
  if (s) {
    const l = String(s[1]).toLowerCase(), i = String(s[2] || "").trim().toLowerCase();
    return i ? { direction: "on", anchor: l, weekdayPart: i, needle: r } : null;
  }
  return null;
}, ct = (t, e, r) => {
  if (String(r || "").trim().length < 4 || e.some((u) => u.type === "date_relative")) return [];
  const n = it(r);
  if (!n) return [];
  const s = t.locale ?? me(), l = Pe(s).map((u, m) => ({
    weekday: u,
    weekdayIndexMonday: m,
    weekdayLower: u.toLowerCase()
  })).filter((u) => u.weekdayLower.startsWith(n.weekdayPart)), i = n.anchor ? [n.anchor] : n.direction === "before" ? ["last", "next"] : ["next", "last"], p = [], _ = /* @__PURE__ */ new Set();
  i.forEach((u) => {
    l.forEach((m) => {
      const D = Ve(u, m.weekdayIndexMonday), R = ye(D), v = `${n.direction === "before" ? u === "last" ? "before last" : "before next" : n.direction === "after" ? u === "last" ? "after last" : "after next" : u === "last" ? "on last" : "on next"} ${m.weekday}`;
      _.has(v) || (_.add(v), p.push({
        uid: `date_relative|${n.direction}|${u}|${m.weekdayIndexMonday}|${R}`,
        type: "date_relative",
        title: v,
        rawTitle: R,
        category: n.direction === "before" ? "date before" : n.direction === "after" ? "date after" : "date exact",
        icon: "event_repeat",
        direction: n.direction,
        anchor: u
      }));
    });
  });
  const a = (u) => {
    const m = u.toLowerCase();
    return m === n.needle ? 3 : m.startsWith(n.needle) ? 2 : m.includes(n.needle) ? 1 : 0;
  };
  return p.sort((u, m) => {
    const D = a(m.title) - a(u.title);
    return D !== 0 ? D : u.title.localeCompare(m.title);
  }).slice(0, t.maxWeekdaySuggestions ?? 3);
}, ut = (t, e) => {
  const r = H(e);
  if (!r) return [];
  const n = new Set(t.map((i) => i.type)), s = ye(r);
  return [
    { type: "date_before", category: "date before", icon: "event_busy" },
    { type: "date_after", category: "date after", icon: "event_available" },
    { type: "date_exact", category: "date exact", icon: "event" }
  ].filter((i) => !n.has(i.type)).map((i) => ({
    uid: `${i.type}|${s}`,
    type: i.type,
    title: s,
    rawTitle: s,
    category: i.category,
    icon: i.icon
  }));
}, dt = (t, e) => {
  if (!e) return 0;
  const r = t.indexOf(e);
  return r < 0 ? -1 : r === 0 ? Je : r + e.length === t.length ? et : Ze;
}, ft = (t, e) => {
  if (!e) return 0;
  const r = String(t || "").split(/\s+/).filter((s) => s.length > 0);
  let n = -1;
  return r.forEach((s, l) => {
    const i = dt(s, e);
    if (i < 0) return;
    const p = tt - l * nt + i;
    p > n && (n = p);
  }), n;
}, _e = (t, e, r) => {
  if (!r) return 1;
  const n = String(t || "").toLowerCase(), s = ft(n, r);
  if (s < 0) return -1;
  const i = String(e || "").toLowerCase().includes(r) ? ot : 0, p = n === r ? rt : 0, _ = Math.min(
    st,
    Math.floor(n.length / at)
  );
  return s + i + p - _;
}, gt = (t, e) => {
  const r = String(t ?? "").toLowerCase();
  if (!r || !e) return 0;
  const n = Y(e), l = n.length > 0 && n === String(e) ? n.split("").map((_) => fe(_)).join("[^0-9]*") : fe(String(e)), i = new RegExp(l, "gi"), p = r.match(i);
  return p ? p.length : 0;
}, pt = (t, e, r, n) => {
  if (!n.length) return 0;
  const s = [r];
  return t.reduce((l, i) => {
    const p = n.reduce((_, a) => {
      const u = s.reduce((m, D) => m + gt(Ke(i, e, D), a), 0);
      return _ + u;
    }, 0);
    return l + p;
  }, 0);
}, ge = (t, e, r, n) => {
  const s = new Set(
    r.map((g) => g.type).filter((g) => g && !["fulltext", "scope"].includes(g))
  ), l = [], i = /* @__PURE__ */ new Set(), p = ne(t, e, r);
  e.columns.filter((g) => g.suggestionEnabled !== !1).forEach((g) => {
    s.has(g.key) || new Set(p.map((v) => J(v, g))).forEach((v) => {
      const A = String(v ?? "");
      if (!A) return;
      const z = lt(g.key, A);
      if (i.has(z)) return;
      i.add(z);
      const F = de(g) ? he(A) : A, j = de(g) ? A : F, G = _e(j, g.label, n);
      G < 0 && n.length > 0 || l.push({
        uid: z,
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
  const _ = (g, v) => v._score !== g._score ? v._score - g._score : g.title.localeCompare(v.title), a = l.slice().sort(_), u = [], m = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Set();
  a.slice(0, ue).forEach((g) => {
    m.has(g.uid) || (m.add(g.uid), D.add(g._columnType), u.push(g));
  });
  const R = a.slice(ue);
  return R.forEach((g) => {
    m.has(g.uid) || D.has(g._columnType) || (m.add(g.uid), D.add(g._columnType), u.push(g));
  }), R.forEach((g) => {
    m.has(g.uid) || (m.add(g.uid), u.push(g));
  }), u.map((g) => {
    const v = { ...g };
    return delete v._score, delete v._columnType, v;
  });
}, yt = (t, e, r, n) => {
  const s = r.filter((a) => a.type === "fulltext").map((a) => String(a.title || "").toLowerCase()).filter((a) => a.length > 0), l = r.filter((a) => !["fulltext", "scope"].includes(a.type)), i = ne(t, e, l), p = new Set(
    r.filter((a) => a.type === "scope" && a.key).map((a) => a.key)
  );
  return e.columns.filter((a) => a.searchable !== !1).filter((a) => !p.has(a.key)).map((a) => {
    const u = pt(i, e, a.key, s), m = n.length === 0 ? 1 : _e(a.label, "Fulltext scope", n);
    return {
      uid: `scope|${a.key}`,
      type: "scope",
      key: a.key,
      title: a.label,
      category: "Fulltext scope",
      icon: a.icon,
      matchCount: u,
      _score: m
    };
  }).filter((a) => a.matchCount > 0).filter((a) => n.length === 0 || a._score >= 0).sort((a, u) => u.matchCount !== a.matchCount ? u.matchCount - a.matchCount : u._score !== a._score ? u._score - a._score : a.title.localeCompare(u.title)).map((a) => {
    const u = { ...a };
    return delete u._score, u;
  });
}, pe = (...t) => {
  const e = [], r = /* @__PURE__ */ new Set();
  return t.flat().forEach((n) => {
    r.has(n.uid) || (r.add(n.uid), e.push(n));
  }), e;
}, ht = (t, e, r, n) => {
  const s = String(n || "").trim().toLowerCase(), l = e.maxSuggestions ?? 7, i = ut(r, n), p = ct(e, r, n);
  if (r.some((a) => a.type === "fulltext")) {
    const a = yt(t, e, r, s), u = ge(t, e, r, s);
    return pe(i, p, a, u).slice(0, l);
  }
  return i.length > 0 || p.length > 0 ? pe(i, p).slice(0, l) : s.length < Xe ? [] : ge(t, e, r, s).slice(0, l);
}, mt = () => me(), Wt = (t, e) => Ue(t, e), _t = (t, e, r) => ne(t, e, r), kt = (t, e, r, n) => ht(t, e, r, n), St = { class: "table-suggest" }, vt = { class: "search-wrap" }, xt = { key: 0 }, wt = { key: 1 }, Tt = { class: "data-table" }, Ct = ["onClick"], bt = { class: "sort-icon-slot" }, Dt = { key: 0 }, $t = ["title"], Et = { key: 0 }, Lt = ["title"], Ot = { key: 0 }, Rt = ["title"], Mt = { key: 0 }, At = /* @__PURE__ */ Ae({
  __name: "TableSuggest",
  props: {
    items: {},
    annotations: {}
  },
  setup(t) {
    const e = t, r = K(""), n = K([]), l = K({ key: e.annotations.columns.find((o) => !o.renderAsSublineOf && o.sortable !== !1)?.key ?? "", asc: !0 }), i = K([]), p = K(null), _ = N(() => e.annotations.locale ?? mt()), a = N(
      () => new Intl.Collator(_.value, { numeric: !0, sensitivity: "base" })
    ), u = N(
      () => kt(e.items, e.annotations, n.value, r.value)
    ), m = N(
      () => e.annotations.columns.filter((o) => !o.renderAsSublineOf)
    ), D = N(() => {
      const o = /* @__PURE__ */ new Map();
      return e.annotations.columns.forEach((c) => {
        const f = c.renderAsSublineOf;
        if (!f) return;
        const k = o.get(f) ?? [];
        o.set(f, [...k, c]);
      }), o;
    }), R = N(() => _t(e.items, e.annotations, n.value)), g = N(() => {
      const o = e.annotations.columns.find((f) => f.key === l.value.key), c = R.value.slice();
      return !o || o.sortable === !1 || c.sort((f, k) => {
        const C = (E) => o.accessor ? String(o.accessor(E) ?? "") : String(E[o.key] ?? ""), x = C(f), O = C(k);
        if (o.key === "date") {
          const E = H(x), B = H(O);
          if (E && B) {
            const d = E.getTime(), w = B.getTime();
            return l.value.asc ? d - w : w - d;
          }
        }
        return l.value.asc ? a.value.compare(x, O) : a.value.compare(O, x);
      }), c;
    }), v = N(
      () => n.value.filter((o) => o.type === "fulltext").map((o) => o.title)
    ), A = N(
      () => n.value.filter((o) => o.type === "scope" && o.key).map((o) => o.key)
    ), z = (o) => {
      if (!v.value.length) return !1;
      if (!A.value.length) return !0;
      const c = new Set(A.value), f = e.annotations.columns.filter((x) => c.has(x.key)), k = new Set(f.map((x) => x.scopeGroup).filter(Boolean));
      if (c.has(o)) return !0;
      const C = e.annotations.columns.find((x) => x.key === o);
      return C?.scopeGroup ? k.has(C.scopeGroup) : !1;
    }, F = (o) => e.annotations.columns.find((c) => c.key === o), j = (o) => D.value.get(o) ?? [], G = (o) => String(o).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Se = (o) => String(o || "").replace(/[^0-9]/g, ""), ve = (o) => {
      const c = Se(o);
      return c.length > 0 && c === o ? c.split("").map((k) => G(k)).join("[^0-9]*") : G(o);
    }, xe = (o) => {
      if (!o.length) return [];
      const c = o.slice().sort((k, C) => k.start - C.start), f = [c[0]];
      return c.slice(1).forEach((k) => {
        const C = f[f.length - 1];
        if (k.start <= C.end) {
          C.end = Math.max(C.end, k.end);
          return;
        }
        f.push({ ...k });
      }), f;
    }, oe = (o, c) => {
      const f = String(o ?? ""), k = Array.from(
        new Set(c.map((S) => String(S || "").trim()).filter((S) => S.length > 0))
      );
      if (!k.length)
        return [{ text: f, highlighted: !1 }];
      const C = k.slice().sort((S, b) => b.length - S.length).map((S) => ve(S)).join("|"), x = new RegExp(C, "gi"), O = [];
      let E = x.exec(f);
      for (; E; ) {
        const S = E[0] ?? "";
        S.length > 0 && O.push({ start: E.index, end: E.index + S.length }), S.length === 0 && (x.lastIndex += 1), E = x.exec(f);
      }
      if (!O.length)
        return [{ text: f, highlighted: !1 }];
      const B = xe(O), d = [];
      let w = 0;
      return B.forEach((S) => {
        S.start > w && d.push({ text: f.slice(w, S.start), highlighted: !1 }), d.push({ text: f.slice(S.start, S.end), highlighted: !0 }), w = S.end;
      }), w < f.length && d.push({ text: f.slice(w), highlighted: !1 }), d;
    }, re = (o, c) => {
      const f = F(c), k = (x) => f?.valueType === "number-like" ? he(x) : String(x ?? "");
      return f?.accessor ? k(f.accessor(o)) : k(o[c]);
    }, we = (o) => {
      if (n.value.some((c) => c.uid === o.uid)) {
        r.value = "", i.value = [];
        return;
      }
      n.value = [...n.value, o], r.value = "", i.value = [];
    };
    Ie(n, (o) => {
      const c = o.filter(
        (k, C, x) => x.findIndex((O) => O.uid === k.uid) === C
      );
      if (c.length !== o.length) {
        n.value = c;
        return;
      }
      if (!o.some((k) => k.type === "fulltext") && o.some((k) => k.type === "scope")) {
        n.value = o.filter((k) => k.type !== "scope");
        return;
      }
      r.value = "", i.value = [], Ne(() => {
        p.value?.updateInputValue?.("", !0, !0), p.value?.hidePopup?.();
      });
    });
    const Te = (o) => {
      const c = String(o || "").trim();
      c && we({
        uid: `fulltext|${c}`,
        type: "fulltext",
        title: c,
        category: "Fulltext",
        icon: "search"
      });
    }, Ce = (o) => {
      const f = {
        date_before: "Stardate before",
        date_after: "Stardate after",
        date_exact: "Stardate exact",
        date_relative: "Stardate",
        fulltext: "Full-Text",
        scope: "In Column"
      }[o.type];
      if (f) return f;
      const k = o.key ?? o.type;
      return F(k)?.label ?? o.category ?? o.type;
    }, ee = {
      fulltext: "teal-9",
      scope: "green-8",
      subcolumn: "light-blue-9"
    }, be = (o) => {
      if (ee[o.type]) return ee[o.type];
      const c = o.key ?? o.type;
      if (F(c)?.renderAsSublineOf)
        return ee.subcolumn;
    }, se = (o, c, f) => c?.[o.type] ?? be(o) ?? f ?? e.annotations.tokenDefaultColor ?? "indigo-9", te = (o) => se(o, e.annotations.tokenColorByType), De = (o) => se(o, e.annotations.optionBadgeColorByType, te(o)), $e = (o, c) => {
      Te(o), c(null);
    }, Ee = (o, c) => {
      c(() => {
        r.value = o, i.value = u.value.filter((f) => f.type !== "fulltext");
      });
    }, ae = (o, c) => {
      const f = F(c);
      return f?.tooltipHint ? typeof f.tooltipHint == "function" ? f.tooltipHint(o) : f.tooltipHint : "";
    }, Le = (o) => {
      if (F(o)?.sortable !== !1) {
        if (l.value.key !== o) {
          l.value = { key: o, asc: !0 };
          return;
        }
        l.value = { key: o, asc: !l.value.asc };
      }
    }, le = (o) => l.value.key !== o ? null : l.value.asc ? "arrow_upward" : "arrow_downward", Q = (o, c) => {
      const f = re(o, c);
      return z(c) ? oe(f, v.value) : [{ text: f, highlighted: !1 }];
    }, Oe = (o) => oe(o, [r.value]), Re = (o) => {
      const c = re(o, "date");
      return ze(c, _.value);
    };
    return (o, c) => {
      const f = W("q-avatar"), k = W("q-chip"), C = W("q-item-label"), x = W("q-icon"), O = W("q-item-section"), E = W("q-item"), B = W("q-select");
      return y(), h("div", St, [
        L("div", vt, [
          P(B, {
            ref_key: "qSelectRef",
            ref: p,
            modelValue: n.value,
            "onUpdate:modelValue": c[0] || (c[0] = (d) => n.value = d),
            class: "search-field",
            "input-class": "search-input",
            label: "Search",
            "use-input": "",
            "use-chips": "",
            multiple: "",
            "input-debounce": "0",
            "option-label": "title",
            "option-value": "uid",
            options: i.value,
            onNewValue: $e,
            onFilter: Ee
          }, {
            "selected-item": q((d) => [
              P(k, {
                removable: "",
                dense: "",
                class: "chip",
                color: te(d.opt),
                "text-color": "white",
                onRemove: (w) => d.removeAtIndex(d.index)
              }, {
                default: q(() => [
                  d.opt.icon ? (y(), X(f, {
                    key: 0,
                    color: "white",
                    "text-color": te(d.opt),
                    icon: d.opt.icon
                  }, null, 8, ["text-color", "icon"])) : U("", !0),
                  L("span", null, $(Ce(d.opt)) + ":", 1),
                  L("span", null, $(d.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: q((d) => [
              d.opt.type !== "fulltext" ? (y(), X(E, Fe({ key: 0 }, d.itemProps, { class: "suggest-item" }), {
                default: q(() => [
                  P(O, null, {
                    default: q(() => [
                      P(C, { class: "suggest-title" }, {
                        default: q(() => [
                          (y(!0), h(T, null, M(Oe(d.opt.title), (w, S) => (y(), h(T, {
                            key: `${d.opt.uid}-title-${S}`
                          }, [
                            w.highlighted ? (y(), h("mark", xt, $(w.text), 1)) : (y(), h(T, { key: 1 }, [
                              V($(w.text), 1)
                            ], 64))
                          ], 64))), 128))
                        ]),
                        _: 2
                      }, 1024),
                      P(C, {
                        caption: "",
                        class: "suggest-meta"
                      }, {
                        default: q(() => [
                          d.opt.icon ? (y(), X(x, {
                            key: 0,
                            name: d.opt.icon,
                            color: De(d.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : U("", !0),
                          V(" " + $(d.opt.category), 1),
                          (d.opt.matchCount ?? 0) > 0 ? (y(), h("span", wt, " - " + $(d.opt.matchCount) + " x", 1)) : U("", !0)
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
            (y(!0), h(T, null, M(m.value, (d) => (y(), h("col", {
              key: `col-${d.key}`,
              style: We(d.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          L("thead", null, [
            L("tr", null, [
              (y(!0), h(T, null, M(m.value, (d) => (y(), h("th", {
                key: d.key,
                onClick: (w) => Le(d.key)
              }, [
                d.icon ? (y(), X(x, {
                  key: 0,
                  name: d.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : U("", !0),
                L("span", null, $(d.label), 1),
                L("span", bt, [
                  P(x, {
                    name: le(d.key) ?? "arrow_upward",
                    size: "14px",
                    class: qe(["sort-icon", { "sort-icon--hidden": !le(d.key) }])
                  }, null, 8, ["name", "class"])
                ])
              ], 8, Ct))), 128))
            ])
          ]),
          L("tbody", null, [
            (y(!0), h(T, null, M(g.value, (d, w) => (y(), h("tr", { key: w }, [
              (y(!0), h(T, null, M(m.value, (S) => (y(), h("td", {
                key: S.key
              }, [
                j(S.key).length > 0 ? (y(), h(T, { key: 0 }, [
                  L("div", null, [
                    (y(!0), h(T, null, M(Q(d, S.key), (b, I) => (y(), h(T, {
                      key: `${S.key}-${w}-${I}`
                    }, [
                      b.highlighted ? (y(), h("mark", Dt, $(b.text), 1)) : (y(), h(T, { key: 1 }, [
                        V($(b.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (y(!0), h(T, null, M(j(S.key), (b) => (y(), h("span", {
                    key: `${S.key}-${b.key}-${w}`,
                    class: "subline-value",
                    title: ae(d, b.key)
                  }, [
                    L("span", null, [
                      (y(!0), h(T, null, M(Q(d, b.key), (I, Me) => (y(), h(T, {
                        key: `${b.key}-${w}-${Me}`
                      }, [
                        I.highlighted ? (y(), h("mark", Et, $(I.text), 1)) : (y(), h(T, { key: 1 }, [
                          V($(I.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, $t))), 128))
                ], 64)) : S.key === "date" ? (y(), h("span", {
                  key: 1,
                  title: Re(d)
                }, [
                  (y(!0), h(T, null, M(Q(d, S.key), (b, I) => (y(), h(T, {
                    key: `date-${w}-${I}`
                  }, [
                    b.highlighted ? (y(), h("mark", Ot, $(b.text), 1)) : (y(), h(T, { key: 1 }, [
                      V($(b.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, Lt)) : (y(), h("span", {
                  key: 2,
                  title: ae(d, S.key)
                }, [
                  (y(!0), h(T, null, M(Q(d, S.key), (b, I) => (y(), h(T, {
                    key: `${S.key}-${w}-${I}`
                  }, [
                    b.highlighted ? (y(), h("mark", Mt, $(b.text), 1)) : (y(), h(T, { key: 1 }, [
                      V($(b.text), 1)
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
}, Nt = /* @__PURE__ */ It(At, [["__scopeId", "data-v-c15768fa"]]), qt = {
  install(t) {
    t.component("TableSuggest", Nt);
  }
}, ke = /* @__PURE__ */ new WeakMap(), Bt = (t, e) => {
  ke.set(t, e);
}, Pt = (t) => {
  const e = ke.get(t);
  if (!e)
    throw new Error(`No model annotations registered for ${t.name}`);
  return e;
};
export {
  Nt as TableSuggest,
  qt as TableSuggestPlugin,
  kt as buildSuggestions,
  qt as default,
  Bt as defineModelAnnotations,
  _t as filterItems,
  ye as formatDate,
  Ve as getAnchorWeekdayDate,
  ze as getDateMouseoverLabel,
  He as getIsoWeekInfo,
  Pe as getLocalizedWeekdaysMondayFirst,
  Pt as getModelAnnotations,
  Be as getMondayIndexFromDate,
  Wt as highlightText,
  H as parseDateInput,
  qt as plugin,
  mt as resolveEnglishLocale,
  Z as startOfDay
};
