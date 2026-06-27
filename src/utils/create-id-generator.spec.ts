import { createIdGenerator } from "./create-id-generator";

describe("createIdGenerator", () => {
  it("should generate unique IDs on each call", () => {
    const idGenerator = createIdGenerator();
    const id1 = idGenerator();
    const id2 = idGenerator();

    expect(id1).not.toBe(id2);
  });

  it("should generate valid ULID-formatted strings", () => {
    const idGenerator = createIdGenerator();
    const id = idGenerator();

    // ULID format: 26 alphanumeric characters
    expect(typeof id).toBe("string");
    expect(id.length).toBe(26);
    // ULID uses base32 encoding: only characters 0-9, A-Z (no I, L, O, U)
    expect(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(id)).toBe(true);
  });

  it("should generate different IDs on subsequent calls", () => {
    const idGenerator = createIdGenerator();
    const ids = new Set([
      idGenerator(),
      idGenerator(),
      idGenerator(),
      idGenerator(),
      idGenerator(),
    ]);

    expect(ids.size).toBe(5);
  });
});
