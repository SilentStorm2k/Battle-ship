import { Coordinate } from './coordinate';
import { GameBoard } from './gameboard';
import { Player } from './player';
import { Ship } from './ship';

describe('Player tests', () => {
    test('happy path', () => {
        const player1 = new Player('name1', true);
        expect(player1.name).toEqual('name1');
        expect(player1.isAi).toBe(true);
        expect(player1.gameBoard).toBeInstanceOf(GameBoard);
        player1.gameBoard.placeShip(new Coordinate(1, 1), true, new Ship(2));
        expect(player1.gameBoard.isGameOver).toBe(false);
        player1.gameBoard.receiveAttack(new Coordinate(1, 1));
        player1.gameBoard.receiveAttack(new Coordinate(2, 1));
        expect(player1.gameBoard.isGameOver).toBe(true);
    });
});
