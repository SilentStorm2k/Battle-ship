import { Coordinate } from './coordinate';
import { Ship } from './ship';

export class GameBoard {
    private _M;
    private _N;
    private _shipCoordinates;
    private _isGameOver;
    private _missedShots;

    constructor(m: number, n: number) {
        this._M = m;
        this._N = n;
        this._shipCoordinates = new Map<string, Ship>();
        this._missedShots = new Set<string>();
        this._isGameOver = true;
    }

    get M() {
        return this._M;
    }
    get N() {
        return this._N;
    }
    get shipCoordinates() {
        return this._shipCoordinates;
    }
    get missedShots() {
        return this._missedShots;
    }
    get isGameOver() {
        return this._isGameOver;
    }

    receiveAttack(coord: Coordinate) {
        if (this._shipCoordinates.has(coord.toString())) {
            this._shipCoordinates.get(coord.toString())?.hit();
            this._shipCoordinates.delete(coord.toString());
            if (this._shipCoordinates.size === 0) this._isGameOver = true;
            return true;
        } else {
            this._missedShots.add(coord.toString());
            return false;
        }
    }

    /**
     * Adds ship if within bounds and not overlapping with other ships to the gameBoard
     * @param orientation - True indicates vertical, false indicates horizontal
     * @param coord - X,Y coordinate of ship's center
     * @param ship - The ship to be placed
     * @returns true if ship placed successfully, else false
     */
    placeShip(coord: Coordinate, orientation: boolean, ship: Ship) {
        const x = coord.x;
        const y = coord.y;
        const shipLength = ship.len - 1;
        const shipCoordinates: string[] = [];
        if (orientation) {
            // ship places vertically
            // first check if ship can fit
            if (
                0 <= x &&
                x < this._M &&
                0 <= y &&
                y < this._N &&
                0 <= x - Math.floor(shipLength / 2) &&
                x + Math.ceil(shipLength / 2) < this._M
            ) {
                this._isGameOver = false;
                for (
                    let i = x - Math.floor(shipLength / 2);
                    i <= x + Math.ceil(shipLength / 2);
                    i++
                )
                    shipCoordinates.push(new Coordinate(i, y).toString());
            } else {
                return false;
            }
        } else {
            if (
                0 <= x &&
                x < this._M &&
                0 <= y &&
                y < this._N &&
                0 <= y - Math.floor(shipLength / 2) &&
                y + Math.ceil(shipLength / 2) < this._N
            ) {
                this._isGameOver = false;
                for (
                    let j = y - Math.floor(shipLength / 2);
                    j <= y + Math.ceil(shipLength / 2);
                    j++
                )
                    shipCoordinates.push(new Coordinate(x, j).toString());
            } else {
                return false;
            }
        }
        const isShipNotOverlapping = shipCoordinates.every(
            (ship) => !this.shipCoordinates.has(ship),
        );
        if (isShipNotOverlapping) {
            for (const shipCoord of shipCoordinates)
                this.shipCoordinates.set(shipCoord, ship);
            return true;
        } else {
            return false;
        }
    }
}
