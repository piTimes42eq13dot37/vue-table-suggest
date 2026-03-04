import { ref as z, computed as M, watch as He, nextTick as ze, defineComponent as Ke, resolveComponent as F, openBlock as m, createElementBlock as v, createElementVNode as E, createVNode as V, unref as x, isRef as Ge, withCtx as A, createBlock as U, mergeProps as Ue, Fragment as T, renderList as $, toDisplayString as D, createTextVNode as N, createCommentVNode as W, normalizeStyle as je, normalizeClass as Qe } from "vue";
class Ye {
  normalizeNumberLike(t) {
    return String(t ?? "").replace(/[^0-9]/g, "");
  }
  formatGroupedNumber(t) {
    const n = this.normalizeNumberLike(t);
    return n ? n.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(t ?? "");
  }
  readValue(t, n) {
    if (n.accessor)
      return String(n.accessor(t) ?? "");
    const s = n.key;
    return String(t[s] ?? "");
  }
  getScopeColumns(t, n) {
    if (!n.length)
      return t.columns.filter((o) => o.searchable !== !1);
    const s = new Set(n), r = /* @__PURE__ */ new Set();
    return t.columns.forEach((o) => {
      s.has(o.key) && o.scopeGroup && r.add(o.scopeGroup);
    }), t.columns.filter((o) => !s.has(o.key) && !r.has(o.scopeGroup ?? "") ? !1 : o.searchable !== !1);
  }
  expandScopeKeys(t, n) {
    const s = new Set(n), r = /* @__PURE__ */ new Set();
    return t.columns.forEach((o) => {
      s.has(o.key) && o.scopeGroup && r.add(o.scopeGroup);
    }), Array.from(
      new Set(
        t.columns.filter((o) => s.has(o.key) || r.has(o.scopeGroup ?? "")).map((o) => o.key)
      )
    );
  }
  readValueByKey(t, n, s) {
    const r = n.columns.find((o) => o.key === s);
    return r ? this.readValue(t, r) : String(t[s] ?? "");
  }
}
const K = new Ye(), j = (e) => K.normalizeNumberLike(e), Te = (e) => K.formatGroupedNumber(e), oe = (e, t) => K.readValue(e, t), Je = (e, t) => K.getScopeColumns(e, t), Xe = (e, t, n) => K.readValueByKey(e, t, n);
class Ze {
  escapeRegExp(t) {
    return String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  escapeHtml(t) {
    return String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  resolveEnglishLocale() {
    return typeof globalThis > "u" || typeof globalThis.navigator > "u" || !Array.isArray(globalThis.navigator.languages) ? "en-US" : globalThis.navigator.languages.find((t) => String(t).toLowerCase().startsWith("en")) ?? "en-US";
  }
  highlightText(t, n) {
    const s = this.escapeHtml(t), r = n.map((o) => String(o || "").trim()).filter((o) => o.length > 0);
    return r.length ? r.reduce((o, l) => {
      const g = j(l), h = g.length > 0 && g === String(l) ? g.split("").map((d) => this.escapeRegExp(d)).join("[^0-9]*") : this.escapeRegExp(this.escapeHtml(l)), i = new RegExp(h, "gi");
      return o.replace(i, (d) => `<mark>${d}</mark>`);
    }, s) : s;
  }
}
const we = new Ze(), ke = () => we.resolveEnglishLocale(), et = (e, t) => we.highlightText(e, t);
class tt {
  startOfDay(t) {
    const n = new Date(t);
    return n.setHours(0, 0, 0, 0), n;
  }
  parseDateInput(t) {
    const n = String(t ?? "").trim(), s = n.match(/^(\d{2})\.(\d{2})\.(\d{4})$/), r = n.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!s && !r) return null;
    const o = Number(s ? s[3] : r[1]), l = Number(s ? s[2] : r[2]), g = Number(s ? s[1] : r[3]), u = new Date(o, l - 1, g);
    return u.setHours(0, 0, 0, 0), u.getFullYear() !== o || u.getMonth() !== l - 1 || u.getDate() !== g ? null : u;
  }
  formatDate(t) {
    const n = this.startOfDay(t), s = String(n.getDate()).padStart(2, "0"), r = String(n.getMonth() + 1).padStart(2, "0"), o = n.getFullYear();
    return `${s}.${r}.${o}`;
  }
  getMondayIndexFromDate(t) {
    return (this.startOfDay(t).getDay() + 6) % 7;
  }
  getLocalizedWeekdaysMondayFirst(t = "en-US") {
    const n = new Intl.DateTimeFormat(t, { weekday: "long" }), s = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (r, o) => {
      const l = new Date(s);
      return l.setDate(s.getDate() + o), n.format(l);
    });
  }
  getReferenceWeekdayDate(t, n, s = /* @__PURE__ */ new Date()) {
    const r = this.startOfDay(s), o = this.getMondayIndexFromDate(r), l = new Date(r);
    if (t === "last") {
      const u = (o - n + 7) % 7 || 7;
      return l.setDate(r.getDate() - u), l;
    }
    const g = (n - o + 7) % 7 || 7;
    return l.setDate(r.getDate() + g), l;
  }
  getIsoWeekInfo(t) {
    const n = this.startOfDay(t), s = (n.getDay() + 6) % 7, r = new Date(n);
    r.setDate(n.getDate() - s + 3);
    const o = r.getFullYear(), l = new Date(o, 0, 4), g = (l.getDay() + 6) % 7;
    return l.setDate(l.getDate() - g + 3), { weekNo: 1 + Math.round((r.getTime() - l.getTime()) / 6048e5), weekYear: o };
  }
  getDateMouseoverLabel(t, n = "en-US") {
    const s = this.parseDateInput(t);
    if (!s) return "";
    const r = new Intl.DateTimeFormat(n, {
      weekday: "long"
    }).format(s), { weekNo: o, weekYear: l } = this.getIsoWeekInfo(s);
    return `KW ${String(o).padStart(2, "0")}/${l} - ${r}`;
  }
}
const O = new tt();
var Ce = /* @__PURE__ */ ((e) => (e.Before = "before", e.After = "after", e.On = "on", e))(Ce || {});
const ae = (e) => e === "before", le = (e) => e === "after", De = (e) => e === "on", nt = (e) => ae(e) || le(e) || De(e), _ = {
  fulltext: "fulltext",
  scope: "scope",
  dateBefore: "date_before",
  dateAfter: "date_after",
  dateExact: "date_exact",
  dateRelative: "date_relative"
}, st = [
  _.dateBefore,
  _.dateAfter,
  _.dateExact
], Q = (e) => e === _.fulltext, Y = (e) => e === _.scope, ce = (e) => e === _.dateBefore, ue = (e) => e === _.dateAfter, ge = (e) => e === _.dateExact, de = (e) => e === _.dateRelative, fe = (e) => ce(e) || ue(e) || ge(e) || de(e), _e = (e) => Q(e) || Y(e) || fe(e), Re = (e) => !Q(e) && !Y(e), rt = (e) => Q(e.type), Le = (e) => Y(e.type), Ie = (e) => ce(e.type), Ee = (e) => ue(e.type), $e = (e) => ge(e.type), J = (e) => de(e.type), Be = (e) => fe(e.type), ot = (e) => _e(e.type), Me = (e) => Re(e.type), it = (e) => Ie(e) || J(e) && ae(e.dateRelation), at = (e) => Ee(e) || J(e) && le(e.dateRelation), lt = (e) => $e(e) || J(e) && De(e.dateRelation), ct = (e) => Be(e) ? "date" : Le(e) || Me(e) && e.key ? e.key : e.type, b = {
  fulltext: _.fulltext,
  scope: _.scope,
  dateBefore: _.dateBefore,
  dateAfter: _.dateAfter,
  dateExact: _.dateExact,
  dateRelative: _.dateRelative,
  dateOperationTypes: st,
  isFulltextType: Q,
  isScopeType: Y,
  isDateBeforeType: ce,
  isDateAfterType: ue,
  isDateExactType: ge,
  isDateRelativeType: de,
  isDateType: fe,
  isBuiltInType: _e,
  isExactCellValueType: Re,
  isFulltext: rt,
  isScope: Le,
  isDateBefore: Ie,
  isDateAfter: Ee,
  isDateExact: $e,
  isDateRelative: J,
  isDate: Be,
  isBuiltIn: ot,
  isExactCellValue: Me,
  isBeforeDirection: it,
  isAfterDirection: at,
  isOnDirection: lt,
  resolveTermKey: ct
}, ut = (e) => e.filter((t) => b.isFulltext(t)), gt = (e) => e.filter((t) => b.isExactCellValue(t)), dt = (e) => e.filter((t) => b.isScope(t)).map((t) => t.key), ft = (e) => ({
  fulltextTokens: ut(e),
  exactTokens: gt(e),
  scopedColumnKeys: dt(e)
}), Oe = (e, t, n) => {
  const { fulltextTokens: s, exactTokens: r, scopedColumnKeys: o } = ft(n), l = Je(t, o);
  return e.filter((g) => {
    for (const u of r) {
      const h = b.resolveTermKey(u), i = t.columns.find((c) => c.key === h), d = i ? oe(g, i) : "";
      if (b.isDate(u)) {
        const c = O.parseDateInput(d), a = O.parseDateInput(u.rawTitle || u.title);
        if (!c || !a) return !1;
        const f = c.getTime(), p = a.getTime();
        if (b.isBeforeDirection(u) && !(f < p) || b.isAfterDirection(u) && !(f > p) || b.isOnDirection(u) && f !== p)
          return !1;
        continue;
      }
      if (i?.valueType === "number-like") {
        if (j(d) !== j(u.title))
          return !1;
        continue;
      }
      if (String(d).toLowerCase() !== String(u.title || "").toLowerCase())
        return !1;
    }
    for (const u of s) {
      const h = String(u.title || "").toLowerCase();
      if (!h) continue;
      if (!l.some(
        (d) => String(oe(g, d)).toLowerCase().includes(h)
      )) return !1;
    }
    return !0;
  });
};
class he {
  static createDateRelative(t) {
    return {
      uid: `${b.dateRelative}|${t.dateRelation}|${t.reference}|${t.weekdayIndexMonday}|${t.dateText}`,
      type: "date_relative",
      title: t.title,
      rawTitle: t.dateText,
      dateRelation: t.dateRelation,
      reference: t.reference
    };
  }
  static createDateOperation(t, n) {
    return {
      uid: `${t}|${n}`,
      type: t,
      title: n,
      rawTitle: n
    };
  }
  static createScope(t) {
    return {
      uid: `${b.scope}|${t.key}`,
      type: "scope",
      key: t.key,
      title: t.title,
      icon: t.icon
    };
  }
}
var ie = /* @__PURE__ */ ((e) => (e.Last = "last", e.Next = "next", e))(ie || {});
const ht = (e) => e === "last", pt = (e) => e === "next", ye = (e) => ht(e) || pt(e);
class yt {
  parse(t) {
    const n = t.trim().toLowerCase();
    if (!n)
      return null;
    const s = n.startsWith("date ") ? n.slice(5).trim() : n, r = s.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
    if (r) {
      const h = String(r[1]).toLowerCase();
      if (!nt(h))
        return null;
      const i = String(r[2] || "").toLowerCase(), d = i && ye(i) ? i : null, c = String(r[3] || "").trim().toLowerCase();
      return c ? { dateRelation: h, reference: d, weekdayPart: c, needle: s } : null;
    }
    const o = s.match(/^(last|next)\s+(.+)$/i);
    if (!o)
      return null;
    const l = String(o[1]).toLowerCase();
    if (!ye(l))
      return null;
    const g = l, u = String(o[2] || "").trim().toLowerCase();
    return u ? {
      dateRelation: Ce.On,
      reference: g,
      weekdayPart: u,
      needle: s
    } : null;
  }
}
const mt = new yt(), me = {
  relativeDate: {
    minQueryLength: 4,
    defaultMaxWeekdaySuggestions: 4
  },
  textScoring: {
    scoreStart: 300,
    scoreMiddle: 200,
    scoreEnd: 100,
    wordScoreBase: 1e4,
    wordIndexWeight: 1e3,
    scoreCategoryMatch: 40,
    scoreExactMatch: 50,
    maxLengthPenalty: 30,
    lengthPenaltyDivisor: 6
  }
}, St = (e) => ({
  relativeDate: {
    ...me.relativeDate
  },
  textScoring: {
    ...me.textScoring
  }
});
class vt {
  constructor(t) {
    this.config = t;
  }
  buildRelativeTitlePrefix(t, n) {
    return ae(t) ? n === "last" ? "before last" : "before next" : le(t) ? n === "last" ? "after last" : "after next" : n === "last" ? "on last" : "on next";
  }
  getPriority(t, n) {
    const s = t.toLowerCase();
    return s === n ? 3 : s.startsWith(n) ? 2 : s.includes(n) ? 1 : 0;
  }
  suggest(t, n, s) {
    if (String(s || "").trim().length < this.config.minQueryLength || n.some((i) => b.isDateRelative(i)))
      return [];
    const r = mt.parse(s);
    if (!r)
      return [];
    const o = t.locale ?? ke(), l = O.getLocalizedWeekdaysMondayFirst(o).map((i, d) => ({
      weekday: i,
      weekdayIndexMonday: d,
      weekdayLower: i.toLowerCase()
    })).filter((i) => i.weekdayLower.startsWith(r.weekdayPart)), g = r.reference ? [r.reference] : [ie.Last, ie.Next], u = [], h = /* @__PURE__ */ new Set();
    return l.forEach((i) => {
      g.forEach((d) => {
        const c = O.getReferenceWeekdayDate(d, i.weekdayIndexMonday), a = O.formatDate(c), p = `${this.buildRelativeTitlePrefix(r.dateRelation, d)} ${i.weekday}`;
        h.has(p) || (h.add(p), u.push(
          he.createDateRelative({
            dateRelation: r.dateRelation,
            reference: d,
            weekdayIndexMonday: i.weekdayIndexMonday,
            dateText: a,
            title: p
          })
        ));
      });
    }), u.sort((i, d) => this.getPriority(d.title, r.needle) - this.getPriority(i.title, r.needle)).slice(0, t.maxWeekdaySuggestions ?? this.config.defaultMaxWeekdaySuggestions);
  }
}
class xt {
  suggest(t, n) {
    const s = O.parseDateInput(n);
    if (!s)
      return [];
    const r = new Set(t.map((g) => g.type)), o = O.formatDate(s);
    return b.dateOperationTypes.filter((g) => !r.has(g)).map((g) => he.createDateOperation(g, o));
  }
}
class bt {
  constructor(t) {
    this.config = t;
  }
  getPositionWeight(t, n) {
    if (!n)
      return 0;
    const s = t.indexOf(n);
    return s < 0 ? -1 : s === 0 ? this.config.scoreStart : s + n.length === t.length ? this.config.scoreEnd : this.config.scoreMiddle;
  }
  getBestWordMatchScore(t, n) {
    if (!n)
      return 0;
    const s = String(t || "").split(/\s+/).filter((o) => o.length > 0);
    let r = -1;
    return s.forEach((o, l) => {
      const g = this.getPositionWeight(o, n);
      if (g < 0)
        return;
      const u = this.config.wordScoreBase - l * this.config.wordIndexWeight + g;
      u > r && (r = u);
    }), r;
  }
  score(t, n, s) {
    if (!s)
      return 1;
    const r = String(t || "").toLowerCase(), o = this.getBestWordMatchScore(r, s);
    if (o < 0)
      return -1;
    const g = String(n || "").toLowerCase().includes(s) ? this.config.scoreCategoryMatch : 0, u = r === s ? this.config.scoreExactMatch : 0, h = Math.min(
      this.config.maxLengthPenalty,
      Math.floor(r.length / this.config.lengthPenaltyDivisor)
    );
    return o + g + u - h;
  }
}
class Tt {
  merge(...t) {
    const n = [], s = /* @__PURE__ */ new Set();
    return t.flat().forEach((r) => {
      s.has(r.uid) || (s.add(r.uid), n.push(r));
    }), n;
  }
}
const Pe = (e) => {
  const t = St();
  return {
    relativeDateSuggestionPolicy: new vt(t.relativeDate),
    dateOperationSuggestionPolicy: new xt(),
    textSuggestionScoringPolicy: new bt(t.textScoring),
    uniqueSuggestionMergeService: new Tt()
  };
}, X = Pe();
X.relativeDateSuggestionPolicy;
X.dateOperationSuggestionPolicy;
X.textSuggestionScoringPolicy;
X.uniqueSuggestionMergeService;
const wt = 1, Se = 3, kt = (e, t) => `${e}|${t}`, ve = (e) => e.valueType === "number-like", xe = (e) => String(e).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Ct = (e, t) => t._score !== e._score ? t._score - e._score : e.title.localeCompare(t.title), Dt = (e) => {
  const t = e.slice().sort(Ct), n = [], s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  t.slice(0, Se).forEach((l) => {
    s.has(l.uid) || (s.add(l.uid), r.add(l._columnType), n.push(l));
  });
  const o = t.slice(Se);
  return o.forEach((l) => {
    s.has(l.uid) || r.has(l._columnType) || (s.add(l.uid), r.add(l._columnType), n.push(l));
  }), o.forEach((l) => {
    s.has(l.uid) || (s.add(l.uid), n.push(l));
  }), n;
};
class _t {
  constructor(t) {
    this.dependencies = t;
  }
  getRelativeCandidates(t, n, s) {
    return this.dependencies.policies.relativeDateSuggestionPolicy.suggest(t, n, s);
  }
  getDateOperationCandidates(t, n) {
    return this.dependencies.policies.dateOperationSuggestionPolicy.suggest(t, n);
  }
  countTermOccurrencesInValue(t, n) {
    const s = String(t ?? "").toLowerCase();
    if (!s || !n)
      return 0;
    const r = j(n), l = r.length > 0 && r === String(n) ? r.split("").map((h) => xe(h)).join("[^0-9]*") : xe(String(n)), g = new RegExp(l, "gi"), u = s.match(g);
    return u ? u.length : 0;
  }
  countColumnMatchesForTerms(t, n, s, r) {
    if (!r.length)
      return 0;
    const o = [s];
    return t.reduce((l, g) => {
      const u = r.reduce((h, i) => {
        const d = o.reduce((c, a) => c + this.countTermOccurrencesInValue(Xe(g, n, a), i), 0);
        return h + d;
      }, 0);
      return l + u;
    }, 0);
  }
  buildNormalCandidates(t, n, s, r) {
    const o = new Set(
      s.map((i) => i.type).filter((i) => i && b.isExactCellValueType(i))
    ), l = [], g = /* @__PURE__ */ new Set(), u = this.dependencies.filterItems(t, n, s);
    return n.columns.filter((i) => i.suggestionEnabled !== !1).forEach((i) => {
      o.has(i.key) || new Set(u.map((d) => oe(d, i))).forEach((d) => {
        const c = String(d ?? "");
        if (!c) return;
        const a = kt(i.key, c);
        if (g.has(a)) return;
        g.add(a);
        const f = ve(i) ? Te(c) : c, p = ve(i) ? c : f, w = this.dependencies.policies.textSuggestionScoringPolicy.score(p, i.label, r);
        w < 0 && r.length > 0 || l.push({
          uid: a,
          type: i.key,
          key: i.key,
          title: f,
          icon: i.icon,
          _score: w,
          _columnType: i.key
        });
      });
    }), Dt(l).map((i) => {
      const d = { ...i };
      return delete d._score, delete d._columnType, d;
    });
  }
  buildScopeCandidates(t, n, s, r) {
    const o = s.filter((i) => b.isFulltext(i)).map((i) => String(i.title || "").toLowerCase()).filter((i) => i.length > 0), l = s.filter((i) => b.isExactCellValue(i)), g = this.dependencies.filterItems(t, n, l), u = new Set(
      s.filter(b.isScope).map((i) => i.key)
    );
    return n.columns.filter((i) => i.searchable !== !1).filter((i) => !u.has(i.key)).map((i) => {
      const d = this.countColumnMatchesForTerms(g, n, i.key, o), c = r.length === 0 ? 1 : this.dependencies.policies.textSuggestionScoringPolicy.score(i.label, "Fulltext scope", r);
      return {
        ...he.createScope({
          key: i.key,
          title: i.label,
          icon: i.icon
        }),
        matchCount: d,
        _score: c
      };
    }).filter((i) => (i.matchCount ?? 0) > 0).filter((i) => r.length === 0 || i._score >= 0).sort((i, d) => {
      const c = i.matchCount ?? 0, a = d.matchCount ?? 0;
      return a !== c ? a - c : d._score !== i._score ? d._score - i._score : i.title.localeCompare(d.title);
    }).map((i) => {
      const d = { ...i };
      return delete d._score, d;
    });
  }
  collectCandidates(t, n) {
    const s = n.map((r) => r(t));
    return this.dependencies.policies.uniqueSuggestionMergeService.merge(...s);
  }
  buildSuggestions(t, n, s, r) {
    const o = String(r || "").trim().toLowerCase(), l = n.maxSuggestions ?? 7, g = {
      items: t,
      modelDefinition: n,
      selected: s,
      rawInput: r,
      needle: o
    }, u = (f) => this.getDateOperationCandidates(f.selected, f.rawInput), h = (f) => this.getRelativeCandidates(f.modelDefinition, f.selected, f.rawInput), i = (f) => this.buildScopeCandidates(
      f.items,
      f.modelDefinition,
      f.selected,
      f.needle
    ), d = (f) => this.buildNormalCandidates(
      f.items,
      f.modelDefinition,
      f.selected,
      f.needle
    ), c = this.collectCandidates(g, [
      u,
      h
    ]);
    return s.some((f) => b.isFulltext(f)) ? this.collectCandidates(g, [
      u,
      h,
      i,
      d
    ]).slice(0, l) : c.length > 0 ? c.slice(0, l) : o.length < wt ? [] : d(g).slice(0, l);
  }
}
const Rt = (e) => ({
  policies: Pe(),
  filterItems: Oe
}), Lt = (e) => {
  const t = Rt();
  return new _t(t);
}, It = Lt(), Et = (e, t, n, s) => It.buildSuggestions(e, t, n, s), $t = {
  resolveEnglishLocale: ke,
  highlightText: et,
  filterItems: Oe,
  buildSuggestions: Et
}, Bt = (e = {}) => {
  const t = {
    ...$t,
    ...e
  };
  return {
    resolveEnglishLocale: () => t.resolveEnglishLocale(),
    highlightText: (n, s) => t.highlightText(n, s),
    filterItems: (n, s, r) => t.filterItems(n, s, r),
    buildSuggestions: (n, s, r, o) => t.buildSuggestions(n, s, r, o)
  };
}, Z = Bt(), Mt = () => Z.resolveEnglishLocale(), un = (e, t) => Z.highlightText(e, t), Ot = (e, t, n) => Z.filterItems(e, t, n), be = (e, t, n, s) => Z.buildSuggestions(e, t, n, s), Pt = (e) => {
  const t = z(""), n = z([]), s = z([]), r = z(null), o = M(
    () => be(e.items, e.modelDefinition, n.value, t.value)
  ), l = M(
    () => n.value.filter((c) => c.type === "fulltext").map((c) => c.title)
  ), g = M(
    () => n.value.filter(b.isScope).map((c) => c.key)
  ), u = (c) => {
    if (n.value.some((a) => a.uid === c.uid)) {
      t.value = "", s.value = [];
      return;
    }
    n.value = [...n.value, c], t.value = "", s.value = [];
  };
  He(n, (c) => {
    const a = c.filter(
      (p, w, P) => P.findIndex((q) => q.uid === p.uid) === w
    );
    if (a.length !== c.length) {
      n.value = a;
      return;
    }
    if (!c.some((p) => p.type === "fulltext") && c.some((p) => p.type === "scope")) {
      n.value = c.filter((p) => p.type !== "scope");
      return;
    }
    t.value = "", s.value = [], ze(() => {
      r.value?.updateInputValue?.("", !0, !0), r.value?.hidePopup?.();
    });
  });
  const h = (c) => {
    const a = String(c || "").trim();
    if (!a) return;
    const f = a.toLowerCase(), p = be(
      e.items,
      e.modelDefinition,
      n.value,
      a
    ).find((w) => String(w.type).startsWith("date_") ? String(w.title || "").trim().toLowerCase() === f : !1);
    if (p) {
      u(p);
      return;
    }
    u({
      uid: `fulltext|${a}`,
      type: "fulltext",
      title: a
    });
  };
  return {
    query: t,
    selected: n,
    filterOptions: s,
    qSelectRef: r,
    fulltextTerms: l,
    scopedKeys: g,
    createValue: (c, a) => {
      h(c), a(null);
    },
    filterFn: (c, a) => {
      a(() => {
        t.value = c, s.value = o.value.filter((f) => f.type !== "fulltext");
      });
    }
  };
};
class Ft {
  escapeRegExp(t) {
    return String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  normalizeDigits(t) {
    return String(t || "").replace(/[^0-9]/g, "");
  }
  buildTermPattern(t) {
    const n = this.normalizeDigits(t);
    return n.length > 0 && n === t ? n.split("").map((r) => this.escapeRegExp(r)).join("[^0-9]*") : this.escapeRegExp(t);
  }
  mergeRanges(t) {
    if (!t.length)
      return [];
    const n = t.slice().sort((r, o) => r.start - o.start), s = [n[0]];
    return n.slice(1).forEach((r) => {
      const o = s[s.length - 1];
      if (r.start <= o.end) {
        o.end = Math.max(o.end, r.end);
        return;
      }
      s.push({ ...r });
    }), s;
  }
  groupSublineColumnsByParent(t) {
    const n = /* @__PURE__ */ new Map();
    return t.forEach((s) => {
      const r = s.renderAsSublineOf;
      if (!r)
        return;
      const o = n.get(r) ?? [];
      n.set(r, [...o, s]);
    }), n;
  }
  sortRows(t, n, s, r, o) {
    const l = n.find((u) => u.key === s.key), g = t.slice();
    return !l || l.sortable === !1 || g.sort((u, h) => {
      const i = (a) => l.accessor ? String(l.accessor(a) ?? "") : String(a[l.key] ?? ""), d = i(u), c = i(h);
      if (l.key === "date") {
        const a = o(d), f = o(c);
        if (a && f) {
          const p = a.getTime(), w = f.getTime();
          return s.asc ? p - w : w - p;
        }
      }
      return s.asc ? r(d, c) : r(c, d);
    }), g;
  }
  shouldHighlightColumn(t, n, s, r) {
    if (!n.length)
      return !1;
    if (!s.length)
      return !0;
    const o = new Set(s), l = r.filter((h) => o.has(h.key)), g = new Set(l.map((h) => h.scopeGroup).filter(Boolean));
    if (o.has(t))
      return !0;
    const u = r.find((h) => h.key === t);
    return u?.scopeGroup ? g.has(u.scopeGroup) : !1;
  }
  buildHighlightSegments(t, n) {
    const s = String(t ?? ""), r = Array.from(
      new Set(n.map((c) => String(c || "").trim()).filter((c) => c.length > 0))
    );
    if (!r.length)
      return [{ text: s, highlighted: !1 }];
    const o = r.slice().sort((c, a) => a.length - c.length).map((c) => this.buildTermPattern(c)).join("|"), l = new RegExp(o, "gi"), g = [];
    let u = l.exec(s);
    for (; u; ) {
      const c = u[0] ?? "";
      c.length > 0 && g.push({ start: u.index, end: u.index + c.length }), c.length === 0 && (l.lastIndex += 1), u = l.exec(s);
    }
    if (!g.length)
      return [{ text: s, highlighted: !1 }];
    const h = this.mergeRanges(g), i = [];
    let d = 0;
    return h.forEach((c) => {
      c.start > d && i.push({ text: s.slice(d, c.start), highlighted: !1 }), i.push({ text: s.slice(c.start, c.end), highlighted: !0 }), d = c.end;
    }), d < s.length && i.push({ text: s.slice(d), highlighted: !1 }), i;
  }
}
const H = new Ft(), At = (e) => {
  const n = z({ key: e.modelDefinition.columns.find((S) => !S.renderAsSublineOf && S.sortable !== !1)?.key ?? "", asc: !0 }), s = M(() => e.modelDefinition.locale ?? Mt()), r = M(
    () => new Intl.Collator(s.value, { numeric: !0, sensitivity: "base" })
  ), o = M(
    () => e.modelDefinition.columns.filter((S) => !S.renderAsSublineOf)
  ), l = M(() => H.groupSublineColumnsByParent(e.modelDefinition.columns)), g = M(() => Ot(e.items, e.modelDefinition, e.selected.value)), u = M(() => H.sortRows(
    g.value,
    e.modelDefinition.columns,
    n.value,
    (S, k) => r.value.compare(S, k),
    (S) => O.parseDateInput(S)
  )), h = (S) => H.shouldHighlightColumn(
    S,
    e.fulltextTerms.value,
    e.scopedKeys.value,
    e.modelDefinition.columns
  ), i = (S) => e.modelDefinition.columns.find((k) => k.key === S), d = (S) => l.value.get(S) ?? [], c = (S, k) => {
    const R = i(k), ee = (G) => R?.valueType === "number-like" ? Te(G) : String(G ?? "");
    return R?.accessor ? ee(R.accessor(S)) : ee(S[k]);
  };
  return {
    visibleColumns: o,
    sortedRows: u,
    getColumnByKey: i,
    getSublineColumns: d,
    getTooltip: (S, k) => {
      const R = i(k);
      return R?.tooltipHint ? typeof R.tooltipHint == "function" ? R.tooltipHint(S) : R.tooltipHint : "";
    },
    toggleSort: (S) => {
      if (i(S)?.sortable !== !1) {
        if (n.value.key !== S) {
          n.value = { key: S, asc: !0 };
          return;
        }
        n.value = { key: S, asc: !n.value.asc };
      }
    },
    sortIcon: (S) => n.value.key !== S ? null : n.value.asc ? "arrow_upward" : "arrow_downward",
    cellSegments: (S, k) => {
      const R = c(S, k);
      return h(k) ? H.buildHighlightSegments(R, e.fulltextTerms.value) : [{ text: R, highlighted: !1 }];
    },
    suggestionTitleSegments: (S) => H.buildHighlightSegments(S, [e.query.value]),
    dateHint: (S) => {
      const k = c(S, "date");
      return O.getDateMouseoverLabel(k, s.value);
    }
  };
}, Vt = {
  [b.fulltext]: "search",
  [b.scope]: "tune",
  [b.dateBefore]: "event_busy",
  [b.dateAfter]: "event_available",
  [b.dateExact]: "event",
  [b.dateRelative]: "event_repeat"
}, Nt = (e) => {
  if ("icon" in e && e.icon)
    return e.icon;
  if (b.isBuiltIn(e))
    return Vt[e.type];
}, se = (e, t) => {
  const n = t?.suggestionCategoryLabelByType?.[e.type];
  if (n)
    return n;
  if (b.isDateBefore(e))
    return "date before";
  if (b.isDateAfter(e))
    return "date after";
  if (b.isDateExact(e))
    return "date exact";
  if (b.isDateRelative(e))
    return e.dateRelation === "before" ? "date before" : e.dateRelation === "after" ? "date after" : "date exact";
  if (b.isFulltext(e))
    return "Fulltext";
  if (b.isScope(e))
    return "Fulltext scope";
  const s = "key" in e ? e.key : void 0;
  if (s) {
    const r = t?.getColumnByKey?.(s);
    if (r?.label)
      return r.label;
  }
  return e.type;
}, re = {
  fulltext: "teal-9",
  scope: "green-8",
  subcolumn: "light-blue-9"
}, qt = {
  date_before: "Date before",
  date_after: "Date after",
  date_exact: "Date exact",
  date_relative: "Date",
  fulltext: "Full-Text",
  scope: "In Column"
}, Wt = (e, t) => {
  const n = (a) => (a.type === "scope" || !b.isBuiltIn(a)) && "key" in a ? a.key : void 0, s = (a) => {
    const f = n(a) ?? a.type, p = t(f);
    if (p) return p;
    if (a.type === "scope" && a.title)
      return e.columns.find((w) => w.label === a.title);
  }, r = (a) => !!s(a)?.renderAsSublineOf, o = (a) => {
    if (a.type === "scope" && r(a))
      return "In SubColumn";
    const f = e.tokenTypeLabelByType?.[a.type] ?? qt[a.type];
    if (f) return f;
    const p = n(a) ?? a.type;
    return t(p)?.label ?? se(a, {
      getColumnByKey: (P) => t(P),
      suggestionCategoryLabelByType: e.suggestionCategoryLabelByType
    });
  }, l = (a) => {
    if (re[a.type]) return re[a.type];
    const f = n(a) ?? a.type;
    if (t(f)?.renderAsSublineOf)
      return re.subcolumn;
  }, g = (a, f, p) => f?.[a.type] ?? l(a) ?? p ?? e.tokenDefaultColor ?? "indigo-9", u = (a) => g(a, e.tokenColorByType);
  return {
    chipTypeLabel: o,
    chipColor: u,
    optionBadgeColor: (a) => g(a, e.optionBadgeColorByType, u(a)),
    suggestionCategoryLabel: (a) => {
      const f = e.suggestionCategoryLabelByType?.[a.type];
      if (f) return f;
      if (r(a)) {
        const p = s(a);
        return `${(p?.renderAsSublineOf ? t(p.renderAsSublineOf)?.label : void 0) ?? p?.label ?? se(a, {
          getColumnByKey: (P) => t(P),
          suggestionCategoryLabelByType: e.suggestionCategoryLabelByType
        })}-SubColumn`;
      }
      return se(a, {
        getColumnByKey: (p) => t(p),
        suggestionCategoryLabelByType: e.suggestionCategoryLabelByType
      });
    },
    tokenIcon: (a) => Nt(a),
    tokenMatchCount: (a) => "matchCount" in a ? a.matchCount ?? 0 : 0
  };
}, Ht = (e) => {
  const t = Pt({
    items: e.items,
    modelDefinition: e.modelDefinition
  }), n = At({
    items: e.items,
    modelDefinition: e.modelDefinition,
    selected: t.selected,
    fulltextTerms: t.fulltextTerms,
    scopedKeys: t.scopedKeys,
    query: t.query
  }), s = Wt(e.modelDefinition, n.getColumnByKey);
  return {
    selected: t.selected,
    filterOptions: t.filterOptions,
    qSelectRef: t.qSelectRef,
    visibleColumns: n.visibleColumns,
    sortedRows: n.sortedRows,
    getSublineColumns: n.getSublineColumns,
    createValue: t.createValue,
    filterFn: t.filterFn,
    chipColor: s.chipColor,
    chipTypeLabel: s.chipTypeLabel,
    tokenIcon: s.tokenIcon,
    tokenMatchCount: s.tokenMatchCount,
    optionBadgeColor: s.optionBadgeColor,
    suggestionCategoryLabel: s.suggestionCategoryLabel,
    suggestionTitleSegments: n.suggestionTitleSegments,
    toggleSort: n.toggleSort,
    sortIcon: n.sortIcon,
    cellSegments: n.cellSegments,
    dateHint: n.dateHint,
    getTooltip: n.getTooltip
  };
}, zt = { class: "table-suggest" }, Kt = { class: "search-wrap" }, Gt = { key: 0 }, Ut = { key: 1 }, jt = { class: "data-table" }, Qt = ["onClick"], Yt = { class: "sort-icon-slot" }, Jt = { key: 0 }, Xt = ["title"], Zt = { key: 0 }, en = ["title"], tn = { key: 0 }, nn = ["title"], sn = { key: 0 }, rn = /* @__PURE__ */ Ke({
  __name: "TableSuggest",
  props: {
    items: {},
    modelDefinition: {}
  },
  setup(e) {
    const t = e, {
      selected: n,
      filterOptions: s,
      qSelectRef: r,
      visibleColumns: o,
      sortedRows: l,
      getSublineColumns: g,
      createValue: u,
      filterFn: h,
      chipColor: i,
      chipTypeLabel: d,
      tokenIcon: c,
      tokenMatchCount: a,
      optionBadgeColor: f,
      suggestionCategoryLabel: p,
      suggestionTitleSegments: w,
      toggleSort: P,
      sortIcon: q,
      cellSegments: S,
      dateHint: k,
      getTooltip: R
    } = Ht(t);
    return (ee, te) => {
      const G = F("q-avatar"), Ae = F("q-chip"), pe = F("q-item-label"), ne = F("q-icon"), Ve = F("q-item-section"), Ne = F("q-item"), qe = F("q-select");
      return m(), v("div", zt, [
        E("div", Kt, [
          V(qe, {
            ref_key: "qSelectRef",
            ref: r,
            modelValue: x(n),
            "onUpdate:modelValue": te[0] || (te[0] = (y) => Ge(n) ? n.value = y : null),
            class: "search-field",
            "input-class": "search-input",
            label: "Search",
            "use-input": "",
            "use-chips": "",
            multiple: "",
            "input-debounce": "0",
            "option-label": "title",
            "option-value": "uid",
            options: x(s),
            onNewValue: x(u),
            onFilter: x(h)
          }, {
            "selected-item": A((y) => [
              V(Ae, {
                removable: "",
                dense: "",
                class: "chip",
                color: x(i)(y.opt),
                "text-color": "white",
                onRemove: (I) => y.removeAtIndex(y.index)
              }, {
                default: A(() => [
                  x(c)(y.opt) ? (m(), U(G, {
                    key: 0,
                    color: "white",
                    "text-color": x(i)(y.opt),
                    icon: x(c)(y.opt)
                  }, null, 8, ["text-color", "icon"])) : W("", !0),
                  E("span", null, D(x(d)(y.opt)) + ":", 1),
                  E("span", null, D(y.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: A((y) => [
              y.opt.type !== "fulltext" ? (m(), U(Ne, Ue({ key: 0 }, y.itemProps, { class: "suggest-item" }), {
                default: A(() => [
                  V(Ve, null, {
                    default: A(() => [
                      V(pe, { class: "suggest-title" }, {
                        default: A(() => [
                          (m(!0), v(T, null, $(x(w)(y.opt.title), (I, L) => (m(), v(T, {
                            key: `${y.opt.uid}-title-${L}`
                          }, [
                            I.highlighted ? (m(), v("mark", Gt, D(I.text), 1)) : (m(), v(T, { key: 1 }, [
                              N(D(I.text), 1)
                            ], 64))
                          ], 64))), 128))
                        ]),
                        _: 2
                      }, 1024),
                      V(pe, {
                        caption: "",
                        class: "suggest-meta"
                      }, {
                        default: A(() => [
                          x(c)(y.opt) ? (m(), U(ne, {
                            key: 0,
                            name: x(c)(y.opt),
                            color: x(f)(y.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : W("", !0),
                          N(" " + D(x(p)(y.opt)), 1),
                          x(a)(y.opt) > 0 ? (m(), v("span", Ut, " - " + D(x(a)(y.opt)) + " x", 1)) : W("", !0)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1040)) : W("", !0)
            ]),
            _: 1
          }, 8, ["modelValue", "options", "onNewValue", "onFilter"])
        ]),
        E("table", jt, [
          E("colgroup", null, [
            (m(!0), v(T, null, $(x(o), (y) => (m(), v("col", {
              key: `col-${y.key}`,
              style: je(y.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          E("thead", null, [
            E("tr", null, [
              (m(!0), v(T, null, $(x(o), (y) => (m(), v("th", {
                key: y.key,
                onClick: (I) => x(P)(y.key)
              }, [
                y.icon ? (m(), U(ne, {
                  key: 0,
                  name: y.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : W("", !0),
                E("span", null, D(y.label), 1),
                E("span", Yt, [
                  V(ne, {
                    name: x(q)(y.key) ?? "arrow_upward",
                    size: "14px",
                    class: Qe(["sort-icon", { "sort-icon--hidden": !x(q)(y.key) }])
                  }, null, 8, ["name", "class"])
                ])
              ], 8, Qt))), 128))
            ])
          ]),
          E("tbody", null, [
            (m(!0), v(T, null, $(x(l), (y, I) => (m(), v("tr", { key: I }, [
              (m(!0), v(T, null, $(x(o), (L) => (m(), v("td", {
                key: L.key
              }, [
                x(g)(L.key).length > 0 ? (m(), v(T, { key: 0 }, [
                  E("div", null, [
                    (m(!0), v(T, null, $(x(S)(y, L.key), (C, B) => (m(), v(T, {
                      key: `${L.key}-${I}-${B}`
                    }, [
                      C.highlighted ? (m(), v("mark", Jt, D(C.text), 1)) : (m(), v(T, { key: 1 }, [
                        N(D(C.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (m(!0), v(T, null, $(x(g)(L.key), (C) => (m(), v("span", {
                    key: `${L.key}-${C.key}-${I}`,
                    class: "subline-value",
                    title: x(R)(y, C.key)
                  }, [
                    E("span", null, [
                      (m(!0), v(T, null, $(x(S)(y, C.key), (B, We) => (m(), v(T, {
                        key: `${C.key}-${I}-${We}`
                      }, [
                        B.highlighted ? (m(), v("mark", Zt, D(B.text), 1)) : (m(), v(T, { key: 1 }, [
                          N(D(B.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, Xt))), 128))
                ], 64)) : L.key === "date" ? (m(), v("span", {
                  key: 1,
                  title: x(k)(y)
                }, [
                  (m(!0), v(T, null, $(x(S)(y, L.key), (C, B) => (m(), v(T, {
                    key: `date-${I}-${B}`
                  }, [
                    C.highlighted ? (m(), v("mark", tn, D(C.text), 1)) : (m(), v(T, { key: 1 }, [
                      N(D(C.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, en)) : (m(), v("span", {
                  key: 2,
                  title: x(R)(y, L.key)
                }, [
                  (m(!0), v(T, null, $(x(S)(y, L.key), (C, B) => (m(), v(T, {
                    key: `${L.key}-${I}-${B}`
                  }, [
                    C.highlighted ? (m(), v("mark", sn, D(C.text), 1)) : (m(), v(T, { key: 1 }, [
                      N(D(C.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, nn))
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]);
    };
  }
}), gn = {
  install(e) {
    e.component("TableSuggest", rn);
  }
}, on = (e, t) => {
  if (!t.modelName || !String(t.modelName).trim())
    throw new Error(`Invalid model definition for ${e.name}: modelName is required`);
  if (!Array.isArray(t.columns) || t.columns.length === 0)
    throw new Error(`Invalid model definition for ${e.name}: at least one column is required`);
  const n = /* @__PURE__ */ new Set();
  t.columns.forEach((s) => {
    if (!s.key || !String(s.key).trim())
      throw new Error(`Invalid model definition for ${e.name}: column key is required`);
    if (n.has(s.key))
      throw new Error(`Invalid model definition for ${e.name}: duplicate column key "${s.key}"`);
    if (n.add(s.key), s.renderAsSublineOf && !t.columns.some((r) => r.key === s.renderAsSublineOf))
      throw new Error(
        `Invalid model definition for ${e.name}: renderAsSublineOf references unknown key "${s.renderAsSublineOf}"`
      );
  });
};
class an {
  modelDefinitionStore = /* @__PURE__ */ new WeakMap();
  define(t, n) {
    on(t, n), this.modelDefinitionStore.set(t, n);
  }
  get(t) {
    const n = this.modelDefinitionStore.get(t);
    if (!n)
      throw new Error(`No model definition registered for ${t.name}`);
    return n;
  }
}
const Fe = new an(), ln = (e, t) => {
  Fe.define(e, t);
}, dn = (e, t) => {
  ln(e, t);
}, fn = () => (e) => e, hn = (e) => Fe.get(e);
export {
  ie as DateReference,
  Ce as DateRelation,
  he as SearchTokenFactory,
  b as SearchTokenModel,
  rn as TableSuggest,
  gn as TableSuggestPlugin,
  be as buildSuggestions,
  Bt as createSearchEngine,
  fn as createTypedModelDefinition,
  O as dateDomainService,
  gn as default,
  ln as defineModelDefinition,
  dn as defineTypedModelDefinition,
  Ot as filterItems,
  hn as getModelDefinition,
  un as highlightText,
  ye as isDateReference,
  ht as isDateReferenceLast,
  pt as isDateReferenceNext,
  nt as isDateRelation,
  le as isDateRelationAfter,
  ae as isDateRelationBefore,
  De as isDateRelationOn,
  ft as parseSearchSelectionState,
  gn as plugin,
  Mt as resolveEnglishLocale,
  se as resolveTokenCategory,
  Nt as resolveTokenIcon,
  Z as searchEngine
};
