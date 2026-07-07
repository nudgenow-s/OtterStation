const AchievementEngine = {
    // ★ i18n: badge 的 name/desc 不再硬编码中文，而是在使用处通过 t() 实时翻译，
    //   使徽章名称/描述能跟随用户当前语言切换。id 保持不变（用于 localStorage 中
    //   earned_badges 的持久化 key，语言无关，不能修改，否则会导致已解锁记录失效）。
    badges: [
        { id:'first_blood',         icon:'💰', nameKey:'achievement.badge.firstBlood.name',          descKey:'achievement.badge.firstBlood.desc',          condition:(s)=>s.totalSales>0 },
        { id:'profitable_king',     icon:'👑', nameKey:'achievement.badge.profitableKing.name',      descKey:'achievement.badge.profitableKing.desc',      condition:(s)=>s.totalSales>=s.dailyCost*3 },
        { id:'smart_buyer',         icon:'🦊', nameKey:'achievement.badge.smartBuyer.name',          descKey:'achievement.badge.smartBuyer.desc',          condition:(s)=>s.recordCount>=5 },
        { id:'anti_procrastination',icon:'🔥', nameKey:'achievement.badge.antiProcrastination.name', descKey:'achievement.badge.antiProcrastination.desc', condition:(s)=>s.isDailyGoalMet===true }
    ],

    // 兜底翻译函数：若页面未加载 i18n-core.js（不太可能，但防御性处理），
    // 直接返回 key 本身，避免整个成就系统抛错。
    _t(key, params) {
        if (typeof window.t === 'function') return window.t(key, params);
        return key;
    },

    getStats(){
        const def={totalSales:0,streak:0,recordCount:0,lastDate:null,isDailyGoalMet:false,dailyCost:0};
        try{ return JSON.parse(localStorage.getItem('user_stats'))||def; }catch{ return def; }
    },

    check(newAmount){
        let stats=this.getStats();
        const today=new Date().toLocaleDateString();
        const dailyCost=parseFloat(localStorage.getItem('dailyCost'))||1;

        stats.totalSales =(parseFloat(stats.totalSales)||0)+parseFloat(newAmount);
        stats.recordCount=(parseInt(stats.recordCount)||0)+1;
        stats.dailyCost  =dailyCost;

        if(stats.lastDate!==today){
            const y=new Date(); y.setDate(y.getDate()-1);
            stats.streak=stats.lastDate===y.toLocaleDateString()?(parseInt(stats.streak)||0)+1:1;
            stats.isDailyGoalMet=false; stats.lastDate=today;
        }
        if((parseFloat(localStorage.getItem('todayRev'))||0)>=dailyCost) stats.isDailyGoalMet=true;
        localStorage.setItem('user_stats',JSON.stringify(stats));

        let earned=[]; try{ earned=JSON.parse(localStorage.getItem('earned_badges'))||[]; }catch{ earned=[]; }
        let anyNew=false;
        this.badges.forEach(b=>{
            if(!earned.includes(b.id)&&b.condition(stats)){ earned.push(b.id); anyNew=true; this.showBadgeModal(b); }
        });
        if(anyNew) localStorage.setItem('earned_badges',JSON.stringify(earned));
    },

    showBadgeModal(badge){
        const ex=document.getElementById('badge-modal'); if(ex) ex.remove();

        const name = this._t(badge.nameKey);
        const desc = this._t(badge.descKey);
        const unlockedLabel = this._t('achievement.unlockedLabel');
        const claimBtn = this._t('achievement.claimBtn');

        document.body.insertAdjacentHTML('beforeend',`
        <div id="badge-modal" style="
            position:fixed;inset:0;
            background:rgba(26,18,8,0.5);
            backdrop-filter:blur(8px);
            -webkit-backdrop-filter:blur(8px);
            z-index:9999;
            display:flex;align-items:center;justify-content:center;
            animation:bmFade 0.3s ease;
        ">
            <div style="
                background:#FFFFFF;
                border-radius:24px;
                padding:36px 28px 28px;
                width:290px;
                text-align:center;
                border:1px solid rgba(107,66,38,0.10);
                box-shadow:0 24px 64px rgba(107,66,38,0.18),0 4px 16px rgba(107,66,38,0.08);
                position:relative;
                animation:bmPop 0.38s cubic-bezier(0.34,1.56,0.64,1);
            ">
                <!-- 顶部酒红短线 -->
                <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);
                    width:40px;height:3px;background:#9B2335;border-radius:0 0 3px 3px;"></div>

                <!-- 小标签 -->
                <div style="font-size:9px;letter-spacing:3px;color:#B8963E;
                    text-transform:uppercase;margin-bottom:18px;font-weight:600;">
                    ${unlockedLabel}
                </div>

                <!-- 图标 -->
                <div style="font-size:68px;line-height:1;margin-bottom:18px;
                    animation:bmFloat 2.5s ease-in-out infinite;">
                    ${badge.icon}
                </div>

                <!-- 分隔 -->
                <div style="height:1px;background:rgba(107,66,38,0.1);margin:0 0 16px;position:relative;">
                    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
                        width:5px;height:5px;background:#fff;border:1.5px solid rgba(107,66,38,0.18);
                        border-radius:1px;rotate:45deg;"></div>
                </div>

                <!-- 名称 -->
                <div style="font-size:18px;font-weight:700;color:#1A1208;
                    margin-bottom:8px;font-family:'PingFang SC',sans-serif;letter-spacing:0.5px;">
                    ${name}
                </div>

                <!-- 描述 -->
                <div style="font-size:12px;color:#A89880;line-height:1.7;
                    margin-bottom:24px;font-family:'PingFang SC',sans-serif;">
                    ${desc}
                </div>

                <!-- 按钮 -->
                <button onclick="document.getElementById('badge-modal').remove()" style="
                    width:100%;background:#9B2335;color:#fff;border:none;
                    padding:15px;border-radius:50px;
                    font-size:14px;font-weight:600;cursor:pointer;
                    letter-spacing:0.5px;
                    font-family:'PingFang SC','Helvetica Neue',sans-serif;
                    box-shadow:0 4px 16px rgba(155,35,53,0.28);
                    transition:background 0.2s;
                " onmouseover="this.style.background='#7A1828'" onmouseout="this.style.background='#9B2335'">
                    ${claimBtn}
                </button>
            </div>
        </div>

        <style>
            @keyframes bmFade { from{opacity:0} to{opacity:1} }
            @keyframes bmPop  { from{opacity:0;transform:scale(0.85) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
            @keyframes bmFloat{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        </style>`);
    }
};
