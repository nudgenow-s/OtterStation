/**
 * 模块：水獭主理人财务内核 (Accounting Engine V3.0)
 * 功能：深度整合固定成本、动态耗材、以及盈亏平衡算法
 */
const AccountingEngine = {
    
    // 1. 同步采购：将 AI 识别到的单价和库存存入“资产库”
    syncPurchase(name, unitPrice, qty) {
        let lib = JSON.parse(localStorage.getItem('cost_lib')) || {};
        // 采用覆盖式更新：新采购会更新该耗材的最新单价
        lib[name] = { 
            unitPrice: parseFloat(unitPrice), 
            stock: parseInt(qty), 
            total: parseInt(qty),
            lastUpdate: new Date().toLocaleDateString()
        };
        localStorage.setItem('cost_lib', JSON.stringify(lib));
        console.log(`[核算系统] 资产库已入库: ${name}, 单价: ${unitPrice}`);
    },

    // 2. 核心核算逻辑：计算单笔利润，并自动处理耗材折旧
    calculateProfit(revenue, itemName = null) {
        let lib = JSON.parse(localStorage.getItem('cost_lib')) || {};
        let materialCost = 0;

        // 如果该订单使用了特定耗材（如：售后卡）
        if (itemName && lib[itemName]) {
            materialCost = parseFloat(lib[itemName].unitPrice);
            // 严厉模式：自动扣减库存
            if (lib[itemName].stock > 0) {
                lib[itemName].stock--;
                localStorage.setItem('cost_lib', JSON.stringify(lib));
            } else {
                console.warn(`[核算系统] 预警：${itemName} 库存已耗尽，利润核算将不再计入此项成本。`);
            }
        }

        // 获取你在 setup.html 设置的“能量基石”成本
        // 这部分是你的“睁眼成本”，即房租+工资+杂费的日均值
        const dailyBaseCost = parseFloat(localStorage.getItem('dailyCost')) || 0;

        // 核心公式：
        // 净利润 = 营业额 - 动态耗材成本
        // 注意：房租工资已经在主界面的“百分比”里体现了，这里计算的是单笔交易的增量贡献
        const netProfit = (revenue - materialCost).toFixed(2);

        return {
            netProfit: netProfit,
            materialCost: materialCost,
            remainingStock: itemName && lib[itemName] ? lib[itemName].stock : "N/A",
            // 返回给 UI 使用的达成率参数
            dailyTarget: dailyBaseCost
        };
    },

    // 3. 获取全店资产价值（选做：用于报表页面）
    getInventoryValue() {
        let lib = JSON.parse(localStorage.getItem('cost_lib')) || {};
        let totalValue = 0;
        for (let key in lib) {
            totalValue += lib[key].unitPrice * lib[key].stock;
        }
        return totalValue.toFixed(2);
    }
};
