const {createTestUsers} = require("../utils/utilFunc.js");

let users = createTestUsers();

describe("createTestUser", () => {
    test("has 5 items", () => {
        expect(users).toHaveLength(5);
    });
  
    test("items have valid fields", () => {
        for(let i = 1; i < 6; i++) {
            expect(users[i-1]).toMatchObject({
                username: `test${i}`,
                password: "12345", 
                link: expect.any(String)
            });
        }
    });
});