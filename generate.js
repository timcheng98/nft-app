const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const {
	layers,
	width,
	height,
	description,
	baseImageUri,
	editionSize,
	startEditionFrom,
	endEditionAt,
	rarityWeights,
} = require('./input/config.js');
const { Buffer } = require('buffer');
// const { NFTStorage, File, toGatewayURL } = require('nft.storage');
const _ = require('lodash');
const console = require('console');
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
// const apiKey =
// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk4ZjAwYTcyRDlmRjJiOGE1QzAxNjZlOTIzN0YwMjM4QmZGYTNBNTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDg0NTYzNDIxOCwibmFtZSI6IldTQk5GVCJ9.a6u_18N6erBhc_1Y6gaPuf_Dfd-e3ldQqR6sPexqXaE';
// const client = new NFTStorage({ token: apiKey });

const Chance = require('chance')

const chance = new Chance()

var metadataList = [];
var attributesList = [];
var dnaList = [];

const saveImage = (_editionCount) => {
	fs.writeFileSync(
		`./output/images/${_editionCount}.png`,
		canvas.toBuffer('image/png')
	);
};

const saveMeta = (_editionCount, meta) => {
	fs.writeFileSync(`./output/meta/${_editionCount}.json`, meta);
};

const signImage = (_sig) => {
	ctx.fillStyle = '#000000';
	ctx.font = 'bold 30pt Courier';
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.fillText(_sig, 40, 40);
};

const genColor = () => {
	let hue = Math.floor(Math.random() * 360);
	let pastel = `hsl(${hue}, 100%, 85%)`;
	return pastel;
};

const drawBackground = () => {
	ctx.fillStyle = genColor();
	ctx.fillRect(0, 0, width, height);
};

const addMetadata = async (_dna, _edition) => {
	let dateTime = Date.now();
	const data = await fs.readFileSync(`./output/images/${_edition}.png`);

	// const cid = await client.storeBlob(new File([data], '1.png', { type: 'image/png' }),)

	// console.log('cid', cid);
	// const imageURL = await toGatewayURL(`ipfs://${cid}`)
	let tempMetadata = {
		// dna: _dna.join(''),
		name: `Crypto WallStreetBets #${_edition}`,
		description: description,
		image: baseImageUri,
		edition: _edition,
		// date: dateTime,
		attributes: attributesList,
	};
	attributesList = [];
	saveMeta(_edition, JSON.stringify(tempMetadata));
	return tempMetadata;
};

const addAttributes = (_element) => {
	let selectedElement = _element.layer.selectedElement;
	attributesList.push({
		trait_type: _element.layer.name,
		value: selectedElement.name,
	});
};

const loadLayerImg = async (_layer) => {
	return new Promise(async (resolve) => {
		const image = await loadImage(`${_layer.selectedElement.path}`);
		resolve({ layer: _layer, loadedImage: image });
	});
};

const drawElement = (_element) => {
	ctx.drawImage(
		_element.loadedImage,
		_element.layer.position.x,
		_element.layer.position.y,
		_element.layer.size.width,
		_element.layer.size.height
	);
	addAttributes(_element);
};

const constructLayerToDna = (_dna = [], _layers = [], _rarity) => {
	let mappedDnaToLayers = _layers.map((layer, index) => {
		let selectedElement = layer.elements[_rarity][_dna[index]];
		return {
			location: layer.location,
			position: layer.position,
			size: layer.size,
			name: layer.name,
			// score: randomPicks[index].score,
			selectedElement: selectedElement,
		};
	});

	return mappedDnaToLayers;
};

const getRarity = (_editionCount) => {
	let rarity = '';
	rarityWeights.forEach((rarityWeight) => {
		if (
			_editionCount >= rarityWeight.from &&
			_editionCount <= rarityWeight.to
		) {
			rarity = rarityWeight.value;
		}
	});
	return rarity;
};

const isDnaUnique = (_DnaList = [], _dna = [], randomPicks = []) => {
	const foundDna = _.find(_DnaList, (dna) => {
		return (
			_.join(dna.newDna, '') === _.join(_dna, '') &&
			_.map(dna.randomPicks, 'score').join('') ===
				_.map(randomPicks.join(''), 'score')
		);
	});

	return _.isEmpty(foundDna);
};

const createDna = (_layers, _rarity) => {
	let randNum = [];
	let randomPicks = [];
	_layers.forEach((layer) => {
		// let rand100 = Math.floor(Math.random() * 100)
		// if (rand100 % 48 === 0) {
		//   randomPick = rarityWeights[2]
		// } else if (rand100 % 20 === 0) {
		//   randomPick = rarityWeights[1]
		// } else {
		//   randomPick = rarityWeights[0]
		// }
		const randomPick =
			rarityWeights[Math.floor(Math.random() * rarityWeights.length)];
		let num = Math.floor(
			Math.random() * layer.elements[randomPick.value].length
		);
		randomPicks.push(randomPick);
		randNum.push(num);
	});

	return { newDna: randNum, randomPicks };
};

const writeMetaData = (_data) => {
	fs.writeFileSync('./output/_metadata.json', _data);
};

const getDNAList = () => {
	let dna = [];
	for (let i = 0; i < 8; i += 1) {
		for (let j = 0; j < 8; j += 1) {
			for (let k = 0; k < 8; k += 1) {
				for (let l = 0; l < 8; l += 1) {
					for (let m = 0; m < 8; m += 1) {
						// for (let n = 0; n < 1; n += 1) {
							dna.push([i, j, k, l, m]);
						// }
					}
				}
			}
		}
	}
	return dna;
	// console.log(dna.length);
	// dna.forEach(item => console.log(item))
};

const startCreating = async () => {
	writeMetaData('');
	let dnaList = getDNAList();
	dnaList = chance.shuffle(dnaList)
	let editionCount = startEditionFrom;
	while (editionCount <= 20 ) {
		// console.log(editionCount);

		let rarity = getRarity(editionCount);
		let dna = dnaList[editionCount];
		// console.log(rarity);

		// let { newDna, randomPicks } = createDna(layers, rarity);
		// console.log(dnaList);

		// if (isDnaUnique(dnaList, newDna, randomPicks)) {
		// let results = constructLayerToDna(newDna, layers, rarity, randomPicks);
		let results = constructLayerToDna(dna, layers, 'original');
		// let results = dnaList[editionCount]
		let loadedElements = []; //promise array

		results.forEach((layer) => {
			loadedElements.push(loadLayerImg(layer));
		});

		await Promise.all(loadedElements).then(async (elementArray) => {
			ctx.clearRect(0, 0, width, height);
			drawBackground();
			let score = 0;

			// if (elementArray === undefined) {
			//   console.log('his');
			// }

			elementArray.forEach((element) => {
				drawElement(element);
				// score += element.layer.score;
			});

			signImage(`#${editionCount}`);
			saveImage(editionCount);
			const meta = await addMetadata(dna, editionCount);
			// console.log('metadataList', meta);
      metadataList.push(meta)
			console.log(`Created edition: ${editionCount} with DNA: ${dna}`);
		});
		// dnaList.push({
		// 	newDna,
		// 	randomPicks,
		// });
		editionCount++;
		// } else {
		// 	console.log('DNA exists!');
		// }
	}
	writeMetaData(JSON.stringify(metadataList));
};

startCreating();
