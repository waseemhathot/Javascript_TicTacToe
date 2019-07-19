var WinningMove;
(function (WinningMove) {
    WinningMove[WinningMove["diagLeft"] = 0] = "diagLeft";
    WinningMove[WinningMove["diagRight"] = 1] = "diagRight";
    WinningMove[WinningMove["col"] = 2] = "col";
    WinningMove[WinningMove["row"] = 3] = "row";
})(WinningMove || (WinningMove = {}));
;
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["inProgress"] = 0] = "inProgress";
    GameStatus[GameStatus["Completed"] = 1] = "Completed";
})(GameStatus || (GameStatus = {}));
;
var Move = /** @class */ (function () {
    function Move(row, col) {
        this.row = row;
        this.col = col;
    }
    Move.prototype.getRow = function () {
        return this.row;
    };
    Move.prototype.getCol = function () {
        return this.col;
    };
    Move.prototype.getMoveString = function () {
        return "(" + this.row + ", " + this.col + ")";
    };
    return Move;
}());
var Player = /** @class */ (function () {
    function Player(name, role) {
        this.name = name;
        this.role = role;
    }
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.getRole = function () {
        return this.role;
    };
    return Player;
}());
var Board = /** @class */ (function () {
    function Board(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.gameBoard = [];
        for (var i = 0; i < rows; i++) {
            this.gameBoard[i] = [];
            for (var j = 0; j < cols; j++) {
                this.gameBoard[i][j] = ' ';
            }
        }
    }
    Board.prototype.print = function () {
        for (var i = 0; i < this.gameBoard.length; i++) {
            var line = "|";
            for (var j = 0; j < this.gameBoard[0].length; j++) {
                line += this.gameBoard[i][j].toUpperCase() + "|";
            }
            console.log(line);
        }
    };
    return Board;
}());
var Game = /** @class */ (function () {
    function Game(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.gameWon = false;
        this.gameHistory = [];
        this.gameWinner = '';
        this.players = [];
        this.moveCounter = 0;
        this.board = new Board(rows, cols);
        this.status = GameStatus.inProgress;
    }
    Game.prototype.addPlayer = function (player) {
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
    };
    Game.prototype.nextMove = function (row, col) {
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
    };
    Game.prototype.isWinningMove = function (row, col) {
        var moveRole = this.board.gameBoard[row][col];
        if (this.checkRow(row, col, this, moveRole)) {
            this.winningMove = WinningMove.row;
            return true;
        }
        if (this.checkCol(row, col, this, moveRole)) {
            this.winningMove = WinningMove.col;
            return true;
        }
        if (this.checkDiagLeft(row, col, this, moveRole)) {
            this.winningMove = WinningMove.diagLeft;
            return true;
        }
        if (this.checkDiagRight(row, col, this, moveRole)) {
            this.winningMove = WinningMove.diagRight;
            return true;
        }
        return false;
    };
    Game.prototype.printSummary = function () {
        if (this.gameWon) {
            console.log(GameStatus[this.status] + " - " + this.gameWinner + " Won");
        }
        else if (this.moveCounter === this.rows * this.cols) {
            console.log(GameStatus[this.status] + " - Draw");
        }
        else {
            console.log(GameStatus[this.status] + " - Game is in progress");
        }
        for (var i = 0; i < this.moveCounter; i++) {
            if (i % 2 === 0) {
                console.log(this.players[0].getName() + " drew " + this.players[0].getRole() + " in " + this.gameHistory[i].getMoveString());
            }
            else {
                console.log(this.players[1].getName() + " drew " + this.players[1].getRole() + " in " + this.gameHistory[i].getMoveString());
            }
        }
    };
    Game.prototype.checkDiagLeft = function (row, col, game, moveRole) {
        var counter = 1;
        for (var i = row, j = col; i + 1 < game.getRows() && j + 1 < game.getCols(); i++, j++) {
            if (game.board.gameBoard[i + 1][i + 1] === moveRole) {
                counter++;
            }
        }
        for (var i = row, j = col; i - 1 >= 0 && j - 1 >= 0; i--, j--) {
            if (game.board.gameBoard[i - 1][j - 1] === moveRole) {
                counter++;
            }
        }
        if (counter === game.getRows()) {
            return true;
        }
        return false;
    };
    Game.prototype.checkDiagRight = function (row, col, game, moveRole) {
        var counter = 1;
        for (var i = row, j = col; i + 1 < game.getRows() && j - 1 >= 0; i++, j--) {
            if (game.board.gameBoard[i + 1][j - 1] === moveRole) {
                counter++;
            }
        }
        for (var i = row, j = col; i - 1 >= 0 && j + 1 < game.getCols(); i--, j++) {
            if (game.board.gameBoard[i - 1][j + 1] === moveRole) {
                counter++;
            }
        }
        if (counter === game.getRows()) {
            return true;
        }
        return false;
    };
    Game.prototype.checkCol = function (row, col, game, moveRole) {
        var counter = 0;
        for (var j = 0; j < game.getRows(); j++) {
            if (game.board.gameBoard[j][col] === moveRole) {
                counter++;
            }
        }
        if (counter === game.getRows()) {
            return true;
        }
        return false;
    };
    Game.prototype.checkRow = function (row, col, game, moveRole) {
        var counter = 0;
        for (var i = 0; i < game.getCols(); i++) {
            if (game.board.gameBoard[row][i] === moveRole) {
                counter++;
            }
        }
        if (counter === game.getRows()) {
            return true;
        }
        return false;
    };
    Game.prototype.getGameHistory = function () {
        return this.gameHistory;
    };
    Game.prototype.getMoveCounter = function () {
        return this.moveCounter;
    };
    Game.prototype.getPlayers = function () {
        return this.players;
    };
    Game.prototype.getGameWon = function () {
        return this.gameWon;
    };
    Game.prototype.getRows = function () {
        return this.rows;
    };
    Game.prototype.getCols = function () {
        return this.cols;
    };
    Game.prototype.getWinningMove = function () {
        return this.winningMove;
    };
    return Game;
}());
var game = new Game(3, 3); // rows count, cols count
game.addPlayer(new Player('John Doe', 'x'));
game.addPlayer(new Player('Jason Bourne', 'o'));
game.board.print(); // simple console.log is fine (prints empty board)
console.log(GameStatus[game.status]); // game status - InProgress/Completed (enum)
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
