const { run, ask, answer } = require("../lib/utils");

const ACTIVE = "#";
const INACTIVE = ".";

const checkNeighbours = (grid, x, y, z, w) => {
  const result = { active: 0, inactive: 0 };
  for (let _w = -1; _w <= 1; _w++) {
    for (let _z = -1; _z <= 1; _z++) {
      for (let _y = -1; _y <= 1; _y++) {
        for (let _x = -1; _x <= 1; _x++) {
          if (_x === 0 && _y === 0 && _z === 0 && _w === 0) {
            continue;
          }

          const val = grid?.[w + _w]?.[z + _z]?.[y + _y]?.[x + _x] ?? INACTIVE;

          if (val === ACTIVE) {
            result.active++;
          } else {
            result.inactive++;
          }
        }
      }
    }
  }

  return result;
};

// const clone = (arr) => JSON.parse(JSON.stringify(arr));

const update = (grid) => {
  let newGrid = [];

  // console.log(grid);
  for (let _w = 0; _w < grid.length + 2; _w++) {
    newGrid[_w] = [];
    for (let _z = 0; _z < grid[0].length + 2; _z++) {
      newGrid[_w][_z] = [];
      for (let _y = 0; _y < grid[0][0].length + 2; _y++) {
        newGrid[_w][_z][_y] = [];
        for (let _x = 0; _x < grid[0][0][0].length + 2; _x++) {
          const val = grid?.[_w - 1]?.[_z - 1]?.[_y - 1]?.[_x - 1] ?? INACTIVE;
          const neighbours = checkNeighbours(
            grid,
            _x - 1,
            _y - 1,
            _z - 1,
            _w - 1
          );
          if (
            (val === ACTIVE && [2, 3].includes(neighbours.active)) ||
            (val === INACTIVE && [3].includes(neighbours.active))
          ) {
            newGrid[_w][_z][_y][_x] = ACTIVE;
          } else {
            newGrid[_w][_z][_y][_x] = INACTIVE;
          }
        }
      }
    }
  }
  return newGrid;
};

run((input) => {
  //   input = `.#.
  // ..#
  // ###`;

  const rows = input.split(/[\r\n]/);
  const grid = [[rows.map((row) => row.split(""))]];

  let updatedGrid = grid;
  for (let i = 0; i < 6; i++) {
    updatedGrid = update(updatedGrid);
  }

  ask(`How many cubes are left in the active state after the sixth cycle?`);
  answer(updatedGrid.flat(Infinity).filter((v) => v === ACTIVE).length);
});
