import { Coordinate } from './coordinate';
import { GameBoard } from './gameboard';
import { Ship } from './ship';

describe('GameBoard tests', () => {
    let gameBoard: GameBoard;
    let emptyGameBoard: GameBoard;
    let smallShip: Ship;
    beforeEach(() => {
        gameBoard = new GameBoard(5, 4);
        emptyGameBoard = new GameBoard(2, 3);
        smallShip = new Ship(2);
        gameBoard.placeShip(new Coordinate(1, 1), true, smallShip);
    });
    test('Creating GameBoard of M by N size', () => {
        expect(gameBoard.M).toEqual(5);
        expect(gameBoard.N).toEqual(4);
    });

    test('Placing ships happy path', () => {
        const shipCoordinates = new Map<string, Ship>();
        shipCoordinates.set(new Coordinate(1, 1).toString(), smallShip);
        shipCoordinates.set(new Coordinate(2, 1).toString(), smallShip);
        expect(gameBoard.shipCoordinates).toEqual(shipCoordinates);
    });

    test('Placing ships out of bounds', () => {
        expect(
            gameBoard.placeShip(new Coordinate(-1, -1), true, smallShip),
        ).toBe(false);
        expect(gameBoard.placeShip(new Coordinate(5, 5), true, smallShip)).toBe(
            false,
        );
        expect(gameBoard.placeShip(new Coordinate(2, 2), true, smallShip)).toBe(
            true,
        );
    });

    test('Receive attack', () => {
        const shipCoordinates = new Map<string, Ship>();
        shipCoordinates.set(new Coordinate(1, 1).toString(), smallShip);
        shipCoordinates.set(new Coordinate(2, 1).toString(), smallShip);
        expect(gameBoard.shipCoordinates).toEqual(shipCoordinates);

        gameBoard.receiveAttack(new Coordinate(1, 1));
        expect(smallShip.hp).toEqual(1);
        shipCoordinates.delete(new Coordinate(1, 1).toString());
        expect(gameBoard.shipCoordinates).toEqual(shipCoordinates);
    });

    test('All ships sunk?', () => {
        expect(emptyGameBoard.isGameOver).toBe(true);
        expect(gameBoard.isGameOver).toBe(false);
        gameBoard.receiveAttack(new Coordinate(1, 1));
        expect(gameBoard.isGameOver).toBe(false);
        gameBoard.receiveAttack(new Coordinate(2, 1));
        expect(gameBoard.isGameOver).toBe(true);
    });

    test('Missed ship shots', () => {
        const missedShots = new Set<string>();
        expect(gameBoard.missedShots).toEqual(missedShots);
        gameBoard.receiveAttack(new Coordinate(2, 2));
        missedShots.add(new Coordinate(2, 2).toString());
        expect(gameBoard.missedShots).toEqual(missedShots);

        gameBoard.receiveAttack(new Coordinate(2, 2));
        missedShots.add(new Coordinate(2, 2).toString());
        expect(gameBoard.missedShots).toEqual(missedShots);

        gameBoard.receiveAttack(new Coordinate(2, 3));
        missedShots.add(new Coordinate(2, 3).toString());
        expect(gameBoard.missedShots).toEqual(missedShots);
    });

    test('Placing new ship on existing ship location does not place ship', () => {
        expect(
            gameBoard.placeShip(new Coordinate(2, 2), false, smallShip),
        ).toBe(true);
        expect(
            gameBoard.placeShip(new Coordinate(2, 2), false, smallShip),
        ).toBe(false);
    });

    test('Receive attack returns true if hit registered, false otherwise', () => {
        gameBoard.placeShip(new Coordinate(3, 2), false, smallShip);
        expect(gameBoard.receiveAttack(new Coordinate(3, 2))).toBe(true);
        expect(gameBoard.receiveAttack(new Coordinate(3, 1))).toBe(false);
        expect(gameBoard.receiveAttack(new Coordinate(3, 4))).toBe(false);
        expect(gameBoard.receiveAttack(new Coordinate(3, 3))).toBe(true);
    });
});
