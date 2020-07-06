const { EventEmitter } = require('events');

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
module.exports={
    Barista
}
