/**
 * 模块：勋章成就系统
 * 风格：多邻国式抽象幽默
 */
const AchievementSystem = {
    // 勋章定义库
    badges: [
        { id: 'first_blood', name: '首单入账', icon: '💰', desc: '打破鸭蛋，房东开始流汗了。', condition: (data) => data.totalSales >= 1 },
        { id: 'profitable_king', name: '盈利王者', icon: '👑', desc: '连续3天能量值超过100%。', condition: (data) => data.streak >= 3 },
        { id: 'smart_buyer', name: '精明猎手', icon: '🦊', desc: '通过截图提取了超过5笔采购。', condition: (data) => data.visionCount >= 5 },
        { id: 'anti_procrastination', name: '拒绝拖延', icon: '🔥', desc: '在晚上8点前完成了今日所有结算。', condition: (data) => data.earlyFinish === true }
    ],

    check(stats) {
        let earned = JSON.parse(localStorage.getItem('earned_badges')) || [];
        let newBadges = [];

        this.badges.forEach(badge => {
            if (!earned.includes(badge.id) && badge.condition(stats)) {
                earned.push(badge.id);
                newBadges.push(badge);
            }
        });

        if (newBadges.length > 0) {
            localStorage.setItem('earned_badges', JSON.stringify(earned));
            this.showBadgeModal(newBadges[0]); // 每次只弹出一个最牛的
        }
    },

    showBadgeModal(badge) {
        const modalHtml = `
            <div id="badge-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.95); z-index:999; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div style="font-size:100px; margin-bottom:20px;">${badge.icon}</div>
                <h2 style="color:#58cc02; font-size:30px; margin:0;">${badge.name}</h2>
                <p style="color:#777; padding:0 40px; text-align:center;">${badge.desc}</p>
                <button class="btn btn-green" style="width:200px; margin-top:30px;" onclick="document.getElementById('badge-modal').remove()">太棒了！</button>
            </div>
            <style>
                @keyframes pop { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};
