/**
 * 能量基石 - 全自动化双语引擎 (已整合 ROI 补齐 & CSV 劫持)
 */
const i18nConfig = {
    'en': {
        // === setup.html 专属 ===
        '🏷️ 选择行业身份': '🏷️ Select Industry',
        '美甲美睫': 'Nail & Lash',
        '小吃摆摊': 'Street Food',
        '服装零售': 'Retail',
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

        // === main.html 专属 ===
        '🔒 成本': '🔒 Cost',
        '📊 报表': '📊 Report',
        '今日目标达成率': 'Daily Goal Progress',
        '记录成交金额': 'Record Sale Amount',
        '记录成交': 'Log Transaction',
        '数据复盘': 'Data Review',
        '历史账单': 'History',
        '今日行动建议': 'Action Advice',
        '我知道了': 'Got it',
        '✍️ 直接记一笔': '✍️ Record Now',
        '回本进度': 'ROI Progress',
        '总投入': 'Total Investment',
        '月度利润预测': 'Monthly Forecast',
        '基于近7日表现预测本月净盈余': 'Forecast based on last 7 days',
        '导出全维度 CSV 报表': 'Export CSV',
        '⚙️ 成本细项微调': '⚙️ Adjust Costs',
        '保存': 'Save',
        '取消': 'Cancel',

        // === 补充词条：解决 ROI 未完全翻译的问题 ===
        '进度': 'Progress',
        '累计纯利': 'Total Profit',
    
        '回本': 'to ROI',
        '预计还需': 'Estimated',
        '天': 'days',
        '约': 'Est.',

        // === 补充词条：解决 CSV 导出翻译的问题 ===
        '日期,总营收,毛利,达成率,日均房租,日均人工,日均杂费,绝对净利': 'Date,Revenue,Gross,Achievement,Rent/D,Salary/D,Misc/D,Net Profit',

        // === 动态匹配关键词 ===
        '⏳ 距离打平还差': '⏳ Gap to breakeven:',
        '🎯 已打平成本！从现在开始都是利润': '🎯 Breakeven reached! Profit starts now',
        '✨ 纯赚': '✨ Net Profit:',
        '还没设定成本哦～': 'Costs not set yet...',
        '先点右上角': 'Please click top-right',
        '我才能帮你算': 'to calculate progress',
        '今天目标：': 'Today\'s Goal:',
        '已打平成本': 'Breakeven',
        '再多一块，都是你抢来的利润': 'Every extra dollar is your profit'
    }
};

(function() {
    let currentLang = localStorage.getItem('lang') || 'zh';
    const isEn = currentLang === 'en';

    // 【新增】拦截并翻译 CSV 数据流 (不改原代码的核心逻辑)
    const originalBlob = window.Blob;
    if (isEn) {
        window.Blob = function(contentArray, options) {
            if (options && options.type && options.type.includes('csv')) {
                let csvContent = contentArray[0];
                const dict = i18nConfig['en'];
                // 对 CSV 文本进行遍历替换
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

    // 1. 创建 UI 按钮
    const btn = document.createElement('div');
    btn.id = 'i18n-toggle-btn';
    btn.innerHTML = currentLang === 'zh' ? 'EN' : '中文';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '25px', left: '20px', background: 'var(--primary-pink, #ff85a2)',
        color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px',
        cursor: 'pointer', zIndex: '99999', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    });
    document.body.appendChild(btn);

    // 2. 翻译引擎核心
    function runTranslation() {
        if (currentLang === 'zh') return;
        const dict = i18nConfig['en'];

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) {
            let val = node.nodeValue;
            let changed = false;
            
            // 使用 split/join 确保整句中的所有匹配词条都被替换
            for (let zhKey in dict) {
                if (val.includes(zhKey)) {
                    val = val.split(zhKey).join(dict[zhKey]);
                    changed = true;
                }
            }
            
            if (changed) node.nodeValue = val;
            
            // 符号处理
            if (node.nodeValue.includes('¥')) {
                node.nodeValue = node.nodeValue.replace(/¥/g, '$');
            }
        }

        // B. 特殊属性处理 (Placeholder)
        const placeholders = {
            '月房租': 'Monthly Rent', '月工资': 'Salary', '月杂费': 'Utilities', 
            '初始总投入': 'Startup Cost', '请输入老板锁密码：': 'Enter Boss Password:'
        };
        document.querySelectorAll('input').forEach(input => {
            if (placeholders[input.placeholder]) {
                input.placeholder = placeholders[input.placeholder];
            } else if (input.placeholder.includes('¥')) {
                input.placeholder = input.placeholder.replace(/¥/g, '$');
            }
        });
    }

    // 3. 动态监听
    const observer = new MutationObserver(() => {
        if (currentLang === 'en') runTranslation();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // 4. 点击切换
    btn.onclick = () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('lang', currentLang);
        location.reload(); 
    };

    // 5. 初始化
    setTimeout(runTranslation, 30);
})();
