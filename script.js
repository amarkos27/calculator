let numbers = ['Clear', 7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'];
let operators = ['÷','×','-','+', '='];
operators.forEach(operator => {
    let button= document.createElement('div');
    button.textContent = operator;
    document.querySelector('.operators').appendChild(button);
});
numbers.forEach(number => {
    let button = document.createElement('div');
    button.textContent = number;
    if(button.textContent === 'Clear'){
        button.style.gridColumn = '1/4';
    }
    button.classList.add(number);
    document.querySelector('.numbers').appendChild(button);
});
