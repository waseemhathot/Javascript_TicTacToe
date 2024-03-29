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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
validateElements(domElements);
disableButton(domElements.historyButton);
function startGame() {
    initGame(domGame, domElements);
}
function resetGame() {
    location.reload();
}
function initGame(gameH, elementsH) {
    disableButton(elementsH.startButton);
    disableButton(elementsH.historyButton);
    var playerName = document.querySelector('#player1-name').value;
    var playerSign = document.querySelector('#player1-sign').value;
    gameH.game.addPlayer(new Player(playerName, playerSign));
    elementsH.header.textContent = playerName + "'s Turn";
    elementsH.header.classList.add('player1-sign--color');
    playerName = document.querySelector('#player2-name').value;
    playerSign = document.querySelector('#player2-sign').value;
    gameH.game.addPlayer(new Player(playerName, playerSign));
    for (var i = 0; i < elementsH.boardTableCells.length; i++) {
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
function addMoveToBoard(gameH, elementsH, cell) {
    elementsH.header.textContent = gameH.game.getPlayers()[(gameH.game.getMoveCounter()) % 2].getName() + "'s Turn";
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
function declareDraw(gameH, elementsH) {
    addDrawHeader(elementsH);
}
function declareWinner(gameH, elementsH, row, col) {
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
        for (var i = 0; i < gameH.game.getRows(); i++) {
            elementsH.boardTable.rows[i].cells[col].classList.add("win-color");
        }
    }
    if (gameH.game.getWinningMove() === WinningMove.row) {
        for (var i = 0; i < gameH.game.getCols(); i++) {
            elementsH.boardTable.rows[row].cells[i].classList.add("win-color");
        }
    }
}
function addWinHeader(elementsH, gameH) {
    elementsH.header.textContent = "Game Over: " + gameH.game.getPlayers()[(gameH.game.getMoveCounter() - 1) % 2].getName() + " WON!";
    elementsH.header.classList.remove("player1-sign--color");
    elementsH.header.classList.remove("player2-sign--color");
    elementsH.header.classList.remove("header-draw--color");
    elementsH.header.classList.add("header-win--color");
}
function addDrawHeader(elementsH) {
    elementsH.header.textContent = "GAME OVER: DRAW!";
    elementsH.header.classList.remove("player1-sign--color");
    elementsH.header.classList.remove("player2-sign--color");
    elementsH.header.classList.remove("header-win--color");
    elementsH.header.classList.add("header-draw--color");
}
function addPlayerHeader(elementsH, playerNum) {
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
        var gameHistory, simGame, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resetBoard(elementsH);
                    gameHistory = gameH.game.getGameHistory();
                    simGame = new Game(3, 3);
                    simGame.addPlayer(gameH.game.getPlayers()[0]);
                    simGame.addPlayer(gameH.game.getPlayers()[1]);
                    _loop_1 = function (i) {
                        var move, cell;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    move = gameHistory[i];
                                    cell = elementsH.boardTable.rows[move.getRow()].cells[move.getCol()];
                                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            setTimeout(function () {
                                                repeatHistory(i, move, simGame, cell, gameH);
                                                resolve();
                                            }, 700);
                                        })];
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
                    return [5 /*yield**/, _loop_1(i)];
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
function resetBoard(elementsH) {
    for (var i = 0; i < elementsH.boardTableCells.length; i++) {
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
function validateElements(elementsH) {
    if (!elementsH.startButton || !elementsH.boardTableCells || !elementsH.boardTable || !elementsH.header || !elementsH.historyButton) {
        throw new Error('one or more of the elements doesnt exist');
    }
}
