/**
 * 模块：行业适配器配置中心 (Config V3.0)
 * 功能：定义不同行业的视觉规范、计量单位及核心算法差异
 */
const IndustryAdapter = {
    registry: {
        "nail": { 
            name: "美业", 
            theme: "#ff85a2", 
            icon: "💅", 
            unit: "位顾客",
            slogan: "让美力变现 ✨" 
        },
        "food": { 
            name: "餐饮", 
            theme: "#ffb347", 
            icon: "🌭", 
            unit: "份餐点",
            slogan: "人间烟火气，最抚主理人 🍳"
        },
        "retail": { 
            name: "零售", 
            theme: "#4facfe", 
            icon: "👗", 
            unit: "件衣服",
            slogan: "穿出风格，赚到自由 🛍️"
        }
    },

    // 获取当前激活的行业配置
    getCurrent() {
        const type = localStorage.getItem('industry_type') || 'nail';
        return this.registry[type] || this.registry['nail'];
    },

    // 切换行业并更新主题色
    setIndustry(type) {
        if (this.registry[type]) {
            localStorage.setItem('industry_type', type);
            // 立即更新 CSS 变量，实现全应用换肤
            document.documentElement.style.setProperty('--primary-pink', this.registry[type].theme);
        }
    }
};

// 立即执行一次主题初始化，防止页面闪烁
(function initTheme() {
    const config = IndustryAdapter.getCurrent();
    document.documentElement.style.setProperty('--primary-pink', config.theme);
})();
