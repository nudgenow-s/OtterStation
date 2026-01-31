/**
 * 模块：水獭主理人财务内核 (Accounting Engine V4.0)
 * 功能：深度整合固定成本、耗材追踪、以及历史数据快照
 */
const AccountingEngine = {
    
    // 1. 同步采购
    syncPurchase(name, unitPrice, qty) {
        let lib = JSON.parse(localStorage.getItem('cost_lib')) || {};
        lib[name] = { 
            unitPrice: parseFloat(unitPrice), 
            stock: parseInt(qty), 
            total: parseInt(qty),
            lastUpdate: new Date().toLocaleDateString()
        };
        localStorage.setItem('cost_lib', JSON.stringify(lib));
    },

    // 2. 核心核算逻辑
    calculateProfit(revenue, itemName = null) {
        let lib = JSON.parse(localStorage.getItem('cost_lib')) || {};
        let materialCost = 0;

        if (itemName && lib[itemName]) {
            materialCost = parseFloat(lib[itemName].unitPrice);
            if (lib[itemName].stock > 0) {
                lib[itemName].stock--;
                localStorage.setItem('cost_lib', JSON.stringify(lib));
            }
        }

        const dailyBaseCost = parseFloat(localStorage.getItem('dailyCost')) || 0;
        const netProfit = (revenue - materialCost).toFixed(2);

        return {
            netProfit: netProfit,
            materialCost: materialCost,
            remainingStock: itemName && lib[itemName] ? lib[itemName].stock : "N/A"
        };
    },

    // 3. 新增：保存每日快照（用于报表）
    saveDailySnapshot(totalRev) {
        const dailyCost = parseFloat(localStorage.getItem('dailyCost')) || 1;
        const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
        const today = new Date().toLocaleDateString();
        
        // 记录当日终盘数据
        history[today] = {
            revenue: totalRev.toFixed(2),
            profit: (totalRev - dailyCost).toFixed(2),
            achievement: Math.floor((totalRev / dailyCost) * 100)
        };
        
        localStorage.setItem('revenue_history', JSON.stringify(history));
    },

    // 4. 新增：获取最近 7 天趋势数据
    getTrendData() {
        const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
        const labels = Object.keys(history).slice(-7);
        const data = labels.map(date => history[date].revenue);
        return { labels, data };
    }
};
