const fs = require('fs');
const width = 512;
const height = 467;
const dir = __dirname;
const description =
	'Crpyto WallstreetBets are 10,000 art pieces with a one-of-a-kind digital collection of various NFTs that are stored on the Polygon Blockchain. Each one has been meticulously created, hand-picked, and perfectly formed.';
const baseImageUri = 'https://wallstreetbets/nft';
const blockchainUri = 'ipfs://QmTjaSyRcWhnUD2qqyUnXBVgc2x6VVP2BcASjewYM967kN';
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
		name: 'background',
		elements: {
			original: getElements(`${dir}/background/original`),
			rare: getElements(`${dir}/background/rare`),
			super_rare: getElements(`${dir}/background/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'clothing',
		elements: {
			original: getElements(`${dir}/clothing/original`),
			rare: getElements(`${dir}/clothing/rare`),
			super_rare: getElements(`${dir}/clothing/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'face',
		elements: {
			original: getElements(`${dir}/face/original`),
			rare: getElements(`${dir}/face/rare`),
			super_rare: getElements(`${dir}/face/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'month',
		elements: {
			original: getElements(`${dir}/month/original`),
			rare: getElements(`${dir}/month/rare`),
			super_rare: getElements(`${dir}/month/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'hair style',
		elements: {
			original: getElements(`${dir}/hair/original`),
			rare: getElements(`${dir}/hair/rare`),
			super_rare: getElements(`${dir}/hair/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},
	{
		name: 'glasses',
		elements: {
			original: getElements(`${dir}/glasses/original`),
			rare: getElements(`${dir}/glasses/rare`),
			super_rare: getElements(`${dir}/glasses/super_rare`),
		},
		position: { x: 0, y: 0 },
		size: { width: width, height: height },
	},




	// {
	// 	name: 'ball',
	// 	elements: {
	// 		original: getElements(`${dir}/ball/original`),
	// 		rare: getElements(`${dir}/ball/rare`),
	// 		super_rare: getElements(`${dir}/ball/super_rare`),
	// 	},
	// 	position: { x: 0, y: 0 },
	// 	size: { width: width, height: height },
	// },
	// {
	// 	name: 'Eye color',
	// 	elements: {
	// 		original: getElements(`${dir}/eye color/original`),
	// 		rare: getElements(`${dir}/eye color/rare`),
	// 		super_rare: getElements(`${dir}/eye color/super_rare`),
	// 	},
	// 	position: { x: 0, y: 0 },
	// 	size: { width: width, height: height },
	// },
	// {
	// 	name: 'Iris',
	// 	elements: {
	// 		original: getElements(`${dir}/iris/original`),
	// 		rare: getElements(`${dir}/iris/rare`),
	// 		super_rare: getElements(`${dir}/iris/super_rare`),
	// 	},
	// 	position: { x: 0, y: 0 },
	// 	size: { width: width, height: height },
	// },
	// {
	// 	name: 'shine',
	// 	elements: {
	// 		original: getElements(`${dir}/shine/original`),
	// 		rare: getElements(`${dir}/shine/rare`),
	// 		super_rare: getElements(`${dir}/shine/super_rare`),
	// 	},
	// 	position: { x: 0, y: 0 },
	// 	size: { width: width, height: height },
	// },
	// {
	// 	name: 'Bottom lid',
	// 	elements: {
	// 		original: getElements(`${dir}/bottom lid/original`),
	// 		rare: getElements(`${dir}/bottom lid/rare`),
	// 		super_rare: getElements(`${dir}/bottom lid/super_rare`),
	// 	},
	// 	position: { x: 0, y: 0 },
	// 	size: { width: width, height: height },
	// },
	// {
	// 	name: 'Top lid',
	// 	elements: {
	// 		original: getElements(`${dir}/top lid/original`),
	// 		rare: getElements(`${dir}/top lid/rare`),
	// 		super_rare: getElements(`${dir}/top lid/super_rare`),
	// 	},
	// 	position: { x: 0, y: 0 },
	// 	size: { width: width, height: height },
	// },
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
	blockchainUri,
};
