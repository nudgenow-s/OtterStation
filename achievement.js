const AchievementEngine = {
    badges: [
        { id: 'first_blood', name: '首单入账', icon: '💰', desc: '打破鸭蛋，开工大吉！', condition: (s) => s.totalSales > 0 },
        { id: 'profitable_king', name: '盈利王者', icon: '👑', desc: '连续达标，你是房东克星！', condition: (s) => s.totalSales >= s.dailyCost * 3 },
        { id: 'smart_buyer', name: '精明猎手', icon: '🦊', desc: '精准记账，每一分钱都有据可查。', condition: (s) => s.recordCount >= 5 },
        { id: 'anti_procrastination', name: '黄金选手', icon: '🔥', desc: '超绝主理人！今日目标已达成。', condition: (s) => s.isDailyGoalMet === true }
    ],

    getStats() {
        const defaultStats = { totalSales: 0, streak: 0, recordCount: 0, lastDate: null, isDailyGoalMet: false, dailyCost: 0 };
        try {
            return JSON.parse(localStorage.getItem('user_stats')) || defaultStats;
        } catch (e) {
            return defaultStats;
        }
    },

    check(newAmount) {
        let stats = this.getStats();
        const today = new Date().toLocaleDateString();
        const dailyCost = parseFloat(localStorage.getItem('dailyCost')) || 1;

        // 核心更新：增加累计销售额和记录次数
        stats.totalSales = (parseFloat(stats.totalSales) || 0) + parseFloat(newAmount);
        stats.recordCount = (parseInt(stats.recordCount) || 0) + 1;

        // ✅ 把 dailyCost 写入 stats，供 condition 使用
        stats.dailyCost = dailyCost;

        // [修复1] 日期变更时重置每日状态，并更新 streak
        if (stats.lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toLocaleDateString();

            if (stats.lastDate === yesterdayStr) {
                stats.streak = (parseInt(stats.streak) || 0) + 1;
            } else {
                stats.streak = 1;
            }

            stats.isDailyGoalMet = false;
            stats.lastDate = today;
        }

        // [修复2] 先将本次金额累加到 todayRev，再判定今日目标
        const updatedTodayRev = parseFloat(localStorage.getItem('todayRev')) || 0;

        if (updatedTodayRev >= dailyCost) {
            stats.isDailyGoalMet = true;
        }

        // 保存更新后的统计
        localStorage.setItem('user_stats', JSON.stringify(stats));

        // 检查并点亮勋章
        let earned = [];
        try {
            earned = JSON.parse(localStorage.getItem('earned_badges')) || [];
        } catch(e) { earned = []; }

        let isAnyNewBadge = false;
        this.badges.forEach(badge => {
            if (!earned.includes(badge.id) && badge.condition(stats)) {
                earned.push(badge.id);
                isAnyNewBadge = true;
                this.showBadgeModal(badge);
            }
        });

        if (isAnyNewBadge) {
            localStorage.setItem('earned_badges', JSON.stringify(earned));
        }
    },

    showBadgeModal(badge) {
        const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-pink').trim() || '#ff85a2';
        
        const modalHtml = `
            <div id="badge-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.98); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: badgePop 0.5s ease-out;">
                <div style="font-size:100px; margin-bottom:20px;">${badge.icon}</div>
                <h2 style="color:${themeColor}; margin:10px 0;">解锁成就：${badge.name}</h2>
                <p style="color:#666; text-align:center; padding:0 30px;">${badge.desc}</p>
                <button onclick="this.parentElement.remove()" style="margin-top:40px; background:${themeColor}; color:white; border:none; padding:12px 50px; border-radius:50px; font-weight:bold; cursor:pointer;">收下勋章</button>
            </div>
            <style> @keyframes badgePop { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } } </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};
