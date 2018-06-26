const {sortTrades} = require("../utils/utilFunc.js");


describe("sorTrades", () => {
    it("returns an array of length 2", () => {
        expect(sortTrades([])).toHaveLength(2);
        expect(sortTrades([{a: 1, b: 2}])).toHaveLength(2);
        expect(sortTrades([{a: 1, b: 2}, {a: 1, b: 2}])).toHaveLength(2);
        expect(sortTrades([{a: 1, b: 2}, {a: 1, b: 2}, {a: 1, b: 2}])).toHaveLength(2);
    });
  
    it("returns false for index 0 if no items with truthy value of 'pending' property exist", () => {
        let expected = [false, expect.anything()];
        expect(sortTrades([])).toEqual(expect.arrayContaining(expected));
        expect(sortTrades([{a: 1, b: 2}, {a: 1, b: 2}, {a: 1, b: 2}])).toEqual(expect.arrayContaining(expected));
        expect(sortTrades([{a: 1, pending: false}, {a: 1, b: 2}, {a: 1, b: 2}])).toEqual(expect.arrayContaining(expected));
    });

    it("returns false for index 1 if array is empty or all items have truthy value of 'pending'", () => {
        let expected = [expect.anything(), false];
        expect(sortTrades([])).toEqual(expect.arrayContaining(expected));
        expect(sortTrades([{a: 1, pending: true}, {a: 1, pending: true}, {a: 1, pending: true}])).toEqual(expect.arrayContaining(expected));
        expect(sortTrades([{a: 1, pending: true}, {a: 1, pending: true}, {a: 1, pending: false}])).not.toEqual(expect.arrayContaining(expected));
    });

    it("returns false for both values if given array has no items", () => {
        let expected = [false, false];
        expect(sortTrades([])).toEqual(expect.arrayContaining(expected));        
    });
    
});