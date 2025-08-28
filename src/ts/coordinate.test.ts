import { Coordinate } from './coordinate';

describe('Coordinate tests', () => {
    test('new coordinate', () => {
        const coord = new Coordinate(0, 0);
        expect(coord.x).toEqual(0);
        expect(coord.y).toEqual(0);
    });

    test('new coordinate 2', () => {
        const coord = new Coordinate(-230, 540);
        expect(coord.x).toEqual(-230);
        expect(coord.y).toEqual(540);
    });

    test('coordinate to string', () => {
        const coord = new Coordinate(-230, 540);
        expect(coord.x).toEqual(-230);
        expect(coord.y).toEqual(540);
        expect(coord.toString()).toEqual('-230,540');
    });
});
