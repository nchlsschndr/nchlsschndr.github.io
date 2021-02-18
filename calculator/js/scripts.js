// TODO:
// -Merge updateDisplay and 'currentNum = xxx'
// -merge ac and C
// -Flexible layout
// Tests!!

const display = document.querySelector('#display');
const keys = document.querySelector('.pad');

let currentNum = '';
let tempNum = null;
let activeOperator = '';
let calcIsDone = false;

keys.addEventListener('click', (event) => {
    // event delegation
    if (event.target.matches('button')) {
        const key = event.target.dataset.key;
        handleClick(key);
    }
});

const handleClick = (key) => {
    // check if key is a number
    if (/[0-9]/.test(key)) {
        // empty everything after there was a previous operation to start over
        if (calcIsDone) {
            currentNum = '';
            calcIsDone = false;
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
        calcIsDone = false;
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

    if (key === 'plusminus') {
        if (currentNum !== '') {
            if (currentNum.indexOf('-') === -1) {
                currentNum = '-' + currentNum;
                updateDisplay(currentNum);
            } else {
                currentNum = currentNum.substring(1);
                updateDisplay(currentNum);
            }
        }
    }

    if (key === 'percentage') {
        if (activeOperator === 'multiply') {
            currentNum = (tempNum / 100) * currentNum;
            calcIsDone = true;
            setOperator('reset');
            updateDisplay(currentNum);
        }

        if (activeOperator === 'plus') {
            currentNum = tempNum + (tempNum / 100) * currentNum;
            calcIsDone = true;
            setOperator('reset');
            updateDisplay(currentNum);
        }

        if (activeOperator === 'minus') {
            currentNum = tempNum - (tempNum / 100) * currentNum;
            calcIsDone = true;
            setOperator('reset');
            updateDisplay(currentNum);
        }
    }

    if (key === 'equals') {
        equals();
    }

    // debug
    document.querySelector('.temp-num').textContent = `-------tempNum: ${tempNum}`;
    document.querySelector('.active-operator').textContent = `activeOperator: '${activeOperator}'`;
    document.querySelector('.current-num').textContent = `----currentNum: '${currentNum}'`;
    document.querySelector('.calc-is-done').textContent = `----calcIsDone: ${calcIsDone}`;
};

const updateDisplay = (value) => {
    if (value.length > 12) {
        display.textContent = value.substring(0, 10) + '..';
        return;
    }
    display.textContent = value;
};

const setOperator = (operator) => {
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
};

const equals = () => {
    if (tempNum !== null && currentNum.length > 0) {
        if (activeOperator === 'divide' && currentNum === '0') {
            currentNum = '';
            updateDisplay('Err: DIV/0!');
            return;
        }
        const result = calculate(tempNum, activeOperator, parseFloat(currentNum));
        currentNum = result.toString(); // calculate with in the next step
        tempNum = null;
        calcIsDone = true;
        setOperator('reset');
        updateDisplay(currentNum);
    }
};

const calculate = (one, operator, two) => {
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
};

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
