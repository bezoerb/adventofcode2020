const { run, ask, answer } = require("../lib/utils");
const { unique, intersect, different } = require("../lib/array");

const toArray = (str) =>
  (str || "")
    .split(" ")
    .map((word) => word.replace(/,$/, ""))
    .filter((v) => v);

const isUnambiguous = (mapping) =>
  mapping.every((item) => item.ingredients.length === 1);

const cleanup = (mapping) => {
  let matched = mapping.flatMap((item) =>
    item.ingredients.length === 1 ? item.ingredients : []
  );

  const sorted = [...mapping].sort(
    (a, b) => a.ingredients.length - b.ingredients.length
  );

  return sorted.map((item) => {
    if (item.ingredients.length === 1) {
      return item;
    }

    const ingredients = different(item.ingredients, matched);

    if (ingredients.length === 1) {
      matched = [...matched, ...ingredients];
    }

    return { ...item, ingredients };
  });
};

run((input) => {
  const data = input
    .trim()
    .split(/[\r\n]/)
    .map((line) => {
      // Extract ingredients & allergens
      const regex = /^\s*([^\(]+)(?:\s\(contains\s([^\)]+)\))?$/i;
      const [, ingredients, allergens] = regex.exec(line);
      return {
        ingredients: toArray(ingredients),
        allergens: toArray(allergens),
      };
    });

  const allergens = unique(data.flatMap(({ allergens }) => allergens));

  const mappingRaw = allergens.reduce((result, allergen) => {
    const ingredients = data.reduce((ingredients, item) => {
      const includes = item.allergens.includes(allergen);

      if (includes && ingredients.length === 0) {
        return item.ingredients;
      } else if (includes) {
        return intersect(ingredients, item.ingredients);
      }
      return ingredients;
    }, []);

    return [...result, { name: allergen, ingredients }];
  }, []);

  let mapping = [...mappingRaw];
  while (!isUnambiguous(mapping)) {
    mapping = cleanup(mapping);
  }

  const allergenIngredients = mapping.flatMap((item) => item.ingredients);
  const saveIngredients = unique(
    data.flatMap(({ ingredients }) =>
      different(ingredients, allergenIngredients)
    )
  );

  const count = saveIngredients.reduce((result, ingredient) => {
    return (
      result +
      (input.match(new RegExp(`(^|\\s)${ingredient}\\s`, "gm")) || []).length
    );
  }, 0);

  console.log({ allergenIngredients, saveIngredients });

  ask("How many times do any of those ingredients appear?");
  answer(count);

  ask("What is your canonical dangerous ingredient list?");
  const list = [...mapping]
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((item) => item.ingredients)
    .join(",");

  answer(list);
}, "input.txt");
