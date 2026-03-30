const AccountingEngine = {
    // 核心核算：只算营收与固定成本的差值
    calculateProfit(revenue) {
        const dailyBaseCost = parseFloat(localStorage.getItem('dailyCost')) || 0;
        return {
            netProfit: (parseFloat(revenue) - dailyBaseCost).toFixed(2),
            dailyCost: dailyBaseCost
        };
    },

    // 核心：保存每日快照（固化当日成本分项）
    saveDailySnapshot(totalRev) {
        const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
        const today = new Date().toLocaleDateString(); // 3/30/2026

        // 实时抓取保存时的分项参数
        const r = parseFloat(localStorage.getItem('monthlyRent')) || 0;
        const s = parseFloat(localStorage.getItem('monthlySalary')) || 0;
        const o = parseFloat(localStorage.getItem('monthlyOther')) || 0;
        const dCost = parseFloat(localStorage.getItem('dailyCost')) || 0;

        history[today] = {
            revenue: parseFloat(totalRev).toFixed(2),
            profit: (totalRev - dCost).toFixed(2),
            achievement: dCost > 0 ? Math.floor((totalRev / dCost) * 100) : 100,
            // 固化成本基因：CSV 导出的事实来源
            costSnapshot: {
                rent: (r / 30).toFixed(2),
                salary: (s / 30).toFixed(2),
                other: (o / 30).toFixed(2)
            }
        };
            
        localStorage.setItem('revenue_history', JSON.stringify(history));
    },

    getTrendData() {
        const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
        const sortedKeys = Object.keys(history).sort((a, b) => new Date(a) - new Date(b));
        const labels = sortedKeys.slice(-7);
        const data = labels.map(date => history[date].revenue);
        return { labels, data };
    }
};
