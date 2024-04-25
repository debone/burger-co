import { assert } from "../../../common/assert";

export const geometries = {
  lowerCounter: {
    x: 370,
    y: 597,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 196, y: 0 },
        { x: 196, y: 150 },
        { x: 0, y: 150 },
      ],
    ],
  },
  ramp: {
    x: 494,
    y: 586,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 52, y: -22 },
        { x: 52, y: 128 },
        { x: 0, y: 150 },
      ],
    ],
  },
  higherCounter: {
    x: 716,
    y: 576,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 394, y: 0 },
        { x: 394, y: 150 },
        { x: 0, y: 150 },
      ],
    ],
  },
  grill: {
    x: 1056,
    y: 576,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 282, y: 0 },
        { x: 282, y: 150 },
        { x: 0, y: 150 },
      ],
    ],
  },
  //
  // SIDES
  //
  topLowerCounter: {
    x: 370,
    y: 516,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 196, y: 0 },
        { x: 196, y: 10 },
        { x: 0, y: 10 },
      ],
    ],
  },
  leftLowerCounter: {
    x: 265,
    y: 597,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 170 },
        { x: 0, y: 170 },
      ],
    ],
  },
  bottomLowerCounter: {
    x: 370,
    y: 677,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 196, y: 0 },
        { x: 196, y: 10 },
        { x: 0, y: 10 },
      ],
    ],
  },

  topRamp: {
    x: 494,
    y: 504,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 52, y: -22 },
        { x: 52, y: -12 },
        { x: 0, y: 10 },
      ],
    ],
  },
  bottomRamp: {
    x: 494,
    y: 666,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 52, y: -22 },
        { x: 52, y: -12 },
        { x: 0, y: 10 },
      ],
    ],
  },
  topHigherCounter: {
    x: 860,
    y: 495,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 680, y: 0 },
        { x: 680, y: 10 },
        { x: 0, y: 10 },
      ],
    ],
  },
  rightHigherCounter: {
    x: 1205,
    y: 574,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 170 },
        { x: 0, y: 170 },
      ],
    ],
  },
  bottomHigherCounter: {
    x: 860,
    y: 656,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 680, y: 0 },
        { x: 680, y: 10 },
        { x: 0, y: 10 },
      ],
    ],
  },
  trash: {
    x: 1285,
    y: 670,
    vertices: [
      [
        { x: 0, y: 0 },
        { x: 150, y: 0 },
        { x: 150, y: 100 },
        { x: 0, y: 100 },
      ],
    ],
  },
};

export const makeMatterShape = (
  key: keyof typeof geometries,
  scene: Phaser.Scene,
  options?: Phaser.Types.Physics.Matter.MatterBodyConfig
) => {
  const geometry = geometries[key];

  assert(geometry, `Geometry not found for key: ${key}`);

  return scene.matter.add.fromVertices(
    geometry.x,
    geometry.y,
    geometry.vertices,
    { ...options, label: key }
  );
};
