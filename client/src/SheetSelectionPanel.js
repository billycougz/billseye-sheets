import { useState } from 'react';
import axios from 'axios';

function SheetSelectionPanel({ onUpdate }) {
	const [title, setTitle] = useState('');
	const [spreadsheetId, setSpreadsheetId] = useState('');
	const [previousDatabases, setPreviousDatabases] = useState(
		JSON.parse(localStorage.getItem('previous-databases') || '[]')
	);

	const handleCreateClick = async () => {
		const { data } = await axios(
			`http://localhost:6969/create?tokens=${localStorage.getItem('sheets-tokens')}&title=${title}`
		);
		onUpdate(data);
	};

	const handleLoadClick = async () => {
		const { data } = await axios(
			`http://localhost:6969/loadDoc?tokens=${localStorage.getItem('sheets-tokens')}&spreadsheetId=${spreadsheetId}`
		);
		onUpdate(data);
		const databases = previousDatabases.filter(({ name, id }) => id !== spreadsheetId);
		databases.push({ title: data.title, id: spreadsheetId });
		localStorage.setItem('previous-databases', JSON.stringify(databases));
		setPreviousDatabases(databases);
	};

	const handlePreviousDatabaseClick = (e) => {
		setSpreadsheetId(e.target.value);
	};

	return (
		<div>
			<h1>Billseye Dart Database</h1>
			<p>Now powered by your own Google Sheets.</p>
			<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter a database name...' />
			<button onClick={handleCreateClick}>Create New</button>
			<br />
			<input
				value={spreadsheetId}
				onChange={(e) => setSpreadsheetId(e.target.value)}
				placeholder='Enter a database id...'
			/>
			<select onChange={handlePreviousDatabaseClick}>
				<option selected={!previousDatabases}>Select previous database</option>
				{previousDatabases.map(({ id, title }) => (
					<option value={id}>{title}</option>
				))}
			</select>
			<button onClick={handleLoadClick}>Load Existing</button>
		</div>
	);
}

export default SheetSelectionPanel;
