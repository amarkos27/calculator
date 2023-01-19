function calculator(){
    let calc = {expression: '0'};
    let buttons = document.querySelectorAll('.numbers > div, .operators > div');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', mousedown);
    });
}

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
    }
}

function removeListeners(button){
    button.removeEventListener('mouseleave', mouseleave);
    button.removeEventListener('mouseenter', mouseenter, {once: true});
}

calculator();