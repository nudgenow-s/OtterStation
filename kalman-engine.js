// =====================================================
// KalmanVariableCostEngine — 卡尔曼变动成本引擎
// 水獭能量站 · 成本释放模块
// =====================================================
const KalmanVariableCostEngine = {

```
// 读取当前卡尔曼状态
getState: function () {
    const raw = localStorage.getItem('kalman_state');
    if (raw) { try { return JSON.parse(raw); } catch (e) {} }
    // 初始状态：每日变动成本估计为0，不确定性极高
    return { x: 0, p: 999, lastUpdated: null };
},

saveState: function (state) {
    state.lastUpdated = new Date().toLocaleDateString();
    localStorage.setItem('kalman_state', JSON.stringify(state));
},

// 记录进货 → 卡尔曼更新
// amount: 进货总金额, refDays: 参考消耗天数
recordPurchase: function (amount, refDays) {
    const state = this.getState();

    // 观测值：本次进货折算的每日成本
    const z = amount / refDays;

    // 过程噪声Q：允许真实每日成本随时间漂移
    const Q = 5;
    // 观测噪声R：老板对天数估计的不确定性
    const R = Math.pow(refDays * 0.3, 2) + 10;

    // 预测步骤
    const p_pred = state.p + Q;

    // 更新步骤（卡尔曼增益 + 状态融合）
    const K = p_pred / (p_pred + R);
    const x_new = state.x + K * (z - state.x);
    const p_new = (1 - K) * p_pred;

    this.saveState({ x: x_new, p: p_new });
    this._logPurchase(amount, refDays, z, x_new, K);

    return { dailyCost: x_new, gain: K, observation: z };
},

// 每日销售信号修正：卖得好消耗快，卖得差消耗慢
// 在 record() 录入营业额时调用
updateWithSales: function (todayRevenue) {
    const state = this.getState();
    const today = new Date().toLocaleDateString();

    // 每天只修正一次
    if (localStorage.getItem('kalman_sales_updated') === today) return state.x;

    const avgRevenue = this._getAvgRevenue7d();

    // 消耗速率 alpha：今日销售 / 7日均值，范围 [0.2, 2.0]
    let alpha = 1.0;
    if (avgRevenue > 0 && todayRevenue > 0) {
        alpha = Math.min(todayRevenue / avgRevenue, 2.0);
        alpha = Math.max(alpha, 0.2);
    }

    // 状态衰减：库存每天被消耗
    const Q = 2;
    const x_decayed = Math.max(state.x - (state.x / 30) * alpha, 0);
    const p_decayed = state.p + Q;

    this.saveState({ x: x_decayed, p: p_decayed });
    localStorage.setItem('kalman_sales_updated', today);

    return x_decayed;
},

// 获取当前每日变动成本估计值
getCurrentDailyVariableCost: function () {
    return Math.max(this.getState().x, 0);
},

// 总每日成本线 = 固定成本 + 变动成本
getTotalDailyCost: function () {
    const fixed = parseFloat(localStorage.getItem('dailyCost')) || 0;
    const variable = this.getCurrentDailyVariableCost();
    return fixed + variable;
},

// 近7日平均营收（用于消耗速率参考）
_getAvgRevenue7d: function () {
    const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
    const dates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a)).slice(0, 7);
    if (dates.length === 0) return 0;
    const sum = dates.reduce((acc, d) => acc + (parseFloat(history[d].revenue) || 0), 0);
    return sum / dates.length;
},

// 写入进货日志（最多保留30条）
_logPurchase: function (amount, refDays, observation, newEstimate, gain) {
    const logs = JSON.parse(localStorage.getItem('procurement_log')) || [];
    logs.unshift({
        date: new Date().toLocaleDateString(),
        amount: amount,
        refDays: refDays,
        dailyObs: observation.toFixed(2),
        kalmanEst: newEstimate.toFixed(2),
        gain: gain.toFixed(3)
    });
    localStorage.setItem('procurement_log', JSON.stringify(logs.slice(0, 30)));
},

// 获取进货日志
getLogs: function () {
    return JSON.parse(localStorage.getItem('procurement_log')) || [];
}
```

};
