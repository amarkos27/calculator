let calc = {expression: '0'};
let buttons = document.querySelectorAll('.numbers > div, .operators > div');
let screen = document.querySelector('.screen');
let isOperator = /[\+÷\-×]/;
let isNumber = /\d/;
    
buttons.forEach(button => {
    button.addEventListener('mousedown', mousedown);
});

// Event listeners for proper button clicking functionality
function mousedown(e){
    let button = e.target;
    button.classList.toggle('down');
    button.addEventListener('mouseleave', mouseleave);
    window.addEventListener('mouseup', (e) => {
        mouseup(e, button);
    }, {once: true});
}

function mouseleave(e){
    let button = e.target;
    button.classList.toggle('down');
    button.addEventListener('mouseenter', mouseenter, {once: true});
}

function mouseenter(e){
    e.target.classList.toggle('down');
}

//Flow will start here when a button has actually been pressed
function mouseup(e, button){
    removeListeners(button);
    if(e.target.parentNode.parentNode.classList.contains('buttons')){
        e.target.classList.toggle('down');
        validator(e.target.textContent);
    }
}

function removeListeners(button){
    button.removeEventListener('mouseleave', mouseleave);
    button.removeEventListener('mouseenter', mouseenter, {once: true});
}

/* Validator Function
    Is called by mouseup when a button is pressed.
    Will add the pressed character to the expression and evaluate whether any special input cases
    have occured. If so, the proper changes will be made. If not, the display function is called
    to display the current state of the expression
*/
function validator(pressed){
    let recentChar = calc.expression[calc.expression.length - 1]
    if(pressed === 'Clear'){
        calc.expression = '0';
    }
    else if(firstDigitIsZero() && isNumber.test(pressed)){
        if(!getOperator()){
            replace(pressed);
        }else{
            calc.expression += pressed;
        }
    }else if(pressed === '.'){
        //Only add decimal if previous character is a number
        if(!decimalPresent() && isNumber.test(recentChar)){
            calc.expression += '.';
        }else if(isOperator.test(recentChar)){
            calc.expression += '0.'
        }
    }else if(isOperator.test(pressed)){
        if(getOperands().length === 2){
            evaluate();
            calc.expression += pressed;
        }else if(getOperator() && getOperands().length === 1){
            replace(pressed);
        }else{
            calc.expression += pressed;
        }
    }else if(pressed === '='){
        if(getOperands().length === 2){
            evaluate();
        }
        else{
            return;
        }
    }
    else{
        calc.expression += pressed;
    }
    display();
}

function replace(pressed){
    let replace = calc.expression.split('');
    replace[replace.length - 1] = pressed;
    calc.expression = replace.join('');
}

function firstDigitIsZero(){
    let operands = getOperands();
    let recentOperand = operands[operands.length - 1];
    if(recentOperand === '0'){
        return true;
    }else return false;
}

function decimalPresent(){
    let operands = getOperands();
    let recentOperand = operands[operands.length - 1];
    if(recentOperand.includes('.')){
        return true;
    }else return false;
}


function getOperands(){
    let splitPoint = 0;;
    for(let i = 1; i < calc.expression.length; i++){
        if(isOperator.test(calc.expression[i])){
            splitPoint = i;
            let operands = [];
            operands[0] = calc.expression.slice(0, splitPoint);
            operands[1] = calc.expression.slice(splitPoint + 1);
            return operands.filter(element => element !== '');
        }
    }
    return [calc.expression];
}

function getOperator(){
    for(let i = 1; i < calc.expression.length; i++){
        if(isOperator.test(calc.expression[i])){
            return calc.expression[i];
        }
    }
    return false;
}

/* Evaluate function
    Handles all mathematical evaluations and adds result to the expression
*/
function evaluate(){
    let operands = getOperands();
    let operator = getOperator();
    let result = null;
    
    if(operator === '+'){
        result = +operands[0] + +operands[1];
        calc.expression = round(result);
    }else if(operator === '-'){
        result = operands[0] - operands[1];
        calc.expression = round(result);
    }else if(operator === '×'){
        result = operands[0] * operands[1];
        calc.expression = round(result);
    }else if(operator === '÷'){
        result = operands[0] / operands[1];
        calc.expression = round(result);
    }
}

function round(num){
    return String(Math.round((num + Number.EPSILON) * 100000) / 100000);
}

/* Display Function
    Displays the current expression after it has been properly evaluated according to special cases
*/
function display(){
    screen.textContent = calc.expression;
}

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

    while(screen.offsetWidth > screenCover.offsetWidth - 20){
        displaySize -= 1;
        screenCover.style.cssText = 'font-size:' + displaySize + '%';
    }
});

displayObserver.observe(screen, config);
/***************************************/
