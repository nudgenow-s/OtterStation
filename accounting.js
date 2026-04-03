const AccountingEngine = {
// 核心核算：只算营收与固定成本的差值
calculateProfit(revenue) {
const dailyBaseCost = parseFloat(localStorage.getItem(‘dailyCost’)) || 0;
return {
netProfit: (parseFloat(revenue) - dailyBaseCost).toFixed(2),
dailyCost: dailyBaseCost
};
},

saveDailySnapshot(totalRev, date) {
const history = JSON.parse(localStorage.getItem(‘revenue_history’)) || {};
const targetDate = date || new Date().toLocaleDateString(); // ✅ 支持传入指定日期

```
const r = parseFloat(localStorage.getItem('monthlyRent')) || 0;
const s = parseFloat(localStorage.getItem('monthlySalary')) || 0;
const o = parseFloat(localStorage.getItem('monthlyOther')) || 0;
const dCost = parseFloat(localStorage.getItem('dailyCost')) || 0;

// 从卡尔曼引擎读取当日变动成本（若引擎未加载则为0）
const varCost = (typeof KalmanVariableCostEngine !== 'undefined')
    ? KalmanVariableCostEngine.getCurrentDailyVariableCost()
    : 0;

const rev = parseFloat(totalRev);

// 绝对净利 = 营收 - 固定成本 - 变动成本
const trueProfit = rev - dCost - varCost;

// 毛利率 = (营收 - 变动成本) / 营收 × 100%
const grossMargin = rev > 0
    ? (((rev - varCost) / rev) * 100).toFixed(1)
    : '0.0';

// 净利率 = (营收 - 变动成本 - 固定成本) / 营收 × 100%
const netMargin = rev > 0
    ? ((trueProfit / rev) * 100).toFixed(1)
    : '0.0';

// 达成率仍基于总成本线（固定+变动）
const totalCost = dCost + varCost;
const achievement = totalCost > 0 ? Math.floor((rev / totalCost) * 100) : 100;

history[targetDate] = {
    revenue:      rev.toFixed(2),
    profit:       trueProfit.toFixed(2),
    achievement:  achievement,
    variableCost: varCost.toFixed(2),
    grossMargin:  grossMargin,
    netMargin:    netMargin,
    costSnapshot: {
        rent:   (r / 30).toFixed(2),
        salary: (s / 30).toFixed(2),
        other:  (o / 30).toFixed(2)
    }
};
    
localStorage.setItem('revenue_history', JSON.stringify(history));
```

},

```
getTrendData() {
    const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
    const sortedKeys = Object.keys(history).sort((a, b) => new Date(a) - new Date(b));
    const labels = sortedKeys.slice(-7);
    const data = labels.map(date => history[date].revenue);
    return { labels, data };
}
```

};
