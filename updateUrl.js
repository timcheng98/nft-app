"use strict";

const fs = require("fs");
const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);

const { blockchainUri } = require("./input/config");

// read json data
let rawdata = fs.readFileSync(`${basePath}/output/_metadata.json`);
let data = JSON.parse(rawdata);

data.forEach((item) => {
  item.image = `${blockchainUri}/${item.edition}.png`;
  fs.writeFileSync(
    `${basePath}/output/meta/${item.edition}.json`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${basePath}/output/_metadata.json`,
  JSON.stringify(data, null, 2)
);

console.log(`Updated baseUri for images to ===> ${blockchainUri}`);