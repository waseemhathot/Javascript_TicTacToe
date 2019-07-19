type gameHolder = {
    game: Game
}

const domGame: gameHolder = {
    game: new Game(3, 3),
};

type domElementsHolder = {
    startButton: HTMLElement,
    boardTableCells: NodeList,
    boardTable: HTMLTableElement,
    header: HTMLElement,
    historyButton: HTMLElement
}

const domElements: domElementsHolder = {
    startButton: document.querySelector(".start-button") as HTMLElement,
    boardTableCells: document.querySelectorAll('.main-content__game-board td'),
    boardTable: document.querySelector(".main-content__game-board") as HTMLTableElement,
    header: document.querySelector(".header h1") as HTMLElement,
    historyButton: document.querySelector(".history-button") as HTMLElement
};

validateElements(domElements);
disableButton(domElements.historyButton);

function startGame() {
    initGame(domGame, domElements);
}


function resetGame() {
    location.reload();
}

function initGame(gameH: gameHolder, elementsH: domElementsHolder) {
    disableButton(elementsH.startButton);
    disableButton(elementsH.historyButton);


    let playerName: string = (<HTMLInputElement>document.querySelector('#player1-name')).value;
    let playerSign: string = (<HTMLInputElement>document.querySelector('#player1-sign')).value;
    gameH.game.addPlayer(new Player(playerName, playerSign));

    elementsH.header.textContent = `${playerName}'s Turn`;
    elementsH.header.classList.add('player1-sign--color');

    playerName = (<HTMLInputElement>document.querySelector('#player2-name')).value;
    playerSign = (<HTMLInputElement>document.querySelector('#player2-sign')).value;
    gameH.game.addPlayer(new Player(playerName, playerSign));
    
    for (let i = 0; i < elementsH.boardTableCells.length; i++) {
        elementsH.boardTableCells[i].addEventListener("click", function () {
            if (gameH.game.getGameWon() === false) {
                const tableRow: HTMLTableRowElement = <HTMLTableRowElement>(this.parentNode);
                const tableCell: HTMLTableCellElement = (<HTMLTableCellElement>this);
                const row: number = tableRow.rowIndex;
                const col: number = tableCell.cellIndex;

                if (gameH.game.nextMove(row, col)) {
                    addMoveToBoard(gameH, elementsH, tableCell);
                }

                if (gameH.game.getMoveCounter() === 9) {
                    declareDraw(gameH, elementsH);
                    enableButton(elementsH.historyButton);
                }

                if (gameH.game.getGameWon() === true) {
                    declareWinner(gameH, elementsH, row, col);
                    enableButton(elementsH.historyButton);
                }
            }
        });
    }
}

function addMoveToBoard(gameH: gameHolder, elementsH: domElementsHolder, cell: HTMLTableCellElement) {
    elementsH.header.textContent = `${gameH.game.getPlayers()[(gameH.game.getMoveCounter()) % 2].getName()}'s Turn`;

    if (gameH.game.getMoveCounter() % 2 === 0) {
        addPlayerHeader(elementsH, 1);
    }
    else {
        addPlayerHeader(elementsH, 2);
    }

    cell.textContent = gameH.game.getPlayers()[(gameH.game.getMoveCounter() - 1) % 2].getRole();
    cell.classList.add("sign--animate");
    if ((gameH.game.getMoveCounter() - 1) % 2 === 0) {
        cell.classList.add("player1-sign--color");
    }
    else {
        cell.classList.add("player2-sign--color");
    }
}

function declareDraw(gameH: gameHolder, elementsH: domElementsHolder) {
    addDrawHeader(elementsH);
}

function declareWinner(gameH: gameHolder, elementsH: domElementsHolder, row: number, col: number) {

    addWinHeader(elementsH, gameH);

    if (gameH.game.getWinningMove() === WinningMove.diagLeft) {
        elementsH.boardTable.rows[0].cells[0].classList.add("win-color");
        elementsH.boardTable.rows[1].cells[1].classList.add("win-color");
        elementsH.boardTable.rows[2].cells[2].classList.add("win-color");
    }

    if (gameH.game.getWinningMove() === WinningMove.diagRight) {
        elementsH.boardTable.rows[0].cells[2].classList.add("win-color");
        elementsH.boardTable.rows[1].cells[1].classList.add("win-color");
        elementsH.boardTable.rows[2].cells[0].classList.add("win-color");
    }

    if (gameH.game.getWinningMove() === WinningMove.col) {
        for (let i = 0; i < gameH.game.getRows(); i++) {
            elementsH.boardTable.rows[i].cells[col].classList.add("win-color");
        }
    }

    if (gameH.game.getWinningMove() === WinningMove.row) {
        for (let i = 0; i < gameH.game.getCols(); i++) {
            elementsH.boardTable.rows[row].cells[i].classList.add("win-color");
        }
    }
}


function addWinHeader(elementsH: domElementsHolder, gameH: gameHolder) {
    elementsH.header.textContent = `Game Over: ${gameH.game.getPlayers()[(gameH.game.getMoveCounter() - 1) % 2].getName()} WON!`;
    elementsH.header.classList.remove("player1-sign--color");
    elementsH.header.classList.remove("player2-sign--color");
    elementsH.header.classList.remove("header-draw--color");
    elementsH.header.classList.add("header-win--color");
}

function addDrawHeader(elementsH: domElementsHolder) {
    elementsH.header.textContent = "GAME OVER: DRAW!";
    elementsH.header.classList.remove("player1-sign--color");
    elementsH.header.classList.remove("player2-sign--color");
    elementsH.header.classList.remove("header-win--color");
    elementsH.header.classList.add("header-draw--color");
}

function addPlayerHeader(elementsH: domElementsHolder, playerNum: number) {
    if (playerNum === 1) {
        elementsH.header.classList.remove("header-win--color");
        elementsH.header.classList.remove("header-draw--color");
        elementsH.header.classList.remove("player2-sign--color");
        elementsH.header.classList.add("player1-sign--color");
    }
    else {
        elementsH.header.classList.remove("header-win--color");
        elementsH.header.classList.remove("header-draw--color");
        elementsH.header.classList.remove("player1-sign--color");
        elementsH.header.classList.add("player2-sign--color");
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Game History Functions///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

async function playGameHistory() {
    disableButton(domElements.historyButton);
    await gameHistory(domGame, domElements);
    enableButton(domElements.historyButton);
}

async function gameHistory(gameH: gameHolder, elementsH: domElementsHolder) {
    resetBoard(elementsH);
    const gameHistory: Move[] = gameH.game.getGameHistory();
    const simGame: Game = new Game(3, 3);
    simGame.addPlayer(gameH.game.getPlayers()[0]);
    simGame.addPlayer(gameH.game.getPlayers()[1]);

    for (let i = 0; i < gameH.game.getGameHistory().length; i++) {
        const move: Move = gameHistory[i];
        const cell: HTMLTableCellElement = elementsH.boardTable.rows[move.getRow()].cells[move.getCol()];
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                repeatHistory(i, move, simGame, cell, gameH);
                resolve();
            }, 700);
        });
    }
}

function repeatHistory(cellIndex: number, move: Move, simGame: Game, cell: HTMLTableCellElement, gameH: gameHolder) {
    simGame.nextMove(move.getRow(), move.getCol());
    cell.textContent = gameH.game.getPlayers()[cellIndex % 2].getRole();
    cell.style.animation = 'none';
    cell.offsetHeight;
    cell.style.animation = null;
    if (cellIndex % 2 === 0) {
        cell.classList.add("player1-sign--color");
    }
    else {
        cell.classList.add("player2-sign--color");
    }
}

function resetBoard(elementsH: domElementsHolder) {
    for (let i = 0; i < elementsH.boardTableCells.length; i++) {
        elementsH.boardTableCells[i].textContent = "";
        (elementsH.boardTableCells[i] as HTMLTableCellElement).classList.remove("player1-sign--color");
        (elementsH.boardTableCells[i] as HTMLTableCellElement).classList.remove("player2-sign--color");
    }
}
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function disableButton(button) {
    button.disabled = true;
    button.classList.remove("button--red-is-border");
    button.classList.add("button--grey-border");
}

function enableButton(button) {
    button.disabled = false;
    button.classList.remove("button--grey-border");
    button.classList.add("button--red-ish-border");
}


function validateElements(elementsH: domElementsHolder){
    if(!elementsH.startButton || !elementsH.boardTableCells || !elementsH.boardTable || !elementsH.header || !elementsH.historyButton){
        throw new Error('one or more of the elements doesnt exist');
    }
}