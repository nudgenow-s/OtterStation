/**
 * 模块：水獭主理人财务内核 (Accounting Engine V4.1)
 * 修复：变量定义冲突、跨天逻辑兜底
 */
const AccountingEngine = {
    
    // 1. 同步采购 (耗材库管理)
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

    // 2. 核心核算逻辑 (单次成交损耗)
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

        const dailyCost = parseFloat(localStorage.getItem('dailyCost')) || 0;
        // 注意：此处的 netProfit 仅针对单笔成交，报表统计以 saveDailySnapshot 为准
        const netProfit = (revenue - materialCost).toFixed(2);

        return {
            netProfit: netProfit,
            materialCost: materialCost,
            remainingStock: itemName && lib[itemName] ? lib[itemName].stock : "N/A"
        };
    },

    // 3. 核心修复：保存每日快照（逻辑防呆版）
    saveDailySnapshot(totalRev, totalExp = 0) {
        // --- 变量统一化 ---
        const dailyFixedCost = parseFloat(localStorage.getItem('dailyCost')) || 0;
        const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
        const today = new Date().toLocaleDateString();
        
        // 优先使用传入的 totalExp，否则从本地存储读取
        const currentExp = totalExp || parseFloat(localStorage.getItem('todayExp')) || 0;
        
        // --- 财务逻辑计算 ---
        const grossProfit = totalRev - currentExp; // 毛利 = 总营收 - 今日采购支出
        const netProfit = grossProfit - dailyFixedCost; // 净利 = 毛利 - 每日固定成本(房租人工)

        // 【逻辑闭环】检查是否跨天 (用于调试记录)
        const lastSnapshotDate = localStorage.getItem('last_snapshot_date');
        if (lastSnapshotDate && lastSnapshotDate !== today) {
            console.log("检测到日期更替，正在初始化新一日快照...");
        }

        // 记录当日终盘数据
        history[today] = {
            revenue: parseFloat(totalRev).toFixed(2),
            expense: parseFloat(currentExp).toFixed(2), 
            profit: parseFloat(netProfit).toFixed(2),    
            achievement: dailyFixedCost > 0 ? Math.floor((totalRev / dailyFixedCost) * 100) : 0
        };
        
        localStorage.setItem('revenue_history', JSON.stringify(history));
        localStorage.setItem('last_snapshot_date', today);
    },

    // 4. 获取最近 7 天趋势数据
    getTrendData() {
        const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
        const sortedDates = Object.keys(history).sort((a, b) => new Date(a) - new Date(b));
        const labels = sortedDates.slice(-7);
        const data = labels.map(date => history[date].revenue);
        return { labels, data };
    }
};
