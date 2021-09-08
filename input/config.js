const fs = require('fs');
const width = 1000;
const height = 1000;
const dir = __dirname;
const description = 'Crpyto WallstreetBets are 10,000 art pieces with a one-of-a-kind digital collection of various NFTs that are stored on the Polygon Blockchain. Each one has been meticulously created, hand-picked, and perfectly formed.';
const baseImageUri = 'https://hashlips/nft';
const startEditionFrom = 0;
const endEditionAt = 10;
const editionSize = 10;
const rarityWeights = [
	{
		value: 'original',
		from: 5,
		to: editionSize,
    lucky: 2,
		score: 1,
	},
	{
		value: 'rare',
		from: 2,
		to: 5,
    lucky: 24,
		score: 2,
	},
	{
		value: 'super_rare',
		from: 1,
		to: 1,
    lucky: 48,
		score: 3,
	},
];

const cleanName = (_str) => {
	let name = _str.slice(0, -4);
	return name;
};

const getElements = (path) => {
	return fs
		.readdirSync(path)
		.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
		.map((i) => {
			return {
				name: cleanName(i),
				path: `${path}/${i}`,
			};
		});
};

const layers = [
	{
		name: 'ball',
		elements: {
			original: getElements(`${dir}/ball/original`),
			rare: getElements(`${dir}/ball/rare`),
			super_rare: getElements(`${dir}/ball/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'Eye color',
		elements: {
			original: getElements(`${dir}/eye color/original`),
			rare: getElements(`${dir}/eye color/rare`),
			super_rare: getElements(`${dir}/eye color/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'Iris',
		elements: {
			original: getElements(`${dir}/iris/original`),
			rare: getElements(`${dir}/iris/rare`),
			super_rare: getElements(`${dir}/iris/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'shine',
		elements: {
			original: getElements(`${dir}/shine/original`),
			rare: getElements(`${dir}/shine/rare`),
			super_rare: getElements(`${dir}/shine/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'Bottom lid',
		elements: {
			original: getElements(`${dir}/bottom lid/original`),
			rare: getElements(`${dir}/bottom lid/rare`),
			super_rare: getElements(`${dir}/bottom lid/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'Top lid',
		elements: {
			original: getElements(`${dir}/top lid/original`),
			rare: getElements(`${dir}/top lid/rare`),
			super_rare: getElements(`${dir}/top lid/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
];

module.exports = {
	layers,
	width,
	height,
	description,
	baseImageUri,
	editionSize,
	startEditionFrom,
	endEditionAt,
	rarityWeights,
};
