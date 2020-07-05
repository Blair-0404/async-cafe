class Dashboard {
    waitingOrderList;
    workingOrderList;
    doneOrderList;

    printInterval;

    constructor() {
        this.waitingOrderList = [];
        this.workingOrderList = [];
        this.doneOrderList = [];

        this.printInterval = setInterval(this.printDashboard.bind(this), 5000);
    }

    addWaitingOrder(customerId) {
        this.waitingOrderList.push(customerId);
    }

    addWorkingOrder(customerId) {
        this.removeIdInOrder(this.waitingOrderList, customerId);
        this.removeIdInOrder(this.workingOrderList, customerId);

        this.workingOrderList.push(customerId);
    }

    addDoneOrder(customerId) {
        this.removeIdInOrder(this.waitingOrderList, customerId);
        this.removeIdInOrder(this.workingOrderList, customerId);

        this.doneOrderList.push(customerId);
    }

    removeIdInOrder(orderList, customerId) {
        const targetIndex = orderList.findIndex((item) => item === customerId);

        if (targetIndex !== -1) {
            orderList.splice(targetIndex, 1);
        }
    }

    printDashboard() {
        console.log('waiting list: ', this.waitingOrderList.map(id => `${id}번 고객`));
        console.log('working list: ', this.workingOrderList.map(id => `${id}번 고객`));
        console.log('done list: ', this.doneOrderList.map(id => `${id}번 고객`));
    }
}

module.exports = Dashboard;