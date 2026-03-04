import { ref as H, computed as O, watch as He, nextTick as ze, defineComponent as Ge, resolveComponent as A, openBlock as S, createElementBlock as v, createElementVNode as $, createVNode as N, unref as x, isRef as Ue, withCtx as V, createBlock as U, mergeProps as je, Fragment as w, renderList as B, toDisplayString as R, createTextVNode as q, createCommentVNode as W, normalizeStyle as Qe, normalizeClass as Ye } from "vue";
class Je {
  normalizeNumberLike(e) {
    return String(e ?? "").replace(/[^0-9]/g, "");
  }
  formatGroupedNumber(e) {
    const n = this.normalizeNumberLike(e);
    return n ? n.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(e ?? "");
  }
  readValue(e, n) {
    if (n.accessor)
      return String(n.accessor(e) ?? "");
    const s = n.key;
    return String(e[s] ?? "");
  }
  getScopeColumns(e, n) {
    if (!n.length)
      return e.columns.filter((o) => o.searchable !== !1);
    const s = new Set(n), r = /* @__PURE__ */ new Set();
    return e.columns.forEach((o) => {
      s.has(o.key) && o.scopeGroup && r.add(o.scopeGroup);
    }), e.columns.filter((o) => !s.has(o.key) && !r.has(o.scopeGroup ?? "") ? !1 : o.searchable !== !1);
  }
  expandScopeKeys(e, n) {
    const s = new Set(n), r = /* @__PURE__ */ new Set();
    return e.columns.forEach((o) => {
      s.has(o.key) && o.scopeGroup && r.add(o.scopeGroup);
    }), Array.from(
      new Set(
        e.columns.filter((o) => s.has(o.key) || r.has(o.scopeGroup ?? "")).map((o) => o.key)
      )
    );
  }
  readValueByKey(e, n, s) {
    const r = n.columns.find((o) => o.key === s);
    return r ? this.readValue(e, r) : String(e[s] ?? "");
  }
}
const z = new Je(), j = (t) => z.normalizeNumberLike(t), we = (t) => z.formatGroupedNumber(t), oe = (t, e) => z.readValue(t, e), Xe = (t, e) => z.getScopeColumns(t, e), Ze = (t, e, n) => z.readValueByKey(t, e, n);
class et {
  escapeRegExp(e) {
    return String(e).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  escapeHtml(e) {
    return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  resolveEnglishLocale() {
    return typeof globalThis > "u" || typeof globalThis.navigator > "u" || !Array.isArray(globalThis.navigator.languages) ? "en-US" : globalThis.navigator.languages.find((e) => String(e).toLowerCase().startsWith("en")) ?? "en-US";
  }
  highlightText(e, n) {
    const s = this.escapeHtml(e), r = n.map((o) => String(o || "").trim()).filter((o) => o.length > 0);
    return r.length ? r.reduce((o, u) => {
      const d = j(u), m = d.length > 0 && d === String(u) ? d.split("").map((f) => this.escapeRegExp(f)).join("[^0-9]*") : this.escapeRegExp(this.escapeHtml(u)), i = new RegExp(m, "gi");
      return o.replace(i, (f) => `<mark>${f}</mark>`);
    }, s) : s;
  }
}
const ke = new et(), Ce = () => ke.resolveEnglishLocale(), tt = (t, e) => ke.highlightText(t, e), nt = () => Ce();
class st {
  startOfDay(e) {
    const n = new Date(e);
    return n.setHours(0, 0, 0, 0), n;
  }
  parseDateInput(e) {
    const n = String(e ?? "").trim(), s = n.match(/^(\d{2})\.(\d{2})\.(\d{4})$/), r = n.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!s && !r) return null;
    const o = Number(s ? s[3] : r[1]), u = Number(s ? s[2] : r[2]), d = Number(s ? s[1] : r[3]), g = new Date(o, u - 1, d);
    return g.setHours(0, 0, 0, 0), g.getFullYear() !== o || g.getMonth() !== u - 1 || g.getDate() !== d ? null : g;
  }
  formatDate(e) {
    const n = this.startOfDay(e), s = String(n.getDate()).padStart(2, "0"), r = String(n.getMonth() + 1).padStart(2, "0"), o = n.getFullYear();
    return `${s}.${r}.${o}`;
  }
  getMondayIndexFromDate(e) {
    return (this.startOfDay(e).getDay() + 6) % 7;
  }
  getLocalizedWeekdaysMondayFirst(e = "en-US") {
    const n = new Intl.DateTimeFormat(e, { weekday: "long" }), s = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (r, o) => {
      const u = new Date(s);
      return u.setDate(s.getDate() + o), n.format(u);
    });
  }
  getReferenceWeekdayDate(e, n, s = /* @__PURE__ */ new Date()) {
    const r = this.startOfDay(s), o = this.getMondayIndexFromDate(r), u = new Date(r);
    if (e === "last") {
      const g = (o - n + 7) % 7 || 7;
      return u.setDate(r.getDate() - g), u;
    }
    const d = (n - o + 7) % 7 || 7;
    return u.setDate(r.getDate() + d), u;
  }
  getIsoWeekInfo(e) {
    const n = this.startOfDay(e), s = (n.getDay() + 6) % 7, r = new Date(n);
    r.setDate(n.getDate() - s + 3);
    const o = r.getFullYear(), u = new Date(o, 0, 4), d = (u.getDay() + 6) % 7;
    return u.setDate(u.getDate() - d + 3), { weekNo: 1 + Math.round((r.getTime() - u.getTime()) / 6048e5), weekYear: o };
  }
  getDateMouseoverLabel(e, n = "en-US") {
    const s = this.parseDateInput(e);
    if (!s) return "";
    const r = new Intl.DateTimeFormat(n, {
      weekday: "long"
    }).format(s), { weekNo: o, weekYear: u } = this.getIsoWeekInfo(s);
    return `KW ${String(o).padStart(2, "0")}/${u} - ${r}`;
  }
}
const F = new st();
var De = /* @__PURE__ */ ((t) => (t.Before = "before", t.After = "after", t.On = "on", t))(De || {});
const ae = (t) => t === "before", le = (t) => t === "after", _e = (t) => t === "on", rt = (t) => ae(t) || le(t) || _e(t), k = {
  fulltext: "fulltext",
  scope: "scope",
  dateBefore: "date_before",
  dateAfter: "date_after",
  dateExact: "date_exact",
  dateRelative: "date_relative"
}, ot = [
  k.dateBefore,
  k.dateAfter,
  k.dateExact
], it = {
  [k.fulltext]: "search",
  [k.scope]: "tune",
  [k.dateBefore]: "event_busy",
  [k.dateAfter]: "event_available",
  [k.dateExact]: "event",
  [k.dateRelative]: "event_repeat"
}, Q = (t) => t === k.fulltext, Y = (t) => t === k.scope, ce = (t) => t === k.dateBefore, ue = (t) => t === k.dateAfter, de = (t) => t === k.dateExact, ge = (t) => t === k.dateRelative, fe = (t) => ce(t) || ue(t) || de(t) || ge(t), Le = (t) => Q(t) || Y(t) || fe(t), Re = (t) => !Q(t) && !Y(t), at = (t) => Q(t.type), Ie = (t) => Y(t.type), Ee = (t) => ce(t.type), $e = (t) => ue(t.type), Be = (t) => de(t.type), J = (t) => ge(t.type), Me = (t) => fe(t.type), lt = (t) => Le(t.type), Pe = (t) => Re(t.type), ct = (t) => Ee(t) || J(t) && ae(t.dateRelation), ut = (t) => $e(t) || J(t) && le(t.dateRelation), dt = (t) => Be(t) || J(t) && _e(t.dateRelation), gt = (t) => Me(t) ? "date" : Ie(t) || Pe(t) && t.key ? t.key : t.type, T = {
  fulltext: k.fulltext,
  scope: k.scope,
  dateBefore: k.dateBefore,
  dateAfter: k.dateAfter,
  dateExact: k.dateExact,
  dateRelative: k.dateRelative,
  dateOperationTypes: ot,
  isFulltextType: Q,
  isScopeType: Y,
  isDateBeforeType: ce,
  isDateAfterType: ue,
  isDateExactType: de,
  isDateRelativeType: ge,
  isDateType: fe,
  isBuiltInType: Le,
  isExactCellValueType: Re,
  isFulltext: at,
  isScope: Ie,
  isDateBefore: Ee,
  isDateAfter: $e,
  isDateExact: Be,
  isDateRelative: J,
  isDate: Me,
  isBuiltIn: lt,
  isExactCellValue: Pe,
  isBeforeDirection: ct,
  isAfterDirection: ut,
  isOnDirection: dt,
  resolveTermKey: gt
}, ft = (t) => {
  if ("icon" in t && t.icon)
    return t.icon;
  if (T.isBuiltIn(t))
    return it[t.type];
}, se = (t, e) => {
  const n = e?.suggestionCategoryLabelByType?.[t.type];
  if (n)
    return n;
  if (T.isDateBefore(t))
    return "date before";
  if (T.isDateAfter(t))
    return "date after";
  if (T.isDateExact(t))
    return "date exact";
  if (T.isDateRelative(t))
    return t.dateRelation === "before" ? "date before" : t.dateRelation === "after" ? "date after" : "date exact";
  if (T.isFulltext(t))
    return "Fulltext";
  if (T.isScope(t))
    return "Fulltext scope";
  const s = "key" in t ? t.key : void 0;
  if (s) {
    const r = e?.getColumnByKey?.(s);
    if (r?.label)
      return r.label;
  }
  return t.type;
};
class he {
  selected;
  fulltext;
  exact;
  scopedKeys;
  constructor(e) {
    this.selected = e, this.fulltext = this.selected.filter((n) => T.isFulltext(n)), this.exact = this.selected.filter((n) => T.isExactCellValue(n)), this.scopedKeys = this.selected.filter((n) => T.isScope(n)).map((n) => n.key);
  }
  static from(e) {
    return new he(e);
  }
  get fulltextTokens() {
    return this.fulltext;
  }
  get exactTokens() {
    return this.exact;
  }
  get scopedColumnKeys() {
    return this.scopedKeys;
  }
  toParsedState() {
    return {
      fulltextTokens: this.fulltextTokens,
      exactTokens: this.exactTokens,
      scopedColumnKeys: this.scopedColumnKeys
    };
  }
}
class ht {
  filterItems(e, n, s) {
    const r = he.from(s), { fulltextTokens: o, exactTokens: u, scopedColumnKeys: d } = r.toParsedState(), g = Xe(n, d);
    return e.filter((m) => {
      for (const i of u) {
        const f = T.resolveTermKey(i), l = n.columns.find((h) => h.key === f), a = l ? oe(m, l) : "";
        if (T.isDate(i)) {
          const h = F.parseDateInput(a), c = F.parseDateInput(i.rawTitle || i.title);
          if (!h || !c) return !1;
          const b = h.getTime(), C = c.getTime();
          if (T.isBeforeDirection(i) && !(b < C) || T.isAfterDirection(i) && !(b > C) || T.isOnDirection(i) && b !== C)
            return !1;
          continue;
        }
        if (l?.valueType === "number-like") {
          if (j(a) !== j(i.title))
            return !1;
          continue;
        }
        if (String(a).toLowerCase() !== String(i.title || "").toLowerCase())
          return !1;
      }
      for (const i of o) {
        const f = String(i.title || "").toLowerCase();
        if (!f) continue;
        if (!g.some(
          (a) => String(oe(m, a)).toLowerCase().includes(f)
        )) return !1;
      }
      return !0;
    });
  }
}
const pt = new ht(), Oe = (t, e, n) => pt.filterItems(t, e, n), yt = (t, e, n) => Oe(t, e, n);
class pe {
  static createDateRelative(e) {
    return {
      uid: `${T.dateRelative}|${e.dateRelation}|${e.reference}|${e.weekdayIndexMonday}|${e.dateText}`,
      type: "date_relative",
      title: e.title,
      rawTitle: e.dateText,
      dateRelation: e.dateRelation,
      reference: e.reference
    };
  }
  static createDateOperation(e, n) {
    return {
      uid: `${e}|${n}`,
      type: e,
      title: n,
      rawTitle: n
    };
  }
  static createScope(e) {
    return {
      uid: `${T.scope}|${e.key}`,
      type: "scope",
      key: e.key,
      title: e.title,
      icon: e.icon
    };
  }
}
var ie = /* @__PURE__ */ ((t) => (t.Last = "last", t.Next = "next", t))(ie || {});
const mt = (t) => t === "last", St = (t) => t === "next", me = (t) => mt(t) || St(t);
class vt {
  parse(e) {
    const n = e.trim().toLowerCase();
    if (!n)
      return null;
    const s = n.startsWith("date ") ? n.slice(5).trim() : n, r = s.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
    if (r) {
      const m = String(r[1]).toLowerCase();
      if (!rt(m))
        return null;
      const i = String(r[2] || "").toLowerCase(), f = i && me(i) ? i : null, l = String(r[3] || "").trim().toLowerCase();
      return l ? { dateRelation: m, reference: f, weekdayPart: l, needle: s } : null;
    }
    const o = s.match(/^(last|next)\s+(.+)$/i);
    if (!o)
      return null;
    const u = String(o[1]).toLowerCase();
    if (!me(u))
      return null;
    const d = u, g = String(o[2] || "").trim().toLowerCase();
    return g ? {
      dateRelation: De.On,
      reference: d,
      weekdayPart: g,
      needle: s
    } : null;
  }
}
const xt = new vt(), Se = {
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
}, bt = (t) => ({
  relativeDate: {
    ...Se.relativeDate
  },
  textScoring: {
    ...Se.textScoring
  }
});
class Tt {
  constructor(e) {
    this.config = e;
  }
  buildRelativeTitlePrefix(e, n) {
    return ae(e) ? n === "last" ? "before last" : "before next" : le(e) ? n === "last" ? "after last" : "after next" : n === "last" ? "on last" : "on next";
  }
  getPriority(e, n) {
    const s = e.toLowerCase();
    return s === n ? 3 : s.startsWith(n) ? 2 : s.includes(n) ? 1 : 0;
  }
  suggest(e, n, s) {
    if (String(s || "").trim().length < this.config.minQueryLength || n.some((i) => T.isDateRelative(i)))
      return [];
    const r = xt.parse(s);
    if (!r)
      return [];
    const o = e.locale ?? nt(), u = F.getLocalizedWeekdaysMondayFirst(o).map((i, f) => ({
      weekday: i,
      weekdayIndexMonday: f,
      weekdayLower: i.toLowerCase()
    })).filter((i) => i.weekdayLower.startsWith(r.weekdayPart)), d = r.reference ? [r.reference] : [ie.Last, ie.Next], g = [], m = /* @__PURE__ */ new Set();
    return u.forEach((i) => {
      d.forEach((f) => {
        const l = F.getReferenceWeekdayDate(f, i.weekdayIndexMonday), a = F.formatDate(l), c = `${this.buildRelativeTitlePrefix(r.dateRelation, f)} ${i.weekday}`;
        m.has(c) || (m.add(c), g.push(
          pe.createDateRelative({
            dateRelation: r.dateRelation,
            reference: f,
            weekdayIndexMonday: i.weekdayIndexMonday,
            dateText: a,
            title: c
          })
        ));
      });
    }), g.sort((i, f) => this.getPriority(f.title, r.needle) - this.getPriority(i.title, r.needle)).slice(0, e.maxWeekdaySuggestions ?? this.config.defaultMaxWeekdaySuggestions);
  }
}
class wt {
  suggest(e, n) {
    const s = F.parseDateInput(n);
    if (!s)
      return [];
    const r = new Set(e.map((d) => d.type)), o = F.formatDate(s);
    return T.dateOperationTypes.filter((d) => !r.has(d)).map((d) => pe.createDateOperation(d, o));
  }
}
class kt {
  constructor(e) {
    this.config = e;
  }
  getPositionWeight(e, n) {
    if (!n)
      return 0;
    const s = e.indexOf(n);
    return s < 0 ? -1 : s === 0 ? this.config.scoreStart : s + n.length === e.length ? this.config.scoreEnd : this.config.scoreMiddle;
  }
  getBestWordMatchScore(e, n) {
    if (!n)
      return 0;
    const s = String(e || "").split(/\s+/).filter((o) => o.length > 0);
    let r = -1;
    return s.forEach((o, u) => {
      const d = this.getPositionWeight(o, n);
      if (d < 0)
        return;
      const g = this.config.wordScoreBase - u * this.config.wordIndexWeight + d;
      g > r && (r = g);
    }), r;
  }
  score(e, n, s) {
    if (!s)
      return 1;
    const r = String(e || "").toLowerCase(), o = this.getBestWordMatchScore(r, s);
    if (o < 0)
      return -1;
    const d = String(n || "").toLowerCase().includes(s) ? this.config.scoreCategoryMatch : 0, g = r === s ? this.config.scoreExactMatch : 0, m = Math.min(
      this.config.maxLengthPenalty,
      Math.floor(r.length / this.config.lengthPenaltyDivisor)
    );
    return o + d + g - m;
  }
}
class Ct {
  merge(...e) {
    const n = [], s = /* @__PURE__ */ new Set();
    return e.flat().forEach((r) => {
      s.has(r.uid) || (s.add(r.uid), n.push(r));
    }), n;
  }
}
const Fe = (t) => {
  const e = bt();
  return {
    relativeDateSuggestionPolicy: new Tt(e.relativeDate),
    dateOperationSuggestionPolicy: new wt(),
    textSuggestionScoringPolicy: new kt(e.textScoring),
    uniqueSuggestionMergeService: new Ct()
  };
}, X = Fe();
X.relativeDateSuggestionPolicy;
X.dateOperationSuggestionPolicy;
X.textSuggestionScoringPolicy;
X.uniqueSuggestionMergeService;
const Dt = 1, ve = 3, _t = (t, e) => `${t}|${e}`, xe = (t) => t.valueType === "number-like", be = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
class Lt {
  constructor(e) {
    this.dependencies = e;
  }
  getRelativeCandidates(e, n, s) {
    return this.dependencies.policies.relativeDateSuggestionPolicy.suggest(e, n, s);
  }
  getDateOperationCandidates(e, n) {
    return this.dependencies.policies.dateOperationSuggestionPolicy.suggest(e, n);
  }
  countTermOccurrencesInValue(e, n) {
    const s = String(e ?? "").toLowerCase();
    if (!s || !n)
      return 0;
    const r = j(n), u = r.length > 0 && r === String(n) ? r.split("").map((m) => be(m)).join("[^0-9]*") : be(String(n)), d = new RegExp(u, "gi"), g = s.match(d);
    return g ? g.length : 0;
  }
  countColumnMatchesForTerms(e, n, s, r) {
    if (!r.length)
      return 0;
    const o = [s];
    return e.reduce((u, d) => {
      const g = r.reduce((m, i) => {
        const f = o.reduce((l, a) => l + this.countTermOccurrencesInValue(Ze(d, n, a), i), 0);
        return m + f;
      }, 0);
      return u + g;
    }, 0);
  }
  buildNormalCandidates(e, n, s, r) {
    const o = new Set(
      s.map((c) => c.type).filter((c) => c && T.isExactCellValueType(c))
    ), u = [], d = /* @__PURE__ */ new Set(), g = this.dependencies.filterItems(e, n, s);
    n.columns.filter((c) => c.suggestionEnabled !== !1).forEach((c) => {
      o.has(c.key) || new Set(g.map((b) => oe(b, c))).forEach((b) => {
        const C = String(b ?? "");
        if (!C) return;
        const M = _t(c.key, C);
        if (d.has(M)) return;
        d.add(M);
        const p = xe(c) ? we(C) : C, D = xe(c) ? C : p, _ = this.dependencies.policies.textSuggestionScoringPolicy.score(D, c.label, r);
        _ < 0 && r.length > 0 || u.push({
          uid: M,
          type: c.key,
          key: c.key,
          title: p,
          icon: c.icon,
          _score: _,
          _columnType: c.key
        });
      });
    });
    const m = (c, b) => b._score !== c._score ? b._score - c._score : c.title.localeCompare(b.title), i = u.slice().sort(m), f = [], l = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
    i.slice(0, ve).forEach((c) => {
      l.has(c.uid) || (l.add(c.uid), a.add(c._columnType), f.push(c));
    });
    const h = i.slice(ve);
    return h.forEach((c) => {
      l.has(c.uid) || a.has(c._columnType) || (l.add(c.uid), a.add(c._columnType), f.push(c));
    }), h.forEach((c) => {
      l.has(c.uid) || (l.add(c.uid), f.push(c));
    }), f.map((c) => {
      const b = { ...c };
      return delete b._score, delete b._columnType, b;
    });
  }
  buildScopeCandidates(e, n, s, r) {
    const o = s.filter((i) => T.isFulltext(i)).map((i) => String(i.title || "").toLowerCase()).filter((i) => i.length > 0), u = s.filter((i) => T.isExactCellValue(i)), d = this.dependencies.filterItems(e, n, u), g = new Set(
      s.filter(
        (i) => T.isScope(i) && "key" in i
      ).map((i) => i.key)
    );
    return n.columns.filter((i) => i.searchable !== !1).filter((i) => !g.has(i.key)).map((i) => {
      const f = this.countColumnMatchesForTerms(d, n, i.key, o), l = r.length === 0 ? 1 : this.dependencies.policies.textSuggestionScoringPolicy.score(i.label, "Fulltext scope", r);
      return {
        ...pe.createScope({
          key: i.key,
          title: i.label,
          icon: i.icon
        }),
        matchCount: f,
        _score: l
      };
    }).filter((i) => (i.matchCount ?? 0) > 0).filter((i) => r.length === 0 || i._score >= 0).sort((i, f) => {
      const l = i.matchCount ?? 0, a = f.matchCount ?? 0;
      return a !== l ? a - l : f._score !== i._score ? f._score - i._score : i.title.localeCompare(f.title);
    }).map((i) => {
      const f = { ...i };
      return delete f._score, f;
    });
  }
  collectCandidates(e, n) {
    const s = n.map((r) => r(e));
    return this.dependencies.policies.uniqueSuggestionMergeService.merge(...s);
  }
  buildSuggestions(e, n, s, r) {
    const o = String(r || "").trim().toLowerCase(), u = n.maxSuggestions ?? 7, d = {
      items: e,
      modelDefinition: n,
      selected: s,
      rawInput: r,
      needle: o
    }, g = (h) => this.getDateOperationCandidates(h.selected, h.rawInput), m = (h) => this.getRelativeCandidates(h.modelDefinition, h.selected, h.rawInput), i = (h) => this.buildScopeCandidates(
      h.items,
      h.modelDefinition,
      h.selected,
      h.needle
    ), f = (h) => this.buildNormalCandidates(
      h.items,
      h.modelDefinition,
      h.selected,
      h.needle
    ), l = this.collectCandidates(d, [
      g,
      m
    ]);
    return s.some((h) => T.isFulltext(h)) ? this.collectCandidates(d, [
      g,
      m,
      i,
      f
    ]).slice(0, u) : l.length > 0 ? l.slice(0, u) : o.length < Dt ? [] : f(d).slice(0, u);
  }
}
const Rt = (t) => ({
  policies: Fe(),
  filterItems: yt
}), It = (t) => {
  const e = Rt();
  return new Lt(e);
}, Et = It(), $t = (t, e, n, s) => Et.buildSuggestions(t, e, n, s);
class Bt {
  constructor(e) {
    this.dependencies = e;
  }
  resolveEnglishLocale() {
    return this.dependencies.resolveEnglishLocale();
  }
  highlightText(e, n) {
    return this.dependencies.highlightText(e, n);
  }
  filterItems(e, n, s) {
    return this.dependencies.filterItems(e, n, s);
  }
  buildSuggestions(e, n, s, r) {
    return this.dependencies.buildSuggestions(e, n, s, r);
  }
}
const Mt = {
  resolveEnglishLocale: Ce,
  highlightText: tt,
  filterItems: Oe,
  buildSuggestions: $t
}, Pt = (t = {}) => {
  const e = {
    ...Mt,
    ...t
  }, n = new Bt(e);
  return {
    resolveEnglishLocale: () => n.resolveEnglishLocale(),
    highlightText: (s, r) => n.highlightText(s, r),
    filterItems: (s, r, o) => n.filterItems(s, r, o),
    buildSuggestions: (s, r, o, u) => n.buildSuggestions(s, r, o, u)
  };
}, Z = Pt(), Ot = () => Z.resolveEnglishLocale(), un = (t, e) => Z.highlightText(t, e), Ft = (t, e, n) => Z.filterItems(t, e, n), Te = (t, e, n, s) => Z.buildSuggestions(t, e, n, s), At = (t) => {
  const e = H(""), n = H([]), s = H([]), r = H(null), o = O(
    () => Te(t.items, t.modelDefinition, n.value, e.value)
  ), u = O(
    () => n.value.filter((l) => l.type === "fulltext").map((l) => l.title)
  ), d = O(
    () => n.value.filter(
      (l) => T.isScope(l) && "key" in l
    ).map((l) => l.key)
  ), g = (l) => {
    if (n.value.some((a) => a.uid === l.uid)) {
      e.value = "", s.value = [];
      return;
    }
    n.value = [...n.value, l], e.value = "", s.value = [];
  };
  He(n, (l) => {
    const a = l.filter(
      (c, b, C) => C.findIndex((M) => M.uid === c.uid) === b
    );
    if (a.length !== l.length) {
      n.value = a;
      return;
    }
    if (!l.some((c) => c.type === "fulltext") && l.some((c) => c.type === "scope")) {
      n.value = l.filter((c) => c.type !== "scope");
      return;
    }
    e.value = "", s.value = [], ze(() => {
      r.value?.updateInputValue?.("", !0, !0), r.value?.hidePopup?.();
    });
  });
  const m = (l) => {
    const a = String(l || "").trim();
    if (!a) return;
    const h = a.toLowerCase(), c = Te(
      t.items,
      t.modelDefinition,
      n.value,
      a
    ).find((b) => String(b.type).startsWith("date_") ? String(b.title || "").trim().toLowerCase() === h : !1);
    if (c) {
      g(c);
      return;
    }
    g({
      uid: `fulltext|${a}`,
      type: "fulltext",
      title: a
    });
  };
  return {
    query: e,
    selected: n,
    filterOptions: s,
    qSelectRef: r,
    fulltextTerms: u,
    scopedKeys: d,
    createValue: (l, a) => {
      m(l), a(null);
    },
    filterFn: (l, a) => {
      a(() => {
        e.value = l, s.value = o.value.filter((h) => h.type !== "fulltext");
      });
    }
  };
};
class Vt {
  escapeRegExp(e) {
    return String(e).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  normalizeDigits(e) {
    return String(e || "").replace(/[^0-9]/g, "");
  }
  buildTermPattern(e) {
    const n = this.normalizeDigits(e);
    return n.length > 0 && n === e ? n.split("").map((r) => this.escapeRegExp(r)).join("[^0-9]*") : this.escapeRegExp(e);
  }
  mergeRanges(e) {
    if (!e.length)
      return [];
    const n = e.slice().sort((r, o) => r.start - o.start), s = [n[0]];
    return n.slice(1).forEach((r) => {
      const o = s[s.length - 1];
      if (r.start <= o.end) {
        o.end = Math.max(o.end, r.end);
        return;
      }
      s.push({ ...r });
    }), s;
  }
  groupSublineColumnsByParent(e) {
    const n = /* @__PURE__ */ new Map();
    return e.forEach((s) => {
      const r = s.renderAsSublineOf;
      if (!r)
        return;
      const o = n.get(r) ?? [];
      n.set(r, [...o, s]);
    }), n;
  }
  sortRows(e, n, s, r, o) {
    const u = n.find((g) => g.key === s.key), d = e.slice();
    return !u || u.sortable === !1 || d.sort((g, m) => {
      const i = (a) => u.accessor ? String(u.accessor(a) ?? "") : String(a[u.key] ?? ""), f = i(g), l = i(m);
      if (u.key === "date") {
        const a = o(f), h = o(l);
        if (a && h) {
          const c = a.getTime(), b = h.getTime();
          return s.asc ? c - b : b - c;
        }
      }
      return s.asc ? r(f, l) : r(l, f);
    }), d;
  }
  shouldHighlightColumn(e, n, s, r) {
    if (!n.length)
      return !1;
    if (!s.length)
      return !0;
    const o = new Set(s), u = r.filter((m) => o.has(m.key)), d = new Set(u.map((m) => m.scopeGroup).filter(Boolean));
    if (o.has(e))
      return !0;
    const g = r.find((m) => m.key === e);
    return g?.scopeGroup ? d.has(g.scopeGroup) : !1;
  }
  buildHighlightSegments(e, n) {
    const s = String(e ?? ""), r = Array.from(
      new Set(n.map((l) => String(l || "").trim()).filter((l) => l.length > 0))
    );
    if (!r.length)
      return [{ text: s, highlighted: !1 }];
    const o = r.slice().sort((l, a) => a.length - l.length).map((l) => this.buildTermPattern(l)).join("|"), u = new RegExp(o, "gi"), d = [];
    let g = u.exec(s);
    for (; g; ) {
      const l = g[0] ?? "";
      l.length > 0 && d.push({ start: g.index, end: g.index + l.length }), l.length === 0 && (u.lastIndex += 1), g = u.exec(s);
    }
    if (!d.length)
      return [{ text: s, highlighted: !1 }];
    const m = this.mergeRanges(d), i = [];
    let f = 0;
    return m.forEach((l) => {
      l.start > f && i.push({ text: s.slice(f, l.start), highlighted: !1 }), i.push({ text: s.slice(l.start, l.end), highlighted: !0 }), f = l.end;
    }), f < s.length && i.push({ text: s.slice(f), highlighted: !1 }), i;
  }
}
const K = new Vt(), Nt = (t) => {
  const n = H({ key: t.modelDefinition.columns.find((p) => !p.renderAsSublineOf && p.sortable !== !1)?.key ?? "", asc: !0 }), s = O(() => t.modelDefinition.locale ?? Ot()), r = O(
    () => new Intl.Collator(s.value, { numeric: !0, sensitivity: "base" })
  ), o = O(
    () => t.modelDefinition.columns.filter((p) => !p.renderAsSublineOf)
  ), u = O(() => K.groupSublineColumnsByParent(t.modelDefinition.columns)), d = O(() => Ft(t.items, t.modelDefinition, t.selected.value)), g = O(() => K.sortRows(
    d.value,
    t.modelDefinition.columns,
    n.value,
    (p, D) => r.value.compare(p, D),
    (p) => F.parseDateInput(p)
  )), m = (p) => K.shouldHighlightColumn(
    p,
    t.fulltextTerms.value,
    t.scopedKeys.value,
    t.modelDefinition.columns
  ), i = (p) => t.modelDefinition.columns.find((D) => D.key === p), f = (p) => u.value.get(p) ?? [], l = (p, D) => {
    const _ = i(D), ee = (G) => _?.valueType === "number-like" ? we(G) : String(G ?? "");
    return _?.accessor ? ee(_.accessor(p)) : ee(p[D]);
  };
  return {
    visibleColumns: o,
    sortedRows: g,
    getColumnByKey: i,
    getSublineColumns: f,
    getTooltip: (p, D) => {
      const _ = i(D);
      return _?.tooltipHint ? typeof _.tooltipHint == "function" ? _.tooltipHint(p) : _.tooltipHint : "";
    },
    toggleSort: (p) => {
      if (i(p)?.sortable !== !1) {
        if (n.value.key !== p) {
          n.value = { key: p, asc: !0 };
          return;
        }
        n.value = { key: p, asc: !n.value.asc };
      }
    },
    sortIcon: (p) => n.value.key !== p ? null : n.value.asc ? "arrow_upward" : "arrow_downward",
    cellSegments: (p, D) => {
      const _ = l(p, D);
      return m(D) ? K.buildHighlightSegments(_, t.fulltextTerms.value) : [{ text: _, highlighted: !1 }];
    },
    suggestionTitleSegments: (p) => K.buildHighlightSegments(p, [t.query.value]),
    dateHint: (p) => {
      const D = l(p, "date");
      return F.getDateMouseoverLabel(D, s.value);
    }
  };
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
}, Wt = (t, e) => {
  const n = (a) => (a.type === "scope" || !T.isBuiltIn(a)) && "key" in a ? a.key : void 0, s = (a) => {
    const h = n(a) ?? a.type, c = e(h);
    if (c) return c;
    if (a.type === "scope" && a.title)
      return t.columns.find((b) => b.label === a.title);
  }, r = (a) => !!s(a)?.renderAsSublineOf, o = (a) => {
    if (a.type === "scope" && r(a))
      return "In SubColumn";
    const h = t.tokenTypeLabelByType?.[a.type] ?? qt[a.type];
    if (h) return h;
    const c = n(a) ?? a.type;
    return e(c)?.label ?? se(a, {
      getColumnByKey: (C) => e(C),
      suggestionCategoryLabelByType: t.suggestionCategoryLabelByType
    });
  }, u = (a) => {
    if (re[a.type]) return re[a.type];
    const h = n(a) ?? a.type;
    if (e(h)?.renderAsSublineOf)
      return re.subcolumn;
  }, d = (a, h, c) => h?.[a.type] ?? u(a) ?? c ?? t.tokenDefaultColor ?? "indigo-9", g = (a) => d(a, t.tokenColorByType);
  return {
    chipTypeLabel: o,
    chipColor: g,
    optionBadgeColor: (a) => d(a, t.optionBadgeColorByType, g(a)),
    suggestionCategoryLabel: (a) => {
      const h = t.suggestionCategoryLabelByType?.[a.type];
      if (h) return h;
      if (r(a)) {
        const c = s(a);
        return `${(c?.renderAsSublineOf ? e(c.renderAsSublineOf)?.label : void 0) ?? c?.label ?? se(a, {
          getColumnByKey: (C) => e(C),
          suggestionCategoryLabelByType: t.suggestionCategoryLabelByType
        })}-SubColumn`;
      }
      return se(a, {
        getColumnByKey: (c) => e(c),
        suggestionCategoryLabelByType: t.suggestionCategoryLabelByType
      });
    },
    tokenIcon: (a) => ft(a),
    tokenMatchCount: (a) => "matchCount" in a ? a.matchCount ?? 0 : 0
  };
}, Kt = (t) => {
  const e = At({
    items: t.items,
    modelDefinition: t.modelDefinition
  }), n = Nt({
    items: t.items,
    modelDefinition: t.modelDefinition,
    selected: e.selected,
    fulltextTerms: e.fulltextTerms,
    scopedKeys: e.scopedKeys,
    query: e.query
  }), s = Wt(t.modelDefinition, n.getColumnByKey);
  return {
    selected: e.selected,
    filterOptions: e.filterOptions,
    qSelectRef: e.qSelectRef,
    visibleColumns: n.visibleColumns,
    sortedRows: n.sortedRows,
    getSublineColumns: n.getSublineColumns,
    createValue: e.createValue,
    filterFn: e.filterFn,
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
}, Ht = { class: "table-suggest" }, zt = { class: "search-wrap" }, Gt = { key: 0 }, Ut = { key: 1 }, jt = { class: "data-table" }, Qt = ["onClick"], Yt = { class: "sort-icon-slot" }, Jt = { key: 0 }, Xt = ["title"], Zt = { key: 0 }, en = ["title"], tn = { key: 0 }, nn = ["title"], sn = { key: 0 }, rn = /* @__PURE__ */ Ge({
  __name: "TableSuggest",
  props: {
    items: {},
    modelDefinition: {}
  },
  setup(t) {
    const e = t, {
      selected: n,
      filterOptions: s,
      qSelectRef: r,
      visibleColumns: o,
      sortedRows: u,
      getSublineColumns: d,
      createValue: g,
      filterFn: m,
      chipColor: i,
      chipTypeLabel: f,
      tokenIcon: l,
      tokenMatchCount: a,
      optionBadgeColor: h,
      suggestionCategoryLabel: c,
      suggestionTitleSegments: b,
      toggleSort: C,
      sortIcon: M,
      cellSegments: p,
      dateHint: D,
      getTooltip: _
    } = Kt(e);
    return (ee, te) => {
      const G = A("q-avatar"), Ve = A("q-chip"), ye = A("q-item-label"), ne = A("q-icon"), Ne = A("q-item-section"), qe = A("q-item"), We = A("q-select");
      return S(), v("div", Ht, [
        $("div", zt, [
          N(We, {
            ref_key: "qSelectRef",
            ref: r,
            modelValue: x(n),
            "onUpdate:modelValue": te[0] || (te[0] = (y) => Ue(n) ? n.value = y : null),
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
            onNewValue: x(g),
            onFilter: x(m)
          }, {
            "selected-item": V((y) => [
              N(Ve, {
                removable: "",
                dense: "",
                class: "chip",
                color: x(i)(y.opt),
                "text-color": "white",
                onRemove: (E) => y.removeAtIndex(y.index)
              }, {
                default: V(() => [
                  x(l)(y.opt) ? (S(), U(G, {
                    key: 0,
                    color: "white",
                    "text-color": x(i)(y.opt),
                    icon: x(l)(y.opt)
                  }, null, 8, ["text-color", "icon"])) : W("", !0),
                  $("span", null, R(x(f)(y.opt)) + ":", 1),
                  $("span", null, R(y.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: V((y) => [
              y.opt.type !== "fulltext" ? (S(), U(qe, je({ key: 0 }, y.itemProps, { class: "suggest-item" }), {
                default: V(() => [
                  N(Ne, null, {
                    default: V(() => [
                      N(ye, { class: "suggest-title" }, {
                        default: V(() => [
                          (S(!0), v(w, null, B(x(b)(y.opt.title), (E, I) => (S(), v(w, {
                            key: `${y.opt.uid}-title-${I}`
                          }, [
                            E.highlighted ? (S(), v("mark", Gt, R(E.text), 1)) : (S(), v(w, { key: 1 }, [
                              q(R(E.text), 1)
                            ], 64))
                          ], 64))), 128))
                        ]),
                        _: 2
                      }, 1024),
                      N(ye, {
                        caption: "",
                        class: "suggest-meta"
                      }, {
                        default: V(() => [
                          x(l)(y.opt) ? (S(), U(ne, {
                            key: 0,
                            name: x(l)(y.opt),
                            color: x(h)(y.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : W("", !0),
                          q(" " + R(x(c)(y.opt)), 1),
                          x(a)(y.opt) > 0 ? (S(), v("span", Ut, " - " + R(x(a)(y.opt)) + " x", 1)) : W("", !0)
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
        $("table", jt, [
          $("colgroup", null, [
            (S(!0), v(w, null, B(x(o), (y) => (S(), v("col", {
              key: `col-${y.key}`,
              style: Qe(y.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          $("thead", null, [
            $("tr", null, [
              (S(!0), v(w, null, B(x(o), (y) => (S(), v("th", {
                key: y.key,
                onClick: (E) => x(C)(y.key)
              }, [
                y.icon ? (S(), U(ne, {
                  key: 0,
                  name: y.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : W("", !0),
                $("span", null, R(y.label), 1),
                $("span", Yt, [
                  N(ne, {
                    name: x(M)(y.key) ?? "arrow_upward",
                    size: "14px",
                    class: Ye(["sort-icon", { "sort-icon--hidden": !x(M)(y.key) }])
                  }, null, 8, ["name", "class"])
                ])
              ], 8, Qt))), 128))
            ])
          ]),
          $("tbody", null, [
            (S(!0), v(w, null, B(x(u), (y, E) => (S(), v("tr", { key: E }, [
              (S(!0), v(w, null, B(x(o), (I) => (S(), v("td", {
                key: I.key
              }, [
                x(d)(I.key).length > 0 ? (S(), v(w, { key: 0 }, [
                  $("div", null, [
                    (S(!0), v(w, null, B(x(p)(y, I.key), (L, P) => (S(), v(w, {
                      key: `${I.key}-${E}-${P}`
                    }, [
                      L.highlighted ? (S(), v("mark", Jt, R(L.text), 1)) : (S(), v(w, { key: 1 }, [
                        q(R(L.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (S(!0), v(w, null, B(x(d)(I.key), (L) => (S(), v("span", {
                    key: `${I.key}-${L.key}-${E}`,
                    class: "subline-value",
                    title: x(_)(y, L.key)
                  }, [
                    $("span", null, [
                      (S(!0), v(w, null, B(x(p)(y, L.key), (P, Ke) => (S(), v(w, {
                        key: `${L.key}-${E}-${Ke}`
                      }, [
                        P.highlighted ? (S(), v("mark", Zt, R(P.text), 1)) : (S(), v(w, { key: 1 }, [
                          q(R(P.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, Xt))), 128))
                ], 64)) : I.key === "date" ? (S(), v("span", {
                  key: 1,
                  title: x(D)(y)
                }, [
                  (S(!0), v(w, null, B(x(p)(y, I.key), (L, P) => (S(), v(w, {
                    key: `date-${E}-${P}`
                  }, [
                    L.highlighted ? (S(), v("mark", tn, R(L.text), 1)) : (S(), v(w, { key: 1 }, [
                      q(R(L.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, en)) : (S(), v("span", {
                  key: 2,
                  title: x(_)(y, I.key)
                }, [
                  (S(!0), v(w, null, B(x(p)(y, I.key), (L, P) => (S(), v(w, {
                    key: `${I.key}-${E}-${P}`
                  }, [
                    L.highlighted ? (S(), v("mark", sn, R(L.text), 1)) : (S(), v(w, { key: 1 }, [
                      q(R(L.text), 1)
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
}), dn = {
  install(t) {
    t.component("TableSuggest", rn);
  }
}, on = (t, e) => {
  if (!e.modelName || !String(e.modelName).trim())
    throw new Error(`Invalid model definition for ${t.name}: modelName is required`);
  if (!Array.isArray(e.columns) || e.columns.length === 0)
    throw new Error(`Invalid model definition for ${t.name}: at least one column is required`);
  const n = /* @__PURE__ */ new Set();
  e.columns.forEach((s) => {
    if (!s.key || !String(s.key).trim())
      throw new Error(`Invalid model definition for ${t.name}: column key is required`);
    if (n.has(s.key))
      throw new Error(`Invalid model definition for ${t.name}: duplicate column key "${s.key}"`);
    if (n.add(s.key), s.renderAsSublineOf && !e.columns.some((r) => r.key === s.renderAsSublineOf))
      throw new Error(
        `Invalid model definition for ${t.name}: renderAsSublineOf references unknown key "${s.renderAsSublineOf}"`
      );
  });
};
class an {
  modelDefinitionStore = /* @__PURE__ */ new WeakMap();
  define(e, n) {
    on(e, n), this.modelDefinitionStore.set(e, n);
  }
  get(e) {
    const n = this.modelDefinitionStore.get(e);
    if (!n)
      throw new Error(`No model definition registered for ${e.name}`);
    return n;
  }
}
const Ae = new an(), ln = (t, e) => {
  Ae.define(t, e);
}, gn = (t, e) => {
  ln(t, e);
}, fn = () => (t) => t, hn = (t) => Ae.get(t);
export {
  ie as DateReference,
  De as DateRelation,
  he as SearchSelection,
  pe as SearchTokenFactory,
  T as SearchTokenModel,
  rn as TableSuggest,
  dn as TableSuggestPlugin,
  Te as buildSuggestions,
  Pt as createSearchEngine,
  fn as createTypedModelDefinition,
  F as dateDomainService,
  dn as default,
  ln as defineModelDefinition,
  gn as defineTypedModelDefinition,
  Ft as filterItems,
  hn as getModelDefinition,
  un as highlightText,
  me as isDateReference,
  mt as isDateReferenceLast,
  St as isDateReferenceNext,
  rt as isDateRelation,
  le as isDateRelationAfter,
  ae as isDateRelationBefore,
  _e as isDateRelationOn,
  dn as plugin,
  Ot as resolveEnglishLocale,
  se as resolveTokenCategory,
  ft as resolveTokenIcon,
  Z as searchEngine
};
