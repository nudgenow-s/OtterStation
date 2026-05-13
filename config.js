/**
 * 模块：行业适配器配置中心 (Config V3.0 - Prestige Edition)
 */
const IndustryAdapter = {
    registry: {
        "nail": { 
            name: "美业", 
            theme: "#8B1A2F",
            themeGold: "#C9A84C",
            icon: "💅", 
            unit: "位顾客",
            slogan: "让美力变现 ✨" 
        },
        "food": { 
            name: "餐饮", 
            theme: "#7A3B1E",
            themeGold: "#C9A84C",
            icon: "🌭", 
            unit: "份餐点",
            slogan: "人间烟火气，最抚主理人 🍳"
        },
        "retail": { 
            name: "零售", 
            theme: "#5C3317",
            themeGold: "#C9A84C",
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
            document.documentElement.style.setProperty('--primary', this.registry[type].theme);
            document.documentElement.style.setProperty('--gold', this.registry[type].themeGold);
            document.documentElement.style.setProperty('--primary-pink', this.registry[type].theme);
        }
    }
};

(function initTheme() {
    const config = IndustryAdapter.getCurrent();
    document.documentElement.style.setProperty('--primary', config.theme);
    document.documentElement.style.setProperty('--gold', config.themeGold || '#C9A84C');
    document.documentElement.style.setProperty('--primary-pink', config.theme);
})();
