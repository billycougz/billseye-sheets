require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const port = 6969;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(port, () => console.log(`App listening on port ${port}`));

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_OAUTH_CLIENT_ID,
	process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	process.env.OAUTH_REDIRECT_URI
);

app.get('/health', async (req, res) => {
	res.send('69');
});

app.get('/url', async (req, res) => {
	const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
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
	const doc = configureDoc({ tokens });
	await doc.createNewSpreadsheetDocument({ title: req.query.title });
	await doc.sheetsByIndex[0].updateProperties({ title: 'gamesPlayed' });
	await doc.sheetsByIndex[0].setHeaderRow(['dateAdded', 'location', 'gameName', 'winner', 'loser']);
	const headerValues = ['name', 'dateAdded'];
	await doc.addSheet({ title: 'players', headerValues });
	await doc.addSheet({ title: 'locations', headerValues });
	await doc.addSheet({ title: 'gameNames', headerValues });
	const documentData = await getDocumentData(doc);
	res.send(documentData);
});

app.post('/addRecord', async (req, res) => {
	const tokens = JSON.parse(req.headers.authorization);
	const doc = configureDoc({ tokens, spreadsheetId: req.body.spreadsheetId });
	await doc.loadInfo();
	const record = JSON.parse(req.body.record);
	record.dateAdded = new Date().toLocaleString();
	await doc.sheetsByTitle[req.body.type].addRow(record);
	const documentData = await getDocumentData(doc);
	res.send(documentData);
});

app.get('/loadDoc', async (req, res) => {
	const tokens = JSON.parse(req.query.tokens);
	const doc = configureDoc({ tokens, spreadsheetId: req.query.spreadsheetId });
	await doc.loadInfo();
	const documentData = await getDocumentData(doc);
	res.send(documentData);
});

const getDocumentData = async (doc) => {
	const sheetNames = ['gamesPlayed', 'players', 'locations', 'gameNames'];
	const sheetRequests = sheetNames.map((sheetName) => doc.sheetsByTitle[sheetName].getRows());
	const sheets = await Promise.all(sheetRequests);
	return sheets.reduce(
		(documentData, sheetRows, index) => {
			const sheetName = sheetNames[index];
			documentData[sheetName] = sheetRows.map((row) => {
				const headerValues = Object.keys(row).filter((value) => value[0] !== '_');
				return headerValues.reduce((sheet, headerValue) => ({ ...sheet, [headerValue]: row[headerValue] }), {});
			});
			return documentData;
		},
		{ title: doc.title, spreadsheetId: doc.spreadsheetId }
	);
};

const configureDoc = ({ tokens, spreadsheetId }) => {
	oauth2Client.setCredentials(tokens);
	const doc = new GoogleSpreadsheet(spreadsheetId);
	doc.useOAuth2Client(oauth2Client);
	return doc;
};
