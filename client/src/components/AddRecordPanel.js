import { useState } from 'react';
import axios from 'axios';

function AddRecordPanel({ data, onUpdate, onLoadingChange }) {
	const { spreadsheetId } = data;
	const EMPTY_RECORD = { date: null, winner: null, loser: null, location: null, gameName: null };
	const { locations = [], gameNames = [], players = [] } = data;
	const [recordData, setRecordData] = useState(EMPTY_RECORD);
	const [addNewField, setAddNewField] = useState(null);
	const [addNewValue, setAddNewValue] = useState('');
	const { location, gameName, winner, loser } = recordData;
	const isComplete = location && gameName && winner && loser;
	const API_BASE = 'http://localhost:6969';

	const handleSubmitClick = async () => {
		onLoadingChange(true);
		const record = JSON.stringify(recordData);
		const url = `${API_BASE}/addRecord`;
		const headers = { Authorization: localStorage.getItem('sheets-tokens') };
		const { data } = await axios.post(url, { type: 'gamesPlayed', record, spreadsheetId }, { headers });
		onLoadingChange(false);
		if (!data.error) {
			setRecordData(EMPTY_RECORD);
			onUpdate(data);
		}
	};

	const handleAddNewClick = async (type) => {
		if (addNewField === type) {
			onLoadingChange(true);
			const url = `${API_BASE}/addRecord`;
			const headers = { Authorization: localStorage.getItem('sheets-tokens') };
			type = type === 'winner' || type === 'loser' ? 'players' : type;
			const record = JSON.stringify({ name: addNewValue });
			const { data } = await axios.post(url, { type, record, spreadsheetId }, { headers });
			onLoadingChange(false);
			if (!data.error) {
				onUpdate(data);
				setRecordData({ ...recordData, [addNewField]: addNewValue });
				setAddNewField(null);
				setAddNewValue('');
			}
		} else {
			setAddNewField(type);
			setAddNewValue('');
		}
	};

	const handleAddNewCancel = () => {
		setAddNewField(null);
		setAddNewValue('');
	};

	return (
		<div>
			<h1>Add Game Record</h1>
			<div>
				<select value={location} onChange={(e) => setRecordData({ ...recordData, location: e.target.value })}>
					<option disabled value={null} selected={!location}>
						Select location
					</option>
					{locations.map((location) => (
						<option value={location.name}>{location.name}</option>
					))}
				</select>
				{addNewField === 'locations' && <input value={addNewValue} onChange={(e) => setAddNewValue(e.target.value)} />}
				<button onClick={() => handleAddNewClick('locations')}>
					{addNewField === 'locations' ? 'Submit' : 'Add new'}
				</button>
				{addNewField === 'locations' && <button onClick={handleAddNewCancel}>Cancel</button>}
			</div>
			<div>
				<select value={gameName} onChange={(e) => setRecordData({ ...recordData, gameName: e.target.value })}>
					<option disabled value={null} selected={!gameName}>
						Select game name
					</option>
					{gameNames.map((gameName) => (
						<option value={gameName.name}>{gameName.name}</option>
					))}
				</select>
				{addNewField === 'gameNames' && <input value={addNewValue} onChange={(e) => setAddNewValue(e.target.value)} />}
				<button onClick={() => handleAddNewClick('gameNames')}>
					{addNewField === 'gameNames' ? 'Submit' : 'Add new'}
				</button>
				{addNewField === 'gameNames' && <button onClick={handleAddNewCancel}>Cancel</button>}
			</div>
			<div>
				<select value={winner} onChange={(e) => setRecordData({ ...recordData, winner: e.target.value })}>
					<option disabled value={null} selected={!winner}>
						Select winner
					</option>
					{players.map((player) => (
						<option value={player.name}>{player.name}</option>
					))}
				</select>
				{addNewField === 'winner' && <input value={addNewValue} onChange={(e) => setAddNewValue(e.target.value)} />}
				<button onClick={() => handleAddNewClick('winner')}>{addNewField === 'winner' ? 'Submit' : 'Add new'}</button>
				{addNewField === 'winner' && <button onClick={handleAddNewCancel}>Cancel</button>}
			</div>
			<div>
				<select value={loser} onChange={(e) => setRecordData({ ...recordData, loser: e.target.value })}>
					<option disabled value={null} selected={!loser}>
						Select loser
					</option>
					{players.map((player) => (
						<option value={player.name}>{player.name}</option>
					))}
				</select>
				{addNewField === 'loser' && <input value={addNewValue} onChange={(e) => setAddNewValue(e.target.value)} />}
				<button onClick={() => handleAddNewClick('loser')}>{addNewField === 'loser' ? 'Submit' : 'Add new'}</button>
				{addNewField === 'loser' && <button onClick={handleAddNewCancel}>Cancel</button>}
			</div>
			<div>
				<button disabled={!isComplete} onClick={handleSubmitClick}>
					Submit
				</button>
			</div>
		</div>
	);
}

export default AddRecordPanel;
