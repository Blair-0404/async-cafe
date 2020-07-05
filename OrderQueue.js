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

module.exports = OrderQueue;