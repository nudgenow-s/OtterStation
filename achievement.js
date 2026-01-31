/**
 * 模块：水獭主理人勋章成就系统 (Achievement V4.0)
 * 核心逻辑：基于行业适配器与历史报表数据的深度触发
 */
const AchievementSystem = {
    badges: [
        { 
            id: 'first_blood', 
            name: '首单入账', 
            icon: '💰', 
            desc: '打破鸭蛋，水獭开始为你打工了！', 
            condition: (s) => s.totalSales > 0 
        },
        { 
            id: 'profitable_king', 
            name: '盈利王者', 
            icon: '👑', 
            desc: '连续达标，你是房东的克星！', 
            condition: (s) => s.streak >= 3 
        },
        { 
            id: 'smart_buyer', 
            name: '精明猎手', 
            icon: '🦊', 
            desc: '累计录入多笔数据，每一分钱都算得死死的。', 
            condition: (s) => s.recordCount >= 5 
        },
        { 
            id: 'anti_procrastination', 
            name: '拒绝拖延', 
            icon: '🔥', 
            desc: 'INTJ 的执行力！今日已达成生存基准线。', 
            condition: (s) => s.isDailyGoalMet === true 
        }
    ],

    // 获取统计数据
    getStats() {
        return JSON.parse(localStorage.getItem('user_stats')) || {
            totalSales: 0,
            streak: 0,
            recordCount: 0,
            lastDate: null,
            isDailyGoalMet: false
        };
    },

    // 核心检查入口
    check() {
        let stats = this.getStats();
        const today = new Date().toLocaleDateString();
        const dailyCost = parseFloat(localStorage.getItem('dailyCost')) || 1;
        const todayRev = parseFloat(localStorage.getItem('todayRev')) || 0;

        // 1. 更新今日营收
        stats.totalSales = todayRev;

        // 2. 更新累积记录次数
        stats.recordCount = (stats.recordCount || 0) + 1;

        // 3. 检查今日是否达标（拒绝拖延勋章逻辑）
        if (todayRev >= dailyCost) {
            stats.isDailyGoalMet = true;
        }

        // 4. 跨天逻辑：检查连续达标（连续 3 天营收 > 成本）
        if (stats.lastDate !== today) {
            const history = JSON.parse(localStorage.getItem('revenue_history')) || {};
            const dates = Object.keys(history).slice(-3); // 获取最近三天
            let meetCount = 0;
            dates.forEach(d => {
                if (history[d].achievement >= 100) meetCount++;
            });
            stats.streak = meetCount;
            stats.lastDate = today;
        }

        localStorage.setItem('user_stats', JSON.stringify(stats));

        // 执行勋章检测
        let earned = JSON.parse(localStorage.getItem('earned_badges')) || [];
        this.badges.forEach(badge => {
            if (!earned.includes(badge.id) && badge.condition(stats)) {
                earned.push(badge.id);
                localStorage.setItem('earned_badges', JSON.stringify(earned));
                this.showBadgeModal(badge);
            }
        });
    },

    // 弹出点亮勋章的视觉反馈
    showBadgeModal(badge) {
        // 自动适配当前行业主题色
        const themeColor = localStorage.getItem('industry_type') === 'food' ? '#ffb347' : 
                          (localStorage.getItem('industry_type') === 'retail' ? '#4facfe' : '#ff85a2');

        const modalHtml = `
            <div id="badge-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.98); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: badgePop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div style="font-size:120px; margin-bottom:10px;">${badge.icon}</div>
                <h2 style="color:${themeColor}; font-size:28px; margin:10px 0;">点亮成就：${badge.name}</h2>
                <p style="color:#888; padding:0 40px; text-align:center; line-height:1.6;">${badge.desc}</p>
                <button onclick="document.getElementById('badge-modal').remove()" style="margin-top:40px; background:${themeColor}; color:white; border:none; padding:15px 60px; border-radius:50px; font-weight:bold; cursor:pointer; box-shadow: 0 8px rgba(0,0,0,0.1);">立即执行下一单</button>
            </div>
            <style>
                @keyframes badgePop { from { opacity:0; transform:scale(0.8) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};
