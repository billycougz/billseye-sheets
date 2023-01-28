import { useState } from 'react';
import { createNewDocument, loadDocument } from '../api';
import Alert from './Alert';

function SheetSelectionPanel({ onUpdate, onLoadingChange }) {
	const [newSheetTitle, setNewSheetTitle] = useState('');
	const [recentSheetSelection, setRecentSheetSelection] = useState('');
	const [existingSheetId, setExistingSheetsId] = useState('');
	const [invalidUrl, setInvalidUrl] = useState('');
	const [hasAlert, setHasAlert] = useState(false);
	const [recentSheets, setRecentSheets] = useState(JSON.parse(localStorage.getItem('recent-sheets') || '[]'));

	const handleCreateClick = async () => {
		onLoadingChange(true);
		const data = await createNewDocument(newSheetTitle);
		onLoadingChange(false);
		if (!data.error) {
			onUpdate(data);
			updateRecentSheets(data);
		}
	};

	const handleLoadClick = async (field) => {
		onLoadingChange(true);
		const spreadsheetId = field === 'existing' ? existingSheetId : recentSheetSelection;
		const data = await loadDocument(spreadsheetId);
		onLoadingChange(false);
		if (!data.error) {
			onUpdate(data);
			updateRecentSheets(data);
		} else {
			setHasAlert(true);
		}
	};

	const handleRecentSheetSelection = (e) => {
		setRecentSheetSelection(e.target.value);
	};

	const updateRecentSheets = (data) => {
		const storedSheets = recentSheets.filter(({ name, id }) => id !== data.spreadsheetId);
		storedSheets.push({ title: data.title, id: data.spreadsheetId });
		localStorage.setItem('recent-sheets', JSON.stringify(storedSheets));
		setRecentSheets(storedSheets);
	};

	const handleSheetUrlChange = (existingSheetUrl) => {
		const segments = existingSheetUrl.split('/');
		const sheetIdIndex = segments.findIndex((segment) => segment === 'd') + 1;
		if (sheetIdIndex) {
			setExistingSheetsId(segments[sheetIdIndex]);
			setInvalidUrl('');
		} else {
			setExistingSheetsId('');
			setInvalidUrl(existingSheetUrl ? 'This is not a valid Sheets URL' : '');
		}
	};

	return (
		<div>
			<Alert open={hasAlert} onClose={() => setHasAlert(false)} />
			<p>Create a new Sheets database to store your data or load a database previously created through Billseye.</p>
			<h3>Create a new Sheets database</h3>
			<input value={newSheetTitle} onChange={(e) => setNewSheetTitle(e.target.value)} placeholder='Enter a name...' />
			<button onClick={handleCreateClick} disabled={!newSheetTitle}>
				Create New
			</button>

			{!recentSheets.length ? (
				''
			) : (
				<>
					<h3>Load a recently used Sheets database</h3>
					<select onChange={handleRecentSheetSelection}>
						<option>Select a Sheets database</option>
						{recentSheets.map(({ id, title }) => (
							<option key={id} value={id}>
								{title}
							</option>
						))}
					</select>
					<button onClick={() => handleLoadClick('recent')} disabled={!recentSheetSelection}>
						Load Recent
					</button>
				</>
			)}

			<h3>Load an existing Sheets database by URL</h3>
			<input onChange={(e) => handleSheetUrlChange(e.target.value)} placeholder='Enter a Sheets URL...' />
			<button onClick={() => handleLoadClick('existing')} disabled={!existingSheetId}>
				Load Existing
			</button>
			{invalidUrl}
		</div>
	);
}

export default SheetSelectionPanel;
