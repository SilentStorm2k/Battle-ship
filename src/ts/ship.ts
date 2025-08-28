export class Ship {
    private _len: number;
    private _hp: number;
    private _isSunk: boolean;

    constructor(length: number) {
        this._len = length;
        this._hp = length;
        this._isSunk = false;
    }

    get len() {
        return this._len;
    }

    get hp() {
        return this._hp;
    }

    get isSunk() {
        return this._isSunk;
    }

    hit() {
        this._hp -= 1;
        this._hp = Math.max(0, this._hp);
        if (this._hp === 0) this._isSunk = true;
    }
}
