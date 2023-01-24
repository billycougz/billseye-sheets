import { useState } from 'react';
import { createNewDocument, loadDocument } from '../api';

function SheetSelectionPanel({ onUpdate, onLoadingChange }) {
	const [title, setTitle] = useState('');
	const [spreadsheetId, setSpreadsheetId] = useState('');
	const [previousDatabases, setPreviousDatabases] = useState(
		JSON.parse(localStorage.getItem('previous-databases') || '[]')
	);

	const handleCreateClick = async () => {
		onLoadingChange(true);
		const data = await createNewDocument(title);
		onLoadingChange(false);
		if (!data.error) {
			onUpdate(data);
		}
	};

	const handleLoadClick = async () => {
		onLoadingChange(true);
		const data = await loadDocument(spreadsheetId);
		onLoadingChange(false);
		if (!data.error) {
			onUpdate(data);
			const databases = previousDatabases.filter(({ name, id }) => id !== spreadsheetId);
			databases.push({ title: data.title, id: spreadsheetId });
			localStorage.setItem('previous-databases', JSON.stringify(databases));
			setPreviousDatabases(databases);
		}
	};

	const handlePreviousDatabaseClick = (e) => {
		setSpreadsheetId(e.target.value);
	};

	return (
		<div>
			<p>Create a new Sheets document to store your data or load a document previously created through Billseye.</p>
			<h3>Create a new Sheets document</h3>
			<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter a name...' />
			<button onClick={handleCreateClick} disabled={!title}>
				Create New
			</button>

			<h3>Load a previously used Sheets document</h3>
			<select onChange={handlePreviousDatabaseClick}>
				<option selected={!previousDatabases}>Select previous document</option>
				{previousDatabases.map(({ id, title }) => (
					<option value={id}>{title}</option>
				))}
			</select>
			<button onClick={handleLoadClick} disabled={!spreadsheetId}>
				Load Existing
			</button>
			<h3>Load an existing Sheets document by ID</h3>
			<input
				value={spreadsheetId}
				onChange={(e) => setSpreadsheetId(e.target.value)}
				placeholder='Enter a document id...'
			/>
			<button onClick={handleLoadClick} disabled={!spreadsheetId}>
				Load Existing
			</button>
		</div>
	);
}

export default SheetSelectionPanel;
