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
    const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
    const today = new Date().toLocaleDateString();

    // 在存入瞬间，抓取当时的配置
    const r = parseFloat(localStorage.getItem('monthlyRent')) || 0;
    const s = parseFloat(localStorage.getItem('monthlySalary')) || 0;
    const o = parseFloat(localStorage.getItem('monthlyOther')) || 0;
    const dCost = (r + s + o) / 30;

    history[today] = {
        revenue: parseFloat(totalRev).toFixed(2),
        profit: (totalRev - dCost).toFixed(2),
        achievement: dCost > 0 ? Math.floor((totalRev / dCost) * 100) : 100,
        // 核心：存入成本快照，从此这天的数据不再受未来修改的影响
        fixedCosts: {
            rent: (r / 30).toFixed(2),
            salary: (s / 30).toFixed(2),
            other: (o / 30).toFixed(2)
        }
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
