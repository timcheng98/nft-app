'use strict';

const fs = require('fs');
const path = require('path');
const isLocal = typeof process.pkg === 'undefined';
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);

const { blockchainUri } = require('./input/config');

// read json data
let rawdata = fs.readdirSync(`${basePath}/output/meta`);
// let data = JSON.parse(rawdata);

// console.log('data', rawdata);
rawdata.forEach(async (item) => {
	var obj = JSON.parse(fs.readFileSync(`${basePath}/output/meta/${item}`, 'utf8'));

	obj.image = `${blockchainUri}/${obj.edition}.png`;
	obj.description = `Crypto WallStreetBets are 9630 art pieces with a one-of-a-kind digital collection of various NFTs that are stored on the Polygon Blockchain. Each one has been meticulously created, hand-picked, and perfectly formed.`;
	fs.writeFileSync(
	  `${basePath}/output/meta/${obj.edition}.json`,
	  JSON.stringify(obj, null, 2)
	);
});

// fs.writeFileSync(
//   `${basePath}/output/_metadata_super_rare.json`,
//   JSON.stringify(data, null, 2)
// );

console.log(`Updated baseUri for images to ===> ${blockchainUri}`);
