const { faker } = require('@faker-js/faker');
const args = require('args');
const fs = require('fs');

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


args
  .option(['i', 'input'], 'The input JSON file')
  .option(['o', 'output'], 'The output JSON file')
  .option(['c', 'copies'], 'The number of copies to create', 1);

const flags = args.parse(process.argv);

if (!flags.input || !flags.output) {
  console.error('Usage: node script.js -i <input.json> -o <output.json> [-c <numberOfCopies>]');
  process.exit(1);
}

fs.readFile(flags.input, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading input file:', err);
    process.exit(1);
  }

  const inputJson = JSON.parse(data);
  const copies = createRandomCopies(inputJson, flags.copies);

  fs.writeFile(flags.output, JSON.stringify(copies, null, 2), (err) => {
    if (err) {
      console.error('Error writing output file:', err);
      process.exit(1);
    }
    console.log(`Successfully generated ${flags.copies} copies to ${flags.output}`);
  });
});
