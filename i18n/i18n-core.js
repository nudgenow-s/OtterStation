/**
 * i18n-core.js — 通用多语言引擎
 * 依赖：无（不依赖 config.js，可独立工作）
 * 加载顺序要求：
 *   <script src="i18n/zh.js"></script>   <!-- 必须放在最前，作为兜底语言包 -->
 *   <script src="i18n/en.js"></script>
 *   <script src="i18n/ja.js"></script>
 *   ...（每种语言一个文件，各自把自己的字典挂到 window.I18N_PACKS[langCode]）
 *   <script src="i18n/i18n-core.js"></script>  <!-- 必须放在所有语言包之后 -->
 *
 * 语言包文件格式（例如 i18n/en.js）：
 *   window.I18N_PACKS = window.I18N_PACKS || {};
 *   window.I18N_PACKS.en = {
 *     "cashier.title": "Cashier",
 *     "cashier.itemCount": "{n} items",
 *     ...
 *   };
 *
 * key 命名建议：`模块.用途`，例如 cashier.title / inventory.empty / ar.batchSettleConfirm
 * 找不到 key 时的兜底顺序：当前语言 → zh（默认语言）→ 直接显示 key 本身（方便发现遗漏)
 */
const I18N = (function () {
  const DEFAULT_LANG = 'zh';
  const STORAGE_KEY = 'lang';

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!window.I18N_PACKS || !window.I18N_PACKS[lang]) {
      console.warn('[i18n] 语言包未加载：' + lang + '，请确认已引入对应的 i18n/' + lang + '.js');
      return false;
    }
    localStorage.setItem(STORAGE_KEY, lang);
    return true;
  }

  function getAvailableLangs() {
    return Object.keys(window.I18N_PACKS || {});
  }

  // 简单插值：t('cashier.itemCount', {n: 3}) -> 字典里写 "{n} 件商品"
  function _interpolate(str, params) {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, function (match, key) {
      return (params[key] !== undefined) ? params[key] : match;
    });
  }

  /**
   * t(key, params) — 取翻译文本
   * 找不到时：当前语言缺失 → 退回 zh 包 → 都没有则原样返回 key（不静默吞掉，方便发现漏翻）
   */
  function t(key, params) {
    const packs = window.I18N_PACKS || {};
    const lang = getLang();
    let str = packs[lang] && packs[lang][key];
    if (str === undefined && lang !== DEFAULT_LANG) {
      str = packs[DEFAULT_LANG] && packs[DEFAULT_LANG][key];
    }
    if (str === undefined) {
      // 开发期可见的缺失提示；生产可按需静默为 key
      if (window.I18N_DEBUG) console.warn('[i18n] 缺失 key：' + key);
      str = key;
    }
    return _interpolate(str, params);
  }

  // ── 静态 DOM 绑定 ──────────────────────────────────────────
  // data-i18n="key"              -> 替换 textContent
  // data-i18n-html="key"         -> 替换 innerHTML（用于含 <b> 等标签的文案，谨慎使用）
  // data-i18n-placeholder="key"  -> 替换 input/textarea 的 placeholder
  // data-i18n-title="key"        -> 替换 title 属性（tooltip）
  // data-i18n-params='{"n":3}'   -> 配合上面任一属性，提供插值参数（较少用，动态值建议直接用 t()）
  function applyDOM(root) {
    root = root || document;

    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const params = _readParams(el);
      el.textContent = t(key, params);
    });
    root.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-html');
      const params = _readParams(el);
      el.innerHTML = t(key, params);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      const params = _readParams(el);
      el.placeholder = t(key, params);
    });
    root.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-title');
      const params = _readParams(el);
      el.title = t(key, params);
    });
  }

  function _readParams(el) {
    const raw = el.getAttribute('data-i18n-params');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  // ── 语言切换后，自动重跑静态绑定 + 广播事件 ──────────────
  // 动态拼接的 innerHTML（收银台/库存表格等）不归 applyDOM 管，
  // 页面需自行监听 'i18n:change' 事件，重新调用自己的 render 函数。
  function switchLang(lang) {
    if (!setLang(lang)) return false;
    applyDOM(document);
    document.documentElement.setAttribute('lang', _htmlLangTag(lang));
    window.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
    return true;
  }

  function _htmlLangTag(lang) {
    // 常见语言码映射到标准 html lang 属性，找不到就原样返回
    const map = {
      zh: 'zh-CN', en: 'en', ja: 'ja', ko: 'ko',
      fr: 'fr', de: 'de', es: 'es', pt: 'pt',
      ru: 'ru', ar: 'ar', th: 'th', vi: 'vi',
    };
    return map[lang] || lang;
  }

  function init() {
    document.documentElement.setAttribute('lang', _htmlLangTag(getLang()));
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { applyDOM(document); });
    } else {
      applyDOM(document);
    }
  }

  // 月份名辅助：tMonth(0) -> "1月" / "Jan"（0-indexed，与 JS Date.getMonth() 对齐）
  function tMonth(index) {
    const raw = t('common.months');
    const arr = raw.split(',');
    return arr[index] !== undefined ? arr[index] : String(index + 1);
  }

  return { t, tMonth, getLang, setLang, switchLang, applyDOM, getAvailableLangs, init };
})();

window.I18N = I18N;
window.t = I18N.t; // 全局简写，方便在 innerHTML 拼接里直接写 t('xxx')
window.tMonth = I18N.tMonth;

I18N.init();
