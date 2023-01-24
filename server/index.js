require('dotenv').config();
const { google } = require('googleapis');
const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async (event) => {
	console.log({ event });
	try {
		let responseData;
		switch (event.path) {
			case '/default/oauthcallback':
				// This route returns directly (vs the common response) because it returns a redirect
				return await handleOAuthCallback(event);
			case '/default/create':
				responseData = await handleCreate(event);
				break;
			case '/default/addRecord':
				responseData = await handleAddRecord(event);
				break;
			case '/default/loadDoc':
				responseData = await handleLoadDoc(event);
				break;
			default:
				throw 'The request path was not found';
		}
		return {
			statusCode: 200,
			body: JSON.stringify(responseData),
		};
	} catch (e) {
		const errorResponseData = { error: 'There was an error', message: e };
		return {
			statusCode: 500,
			body: JSON.stringify(errorResponseData),
		};
	}
};

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_OAUTH_CLIENT_ID,
	process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	process.env.OAUTH_REDIRECT_URI
);

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

// GET
const handleOAuthConsentUrl = () => {
	const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
		scope: scopes,
	});
	res.send(url);
};

// GET
const handleOAuthCallback = async (event) => {
	const { tokens } = await oauth2Client.getToken(event.queryStringParameters.code);
	console.log(tokens);
	const stringTokens = JSON.stringify(tokens);
	return {
		statusCode: 301,
		headers: {
			Location: `${process.env.APP_HOME_URL}?tokens=${stringTokens}`,
		},
	};
};

// POST
const handleCreate = async (event) => {
	const tokens = JSON.parse(event.headers.authorization);
	const doc = configureDoc({ tokens });
	await doc.createNewSpreadsheetDocument({ title: event.body.title });
	await doc.sheetsByIndex[0].updateProperties({ title: 'gamesPlayed' });
	await doc.sheetsByIndex[0].setHeaderRow(['dateAdded', 'location', 'gameName', 'winner', 'loser']);
	const headerValues = ['name', 'dateAdded'];
	await doc.addSheet({ title: 'players', headerValues });
	await doc.addSheet({ title: 'locations', headerValues });
	await doc.addSheet({ title: 'gameNames', headerValues });
	const documentData = await getDocumentData(doc);
	return documentData;
};

// POST
const handleAddRecord = async (event) => {
	const tokens = JSON.parse(event.headers.authorization);
	const doc = configureDoc({ tokens, spreadsheetId: event.body.spreadsheetId });
	await doc.loadInfo();
	const record = JSON.parse(event.body.record);
	record.dateAdded = new Date().toLocaleString();
	await doc.sheetsByTitle[event.body.type].addRow(record);
	const documentData = await getDocumentData(doc);
	return documentData;
};

// GET
const handleLoadDoc = async (event) => {
	const tokens = JSON.parse(event.queryStringParameters.tokens);
	const doc = configureDoc({ tokens, spreadsheetId: event.queryStringParameters.spreadsheetId });
	await doc.loadInfo();
	const documentData = await getDocumentData(doc);
	return documentData;
};
