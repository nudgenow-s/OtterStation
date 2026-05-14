const AchievementEngine = {
    badges: [
        { id:'first_blood',        name:'首单入账', icon:'💰', desc:'打破鸭蛋，开工大吉！',              condition:(s)=>s.totalSales>0 },
        { id:'profitable_king',    name:'盈利王者', icon:'👑', desc:'连续达标，你是房东克星！',          condition:(s)=>s.totalSales>=s.dailyCost*3 },
        { id:'smart_buyer',        name:'精明猎手', icon:'🦊', desc:'精准记账，每一分钱都有据可查。',    condition:(s)=>s.recordCount>=5 },
        { id:'anti_procrastination',name:'黄金选手',icon:'🔥', desc:'超绝主理人，今日目标已达成。',      condition:(s)=>s.isDailyGoalMet===true }
    ],

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
                    Achievement Unlocked
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
                    ${badge.name}
                </div>

                <!-- 描述 -->
                <div style="font-size:12px;color:#A89880;line-height:1.7;
                    margin-bottom:24px;font-family:'PingFang SC',sans-serif;">
                    ${badge.desc}
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
                    收下勋章
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
