const AchievementEngine = {
    badges: [
        {
            id: 'first_blood',
            name: '首单入账',
            icon: '💰',
            desc: '打破鸭蛋，开工大吉！',
            condition: (s) => s.totalSales > 0
        },
        {
            id: 'profitable_king',
            name: '盈利王者',
            icon: '👑',
            desc: '连续达标，你是房东克星！',
            condition: (s) => s.totalSales >= s.dailyCost * 3
        },
        {
            id: 'smart_buyer',
            name: '精明猎手',
            icon: '🦊',
            desc: '精准记账，每一分钱都有据可查。',
            condition: (s) => s.recordCount >= 5
        },
        {
            id: 'anti_procrastination',
            name: '黄金选手',
            icon: '🔥',
            desc: '超绝主理人，今日目标已达成。',
            condition: (s) => s.isDailyGoalMet === true
        }
    ],

    getStats() {
        const defaultStats = {
            totalSales: 0, streak: 0, recordCount: 0,
            lastDate: null, isDailyGoalMet: false, dailyCost: 0
        };
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

        stats.totalSales  = (parseFloat(stats.totalSales)  || 0) + parseFloat(newAmount);
        stats.recordCount = (parseInt(stats.recordCount)   || 0) + 1;
        stats.dailyCost   = dailyCost;

        if (stats.lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toLocaleDateString();
            stats.streak = (stats.lastDate === yesterdayStr)
                ? (parseInt(stats.streak) || 0) + 1
                : 1;
            stats.isDailyGoalMet = false;
            stats.lastDate = today;
        }

        const updatedTodayRev = parseFloat(localStorage.getItem('todayRev')) || 0;
        if (updatedTodayRev >= dailyCost) stats.isDailyGoalMet = true;

        localStorage.setItem('user_stats', JSON.stringify(stats));

        let earned = [];
        try { earned = JSON.parse(localStorage.getItem('earned_badges')) || []; }
        catch(e) { earned = []; }

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
        // 移除已有弹窗，防止多个叠加
        const existing = document.getElementById('badge-modal');
        if (existing) existing.remove();

        const modalHtml = `
            <div id="badge-modal" style="
                position: fixed; top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(10, 4, 6, 0.92);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                animation: badgeFadeIn 0.45s cubic-bezier(0.4,0,0.2,1);
            ">
                <!-- 光晕背景 -->
                <div style="
                    position: absolute;
                    width: 260px; height: 260px;
                    background: radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                "></div>

                <!-- 卡片 -->
                <div style="
                    position: relative;
                    background: linear-gradient(160deg, #1F0F14 0%, #160810 100%);
                    border: 1px solid rgba(201,168,76,0.25);
                    border-radius: 28px;
                    padding: 40px 32px 32px;
                    width: 290px;
                    text-align: center;
                    box-shadow:
                        0 0 0 1px rgba(201,168,76,0.06),
                        0 32px 64px rgba(0,0,0,0.7),
                        inset 0 1px 0 rgba(201,168,76,0.12);
                    animation: badgeCardPop 0.5s cubic-bezier(0.34,1.56,0.64,1);
                ">
                    <!-- 顶部金线 -->
                    <div style="
                        position: absolute; top: 0; left: 50%;
                        transform: translateX(-50%);
                        width: 80px; height: 2px;
                        background: linear-gradient(90deg, transparent, #C9A84C, transparent);
                        border-radius: 0 0 2px 2px;
                    "></div>

                    <!-- 小标签 -->
                    <div style="
                        font-size: 9px;
                        letter-spacing: 4px;
                        color: rgba(201,168,76,0.45);
                        text-transform: uppercase;
                        margin-bottom: 20px;
                    ">Achievement Unlocked</div>

                    <!-- 勋章图标 -->
                    <div style="
                        font-size: 72px;
                        line-height: 1;
                        margin-bottom: 20px;
                        filter: drop-shadow(0 0 20px rgba(201,168,76,0.35));
                        animation: badgeIconFloat 2.5s ease-in-out infinite;
                    ">${badge.icon}</div>

                    <!-- 分隔线 -->
                    <div style="
                        display: flex; align-items: center; gap: 10px;
                        margin: 0 0 18px;
                    ">
                        <div style="flex:1; height:1px; background:rgba(201,168,76,0.15);"></div>
                        <div style="width:5px; height:5px; background:#C9A84C; transform:rotate(45deg); opacity:0.5;"></div>
                        <div style="flex:1; height:1px; background:rgba(201,168,76,0.15);"></div>
                    </div>

                    <!-- 标题 -->
                    <div style="
                        color: #E8D08A;
                        font-size: 18px;
                        font-weight: 600;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                        font-family: 'PingFang SC', sans-serif;
                    ">${badge.name}</div>

                    <!-- 描述 -->
                    <div style="
                        color: rgba(255,255,255,0.38);
                        font-size: 12px;
                        line-height: 1.7;
                        margin-bottom: 28px;
                        font-family: 'PingFang SC', sans-serif;
                        letter-spacing: 0.3px;
                    ">${badge.desc}</div>

                    <!-- 按钮 -->
                    <button onclick="document.getElementById('badge-modal').remove()" style="
                        width: 100%;
                        background: linear-gradient(135deg, #8B1A2F 0%, #6B1220 55%, #8B2A1A 100%);
                        color: #E8D08A;
                        border: 1px solid rgba(201,168,76,0.3);
                        padding: 15px;
                        border-radius: 50px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        letter-spacing: 1px;
                        font-family: 'PingFang SC', 'Helvetica Neue', sans-serif;
                        transition: border-color 0.2s;
                    " onmouseover="this.style.borderColor='rgba(201,168,76,0.6)'"
                       onmouseout="this.style.borderColor='rgba(201,168,76,0.3)'">
                        收下勋章
                    </button>
                </div>
            </div>

            <style>
                @keyframes badgeFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes badgeCardPop {
                    from { opacity: 0; transform: scale(0.8) translateY(20px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes badgeIconFloat {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-6px); }
                }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};
