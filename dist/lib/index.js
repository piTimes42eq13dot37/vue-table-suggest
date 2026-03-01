import { defineComponent as Re, ref as z, computed as I, watch as Oe, nextTick as Ae, resolveComponent as F, openBlock as p, createElementBlock as y, createElementVNode as A, createVNode as G, withCtx as W, createBlock as Q, mergeProps as Me, Fragment as w, renderList as M, toDisplayString as $, createTextVNode as P, createCommentVNode as U, normalizeStyle as Ne } from "vue";
const J = (t) => {
  const e = new Date(t);
  return e.setHours(0, 0, 0, 0), e;
}, V = (t) => {
  const e = String(t ?? "").trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!e) return null;
  const r = Number(e[1]), n = Number(e[2]), s = Number(e[3]), l = new Date(s, n - 1, r);
  return l.setHours(0, 0, 0, 0), l.getFullYear() !== s || l.getMonth() !== n - 1 || l.getDate() !== r ? null : l;
}, pe = (t) => {
  const e = J(t), r = String(e.getDate()).padStart(2, "0"), n = String(e.getMonth() + 1).padStart(2, "0"), s = e.getFullYear();
  return `${r}.${n}.${s}`;
}, Ie = (t) => (J(t).getDay() + 6) % 7, Fe = (t = "en-US") => {
  const e = new Intl.DateTimeFormat(t, { weekday: "long" }), r = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (n, s) => {
    const l = new Date(r);
    return l.setDate(r.getDate() + s), e.format(l);
  });
}, We = (t, e, r = /* @__PURE__ */ new Date()) => {
  const n = J(r), s = Ie(n), l = new Date(n);
  if (t === "last") {
    const h = (s - e + 7) % 7 || 7;
    return l.setDate(n.getDate() - h), l;
  }
  const u = (e - s + 7) % 7 || 7;
  return l.setDate(n.getDate() + u), l;
}, qe = (t) => {
  const e = J(t), r = (e.getDay() + 6) % 7, n = new Date(e);
  n.setDate(e.getDate() - r + 3);
  const s = n.getFullYear(), l = new Date(s, 0, 4), u = (l.getDay() + 6) % 7;
  return l.setDate(l.getDate() - u + 3), { weekNo: 1 + Math.round((n.getTime() - l.getTime()) / 6048e5), weekYear: s };
}, Be = (t, e = "en-US") => {
  const r = V(t);
  if (!r) return "";
  const n = new Intl.DateTimeFormat(e, {
    weekday: "long"
  }).format(r), { weekNo: s, weekYear: l } = qe(r);
  return `KW ${String(s).padStart(2, "0")}/${l} - ${n}`;
}, K = (t) => String(t ?? "").replace(/[^0-9]/g, ""), ye = (t) => {
  const e = K(t);
  return e ? e.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(t ?? "");
}, X = (t, e) => {
  if (e.accessor)
    return String(e.accessor(t) ?? "");
  const r = e.key;
  return String(t[r] ?? "");
}, Pe = (t, e) => {
  if (!e.length)
    return t.columns.filter((s) => s.searchable !== !1);
  const r = new Set(e), n = /* @__PURE__ */ new Set();
  return t.columns.forEach((s) => {
    r.has(s.key) && s.scopeGroup && n.add(s.scopeGroup);
  }), t.columns.filter((s) => !r.has(s.key) && !n.has(s.scopeGroup ?? "") ? !1 : s.searchable !== !1);
}, Ve = (t, e, r) => {
  const n = e.columns.find((s) => s.key === r);
  return n ? X(t, n) : String(t[r] ?? "");
}, le = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ie = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"), he = () => typeof globalThis > "u" || typeof globalThis.navigator > "u" || !Array.isArray(globalThis.navigator.languages) ? "en-US" : globalThis.navigator.languages.find((t) => String(t).toLowerCase().startsWith("en")) ?? "en-US", He = (t, e) => {
  const r = ie(t), n = e.map((s) => String(s || "").trim()).filter((s) => s.length > 0);
  return n.length ? n.reduce((s, l) => {
    const u = K(l), m = u.length > 0 && u === String(l) ? u.split("").map((c) => le(c)).join("[^0-9]*") : le(ie(l)), a = new RegExp(m, "gi");
    return s.replace(a, (c) => `<mark>${c}</mark>`);
  }, r) : r;
}, ze = (t) => ({
  fullTextTokens: t.filter((e) => e.type === "fulltext"),
  exactTokens: t.filter((e) => !["fulltext", "scope"].includes(e.type)),
  scopedColumnKeys: t.filter((e) => e.type === "scope" && e.key).map((e) => e.key)
}), Ge = (t) => t.type === "date_before" || t.type === "date_after" || t.type === "date_exact" || t.type === "date_relative", Ue = (t) => t.key ?? (t.type.startsWith("date_") || t.type === "date_relative" ? "date" : t.type), ne = (t, e, r) => {
  const { fullTextTokens: n, exactTokens: s, scopedColumnKeys: l } = ze(r), u = Pe(e, l);
  return t.filter((h) => {
    for (const m of s) {
      const a = Ue(m), c = e.columns.find((D) => D.key === a), _ = c ? X(h, c) : "";
      if (Ge(m)) {
        const D = V(_), L = V(m.rawTitle || m.title);
        if (!D || !L) return !1;
        const d = D.getTime(), x = L.getTime();
        if ((m.type === "date_before" || m.direction === "before") && !(d < x) || (m.type === "date_after" || m.direction === "after") && !(d > x) || (m.type === "date_exact" || m.direction === "on") && d !== x)
          return !1;
        continue;
      }
      if (c?.valueType === "number-like") {
        if (K(_) !== K(m.title))
          return !1;
        continue;
      }
      if (String(_).toLowerCase() !== String(m.title || "").toLowerCase())
        return !1;
    }
    for (const m of n) {
      const a = String(m.title || "").toLowerCase();
      if (!a) continue;
      if (!u.some(
        (_) => String(X(h, _)).toLowerCase().includes(a)
      )) return !1;
    }
    return !0;
  });
}, Ke = 1, Ye = 300, je = 200, Qe = 100, Xe = 1e4, Je = 1e3, Ze = 40, et = 50, tt = 30, nt = 6, ce = 3, ot = (t, e) => `${t}|${e}`, ue = (t) => t.valueType === "number-like", de = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), rt = (t) => {
  const e = t.trim().toLowerCase();
  if (!e) return null;
  const r = e.startsWith("date ") ? e.slice(5).trim() : e, n = r.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
  if (n) {
    const l = String(n[1]).toLowerCase(), u = String(n[2] || "").toLowerCase() || null, h = String(n[3] || "").trim().toLowerCase();
    return h ? { direction: l, anchor: u, weekdayPart: h, needle: r } : null;
  }
  const s = r.match(/^(last|next)\s+(.+)$/i);
  if (s) {
    const l = String(s[1]).toLowerCase(), u = String(s[2] || "").trim().toLowerCase();
    return u ? { direction: "on", anchor: l, weekdayPart: u, needle: r } : null;
  }
  return null;
}, st = (t, e, r) => {
  if (String(r || "").trim().length < 4 || e.some((c) => c.type === "date_relative")) return [];
  const n = rt(r);
  if (!n) return [];
  const s = t.locale ?? he(), l = Fe(s).map((c, _) => ({
    weekday: c,
    weekdayIndexMonday: _,
    weekdayLower: c.toLowerCase()
  })).filter((c) => c.weekdayLower.startsWith(n.weekdayPart)), u = n.anchor ? [n.anchor] : n.direction === "before" ? ["last", "next"] : ["next", "last"], h = [], m = /* @__PURE__ */ new Set();
  u.forEach((c) => {
    l.forEach((_) => {
      const D = We(c, _.weekdayIndexMonday), L = pe(D), x = `${n.direction === "before" ? c === "last" ? "before last" : "before next" : n.direction === "after" ? c === "last" ? "after last" : "after next" : c === "last" ? "on last" : "on next"} ${_.weekday}`;
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
}, at = (t, e) => {
  const r = V(e);
  if (!r) return [];
  const n = new Set(t.map((u) => u.type)), s = pe(r);
  return [
    { type: "date_before", category: "date before", icon: "event_busy" },
    { type: "date_after", category: "date after", icon: "event_available" },
    { type: "date_exact", category: "date exact", icon: "event" }
  ].filter((u) => !n.has(u.type)).map((u) => ({
    uid: `${u.type}|${s}`,
    type: u.type,
    title: s,
    rawTitle: s,
    category: u.category,
    icon: u.icon
  }));
}, lt = (t, e) => {
  if (!e) return 0;
  const r = t.indexOf(e);
  return r < 0 ? -1 : r === 0 ? Ye : r + e.length === t.length ? Qe : je;
}, it = (t, e) => {
  if (!e) return 0;
  const r = String(t || "").split(/\s+/).filter((s) => s.length > 0);
  let n = -1;
  return r.forEach((s, l) => {
    const u = lt(s, e);
    if (u < 0) return;
    const h = Xe - l * Je + u;
    h > n && (n = h);
  }), n;
}, me = (t, e, r) => {
  if (!r) return 1;
  const n = String(t || "").toLowerCase(), s = it(n, r);
  if (s < 0) return -1;
  const u = String(e || "").toLowerCase().includes(r) ? Ze : 0, h = n === r ? et : 0, m = Math.min(
    tt,
    Math.floor(n.length / nt)
  );
  return s + u + h - m;
}, ct = (t, e) => {
  const r = String(t ?? "").toLowerCase();
  if (!r || !e) return 0;
  const n = K(e), l = n.length > 0 && n === String(e) ? n.split("").map((m) => de(m)).join("[^0-9]*") : de(String(e)), u = new RegExp(l, "gi"), h = r.match(u);
  return h ? h.length : 0;
}, ut = (t, e, r, n) => {
  if (!n.length) return 0;
  const s = [r];
  return t.reduce((l, u) => {
    const h = n.reduce((m, a) => {
      const c = s.reduce((_, D) => _ + ct(Ve(u, e, D), a), 0);
      return m + c;
    }, 0);
    return l + h;
  }, 0);
}, fe = (t, e, r, n) => {
  const s = new Set(
    r.map((d) => d.type).filter((d) => d && !["fulltext", "scope"].includes(d))
  ), l = [], u = /* @__PURE__ */ new Set(), h = ne(t, e, r);
  e.columns.filter((d) => d.suggestionEnabled !== !1).forEach((d) => {
    s.has(d.key) || new Set(h.map((x) => X(x, d))).forEach((x) => {
      const R = String(x ?? "");
      if (!R) return;
      const q = ot(d.key, R);
      if (u.has(q)) return;
      u.add(q);
      const H = ue(d) ? ye(R) : R, Z = ue(d) ? R : H, Y = me(Z, d.label, n);
      Y < 0 && n.length > 0 || l.push({
        uid: q,
        type: d.key,
        key: d.key,
        title: H,
        rawTitle: R,
        category: d.label,
        icon: d.icon,
        _score: Y,
        _columnType: d.key
      });
    });
  });
  const m = (d, x) => x._score !== d._score ? x._score - d._score : d.title.localeCompare(x.title), a = l.slice().sort(m), c = [], _ = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Set();
  a.slice(0, ce).forEach((d) => {
    _.has(d.uid) || (_.add(d.uid), D.add(d._columnType), c.push(d));
  });
  const L = a.slice(ce);
  return L.forEach((d) => {
    _.has(d.uid) || D.has(d._columnType) || (_.add(d.uid), D.add(d._columnType), c.push(d));
  }), L.forEach((d) => {
    _.has(d.uid) || (_.add(d.uid), c.push(d));
  }), c.map((d) => {
    const x = { ...d };
    return delete x._score, delete x._columnType, x;
  });
}, dt = (t, e, r, n) => {
  const s = r.filter((a) => a.type === "fulltext").map((a) => String(a.title || "").toLowerCase()).filter((a) => a.length > 0), l = r.filter((a) => !["fulltext", "scope"].includes(a.type)), u = ne(t, e, l), h = new Set(
    r.filter((a) => a.type === "scope" && a.key).map((a) => a.key)
  );
  return e.columns.filter((a) => a.searchable !== !1).filter((a) => !h.has(a.key)).map((a) => {
    const c = ut(u, e, a.key, s), _ = n.length === 0 ? 1 : me(a.label, "Fulltext scope", n);
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
}, ge = (...t) => {
  const e = [], r = /* @__PURE__ */ new Set();
  return t.flat().forEach((n) => {
    r.has(n.uid) || (r.add(n.uid), e.push(n));
  }), e;
}, ft = (t, e, r, n) => {
  const s = String(n || "").trim().toLowerCase(), l = e.maxSuggestions ?? 7, u = at(r, n), h = st(e, r, n);
  if (r.some((a) => a.type === "fulltext")) {
    const a = dt(t, e, r, s), c = fe(t, e, r, s);
    return ge(u, h, a, c).slice(0, l);
  }
  return u.length > 0 || h.length > 0 ? ge(u, h).slice(0, l) : s.length < Ke ? [] : fe(t, e, r, s).slice(0, l);
}, gt = () => he(), At = (t, e) => He(t, e), pt = (t, e, r) => ne(t, e, r), yt = (t, e, r, n) => ft(t, e, r, n), ht = { class: "table-suggest" }, mt = { class: "search-wrap" }, _t = { key: 0 }, kt = { key: 1 }, St = { class: "data-table" }, xt = ["onClick"], vt = { key: 0 }, Tt = ["title"], wt = { key: 0 }, Ct = ["title"], bt = { key: 0 }, Dt = ["title"], $t = { key: 0 }, Et = /* @__PURE__ */ Re({
  __name: "TableSuggest",
  props: {
    items: {},
    annotations: {}
  },
  setup(t) {
    const e = t, r = z(""), n = z([]), s = z({ key: "id", asc: !0 }), l = z([]), u = z(null), h = I(() => e.annotations.locale ?? gt()), m = I(
      () => yt(e.items, e.annotations, n.value, r.value)
    ), a = I(
      () => e.annotations.columns.filter((o) => !o.renderAsSublineOf)
    ), c = I(() => {
      const o = /* @__PURE__ */ new Map();
      return e.annotations.columns.forEach((i) => {
        const f = i.renderAsSublineOf;
        if (!f) return;
        const k = o.get(f) ?? [];
        o.set(f, [...k, i]);
      }), o;
    }), _ = I(() => pt(e.items, e.annotations, n.value)), D = I(() => {
      const o = e.annotations.columns.find((f) => f.key === s.value.key), i = _.value.slice();
      return !o || o.sortable === !1 || i.sort((f, k) => {
        const C = (E) => o.accessor ? String(o.accessor(E) ?? "") : String(E[o.key] ?? ""), v = C(f), O = C(k);
        if (o.key === "date") {
          const E = V(v), B = V(O), g = E ? E.getTime() : -1 / 0, T = B ? B.getTime() : -1 / 0;
          return s.value.asc ? g - T : T - g;
        }
        return s.value.asc ? v.localeCompare(O) : O.localeCompare(v);
      }), i;
    }), L = I(
      () => n.value.filter((o) => o.type === "fulltext").map((o) => o.title)
    ), d = I(
      () => n.value.filter((o) => o.type === "scope" && o.key).map((o) => o.key)
    ), x = (o) => {
      if (!L.value.length) return !1;
      if (!d.value.length) return !0;
      const i = new Set(d.value), f = e.annotations.columns.filter((v) => i.has(v.key)), k = new Set(f.map((v) => v.scopeGroup).filter(Boolean));
      if (i.has(o)) return !0;
      const C = e.annotations.columns.find((v) => v.key === o);
      return C?.scopeGroup ? k.has(C.scopeGroup) : !1;
    }, R = (o) => e.annotations.columns.find((i) => i.key === o), q = (o) => c.value.get(o) ?? [], H = (o) => String(o).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Z = (o) => String(o || "").replace(/[^0-9]/g, ""), Y = (o) => {
      const i = Z(o);
      return i.length > 0 && i === o ? i.split("").map((k) => H(k)).join("[^0-9]*") : H(o);
    }, ke = (o) => {
      if (!o.length) return [];
      const i = o.slice().sort((k, C) => k.start - C.start), f = [i[0]];
      return i.slice(1).forEach((k) => {
        const C = f[f.length - 1];
        if (k.start <= C.end) {
          C.end = Math.max(C.end, k.end);
          return;
        }
        f.push({ ...k });
      }), f;
    }, oe = (o, i) => {
      const f = String(o ?? ""), k = Array.from(
        new Set(i.map((S) => String(S || "").trim()).filter((S) => S.length > 0))
      );
      if (!k.length)
        return [{ text: f, highlighted: !1 }];
      const C = k.slice().sort((S, b) => b.length - S.length).map((S) => Y(S)).join("|"), v = new RegExp(C, "gi"), O = [];
      let E = v.exec(f);
      for (; E; ) {
        const S = E[0] ?? "";
        S.length > 0 && O.push({ start: E.index, end: E.index + S.length }), S.length === 0 && (v.lastIndex += 1), E = v.exec(f);
      }
      if (!O.length)
        return [{ text: f, highlighted: !1 }];
      const B = ke(O), g = [];
      let T = 0;
      return B.forEach((S) => {
        S.start > T && g.push({ text: f.slice(T, S.start), highlighted: !1 }), g.push({ text: f.slice(S.start, S.end), highlighted: !0 }), T = S.end;
      }), T < f.length && g.push({ text: f.slice(T), highlighted: !1 }), g;
    }, re = (o, i) => {
      const f = R(i), k = (v) => f?.valueType === "number-like" ? ye(v) : String(v ?? "");
      return f?.accessor ? k(f.accessor(o)) : k(o[i]);
    }, Se = (o) => {
      if (n.value.some((i) => i.uid === o.uid)) {
        r.value = "", l.value = [];
        return;
      }
      n.value = [...n.value, o], r.value = "", l.value = [];
    };
    Oe(n, (o) => {
      const i = o.filter(
        (k, C, v) => v.findIndex((O) => O.uid === k.uid) === C
      );
      if (i.length !== o.length) {
        n.value = i;
        return;
      }
      if (!o.some((k) => k.type === "fulltext") && o.some((k) => k.type === "scope")) {
        n.value = o.filter((k) => k.type !== "scope");
        return;
      }
      r.value = "", l.value = [], Ae(() => {
        u.value?.updateInputValue?.("", !0, !0), u.value?.hidePopup?.();
      });
    });
    const xe = (o) => {
      const i = String(o || "").trim();
      i && Se({
        uid: `fulltext|${i}`,
        type: "fulltext",
        title: i,
        category: "Fulltext",
        icon: "search"
      });
    }, ve = (o) => {
      const f = {
        date_before: "Stardate before",
        date_after: "Stardate after",
        date_exact: "Stardate exact",
        date_relative: "Stardate",
        fulltext: "Full-Text",
        scope: "In Sector"
      }[o.type];
      if (f) return f;
      const k = o.key ?? o.type;
      return R(k)?.label ?? o.category ?? o.type;
    }, ee = {
      fulltext: "teal-9",
      scope: "green-8",
      subcolumn: "light-blue-9"
    }, Te = (o) => {
      if (ee[o.type]) return ee[o.type];
      const i = o.key ?? o.type;
      if (R(i)?.renderAsSublineOf)
        return ee.subcolumn;
    }, se = (o, i, f) => i?.[o.type] ?? Te(o) ?? f ?? e.annotations.tokenDefaultColor ?? "indigo-9", te = (o) => se(o, e.annotations.tokenColorByType), we = (o) => se(o, e.annotations.optionBadgeColorByType, te(o)), Ce = (o, i) => {
      xe(o), i(null);
    }, be = (o, i) => {
      i(() => {
        r.value = o, l.value = m.value.filter((f) => f.type !== "fulltext");
      });
    }, ae = (o, i) => {
      const f = R(i);
      return f?.tooltipHint ? typeof f.tooltipHint == "function" ? f.tooltipHint(o) : f.tooltipHint : "";
    }, De = (o) => {
      if (s.value.key !== o) {
        s.value = { key: o, asc: !0 };
        return;
      }
      s.value = { key: o, asc: !s.value.asc };
    }, j = (o, i) => {
      const f = re(o, i);
      return x(i) ? oe(f, L.value) : [{ text: f, highlighted: !1 }];
    }, $e = (o) => oe(o, [r.value]), Ee = (o) => {
      const i = re(o, "date");
      return Be(i, h.value);
    };
    return (o, i) => {
      const f = F("q-avatar"), k = F("q-chip"), C = F("q-item-label"), v = F("q-icon"), O = F("q-item-section"), E = F("q-item"), B = F("q-select");
      return p(), y("div", ht, [
        A("div", mt, [
          G(B, {
            ref_key: "qSelectRef",
            ref: u,
            modelValue: n.value,
            "onUpdate:modelValue": i[0] || (i[0] = (g) => n.value = g),
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
            onNewValue: Ce,
            onFilter: be
          }, {
            "selected-item": W((g) => [
              G(k, {
                removable: "",
                dense: "",
                class: "chip",
                color: te(g.opt),
                "text-color": "white",
                onRemove: (T) => g.removeAtIndex(g.index)
              }, {
                default: W(() => [
                  g.opt.icon ? (p(), Q(f, {
                    key: 0,
                    color: "white",
                    "text-color": te(g.opt),
                    icon: g.opt.icon
                  }, null, 8, ["text-color", "icon"])) : U("", !0),
                  A("span", null, $(ve(g.opt)) + ":", 1),
                  A("span", null, $(g.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: W((g) => [
              g.opt.type !== "fulltext" ? (p(), Q(E, Me({ key: 0 }, g.itemProps, { class: "suggest-item" }), {
                default: W(() => [
                  G(O, null, {
                    default: W(() => [
                      G(C, { class: "suggest-title" }, {
                        default: W(() => [
                          (p(!0), y(w, null, M($e(g.opt.title), (T, S) => (p(), y(w, {
                            key: `${g.opt.uid}-title-${S}`
                          }, [
                            T.highlighted ? (p(), y("mark", _t, $(T.text), 1)) : (p(), y(w, { key: 1 }, [
                              P($(T.text), 1)
                            ], 64))
                          ], 64))), 128))
                        ]),
                        _: 2
                      }, 1024),
                      G(C, {
                        caption: "",
                        class: "suggest-meta"
                      }, {
                        default: W(() => [
                          g.opt.icon ? (p(), Q(v, {
                            key: 0,
                            name: g.opt.icon,
                            color: we(g.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : U("", !0),
                          P(" " + $(g.opt.category), 1),
                          (g.opt.matchCount ?? 0) > 0 ? (p(), y("span", kt, " - " + $(g.opt.matchCount) + " x", 1)) : U("", !0)
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
        A("table", St, [
          A("colgroup", null, [
            (p(!0), y(w, null, M(a.value, (g) => (p(), y("col", {
              key: `col-${g.key}`,
              style: Ne(g.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          A("thead", null, [
            A("tr", null, [
              (p(!0), y(w, null, M(a.value, (g) => (p(), y("th", {
                key: g.key,
                onClick: (T) => De(g.key)
              }, [
                g.icon ? (p(), Q(v, {
                  key: 0,
                  name: g.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : U("", !0),
                A("span", null, $(g.label), 1)
              ], 8, xt))), 128))
            ])
          ]),
          A("tbody", null, [
            (p(!0), y(w, null, M(D.value, (g, T) => (p(), y("tr", { key: T }, [
              (p(!0), y(w, null, M(a.value, (S) => (p(), y("td", {
                key: S.key
              }, [
                q(S.key).length > 0 ? (p(), y(w, { key: 0 }, [
                  A("div", null, [
                    (p(!0), y(w, null, M(j(g, S.key), (b, N) => (p(), y(w, {
                      key: `${S.key}-${T}-${N}`
                    }, [
                      b.highlighted ? (p(), y("mark", vt, $(b.text), 1)) : (p(), y(w, { key: 1 }, [
                        P($(b.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (p(!0), y(w, null, M(q(S.key), (b) => (p(), y("span", {
                    key: `${S.key}-${b.key}-${T}`,
                    class: "subline-value",
                    title: ae(g, b.key)
                  }, [
                    A("span", null, [
                      (p(!0), y(w, null, M(j(g, b.key), (N, Le) => (p(), y(w, {
                        key: `${b.key}-${T}-${Le}`
                      }, [
                        N.highlighted ? (p(), y("mark", wt, $(N.text), 1)) : (p(), y(w, { key: 1 }, [
                          P($(N.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, Tt))), 128))
                ], 64)) : S.key === "date" ? (p(), y("span", {
                  key: 1,
                  title: Ee(g)
                }, [
                  (p(!0), y(w, null, M(j(g, S.key), (b, N) => (p(), y(w, {
                    key: `date-${T}-${N}`
                  }, [
                    b.highlighted ? (p(), y("mark", bt, $(b.text), 1)) : (p(), y(w, { key: 1 }, [
                      P($(b.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, Ct)) : (p(), y("span", {
                  key: 2,
                  title: ae(g, S.key)
                }, [
                  (p(!0), y(w, null, M(j(g, S.key), (b, N) => (p(), y(w, {
                    key: `${S.key}-${T}-${N}`
                  }, [
                    b.highlighted ? (p(), y("mark", $t, $(b.text), 1)) : (p(), y(w, { key: 1 }, [
                      P($(b.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, Dt))
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]);
    };
  }
}), Lt = (t, e) => {
  const r = t.__vccOpts || t;
  for (const [n, s] of e)
    r[n] = s;
  return r;
}, Rt = /* @__PURE__ */ Lt(Et, [["__scopeId", "data-v-1e09938d"]]), Mt = {
  install(t) {
    t.component("TableSuggest", Rt);
  }
}, _e = /* @__PURE__ */ new WeakMap(), Nt = (t, e) => {
  _e.set(t, e);
}, It = (t) => {
  const e = _e.get(t);
  if (!e)
    throw new Error(`No model annotations registered for ${t.name}`);
  return e;
};
export {
  Rt as TableSuggest,
  Mt as TableSuggestPlugin,
  yt as buildSuggestions,
  Mt as default,
  Nt as defineModelAnnotations,
  pt as filterItems,
  pe as formatDate,
  We as getAnchorWeekdayDate,
  Be as getDateMouseoverLabel,
  qe as getIsoWeekInfo,
  Fe as getLocalizedWeekdaysMondayFirst,
  It as getModelAnnotations,
  Ie as getMondayIndexFromDate,
  At as highlightText,
  V as parseDateInput,
  Mt as plugin,
  gt as resolveEnglishLocale,
  J as startOfDay
};
