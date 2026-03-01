import { defineComponent as Oe, ref as G, computed as N, watch as Ae, nextTick as Ie, resolveComponent as F, openBlock as p, createElementBlock as y, createElementVNode as A, createVNode as U, withCtx as W, createBlock as K, mergeProps as Me, Fragment as T, renderList as I, toDisplayString as $, createTextVNode as P, createCommentVNode as V, normalizeStyle as Ne } from "vue";
const J = (t) => {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}, H = (t) => {
  const e = String(t ?? "").trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!e) return null;
  const o = Number(e[1]), n = Number(e[2]), s = Number(e[3]), l = new Date(s, n - 1, o);
  return l.setHours(0, 0, 0, 0), l.getFullYear() !== s || l.getMonth() !== n - 1 || l.getDate() !== o ? null : l;
}, ye = (t) => {
  const e = J(t), o = String(e.getDate()).padStart(2, "0"), n = String(e.getMonth() + 1).padStart(2, "0"), s = e.getFullYear();
  return `${o}.${n}.${s}`;
}, Fe = (t) => (J(t).getDay() + 6) % 7, We = (t = "en-US") => {
  const e = new Intl.DateTimeFormat(t, { weekday: "long" }), o = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (n, s) => {
    const l = new Date(o);
    return l.setDate(o.getDate() + s), e.format(l);
  });
}, qe = (t, e, o = /* @__PURE__ */ new Date()) => {
  const n = J(o), s = Fe(n), l = new Date(n);
  if (t === "last") {
    const h = (s - e + 7) % 7 || 7;
    return l.setDate(n.getDate() - h), l;
  }
  const d = (e - s + 7) % 7 || 7;
  return l.setDate(n.getDate() + d), l;
}, Be = (t) => {
  const e = J(t), o = (e.getDay() + 6) % 7, n = new Date(e);
  n.setDate(e.getDate() - o + 3);
  const s = n.getFullYear(), l = new Date(s, 0, 4), d = (l.getDay() + 6) % 7;
  return l.setDate(l.getDate() - d + 3), { weekNo: 1 + Math.round((n.getTime() - l.getTime()) / 6048e5), weekYear: s };
}, Pe = (t, e = "en-US") => {
  const o = H(t);
  if (!o) return "";
  const n = new Intl.DateTimeFormat(e, {
    weekday: "long"
  }).format(o), { weekNo: s, weekYear: l } = Be(o);
  return `KW ${String(s).padStart(2, "0")}/${l} - ${n}`;
}, Y = (t) => String(t ?? "").replace(/[^0-9]/g, ""), he = (t) => {
  const e = Y(t);
  return e ? e.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(t ?? "");
}, X = (t, e) => {
  if (e.accessor)
    return String(e.accessor(t) ?? "");
  const o = e.key;
  return String(t[o] ?? "");
}, Ve = (t, e) => {
  if (!e.length)
    return t.columns.filter((s) => s.searchable !== !1);
  const o = new Set(e), n = /* @__PURE__ */ new Set();
  return t.columns.forEach((s) => {
    o.has(s.key) && s.scopeGroup && n.add(s.scopeGroup);
  }), t.columns.filter((s) => !o.has(s.key) && !n.has(s.scopeGroup ?? "") ? !1 : s.searchable !== !1);
}, He = (t, e, o) => {
  const n = e.columns.find((s) => s.key === o);
  return n ? X(t, n) : String(t[o] ?? "");
}, ie = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ce = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"), me = () => typeof globalThis > "u" || typeof globalThis.navigator > "u" || !Array.isArray(globalThis.navigator.languages) ? "en-US" : globalThis.navigator.languages.find((t) => String(t).toLowerCase().startsWith("en")) ?? "en-US", ze = (t, e) => {
  const o = ce(t), n = e.map((s) => String(s || "").trim()).filter((s) => s.length > 0);
  return n.length ? n.reduce((s, l) => {
    const d = Y(l), m = d.length > 0 && d === String(l) ? d.split("").map((c) => ie(c)).join("[^0-9]*") : ie(ce(l)), a = new RegExp(m, "gi");
    return s.replace(a, (c) => `<mark>${c}</mark>`);
  }, o) : o;
}, Ge = (t) => ({
  fullTextTokens: t.filter((e) => e.type === "fulltext"),
  exactTokens: t.filter((e) => !["fulltext", "scope"].includes(e.type)),
  scopedColumnKeys: t.filter((e) => e.type === "scope" && e.key).map((e) => e.key)
}), Ue = (t) => t.type === "date_before" || t.type === "date_after" || t.type === "date_exact" || t.type === "date_relative", Ke = (t) => t.key ?? (t.type.startsWith("date_") || t.type === "date_relative" ? "date" : t.type), ne = (t, e, o) => {
  const { fullTextTokens: n, exactTokens: s, scopedColumnKeys: l } = Ge(o), d = Ve(e, l);
  return t.filter((h) => {
    for (const m of s) {
      const a = Ke(m), c = e.columns.find((D) => D.key === a), _ = c ? X(h, c) : "";
      if (Ue(m)) {
        const D = H(_), L = H(m.rawTitle || m.title);
        if (!D || !L) return !1;
        const f = D.getTime(), x = L.getTime();
        if ((m.type === "date_before" || m.direction === "before") && !(f < x) || (m.type === "date_after" || m.direction === "after") && !(f > x) || (m.type === "date_exact" || m.direction === "on") && f !== x)
          return !1;
        continue;
      }
      if (c?.valueType === "number-like") {
        if (Y(_) !== Y(m.title))
          return !1;
        continue;
      }
      if (String(_).toLowerCase() !== String(m.title || "").toLowerCase())
        return !1;
    }
    for (const m of n) {
      const a = String(m.title || "").toLowerCase();
      if (!a) continue;
      if (!d.some(
        (_) => String(X(h, _)).toLowerCase().includes(a)
      )) return !1;
    }
    return !0;
  });
}, Ye = 1, je = 300, Qe = 200, Xe = 100, Je = 1e4, Ze = 1e3, et = 40, tt = 50, nt = 30, rt = 6, ue = 3, ot = (t, e) => `${t}|${e}`, de = (t) => t.valueType === "number-like", fe = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), st = (t) => {
  const e = t.trim().toLowerCase();
  if (!e) return null;
  const o = e.startsWith("date ") ? e.slice(5).trim() : e, n = o.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
  if (n) {
    const l = String(n[1]).toLowerCase(), d = String(n[2] || "").toLowerCase() || null, h = String(n[3] || "").trim().toLowerCase();
    return h ? { direction: l, anchor: d, weekdayPart: h, needle: o } : null;
  }
  const s = o.match(/^(last|next)\s+(.+)$/i);
  if (s) {
    const l = String(s[1]).toLowerCase(), d = String(s[2] || "").trim().toLowerCase();
    return d ? { direction: "on", anchor: l, weekdayPart: d, needle: o } : null;
  }
  return null;
}, at = (t, e, o) => {
  if (String(o || "").trim().length < 4 || e.some((c) => c.type === "date_relative")) return [];
  const n = st(o);
  if (!n) return [];
  const s = t.locale ?? me(), l = We(s).map((c, _) => ({
    weekday: c,
    weekdayIndexMonday: _,
    weekdayLower: c.toLowerCase()
  })).filter((c) => c.weekdayLower.startsWith(n.weekdayPart)), d = n.anchor ? [n.anchor] : n.direction === "before" ? ["last", "next"] : ["next", "last"], h = [], m = /* @__PURE__ */ new Set();
  d.forEach((c) => {
    l.forEach((_) => {
      const D = qe(c, _.weekdayIndexMonday), L = ye(D), x = `${n.direction === "before" ? c === "last" ? "before last" : "before next" : n.direction === "after" ? c === "last" ? "after last" : "after next" : c === "last" ? "on last" : "on next"} ${_.weekday}`;
      m.has(x) || (m.add(x), h.push({
        uid: `date_relative|${n.direction}|${c}|${_.weekdayIndexMonday}|${L}`,
        type: "date_relative",
        title: x,
        rawTitle: L,
        category: n.direction === "before" ? "date before" : n.direction === "after" ? "date after" : "date exact",
        icon: "event_repeat",
        direction: n.direction,
        anchor: c
      }));
    });
  });
  const a = (c) => {
    const _ = c.toLowerCase();
    return _ === n.needle ? 3 : _.startsWith(n.needle) ? 2 : _.includes(n.needle) ? 1 : 0;
  };
  return h.sort((c, _) => {
    const D = a(_.title) - a(c.title);
    return D !== 0 ? D : c.title.localeCompare(_.title);
  }).slice(0, t.maxWeekdaySuggestions ?? 3);
}, lt = (t, e) => {
  const o = H(e);
  if (!o) return [];
  const n = new Set(t.map((d) => d.type)), s = ye(o);
  return [
    { type: "date_before", category: "date before", icon: "event_busy" },
    { type: "date_after", category: "date after", icon: "event_available" },
    { type: "date_exact", category: "date exact", icon: "event" }
  ].filter((d) => !n.has(d.type)).map((d) => ({
    uid: `${d.type}|${s}`,
    type: d.type,
    title: s,
    rawTitle: s,
    category: d.category,
    icon: d.icon
  }));
}, it = (t, e) => {
  if (!e) return 0;
  const o = t.indexOf(e);
  return o < 0 ? -1 : o === 0 ? je : o + e.length === t.length ? Xe : Qe;
}, ct = (t, e) => {
  if (!e) return 0;
  const o = String(t || "").split(/\s+/).filter((s) => s.length > 0);
  let n = -1;
  return o.forEach((s, l) => {
    const d = it(s, e);
    if (d < 0) return;
    const h = Je - l * Ze + d;
    h > n && (n = h);
  }), n;
}, _e = (t, e, o) => {
  if (!o) return 1;
  const n = String(t || "").toLowerCase(), s = ct(n, o);
  if (s < 0) return -1;
  const d = String(e || "").toLowerCase().includes(o) ? et : 0, h = n === o ? tt : 0, m = Math.min(
    nt,
    Math.floor(n.length / rt)
  );
  return s + d + h - m;
}, ut = (t, e) => {
  const o = String(t ?? "").toLowerCase();
  if (!o || !e) return 0;
  const n = Y(e), l = n.length > 0 && n === String(e) ? n.split("").map((m) => fe(m)).join("[^0-9]*") : fe(String(e)), d = new RegExp(l, "gi"), h = o.match(d);
  return h ? h.length : 0;
}, dt = (t, e, o, n) => {
  if (!n.length) return 0;
  const s = [o];
  return t.reduce((l, d) => {
    const h = n.reduce((m, a) => {
      const c = s.reduce((_, D) => _ + ut(He(d, e, D), a), 0);
      return m + c;
    }, 0);
    return l + h;
  }, 0);
}, ge = (t, e, o, n) => {
  const s = new Set(
    o.map((f) => f.type).filter((f) => f && !["fulltext", "scope"].includes(f))
  ), l = [], d = /* @__PURE__ */ new Set(), h = ne(t, e, o);
  e.columns.filter((f) => f.suggestionEnabled !== !1).forEach((f) => {
    s.has(f.key) || new Set(h.map((x) => X(x, f))).forEach((x) => {
      const R = String(x ?? "");
      if (!R) return;
      const q = ot(f.key, R);
      if (d.has(q)) return;
      d.add(q);
      const z = de(f) ? he(R) : R, Z = de(f) ? R : z, j = _e(Z, f.label, n);
      j < 0 && n.length > 0 || l.push({
        uid: q,
        type: f.key,
        key: f.key,
        title: z,
        rawTitle: R,
        category: f.label,
        icon: f.icon,
        _score: j,
        _columnType: f.key
      });
    });
  });
  const m = (f, x) => x._score !== f._score ? x._score - f._score : f.title.localeCompare(x.title), a = l.slice().sort(m), c = [], _ = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Set();
  a.slice(0, ue).forEach((f) => {
    _.has(f.uid) || (_.add(f.uid), D.add(f._columnType), c.push(f));
  });
  const L = a.slice(ue);
  return L.forEach((f) => {
    _.has(f.uid) || D.has(f._columnType) || (_.add(f.uid), D.add(f._columnType), c.push(f));
  }), L.forEach((f) => {
    _.has(f.uid) || (_.add(f.uid), c.push(f));
  }), c.map((f) => {
    const x = { ...f };
    return delete x._score, delete x._columnType, x;
  });
}, ft = (t, e, o, n) => {
  const s = o.filter((a) => a.type === "fulltext").map((a) => String(a.title || "").toLowerCase()).filter((a) => a.length > 0), l = o.filter((a) => !["fulltext", "scope"].includes(a.type)), d = ne(t, e, l), h = new Set(
    o.filter((a) => a.type === "scope" && a.key).map((a) => a.key)
  );
  return e.columns.filter((a) => a.searchable !== !1).filter((a) => !h.has(a.key)).map((a) => {
    const c = dt(d, e, a.key, s), _ = n.length === 0 ? 1 : _e(a.label, "Fulltext scope", n);
    return {
      uid: `scope|${a.key}`,
      type: "scope",
      key: a.key,
      title: a.label,
      category: "Fulltext scope",
      icon: a.icon,
      matchCount: c,
      _score: _
    };
  }).filter((a) => a.matchCount > 0).filter((a) => n.length === 0 || a._score >= 0).sort((a, c) => c.matchCount !== a.matchCount ? c.matchCount - a.matchCount : c._score !== a._score ? c._score - a._score : a.title.localeCompare(c.title)).map((a) => {
    const c = { ...a };
    return delete c._score, c;
  });
}, pe = (...t) => {
  const e = [], o = /* @__PURE__ */ new Set();
  return t.flat().forEach((n) => {
    o.has(n.uid) || (o.add(n.uid), e.push(n));
  }), e;
}, gt = (t, e, o, n) => {
  const s = String(n || "").trim().toLowerCase(), l = e.maxSuggestions ?? 7, d = lt(o, n), h = at(e, o, n);
  if (o.some((a) => a.type === "fulltext")) {
    const a = ft(t, e, o, s), c = ge(t, e, o, s);
    return pe(d, h, a, c).slice(0, l);
  }
  return d.length > 0 || h.length > 0 ? pe(d, h).slice(0, l) : s.length < Ye ? [] : ge(t, e, o, s).slice(0, l);
}, pt = () => me(), It = (t, e) => ze(t, e), yt = (t, e, o) => ne(t, e, o), ht = (t, e, o, n) => gt(t, e, o, n), mt = { class: "table-suggest" }, _t = { class: "search-wrap" }, kt = { key: 0 }, St = { key: 1 }, vt = { class: "data-table" }, xt = ["onClick"], wt = { key: 0 }, Tt = ["title"], Ct = { key: 0 }, bt = ["title"], Dt = { key: 0 }, $t = ["title"], Et = { key: 0 }, Lt = /* @__PURE__ */ Oe({
  __name: "TableSuggest",
  props: {
    items: {},
    annotations: {}
  },
  setup(t) {
    const e = t, o = G(""), n = G([]), s = G({ key: "id", asc: !0 }), l = G([]), d = G(null), h = N(() => e.annotations.locale ?? pt()), m = N(
      () => ht(e.items, e.annotations, n.value, o.value)
    ), a = N(
      () => e.annotations.columns.filter((r) => !r.renderAsSublineOf)
    ), c = N(() => {
      const r = /* @__PURE__ */ new Map();
      return e.annotations.columns.forEach((i) => {
        const g = i.renderAsSublineOf;
        if (!g) return;
        const k = r.get(g) ?? [];
        r.set(g, [...k, i]);
      }), r;
    }), _ = N(() => yt(e.items, e.annotations, n.value)), D = N(() => {
      const r = e.annotations.columns.find((g) => g.key === s.value.key), i = _.value.slice();
      return !r || r.sortable === !1 || i.sort((g, k) => {
        const C = (E) => r.accessor ? String(r.accessor(E) ?? "") : String(E[r.key] ?? ""), v = C(g), O = C(k);
        if (r.key === "date") {
          const E = H(v), B = H(O), u = E ? E.getTime() : -1 / 0, w = B ? B.getTime() : -1 / 0;
          return s.value.asc ? u - w : w - u;
        }
        return s.value.asc ? v.localeCompare(O) : O.localeCompare(v);
      }), i;
    }), L = N(
      () => n.value.filter((r) => r.type === "fulltext").map((r) => r.title)
    ), f = N(
      () => n.value.filter((r) => r.type === "scope" && r.key).map((r) => r.key)
    ), x = (r) => {
      if (!L.value.length) return !1;
      if (!f.value.length) return !0;
      const i = new Set(f.value), g = e.annotations.columns.filter((v) => i.has(v.key)), k = new Set(g.map((v) => v.scopeGroup).filter(Boolean));
      if (i.has(r)) return !0;
      const C = e.annotations.columns.find((v) => v.key === r);
      return C?.scopeGroup ? k.has(C.scopeGroup) : !1;
    }, R = (r) => e.annotations.columns.find((i) => i.key === r), q = (r) => c.value.get(r) ?? [], z = (r) => String(r).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Z = (r) => String(r || "").replace(/[^0-9]/g, ""), j = (r) => {
      const i = Z(r);
      return i.length > 0 && i === r ? i.split("").map((k) => z(k)).join("[^0-9]*") : z(r);
    }, Se = (r) => {
      if (!r.length) return [];
      const i = r.slice().sort((k, C) => k.start - C.start), g = [i[0]];
      return i.slice(1).forEach((k) => {
        const C = g[g.length - 1];
        if (k.start <= C.end) {
          C.end = Math.max(C.end, k.end);
          return;
        }
        g.push({ ...k });
      }), g;
    }, re = (r, i) => {
      const g = String(r ?? ""), k = Array.from(
        new Set(i.map((S) => String(S || "").trim()).filter((S) => S.length > 0))
      );
      if (!k.length)
        return [{ text: g, highlighted: !1 }];
      const C = k.slice().sort((S, b) => b.length - S.length).map((S) => j(S)).join("|"), v = new RegExp(C, "gi"), O = [];
      let E = v.exec(g);
      for (; E; ) {
        const S = E[0] ?? "";
        S.length > 0 && O.push({ start: E.index, end: E.index + S.length }), S.length === 0 && (v.lastIndex += 1), E = v.exec(g);
      }
      if (!O.length)
        return [{ text: g, highlighted: !1 }];
      const B = Se(O), u = [];
      let w = 0;
      return B.forEach((S) => {
        S.start > w && u.push({ text: g.slice(w, S.start), highlighted: !1 }), u.push({ text: g.slice(S.start, S.end), highlighted: !0 }), w = S.end;
      }), w < g.length && u.push({ text: g.slice(w), highlighted: !1 }), u;
    }, oe = (r, i) => {
      const g = R(i), k = (v) => g?.valueType === "number-like" ? he(v) : String(v ?? "");
      return g?.accessor ? k(g.accessor(r)) : k(r[i]);
    }, ve = (r) => {
      if (n.value.some((i) => i.uid === r.uid)) {
        o.value = "", l.value = [];
        return;
      }
      n.value = [...n.value, r], o.value = "", l.value = [];
    };
    Ae(n, (r) => {
      const i = r.filter(
        (k, C, v) => v.findIndex((O) => O.uid === k.uid) === C
      );
      if (i.length !== r.length) {
        n.value = i;
        return;
      }
      if (!r.some((k) => k.type === "fulltext") && r.some((k) => k.type === "scope")) {
        n.value = r.filter((k) => k.type !== "scope");
        return;
      }
      o.value = "", l.value = [], Ie(() => {
        d.value?.updateInputValue?.("", !0, !0), d.value?.hidePopup?.();
      });
    });
    const xe = (r) => {
      const i = String(r || "").trim();
      i && ve({
        uid: `fulltext|${i}`,
        type: "fulltext",
        title: i,
        category: "Fulltext",
        icon: "search"
      });
    }, we = (r) => {
      const g = {
        date_before: "Stardate before",
        date_after: "Stardate after",
        date_exact: "Stardate exact",
        date_relative: "Stardate",
        fulltext: "Full-Text",
        scope: "In Sector"
      }[r.type];
      if (g) return g;
      const k = r.key ?? r.type;
      return R(k)?.label ?? r.category ?? r.type;
    }, ee = {
      fulltext: "teal-9",
      scope: "green-8",
      subcolumn: "light-blue-9"
    }, Te = (r) => {
      if (ee[r.type]) return ee[r.type];
      const i = r.key ?? r.type;
      if (R(i)?.renderAsSublineOf)
        return ee.subcolumn;
    }, se = (r, i, g) => i?.[r.type] ?? Te(r) ?? g ?? e.annotations.tokenDefaultColor ?? "indigo-9", te = (r) => se(r, e.annotations.tokenColorByType), Ce = (r) => se(r, e.annotations.optionBadgeColorByType, te(r)), be = (r, i) => {
      xe(r), i(null);
    }, De = (r, i) => {
      i(() => {
        o.value = r, l.value = m.value.filter((g) => g.type !== "fulltext");
      });
    }, ae = (r, i) => {
      const g = R(i);
      return g?.tooltipHint ? typeof g.tooltipHint == "function" ? g.tooltipHint(r) : g.tooltipHint : "";
    }, $e = (r) => {
      if (s.value.key !== r) {
        s.value = { key: r, asc: !0 };
        return;
      }
      s.value = { key: r, asc: !s.value.asc };
    }, le = (r) => s.value.key !== r ? null : s.value.asc ? "arrow_upward" : "arrow_downward", Q = (r, i) => {
      const g = oe(r, i);
      return x(i) ? re(g, L.value) : [{ text: g, highlighted: !1 }];
    }, Ee = (r) => re(r, [o.value]), Le = (r) => {
      const i = oe(r, "date");
      return Pe(i, h.value);
    };
    return (r, i) => {
      const g = F("q-avatar"), k = F("q-chip"), C = F("q-item-label"), v = F("q-icon"), O = F("q-item-section"), E = F("q-item"), B = F("q-select");
      return p(), y("div", mt, [
        A("div", _t, [
          U(B, {
            ref_key: "qSelectRef",
            ref: d,
            modelValue: n.value,
            "onUpdate:modelValue": i[0] || (i[0] = (u) => n.value = u),
            class: "search-field",
            "input-class": "search-input",
            label: "Search",
            "use-input": "",
            "use-chips": "",
            multiple: "",
            "input-debounce": "0",
            "option-label": "title",
            "option-value": "uid",
            options: l.value,
            onNewValue: be,
            onFilter: De
          }, {
            "selected-item": W((u) => [
              U(k, {
                removable: "",
                dense: "",
                class: "chip",
                color: te(u.opt),
                "text-color": "white",
                onRemove: (w) => u.removeAtIndex(u.index)
              }, {
                default: W(() => [
                  u.opt.icon ? (p(), K(g, {
                    key: 0,
                    color: "white",
                    "text-color": te(u.opt),
                    icon: u.opt.icon
                  }, null, 8, ["text-color", "icon"])) : V("", !0),
                  A("span", null, $(we(u.opt)) + ":", 1),
                  A("span", null, $(u.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: W((u) => [
              u.opt.type !== "fulltext" ? (p(), K(E, Me({ key: 0 }, u.itemProps, { class: "suggest-item" }), {
                default: W(() => [
                  U(O, null, {
                    default: W(() => [
                      U(C, { class: "suggest-title" }, {
                        default: W(() => [
                          (p(!0), y(T, null, I(Ee(u.opt.title), (w, S) => (p(), y(T, {
                            key: `${u.opt.uid}-title-${S}`
                          }, [
                            w.highlighted ? (p(), y("mark", kt, $(w.text), 1)) : (p(), y(T, { key: 1 }, [
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
                        default: W(() => [
                          u.opt.icon ? (p(), K(v, {
                            key: 0,
                            name: u.opt.icon,
                            color: Ce(u.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : V("", !0),
                          P(" " + $(u.opt.category), 1),
                          (u.opt.matchCount ?? 0) > 0 ? (p(), y("span", St, " - " + $(u.opt.matchCount) + " x", 1)) : V("", !0)
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
        A("table", vt, [
          A("colgroup", null, [
            (p(!0), y(T, null, I(a.value, (u) => (p(), y("col", {
              key: `col-${u.key}`,
              style: Ne(u.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          A("thead", null, [
            A("tr", null, [
              (p(!0), y(T, null, I(a.value, (u) => (p(), y("th", {
                key: u.key,
                onClick: (w) => $e(u.key)
              }, [
                u.icon ? (p(), K(v, {
                  key: 0,
                  name: u.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : V("", !0),
                A("span", null, $(u.label), 1),
                le(u.key) ? (p(), K(v, {
                  key: 1,
                  name: le(u.key),
                  size: "14px",
                  class: "sort-icon"
                }, null, 8, ["name"])) : V("", !0)
              ], 8, xt))), 128))
            ])
          ]),
          A("tbody", null, [
            (p(!0), y(T, null, I(D.value, (u, w) => (p(), y("tr", { key: w }, [
              (p(!0), y(T, null, I(a.value, (S) => (p(), y("td", {
                key: S.key
              }, [
                q(S.key).length > 0 ? (p(), y(T, { key: 0 }, [
                  A("div", null, [
                    (p(!0), y(T, null, I(Q(u, S.key), (b, M) => (p(), y(T, {
                      key: `${S.key}-${w}-${M}`
                    }, [
                      b.highlighted ? (p(), y("mark", wt, $(b.text), 1)) : (p(), y(T, { key: 1 }, [
                        P($(b.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (p(!0), y(T, null, I(q(S.key), (b) => (p(), y("span", {
                    key: `${S.key}-${b.key}-${w}`,
                    class: "subline-value",
                    title: ae(u, b.key)
                  }, [
                    A("span", null, [
                      (p(!0), y(T, null, I(Q(u, b.key), (M, Re) => (p(), y(T, {
                        key: `${b.key}-${w}-${Re}`
                      }, [
                        M.highlighted ? (p(), y("mark", Ct, $(M.text), 1)) : (p(), y(T, { key: 1 }, [
                          P($(M.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, Tt))), 128))
                ], 64)) : S.key === "date" ? (p(), y("span", {
                  key: 1,
                  title: Le(u)
                }, [
                  (p(!0), y(T, null, I(Q(u, S.key), (b, M) => (p(), y(T, {
                    key: `date-${w}-${M}`
                  }, [
                    b.highlighted ? (p(), y("mark", Dt, $(b.text), 1)) : (p(), y(T, { key: 1 }, [
                      P($(b.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, bt)) : (p(), y("span", {
                  key: 2,
                  title: ae(u, S.key)
                }, [
                  (p(!0), y(T, null, I(Q(u, S.key), (b, M) => (p(), y(T, {
                    key: `${S.key}-${w}-${M}`
                  }, [
                    b.highlighted ? (p(), y("mark", Et, $(b.text), 1)) : (p(), y(T, { key: 1 }, [
                      P($(b.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, $t))
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]);
    };
  }
}), Rt = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [n, s] of e)
    o[n] = s;
  return o;
}, Ot = /* @__PURE__ */ Rt(Lt, [["__scopeId", "data-v-d3498013"]]), Mt = {
  install(t) {
    t.component("TableSuggest", Ot);
  }
}, ke = /* @__PURE__ */ new WeakMap(), Nt = (t, e) => {
  ke.set(t, e);
}, Ft = (t) => {
  const e = ke.get(t);
  if (!e)
    throw new Error(`No model annotations registered for ${t.name}`);
  return e;
};
export {
  Ot as TableSuggest,
  Mt as TableSuggestPlugin,
  ht as buildSuggestions,
  Mt as default,
  Nt as defineModelAnnotations,
  yt as filterItems,
  ye as formatDate,
  qe as getAnchorWeekdayDate,
  Pe as getDateMouseoverLabel,
  Be as getIsoWeekInfo,
  We as getLocalizedWeekdaysMondayFirst,
  Ft as getModelAnnotations,
  Fe as getMondayIndexFromDate,
  It as highlightText,
  H as parseDateInput,
  Mt as plugin,
  pt as resolveEnglishLocale,
  J as startOfDay
};
