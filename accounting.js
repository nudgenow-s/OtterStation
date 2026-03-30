const AccountingEngine = {
    // 1. 核心核算：只算营收与固定成本的差值
    calculateProfit(revenue) {
        const dailyBaseCost = parseFloat(localStorage.getItem('dailyCost')) || 0;
        const netProfit = (parseFloat(revenue) - dailyBaseCost).toFixed(2);
        
        return {
            netProfit: netProfit,
            dailyCost: dailyBaseCost
        };
    },

    // 2. 存档逻辑：固化历史成本，防止未来 CSV 报表随参数变动
    saveDailySnapshot(totalRev) {
        const dailyCost = parseFloat(localStorage.getItem('dailyCost')) || 0;
        const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
        const today = new Date().toLocaleDateString(); // 3/30/2026
      
        history[today] = {
            revenue: parseFloat(totalRev).toFixed(2),
            dailyCost: dailyCost.toFixed(2), // 固化这一天的成本
            profit: (parseFloat(totalRev) - dailyCost).toFixed(2),
            achievement: dailyCost > 0 ? Math.floor((totalRev / dailyCost) * 100) : 100
        };
            
        localStorage.setItem('revenue_history', JSON.stringify(history));
    },

    // 3. 趋势数据
    getTrendData() {
        const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
        const keys = Object.keys(history).sort((a, b) => new Date(a) - new Date(b));
        const labels = keys.slice(-7);
        const data = labels.map(date => history[date].revenue);
        return { labels, data };
    }
};
