import { GameBoard } from './gameboard';

export class Player {
    private _name;
    private _isAi;
    private _gameBoard;

    constructor(name: string, isAi: boolean = false) {
        this._name = name;
        this._isAi = isAi;
        this._gameBoard = new GameBoard(10, 10);
    }

    get name() {
        return this._name;
    }
    get isAi() {
        return this._isAi;
    }

    get gameBoard() {
        return this._gameBoard;
    }
}
