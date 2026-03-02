import { ref as G, computed as P, watch as _e, nextTick as Ee, defineComponent as Le, resolveComponent as O, openBlock as p, createElementBlock as v, createElementVNode as I, createVNode as q, unref as w, isRef as $e, withCtx as N, createBlock as Y, mergeProps as Re, Fragment as k, renderList as F, toDisplayString as E, createTextVNode as W, createCommentVNode as z, normalizeStyle as Ie, normalizeClass as Fe } from "vue";
class Me {
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
      return e.columns.filter((i) => i.searchable !== !1);
    const s = new Set(t), o = /* @__PURE__ */ new Set();
    return e.columns.forEach((i) => {
      s.has(i.key) && i.scopeGroup && o.add(i.scopeGroup);
    }), e.columns.filter((i) => !s.has(i.key) && !o.has(i.scopeGroup ?? "") ? !1 : i.searchable !== !1);
  }
  expandScopeKeys(e, t) {
    const s = new Set(t), o = /* @__PURE__ */ new Set();
    return e.columns.forEach((i) => {
      s.has(i.key) && i.scopeGroup && o.add(i.scopeGroup);
    }), Array.from(
      new Set(
        e.columns.filter((i) => s.has(i.key) || o.has(i.scopeGroup ?? "")).map((i) => i.key)
      )
    );
  }
  readValueByKey(e, t, s) {
    const o = t.columns.find((i) => i.key === s);
    return o ? this.readValue(e, o) : String(e[s] ?? "");
  }
}
const U = new Me(), J = (n) => U.normalizeNumberLike(n), ge = (n) => U.formatGroupedNumber(n), te = (n, e) => U.readValue(n, e), Pe = (n, e) => U.getScopeColumns(n, e), Be = (n, e, t) => U.readValueByKey(n, e, t);
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
    const s = this.escapeHtml(e), o = t.map((i) => String(i || "").trim()).filter((i) => i.length > 0);
    return o.length ? o.reduce((i, l) => {
      const g = J(l), y = g.length > 0 && g === String(l) ? g.split("").map((c) => this.escapeRegExp(c)).join("[^0-9]*") : this.escapeRegExp(this.escapeHtml(l)), r = new RegExp(y, "gi");
      return i.replace(r, (c) => `<mark>${c}</mark>`);
    }, s) : s;
  }
}
const de = new Ae(), fe = () => de.resolveEnglishLocale(), Oe = (n, e) => de.highlightText(n, e);
class Ne {
  startOfDay(e) {
    const t = new Date(e);
    return t.setHours(0, 0, 0, 0), t;
  }
  parseDateInput(e) {
    const t = String(e ?? "").trim(), s = t.match(/^(\d{2})\.(\d{2})\.(\d{4})$/), o = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!s && !o) return null;
    const i = Number(s ? s[3] : o[1]), l = Number(s ? s[2] : o[2]), g = Number(s ? s[1] : o[3]), d = new Date(i, l - 1, g);
    return d.setHours(0, 0, 0, 0), d.getFullYear() !== i || d.getMonth() !== l - 1 || d.getDate() !== g ? null : d;
  }
  formatDate(e) {
    const t = this.startOfDay(e), s = String(t.getDate()).padStart(2, "0"), o = String(t.getMonth() + 1).padStart(2, "0"), i = t.getFullYear();
    return `${s}.${o}.${i}`;
  }
  getMondayIndexFromDate(e) {
    return (this.startOfDay(e).getDay() + 6) % 7;
  }
  getLocalizedWeekdaysMondayFirst(e = "en-US") {
    const t = new Intl.DateTimeFormat(e, { weekday: "long" }), s = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (o, i) => {
      const l = new Date(s);
      return l.setDate(s.getDate() + i), t.format(l);
    });
  }
  getReferenceWeekdayDate(e, t, s = /* @__PURE__ */ new Date()) {
    const o = this.startOfDay(s), i = this.getMondayIndexFromDate(o), l = new Date(o);
    if (e === "last") {
      const d = (i - t + 7) % 7 || 7;
      return l.setDate(o.getDate() - d), l;
    }
    const g = (t - i + 7) % 7 || 7;
    return l.setDate(o.getDate() + g), l;
  }
  getIsoWeekInfo(e) {
    const t = this.startOfDay(e), s = (t.getDay() + 6) % 7, o = new Date(t);
    o.setDate(t.getDate() - s + 3);
    const i = o.getFullYear(), l = new Date(i, 0, 4), g = (l.getDay() + 6) % 7;
    return l.setDate(l.getDate() - g + 3), { weekNo: 1 + Math.round((o.getTime() - l.getTime()) / 6048e5), weekYear: i };
  }
  getDateMouseoverLabel(e, t = "en-US") {
    const s = this.parseDateInput(e);
    if (!s) return "";
    const o = new Intl.DateTimeFormat(t, {
      weekday: "long"
    }).format(s), { weekNo: i, weekYear: l } = this.getIsoWeekInfo(s);
    return `KW ${String(i).padStart(2, "0")}/${l} - ${o}`;
  }
}
const B = new Ne();
var he = /* @__PURE__ */ ((n) => (n.Before = "before", n.After = "after", n.On = "on", n))(he || {});
const pe = (n) => n === "before", ye = (n) => n === "after", me = (n) => n === "on", qe = (n) => pe(n) || ye(n) || me(n), re = pe, ne = ye, We = me, Pt = qe;
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
class Ke {
  filterItems(e, t, s) {
    const o = L.from(s), { fullTextTokens: i, exactTokens: l, scopedColumnKeys: g } = o.toParsedState(), d = Pe(t, g);
    return e.filter((y) => {
      for (const r of l) {
        const c = o.resolveTermKey(r), a = t.columns.find((m) => m.key === c), f = a ? te(y, a) : "";
        if (o.isDateToken(r)) {
          const m = B.parseDateInput(f), u = B.parseDateInput(r.rawTitle || r.title);
          if (!m || !u) return !1;
          const D = m.getTime(), b = u.getTime();
          if (L.isBeforeDirection(r) && !(D < b) || L.isAfterDirection(r) && !(D > b) || L.isOnDirection(r) && D !== b)
            return !1;
          continue;
        }
        if (a?.valueType === "number-like") {
          if (J(f) !== J(r.title))
            return !1;
          continue;
        }
        if (String(f).toLowerCase() !== String(r.title || "").toLowerCase())
          return !1;
      }
      for (const r of i) {
        const c = String(r.title || "").toLowerCase();
        if (!c) continue;
        if (!d.some(
          (f) => String(te(y, f)).toLowerCase().includes(c)
        )) return !1;
      }
      return !0;
    });
  }
}
const He = new Ke(), Se = (n, e, t) => He.filterItems(n, e, t);
class K {
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
      category: K.getDateCategoryFromDirection(e.direction),
      icon: "event_repeat",
      direction: e.direction,
      reference: e.reference
    };
  }
  static createDateOperation(e, t) {
    const s = K.getDateOperationMetadata(e);
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
    const s = t.startsWith("date ") ? t.slice(5).trim() : t, o = s.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i);
    if (o) {
      const d = String(o[1]).toLowerCase(), y = String(o[2] || "").toLowerCase() || null, r = String(o[3] || "").trim().toLowerCase();
      return r ? { direction: d, reference: y, weekdayPart: r, needle: s } : null;
    }
    const i = s.match(/^(last|next)\s+(.+)$/i);
    if (!i)
      return null;
    const l = String(i[1]).toLowerCase(), g = String(i[2] || "").trim().toLowerCase();
    return g ? {
      direction: he.On,
      reference: l,
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
}, Ge = (n) => ({
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
    if (String(s || "").trim().length < this.config.minQueryLength || t.some((r) => L.isRelativeDateToken(r)))
      return [];
    const o = Ve.parse(s);
    if (!o)
      return [];
    const i = e.locale ?? fe(), l = B.getLocalizedWeekdaysMondayFirst(i).map((r, c) => ({
      weekday: r,
      weekdayIndexMonday: c,
      weekdayLower: r.toLowerCase()
    })).filter((r) => r.weekdayLower.startsWith(o.weekdayPart)), g = o.reference ? [o.reference] : ["last", "next"], d = [], y = /* @__PURE__ */ new Set();
    return l.forEach((r) => {
      g.forEach((c) => {
        const a = B.getReferenceWeekdayDate(c, r.weekdayIndexMonday), f = B.formatDate(a), u = `${this.buildRelativeTitlePrefix(o.direction, c)} ${r.weekday}`;
        y.has(u) || (y.add(u), d.push(
          K.createDateRelative({
            direction: o.direction,
            reference: c,
            weekdayIndexMonday: r.weekdayIndexMonday,
            dateText: f,
            title: u
          })
        ));
      });
    }), d.sort((r, c) => this.getPriority(c.title, o.needle) - this.getPriority(r.title, o.needle)).slice(0, e.maxWeekdaySuggestions ?? this.config.defaultMaxWeekdaySuggestions);
  }
}
class Qe {
  suggest(e, t) {
    const s = B.parseDateInput(t);
    if (!s)
      return [];
    const o = new Set(e.map((g) => g.type)), i = B.formatDate(s);
    return [
      x.dateBefore,
      x.dateAfter,
      x.dateExact
    ].filter((g) => !o.has(g)).map((g) => K.createDateOperation(g, i));
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
    const s = String(e || "").split(/\s+/).filter((i) => i.length > 0);
    let o = -1;
    return s.forEach((i, l) => {
      const g = this.getPositionWeight(i, t);
      if (g < 0)
        return;
      const d = this.config.wordScoreBase - l * this.config.wordIndexWeight + g;
      d > o && (o = d);
    }), o;
  }
  score(e, t, s) {
    if (!s)
      return 1;
    const o = String(e || "").toLowerCase(), i = this.getBestWordMatchScore(o, s);
    if (i < 0)
      return -1;
    const g = String(t || "").toLowerCase().includes(s) ? this.config.scoreCategoryMatch : 0, d = o === s ? this.config.scoreExactMatch : 0, y = Math.min(
      this.config.maxLengthPenalty,
      Math.floor(o.length / this.config.lengthPenaltyDivisor)
    );
    return i + g + d - y;
  }
}
class Je {
  merge(...e) {
    const t = [], s = /* @__PURE__ */ new Set();
    return e.flat().forEach((o) => {
      s.has(o.uid) || (s.add(o.uid), t.push(o));
    }), t;
  }
}
const xe = (n) => {
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
const Xe = 1, ae = 3, Ze = (n, e) => `${n}|${e}`, le = (n) => n.valueType === "number-like", ce = (n) => String(n).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    const o = J(t), l = o.length > 0 && o === String(t) ? o.split("").map((y) => ce(y)).join("[^0-9]*") : ce(String(t)), g = new RegExp(l, "gi"), d = s.match(g);
    return d ? d.length : 0;
  }
  countColumnMatchesForTerms(e, t, s, o) {
    if (!o.length)
      return 0;
    const i = [s];
    return e.reduce((l, g) => {
      const d = o.reduce((y, r) => {
        const c = i.reduce((a, f) => a + this.countTermOccurrencesInValue(Be(g, t, f), r), 0);
        return y + c;
      }, 0);
      return l + d;
    }, 0);
  }
  buildNormalCandidates(e, t, s, o) {
    const i = new Set(
      s.map((u) => u.type).filter((u) => u && L.isExactTokenType(u))
    ), l = [], g = /* @__PURE__ */ new Set(), d = this.dependencies.filterItems(e, t, s);
    t.columns.filter((u) => u.suggestionEnabled !== !1).forEach((u) => {
      i.has(u.key) || new Set(d.map((D) => te(D, u))).forEach((D) => {
        const b = String(D ?? "");
        if (!b) return;
        const A = Ze(u.key, b);
        if (g.has(A)) return;
        g.add(A);
        const S = le(u) ? ge(b) : b, T = le(u) ? b : S, C = this.dependencies.policies.textSuggestionScoringPolicy.score(T, u.label, o);
        C < 0 && o.length > 0 || l.push({
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
    const y = (u, D) => D._score !== u._score ? D._score - u._score : u.title.localeCompare(D.title), r = l.slice().sort(y), c = [], a = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
    r.slice(0, ae).forEach((u) => {
      a.has(u.uid) || (a.add(u.uid), f.add(u._columnType), c.push(u));
    });
    const m = r.slice(ae);
    return m.forEach((u) => {
      a.has(u.uid) || f.has(u._columnType) || (a.add(u.uid), f.add(u._columnType), c.push(u));
    }), m.forEach((u) => {
      a.has(u.uid) || (a.add(u.uid), c.push(u));
    }), c.map((u) => {
      const D = { ...u };
      return delete D._score, delete D._columnType, D;
    });
  }
  buildScopeCandidates(e, t, s, o) {
    const i = s.filter((r) => L.isFulltextToken(r)).map((r) => String(r.title || "").toLowerCase()).filter((r) => r.length > 0), l = s.filter((r) => L.isExactFilterToken(r)), g = this.dependencies.filterItems(e, t, l), d = new Set(
      s.filter((r) => L.isScopeToken(r) && r.key).map((r) => r.key)
    );
    return t.columns.filter((r) => r.searchable !== !1).filter((r) => !d.has(r.key)).map((r) => {
      const c = this.countColumnMatchesForTerms(g, t, r.key, i), a = o.length === 0 ? 1 : this.dependencies.policies.textSuggestionScoringPolicy.score(r.label, "Fulltext scope", o);
      return {
        ...K.createScope({
          key: r.key,
          title: r.label,
          icon: r.icon
        }),
        matchCount: c,
        _score: a
      };
    }).filter((r) => (r.matchCount ?? 0) > 0).filter((r) => o.length === 0 || r._score >= 0).sort((r, c) => {
      const a = r.matchCount ?? 0, f = c.matchCount ?? 0;
      return f !== a ? f - a : c._score !== r._score ? c._score - r._score : r.title.localeCompare(c.title);
    }).map((r) => {
      const c = { ...r };
      return delete c._score, c;
    });
  }
  collectCandidates(e, t) {
    const s = t.map((o) => o(e));
    return this.dependencies.policies.uniqueSuggestionMergeService.merge(...s);
  }
  buildSuggestions(e, t, s, o) {
    const i = String(o || "").trim().toLowerCase(), l = t.maxSuggestions ?? 7, g = {
      items: e,
      modelDefinition: t,
      selected: s,
      rawInput: o,
      needle: i
    }, d = (m) => this.getDateOperationCandidates(m.selected, m.rawInput), y = (m) => this.getRelativeCandidates(m.modelDefinition, m.selected, m.rawInput), r = (m) => this.buildScopeCandidates(
      m.items,
      m.modelDefinition,
      m.selected,
      m.needle
    ), c = (m) => this.buildNormalCandidates(
      m.items,
      m.modelDefinition,
      m.selected,
      m.needle
    ), a = this.collectCandidates(g, [
      d,
      y
    ]);
    return s.some((m) => L.isFulltextToken(m)) ? this.collectCandidates(g, [
      d,
      y,
      r,
      c
    ]).slice(0, l) : a.length > 0 ? a.slice(0, l) : i.length < Xe ? [] : c(g).slice(0, l);
  }
}
const et = (n) => ({
  policies: xe(),
  filterItems: Se
}), tt = (n) => {
  const e = et();
  return new je(e);
}, st = tt(), rt = (n, e, t, s) => st.buildSuggestions(n, e, t, s);
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
  buildSuggestions(e, t, s, o) {
    return this.dependencies.buildSuggestions(e, t, s, o);
  }
}
const ot = {
  resolveEnglishLocale: fe,
  highlightText: Oe,
  filterItems: Se,
  buildSuggestions: rt
}, it = (n = {}) => {
  const e = {
    ...ot,
    ...n
  }, t = new nt(e);
  return {
    resolveEnglishLocale: () => t.resolveEnglishLocale(),
    highlightText: (s, o) => t.highlightText(s, o),
    filterItems: (s, o, i) => t.filterItems(s, o, i),
    buildSuggestions: (s, o, i, l) => t.buildSuggestions(s, o, i, l)
  };
}, Z = it(), at = () => Z.resolveEnglishLocale(), Bt = (n, e) => Z.highlightText(n, e), lt = (n, e, t) => Z.filterItems(n, e, t), ue = (n, e, t, s) => Z.buildSuggestions(n, e, t, s), ct = (n) => {
  const e = G(""), t = G([]), s = G([]), o = G(null), i = P(
    () => ue(n.items, n.modelDefinition, t.value, e.value)
  ), l = P(
    () => t.value.filter((a) => a.type === "fulltext").map((a) => a.title)
  ), g = P(
    () => t.value.filter((a) => a.type === "scope" && a.key).map((a) => a.key)
  ), d = (a) => {
    if (t.value.some((f) => f.uid === a.uid)) {
      e.value = "", s.value = [];
      return;
    }
    t.value = [...t.value, a], e.value = "", s.value = [];
  };
  _e(t, (a) => {
    const f = a.filter(
      (u, D, b) => b.findIndex((A) => A.uid === u.uid) === D
    );
    if (f.length !== a.length) {
      t.value = f;
      return;
    }
    if (!a.some((u) => u.type === "fulltext") && a.some((u) => u.type === "scope")) {
      t.value = a.filter((u) => u.type !== "scope");
      return;
    }
    e.value = "", s.value = [], Ee(() => {
      o.value?.updateInputValue?.("", !0, !0), o.value?.hidePopup?.();
    });
  });
  const y = (a) => {
    const f = String(a || "").trim();
    if (!f) return;
    const m = f.toLowerCase(), u = ue(
      n.items,
      n.modelDefinition,
      t.value,
      f
    ).find((D) => String(D.type).startsWith("date_") ? String(D.title || "").trim().toLowerCase() === m : !1);
    if (u) {
      d(u);
      return;
    }
    d({
      uid: `fulltext|${f}`,
      type: "fulltext",
      title: f,
      category: "Fulltext",
      icon: "search"
    });
  };
  return {
    query: e,
    selected: t,
    filterOptions: s,
    qSelectRef: o,
    fulltextTerms: l,
    scopedKeys: g,
    createValue: (a, f) => {
      y(a), f(null);
    },
    filterFn: (a, f) => {
      f(() => {
        e.value = a, s.value = i.value.filter((m) => m.type !== "fulltext");
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
    return t.length > 0 && t === e ? t.split("").map((o) => this.escapeRegExp(o)).join("[^0-9]*") : this.escapeRegExp(e);
  }
  mergeRanges(e) {
    if (!e.length)
      return [];
    const t = e.slice().sort((o, i) => o.start - i.start), s = [t[0]];
    return t.slice(1).forEach((o) => {
      const i = s[s.length - 1];
      if (o.start <= i.end) {
        i.end = Math.max(i.end, o.end);
        return;
      }
      s.push({ ...o });
    }), s;
  }
  groupSublineColumnsByParent(e) {
    const t = /* @__PURE__ */ new Map();
    return e.forEach((s) => {
      const o = s.renderAsSublineOf;
      if (!o)
        return;
      const i = t.get(o) ?? [];
      t.set(o, [...i, s]);
    }), t;
  }
  sortRows(e, t, s, o, i) {
    const l = t.find((d) => d.key === s.key), g = e.slice();
    return !l || l.sortable === !1 || g.sort((d, y) => {
      const r = (f) => l.accessor ? String(l.accessor(f) ?? "") : String(f[l.key] ?? ""), c = r(d), a = r(y);
      if (l.key === "date") {
        const f = i(c), m = i(a);
        if (f && m) {
          const u = f.getTime(), D = m.getTime();
          return s.asc ? u - D : D - u;
        }
      }
      return s.asc ? o(c, a) : o(a, c);
    }), g;
  }
  shouldHighlightColumn(e, t, s, o) {
    if (!t.length)
      return !1;
    if (!s.length)
      return !0;
    const i = new Set(s), l = o.filter((y) => i.has(y.key)), g = new Set(l.map((y) => y.scopeGroup).filter(Boolean));
    if (i.has(e))
      return !0;
    const d = o.find((y) => y.key === e);
    return d?.scopeGroup ? g.has(d.scopeGroup) : !1;
  }
  buildHighlightSegments(e, t) {
    const s = String(e ?? ""), o = Array.from(
      new Set(t.map((a) => String(a || "").trim()).filter((a) => a.length > 0))
    );
    if (!o.length)
      return [{ text: s, highlighted: !1 }];
    const i = o.slice().sort((a, f) => f.length - a.length).map((a) => this.buildTermPattern(a)).join("|"), l = new RegExp(i, "gi"), g = [];
    let d = l.exec(s);
    for (; d; ) {
      const a = d[0] ?? "";
      a.length > 0 && g.push({ start: d.index, end: d.index + a.length }), a.length === 0 && (l.lastIndex += 1), d = l.exec(s);
    }
    if (!g.length)
      return [{ text: s, highlighted: !1 }];
    const y = this.mergeRanges(g), r = [];
    let c = 0;
    return y.forEach((a) => {
      a.start > c && r.push({ text: s.slice(c, a.start), highlighted: !1 }), r.push({ text: s.slice(a.start, a.end), highlighted: !0 }), c = a.end;
    }), c < s.length && r.push({ text: s.slice(c), highlighted: !1 }), r;
  }
}
const V = new ut(), gt = (n) => {
  const t = G({ key: n.modelDefinition.columns.find((S) => !S.renderAsSublineOf && S.sortable !== !1)?.key ?? "", asc: !0 }), s = P(() => n.modelDefinition.locale ?? at()), o = P(
    () => new Intl.Collator(s.value, { numeric: !0, sensitivity: "base" })
  ), i = P(
    () => n.modelDefinition.columns.filter((S) => !S.renderAsSublineOf)
  ), l = P(() => V.groupSublineColumnsByParent(n.modelDefinition.columns)), g = P(() => lt(n.items, n.modelDefinition, n.selected.value)), d = P(() => V.sortRows(
    g.value,
    n.modelDefinition.columns,
    t.value,
    (S, T) => o.value.compare(S, T),
    (S) => B.parseDateInput(S)
  )), y = (S) => V.shouldHighlightColumn(
    S,
    n.fulltextTerms.value,
    n.scopedKeys.value,
    n.modelDefinition.columns
  ), r = (S) => n.modelDefinition.columns.find((T) => T.key === S), c = (S) => l.value.get(S) ?? [], a = (S, T) => {
    const C = r(T), Q = (H) => C?.valueType === "number-like" ? ge(H) : String(H ?? "");
    return C?.accessor ? Q(C.accessor(S)) : Q(S[T]);
  };
  return {
    visibleColumns: i,
    sortedRows: d,
    getColumnByKey: r,
    getSublineColumns: c,
    getTooltip: (S, T) => {
      const C = r(T);
      return C?.tooltipHint ? typeof C.tooltipHint == "function" ? C.tooltipHint(S) : C.tooltipHint : "";
    },
    toggleSort: (S) => {
      if (r(S)?.sortable !== !1) {
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
      return y(T) ? V.buildHighlightSegments(C, n.fulltextTerms.value) : [{ text: C, highlighted: !1 }];
    },
    suggestionTitleSegments: (S) => V.buildHighlightSegments(S, [n.query.value]),
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
}, ft = (n, e) => {
  const t = (r) => {
    const c = r.key ?? r.type, a = e(c);
    if (a) return a;
    if (r.type === "scope" && r.title)
      return n.columns.find((f) => f.label === r.title);
  }, s = (r) => !!t(r)?.renderAsSublineOf, o = (r) => {
    if (r.type === "scope" && s(r))
      return "In SubColumn";
    const c = n.tokenTypeLabelByType?.[r.type] ?? dt[r.type];
    if (c) return c;
    const a = r.key ?? r.type;
    return e(a)?.label ?? r.category ?? r.type;
  }, i = (r) => {
    if (ee[r.type]) return ee[r.type];
    const c = r.key ?? r.type;
    if (e(c)?.renderAsSublineOf)
      return ee.subcolumn;
  }, l = (r, c, a) => c?.[r.type] ?? i(r) ?? a ?? n.tokenDefaultColor ?? "indigo-9", g = (r) => l(r, n.tokenColorByType);
  return {
    chipTypeLabel: o,
    chipColor: g,
    optionBadgeColor: (r) => l(r, n.optionBadgeColorByType, g(r)),
    suggestionCategoryLabel: (r) => {
      const c = n.suggestionCategoryLabelByType?.[r.type];
      if (c) return c;
      if (s(r)) {
        const a = t(r);
        return `${(a?.renderAsSublineOf ? e(a.renderAsSublineOf)?.label : void 0) ?? a?.label ?? r.category ?? r.type}-SubColumn`;
      }
      return r.category ?? r.type;
    }
  };
}, ht = (n) => {
  const e = ct({
    items: n.items,
    modelDefinition: n.modelDefinition
  }), t = gt({
    items: n.items,
    modelDefinition: n.modelDefinition,
    selected: e.selected,
    fulltextTerms: e.fulltextTerms,
    scopedKeys: e.scopedKeys,
    query: e.query
  }), s = ft(n.modelDefinition, t.getColumnByKey);
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
}, pt = { class: "table-suggest" }, yt = { class: "search-wrap" }, mt = { key: 0 }, St = { key: 1 }, xt = { class: "data-table" }, vt = ["onClick"], Dt = { class: "sort-icon-slot" }, wt = { key: 0 }, kt = ["title"], bt = { key: 0 }, Tt = ["title"], Ct = { key: 0 }, _t = ["title"], Et = { key: 0 }, Lt = /* @__PURE__ */ Le({
  __name: "TableSuggest",
  props: {
    items: {},
    modelDefinition: {}
  },
  setup(n) {
    const e = n, {
      selected: t,
      filterOptions: s,
      qSelectRef: o,
      visibleColumns: i,
      sortedRows: l,
      getSublineColumns: g,
      createValue: d,
      filterFn: y,
      chipColor: r,
      chipTypeLabel: c,
      optionBadgeColor: a,
      suggestionCategoryLabel: f,
      suggestionTitleSegments: m,
      toggleSort: u,
      sortIcon: D,
      cellSegments: b,
      dateHint: A,
      getTooltip: S
    } = ht(e);
    return (T, C) => {
      const Q = O("q-avatar"), oe = O("q-chip"), H = O("q-item-label"), j = O("q-icon"), ke = O("q-item-section"), be = O("q-item"), Te = O("q-select");
      return p(), v("div", pt, [
        I("div", yt, [
          q(Te, {
            ref_key: "qSelectRef",
            ref: o,
            modelValue: w(t),
            "onUpdate:modelValue": C[0] || (C[0] = (h) => $e(t) ? t.value = h : null),
            class: "search-field",
            "input-class": "search-input",
            label: "Search",
            "use-input": "",
            "use-chips": "",
            multiple: "",
            "input-debounce": "0",
            "option-label": "title",
            "option-value": "uid",
            options: w(s),
            onNewValue: w(d),
            onFilter: w(y)
          }, {
            "selected-item": N((h) => [
              q(oe, {
                removable: "",
                dense: "",
                class: "chip",
                color: w(r)(h.opt),
                "text-color": "white",
                onRemove: (R) => h.removeAtIndex(h.index)
              }, {
                default: N(() => [
                  h.opt.icon ? (p(), Y(Q, {
                    key: 0,
                    color: "white",
                    "text-color": w(r)(h.opt),
                    icon: h.opt.icon
                  }, null, 8, ["text-color", "icon"])) : z("", !0),
                  I("span", null, E(w(c)(h.opt)) + ":", 1),
                  I("span", null, E(h.opt.title), 1)
                ]),
                _: 2
              }, 1032, ["color", "onRemove"])
            ]),
            option: N((h) => [
              h.opt.type !== "fulltext" ? (p(), Y(be, Re({ key: 0 }, h.itemProps, { class: "suggest-item" }), {
                default: N(() => [
                  q(ke, null, {
                    default: N(() => [
                      q(H, { class: "suggest-title" }, {
                        default: N(() => [
                          (p(!0), v(k, null, F(w(m)(h.opt.title), (R, $) => (p(), v(k, {
                            key: `${h.opt.uid}-title-${$}`
                          }, [
                            R.highlighted ? (p(), v("mark", mt, E(R.text), 1)) : (p(), v(k, { key: 1 }, [
                              W(E(R.text), 1)
                            ], 64))
                          ], 64))), 128))
                        ]),
                        _: 2
                      }, 1024),
                      q(H, {
                        caption: "",
                        class: "suggest-meta"
                      }, {
                        default: N(() => [
                          h.opt.icon ? (p(), Y(j, {
                            key: 0,
                            name: h.opt.icon,
                            color: w(a)(h.opt),
                            size: "14px",
                            class: "suggest-icon"
                          }, null, 8, ["name", "color"])) : z("", !0),
                          W(" " + E(w(f)(h.opt)), 1),
                          (h.opt.matchCount ?? 0) > 0 ? (p(), v("span", St, " - " + E(h.opt.matchCount) + " x", 1)) : z("", !0)
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
            (p(!0), v(k, null, F(w(i), (h) => (p(), v("col", {
              key: `col-${h.key}`,
              style: Ie(h.key === "id" ? { width: "9ch" } : void 0)
            }, null, 4))), 128))
          ]),
          I("thead", null, [
            I("tr", null, [
              (p(!0), v(k, null, F(w(i), (h) => (p(), v("th", {
                key: h.key,
                onClick: (R) => w(u)(h.key)
              }, [
                h.icon ? (p(), Y(j, {
                  key: 0,
                  name: h.icon,
                  size: "16px",
                  class: "header-icon"
                }, null, 8, ["name"])) : z("", !0),
                I("span", null, E(h.label), 1),
                I("span", Dt, [
                  q(j, {
                    name: w(D)(h.key) ?? "arrow_upward",
                    size: "14px",
                    class: Fe(["sort-icon", { "sort-icon--hidden": !w(D)(h.key) }])
                  }, null, 8, ["name", "class"])
                ])
              ], 8, vt))), 128))
            ])
          ]),
          I("tbody", null, [
            (p(!0), v(k, null, F(w(l), (h, R) => (p(), v("tr", { key: R }, [
              (p(!0), v(k, null, F(w(i), ($) => (p(), v("td", {
                key: $.key
              }, [
                w(g)($.key).length > 0 ? (p(), v(k, { key: 0 }, [
                  I("div", null, [
                    (p(!0), v(k, null, F(w(b)(h, $.key), (_, M) => (p(), v(k, {
                      key: `${$.key}-${R}-${M}`
                    }, [
                      _.highlighted ? (p(), v("mark", wt, E(_.text), 1)) : (p(), v(k, { key: 1 }, [
                        W(E(_.text), 1)
                      ], 64))
                    ], 64))), 128))
                  ]),
                  (p(!0), v(k, null, F(w(g)($.key), (_) => (p(), v("span", {
                    key: `${$.key}-${_.key}-${R}`,
                    class: "subline-value",
                    title: w(S)(h, _.key)
                  }, [
                    I("span", null, [
                      (p(!0), v(k, null, F(w(b)(h, _.key), (M, Ce) => (p(), v(k, {
                        key: `${_.key}-${R}-${Ce}`
                      }, [
                        M.highlighted ? (p(), v("mark", bt, E(M.text), 1)) : (p(), v(k, { key: 1 }, [
                          W(E(M.text), 1)
                        ], 64))
                      ], 64))), 128))
                    ])
                  ], 8, kt))), 128))
                ], 64)) : $.key === "date" ? (p(), v("span", {
                  key: 1,
                  title: w(A)(h)
                }, [
                  (p(!0), v(k, null, F(w(b)(h, $.key), (_, M) => (p(), v(k, {
                    key: `date-${R}-${M}`
                  }, [
                    _.highlighted ? (p(), v("mark", Ct, E(_.text), 1)) : (p(), v(k, { key: 1 }, [
                      W(E(_.text), 1)
                    ], 64))
                  ], 64))), 128))
                ], 8, Tt)) : (p(), v("span", {
                  key: 2,
                  title: w(S)(h, $.key)
                }, [
                  (p(!0), v(k, null, F(w(b)(h, $.key), (_, M) => (p(), v(k, {
                    key: `${$.key}-${R}-${M}`
                  }, [
                    _.highlighted ? (p(), v("mark", Et, E(_.text), 1)) : (p(), v(k, { key: 1 }, [
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
  install(n) {
    n.component("TableSuggest", Lt);
  }
}, $t = (n, e) => {
  if (!e.modelName || !String(e.modelName).trim())
    throw new Error(`Invalid model definition for ${n.name}: modelName is required`);
  if (!Array.isArray(e.columns) || e.columns.length === 0)
    throw new Error(`Invalid model definition for ${n.name}: at least one column is required`);
  const t = /* @__PURE__ */ new Set();
  e.columns.forEach((s) => {
    if (!s.key || !String(s.key).trim())
      throw new Error(`Invalid model definition for ${n.name}: column key is required`);
    if (t.has(s.key))
      throw new Error(`Invalid model definition for ${n.name}: duplicate column key "${s.key}"`);
    if (t.add(s.key), s.renderAsSublineOf && !e.columns.some((o) => o.key === s.renderAsSublineOf))
      throw new Error(
        `Invalid model definition for ${n.name}: renderAsSublineOf references unknown key "${s.renderAsSublineOf}"`
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
const ve = new Rt(), It = (n, e) => {
  ve.define(n, e);
}, Ot = (n, e) => {
  It(n, e);
}, Nt = () => (n) => n, qt = (n) => ve.get(n);
var se = /* @__PURE__ */ ((n) => (n.Last = "last", n.Next = "next", n))(se || {});
const De = (n) => n === "last", we = (n) => n === "next", Ft = (n) => De(n) || we(n);
class Wt {
  static last = se.Last;
  static next = se.Next;
  static isLast(e) {
    return De(e);
  }
  static isNext(e) {
    return we(e);
  }
  static isValid(e) {
    return Ft(e);
  }
}
export {
  Wt as DateReferenceValueObject,
  he as DateRelation,
  L as SearchSelection,
  K as SearchTokenFactory,
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
  Pt as isSearchDirection,
  ne as isSearchDirectionAfter,
  re as isSearchDirectionBefore,
  We as isSearchDirectionOn,
  At as plugin,
  at as resolveEnglishLocale,
  Z as searchEngine
};
