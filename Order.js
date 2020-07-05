class Order {
    customerId;
    beverageInfo; // {type: {ordered: number, done: number}}

    constructor(customerId, beverageList) {
        this.customerId = customerId;
        this.beverageInfo = beverageList;
    }
}

module.exports = Order;