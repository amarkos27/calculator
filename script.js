let calc = {expression: '0'};
let buttons = document.querySelectorAll('.numbers > div, .operators > div');
let isOperator = /[\+÷\-×]/;
let isNumber = /\d/;
    
buttons.forEach(button => {
    button.addEventListener('mousedown', mousedown);
});

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

    Step 1. Check if first digit in either operand is a 0
    - Call getRecentOperand to get the current operand
    - If first digit in either is a 0, replace it with whatever was just pressed, except for a '.'
      or an operator. If not, add to the end
    Step 2. If button pressed was an operator, check if there was already an operator
    - If there are two operands, evaluate expression and add the recently pressed operator to the
      expression with the results.
    - If there is only one operand, replace the operator with the more recently pressed operator
    Step 3. Do not allow more than one decimal per operand
    - Again, get the most recent operand and check if there is already a decimal. If not, add it.
      If there is, do nothing.
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
        evaluate();
    }
    else{
        calc.expression += pressed;
    }
    console.log(calc.expression);
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
    Handles all mathematical evaluations and returns the result
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
    Uses a mutation observer to then resize the size of the characters to always fit the size of
    the screen
*/