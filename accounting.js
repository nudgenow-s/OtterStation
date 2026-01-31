const AccountingEngine = {
    syncPurchase(name, unitPrice, qty) {
        let lib = JSON.parse(localStorage.getItem('cost_lib')) || {};
        lib[name] = { unitPrice, stock: qty, total: qty };
        localStorage.setItem('cost_lib', JSON.stringify(lib));
    },
    calculateProfit(revenue, itemName) {
        let lib = JSON.parse(localStorage.getItem('cost_lib')) || {};
        const unitCost = lib[itemName] ? parseFloat(lib[itemName].unitPrice) : 0;
        const dailyFixed = parseFloat(localStorage.getItem('dailyTarget')) || 200;
        
        // 扣减库存
        if(lib[itemName] && lib[itemName].stock > 0) lib[itemName].stock--;
        localStorage.setItem('cost_lib', JSON.stringify(lib));

        return {
            netProfit: (revenue - unitCost).toFixed(2),
            remainingStock: lib[itemName] ? lib[itemName].stock : 0,
            unitCost: unitCost
        };
    }
};
