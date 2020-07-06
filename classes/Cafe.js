const { OrderQueue } = require('./OrderQueue');
const { Dashboard } = require('./Dashboard');
const { Barista } = require('./Barista');
const { Cashier } = require('./Cashier');
const { Manager } = require('./Manager');

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

module.exports={
    Cafe
}
