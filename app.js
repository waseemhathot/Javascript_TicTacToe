var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        var i, j;
        for (i = 0; i < rows; i++) {
            this.gameBoard[i] = [];
            for (j = 0; j < cols; j++) {
                this.gameBoard[i][j] = ' ';
            }
        }
    }
    Board.prototype.print = function () {
        var i, j;
        for (i = 0; i < this.gameBoard.length; i++) {
            var line = "|";
            for (j = 0; j < this.gameBoard[0].length; j++) {
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
        this.gameHistory[this.moveCounter - 1] = [];
        this.gameHistory[this.moveCounter - 1][0] = row;
        this.gameHistory[this.moveCounter - 1][1] = col;
        return true;
    };
    Game.prototype.isWinningMove = function (row, col) {
        var moveRole = this.board.gameBoard[row][col];
        var rowCheck = 0;
        var colCheck = 0;
        var i, j;
        if (checkRow(row, col, this, moveRole)) {
            this.winningMove = WinningMove.row;
            return true;
        }
        if (checkCol(row, col, this, moveRole)) {
            this.winningMove = WinningMove.col;
            return true;
        }
        if (checkDiagLeft(row, col, this, moveRole)) {
            this.winningMove = WinningMove.diagLeft;
            return true;
        }
        if (checkDiagRight(row, col, this, moveRole)) {
            this.winningMove = WinningMove.diagRight;
            return true;
        }
        return false;
    };
    Game.prototype.printSummary = function () {
        var i;
        for (i = 0; i < this.moveCounter; i++) {
            if (i % 2 === 0) {
                console.log(this.players[0].getName() + " drew " + this.players[0].getRole() + " in " + this.gameHistory[i]);
            }
            else {
                console.log(this.players[1].getName() + " drew " + this.players[1].getRole() + " in " + this.gameHistory[i]);
            }
        }
        if (this.gameWon) {
            console.log("(Game Over, " + this.gameWinner + " Won)");
        }
    };
    return Game;
}());
function checkDiagLeft(row, col, game, moveRole) {
    var counter = 1;
    var i, j;
    for (i = row, j = col; i + 1 < game.getRows() && j + 1 < game.getCols(); i++, j++) {
        if (game.board.gameBoard[i + 1][i + 1] === moveRole) {
            counter++;
        }
    }
    for (i = row, j = col; i - 1 >= 0 && j - 1 >= 0; i--, j--) {
        if (game.board.gameBoard[i - 1][j - 1] === moveRole) {
            counter++;
        }
    }
    if (counter === game.getRows()) {
        return true;
    }
    return false;
}
function checkDiagRight(row, col, game, moveRole) {
    var counter = 1;
    var i, j;
    for (i = row, j = col; i + 1 < game.getRows() && j - 1 >= 0; i++, j--) {
        if (game.board.gameBoard[i + 1][j - 1] === moveRole) {
            counter++;
        }
    }
    for (i = row, j = col; i - 1 >= 0 && j + 1 < game.getCols(); i--, j++) {
        if (game.board.gameBoard[i - 1][j + 1] === moveRole) {
            counter++;
        }
    }
    if (counter === game.getRows()) {
        return true;
    }
    return false;
}
function checkCol(row, col, game, moveRole) {
    var j;
    var counter = 0;
    for (j = 0; j < game.getRows(); j++) {
        if (game.board.gameBoard[j][col] === moveRole) {
            counter++;
        }
    }
    if (counter === game.getRows()) {
        return true;
    }
    return false;
}
function checkRow(row, col, game, moveRole) {
    var i;
    var counter = 0;
    for (i = 0; i < game.getCols(); i++) {
        if (game.board.gameBoard[row][i] === moveRole) {
            counter++;
        }
    }
    if (counter === game.getRows()) {
        return true;
    }
    return false;
}
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
var domGame = {
    game: new Game(3, 3)
};
var domElements = {
    startButton: document.querySelector(".start-button"),
    boardTableCells: document.querySelectorAll('.main-content__game-board td'),
    boardTable: document.querySelector(".main-content__game-board"),
    header: document.querySelector(".header h1"),
    historyButton: document.querySelector(".history-button")
};
function startGame() {
    initGame(domGame, domElements);
}
function resetGame() {
    //enableButton(domElements.startButton);
    location.reload();
    // resetBoard(domElements);
    // domGame.game = new Game(3,3);
}
function initGame(gameH, elementsH) {
    disableButton(elementsH.startButton);
    var playerName;
    var playerSign;
    playerName = document.querySelector('#player1-name').value;
    playerSign = document.querySelector('#player1-sign').value;
    gameH.game.addPlayer(new Player(playerName, playerSign));
    elementsH.header.textContent = playerName + "'s Turn";
    elementsH.header.classList.add('player1-sign--color');
    playerName = document.querySelector('#player2-name').value;
    playerSign = document.querySelector('#player2-sign').value;
    gameH.game.addPlayer(new Player(playerName, playerSign));
    var i;
    for (i = 0; i < elementsH.boardTableCells.length; i++) {
        elementsH.boardTableCells[i].addEventListener("click", function () {
            if (gameH.game.getGameWon() === false) {
                var tableRow = (this.parentNode);
                var tableCell = this;
                var row = tableRow.rowIndex;
                var col = tableCell.cellIndex;
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
function addMoveToBoard(gameH, elementsH, cell) {
    elementsH.header.textContent = gameH.game.getPlayers()[(gameH.game.getMoveCounter()) % 2].getName() + "'s Turn";
    if (gameH.game.getMoveCounter() % 2 === 0) {
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
    cell.textContent = gameH.game.getPlayers()[(gameH.game.getMoveCounter() - 1) % 2].getRole();
    cell.classList.add("sign--animate");
    if ((gameH.game.getMoveCounter() - 1) % 2 === 0) {
        cell.classList.add("player1-sign--color");
    }
    else {
        cell.classList.add("player2-sign--color");
    }
}
function declareDraw(gameH, elementsH) {
    elementsH.header.textContent = "GAME OVER: DRAW!";
    elementsH.header.classList.remove("player1-sign--color");
    elementsH.header.classList.remove("player2-sign--color");
    elementsH.header.classList.add("header-draw--color");
    elementsH.header.classList.remove("header-win--color");
}
function declareWinner(gameH, elementsH, row, col) {
    elementsH.header.textContent = "Game Over: " + gameH.game.getPlayers()[(gameH.game.getMoveCounter() - 1) % 2].getName() + " WON!";
    elementsH.header.classList.remove("player1-sign--color");
    elementsH.header.classList.remove("player2-sign--color");
    elementsH.header.classList.add("header-win--color");
    elementsH.header.classList.remove("header-draw--color");
    if (gameH.game.getWinningMove() === WinningMove.diagLeft) {
        domElements.boardTable.rows[0].cells[0].classList.add("win-color");
        domElements.boardTable.rows[1].cells[1].classList.add("win-color");
        domElements.boardTable.rows[2].cells[2].classList.add("win-color");
    }
    if (gameH.game.getWinningMove() === WinningMove.diagRight) {
        domElements.boardTable.rows[0].cells[2].classList.add("win-color");
        domElements.boardTable.rows[1].cells[1].classList.add("win-color");
        domElements.boardTable.rows[2].cells[0].classList.add("win-color");
    }
    if (gameH.game.getWinningMove() === WinningMove.col) {
        var i = void 0;
        for (i = 0; i < gameH.game.getRows(); i++) {
            domElements.boardTable.rows[i].cells[col].classList.add("win-color");
        }
    }
    if (gameH.game.getWinningMove() === WinningMove.row) {
        var i = void 0;
        for (i = 0; i < gameH.game.getCols(); i++) {
            domElements.boardTable.rows[row].cells[i].classList.add("win-color");
        }
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Game History Functions///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function playGameHistory() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    disableButton(domElements.historyButton);
                    return [4 /*yield*/, gameHistory(domGame, domElements)];
                case 1:
                    _a.sent();
                    enableButton(domElements.historyButton);
                    return [2 /*return*/];
            }
        });
    });
}
function gameHistory(gameH, elementsH) {
    return __awaiter(this, void 0, void 0, function () {
        var gameHistory, i, simGame, _loop_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resetBoard(elementsH);
                    gameHistory = gameH.game.getGameHistory();
                    simGame = new Game(3, 3);
                    simGame.addPlayer(gameH.game.getPlayers()[0]);
                    simGame.addPlayer(gameH.game.getPlayers()[1]);
                    _loop_1 = function () {
                        var move, cell, promise;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    move = gameHistory[i];
                                    cell = elementsH.boardTable.rows[move[0]].cells[move[1]];
                                    promise = new Promise(function (resolve, reject) {
                                        setTimeout(function () {
                                            repeatHistory(i, move, simGame, cell, gameH);
                                            resolve();
                                        }, 700);
                                    });
                                    return [4 /*yield*/, promise];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < gameH.game.getGameHistory().length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function repeatHistory(cellIndex, move, simGame, cell, gameH) {
    simGame.nextMove(move[0], move[1]);
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
function resetBoard(elementsH) {
    var i, j;
    for (i = 0; i < elementsH.boardTableCells.length; i++) {
        elementsH.boardTableCells[i].textContent = "";
        elementsH.boardTableCells[i].classList.remove("player1-sign--color");
        elementsH.boardTableCells[i].classList.remove("player2-sign--color");
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
