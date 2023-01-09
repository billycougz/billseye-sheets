import { useEffect, useState } from 'react';
import './App.css';

function App() {
	const [content, setContent] = useState('');
	const [gapiInited, setGapiInited] = useState(false);
	const [gisInited, setGisInited] = useState(false);
	const [authorized, setAuthorized] = useState(false);
	const [tokenClient, setTokenClient] = useState(null);

	useEffect(() => {
		const loadExternalScript = (uri, callback) => {
			const script = document.createElement('script');
			script.src = uri;
			script.async = true;
			script.onload = callback;
			document.body.appendChild(script);
		};
		loadExternalScript('https://apis.google.com/js/api.js', gapiLoaded);
		loadExternalScript('https://accounts.google.com/gsi/client', gisLoaded);
	}, []);

	// Callback after api.js is loaded.
	function gapiLoaded() {
		const API_KEY = 'AIzaSyDG1Xn_UXM5opcmJD3Ai6GLKOSEKZ__8zg';
		const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
		// Callback after the API client is loaded. Loads the discovery doc to initialize the API.
		async function initializeGapiClient() {
			await window.gapi.client.init({
				apiKey: API_KEY,
				discoveryDocs: [DISCOVERY_DOC],
			});
			setGapiInited(true);
		}
		window.gapi.load('client', initializeGapiClient);
	}

	// Callback after Google Identity Services are loaded.
	function gisLoaded() {
		const CLIENT_ID = '410398723822-o8k13cm1jf9eiduq8ce8fk890qfad23j.apps.googleusercontent.com';
		const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';
		setTokenClient(
			window.google.accounts.oauth2.initTokenClient({
				client_id: CLIENT_ID,
				scope: SCOPES,
				callback: '', // defined later
			})
		);
		setGisInited(true);
	}

	// Sign in the user upon button click.
	function handleAuthClick() {
		tokenClient.callback = async (resp) => {
			if (resp.error !== undefined) {
				throw resp;
			}
			setAuthorized(true);
			await listMajors();
		};
		if (window.gapi.client.getToken() === null) {
			// Prompt the user to select a Google Account and ask for consent to share their data
			// when establishing a new session.
			tokenClient.requestAccessToken({ prompt: 'consent' });
		} else {
			// Skip display of account chooser and consent dialog for an existing session.
			tokenClient.requestAccessToken({ prompt: '' });
		}
	}

	/**
	 *  Sign out the user upon button click.
	 */
	function handleSignoutClick() {
		const token = window.gapi.client.getToken();
		if (token !== null) {
			window.google.accounts.oauth2.revoke(token.access_token);
			window.gapi.client.setToken('');
			setContent('');
			document.getElementById('authorize_button').innerText = 'Authorize';
			document.getElementById('signout_button').style.visibility = 'hidden';
		}
	}

	/**
	 * Print the names and majors of students in a sample spreadsheet:
	 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
	 */
	async function listMajors() {
		let response;
		try {
			// Fetch first 10 files
			response = await window.gapi.client.sheets.spreadsheets.values.get({
				// 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
				spreadsheetId: '1AdwxoIp9oY-iFxeuG21_JIVrHJuYosoqvh9vHAZMPbI',
				range: 'Class Data!A2:E',
			});
		} catch (err) {
			setContent(err.message);
			return;
		}
		const range = response.result;
		if (!range || !range.values || range.values.length == 0) {
			setContent('No values found.');
			return;
		}
		// Flatten to string to display
		const output = range.values.reduce((str, row) => `${str}${row[0]}, ${row[4]}\n`, 'Name, Major:\n');
		setContent(output);
	}

	return (
		<div className='App'>
			<p>Sheets API Quickstart</p>
			{gapiInited && gisInited && (
				<button id='authorize_button' onClick={handleAuthClick}>
					{authorized ? 'Refresh' : 'Authorize'}
				</button>
			)}
			{authorized && (
				<button id='signout_button' onClick={handleSignoutClick}>
					Sign Out
				</button>
			)}
			<pre>{content}</pre>
		</div>
	);
}

export default App;
