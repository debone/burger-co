import { assert } from "../../../common/assert";
import { Vector2 } from "../../../common/helpers";
import { Dispenser } from "./dispenser";

export const dispensers = new Map();

export const firstDispenser = new Vector2(708, 308);

export const dispenserOffset = new Vector2(140, -64);

export const dispensersX = 4;
export const dispensersY = 3;

export const getDispenser = (x: number, y: number): Dispenser => {
  assert(x >= 0 && x < dispensersX, "x out of bounds");
  assert(y >= 0 && y < dispensersY, "y out of bounds");
  return dispensers.get(`${x},${y}`);
};

export const getDispenserByIndex = (index: number) => {
  const x = index % dispensersX;
  const y = Math.floor(index / dispensersX);
  return getDispenser(x, y);
};

export const getNextDispenserPosition = (index = dispensers.size): Vector2 => {
  const x = index % dispensersX;
  const y = Math.floor(index / dispensersX);
  return firstDispenser
    .clone()
    .add(new Vector2(x, y).multiply(dispenserOffset));
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("add", () => {
    expect(getNextDispenserPosition(0).x).toBe(708);
    expect(getNextDispenserPosition(0).y).toBe(308);
  });
}
