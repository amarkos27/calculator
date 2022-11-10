function constructCalculator(){
    let numbers = ['Clear', 7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'];
    let operators = ['÷','×','-','+', '='];
    operators.forEach(operator => {
        let button = document.createElement('div');
        button.textContent = operator;
        if(button.textContent === '='){
            button.style.borderRadius = '0 0 10px 0';
        }
        document.querySelector('.operators').appendChild(button);
    });
    numbers.forEach(number => {
        let button = document.createElement('div');
        button.textContent = number;
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
}

function buttonListeners(){
    let numbers = document.querySelectorAll('.numbers > div');
    let operators = document.querySelectorAll('.operators > div');

    addListeners(numbers);
    addListeners(operators);
}

function addListeners(buttons){
    buttons.forEach(button => button.addEventListener('mousedown', mousedown));
    buttons.forEach(button => button.addEventListener('mouseup', mouseup));
}

function mouseup(e){
    console.log(e.target);
    e.target.classList.toggle('down');
    handler(e.target.textContent);
}

function mousedown(e){
    e.target.classList.toggle('down');
    e.target.addEventListener('mouseleave', mouseleave);
}

function mouseleave(e){

}

function handler(button){
    console.log(button);
}

constructCalculator();
buttonListeners();
