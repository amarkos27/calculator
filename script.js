function Calculator(){
    this.numbers = ['Clear', 7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'];
    this.operators = ['÷','×','-','+', '='];
    this.content = document.querySelector('.contentWrapper');
    this.font_size = window.getComputedStyle(this.content).fontSize;
    this.expression = '';

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
    };
    
    this.display = function(){
        if(this.expression != ''){ //Only modify font if expression is not empty
            let num = this.font_size.split('').filter(char => /[\d\.]/.test(char)).join('');
            if(this.content.getBoundingClientRect().width >= 
            this.content.parentNode.getBoundingClientRect().width - 40){
                num *= 0.8;
            }
            this.font_size = `${num}px`;
            this.content.style.fontSize = this.font_size;
        }
        this.content.textContent = this.expression;
    };

    this.handler = function(button){
        if(button.textContent === 'Clear'){
            this.expression = '';
            this.font_size = '50px';
        }else if(button.parentNode.classList.contains('numbers')){
            this.expression += button.textContent;
        }else{ //if button is an operator
            if(this.expression !== ''){
                //Discount first - sign if operand is negative
                let operator = this.expression.split('').find((char, index) => /[÷×\-\+]/.test(char) && index > 0);
                if(operator){
                    this.evaluate(operator);
                }
                if(button.textContent !== '='){
                    this.expression += button.textContent;
                }
            }
        }
        this.display();
    };

    this.evaluate = function(operator){
        let splitPoint = this.expression.split('').findIndex((char, index) => /[÷×\-\+]/.test(char) && index > 0);
        let operands = [this.expression.slice(0, splitPoint), this.expression.slice(splitPoint + 1)];
        console.log(operands);
        switch(operator){
            case '+':
                this.expression = add(operands);
                break;
            case '-':
                this.expression = subtract(operands);
                break;
            case '×':
                this.expression = multiply(operands);
                break;
            case '÷':
                this.expression = divide(operands);
                break;
            default:
                this.expression = 'ERROR';
        }
    };

    function add(operands){
        return String(+operands[0] + +operands[1]);
    }

    function subtract(operands){
        return String(operands[0] - operands[1]);
    }

    function multiply(operands){
        return String(operands[0] * operands[1]);
    }

    function divide(operands){
        return String(operands[0] / operands[1]);
    }
}
function Button(button){
    this.div = document.createElement('div');
    this.div.textContent = button;
    
    this.div.addEventListener('mousedown', mousedown);

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
        e.target.addEventListener('mouseenter', mouseenter);
    }

    function mouseenter(e){
        e.target.classList.toggle('down');
    }

    function removeListeners(button){
        button.removeEventListener('mouseleave', mouseleave);
        button.removeEventListener('mouseenter', mouseenter);
    }

    return this.div;
}

let calculator = new Calculator();
calculator.fill();