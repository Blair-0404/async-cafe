const { Cafe } = require('./Cafe');

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