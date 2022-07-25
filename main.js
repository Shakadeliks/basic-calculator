(function () {
    let calculator = {
        displayValue: [''],
        init: async function () {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function () {
            this.calcBody = document.querySelector('main');
            this.allBtns = document.querySelectorAll('button');
            this.digits = document.getElementById('digits_section');
            this.display = document.getElementById('display');
            this.clear = document.querySelector('#clear');
            this.delete = document.querySelector('#delete');
        },
        displayBtns: function () {
            const values = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, '.', '%'];
            const btns = values.map(item =>
                `
                    <button class="digit_btn" value=${item}>
                        ${item}
                    </button>
                `
            );
            this.digits.innerHTML = btns.join('');                
        },
        updateDisplay: function (e) {
            let closestBtn = e.target.closest('button');
            const autoEqual = this.displayValue.includes("+")
                || this.displayValue.includes("-")
                || this.displayValue.includes("*")
                || this.displayValue.includes("/");
                //if else check for digit buttons
            if (
                (closestBtn.classList.contains('digit_btn'))
                && (closestBtn.value !== '.')
                && (!closestBtn.classList.contains('operation_btn'))
            ) {
                this.displayValue.push(closestBtn.value);
                this.display.innerHTML = this.displayValue.join('');
            } else if (closestBtn.classList.contains('operation_btn')) {
                //check for operate function to be called when 2nd operator pressed
                if (!autoEqual) {
                    this.displayValue.push(closestBtn.value);
                    this.display.innerHTML = this.displayValue.join(''); 
                } else if (autoEqual) {
                    this.operate([this.displayValue]);
                }
            }
            if (
                (closestBtn.value === '.')
                && (this.displayValue.indexOf(closestBtn.value) === -1)
            ) {
                //check to disable more than one "." ot be added 
                this.displayValue.push(closestBtn.value);
                this.display.innerHTML = this.displayValue.join('');
            } else if (
                (closestBtn.value === '.')
                && (this.displayValue.indexOf(closestBtn.value) === 1)
            ) {
                return;
            }
            //check for clear or delete button 
            if (closestBtn.value === 'clear') {
                this.displayValue = [''];
                this.display.innerHTML = this.displayValue.join('');
            } else if (closestBtn.value === 'delete') {
                this.displayValue.pop();
                this.display.innerHTML = this.displayValue.join('');
            }
            //check for equal button
            if ((closestBtn.id === "equal")) {
                this.operate(this.displayValue);
            }
        },
        operate: async function (enteredValue) {
            const newString = enteredValue.join('')
            let expression = await newString.split(/(\d+\.?\d*)/).filter(e => e);
            let [num1, operator, num2] = await expression;
            num1 = parseFloat(num1);
            num2 = parseFloat(num2)
            const operators = {
                "+": "add",
                "-": "subtract",
                "*": "multiply",
                "/": "divide"
            }
            operation = operators[operator];
            const actions = {
                add: (a, b) => a + b,
                subtract: (a, b) => a - b,
                multiply: (a, b) => a * b,
                divide: (a, b) => {
                    if ((a == 0) || (b == 0)) {
                        return "invalid"        
                    } else {
                        return a / b
                    }
                },
            };
            const answer = await actions[operation]?.(num1, num2);
            if (answer == "invalid") {
                alert("division by 0 is invalid, please provide a valid equation");
                this.displayValue = [''];
                this.display.innerHTML = this.displayValue.join('');
            } else {
                this.displayValue = [''];
                this.displayValue.push(answer);
                this.display.innerHTML = this.displayValue.join('');
            }
        },
        bindEvents: function () {
            this.calcBody.addEventListener('click', this.updateDisplay.bind(this))
        }
    }
    calculator.init();
    window.onload = calculator.displayBtns();
})();