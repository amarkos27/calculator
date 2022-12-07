function Calculator(){
    this.numbers = ['Clear', 7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'];
    this.operators = ['÷','×','-','+', '='];
    this.expression = '';
    this.screen = document.querySelector('.screen');

    this.fill = function(){
        this.operators.forEach(operator => {
            let button = new Button(operator);
            if(button.textContent === '='){
                button.style.borderRadius = '0 0 10px 0';
            }
            document.querySelector('.operators').appendChild(button);
        });
        this.numbers.forEach(number => {
            let button = new Button(number);
            switch(button.textContent){
                case 'Clear':
                    button.style.gridColumn = '1/4';
                    break;
                case '0':
                    button.style.gridColumn = '1/3';
                    button.style.borderRadius = '0 0 0 10px';
                    break;
            }
            document.querySelector('.numbers').appendChild(button);
        });
    };

    this.add = function(operands){
        return String(Math.round(((+operands[0] + +operands[1]) + Number.EPSILON) * 100000) / 100000);
    }

    this.subtract = function(operands){
        return String(Math.round(((operands[0] - operands[1]) + Number.EPSILON) * 100000) / 100000);
    }

    this.multiply = function(operands){
        return String(Math.round(((operands[0] * operands[1]) + Number.EPSILON) * 100000) / 100000);
    }

    this.divide = function(operands){
        return String(Math.round(((operands[0] / operands[1]) + Number.EPSILON) * 100000) / 100000);
    }
}

let calculator = new Calculator();
calculator.fill();

calculator.display = function(){
    calculator.screen.textContent = calculator.expression;
};

/** Resize font based on window space **/
let screenCover = document.querySelector('.screen-cover');
let displaySize;

let config = {
    attributes: true,
    childList: true,
    characterData: true,
};

let displayObserver = new MutationObserver(function(mutations){
    displaySize = 100;
    screenCover.style.cssText = 'font-size:' + displaySize + '%';

    while(calculator.screen.offsetWidth > screenCover.offsetWidth - 20){
        displaySize -= 1;
        screenCover.style.cssText = 'font-size:' + displaySize + '%';
    }
});

displayObserver.observe(calculator.screen, config);
/***************************************/

calculator.handler = function(button){
    if(button.textContent === 'Clear'){
        calculator.expression = '';
    }else if(button.parentNode.classList.contains('numbers')){
        //Replace content on screen (instead of adding) with number pressed if
        //content on screen is error message or just a 0
        if(calculator.expression === 'ERROR, Divide by 0' || 
        (calculator.getOperands()[0] === '0' && button.textContent !== '.')
        ){
            calculator.expression = button.textContent;
        }else if(calculator.getOperands()[1] === '0' && button.textContent !== '.'){
            //Replace second operand with number pressed if it is a 0 not followed by a decimal
            let replace = calculator.expression.split(calculator.getOperator());
            replace[1] = button.textContent;
            replace = replace.join(calculator.getOperator());
            calculator.expression = replace;
        }
        else{
            //If no special case, add number to expression
            calculator.expression += button.textContent;
        }
    }else{
        let operator = calculator.getOperator();
        if(operator){
            calculator.evaluate(operator);
        }
        if(button.textContent !== '=' && calculator.expression !== ''){
            calculator.expression += button.textContent;
        }

    }
    calculator.display();
};

calculator.evaluate = function(operator){
    let operands = calculator.getOperands();
    switch(operator){
        case '+':
            calculator.expression = calculator.add(operands);
            break;
        case '-':
            calculator.expression = calculator.subtract(operands);
            break;
        case '×':
            calculator.expression = calculator.multiply(operands);
            break;
        case '÷':
            if(operands[1] !== '0'){
                calculator.expression = calculator.divide(operands);
            }else{
                calculator.expression = 'ERROR, Divide by 0'
            }
            break;
        default:
            calculator.expression = 'ERROR';
    }
};

calculator.getOperator = function(){
    return calculator.expression.split('').find((char, index) => /[÷×\-\+]/.test(char) && index > 0);
}

calculator.getOperands = function(){
    let operator = calculator.getOperator();
    let operands = null;
    if(operator){
        //Skip over first - sign if negative
        let splitPoint = calculator.expression.split('')
        .findIndex((char, index) => char === operator && index > 0);

        operands = 
        [calculator.expression.slice(0, splitPoint), calculator.expression.slice(splitPoint + 1)];
    }else{
        operands = calculator.expression;
    }
    return operands;
}

function Button(button){
    this.div = document.createElement('div');
    this.div.textContent = button;
    this.div.addEventListener('mousedown', mousedown);

    return this.div;
}

function mousedown(e){
    let button = e.target;
    button.classList.toggle('down');
    button.addEventListener('mouseleave', mouseleave);
    window.addEventListener('mouseup', (e) => {
        mouseup(e, button);
    }, {once: true});
}

function mouseup(e, button){
    if(e.target.classList.contains('down')){
        e.target.classList.toggle('down');
        calculator.handler(button);
    }
    removeListeners(button);
}

function mouseleave(e){
    e.target.classList.toggle('down');
    e.target.addEventListener('mouseenter', mouseenter, {once: true});
}

function mouseenter(e){
    e.target.classList.toggle('down');
}

function removeListeners(button){
    button.removeEventListener('mouseleave', mouseleave);
}