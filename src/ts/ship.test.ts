import { Ship } from './ship';

describe('Ship test', () => {
    let myShip: Ship;
    let lowHpShip: Ship;
    beforeEach(() => {
        myShip = new Ship(5);
        lowHpShip = new Ship(1);
    });
    test('ship properties', () => {
        expect(myShip.len).toEqual(5);
        expect(myShip.hp).toEqual(5);
        expect(myShip.isSunk).toBe(false);
    });

    test('hit check', () => {
        myShip.hit();
        expect(myShip.hp).toEqual(4);
    });

    test('hitting a ship with 0 hp does not make -ve hp', () => {
        expect(lowHpShip.hp).toEqual(1);
        lowHpShip.hit();
        expect(lowHpShip.hp).toEqual(0);
        lowHpShip.hit();
        expect(lowHpShip.hp).toEqual(0);
        lowHpShip.hit();
        expect(lowHpShip.hp).toEqual(0);
        lowHpShip.hit();
    });

    test('ship with 0 hp is sunk', () => {
        expect(lowHpShip.hp).toEqual(1);
        expect(lowHpShip.isSunk).toBe(false);
        lowHpShip.hit();
        expect(lowHpShip.hp).toEqual(0);
        expect(lowHpShip.isSunk).toBe(true);
        lowHpShip.hit();
        expect(lowHpShip.isSunk).toBe(true);
    });
});
