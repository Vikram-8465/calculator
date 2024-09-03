import { LightningElement } from 'lwc';
import { buttons } from 'c/scriptUtils';
import sound from '@salesforce/resourceUrl/calculatorSound';
export default class Calculator extends LightningElement {
    buttons = buttons;
    audio;
    _previousOperand = '';
    _currentOperand = '';
    _operation = undefined;

    get previousOperand() {
        if (this._previousOperand === '') return '';
        return this.formatNumber(this._previousOperand) + (this._operation ? ` ${this._operation}` : '');
    }

    get currentOperand() {
        if (this._currentOperand === '') return '';
        return this.formatNumber(this._currentOperand);
    }

    constructor() {
        super();
        this.audio = new Audio(sound);
        this.audio.volume = 0.1; // Reduce the volume to 10%
    }

    playSound() {
        if (this.audio) {
            if (!this.audio.paused) {
                this.audio.pause(); 
                this.audio.currentTime = 0; 
            }
            this.audio.play().catch(error => {
                console.error("Audio play error:", error);
            });
        }
    }


    buttonsHandler(event) {
        this.playSound(); 
        const value = event.target.innerText;
        let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        let operations = ['+', '-', '*', '/'];

        if (value === 'AC') {
            this._currentOperand = '';
            this._previousOperand = '';
            this._operation = undefined;
        } else if (value === 'DEL') {
            this._currentOperand = this._currentOperand.slice(0, -1);
        } else if (operations.includes(value)) {
            this.chooseOperation(value);
        } else if (value === '=') {
            this.compute();
        } else if (value === '.') {
            if (!this._currentOperand.includes('.')) {
                this.appendNumber('.');
            }
        } else if (numbers.includes(value)) {
            this.appendNumber(value);
        }
    }

    appendNumber(number) {
        this._currentOperand += number;
        console.log(number);
        console.log(this._currentOperand);
    }

    chooseOperation(operation) {
        if (this._currentOperand === '') return;
        if (this._previousOperand !== '') {
            this.compute();
        }
        this._operation = operation;
        this._previousOperand = this._currentOperand;
        this._currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this._previousOperand);
        const current = parseFloat(this._currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this._operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }
        this._currentOperand = computation.toString();
        this._operation = undefined;
        this._previousOperand = '';
    }

    formatNumber(number) {
        const [integer, decimal] = number.split('.');
        const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return decimal ? `${formattedInteger}.${decimal}` : (number.includes('.') ? formattedInteger + '.' : formattedInteger);
    }
}
