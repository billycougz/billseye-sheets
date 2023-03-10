import axios from 'axios';

const BASE_URL =
	window.location.hostname === 'localhost'
		? 'http://localhost:6969/default'
		: 'https://378hu8lq90.execute-api.us-east-1.amazonaws.com/default';

const getHeaders = () => ({ Authorization: localStorage.getItem('sheets-tokens') });

const loginToGoogle = () => {
	const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
	const params = new URLSearchParams({
		access_type: 'offline',
		prompt: 'consent',
		scope: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
		response_type: 'code',
		client_id: '410398723822-o8k13cm1jf9eiduq8ce8fk890qfad23j.apps.googleusercontent.com',
		redirect_uri: `${BASE_URL}/oauthcallback`,
	});
	window.location.href = `${OAUTH_URL}?${params.toString()}`;
};

const createNewDocument = async (title) => {
	try {
		const url = `${BASE_URL}/create`;
		const body = { title };
		const headers = getHeaders();
		const { data } = await axios.post(url, body, { headers });
		return data;
	} catch (e) {
		return { error: 'Error' };
	}
};

const addNewRecord = async ({ type, record, spreadsheetId }) => {
	try {
		const url = `${BASE_URL}/addRecord`;
		const body = { type, record, spreadsheetId };
		const headers = getHeaders();
		const { data } = await axios.post(url, body, { headers });
		return data;
	} catch (e) {
		return { error: 'Error' };
	}
};

const loadDocument = async (spreadsheetId) => {
	try {
		const url = `${BASE_URL}/loadDoc`;
		const params = { spreadsheetId };
		const headers = getHeaders();
		const { data } = await axios.get(url, { params, headers });
		return data;
	} catch (e) {
		return { error: 'Error' };
	}
};

export { loginToGoogle, createNewDocument, addNewRecord, loadDocument };
