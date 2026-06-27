import last from "./last";

describe("last", () => {
  it("should return the last element of a non-empty array", () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  it("should return undefined for an empty array", () => {
    expect(last([])).toBeUndefined();
  });

  it("should handle arrays with a single element", () => {
    expect(last([42])).toBe(42);
  });

  it("should work with different data types", () => {
    expect(last(["a", "b", "c"])).toBe("c");
    expect(last([{ id: 1 }, { id: 2 }])).toEqual({ id: 2 });
    expect(last([true, false, true])).toBe(true);
  });

  it("should not modify the original array", () => {
    const arr = [1, 2, 3];
    const result = last(arr);
    expect(arr).toEqual([1, 2, 3]);
    expect(result).toBe(3);
  });
});
