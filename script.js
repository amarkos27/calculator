function Calculator(){
    this.numbers = ['Clear', 7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'];
    this.operators = ['÷','×','-','+', '='];
    this.screen = document.querySelector('.screen');
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
        this.screen.textContent = this.expression;
    };

    this.evaluate = function(button){
        if(button.textContent === 'Clear'){
            this.expression = '';
        }else if(button.parentNode.classList.contains('numbers')){
            this.expression += button.textContent;
        }else{
            let operatorCheck = /\D/;
            if(this.expression.split().some(char => operatorCheck.test(char))){
                console.log('o');
            }else{
                this.expression += button.textContent;
            }
        }
        this.display();
    };
}

function fill(){
    
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
            calculator.evaluate(button);
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
