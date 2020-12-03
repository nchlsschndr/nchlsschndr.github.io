const display = document.querySelector('#display');
const keys = document.querySelector('.pad');

let currentNum = '';
let tempNum = null;
let activeOperator = '';
let result = null;

keys.addEventListener('click', (event) => {
    // event delegation
    if (event.target.matches('button')) {
        const key = event.target.dataset.key;
        handleClick(key);
    }
});

function handleClick(key) {
    // check if key is a number
    if (/[0-9]/.test(key)) {
        // empty everything after there was a previous operation to start over
        if (result) {
            currentNum = '';
            result = null;
            updateDisplay('0');
        }
        currentNum += parseInt(key, 10);
        updateDisplay(currentNum);
    }

    if (key === 'comma') {
        // dont set comma if there is a comma already or currentNum is empty
        if (currentNum.indexOf('.') > -1 || currentNum.length === 0) {
            return;
        }
        currentNum += '.';
        updateDisplay(currentNum);
    }

    if (key === 'allClear') {
        currentNum = '';
        tempNum = null;
        result = null;
        setOperator('reset');
        updateDisplay('0');
    }

    if (key === 'clear') {
        currentNum = '';
        updateDisplay('0');
    }

    // Operators
    if (key === 'plus' || key === 'minus' || key === 'divide' || key === 'multiply') {
        // calculate if a calculation is due
        if (currentNum.length > 0 && tempNum !== null) {
            equals();
        }
        setOperator(key);
    }

    if (key === 'equals') {
        equals();
    }

    // debug
    document.querySelector('.temp-num').textContent = `-------tempNum: ${tempNum}`;
    document.querySelector('.active-operator').textContent = `activeOperator: '${activeOperator}'`;
    document.querySelector('.current-num').textContent = `----currentNum: '${currentNum}'`;
    document.querySelector('.result').textContent = `--------result: ${result}`;
}

function updateDisplay(value) {
    if (value.length > 12) {
        display.textContent = value.substring(0, 10) + '..';
        return;
    }
    display.textContent = value;
}

function setOperator(operator) {
    const buttons = document.querySelectorAll('button[data-key-type="operator"]');

    buttons.forEach((el) => {
        el.classList.remove('active');
    });

    if (operator === 'reset') {
        activeOperator = '';
        return;
    }

    if (currentNum !== '') {
        // only switch numbers if no operator set
        // with this you can change operator after currentNum is set
        if (!activeOperator) {
            tempNum = parseFloat(currentNum);
            currentNum = '';
        }

        activeOperator = operator;

        const button = document.querySelector(`button[data-key="${operator}"]`);
        button.classList.add('active');
    }
}

function equals() {
    if (tempNum !== null && currentNum.length > 0) {
        if (activeOperator === 'divide' && currentNum === '0') {
            updateDisplay('Err: DIV/0!');
            currentNum = '';
            return;
        }
        result = calculate(tempNum, activeOperator, parseFloat(currentNum));
        tempNum = null;
        currentNum = result.toString(); // calculate with in the next step
        setOperator('reset');
        updateDisplay(currentNum);
    }
}

function calculate(one, operator, two) {
    // Big.js for calculating with floats
    // https://github.com/MikeMcl/big.js/
    const x = new Big(one);
    const y = new Big(two);

    switch (operator) {
        case 'plus':
            return x.plus(y);
        case 'minus':
            return x.minus(y);
        case 'divide':
            return x.div(y);
        case 'multiply':
            return x.times(y);
        default:
            return 'operator error';
    }
}

// Keyboard functionality
document.onkeydown = (event) => {
    const key = String.fromCharCode(event.keyCode);
    const keyCode = event.keyCode;

    if (/[0-9]/.test(key)) {
        handleClick(key);
    }

    if (keyCode === 110 || keyCode === 188) {
        handleClick('comma');
    }

    if (keyCode === 107 || keyCode === 187) {
        handleClick('plus');
    }

    if (keyCode === 109 || keyCode === 189) {
        handleClick('minus');
    }

    if (keyCode === 111) {
        handleClick('divide');
    }

    if (keyCode === 106) {
        handleClick('multiply');
    }

    if (keyCode === 12 || keyCode === 8) {
        handleClick('clear');
    }

    if (keyCode === 13) {
        handleClick('equals');
    }
};
