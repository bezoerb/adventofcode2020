const { run, ask, answer } = require("../lib/utils");
const { multiply } = require("../lib/array");
const reverseString = (str) => str.split("").reverse().join("");

// Flip X
const flip = (arr) => arr.map((line) => reverseString(line));

// Rotate right 45deg
const rotate = (arr) =>
  flip(
    [...arr].map((line, x) => {
      return line
        .split("")
        .map((_, y) => arr[y].split("")[x])
        .join("");
    })
  );

const getEdges = (arr) => {
  let tmp = [...arr];
  let edges = [];
  for (let i = 0; i < 4; i++) {
    const [edge] = tmp;
    edges.push(edge);
    tmp = rotate(tmp);
  }

  return edges.map((edge) => [edge, reverseString(edge)]);
};

const cropEdges = (arr, num = 1) =>
  arr
    .slice(num, arr.length - num)
    .map((line) => line.slice(num, arr.length - num));

const sortParts = (parts) => {
  const size = Math.sqrt(parts.length);
  const minmax = [0, size - 1];

  const corners = parts.filter((part) => part.neighbours.length === 2);
  const edges = parts.filter((part) => part.neighbours.length === 3);
  const [tl] = corners;
  let used = [tl.id];

  let result = [];

  const find = (id) => parts.find((part) => part.id === id);
  const isCorner = (x, y) => minmax.includes(x) && minmax.includes(y);
  const isEdge = (x, y) =>
    (minmax.includes(x) && !minmax.includes(y)) ||
    (minmax.includes(y) && !minmax.includes(x));

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!Array.isArray(result[y])) {
        result[y] = [];
      }
      if (x === 0 && y === 0) {
        result[x][y] = tl;
        continue;
      }

      const top = y > 0 ? result[y - 1][x] : {};
      const { neighbours: neighboursTop = [] } = top;

      const left = x > 0 ? result[y][x - 1] : {};
      const { neighbours: neighboursLeft = [] } = left;

      const [id] = [...neighboursTop, ...neighboursLeft].filter((id) => {
        // skip already used parts
        if (used.includes(id)) {
          return false;
        }

        const part = find(id);

        // only use corner parts for corners
        if (isCorner(x, y) && part.neighbours.length !== 2) {
          return false;
        }

        // only use edge parts for edges
        if (isEdge(x, y) && part.neighbours.length !== 3) {
          return false;
        }

        return true;
      });

      used = [...used, id];
      result[y][x] = find(id);
    }
  }

  return result;
};

const getEdge = (data, pos) => {
  switch (pos) {
    case "t":
      return data[0];
    case "b":
      return data[data.length - 1];
    case "l":
      return rotate([...data])[0];
    case "r":
      return rotate([...data])[data.length - 1];
  }
  return "";
};

// Flip & rotate parts
const processParts = (parts, crop = 1) => {
  let tmp = [...parts];

  for (let y = 0; y < tmp.length; y++) {
    for (let x = 0; x < tmp.length; x++) {
      const { data, id } = tmp[y][x];
      const { edges: nextHorizontal = [] } =
        x < tmp.length - 1 ? tmp[y][x + 1] : {};
      const { edges: nextVertical = [] } =
        y < tmp.length - 1 ? tmp[y + 1][x] : {};

      const prevHorizontal = x > 0 ? [getEdge(tmp[y][x - 1].data, "r")] : [];
      const prevVertical = y > 0 ? [getEdge(tmp[y - 1][x].data, "b")] : [];
      const match = (data) => {
        const l =
          prevHorizontal.length === 0 ||
          prevHorizontal.flat().includes(getEdge(data, "l"));
        const r =
          nextHorizontal.length === 0 ||
          nextHorizontal.flat().includes(getEdge(data, "r"));
        const t =
          prevVertical.length === 0 ||
          prevVertical.flat().includes(getEdge(data, "t"));
        const b =
          nextVertical.length === 0 ||
          nextVertical.flat().includes(getEdge(data, "b"));

        return l && r && t && b;
      };

      // check 8 possibilities
      let changed = [...data];
      for (let i = 0; i < 8; i++) {
        if (![0].includes(i)) {
          changed = rotate([...changed]);
        }
        if (i === 4) {
          changed = flip([...changed]);
        }
        if (match(changed)) {
          tmp[y][x].data = [...changed];
          break;
        }
      }
    }
  }

  return tmp.flatMap((row) => {
    const [first, ...rest] = row.map((part) => cropEdges(part.data, crop));

    return first.map((line, i) => {
      return rest.reduce((result, lines) => {
        return `${result}${lines[i]}`;
      }, line);
    });
  });
};

const addMonsters = (image) => {
  let result = [...image];
  for (let i = 1; i < result.length - 1; i++) {
    const regex = /#(.{4})##(.{4})##(.{4})###/gm;
    let match;
    while ((match = regex.exec(result[i])) !== null) {
      const prefix = match.index;
      const r1 = new RegExp(`^(.{${prefix}})(.{18})#`);
      const r2 = new RegExp(`^(.{${prefix}})#(.{4})##(.{4})##(.{4})###`);
      const r3 = new RegExp(
        `^(.{${prefix}})(.{1})#(.{2})#(.{2})#(.{2})#(.{2})#(.{2})#`
      );

      const m1 = r1.exec(result[i - 1]);
      const m3 = r3.exec(result[i + 1]);

      if (!m1 || !m3) {
        continue;
      }

      result[i - 1] = result[i - 1].replace(r1, "$1$2O");
      result[i] = result[i].replace(r2, "$1O$2OO$3OO$4OOO");
      result[i + 1] = result[i + 1].replace(r3, "$1$2O$3O$4O$5O$6O$7O");
    }
  }

  return result;
};

run(
  (input) => {
    const parts = input
      .trim()
      .split(/[\r\n]{2}/)
      .map((part) => {
        const [title, ...data] = part.split(/[\r\n]/);
        const [, id] = /Tile (\d+):/.exec(title);

        const edges = getEdges(data);

        return { id, data, edges };
      });

    const processed = parts.map((part) => ({
      ...part,
      neighbours: part.edges
        .map(([edge]) => {
          return parts
            .filter(
              (tmp) => tmp.id !== part.id && tmp.edges.flat().includes(edge)
            )
            .map((part) => part.id);
        })
        .flat(),
    }));

    const corners = processed.filter((part) => part.neighbours.length === 2);
    const cornerIds = corners.map((corner) => corner.id);

    ask(
      `What do you get if you multiply together the IDs of the four corner tiles?`
    );

    answer(multiply(cornerIds, BigInt(1)));

    const sorted = sortParts(processed);

    const image = rotate(rotate(rotate(processParts(sorted))));
    const withMonsters = addMonsters(image);

    //console.log(withMonsters.join("\n"));

    ask("How many # are not part of a sea monster?");
    answer(withMonsters.join("").replace(/[\.O]/g, "").length);
  } /* ,'test.txt' */
);
