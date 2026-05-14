/**
 * 行业适配器配置中心 — Warm Cream Luxury Edition
 */
const IndustryAdapter = {
    registry: {
        "nail": {
            name: "美业",
            theme: "#9B2335",
            icon: "💅",
            unit: "位顾客",
            slogan: "让美力变现 ✨"
        },
        "food": {
            name: "餐饮",
            theme: "#7A3B1E",
            icon: "🌭",
            unit: "份餐点",
            slogan: "人间烟火气，最抚主理人 🍳"
        },
        "retail": {
            name: "零售",
            theme: "#6B4226",
            icon: "👗",
            unit: "件衣服",
            slogan: "穿出风格，赚到自由 🛍️"
        }
    },

    getCurrent() {
        const type = localStorage.getItem('industry_type') || 'nail';
        return this.registry[type] || this.registry['nail'];
    },

    setIndustry(type) {
        if (this.registry[type]) {
            localStorage.setItem('industry_type', type);
            document.documentElement.style.setProperty('--crimson', this.registry[type].theme);
            document.documentElement.style.setProperty('--primary', this.registry[type].theme);
            document.documentElement.style.setProperty('--primary-pink', this.registry[type].theme);
        }
    }
};

(function initTheme() {
    const config = IndustryAdapter.getCurrent();
    document.documentElement.style.setProperty('--crimson', config.theme);
    document.documentElement.style.setProperty('--primary', config.theme);
    document.documentElement.style.setProperty('--primary-pink', config.theme);
})();
