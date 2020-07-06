class Manager {
    orderQueue;
    barista;
    dashboard;
    orderList;
    workList;

    orderInterval;
    workInterval;

    constructor(orderQueue, barista, dashboard) {
        this.orderQueue = orderQueue;
        this.barista = barista;
        this.dashboard = dashboard;
        this.orderList = [];
        this.workList = [];
        // set eventListener
        this.barista.addEventListener('end', this.doneBeverage.bind(this));

        this.orderInterval = setInterval(this.checkOrderQueue.bind(this), 1000);
        this.workInterval = setInterval(this.checkWork.bind(this), 1000);
    }

    checkOrderQueue() {
        const newOrders = this.orderQueue.getOrder();

        if (newOrders.length > 0) {
            this.orderList.push(...newOrders);

            newOrders.forEach((order) => Object.entries(order.beverageInfo).forEach((entry) => {
                for (let i = 0; i < entry[1].ordered; ++i) {
                    this.workList.push({customerId: order.customerId, type: parseInt(entry[0])}); // work => {customerId: number, type: number}
                }

                this.dashboard.addWaitingOrder(order.customerId);
            }));
        }
    }

    checkWork() {
        if (this.workList.length > 0) {
            const availableCount = Math.min(this.barista.getAvailableCount(), this.workList.length);

            for (let i = 0; i < availableCount; ++i) {
                const work = this.workList.shift();

                this.barista.requestWork(work);
                this.dashboard.addWorkingOrder(work.customerId);
            }
        }
    }

    doneBeverage(work) {
        const { customerId, type } = work;
        let checkPos = 0;

        while (checkPos < this.orderList.length) {
            const targetOrder = this.orderList[checkPos];

            if (targetOrder.beverageInfo.hasOwnProperty(type) &&
                (targetOrder.beverageInfo[type].ordered > targetOrder.beverageInfo[type].done)) {
                targetOrder.beverageInfo[type].done++;

                // check if all ordered beverages are done (= order is done)
                if (Object.values(targetOrder.beverageInfo).reduce((acc, info) => acc && (info.ordered === info.done), true)) {
                    this.dashboard.addDoneOrder(customerId);
                }

                return;
            }

            checkPos++;
        }
    }
}

module.exports={
    Manager
}
