const { EventEmitter } = require('events');

class Order {
    customerId;
    beverageInfo; // {type: {ordered: number, done: number}}

    constructor(customerId, beverageList) {
        this.customerId = customerId;
        this.beverageInfo = beverageList;
    }
}

class OrderQueue {
    orderList;

    constructor() {
        this.orderList = [];
    }

    isEmpty() {
        return this.orderList.length === 0;
    }

    addOrder(order) {
        this.orderList.push(order);
    }

    getOrder() {
        let orders = [];

        while (!this.isEmpty()) {
            orders.push(this.orderList.shift());
        }

        return orders;
    }
}

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

class Barista {
    eventEmitter;
    workingCount;
    maxCount;

    constructor(maxCount) {
        this.eventEmitter = new EventEmitter();
        this.workingCount = 0;
        this.maxCount = maxCount || 2;
    }

    getAvailableCount() {
        return this.maxCount - this.workingCount;
    }

    requestWork(work) {
        const name = this.getName(work.type);
        const time = this.getTime(work.type);

        this.eventEmitter.emit('start', work);
        this.workingCount++;

        console.log(`${name} 제조를 시작합니다.`);

        setTimeout(() => {
            this.workingCount--;

            console.log(`${name} 제조가 완료되었습니다.`);
            this.eventEmitter.emit('end', work);
        }, time * 1000);
    }

    addEventListener(type, func) { // type: 'start', 'end'
        this.eventEmitter.on(type, func);
    }

    getTime(type) {
        switch (type) {
            case 1:
                return 3;
            case 2:
                return 5;
            case 3:
                return 10;
            default:
                return 0;
        }
    }

    getName(type) {
        switch (type) {
            case 1:
                return '아메리카노';
            case 2:
                return '아이스티';
            case 3:
                return '녹차라떼';
            default:
                return null;
        }
    }
}

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

class Cashier {
    customerIndex;
    orderQueue;

    constructor(orderQueue) {
        this.customerIndex = 0;
        this.orderQueue = orderQueue;
    }

    requestOrder(str) {
        // todo: add str validator
        this.customerIndex++;

        const beverageInfo = str.split(' ').reduce((acc, orderStr) => {
            const beverage = orderStr.split(':').map((value) => parseInt(value));

            acc = {...acc , [beverage[0]]: { ordered: beverage[1], done: 0 }};

            return acc;
        }, {});
        const order = new Order(this.customerIndex, beverageInfo);

        this.orderQueue.addOrder(order);
    }
}

class Cafe {
    cashier;
    manager;
    barista;
    dashboard;

    constructor() {
        const orderQueue = new OrderQueue();

        this.dashboard = new Dashboard();
        this.barista = new Barista(); // default maxCount;
        this.cashier = new Cashier(orderQueue);
        this.manager = new Manager(orderQueue, this.barista, this.dashboard);
    }

    request(orderStr) {
        this.cashier.requestOrder(orderStr);
    }
}

const cafe = new Cafe();
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("메뉴  =  1. 아메리카노(3s)    2. 아이스티(5s)    3. 녹차라떼(10s)");
console.log("주문할 음료를 입력하세요. 예) 아메리카노 2잔 아이스티 1잔 => 1:2 2:1");

rl.on('line', (line) => {
    if (cafe.request(line)) {
        console.error('잘못된 주문입니다.');
    }
}).on('close', () => {
    process.exit();
});