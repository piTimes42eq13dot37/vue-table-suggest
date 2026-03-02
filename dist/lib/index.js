import { ref as G, computed as F, watch as _e, nextTick as Ee, defineComponent as Le, resolveComponent as O, openBlock as y, createElementBlock as v, createElementVNode as I, createVNode as q, unref as k, isRef as $e, withCtx as N, createBlock as Y, mergeProps as Re, Fragment as w, renderList as M, toDisplayString as E, createTextVNode as W, createCommentVNode as z, normalizeStyle as Ie, normalizeClass as Me } from "vue";
class Pe {
  normalizeNumberLike(e) {
    return String(e ?? "").replace(/[^0-9]/g, "");
  }
  formatGroupedNumber(e) {
    const t = this.normalizeNumberLike(e);
    return t ? t.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(e ?? "");
  }
  readValue(e, t) {
    if (t.accessor)
      return String(t.accessor(e) ?? "");
    const s = t.key;
    return String(e[s] ?? "");
  }
  getScopeColumns(e, t) {
    if (!t.length)
      return e.columns.filter((o) => o.searchable !== !1);
    const s = new Set(t), n = /* @__PURE__ */ new Set();
    return e.columns.forEach((o) => {
      s.has(o.key) && o.scopeGroup && n.add(o.scopeGroup);
    }), e.columns.filter((o) => !s.has(o.key) && !n.has(o.scopeGroup ?? "") ? !1 : o.searchable !== !1);
  }
  expandScopeKeys(e, t) {
    const s = new Set(t), n = /* @__PURE__ */ new Set();
    return e.columns.forEach((o) => {
      s.has(o.key) && o.scopeGroup && n.add(o.scopeGroup);
    }), Array.from(
      new Set(
        e.columns.filter((o) => s.has(o.key) || n.has(o.scopeGroup ?? "")).map((o) => o.key)
      )
    );
  }
  readValueByKey(e, t, s) {
    const n = t.columns.find((o) => o.key === s);
    return n ? this.readValue(e, n) : String(e[s] ?? "");
  }
}
const U = new Pe(), J = (r) => U.normalizeNumberLike(r), ge = (r) => U.formatGroupedNumber(r), te = (r, e) => U.readValue(r, e), Fe = (r, e) => U.getScopeColumns(r, e), Be = (r, e, t) => U.readValueByKey(r, e, t);
class Ae {
  escapeRegExp(e) {
    return String(e).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  escapeHtml(e) {
    return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  resolveEnglishLocale() {
    return typeof globalThis > "u" || typeof globalThis.navigator > "u" || !Array.isArray(globalThis.navigator.languages) ? "en-US" : globalThis.navigator.languages.find((e) => String(e).toLowerCase().startsWith("en")) ?? "en-US";
  }
  highlightText(e, t) {
    const s = this.escapeHtml(e), n = t.map((o) => String(o || "").trim()).filter((o) => o.length > 0);
    return n.length ? n.reduce((o, c) => {
      const g = J(c), l = g.length > 0 && g === String(c) ? g.split("").map((d) => this.escapeRegExp(d)).join("[^0-9]*") : this.escapeRegExp(this.escapeHtml(c)), i = new RegExp(l, "gi");
      return o.replace(i, (d) => `<mark>${d}</mark>`);
    }, s) : s;
  }
}
const de = new Ae(), fe = () => de.resolveEnglishLocale(), Oe = (r, e) => de.highlightText(r, e);
class Ne {
  startOfDay(e) {
    const t = new Date(e);
    return t.setHours(0, 0, 0, 0), t;
  }
  parseDateInput(e) {
    const t = String(e ?? "").trim(), s = t.match(/^(\d{2})\.(\d{2})\.(\d{4})$/), n = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!s && !n) return null;
    const o = Number(s ? s[3] : n[1]), c = Number(s ? s[2] : n[2]), g = Number(s ? s[1] : n[3]), f = new Date(o, c - 1, g);
    return f.setHours(0, 0, 0, 0), f.getFullYear() !== o || f.getMonth() !== c - 1 || f.getDate() !== g ? null : f;
  }
  formatDate(e) {
    const t = this.startOfDay(e), s = String(t.getDate()).padStart(2, "0"), n = String(t.getMonth() + 1).padStart(2, "0"), o = t.getFullYear();
    return `${s}.${n}.${o}`;
  }
  getMondayIndexFromDate(e) {
    return (this.startOfDay(e).getDay() + 6) % 7;
  }
  getLocalizedWeekdaysMondayFirst(e = "en-US") {
    const t = new Intl.DateTimeFormat(e, { weekday: "long" }), s = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (n, o) => {
      const c = new Date(s);
      return c.setDate(s.getDate() + o), t.format(c);
    });
  }
  getReferenceWeekdayDate(e, t, s = /* @__PURE__ */ new Date()) {
    const n = this.startOfDay(s), o = this.getMondayIndexFromDate(n), c = new Date(n);
    if (e === "last") {
      const f = (o - t + 7) % 7 || 7;
      return c.setDate(n.getDate() - f), c;
    }
    const g = (t - o + 7) % 7 || 7;
    return c.setDate(n.getDate() + g), c;
  }
  getIsoWeekInfo(e) {
    const t = this.startOfDay(e), s = (t.getDay() + 6) % 7, n = new Date(t);
    n.setDate(t.getDate() - s + 3);
    const o = n.getFullYear(), c = new Date(o, 0, 4), g = (c.getDay() + 6) % 7;
    return c.setDate(c.getDate() - g + 3), { weekNo: 1 + Math.round((n.getTime() - c.getTime()) / 6048e5), weekYear: o };
  }
  getDateMouseoverLabel(e, t = "en-US") {
    const s = this.parseDateInput(e);
    if (!s) return "";
    const n = new Intl.DateTimeFormat(t, {
      weekday: "long"
    }).format(s), { weekNo: o, weekYear: c } = this.getIsoWeekInfo(s);
    return `KW ${String(o).padStart(2, "0")}/${c} - ${n}`;
  }
}
const B = new Ne();
var he = /* @__PURE__ */ ((r) => (r.Before = "before", r.After = "after", r.On = "on", r))(he || {});
const pe = (r) => r === "before", ye = (r) => r === "after", me = (r) => r === "on", qe = (r) => pe(r) || ye(r) || me(r), re = pe, ne = ye, We = me, Ft = qe;
class x {
  static fulltext = "fulltext";
  static scope = "scope";
  static dateBefore = "date_before";
  static dateAfter = "date_after";
  static dateExact = "date_exact";
  static dateRelative = "date_relative";
  static isFulltext(e) {
    return e === x.fulltext;
  }
  static isScope(e) {
    return e === x.scope;
  }
  static isDateBefore(e) {
    return e === x.dateBefore;
  }
  static isDateAfter(e) {
    return e === x.dateAfter;
  }
  static isDateExact(e) {
    return e === x.dateExact;
  }
  static isDateRelative(e) {
    return e === x.dateRelative;
  }
  static isDate(e) {
    return x.isDateBefore(e) || x.isDateAfter(e) || x.isDateExact(e) || x.isDateRelative(e);
  }
  static isBuiltIn(e) {
    return x.isFulltext(e) || x.isScope(e) || x.isDate(e);
  }
  static isExactFilterType(e) {
    return !x.isFulltext(e) && !x.isScope(e);
  }
}
class L {
  selected;
  fulltext;
  exact;
  scopedKeys;
  constructor(e) {
    this.selected = e, this.fulltext = this.selected.filter((t) => x.isFulltext(t.type)), this.exact = this.selected.filter((t) => x.isExactFilterType(t.type)), this.scopedKeys = this.selected.filter((t) => x.isScope(t.type) && t.key).map((t) => t.key);
  }
  static from(e) {
    return new L(e);
  }
  static isExactTokenType(e) {
    return x.isExactFilterType(e);
  }
  static isDateToken(e) {
    return x.isDate(e.type);
  }
  static isFulltextToken(e) {
    return x.isFulltext(e.type);
  }
  static isScopeToken(e) {
    return x.isScope(e.type);
  }
  static isRelativeDateToken(e) {
    return x.isDateRelative(e.type);
  }
  static isExactFilterToken(e) {
    return L.isExactTokenType(e.type);
  }
  static resolveTermKey(e) {
    return e.key ?? (x.isDate(e.type) ? "date" : e.type);
  }
  static isBeforeDirection(e) {
    return x.isDateBefore(e.type) || re(e.direction);
  }
  static isAfterDirection(e) {
    return x.isDateAfter(e.type) || ne(e.direction);
  }
  static isOnDirection(e) {
    return x.isDateExact(e.type) || We(e.direction);
  }
  get fullTextTokens() {
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
      fullTextTokens: this.fullTextTokens,
      exactTokens: this.exactTokens,
      scopedColumnKeys: this.scopedColumnKeys
    };
  }
  isDateToken(e) {
    return L.isDateToken(e);
  }
  resolveTermKey(e) {
    return L.resolveTermKey(e);
  }
}
class He {
  filterItems(e, t, s) {
    const n = L.from(s), { fullTextTokens: o, exactTokens: c, scopedColumnKeys: g } = n.toParsedState(), f = Fe(t, g);
    return e.filter((l) => {
      for (const i of c) {
        const d = n.resolveTermKey(i), a = t.columns.find((m) => m.key === d), h = a ? te(l, a) : "";
        if (n.isDateToken(i)) {
          const m = B.parseDateInput(h), u = B.parseDateInput(i.rawTitle || i.title);
          if (!m || !u) return !1;
          const D = m.getTime(), b = u.getTime();
          if (L.isBeforeDirection(i) && !(D < b) || L.isAfterDirection(i) && !(D > b) || L.isOnDirection(i) && D !== b)
            return !1;
          continue;
        }
        if (a?.valueType === "number-like") {
          if (J(h) !== J(i.title))
            return !1;
          continue;
        }
        if (String(h).toLowerCase() !== String(i.title || "").toLowerCase())
          return !1;
      }
      for (const i of o) {
        const d = String(i.title || "").toLowerCase();
        if (!d) continue;
        if (!f.some(
          (h) => String(te(l, h)).toLowerCase().includes(d)
        )) return !1;
      }
      return !0;
    });
  }
}
const Ke = new He(), Se = (r, e, t) => Ke.filterItems(r, e, t);
class H {
  static getDateCategoryFromDirection(e) {
    return re(e) ? "date before" : ne(e) ? "date after" : "date exact";
  }
  static getDateOperationMetadata(e) {
    return x.isDateBefore(e) ? { category: "date before", icon: "event_busy" } : x.isDateAfter(e) ? { category: "date after", icon: "event_available" } : { category: "date exact", icon: "event" };
  }
  static createDateRelative(e) {
    return {
      uid: `${x.dateRelative}|${e.direction}|${e.reference}|${e.weekdayIndexMonday}|${e.dateText}`,
      type: x.dateRelative,
      title: e.title,
      rawTitle: e.dateText,
      category: H.getDateCategoryFromDirection(e.direction),
      icon: "event_repeat",
      direction: e.direction,
      reference: e.reference
    };
  }
  static createDateOperation(e, t) {
    const s = H.getDateOperationMetadata(e);
    return {
      uid: `${e}|${t}`,
      type: e,
      title: t,
      rawTitle: t,
      category: s.category,
      icon: s.icon
    };
  }
  static createScope(e) {
    return {
      uid: `${x.scope}|${e.key}`,
      type: x.scope,
      key: e.key,
      title: e.title,
      category: "Fulltext scope",
      icon: e.icon
    };
  }
}
class ze {
  parse(e) {
    const t = e.trim().toLowerCase();
    if (!t)
      return null;
    const s = t.startsWith("date ") ? t.slice(5).trim() : t, n = s.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
    if (n) {
      const f = String(n[1]).toLowerCase(), l = String(n[2] || "").toLowerCase() || null, i = String(n[3] || "").trim().toLowerCase();
      return i ? { direction: f, reference: l, weekdayPart: i, needle: s } : null;
    }
    const o = s.match(/^(last|next)\s+(.+)$/i);
    if (!o)
      return null;
    const c = String(o[1]).toLowerCase(), g = String(o[2] || "").trim().toLowerCase();
    return g ? {
      direction: he.On,
      reference: c,
      weekdayPart: g,
      needle: s
    } : null;
  }
}
const Ve = new ze(), ie = {
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
}, Ge = (r) => ({
  relativeDate: {
    ...ie.relativeDate
  },
  textScoring: {
    ...ie.textScoring
  }
});
class Ue {
  constructor(e) {
    this.config = e;
  }
  buildRelativeTitlePrefix(e, t) {
    return re(e) ? t === "last" ? "before last" : "before next" : ne(e) ? t === "last" ? "after last" : "after next" : t === "last" ? "on last" : "on next";
  }
  getPriority(e, t) {
    const s = e.toLowerCase();
    return s === t ? 3 : s.startsWith(t) ? 2 : s.includes(t) ? 1 : 0;
  }
  suggest(e, t, s) {
    if (String(s || "").trim().length < this.config.minQueryLength || t.some((i) => L.isRelativeDateToken(i)))
      return [];
    const n = Ve.parse(s);
    if (!n)
      return [];
    const o = e.locale ?? fe(), c = B.getLocalizedWeekdaysMondayFirst(o).map((i, d) => ({
      weekday: i,
      weekdayIndexMonday: d,
      weekdayLower: i.toLowerCase()
    })).filter((i) => i.weekdayLower.startsWith(n.weekdayPart)), g = n.reference ? [n.reference] : ["last", "next"], f = [], l = /* @__PURE__ */ new Set();
    return c.forEach((i) => {
      g.forEach((d) => {
        const a = B.getReferenceWeekdayDate(d, i.weekdayIndexMonday), h = B.formatDate(a), u = `${this.buildRelativeTitlePrefix(n.direction, d)} ${i.weekday}`;
        l.has(u) || (l.add(u), f.push(
          H.createDateRelative({
            direction: n.direction,
            reference: d,
            weekdayIndexMonday: i.weekdayIndexMonday,
            dateText: h,
            title: u
          })
        ));
      });
    }), f.sort((i, d) => this.getPriority(d.title, n.needle) - this.getPriority(i.title, n.needle)).slice(0, e.maxWeekdaySuggestions ?? this.config.defaultMaxWeekdaySuggestions);
  }
}
class Qe {
  suggest(e, t) {
    const s = B.parseDateInput(t);
    if (!s)
      return [];
    const n = new Set(e.map((g) => g.type)), o = B.formatDate(s);
    return [
      x.dateBefore,
      x.dateAfter,
      x.dateExact
    ].filter((g) => !n.has(g)).map((g) => H.createDateOperation(g, o));
  }
}
class Ye {
  constructor(e) {
    this.config = e;
  }
  getPositionWeight(e, t) {
    if (!t)
      return 0;
    const s = e.indexOf(t);
    return s < 0 ? -1 : s === 0 ? this.config.scoreStart : s + t.length === e.length ? this.config.scoreEnd : this.config.scoreMiddle;
  }
  getBestWordMatchScore(e, t) {
    if (!t)
      return 0;
    const s = String(e || "").split(/\s+/).filter((o) => o.length > 0);
    let n = -1;
    return s.forEach((o, c) => {
      const g = this.getPositionWeight(o, t);
      if (g < 0)
        return;
      const f = this.config.wordScoreBase - c * this.config.wordIndexWeight + g;
      f > n && (n = f);
    }), n;
  }
  score(e, t, s) {
    if (!s)
      return 1;
    const n = String(e || "").toLowerCase(), o = this.getBestWordMatchScore(n, s);
    if (o < 0)
      return -1;
    const g = String(t || "").toLowerCase().includes(s) ? this.config.scoreCategoryMatch : 0, f = n === s ? this.config.scoreExactMatch : 0, l = Math.min(
      this.config.maxLengthPenalty,
      Math.floor(n.length / this.config.lengthPenaltyDivisor)
    );
    return o + g + f - l;
  }
}
class Je {
  merge(...e) {
    const t = [], s = /* @__PURE__ */ new Set();
    return e.flat().forEach((n) => {
      s.has(n.uid) || (s.add(n.uid), t.push(n));
    }), t;
  }
}
const xe = (r) => {
  const e = Ge();
  return {
    relativeDateSuggestionPolicy: new Ue(e.relativeDate),
    dateOperationSuggestionPolicy: new Qe(),
    textSuggestionScoringPolicy: new Ye(e.textScoring),
    uniqueSuggestionMergeService: new Je()
  };
}, X = xe();
X.relativeDateSuggestionPolicy;
X.dateOperationSuggestionPolicy;
X.textSuggestionScoringPolicy;
X.uniqueSuggestionMergeService;
const Xe = 1, ae = 3, Ze = (r, e) => `${r}|${e}`, le = (r) => r.valueType === "number-like", ce = (r) => String(r).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
class je {
  constructor(e) {
    this.dependencies = e;
  }
  getRelativeCandidates(e, t, s) {
    return this.dependencies.policies.relativeDateSuggestionPolicy.suggest(e, t, s);
  }
  getDateOperationCandidates(e, t) {
    return this.dependencies.policies.dateOperationSuggestionPolicy.suggest(e, t);
  }
  countTermOccurrencesInValue(e, t) {
    const s = String(e ?? "").toLowerCase();
    if (!s || !t)
      return 0;
    const n = J(t), c = n.length > 0 && n === String(t) ? n.split("").map((l) => ce(l)).join("[^0-9]*") : ce(String(t)), g = new RegExp(c, "gi"), f = s.match(g);
    return f ? f.length : 0;
  }
  countColumnMatchesForTerms(e, t, s, n) {
    if (!n.length)
      return 0;
    const o = [s];
    return e.reduce((c, g) => {
      const f = n.reduce((l, i) => {
        const d = o.reduce((a, h) => a + this.countTermOccurrencesInValue(Be(g, t, h), i), 0);
        return l + d;
      }, 0);
      return c + f;
    }, 0);
  }
  buildNormalCandidates(e, t, s, n) {
    const o = new Set(
      s.map((u) => u.type).filter((u) => u && L.isExactTokenType(u))
    ), c = [], g = /* @__PURE__ */ new Set(), f = this.dependencies.filterItems(e, t, s);
    t.columns.filter((u) => u.suggestionEnabled !== !1).forEach((u) => {
      o.has(u.key) || new Set(f.map((D) => te(D, u))).forEach((D) => {
        const b = String(D ?? "");
        if (!b) return;
        const A = Ze(u.key, b);
        if (g.has(A)) return;
        g.add(A);
        const S = le(u) ? ge(b) : b, T = le(u) ? b : S, C = this.dependencies.policies.textSuggestionScoringPolicy.score(T, u.label, n);
        C < 0 && n.length > 0 || c.push({
          uid: A,
          type: u.key,
          key: u.key,
          title: S,
          rawTitle: b,
          category: u.label,
          icon: u.icon,
          _score: C,
          _columnType: u.key
        });
      });
    });
    const l = (u, D) => D._score !== u._score ? D._score - u._score : u.title.localeCompare(D.title), i = c.slice().sort(l), d = [], a = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set();
    i.slice(0, ae).forEach((u) => {
      a.has(u.uid) || (a.add(u.uid), h.add(u._columnType), d.push(u));
    });
    const m = i.slice(ae);
    return m.forEach((u) => {
      a.has(u.uid) || h.has(u._columnType) || (a.add(u.uid), h.add(u._columnType), d.push(u));
    }), m.forEach((u) => {
      a.has(u.uid) || (a.add(u.uid), d.push(u));
    }), d.map((u) => {
      const D = { ...u };
      return delete D._score, delete D._columnType, D;
    });
  }
  buildScopeCandidates(e, t, s, n) {
    const o = s.filter((i) => L.isFulltextToken(i)).map((i) => String(i.title || "").toLowerCase()).filter((i) => i.length > 0), c = s.filter((i) => L.isExactFilterToken(i)), g = this.dependencies.filterItems(e, t, c), f = new Set(
      s.filter((i) => L.isScopeToken(i) && i.key).map((i) => i.key)
    );
    return t.columns.filter((i) => i.searchable !== !1).filter((i) => !f.has(i.key)).map((i) => {
      const d = this.countColumnMatchesForTerms(g, t, i.key, o), a = n.length === 0 ? 1 : this.dependencies.policies.textSuggestionScoringPolicy.score(i.label, "Fulltext scope", n);
      return {
        ...H.createScope({
          key: i.key,
          title: i.label,
          icon: i.icon
        }),
        matchCount: d,
        _score: a
      };
    }).filter((i) => (i.matchCount ?? 0) > 0).filter((i) => n.length === 0 || i._score >= 0).sort((i, d) => {
      const a = i.matchCount ?? 0, h = d.matchCount ?? 0;
      return h !== a ? h - a : d._score !== i._score ? d._score - i._score : i.title.localeCompare(d.title);
    }).map((i) => {
      const d = { ...i };
      return delete d._score, d;
    });
  }
  collectCandidates(e, t) {
    const s = t.map((n) => n(e));
    return this.dependencies.policies.uniqueSuggestionMergeService.merge(...s);
  }
  buildSuggestions(e, t, s, n) {
    const o = String(n || "").trim().toLowerCase(), c = t.maxSuggestions ?? 7, g = {
      items: e,
      modelDefinition: t,
      selected: s,
      rawInput: n,
      needle: o
    }, f = (m) => this.getDateOperationCandidates(m.selected, m.rawInput), l = (m) => this.getRelativeCandidates(m.modelDefinition, m.selected, m.rawInput), i = (m) => this.buildScopeCandidates(
      m.items,
      m.modelDefinition,
      m.selected,
      m.needle
    ), d = (m) => this.buildNormalCandidates(
      m.items,
      m.modelDefinition,
      m.selected,
      m.needle
    ), a = this.collectCandidates(g, [
      f,
      l
    ]);
    return s.some((m) => L.isFulltextToken(m)) ? this.collectCandidates(g, [
      f,
      l,
      i,
      d
    ]).slice(0, c) : a.length > 0 ? a.slice(0, c) : o.length < Xe ? [] : d(g).slice(0, c);
  }
}
const et = (r) => ({
  policies: xe(),
  filterItems: Se
}), tt = (r) => {
  const e = et();
  return new je(e);
}, st = tt(), rt = (r, e, t, s) => st.buildSuggestions(r, e, t, s);
class nt {
  constructor(e) {
    this.dependencies = e;
  }
  resolveEnglishLocale() {
    return this.dependencies.resolveEnglishLocale();
  }
  highlightText(e, t) {
    return this.dependencies.highlightText(e, t);
  }
  filterItems(e, t, s) {
    return this.dependencies.filterItems(e, t, s);
  }
  buildSuggestions(e, t, s, n) {
    return this.dependencies.buildSuggestions(e, t, s, n);
  }
}
const ot = {
  resolveEnglishLocale: fe,
  highlightText: Oe,
  filterItems: Se,
  buildSuggestions: rt
}, it = (r = {}) => {
  const e = {
    ...ot,
    ...r
  }, t = new nt(e);
  return {
    resolveEnglishLocale: () => t.resolveEnglishLocale(),
    highlightText: (s, n) => t.highlightText(s, n),
    filterItems: (s, n, o) => t.filterItems(s, n, o),
    buildSuggestions: (s, n, o, c) => t.buildSuggestions(s, n, o, c)
  };
}, Z = it(), at = () => Z.resolveEnglishLocale(), Bt = (r, e) => Z.highlightText(r, e), lt = (r, e, t) => Z.filterItems(r, e, t), ue = (r, e, t, s) => Z.buildSuggestions(r, e, t, s), ct = (r) => {
  const e = G(""), t = G([]), s = G([]), n = G(null), o = F(
    () => ue(r.items, r.modelDefinition, t.value, e.value)
  ), c = F(
    () => t.value.filter((a) => a.type === "fulltext").map((a) => a.title)
  ), g = F(
    () => t.value.filter((a) => a.type === "scope" && a.key).map((a) => a.key)
  ), f = (a) => {
    if (t.value.some((h) => h.uid === a.uid)) {
      e.value = "", s.value = [];
      return;
    }
    t.value = [...t.value, a], e.value = "", s.value = [];
  };
  _e(t, (a) => {
    const h = a.filter(
      (u, D, b) => b.findIndex((A) => A.uid === u.uid) === D
    );
    if (h.length !== a.length) {
      t.value = h;
      return;
    }
    if (!a.some((u) => u.type === "fulltext") && a.some((u) => u.type === "scope")) {
      t.value = a.filter((u) => u.type !== "scope");
      return;
    }
    e.value = "", s.value = [], Ee(() => {
      n.value?.updateInputValue?.("", !0, !0), n.value?.hidePopup?.();
    });
  });
  const l = (a) => {
    const h = String(a || "").trim();
    if (!h) return;
    const m = h.toLowerCase(), u = ue(
      r.items,
      r.modelDefinition,
      t.value,
      h
    ).find((D) => String(D.type).startsWith("date_") ? String(D.title || "").trim().toLowerCase() === m : !1);
    if (u) {
      f(u);
      return;
    }
    f({
      uid: `fulltext|${h}`,
      type: "fulltext",
      title: h,
      category: "Fulltext",
      icon: "search"
    });
  };
  return {
    query: e,
    selected: t,
    filterOptions: s,
    qSelectRef: n,
    fulltextTerms: c,
    scopedKeys: g,
    createValue: (a, h) => {
      l(a), h(null);
    },
    filterFn: (a, h) => {
      h(() => {
        e.value = a, s.value = o.value.filter((m) => m.type !== "fulltext");
      });
    }
  };
};
class ut {
  escapeRegExp(e) {
    return String(e).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  normalizeDigits(e) {
    return String(e || "").replace(/[^0-9]/g, "");
  }
  buildTermPattern(e) {
    const t = this.normalizeDigits(e);
    return t.length > 0 && t === e ? t.split("").map((n) => this.escapeRegExp(n)).join("[^0-9]*") : this.escapeRegExp(e);
  }
  mergeRanges(e) {
    if (!e.length)
      return [];
    const t = e.slice().sort((n, o) => n.start - o.start), s = [t[0]];
    return t.slice(1).forEach((n) => {
      const o = s[s.length - 1];
      if (n.start <= o.end) {
        o.end = Math.max(o.end, n.end);
        return;
      }
      s.push({ ...n });
    }), s;
  }
  groupSublineColumnsByParent(e) {
    const t = /* @__PURE__ */ new Map();
    return e.forEach((s) => {
      const n = s.renderAsSublineOf;
      if (!n)
        return;
      const o = t.get(n) ?? [];
      t.set(n, [...o, s]);
    }), t;
  }
  sortRows(e, t, s, n, o) {
    const c = t.find((f) => f.key === s.key), g = e.slice();
    return !c || c.sortable === !1 || g.sort((f, l) => {
      const i = (h) => c.accessor ? String(c.accessor(h) ?? "") : String(h[c.key] ?? ""), d = i(f), a = i(l);
      if (c.key === "date") {
        const h = o(d), m = o(a);
        if (h && m) {
          const u = h.getTime(), D = m.getTime();
          return s.asc ? u - D : D - u;
        }
      }
      return s.asc ? n(d, a) : n(a, d);
    }), g;
  }
  shouldHighlightColumn(e, t, s, n) {
    if (!t.length)
      return !1;
    if (!s.length)
      return !0;
    const o = new Set(s), c = n.filter((l) => o.has(l.key)), g = new Set(c.map((l) => l.scopeGroup).filter(Boolean));
    if (o.has(e))
      return !0;
    const f = n.find((l) => l.key === e);
    return f?.scopeGroup ? g.has(f.scopeGroup) : !1;
  }
  buildHighlightSegments(e, t) {
    const s = String(e ?? ""), n = Array.from(
      new Set(t.map((a) => String(a || "").trim()).filter((a) => a.length > 0))
    );
    if (!n.length)
      return [{ text: s, highlighted: !1 }];
    const o = n.slice().sort((a, h) => h.length - a.length).map((a) => this.buildTermPattern(a)).join("|"), c = new RegExp(o, "gi"), g = [];
    let f = c.exec(s);
    for (; f; ) {
      const a = f[0] ?? "";
      a.length > 0 && g.push({ start: f.index, end: f.index + a.length }), a.length === 0 && (c.lastIndex += 1), f = c.exec(s);
    }
    if (!g.length)
      return [{ text: s, highlighted: !1 }];
    const l = this.mergeRanges(g), i = [];
    let d = 0;
    return l.forEach((a) => {
      a.start > d && i.push({ text: s.slice(d, a.start), highlighted: !1 }), i.push({ text: s.slice(a.start, a.end), highlighted: !0 }), d = a.end;
    }), d < s.length && i.push({ text: s.slice(d), highlighted: !1 }), i;
  }
}
const V = new ut(), gt = (r) => {
  const t = G({ key: r.modelDefinition.columns.find((S) => !S.renderAsSublineOf && S.sortable !== !1)?.key ?? "", asc: !0 }), s = F(() => r.modelDefinition.locale ?? at()), n = F(
    () => new Intl.Collator(s.value, { numeric: !0, sensitivity: "base" })
  ), o = F(
    () => r.modelDefinition.columns.filter((S) => !S.renderAsSublineOf)
  ), c = F(() => V.groupSublineColumnsByParent(r.modelDefinition.columns)), g = F(() => lt(r.items, r.modelDefinition, r.selected.value)), f = F(() => V.sortRows(
    g.value,
    r.modelDefinition.columns,
    t.value,
    (S, T) => n.value.compare(S, T),
    (S) => B.parseDateInput(S)
  )), l = (S) => V.shouldHighlightColumn(
    S,
    r.fulltextTerms.value,
    r.scopedKeys.value,
    r.modelDefinition.columns
  ), i = (S) => r.modelDefinition.columns.find((T) => T.key === S), d = (S) => c.value.get(S) ?? [], a = (S, T) => {
    const C = i(T), Q = (K) => C?.valueType === "number-like" ? ge(K) : String(K ?? "");
    return C?.accessor ? Q(C.accessor(S)) : Q(S[T]);
  };
  return {
    visibleColumns: o,
    sortedRows: f,
    getColumnByKey: i,
    getSublineColumns: d,
    getTooltip: (S, T) => {
      const C = i(T);
      return C?.tooltipHint ? typeof C.tooltipHint == "function" ? C.tooltipHint(S) : C.tooltipHint : "";
    },
    toggleSort: (S) => {
      if (i(S)?.sortable !== !1) {
        if (t.value.key !== S) {
          t.value = { key: S, asc: !0 };
          return;
        }
        t.value = { key: S, asc: !t.value.asc };
      }
    },
    sortIcon: (S) => t.value.key !== S ? null : t.value.asc ? "arrow_upward" : "arrow_downward",
    cellSegments: (S, T) => {
      const C = a(S, T);
      return l(T) ? V.buildHighlightSegments(C, r.fulltextTerms.value) : [{ text: C, highlighted: !1 }];
    },
    suggestionTitleSegments: (S) => V.buildHighlightSegments(S, [r.query.value]),
    dateHint: (S) => {
      const T = a(S, "date");
      return B.getDateMouseoverLabel(T, s.value);
    }
  };
}, ee = {
  fulltext: "teal-9",
  scope: "green-8",
  subcolumn: "light-blue-9"
}, dt = {
  date_before: "Date before",
  date_after: "Date after",
  date_exact: "Date exact",
  date_relative: "Date",
  fulltext: "Full-Text",
  scope: "In Column"
}, ft = (r, e) => {
  const t = (l) => {
    const i = l.key ?? l.type;
    return !!e(i)?.renderAsSublineOf;
  }, s = (l) => {
    if (l.type === "scope" && t(l))
      return "In SubColumn";
    const i = r.tokenTypeLabelByType?.[l.type] ?? dt[l.type];
    if (i) return i;
    const d = l.key ?? l.type;
    return e(d)?.label ?? l.category ?? l.type;
  }, n = (l) => {
    if (ee[l.type]) return ee[l.type];
    const i = l.key ?? l.type;
    if (e(i)?.renderAsSublineOf)
      return ee.subcolumn;
  }, o = (l, i, d) => i?.[l.type] ?? n(l) ?? d ?? r.tokenDefaultColor ?? "indigo-9", c = (l) => o(l, r.tokenColorByType);
  return {
    chipTypeLabel: s,
    chipColor: c,
    optionBadgeColor: (l) => o(l, r.optionBadgeColorByType, c(l)),
    suggestionCategoryLabel: (l) => {
      const i = r.suggestionCategoryLabelByType?.[l.type];
      if (i) return i;
      if (t(l)) {
        const d = l.key ?? l.type, a = e(d);
        return `${(a?.renderAsSublineOf ? e(a.renderAsSublineOf)?.label : void 0) ?? a?.label ?? l.category ?? l.type}-SubColumn`;
      }
      return l.category ?? l.type;
    }
  };
}, ht = (r) => {
  const e = ct({
    items: r.items,
    modelDefinition: r.modelDefinition
  }), t = gt({
    items: r.items,
    modelDefinition: r.modelDefinition,
    selected: e.selected,
    fulltextTerms: e.fulltextTerms,
    scopedKeys: e.scopedKeys,
    query: e.query
  }), s = ft(r.modelDefinition, t.getColumnByKey);
  return {
    selected: e.selected,
    filterOptions: e.filterOptions,
    qSelectRef: e.qSelectRef,
    visibleColumns: t.visibleColumns,
    sortedRows: t.sortedRows,
    getSublineColumns: t.getSublineColumns,
    createValue: e.createValue,
    filterFn: e.filterFn,
    chipColor: s.chipColor,
    chipTypeLabel: s.chipTypeLabel,
    optionBadgeColor: s.optionBadgeColor,
    suggestionCategoryLabel: s.suggestionCategoryLabel,
    suggestionTitleSegments: t.suggestionTitleSegments,
    toggleSort: t.toggleSort,
    sortIcon: t.sortIcon,
    cellSegments: t.cellSegments,
    dateHint: t.dateHint,
    getTooltip: t.getTooltip
  };
}, pt = { class: "table-suggest" }, yt = { class: "search-wrap" }, mt = { key: 0 }, St = { key: 1 }, xt = { class: "data-table" }, vt = ["onClick"], Dt = { class: "sort-icon-slot" }, kt = { key: 0 }, wt = ["title"], bt = { key: 0 }, Tt = ["title"], Ct = { key: 0 }, _t = ["title"], Et = { key: 0 }, Lt = /* @__PURE__ */ Le({
  __name: "TableSuggest",
  props: {
    items: {},
    modelDefinition: {}
  },
  setup(r) {
    const e = r, {
      selected: t,
      filterOptions: s,
      qSelectRef: n,
      visibleColumns: o,
      sortedRows: c,
      getSublineColumns: g,
      createValue: f,
      filterFn: l,
      chipColor: i,
      chipTypeLabel: d,
      optionBadgeColor: a,
      suggestionCategoryLabel: h,
      suggestionTitleSegments: m,
      toggleSort: u,
      sortIcon: D,
      cellSegments: b,
      dateHint: A,
      getTooltip: S
    } = ht(e);
    return (T, C) => {
      const Q = O("q-avatar"), oe = O("q-chip"), K = O("q-item-label"), j = O("q-icon"), we = O("q-item-section"), be = O("q-item"), Te = O("q-select");
      return y(), v("div", pt, [
        I("div", yt, [
          q(Te, {
            ref_key: "qSelectRef",
            ref: n,
            modelValue: k(t),
            "onUpdate:modelValue": C[0] || (C[0] = (p) => $e(t) ? t.value = p : null),
            class: "search-field",
            "input-class": "search-input",
            label: "Search",
            "use-input": "",
            "use-chips": "",
            multiple: "",
            "input-debounce": "0",
            "option-label": "title",
            "option-value": "uid",
            options: k(s),
            onNewValue: k(f),
            onFilter: k(l)
          }, {
            "selected-item": N((p) => [
              q(oe, {
                removable: "",
                dense: "",
                class: "chip",
                color: k(i)(p.opt),
                "text-color": "white",
                onRemove: (R) => p.removeAtIndex(p.index)
              }, {
                default: N(() => [
                  p.opt.icon ? (y(), Y(Q, {
                    key: 0,
                    color: "white",
                    "text-color": k(i)(p.opt),
                    icon: p.opt.icon
                  }, null, 8, ["text-color", "icon"])) : z("", !0),
                  I("span", null, E(k(d)(p.opt)) + ":", 1),
                  I("span", null, E(p.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: N((p) => [
              p.opt.type !== "fulltext" ? (y(), Y(be, Re({ key: 0 }, p.itemProps, { class: "suggest-item" }), {
                default: N(() => [
                  q(we, null, {
                    default: N(() => [
                      q(K, { class: "suggest-title" }, {
                        default: N(() => [
                          (y(!0), v(w, null, M(k(m)(p.opt.title), (R, $) => (y(), v(w, {
                            key: `${p.opt.uid}-title-${$}`
                          }, [
                            R.highlighted ? (y(), v("mark", mt, E(R.text), 1)) : (y(), v(w, { key: 1 }, [
                              W(E(R.text), 1)
                            ], 64))
                          ], 64))), 128))
                        ]),
                        _: 2
                      }, 1024),
                      q(K, {
                        caption: "",
                        class: "suggest-meta"
                      }, {
                        default: N(() => [
                          p.opt.icon ? (y(), Y(j, {
                            key: 0,
                            name: p.opt.icon,
                            color: k(a)(p.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : z("", !0),
                          W(" " + E(k(h)(p.opt)), 1),
                          (p.opt.matchCount ?? 0) > 0 ? (y(), v("span", St, " - " + E(p.opt.matchCount) + " x", 1)) : z("", !0)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1040)) : z("", !0)
            ]),
            _: 1
          }, 8, ["modelValue", "options", "onNewValue", "onFilter"])
        ]),
        I("table", xt, [
          I("colgroup", null, [
            (y(!0), v(w, null, M(k(o), (p) => (y(), v("col", {
              key: `col-${p.key}`,
              style: Ie(p.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          I("thead", null, [
            I("tr", null, [
              (y(!0), v(w, null, M(k(o), (p) => (y(), v("th", {
                key: p.key,
                onClick: (R) => k(u)(p.key)
              }, [
                p.icon ? (y(), Y(j, {
                  key: 0,
                  name: p.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : z("", !0),
                I("span", null, E(p.label), 1),
                I("span", Dt, [
                  q(j, {
                    name: k(D)(p.key) ?? "arrow_upward",
                    size: "14px",
                    class: Me(["sort-icon", { "sort-icon--hidden": !k(D)(p.key) }])
                  }, null, 8, ["name", "class"])
                ])
              ], 8, vt))), 128))
            ])
          ]),
          I("tbody", null, [
            (y(!0), v(w, null, M(k(c), (p, R) => (y(), v("tr", { key: R }, [
              (y(!0), v(w, null, M(k(o), ($) => (y(), v("td", {
                key: $.key
              }, [
                k(g)($.key).length > 0 ? (y(), v(w, { key: 0 }, [
                  I("div", null, [
                    (y(!0), v(w, null, M(k(b)(p, $.key), (_, P) => (y(), v(w, {
                      key: `${$.key}-${R}-${P}`
                    }, [
                      _.highlighted ? (y(), v("mark", kt, E(_.text), 1)) : (y(), v(w, { key: 1 }, [
                        W(E(_.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (y(!0), v(w, null, M(k(g)($.key), (_) => (y(), v("span", {
                    key: `${$.key}-${_.key}-${R}`,
                    class: "subline-value",
                    title: k(S)(p, _.key)
                  }, [
                    I("span", null, [
                      (y(!0), v(w, null, M(k(b)(p, _.key), (P, Ce) => (y(), v(w, {
                        key: `${_.key}-${R}-${Ce}`
                      }, [
                        P.highlighted ? (y(), v("mark", bt, E(P.text), 1)) : (y(), v(w, { key: 1 }, [
                          W(E(P.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, wt))), 128))
                ], 64)) : $.key === "date" ? (y(), v("span", {
                  key: 1,
                  title: k(A)(p)
                }, [
                  (y(!0), v(w, null, M(k(b)(p, $.key), (_, P) => (y(), v(w, {
                    key: `date-${R}-${P}`
                  }, [
                    _.highlighted ? (y(), v("mark", Ct, E(_.text), 1)) : (y(), v(w, { key: 1 }, [
                      W(E(_.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, Tt)) : (y(), v("span", {
                  key: 2,
                  title: k(S)(p, $.key)
                }, [
                  (y(!0), v(w, null, M(k(b)(p, $.key), (_, P) => (y(), v(w, {
                    key: `${$.key}-${R}-${P}`
                  }, [
                    _.highlighted ? (y(), v("mark", Et, E(_.text), 1)) : (y(), v(w, { key: 1 }, [
                      W(E(_.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, _t))
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]);
    };
  }
}), At = {
  install(r) {
    r.component("TableSuggest", Lt);
  }
}, $t = (r, e) => {
  if (!e.modelName || !String(e.modelName).trim())
    throw new Error(`Invalid model definition for ${r.name}: modelName is required`);
  if (!Array.isArray(e.columns) || e.columns.length === 0)
    throw new Error(`Invalid model definition for ${r.name}: at least one column is required`);
  const t = /* @__PURE__ */ new Set();
  e.columns.forEach((s) => {
    if (!s.key || !String(s.key).trim())
      throw new Error(`Invalid model definition for ${r.name}: column key is required`);
    if (t.has(s.key))
      throw new Error(`Invalid model definition for ${r.name}: duplicate column key "${s.key}"`);
    if (t.add(s.key), s.renderAsSublineOf && !e.columns.some((n) => n.key === s.renderAsSublineOf))
      throw new Error(
        `Invalid model definition for ${r.name}: renderAsSublineOf references unknown key "${s.renderAsSublineOf}"`
      );
  });
};
class Rt {
  modelDefinitionStore = /* @__PURE__ */ new WeakMap();
  define(e, t) {
    $t(e, t), this.modelDefinitionStore.set(e, t);
  }
  get(e) {
    const t = this.modelDefinitionStore.get(e);
    if (!t)
      throw new Error(`No model definition registered for ${e.name}`);
    return t;
  }
}
const ve = new Rt(), It = (r, e) => {
  ve.define(r, e);
}, Ot = (r, e) => {
  It(r, e);
}, Nt = () => (r) => r, qt = (r) => ve.get(r);
var se = /* @__PURE__ */ ((r) => (r.Last = "last", r.Next = "next", r))(se || {});
const De = (r) => r === "last", ke = (r) => r === "next", Mt = (r) => De(r) || ke(r);
class Wt {
  static last = se.Last;
  static next = se.Next;
  static isLast(e) {
    return De(e);
  }
  static isNext(e) {
    return ke(e);
  }
  static isValid(e) {
    return Mt(e);
  }
}
export {
  Wt as DateReferenceValueObject,
  he as DateRelation,
  L as SearchSelection,
  H as SearchTokenFactory,
  x as SearchTokenTypeValueObject,
  Lt as TableSuggest,
  At as TableSuggestPlugin,
  ue as buildSuggestions,
  it as createSearchEngine,
  Nt as createTypedModelDefinition,
  B as dateDomainService,
  At as default,
  It as defineModelDefinition,
  Ot as defineTypedModelDefinition,
  lt as filterItems,
  qt as getModelDefinition,
  Bt as highlightText,
  qe as isDateRelation,
  ye as isDateRelationAfter,
  pe as isDateRelationBefore,
  me as isDateRelationOn,
  Ft as isSearchDirection,
  ne as isSearchDirectionAfter,
  re as isSearchDirectionBefore,
  We as isSearchDirectionOn,
  At as plugin,
  at as resolveEnglishLocale,
  Z as searchEngine
};
