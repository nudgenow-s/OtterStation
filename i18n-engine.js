/**
 * 能量基石 - 全自动化双语引擎
 * 修复：prompt() 拦截 + 所有 alert key 与代码字符串对齐
 */
const i18nConfig = {
    'en': {
        // === setup.html ===
        '🏷️ 选择行业身份': '🏷️ Select Industry',
        '美业': 'Beauty Industry',
        '餐饮': 'F&B',
        '零售': 'Retail',
        '确认身份': 'Confirm',
        '🏠 房租与物业': '🏠 Rent & Property',
        '房租是生存的第一道坎。请输入每月固定支出：': 'Rent is your first hurdle. Enter monthly fixed costs:',
        '👸 你的专属工资': '👸 Your Salary',
        '如果你不发工资，那你只是在自我剥削：': 'If you don\'t pay yourself, you are self-exploiting:',
        '🔋 杂费与折旧': '🔋 Misc & Depreciation',
        '水电、材料折旧。算出日均运营成本：': 'Utilities & materials. Calculate daily running cost:',
        '最后一步': 'Final Step',
        '🏗️ 初始投入成本': '🏗️ Initial Investment',
        '装修、设备、加盟费等沉没成本：': 'Renovation, equipment, franchise fees, etc.:',
        '下一步': 'Next',
        '返回上一步': 'Back',
        '完成并进入水獭能量站': 'Finish & Enter Station',

        // === main.html 导航 ===
        '📤 备份': '📤 Backup',
        '📅 补记': '📅 Log Past',
        '🔒 成本': '🔒 Cost',
        '📊 报表': '📊 Report',

        // === 主界面 ===
        '今日目标达成率': 'Daily Goal Progress',
        '记录成交金额': 'Record Sale Amount',
        '记录成交': 'Log Transaction',
        '计算中...': 'Calculating...',

        // === 激励弹窗 ===
        '今日行动建议': 'Action Advice',
        '✍️ 直接记一笔': '✍️ Log a sale',
        '知道了': 'Got it',

        // === buildMotivation 动态文字 ===
        '还没设定成本～': 'Costs not set yet~',
        '点右上角 🔒 成本 完成配置': 'Tap the top-right 🔒 Cost',
        '系统才能计算您的达成率 🧮': 'so I can calculate your progress 🧮',
        '今日目标：': 'Today\'s goal:',
        '= 打平成本': '= breakeven',
        '超出的每一分，都是您的净利润 💰': 'Every extra dollar is pure profit 💰',
        '昨日小亏 ¥': 'Yesterday -$',
        '今天只需多一笔就是反转': 'One more sale = comeback',
        '不必完美，只需开始 🔥': 'Don\'t aim for perfect, just start 🔥',
        '昨日盈利 ¥': 'Yesterday +$',
        ' 🎉': ' 🎉',
        '今天保持节奏': 'Keep the momentum',
        '基础线：¥': 'Baseline: $',

        // === 报表弹窗 ===
        '数据复盘': 'Data Review',
        '历史账单': 'History',
        '暂无历史数据': 'No data yet',

        // === 同行对比（新增）===
        '同行对比':'Comparison with the same industry',
        '收益率跑赢同行': 'Outperforming',
        '的同行': '% of peers',
        '暂无足够数据': 'Not enough data yet',
        '（本地估算）': ' (est.)',

        // === ROI 卡片 ===
        '🎉 已完全回本': '🎉 Fully recovered!',
        '⏳ 需保持盈利以预测回本日': '⏳ Stay profitable to project ROI date',
        '💰 回本进度 (总投入: ¥': '💰 ROI Progress (Investment: $',
        '累计纯利 ¥': 'Net Profit $',
        '，进度': ', Progress',
        '预计还需': 'Est.',
        '天回本（约': 'days to ROI (approx.',
        '）': ')',

        // === 预测卡片 ===
        '🔮 智能月度利润预测': '🔮 Smart Monthly Forecast',
        '基于近7日表现预测本月净盈余': 'Forecast based on last 7 days',

        // === profit-tip 动态文字 ===
        '⏳ 距离打平还差 ¥': '⏳ Gap to breakeven: $',
        '✨ 纯赚 ¥': '✨ Net profit: $',

        // === 导出 ===
        '导出全维度 CSV 报表': 'Export CSV Report',
        '日期,总营收,达成率,日均房租,日均人工,日均杂费,绝对净利': 'Date,Revenue,Achievement,Rent/D,Salary/D,Misc/D,Net Profit',

        // === 成本弹窗 ===
        '⚙️ 成本细项微调': '⚙️ Adjust Costs',
        '保存': 'Save',
        '取消': 'Cancel',

        // === 勋章弹窗 ===
        '解锁成就：': 'Achievement Unlocked: ',
        '解锁成就': 'Achievement Unlocked',
        'Achievement Unlocked': 'Achievement Unlocked',
        '收下勋章': 'Claim Badge',
        '首单入账': 'First Sale',
        '盈利王者': 'Profit King',
        '精明猎手': 'Shrewd Hunter',
        '黄金选手': 'Gold Player',
        '打破鸭蛋，开工大吉！': 'Zero broken — off to a flying start!',
        '连续达标，你是房东克星！': 'On a streak — the landlord\'s nemesis!',
        '精准记账，每一分钱都有据可查。': 'Precise tracking: every cent accounted for.',
        '超绝主理人，今日目标已达成。': 'Elite manager — today\'s goal is done.',
        '营收': 'Revenue',

        // === alert 文字（与代码字符串完全一致）===
        '财库暂无数据，先记几笔再备份。': 'Nothing to backup yet — log some sales first!',
        '备份成功！请妥善保存。': 'Backup successful! Keep this file safe.',
        '备份失败，请检查浏览器权限。': 'Backup failed. Check browser permissions.',
        '请输入有效金额': 'Please enter a valid amount',

        // === prompt 文字（与代码字符串完全一致）===
        '请输入密码：': 'Enter Password:',

        // === 补记日历 ===
        '选择需要补记的日期': 'Select a date to supplement',
        '确认补记': 'Confirm',
        '日期：': 'Date: ',
        '¥ 当日总营收': '$ Total revenue of the day',
        '✅ 补记成功：': '✅ Supplemented: ',
    }
};

(function () {
    let currentLang = localStorage.getItem('lang') || 'zh';
    const isEn = currentLang === 'en';
    const dict = i18nConfig['en'];

    // ══════════════════════════════════════════
    // 【1】拦截 alert()
    // ══════════════════════════════════════════
    if (isEn) {
        const _origAlert = window.alert;
        window.alert = function (msg) {
            _origAlert(typeof msg === 'string' && dict[msg] ? dict[msg] : msg);
        };

        // 【修复】拦截 prompt() — walker 扫不到 prompt 参数，必须在这里处理
        const _origPrompt = window.prompt;
        window.prompt = function (msg, def) {
            const out = (typeof msg === 'string' && dict[msg]) ? dict[msg] : msg;
            return _origPrompt(out, def);
        };
    }

    // ══════════════════════════════════════════
    // 【2】拦截 Blob — CSV 翻译
    // ══════════════════════════════════════════
    if (isEn) {
        const _origBlob = window.Blob;
        window.Blob = function (contentArray, options) {
            if (options && options.type && options.type.includes('csv')) {
                let csv = contentArray[0];
                for (const zh in dict) {
                    if (csv.includes(zh)) csv = csv.split(zh).join(dict[zh]);
                }
                return new _origBlob([csv], options);
            }
            return new _origBlob(contentArray, options);
        };
    }

    // ══════════════════════════════════════════
    // 【3】语言切换按钮
    // ══════════════════════════════════════════
    const btn = document.createElement('div');
    btn.id = 'i18n-toggle-btn';
    btn.innerHTML = currentLang === 'zh' ? 'EN' : '中文';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '25px', left: '20px',
        background: 'var(--primary-pink, #9B2335)',
        color: 'white', padding: '6px 14px', borderRadius: '20px',
        fontSize: '11px', cursor: 'pointer', zIndex: '99999',
        fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    });
    document.body.appendChild(btn);
    btn.onclick = () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('lang', currentLang);
        location.reload();
    };

    // ══════════════════════════════════════════
    // 【4】Text Walker 核心翻译
    // ══════════════════════════════════════════
    function runTranslation() {
        if (currentLang === 'zh') return;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            // 跳过 script/style 标签内文字
            const parent = node.parentElement;
            if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) continue;

            let val = node.nodeValue;
            let changed = false;
            for (const zh in dict) {
                if (val.includes(zh)) {
                    val = val.split(zh).join(dict[zh]);
                    changed = true;
                }
            }
            if (changed) node.nodeValue = val;

            // ¥ → $
            if (node.nodeValue.includes('¥')) {
                node.nodeValue = node.nodeValue.replace(/¥/g, '$');
                changed = true;
            }
        }

        // Placeholder 翻译
        const ph = {
            '月房租':   'Monthly Rent',
            '月工资':   'Salary',
            '月杂费':   'Utilities',
            '初始总投入':'Startup Cost',
            '请输入密码：':'Enter Password:',
            '¥ 0.00':   '$ 0.00',
            '¥ 当日总营收':'$ Total revenue of the day',
        };
        document.querySelectorAll('input').forEach(input => {
            const p = input.placeholder;
            if (ph[p]) {
                input.placeholder = ph[p];
            } else if (p.includes('¥')) {
                input.placeholder = p.replace(/¥/g, '$');
            }
        });
    }

    // ══════════════════════════════════════════
    // 【5】MutationObserver — 监听动态内容
    // ══════════════════════════════════════════
    const observer = new MutationObserver(() => {
        if (currentLang === 'en') runTranslation();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // ══════════════════════════════════════════
    // 【6】初始化
    // ══════════════════════════════════════════
    setTimeout(runTranslation, 30);
})();
