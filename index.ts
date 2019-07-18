
enum WinningMove {diagLeft, diagRight, col, row};   
enum GameStatus {inProgress, Completed};

class Move{
    constructor(private row: number, private col: number){}
    getRow(){
        return this.row;
    }

    getCol(){
        return this.col;
    }

    getMoveString(){
        return `(${this.row}, ${this.col})`
    }
}

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
    private gameHistory: Move[] = [];
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

        this.gameHistory[this.moveCounter - 1] = new Move(row, col);

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
        if(this.gameWon){
            console.log(`${GameStatus[this.status]} - ${this.gameWinner} Won`);            
        }

        else if(this.moveCounter === this.rows * this.cols){
            console.log(`${GameStatus[this.status]} - Draw`);            
        }

        else{
            console.log(`${GameStatus[this.status]} - Game is in progress`);                        
        }
        
        let i;        
        for (i = 0; i < this.moveCounter; i++) {
            if (i % 2 === 0) {
                console.log(`${this.players[0].getName()} drew ${this.players[0].getRole()} in ${this.gameHistory[i].getMoveString()}`)
            }
            else {
                console.log(`${this.players[1].getName()} drew ${this.players[1].getRole()} in ${this.gameHistory[i].getMoveString()}`)
            }
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
