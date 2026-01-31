/**
 * 模块：多行业配置中心
 */
const IndustryConfig = {
    current: 'nail', // 可切换: 'nail', 'food', 'retail'
    
    settings: {
        nail: {
            name: "美业主理人",
            icon: "💅",
            activeColor: "#ff85a2",
            commonItems: ["卸甲", "单色", "法式", "贴钻"]
        },
        food: {
            name: "摊位主理人",
            icon: "🍳",
            activeColor: "#ffb347",
            commonItems: ["标配版", "豪华版", "加蛋加肠"]
        },
        retail: {
            name: "独立店主",
            icon: "🛍️",
            activeColor: "#4facfe",
            commonItems: ["零售卖出", "打包服务"]
        }
    },
    
    get() { return this.settings[this.current]; }
};
