//express_demo.js 文件
var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');
const _ = require('lodash')

// Add headers before the routes are defined
app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);

	// Request headers you wish to allow
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With,content-type'
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

app.get('/api/creature/:tokenId', async (req, res) => {
	try {
		const { tokenId } = req.params;
		const meta = path.join(__dirname, `./output/meta/${tokenId}.json`);
		res.sendFile(meta);
	} catch (err) {
		res.json(404);
	}
});

app.get('/api/creature', async (req, res) => {
	try {
		const { total } = req.query;
		let location = path.join(__dirname, `./output/meta`);

		const metaList = _.times(total, (item) => {
      console.log(item);
			const rawData = fs.readFileSync(`${location}/${item}.json`);
			let meta = JSON.parse(rawData);
      return meta
		});

		res.json({
      status: 1,
      data: metaList
    });
	} catch (err) {
		res.json(404);
	}
});

app.get('/api/creature/images/:tokenId', async (req, res) => {
	try {
		const { tokenId } = req.params;
		const meta = path.join(__dirname, `./output/images/${tokenId}.png`);
		res.sendFile(meta);
	} catch (err) {
		res.json(404);
	}
});

app.use(express.static('data'));
app.use(express.static('./web/build'));

var server = app.listen(3001, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('应用实例，访问地址为 http://%s:%s', host, port);
});
