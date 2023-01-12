const { GoogleSpreadsheet } = require('google-spreadsheet');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 6969;
app.use(cors());

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.get('/', async (req, res) => {
	res.send('69');
});

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_OAUTH_CLIENT_ID,
	process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	process.env.OAUTH_REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

app.get('/url', async (req, res) => {
	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
		scope: scopes,
	});
	res.send(url);
});

app.get('/oauthcallback', async (req, res) => {
	const { tokens } = await oauth2Client.getToken(req.query.code);
	const stringTokens = JSON.stringify(tokens);
	res.redirect(`${process.env.APP_HOME_URL}?tokens=${stringTokens}`);
});

app.get('/create', async (req, res) => {
	const tokens = JSON.parse(req.query.tokens);
	oauth2Client.setCredentials(tokens);
	const doc = new GoogleSpreadsheet();
	doc.useOAuth2Client(oauth2Client);
	await doc.createNewSpreadsheetDocument({ title: req.query.title });
	await doc.sheetsByIndex[0].setHeaderRow(['date', 'winner', 'loser']);
	await doc.sheetsByIndex[0].addRow(['1/11/2023', 'billy', 'kara']);
	res.send(doc.sheetsByIndex[0].headerValues);
});

app.get('/load', async (req, res) => {
	const doc = new GoogleSpreadsheet('1AdwxoIp9oY-iFxeuG21_JIVrHJuYosoqvh9vHAZMPbI');
	doc.useOAuth2Client(oauth2Client);
	await doc.loadInfo();
	await doc.sheetsByIndex[0].loadHeaderRow();
	res.send(doc.sheetsByIndex[0].headerValues);
});

// See docs at https://theoephraim.github.io/node-google-spreadsheet
const getRowData = async (id = '1AdwxoIp9oY-iFxeuG21_JIVrHJuYosoqvh9vHAZMPbI') => {
	const doc = new GoogleSpreadsheet('1AdwxoIp9oY-iFxeuG21_JIVrHJuYosoqvh9vHAZMPbI');
	doc.useApiKey(process.env.GOOGLE_API_KEY);
	await doc.loadInfo();
	await doc.sheetsByIndex[0].loadHeaderRow();
	const rows = await doc.sheetsByIndex[0].getRows();
	const mapped = rows.map((row) => {
		return doc.sheetsByIndex[0].headerValues.reduce((object, header) => {
			object[header] = row[header];
			return object;
		}, {});
	});
	return mapped;
};
