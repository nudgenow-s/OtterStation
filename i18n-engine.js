/**
 * 能量基石 - 全自动化双语引擎 (已整合 ROI 补齐 & CSV 劫持)
 * 修复版：补全所有缺漏翻译词条
 */
const i18nConfig = {
    'en': {
        // === setup.html 专属 ===
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

        // === 激励弹窗标题（拆分匹配）===
        '今日行动建议': 'Action Advice',
        '✍️ 直接记一笔': '✍️ Log a sale',
        '知道了': 'Got it',

        // === buildMotivation 动态文字 — 全量覆盖 ===
        '还没设定成本～': 'Costs not set yet~',
        '点右上角 🔒 成本 完成配置': 'Tap the top-right 🔒 Cost ',
        '系统才能计算您的达成率': 'so I can calculate',
        '今日达成率': 'today\'s progress 🧮',
        '今日目标：': 'Today\'s goal:',
        '打平成本': 'Breakeven reached',
        '超出的每一分，都是您的净利润': 'Every extra dollar is pure profit 💰',
        '昨天小亏': 'Yesterday you lost',
        '今天只需多一笔就是反转': 'Just 1 more sale than yesterday = comeback',
        '不必完美，只需开始': 'Don\'t aim for perfect, just start 🔥',
        '昨日盈利': 'Yesterday\'s profit:',
        '今天保持节奏': 'Today: keep the momentum',
        '先完成': 'First hit',
        '基础线': 'baseline',

        // === 报表弹窗 ===
        '数据复盘': 'Data Review',
        '历史账单': 'History',

        // === ROI 卡片 ===
        '🎉 恭喜！已完全回本': '🎉 Congrats! Fully recovered!',
        '⏳ 需保持盈利以预测回本日': 'Maintain profitability to project ROI date',
        '暂无数据': 'No data yet',
        '💰 回本进度 (总投入: ¥': '💰 ROI Progress (Investment: $',
        '回本进度': 'ROI Progress',
        '总投入': 'Total Investment',
        '累计纯利': 'Total Net Profit',
        '进度': 'Progress',
        '回本': 'to ROI',
        '预计还需': 'Est.',
        '天回本': 'days to ROI',
        '天': 'days ',
        '约': 'approx.',
       

        // === 预测卡片 ===
        '🔮 智能月度利润预测': '🔮 Smart Monthly Forecast',
        '智能': 'Smart',
        '月度利润预测': 'Monthly Forecast',
        '基于近7日表现预测本月净盈余': 'Forecast based on last 7 days',

        // === profit-tip 动态文字 ===
        '⏳ 距离打平还差': '⏳ Gap to breakeven:',
        '🎯 已打平成本！从现在开始都是利润': '🎯 Breakeven! Everything from now is profit',
        '✨ 纯赚': '✨ Net profit:',

        // === 导出 ===
        '导出全维度 CSV 报表': 'Export CSV Report',
        '日期,总营收,达成率,日均房租,日均人工,日均杂费,绝对净利': 'Date,Revenue,Achievement,Rent/D,Salary/D,Misc/D,Net Profit',

        // === 成本弹窗 ===
        '⚙️ 成本细项微调': '⚙️ Adjust Costs',
        '保存': 'Save',
        '取消': 'Cancel',

        // === achievement.js 勋章弹窗 ===
        '解锁成就：': 'Achievement Unlocked: ',
        '解锁成就': 'Achievement Unlocked',
        '收下勋章': 'Claim Badge',

        // === 勋章名称 ===
        '首单入账': 'First Sale',
        '盈利王者': 'Profit King',
        '精明猎手': 'Shrewd Hunter',
        '黄金选手': 'Gold Player',

        // === 勋章描述（完整句子匹配）===
        '打破鸭蛋，开工大吉！': 'Zero broken — off to a flying start!',
        '连续达标，你是房东克星！': 'On a streak — the landlord\'s nemesis!',
        '精准记账，每一分钱都有据可查。': 'Precise tracking: every cent accounted for.',
        '超绝主理人，今日目标已达成。': 'Elite manager — today\'s goal is done.',

        // === Chart.js dataset label（动态注入，walker扫不到，由劫持逻辑处理）===
        '营收': 'Revenue',

        // === alert 弹窗文字 ===
        '🦦 财库空空，先记几笔再备份吧！': '🦦 Nothing to backup yet — log some sales first!',
        '备份成功！请妥善保存。': 'Backup successful! Keep this JSON file safe.',
        '❌ 备份失败，请检查浏览器权限。': '❌ Backup failed. Please check browser permissions.',
        '请输入有效金额': 'Please enter a valid amount',

        // === 补记日历（已由_calLabels处理，此处备用）===
        '选择需要补记的日期': 'Select a date to supplement',
        '确认补记': 'Confirm',
        '日期：': 'Date: ',
        '¥ 当日总营收': '$ Total revenue of the day',
        '✅ 补记成功：': '✅ Supplemented: ',
    }
};

(function() {
    let currentLang = localStorage.getItem('lang') || 'zh';
    const isEn = currentLang === 'en';
    const dict = i18nConfig['en'];

    // ======================================================
    // 【1】拦截 alert()，实现弹窗翻译
    // ======================================================
    if (isEn) {
        const _origAlert = window.alert;
        window.alert = function(msg) {
            if (typeof msg === 'string' && dict[msg]) {
                _origAlert(dict[msg]);
            } else {
                _origAlert(msg);
            }
        };
        // 拦截 prompt()，翻译密码提示
        const _origPrompt = window.prompt;
        window.prompt = function(msg, def) {
            const translated = (typeof msg === 'string' && dict[msg]) ? dict[msg] : msg;
            return _origPrompt(translated, def);
        };
    }

    // ======================================================
    // 【2】拦截 Blob，翻译 CSV 数据流
    // ======================================================
    const originalBlob = window.Blob;
    if (isEn) {
        window.Blob = function(contentArray, options) {
            if (options && options.type && options.type.includes('csv')) {
                let csvContent = contentArray[0];
                for (let zhKey in dict) {
                    if (csvContent.includes(zhKey)) {
                        csvContent = csvContent.split(zhKey).join(dict[zhKey]);
                    }
                }
                return new originalBlob([csvContent], options);
            }
            return new originalBlob(contentArray, options);
        };
    }

    // ======================================================
    // 【3】拦截 Chart.js dataset label（在 new Chart() 之前注入）
    // 通过劫持 CanvasRenderingContext2D 不可行，改为在翻译引擎里
    // 把 '营收' 这个词加入 walker 扫描，Chart.js 图例文字在 DOM 里
    // 会由 MutationObserver 扫到并翻译。
    // ======================================================

    // ======================================================
    // 【4】UI 语言切换按钮
    // ======================================================
    const btn = document.createElement('div');
    btn.id = 'i18n-toggle-btn';
    btn.innerHTML = currentLang === 'zh' ? 'EN' : '中文';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '25px', left: '20px',
        background: 'var(--primary-pink, #ff85a2)',
        color: 'white', padding: '6px 14px', borderRadius: '20px',
        fontSize: '11px', cursor: 'pointer', zIndex: '99999',
        fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    });
    document.body.appendChild(btn);

    // ======================================================
    // 【5】翻译引擎核心 — Text Walker
    // ======================================================
    function runTranslation() {
        if (currentLang === 'zh') return;

        // A. 文字节点扫描替换
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) {
            let val = node.nodeValue;
            let changed = false;
            for (let zhKey in dict) {
                if (val.includes(zhKey)) {
                    val = val.split(zhKey).join(dict[zhKey]);
                    changed = true;
                }
            }
            if (changed) node.nodeValue = val;

            // ¥ → $
            if (node.nodeValue.includes('¥')) {
                node.nodeValue = node.nodeValue.replace(/¥/g, '$');
            }
        }

        // B. Placeholder 翻译
        const placeholders = {
            '月房租': 'Monthly Rent',
            '月工资': 'Salary',
            '月杂费': 'Utilities',
            '初始总投入': 'Startup Cost',
            '请输入密码：': 'Enter Password:',
            '¥ 0.00': '$ 0.00',
            '¥ 当日总营收': '$ Total revenue of the day'
        };
        document.querySelectorAll('input').forEach(input => {
            if (placeholders[input.placeholder]) {
                input.placeholder = placeholders[input.placeholder];
            } else if (input.placeholder.includes('¥')) {
                input.placeholder = input.placeholder.replace(/¥/g, '$');
            }
        });
    }

    // ======================================================
    // 【6】MutationObserver 监听动态内容（激励文字、勋章弹窗等）
    // ======================================================
    const observer = new MutationObserver(() => {
        if (currentLang === 'en') runTranslation();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // ======================================================
    // 【7】点击切换语言
    // ======================================================
    btn.onclick = () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('lang', currentLang);
        location.reload();
    };

    // ======================================================
    // 【8】初始化执行
    // ======================================================
    setTimeout(runTranslation, 30);
})();
