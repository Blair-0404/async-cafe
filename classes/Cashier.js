const { Order } = require('./Order');

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

module.exports={
    Cashier
}
