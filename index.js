const prompt = require('prompt-sync')();
const MAX_LINE_BET = 3;

const ROWS = COLS = 3;

const SYMBOL_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}

const SYMBOL_VALUE = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}

let balance = 0;

const deposit = () => {
    while (true) {
        const depositValue = parseFloat(prompt('Enter a deposit amount: '));
        
        if(!isNaN(depositValue) && depositValue > 0) {
            return depositValue;
        } 
        console.log('Invalid amount')
    }
}

const getNumberOfLines = () => {
    while (true) {
        const numOfLines = parseInt(prompt('Enter the number of lines (1-3): '));
        
        if(!isNaN(numOfLines) && numOfLines > 0 && numOfLines <= MAX_LINE_BET) {
            return numOfLines;
        } 
        console.log('Invalid number of lines.')
    }
}

const getBet = (lines) => {
    while (true) {
        const bet = parseFloat(prompt('Enter the bet per line: '));
        
        if(!isNaN(bet) && bet > 0 && (bet * lines) <= balance) {
            balance -= (bet * lines);
            return bet;
        } 
        console.log('Invalid bet.')
    }
}

const spin = () => {
    const symbols = Array.from(Object.entries(SYMBOL_COUNT).flatMap(([symbol, count]) => Array(count).fill(symbol)));

    const reels = [];
    for (let i = 0; i < ROWS; i++) {
        reels.push([])
        const reelSymbols = [...symbols];
        for (let j = 0; j < COLS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            reels[i].push(reelSymbols[randomIndex]);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return transpose(reels);
}

const transpose = (reels) => {
    const fixedreels = [];
    
    for (let i = 0; i < ROWS; i++) {
        fixedreels.push([]);
        for (let j = 0; j < COLS; j++) {
            fixedreels[i].push(reels[j][i])
        }
    }
    return fixedreels;
}

const printRows = (reels) => {
    for (const row of reels) {
        let print = '';
        for (const [i, symbol] of row.entries()) {
            print += symbol;
            if (i < row.length - 1) {
                print += ' | ';
            }
        }
        console.log(print);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {

        const symbols = rows[row];
        let isAllSame = true;

        for (let symbol = 1; symbol < symbols.length; symbol++) {
            if (symbols[0] !== symbols[symbol]) {
                isAllSame = false;
                break;
            }
        }

        if (isAllSame) {
            winnings += bet * SYMBOL_VALUE[symbols[0]];
        }
    }
    console.log('You won ', winnings , "EUR")
    balance += winnings;
    console.log('Your balance is ', balance , "EUR")

}

const playAgain = () => {
    const wantoPlayAgain = prompt('Do you want to play again (y/n)? ');
    switch (wantoPlayAgain) {
        case 'y' || 'Y': askDepositAgain();
        break;
        case 'n' || 'N': console.log('Thank you for playing!');
        break;
        default: playAgain();
        break;
    }
}

const askDepositAgain = () => {
    if (balance === 0) {
        balance += deposit();
    } else {
        checkResponse();
    }
    game();
}

const checkResponse = () => {
    const wantToDeposit = prompt('Do you want to deposit more money (y/n)? ');
    switch (wantToDeposit) {
        case 'y' || 'Y': balance += deposit();
        break;
        case 'n' || 'N' : break;
        default: checkResponse(); 
        break;
    }
}
const game = () => {
    const lines = getNumberOfLines();
    
    const bet = getBet(lines);
    
    const reels = spin();
    
    printRows(reels);
    
    getWinnings(reels, bet, lines);
    
    if (balance <= 0) {
        console.log('You ran out of money!')
    }
    playAgain();
}

balance += deposit();
game();