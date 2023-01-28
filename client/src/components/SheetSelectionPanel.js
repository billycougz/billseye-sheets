import { useState } from 'react';
import { createNewDocument, loadDocument } from '../api';
import Alert from './Alert';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Card, CardContent } from '@mui/material';

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
			<Card>
				<CardContent>
					<h3>Create a new Sheets database</h3>
					<TextField
						label='Sheets Name'
						variant='standard'
						value={newSheetTitle}
						onChange={(e) => setNewSheetTitle(e.target.value)}
						sx={{ m: 1, minWidth: 250 }}
					/>
					<Button variant='contained' className='inline-button' onClick={handleCreateClick} disabled={!newSheetTitle}>
						Create
					</Button>

					{!recentSheets.length ? (
						''
					) : (
						<>
							<h3 className='space'>Load a recent Sheets database</h3>
							<FormControl variant='standard' sx={{ m: 1, minWidth: 250 }}>
								<InputLabel>Sheets Name</InputLabel>
								<Select label='Select a Sheets database' onChange={handleRecentSheetSelection}>
									{recentSheets.map(({ id, title }) => (
										<MenuItem key={id} value={id}>
											{title}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Button
								variant='contained'
								className='inline-button'
								onClick={() => handleLoadClick('recent')}
								disabled={!recentSheetSelection}
							>
								Load
							</Button>
						</>
					)}

					<h3 className='space'>Load a Sheets database by URL</h3>
					<TextField
						label='Sheets URL'
						variant='standard'
						onChange={(e) => handleSheetUrlChange(e.target.value)}
						sx={{ m: 1, minWidth: 250 }}
					/>
					<Button
						variant='contained'
						className='inline-button'
						onClick={() => handleLoadClick('existing')}
						disabled={!existingSheetId}
					>
						Load
					</Button>
					{invalidUrl}
				</CardContent>
			</Card>
		</div>
	);
}

export default SheetSelectionPanel;
