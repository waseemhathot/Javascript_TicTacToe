enum WinningMove {diagLeft, diagRight, col, row};   
enum GameStatus {inProgress, Completed};

class Player {

    constructor(private name: string, private role: string) { }

    getName() {
        return this.name;
    }

    getRole() {
        return this.role;
    }
}

class Board {

    gameBoard: string[][] = [];

    constructor(private rows, private cols) {
        let i, j;
        for (i = 0; i < rows; i++) {
            this.gameBoard[i] = [];
            for (j = 0; j < cols; j++) {
                this.gameBoard[i][j] = ' ';
            }
        }

    }

    print() {
        let i, j;
        for (i = 0; i < this.gameBoard.length; i++) {
            let line = "|";
            for (j = 0; j < this.gameBoard[0].length; j++) {
                line += `${this.gameBoard[i][j].toUpperCase()}|`;
            }
            console.log(line);
        }
    }
}

class Game {

    private players: Player[];
    private gameWon: boolean = false;
    private gameHistory: number[][] = [];
    private moveCounter: number;
    private gameWinner: string = '';
    private winningMove: WinningMove;
    status: GameStatus;
    board: Board;

    constructor(private rows: number, private cols: number) {
        this.players = [];
        this.moveCounter = 0;
        this.board = new Board(rows, cols)
        this.status = GameStatus.inProgress;

    }

    getGameHistory(){
        return this.gameHistory;
    }
    getMoveCounter() {
        return this.moveCounter;
    }

    getPlayers() {
        return this.players;
    }

    getGameWon() {
        return this.gameWon;
    }

    getRows(){
        return this.rows;
    }

    getCols(){
        return this.cols;
    }

    getWinningMove(){
        return this.winningMove;
    }

    addPlayer(player: Player) {

        if (this.players.length === 0) {
            this.players[0] = player;
        }
        else if (this.players.length === 1) {
            if (player.getRole().toLowerCase() === this.players[0].getRole()) {
                throw new Error('This role is already taken');
            }
            else {
                this.players[1] = player;
            }
        }
        else {
            throw new Error('Already reached max count of 2 players');
        }
    }

    nextMove(row: number, col: number): boolean {

        if (this.board.gameBoard[row][col] !== ' ' || this.gameWon) {
            return false;
        }

        this.board.gameBoard[row][col] = this.players[this.moveCounter % 2].getRole();

        this.moveCounter++;
        this.gameWon = this.isWinningMove(row, col);
        if (this.gameWon) {
            this.status = GameStatus.Completed;
            this.gameWinner += this.players[this.moveCounter % 2].getName();
        }

        this.gameHistory[this.moveCounter - 1] = [];
        this.gameHistory[this.moveCounter - 1][0] = row;
        this.gameHistory[this.moveCounter - 1][1] = col;


        return true;

    }

    isWinningMove(row: number, col: number) {
        let moveRole: string = this.board.gameBoard[row][col];
        let rowCheck = 0;
        let colCheck = 0;
        let i, j;

        if(checkRow(row, col, this, moveRole)){
            this.winningMove = WinningMove.row;
            return true;            
        }

        if(checkCol(row, col, this, moveRole)){
            this.winningMove = WinningMove.col;
            return true;            
        }

        if(checkDiagLeft(row, col, this, moveRole)){
            this.winningMove = WinningMove.diagLeft;
            return true;            
        }

        if(checkDiagRight(row, col, this, moveRole)){
            this.winningMove = WinningMove.diagRight;
            return true;            
        }
       
        return false;
    }

    printSummary() {
        let i;
        for (i = 0; i < this.moveCounter; i++) {
            if (i % 2 === 0) {
                console.log(`${this.players[0].getName()} drew ${this.players[0].getRole()} in ${this.gameHistory[i]}`)
            }
            else {
                console.log(`${this.players[1].getName()} drew ${this.players[1].getRole()} in ${this.gameHistory[i]}`)
            }
        }

        if(this.gameWon){
            console.log(`(Game Over, ${this.gameWinner} Won)`);            
        }
    }

}


function checkDiagLeft(row: number, col: number, game: Game, moveRole: string): boolean{
    let counter = 1;
    let i: number, j:number;
    for (i = row, j = col; i + 1 < game.getRows() && j + 1 < game.getCols(); i++ , j++) {
        if (game.board.gameBoard[i + 1][i + 1] === moveRole) {
            counter++;
        }
    }

    for (i = row, j = col; i - 1 >= 0 && j - 1 >= 0; i-- , j--) {
        if (game.board.gameBoard[i - 1][j - 1] === moveRole) {
            counter++;
        }
    }
    if (counter === game.getRows()) {
        return true;
    }

    return false;
}

function checkDiagRight(row: number, col: number, game: Game, moveRole: string): boolean{
    let counter = 1;
    let i: number, j: number;
    for (i = row, j = col; i + 1 < game.getRows() && j - 1 >= 0; i++ , j--) {
        if (game.board.gameBoard[i + 1][j - 1] === moveRole) {
            counter++;
        }
    }

    for (i = row, j = col; i - 1 >= 0 && j + 1 < game.getCols(); i-- , j++) {
        if (game.board.gameBoard[i - 1][j + 1] === moveRole) {
            counter++;
        }
    }

    if (counter === game.getRows()) {
        return true;
    }

    return false;
}

function checkCol(row: number, col: number, game: Game, moveRole: string): boolean{
    let j;
    let counter = 0;
    for (j = 0; j < game.getRows(); j++) {
        if (game.board.gameBoard[j][col] === moveRole) {
            counter++;
        }
    }
    if (counter === game.getRows()) {
        return true;
    }

    return false
}

function checkRow(row: number, col: number, game: Game, moveRole: string): boolean{
    let i;
    let counter = 0;
    for (i = 0; i < game.getCols(); i++) {
        if (game.board.gameBoard[row][i] === moveRole) {
            counter++;
        }
    }
    if (counter === game.getRows()) {
        return true;
    }

    return false
}
    



const game = new Game(3, 3); // rows count, cols count
game.addPlayer(new Player('John Doe', 'x'));
game.addPlayer(new Player('Jason Bourne', 'o'));
game.board.print(); // simple console.log is fine (prints empty board)
console.log(GameStatus[game.status]) // game status - InProgress/Completed (enum)
game.printSummary(); // InProgress - "Game is in progress" + moves history (console.log is fine)
// nextMove - sets the next player's move. The next player is determined by the order they were added
// Returns a boolean - false if the game is over or the cell is already occupied, otherwise true
console.log(game.nextMove(0, 0)); // row, col - sets 'x' in the top left cell, prints true
console.log(game.nextMove(0, 0)); // does nothing and prints false (cell is already occupied)
console.log(game.nextMove(1, 1)); // sets 'o' in the center, prints true
console.log(game.nextMove(0, 2)); // sets 'x' in the top right cell, prints true
console.log(game.nextMove(2, 2)); // sets 'o' in the bottom right cell, prints true
console.log(game.nextMove(0, 1)); // sets 'x' in the top center cell, prints true
console.log(game.nextMove(2, 1)); // does nothing and prints false (Game over, John won)
game.board.print(); // simple console.log is fine
game.printSummary(); // Completed - "John Doe won!" + moves history

///////////////////////////////////////////////////////////////////////////
///////////////////////////////DOM FUNCTIONS//////////////////////////////                  
///////////////////////////////////////////////////////////////////////

type gameHolder = {
    game: Game
}
const domGame: gameHolder = {
    game: new Game(3, 3),
}

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
}

function startGame(){
    initGame(domGame, domElements);
}


function resetGame(){
    //enableButton(domElements.startButton);
    location.reload();
    // resetBoard(domElements);
    // domGame.game = new Game(3,3);
}

function initGame(gameH: gameHolder, elementsH: domElementsHolder) {

    disableButton(elementsH.startButton);
    let playerName: string;
    let playerSign: string;

    playerName = (<HTMLInputElement>document.querySelector('#player1-name')).value;
    playerSign = (<HTMLInputElement>document.querySelector('#player1-sign')).value;
    gameH.game.addPlayer(new Player(playerName, playerSign));

    elementsH.header.textContent = `${playerName}'s Turn`;
    elementsH.header.classList.add('player1-sign--color');
   
    playerName = (<HTMLInputElement>document.querySelector('#player2-name')).value;
    playerSign = (<HTMLInputElement>document.querySelector('#player2-sign')).value;
    gameH.game.addPlayer(new Player(playerName, playerSign));

   
    let i: number;
    for (i = 0; i < elementsH.boardTableCells.length; i++) {
        elementsH.boardTableCells[i].addEventListener("click", function () {
            if (gameH.game.getGameWon() === false) {
                let tableRow: HTMLTableRowElement = <HTMLTableRowElement>(this.parentNode);
                let tableCell: HTMLTableCellElement = (<HTMLTableCellElement>this);
                let row: number = tableRow.rowIndex;
                let col: number = tableCell.cellIndex;

                if (gameH.game.nextMove(row, col)) {
                    addMoveToBoard(gameH, elementsH, tableCell);
                }

                if (gameH.game.getMoveCounter() === 9) {
                    declareDraw(gameH, elementsH);
                }

                if (gameH.game.getGameWon() === true) {
                    declareWinner(gameH, elementsH, row, col);    
                }
            }
        });
    }

}

function addMoveToBoard(gameH: gameHolder, elementsH: domElementsHolder, cell: HTMLTableCellElement){
    elementsH.header.textContent = `${gameH.game.getPlayers()[(gameH.game.getMoveCounter()) % 2].getName()}'s Turn`;                    
    if(gameH.game.getMoveCounter() % 2 === 0){
        elementsH.header.classList.remove("header-win--color");    
        elementsH.header.classList.remove("header-draw--color"); 
        elementsH.header.classList.remove("player2-sign--color");                                
        elementsH.header.classList.add("player1-sign--color");        
    }
       
    else{
        elementsH.header.classList.remove("header-win--color");    
        elementsH.header.classList.remove("header-draw--color"); 
        elementsH.header.classList.remove("player1-sign--color");                                
        elementsH.header.classList.add("player2-sign--color");   
    }

    cell.textContent = gameH.game.getPlayers()[(gameH.game.getMoveCounter() - 1) % 2].getRole();
    cell.classList.add("sign--animate");
    if((gameH.game.getMoveCounter() - 1) % 2 === 0){
        cell.classList.add("player1-sign--color");
    }
    else{
        cell.classList.add("player2-sign--color");                        
    }
}

function declareDraw(gameH: gameHolder, elementsH: domElementsHolder){
    elementsH.header.textContent = "GAME OVER: DRAW!";
    elementsH.header.classList.remove("player1-sign--color");                                
    elementsH.header.classList.remove("player2-sign--color");                                
    elementsH.header.classList.add("header-draw--color");
    elementsH.header.classList.remove("header-win--color");
}

function declareWinner(gameH: gameHolder, elementsH: domElementsHolder, row: number, col: number){
    elementsH.header.textContent = `Game Over: ${gameH.game.getPlayers()[(gameH.game.getMoveCounter() - 1) % 2].getName()} WON!`;
    elementsH.header.classList.remove("player1-sign--color");                                
    elementsH.header.classList.remove("player2-sign--color");                                    
    elementsH.header.classList.add("header-win--color");
    elementsH.header.classList.remove("header-draw--color");

    
    if(gameH.game.getWinningMove() === WinningMove.diagLeft){
        domElements.boardTable.rows[0].cells[0].classList.add("win-color");
        domElements.boardTable.rows[1].cells[1].classList.add("win-color");
        domElements.boardTable.rows[2].cells[2].classList.add("win-color");
    }

    if(gameH.game.getWinningMove() === WinningMove.diagRight){
        domElements.boardTable.rows[0].cells[2].classList.add("win-color");
        domElements.boardTable.rows[1].cells[1].classList.add("win-color");
        domElements.boardTable.rows[2].cells[0].classList.add("win-color");
    }

    if(gameH.game.getWinningMove() === WinningMove.col){
        let i;
        for(i = 0; i < gameH.game.getRows(); i++){
            domElements.boardTable.rows[i].cells[col].classList.add("win-color");                            
        }
    }

    if(gameH.game.getWinningMove() === WinningMove.row){
        let i;
        for(i = 0; i < gameH.game.getCols(); i++){
            domElements.boardTable.rows[row].cells[i].classList.add("win-color");                            
        }
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Game History Functions///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

async function playGameHistory(){
    disableButton(domElements.historyButton);
    await gameHistory(domGame, domElements);
    enableButton(domElements.historyButton);
}

async function gameHistory(gameH: gameHolder, elementsH: domElementsHolder){
    resetBoard(elementsH);
    const gameHistory: number[][] = gameH.game.getGameHistory();
    let i; 
    let simGame: Game = new Game(3,3);
    simGame.addPlayer(gameH.game.getPlayers()[0]);
    simGame.addPlayer(gameH.game.getPlayers()[1])
    for(i = 0; i < gameH.game.getGameHistory().length; i++){
        const move: number[] = gameHistory[i];
        const cell: HTMLTableCellElement = elementsH.boardTable.rows[move[0]].cells[move[1]];
        let promise =  new Promise((resolve, reject)=>{
             setTimeout(() => {
                repeatHistory(i, move, simGame, cell, gameH);        
                resolve();
             }, 700);  
        });
        await promise;
    }
}

function repeatHistory(cellIndex: number, move: number[], simGame: Game, cell: HTMLTableCellElement, gameH: gameHolder){

    simGame.nextMove(move[0], move[1]);
    cell.textContent = gameH.game.getPlayers()[cellIndex%2].getRole();
    cell.style.animation = 'none';
    cell.offsetHeight;
    cell.style.animation = null;
    if(cellIndex%2 === 0){
        cell.classList.add("player1-sign--color");
    }
    else{
        cell.classList.add("player2-sign--color");             
    }
}

function resetBoard(elementsH: domElementsHolder){
    let i, j;
    for(i = 0; i < elementsH.boardTableCells.length; i++){
        elementsH.boardTableCells[i].textContent = "";
        (elementsH.boardTableCells[i] as HTMLTableCellElement).classList.remove("player1-sign--color");
        (elementsH.boardTableCells[i] as HTMLTableCellElement).classList.remove("player2-sign--color");
    }
}
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function disableButton(button){
    button.disabled = true;    
    button.classList.remove("button--red-is-border");
    button.classList.add("button--grey-border");
}

function enableButton(button){
    button.disabled = false;    
    button.classList.remove("button--grey-border");
    button.classList.add("button--red-ish-border");
}