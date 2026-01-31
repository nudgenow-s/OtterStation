/**
 * 模块：水獭主理人勋章成就系统 (Achievement V2.0)
 * 核心逻辑：基于行为数据的触发器
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
            desc: '连续3天能量值超过100%，你是房东的克星！', 
            condition: (s) => s.streak >= 3 
        },
        { 
            id: 'smart_buyer', 
            name: '精明猎手', 
            icon: '🦊', 
            desc: '通过 AI 提取了超过 5 笔采购，每一分钱都算得死死的。', 
            condition: (s) => s.visionCount >= 5 
        },
        { 
            id: 'anti_procrastination', 
            name: '拒绝拖延', 
            icon: '🔥', 
            desc: '在 20:00 前完成结算。INTJ 的执行力，恐怖如斯！', 
            condition: (s) => s.isEarlyBird === true 
        }
    ],

    // 获取或初始化统计数据
    getStats() {
        let stats = JSON.parse(localStorage.getItem('user_stats')) || {
            totalSales: 0,
            streak: 0,
            visionCount: 0,
            lastDate: null
        };
        return stats;
    },

    // 核心检查入口
    check(currentData) {
        let stats = this.getStats();
        const today = new Date().toLocaleDateString();
        const now = new Date();

        // 1. 更新统计：总额
        stats.totalSales = parseFloat(localStorage.getItem('todayRev')) || 0;

        // 2. 更新统计：AI 识别次数 (从 vision.js 联动)
        stats.visionCount = parseInt(localStorage.getItem('ai_count')) || 0;

        // 3. 更新统计：连续达标天数 (逻辑判断)
        if (stats.lastDate !== today) {
            const dailyCost = parseFloat(localStorage.getItem('dailyCost')) || 1;
            if (stats.totalSales >= dailyCost) {
                stats.streak++;
            } else {
                stats.streak = 0; // 断更则归零，严厉模式
            }
            stats.lastDate = today;
        }

        // 4. 更新统计：拒绝拖延
        // 如果当前时间早于 20:00 且有收入录入
        if (now.getHours() < 20 && stats.totalSales > 0) {
            stats.isEarlyBird = true;
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

    showBadgeModal(badge) {
        const modalHtml = `
            <div id="badge-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.95); z-index:1000; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: badgePop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div style="font-size:120px; margin-bottom:10px;">${badge.icon}</div>
                <h2 style="color:#ff85a2; font-size:28px; margin:10px 0;">点亮成就：${badge.name}</h2>
                <p style="color:#888; padding:0 40px; text-align:center; line-height:1.6;">${badge.desc}</p>
                <button onclick="document.getElementById('badge-modal').remove()" style="margin-top:40px; background:#ff85a2; color:white; border:none; padding:15px 60px; border-radius:50px; font-weight:bold; cursor:pointer; box-shadow: 0 10px #ffb3c6;">太棒了！</button>
            </div>
            <style>
                @keyframes badgePop { from { opacity:0; transform:scale(0.8) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};
