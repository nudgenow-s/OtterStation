/**
 * Prestige Station — 云同步模块 v1.0
 * 依赖：config.js (IndustryAdapter), accounting.js (数据结构)
 *
 * 数据结构参考 accounting.js:
 *   revenue_history[date] = { revenue, profit, achievement, costSnapshot }
 *   dailyCost, monthlyRent, monthlySalary, monthlyOther, startupCost
 */

const CloudSync = (() => {
    const API = 'https://osapi.nudgenow.xyz';

    // ── 工具 ─────────────────────────────────────────────

    function getUserId()   { return localStorage.getItem('ps_user_id'); }
    function getPassword() { return localStorage.getItem('ps_password'); }

    // 提取完整 localStorage 快照（排除临时 key）
    function getSnapshot() {
        const snap = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k.startsWith('_tmp_')) snap[k] = localStorage.getItem(k);
        }
        return snap;
    }

    // 从 revenue_history 提取盈利数据（基于 accounting.js 的数据结构）
    function getProfitData() {
        const cfg     = IndustryAdapter.getCurrent();
        const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
        const now     = new Date();
        const todayStr = now.toLocaleDateString();

        // 今日达成率
        const todayRev  = parseFloat(localStorage.getItem('todayRev'))  || 0;
        const dailyCost = parseFloat(localStorage.getItem('dailyCost')) || 1;
        const achievement = Math.floor((todayRev / dailyCost) * 100);

        // 今日利润
        const dailyProfit = todayRev - dailyCost;

        // 本月累计利润（遍历 revenue_history）
        let monthlyProfit = 0;
        Object.keys(history).forEach(dateStr => {
            const d = new Date(dateStr);
            if (d.getMonth()    === now.getMonth() &&
                d.getFullYear() === now.getFullYear()) {
                monthlyProfit += parseFloat(history[dateStr].profit) || 0;
            }
        });

        // 行业映射
        const indMap = { '美业': 'nail', '餐饮': 'food', '零售': 'retail' };

        return {
            industryType:   indMap[cfg.name] || 'nail',
            achievementPct: achievement,
            dailyProfit:    parseFloat(dailyProfit.toFixed(2)),
            monthlyProfit:  parseFloat(monthlyProfit.toFixed(2))
        };
    }

    // 获取行为数据（停留时长从 sessionStorage 读取）
    function getAnalytics() {
        return {
            openCount:      1,
            mainDuration:   parseInt(sessionStorage.getItem('_dur_main'))   || 0,
            reportDuration: parseInt(sessionStorage.getItem('_dur_report')) || 0,
            setupDuration:  parseInt(sessionStorage.getItem('_dur_setup'))  || 0,
        };
    }

    // ── 注册（激活成功后调用）────────────────────────────
    async function register(licenseKey, deviceId, password) {
        try {
            const res  = await fetch(`${API}/register`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ licenseKey, deviceId, password })
            });
            const data = await res.json();
            if (data.status === 'success' || data.status === 'exists') {
                localStorage.setItem('ps_user_id',  data.userId);
                localStorage.setItem('ps_password', password);
                return { ok: true, userId: data.userId, isNew: data.status === 'success' };
            }
            return { ok: false, error: data.error };
        } catch (e) {
            return { ok: false, error: 'Network error' };
        }
    }

    // ── 静默同步（页面加载后自动触发）───────────────────
    async function silentSync() {
        const userId   = getUserId();
        const password = getPassword();
        if (!userId || !password) return;

        try {
            await fetch(`${API}/sync`, {
                method:    'POST',
                headers:   { 'Content-Type': 'application/json' },
                keepalive: true,   // 页面卸载时请求不被中断
                body:      JSON.stringify({
                    userId,
                    password,
                    snapshot:  getSnapshot(),
                    analytics: getAnalytics(),
                    profit:    getProfitData()
                })
            });
            localStorage.setItem('_last_sync', Date.now().toString());
        } catch {
            // 离线时静默失败，不打扰用户
        }
    }

    // ── 恢复数据 ─────────────────────────────────────────
    async function restore(userId, password) {
        try {
            const res  = await fetch(`${API}/restore`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ userId, password })
            });
            const data = await res.json();

            if (data.status === 'success') {
                localStorage.clear();
                for (const [k, v] of Object.entries(data.snapshot)) {
                    localStorage.setItem(k, v);
                }
                localStorage.setItem('ps_user_id',  userId);
                localStorage.setItem('ps_password', password);
                return { ok: true, updatedAt: data.updatedAt };
            }
            return { ok: false, error: data.error || data.message };
        } catch {
            return { ok: false, error: 'Network error' };
        }
    }

    // ── 同行百分位查询 ────────────────────────────────────
    // 基于 revenue_history 的 achievement 字段计算当前达成率
    async function fetchBenchmark() {
        try {
            const cfg = IndustryAdapter.getCurrent();
            const indMap = { '美业': 'nail', '餐饮': 'food', '零售': 'retail' };
            const ind = indMap[cfg.name] || 'nail';

            const todayRev  = parseFloat(localStorage.getItem('todayRev'))  || 0;
            const dailyCost = parseFloat(localStorage.getItem('dailyCost')) || 1;
            const ach = Math.floor((todayRev / dailyCost) * 100);

            const res  = await fetch(`${API}/benchmark?industry=${ind}&achievement=${ach}`);
            const data = await res.json();

            return data.status === 'ok' ? data.displayPct : null;
        } catch {
            return null;
        }
    }

    // ── 离线估算百分位（正态分布美化）───────────────────
    // 当无法联网时，基于本地达成率估算
    // 算法：以达成率100%为中位，用偏态分布让低达成也显示合理百分位
    function estimateBenchmarkOffline() {
        const todayRev  = parseFloat(localStorage.getItem('todayRev'))  || 0;
        const dailyCost = parseFloat(localStorage.getItem('dailyCost')) || 1;
        const ratio = Math.min(todayRev / dailyCost, 2.5); // 最高 250% 封顶

        // 分段映射：模拟正态分布右侧偏移
        // 0%达成→跑赢约35%；100%达成→跑赢约72%；200%+→跑赢约94%
        let base;
        if (ratio <= 0)       base = 30 + Math.random() * 8;
        else if (ratio < 0.5) base = 35 + ratio * 30 + Math.random() * 6;
        else if (ratio < 1.0) base = 50 + ratio * 20 + Math.random() * 5;
        else if (ratio < 1.5) base = 70 + (ratio - 1) * 20 + Math.random() * 4;
        else                  base = 82 + (ratio - 1.5) * 10 + Math.random() * 3;

        return Math.min(99.99, base).toFixed(2);
    }

    // ── 页面停留计时 ──────────────────────────────────────
    function trackDuration(pageName) {
        const key   = `_dur_${pageName}`;
        const start = Date.now();
        window.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                const elapsed = Math.floor((Date.now() - start) / 1000);
                const prev    = parseInt(sessionStorage.getItem(key)) || 0;
                sessionStorage.setItem(key, prev + elapsed);
            }
        });
        window.addEventListener('beforeunload', () => {
            const elapsed = Math.floor((Date.now() - start) / 1000);
            const prev    = parseInt(sessionStorage.getItem(key)) || 0;
            sessionStorage.setItem(key, prev + elapsed);
        });
    }

    return {
        register,
        silentSync,
        restore,
        fetchBenchmark,
        estimateBenchmarkOffline,
        trackDuration
    };
})();
