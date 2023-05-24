const { faker } = require('@faker-js/faker');

const randomizeValue = (value) => {
  if (typeof value === "string") {
    return faker.person.firstName();
  } else if (typeof value === "number") {
    return faker.number.bigInt();
  } else if (typeof value === "boolean") {
    return faker.datatype.boolean({ probability: 0.5 });
  } else if (Array.isArray(value)) {
    return value.map(randomizeValue);
  } else if (typeof value === "object" && value !== null) {
    return randomizeJson(value);
  } else {
    return null;
  }
};

const randomizeJson = (json) => {
  let newJson = {};
  for (let key in json) {
    newJson[key] = randomizeValue(json[key]);
  }
  return newJson;
};

const createRandomCopies = (json, numberOfCopies) => {
  let copies = [];
  for (let i = 0; i < numberOfCopies; i++) {
    copies.push(randomizeJson(json));
  }
  return copies;
};

// Usage:
const inputJson = { name: "John", age: 30, likesIceCream: true, favoriteColors: ["red", "blue"] };

const copies = createRandomCopies(inputJson, 5);

console.log(copies);
