import { defineComponent as Ae, ref as K, computed as N, watch as Ie, nextTick as Ne, resolveComponent as W, openBlock as y, createElementBlock as h, createElementVNode as O, createVNode as U, withCtx as q, createBlock as Y, mergeProps as Fe, Fragment as T, renderList as M, toDisplayString as $, createTextVNode as P, createCommentVNode as V, normalizeStyle as We } from "vue";
const Z = (t) => {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}, H = (t) => {
  const e = String(t ?? "").trim(), o = e.match(/^(\d{2})\.(\d{2})\.(\d{4})$/), n = e.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!o && !n) return null;
  const s = Number(o ? o[3] : n[1]), l = Number(o ? o[2] : n[2]), i = Number(o ? o[1] : n[3]), p = new Date(s, l - 1, i);
  return p.setHours(0, 0, 0, 0), p.getFullYear() !== s || p.getMonth() !== l - 1 || p.getDate() !== i ? null : p;
}, ye = (t) => {
  const e = Z(t), o = String(e.getDate()).padStart(2, "0"), n = String(e.getMonth() + 1).padStart(2, "0"), s = e.getFullYear();
  return `${o}.${n}.${s}`;
}, qe = (t) => (Z(t).getDay() + 6) % 7, Be = (t = "en-US") => {
  const e = new Intl.DateTimeFormat(t, { weekday: "long" }), o = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (n, s) => {
    const l = new Date(o);
    return l.setDate(o.getDate() + s), e.format(l);
  });
}, Pe = (t, e, o = /* @__PURE__ */ new Date()) => {
  const n = Z(o), s = qe(n), l = new Date(n);
  if (t === "last") {
    const p = (s - e + 7) % 7 || 7;
    return l.setDate(n.getDate() - p), l;
  }
  const i = (e - s + 7) % 7 || 7;
  return l.setDate(n.getDate() + i), l;
}, Ve = (t) => {
  const e = Z(t), o = (e.getDay() + 6) % 7, n = new Date(e);
  n.setDate(e.getDate() - o + 3);
  const s = n.getFullYear(), l = new Date(s, 0, 4), i = (l.getDay() + 6) % 7;
  return l.setDate(l.getDate() - i + 3), { weekNo: 1 + Math.round((n.getTime() - l.getTime()) / 6048e5), weekYear: s };
}, He = (t, e = "en-US") => {
  const o = H(t);
  if (!o) return "";
  const n = new Intl.DateTimeFormat(e, {
    weekday: "long"
  }).format(o), { weekNo: s, weekYear: l } = Ve(o);
  return `KW ${String(s).padStart(2, "0")}/${l} - ${n}`;
}, j = (t) => String(t ?? "").replace(/[^0-9]/g, ""), he = (t) => {
  const e = j(t);
  return e ? e.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(t ?? "");
}, J = (t, e) => {
  if (e.accessor)
    return String(e.accessor(t) ?? "");
  const o = e.key;
  return String(t[o] ?? "");
}, ze = (t, e) => {
  if (!e.length)
    return t.columns.filter((s) => s.searchable !== !1);
  const o = new Set(e), n = /* @__PURE__ */ new Set();
  return t.columns.forEach((s) => {
    o.has(s.key) && s.scopeGroup && n.add(s.scopeGroup);
  }), t.columns.filter((s) => !o.has(s.key) && !n.has(s.scopeGroup ?? "") ? !1 : s.searchable !== !1);
}, Ge = (t, e, o) => {
  const n = e.columns.find((s) => s.key === o);
  return n ? J(t, n) : String(t[o] ?? "");
}, ie = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ce = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"), me = () => typeof globalThis > "u" || typeof globalThis.navigator > "u" || !Array.isArray(globalThis.navigator.languages) ? "en-US" : globalThis.navigator.languages.find((t) => String(t).toLowerCase().startsWith("en")) ?? "en-US", Ke = (t, e) => {
  const o = ce(t), n = e.map((s) => String(s || "").trim()).filter((s) => s.length > 0);
  return n.length ? n.reduce((s, l) => {
    const i = j(l), _ = i.length > 0 && i === String(l) ? i.split("").map((u) => ie(u)).join("[^0-9]*") : ie(ce(l)), a = new RegExp(_, "gi");
    return s.replace(a, (u) => `<mark>${u}</mark>`);
  }, o) : o;
}, Ue = (t) => ({
  fullTextTokens: t.filter((e) => e.type === "fulltext"),
  exactTokens: t.filter((e) => !["fulltext", "scope"].includes(e.type)),
  scopedColumnKeys: t.filter((e) => e.type === "scope" && e.key).map((e) => e.key)
}), Ye = (t) => t.type === "date_before" || t.type === "date_after" || t.type === "date_exact" || t.type === "date_relative", je = (t) => t.key ?? (t.type.startsWith("date_") || t.type === "date_relative" ? "date" : t.type), ne = (t, e, o) => {
  const { fullTextTokens: n, exactTokens: s, scopedColumnKeys: l } = Ue(o), i = ze(e, l);
  return t.filter((p) => {
    for (const _ of s) {
      const a = je(_), u = e.columns.find((D) => D.key === a), m = u ? J(p, u) : "";
      if (Ye(_)) {
        const D = H(m), R = H(_.rawTitle || _.title);
        if (!D || !R) return !1;
        const g = D.getTime(), v = R.getTime();
        if ((_.type === "date_before" || _.direction === "before") && !(g < v) || (_.type === "date_after" || _.direction === "after") && !(g > v) || (_.type === "date_exact" || _.direction === "on") && g !== v)
          return !1;
        continue;
      }
      if (u?.valueType === "number-like") {
        if (j(m) !== j(_.title))
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
}, Qe = 1, Xe = 300, Je = 200, Ze = 100, et = 1e4, tt = 1e3, nt = 40, rt = 50, ot = 30, st = 6, ue = 3, at = (t, e) => `${t}|${e}`, de = (t) => t.valueType === "number-like", fe = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), lt = (t) => {
  const e = t.trim().toLowerCase();
  if (!e) return null;
  const o = e.startsWith("date ") ? e.slice(5).trim() : e, n = o.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
  if (n) {
    const l = String(n[1]).toLowerCase(), i = String(n[2] || "").toLowerCase() || null, p = String(n[3] || "").trim().toLowerCase();
    return p ? { direction: l, anchor: i, weekdayPart: p, needle: o } : null;
  }
  const s = o.match(/^(last|next)\s+(.+)$/i);
  if (s) {
    const l = String(s[1]).toLowerCase(), i = String(s[2] || "").trim().toLowerCase();
    return i ? { direction: "on", anchor: l, weekdayPart: i, needle: o } : null;
  }
  return null;
}, it = (t, e, o) => {
  if (String(o || "").trim().length < 4 || e.some((u) => u.type === "date_relative")) return [];
  const n = lt(o);
  if (!n) return [];
  const s = t.locale ?? me(), l = Be(s).map((u, m) => ({
    weekday: u,
    weekdayIndexMonday: m,
    weekdayLower: u.toLowerCase()
  })).filter((u) => u.weekdayLower.startsWith(n.weekdayPart)), i = n.anchor ? [n.anchor] : n.direction === "before" ? ["last", "next"] : ["next", "last"], p = [], _ = /* @__PURE__ */ new Set();
  i.forEach((u) => {
    l.forEach((m) => {
      const D = Pe(u, m.weekdayIndexMonday), R = ye(D), v = `${n.direction === "before" ? u === "last" ? "before last" : "before next" : n.direction === "after" ? u === "last" ? "after last" : "after next" : u === "last" ? "on last" : "on next"} ${m.weekday}`;
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
}, ct = (t, e) => {
  const o = H(e);
  if (!o) return [];
  const n = new Set(t.map((i) => i.type)), s = ye(o);
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
}, ut = (t, e) => {
  if (!e) return 0;
  const o = t.indexOf(e);
  return o < 0 ? -1 : o === 0 ? Xe : o + e.length === t.length ? Ze : Je;
}, dt = (t, e) => {
  if (!e) return 0;
  const o = String(t || "").split(/\s+/).filter((s) => s.length > 0);
  let n = -1;
  return o.forEach((s, l) => {
    const i = ut(s, e);
    if (i < 0) return;
    const p = et - l * tt + i;
    p > n && (n = p);
  }), n;
}, _e = (t, e, o) => {
  if (!o) return 1;
  const n = String(t || "").toLowerCase(), s = dt(n, o);
  if (s < 0) return -1;
  const i = String(e || "").toLowerCase().includes(o) ? nt : 0, p = n === o ? rt : 0, _ = Math.min(
    ot,
    Math.floor(n.length / st)
  );
  return s + i + p - _;
}, ft = (t, e) => {
  const o = String(t ?? "").toLowerCase();
  if (!o || !e) return 0;
  const n = j(e), l = n.length > 0 && n === String(e) ? n.split("").map((_) => fe(_)).join("[^0-9]*") : fe(String(e)), i = new RegExp(l, "gi"), p = o.match(i);
  return p ? p.length : 0;
}, gt = (t, e, o, n) => {
  if (!n.length) return 0;
  const s = [o];
  return t.reduce((l, i) => {
    const p = n.reduce((_, a) => {
      const u = s.reduce((m, D) => m + ft(Ge(i, e, D), a), 0);
      return _ + u;
    }, 0);
    return l + p;
  }, 0);
}, ge = (t, e, o, n) => {
  const s = new Set(
    o.map((g) => g.type).filter((g) => g && !["fulltext", "scope"].includes(g))
  ), l = [], i = /* @__PURE__ */ new Set(), p = ne(t, e, o);
  e.columns.filter((g) => g.suggestionEnabled !== !1).forEach((g) => {
    s.has(g.key) || new Set(p.map((v) => J(v, g))).forEach((v) => {
      const A = String(v ?? "");
      if (!A) return;
      const z = at(g.key, A);
      if (i.has(z)) return;
      i.add(z);
      const F = de(g) ? he(A) : A, Q = de(g) ? A : F, G = _e(Q, g.label, n);
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
}, pt = (t, e, o, n) => {
  const s = o.filter((a) => a.type === "fulltext").map((a) => String(a.title || "").toLowerCase()).filter((a) => a.length > 0), l = o.filter((a) => !["fulltext", "scope"].includes(a.type)), i = ne(t, e, l), p = new Set(
    o.filter((a) => a.type === "scope" && a.key).map((a) => a.key)
  );
  return e.columns.filter((a) => a.searchable !== !1).filter((a) => !p.has(a.key)).map((a) => {
    const u = gt(i, e, a.key, s), m = n.length === 0 ? 1 : _e(a.label, "Fulltext scope", n);
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
  const e = [], o = /* @__PURE__ */ new Set();
  return t.flat().forEach((n) => {
    o.has(n.uid) || (o.add(n.uid), e.push(n));
  }), e;
}, yt = (t, e, o, n) => {
  const s = String(n || "").trim().toLowerCase(), l = e.maxSuggestions ?? 7, i = ct(o, n), p = it(e, o, n);
  if (o.some((a) => a.type === "fulltext")) {
    const a = pt(t, e, o, s), u = ge(t, e, o, s);
    return pe(i, p, a, u).slice(0, l);
  }
  return i.length > 0 || p.length > 0 ? pe(i, p).slice(0, l) : s.length < Qe ? [] : ge(t, e, o, s).slice(0, l);
}, ht = () => me(), Nt = (t, e) => Ke(t, e), mt = (t, e, o) => ne(t, e, o), _t = (t, e, o, n) => yt(t, e, o, n), kt = { class: "table-suggest" }, St = { class: "search-wrap" }, vt = { key: 0 }, xt = { key: 1 }, wt = { class: "data-table" }, Tt = ["onClick"], Ct = { key: 0 }, bt = ["title"], Dt = { key: 0 }, $t = ["title"], Et = { key: 0 }, Lt = ["title"], Ot = { key: 0 }, Rt = /* @__PURE__ */ Ae({
  __name: "TableSuggest",
  props: {
    items: {},
    annotations: {}
  },
  setup(t) {
    const e = t, o = K(""), n = K([]), l = K({ key: e.annotations.columns.find((r) => !r.renderAsSublineOf && r.sortable !== !1)?.key ?? "", asc: !0 }), i = K([]), p = K(null), _ = N(() => e.annotations.locale ?? ht()), a = N(
      () => new Intl.Collator(_.value, { numeric: !0, sensitivity: "base" })
    ), u = N(
      () => _t(e.items, e.annotations, n.value, o.value)
    ), m = N(
      () => e.annotations.columns.filter((r) => !r.renderAsSublineOf)
    ), D = N(() => {
      const r = /* @__PURE__ */ new Map();
      return e.annotations.columns.forEach((c) => {
        const f = c.renderAsSublineOf;
        if (!f) return;
        const k = r.get(f) ?? [];
        r.set(f, [...k, c]);
      }), r;
    }), R = N(() => mt(e.items, e.annotations, n.value)), g = N(() => {
      const r = e.annotations.columns.find((f) => f.key === l.value.key), c = R.value.slice();
      return !r || r.sortable === !1 || c.sort((f, k) => {
        const C = (E) => r.accessor ? String(r.accessor(E) ?? "") : String(E[r.key] ?? ""), x = C(f), L = C(k);
        if (r.key === "date") {
          const E = H(x), B = H(L);
          if (E && B) {
            const d = E.getTime(), w = B.getTime();
            return l.value.asc ? d - w : w - d;
          }
        }
        return l.value.asc ? a.value.compare(x, L) : a.value.compare(L, x);
      }), c;
    }), v = N(
      () => n.value.filter((r) => r.type === "fulltext").map((r) => r.title)
    ), A = N(
      () => n.value.filter((r) => r.type === "scope" && r.key).map((r) => r.key)
    ), z = (r) => {
      if (!v.value.length) return !1;
      if (!A.value.length) return !0;
      const c = new Set(A.value), f = e.annotations.columns.filter((x) => c.has(x.key)), k = new Set(f.map((x) => x.scopeGroup).filter(Boolean));
      if (c.has(r)) return !0;
      const C = e.annotations.columns.find((x) => x.key === r);
      return C?.scopeGroup ? k.has(C.scopeGroup) : !1;
    }, F = (r) => e.annotations.columns.find((c) => c.key === r), Q = (r) => D.value.get(r) ?? [], G = (r) => String(r).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Se = (r) => String(r || "").replace(/[^0-9]/g, ""), ve = (r) => {
      const c = Se(r);
      return c.length > 0 && c === r ? c.split("").map((k) => G(k)).join("[^0-9]*") : G(r);
    }, xe = (r) => {
      if (!r.length) return [];
      const c = r.slice().sort((k, C) => k.start - C.start), f = [c[0]];
      return c.slice(1).forEach((k) => {
        const C = f[f.length - 1];
        if (k.start <= C.end) {
          C.end = Math.max(C.end, k.end);
          return;
        }
        f.push({ ...k });
      }), f;
    }, re = (r, c) => {
      const f = String(r ?? ""), k = Array.from(
        new Set(c.map((S) => String(S || "").trim()).filter((S) => S.length > 0))
      );
      if (!k.length)
        return [{ text: f, highlighted: !1 }];
      const C = k.slice().sort((S, b) => b.length - S.length).map((S) => ve(S)).join("|"), x = new RegExp(C, "gi"), L = [];
      let E = x.exec(f);
      for (; E; ) {
        const S = E[0] ?? "";
        S.length > 0 && L.push({ start: E.index, end: E.index + S.length }), S.length === 0 && (x.lastIndex += 1), E = x.exec(f);
      }
      if (!L.length)
        return [{ text: f, highlighted: !1 }];
      const B = xe(L), d = [];
      let w = 0;
      return B.forEach((S) => {
        S.start > w && d.push({ text: f.slice(w, S.start), highlighted: !1 }), d.push({ text: f.slice(S.start, S.end), highlighted: !0 }), w = S.end;
      }), w < f.length && d.push({ text: f.slice(w), highlighted: !1 }), d;
    }, oe = (r, c) => {
      const f = F(c), k = (x) => f?.valueType === "number-like" ? he(x) : String(x ?? "");
      return f?.accessor ? k(f.accessor(r)) : k(r[c]);
    }, we = (r) => {
      if (n.value.some((c) => c.uid === r.uid)) {
        o.value = "", i.value = [];
        return;
      }
      n.value = [...n.value, r], o.value = "", i.value = [];
    };
    Ie(n, (r) => {
      const c = r.filter(
        (k, C, x) => x.findIndex((L) => L.uid === k.uid) === C
      );
      if (c.length !== r.length) {
        n.value = c;
        return;
      }
      if (!r.some((k) => k.type === "fulltext") && r.some((k) => k.type === "scope")) {
        n.value = r.filter((k) => k.type !== "scope");
        return;
      }
      o.value = "", i.value = [], Ne(() => {
        p.value?.updateInputValue?.("", !0, !0), p.value?.hidePopup?.();
      });
    });
    const Te = (r) => {
      const c = String(r || "").trim();
      c && we({
        uid: `fulltext|${c}`,
        type: "fulltext",
        title: c,
        category: "Fulltext",
        icon: "search"
      });
    }, Ce = (r) => {
      const f = {
        date_before: "Stardate before",
        date_after: "Stardate after",
        date_exact: "Stardate exact",
        date_relative: "Stardate",
        fulltext: "Full-Text",
        scope: "In Sector"
      }[r.type];
      if (f) return f;
      const k = r.key ?? r.type;
      return F(k)?.label ?? r.category ?? r.type;
    }, ee = {
      fulltext: "teal-9",
      scope: "green-8",
      subcolumn: "light-blue-9"
    }, be = (r) => {
      if (ee[r.type]) return ee[r.type];
      const c = r.key ?? r.type;
      if (F(c)?.renderAsSublineOf)
        return ee.subcolumn;
    }, se = (r, c, f) => c?.[r.type] ?? be(r) ?? f ?? e.annotations.tokenDefaultColor ?? "indigo-9", te = (r) => se(r, e.annotations.tokenColorByType), De = (r) => se(r, e.annotations.optionBadgeColorByType, te(r)), $e = (r, c) => {
      Te(r), c(null);
    }, Ee = (r, c) => {
      c(() => {
        o.value = r, i.value = u.value.filter((f) => f.type !== "fulltext");
      });
    }, ae = (r, c) => {
      const f = F(c);
      return f?.tooltipHint ? typeof f.tooltipHint == "function" ? f.tooltipHint(r) : f.tooltipHint : "";
    }, Le = (r) => {
      if (F(r)?.sortable !== !1) {
        if (l.value.key !== r) {
          l.value = { key: r, asc: !0 };
          return;
        }
        l.value = { key: r, asc: !l.value.asc };
      }
    }, le = (r) => l.value.key !== r ? null : l.value.asc ? "arrow_upward" : "arrow_downward", X = (r, c) => {
      const f = oe(r, c);
      return z(c) ? re(f, v.value) : [{ text: f, highlighted: !1 }];
    }, Oe = (r) => re(r, [o.value]), Re = (r) => {
      const c = oe(r, "date");
      return He(c, _.value);
    };
    return (r, c) => {
      const f = W("q-avatar"), k = W("q-chip"), C = W("q-item-label"), x = W("q-icon"), L = W("q-item-section"), E = W("q-item"), B = W("q-select");
      return y(), h("div", kt, [
        O("div", St, [
          U(B, {
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
              U(k, {
                removable: "",
                dense: "",
                class: "chip",
                color: te(d.opt),
                "text-color": "white",
                onRemove: (w) => d.removeAtIndex(d.index)
              }, {
                default: q(() => [
                  d.opt.icon ? (y(), Y(f, {
                    key: 0,
                    color: "white",
                    "text-color": te(d.opt),
                    icon: d.opt.icon
                  }, null, 8, ["text-color", "icon"])) : V("", !0),
                  O("span", null, $(Ce(d.opt)) + ":", 1),
                  O("span", null, $(d.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: q((d) => [
              d.opt.type !== "fulltext" ? (y(), Y(E, Fe({ key: 0 }, d.itemProps, { class: "suggest-item" }), {
                default: q(() => [
                  U(L, null, {
                    default: q(() => [
                      U(C, { class: "suggest-title" }, {
                        default: q(() => [
                          (y(!0), h(T, null, M(Oe(d.opt.title), (w, S) => (y(), h(T, {
                            key: `${d.opt.uid}-title-${S}`
                          }, [
                            w.highlighted ? (y(), h("mark", vt, $(w.text), 1)) : (y(), h(T, { key: 1 }, [
                              P($(w.text), 1)
                            ], 64))
                          ], 64))), 128))
                        ]),
                        _: 2
                      }, 1024),
                      U(C, {
                        caption: "",
                        class: "suggest-meta"
                      }, {
                        default: q(() => [
                          d.opt.icon ? (y(), Y(x, {
                            key: 0,
                            name: d.opt.icon,
                            color: De(d.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : V("", !0),
                          P(" " + $(d.opt.category), 1),
                          (d.opt.matchCount ?? 0) > 0 ? (y(), h("span", xt, " - " + $(d.opt.matchCount) + " x", 1)) : V("", !0)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1040)) : V("", !0)
            ]),
            _: 1
          }, 8, ["modelValue", "options"])
        ]),
        O("table", wt, [
          O("colgroup", null, [
            (y(!0), h(T, null, M(m.value, (d) => (y(), h("col", {
              key: `col-${d.key}`,
              style: We(d.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          O("thead", null, [
            O("tr", null, [
              (y(!0), h(T, null, M(m.value, (d) => (y(), h("th", {
                key: d.key,
                onClick: (w) => Le(d.key)
              }, [
                d.icon ? (y(), Y(x, {
                  key: 0,
                  name: d.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : V("", !0),
                O("span", null, $(d.label), 1),
                le(d.key) ? (y(), Y(x, {
                  key: 1,
                  name: le(d.key),
                  size: "14px",
                  class: "sort-icon"
                }, null, 8, ["name"])) : V("", !0)
              ], 8, Tt))), 128))
            ])
          ]),
          O("tbody", null, [
            (y(!0), h(T, null, M(g.value, (d, w) => (y(), h("tr", { key: w }, [
              (y(!0), h(T, null, M(m.value, (S) => (y(), h("td", {
                key: S.key
              }, [
                Q(S.key).length > 0 ? (y(), h(T, { key: 0 }, [
                  O("div", null, [
                    (y(!0), h(T, null, M(X(d, S.key), (b, I) => (y(), h(T, {
                      key: `${S.key}-${w}-${I}`
                    }, [
                      b.highlighted ? (y(), h("mark", Ct, $(b.text), 1)) : (y(), h(T, { key: 1 }, [
                        P($(b.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (y(!0), h(T, null, M(Q(S.key), (b) => (y(), h("span", {
                    key: `${S.key}-${b.key}-${w}`,
                    class: "subline-value",
                    title: ae(d, b.key)
                  }, [
                    O("span", null, [
                      (y(!0), h(T, null, M(X(d, b.key), (I, Me) => (y(), h(T, {
                        key: `${b.key}-${w}-${Me}`
                      }, [
                        I.highlighted ? (y(), h("mark", Dt, $(I.text), 1)) : (y(), h(T, { key: 1 }, [
                          P($(I.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, bt))), 128))
                ], 64)) : S.key === "date" ? (y(), h("span", {
                  key: 1,
                  title: Re(d)
                }, [
                  (y(!0), h(T, null, M(X(d, S.key), (b, I) => (y(), h(T, {
                    key: `date-${w}-${I}`
                  }, [
                    b.highlighted ? (y(), h("mark", Et, $(b.text), 1)) : (y(), h(T, { key: 1 }, [
                      P($(b.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, $t)) : (y(), h("span", {
                  key: 2,
                  title: ae(d, S.key)
                }, [
                  (y(!0), h(T, null, M(X(d, S.key), (b, I) => (y(), h(T, {
                    key: `${S.key}-${w}-${I}`
                  }, [
                    b.highlighted ? (y(), h("mark", Ot, $(b.text), 1)) : (y(), h(T, { key: 1 }, [
                      P($(b.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, Lt))
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]);
    };
  }
}), Mt = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [n, s] of e)
    o[n] = s;
  return o;
}, At = /* @__PURE__ */ Mt(Rt, [["__scopeId", "data-v-dd8087fa"]]), Ft = {
  install(t) {
    t.component("TableSuggest", At);
  }
}, ke = /* @__PURE__ */ new WeakMap(), Wt = (t, e) => {
  ke.set(t, e);
}, qt = (t) => {
  const e = ke.get(t);
  if (!e)
    throw new Error(`No model annotations registered for ${t.name}`);
  return e;
};
export {
  At as TableSuggest,
  Ft as TableSuggestPlugin,
  _t as buildSuggestions,
  Ft as default,
  Wt as defineModelAnnotations,
  mt as filterItems,
  ye as formatDate,
  Pe as getAnchorWeekdayDate,
  He as getDateMouseoverLabel,
  Ve as getIsoWeekInfo,
  Be as getLocalizedWeekdaysMondayFirst,
  qt as getModelAnnotations,
  qe as getMondayIndexFromDate,
  Nt as highlightText,
  H as parseDateInput,
  Ft as plugin,
  ht as resolveEnglishLocale,
  Z as startOfDay
};
