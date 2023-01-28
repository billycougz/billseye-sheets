import { useState } from 'react';
import { addNewRecord } from '../api';
import Alert from './Alert';

function AddRecordPanel({ data, onUpdate, onLoadingChange }) {
	const { spreadsheetId } = data;
	const EMPTY_RECORD = { date: '', winner: '', loser: '', location: '', gameName: '' };
	const { locations = [], gameNames = [], players = [] } = data;
	const [recordData, setRecordData] = useState(EMPTY_RECORD);
	const [addNewField, setAddNewField] = useState(null);
	const [addNewValue, setAddNewValue] = useState('');
	const [hasAlert, setHasAlert] = useState(false);
	const { location, gameName, winner, loser } = recordData;
	const isComplete = location && gameName && winner && loser;

	const handleSubmitClick = async () => {
		onLoadingChange(true);
		const record = JSON.stringify(recordData);
		const data = await addNewRecord({ type: 'gamesPlayed', record, spreadsheetId });
		onLoadingChange(false);
		if (!data.error) {
			setRecordData(EMPTY_RECORD);
			onUpdate(data);
		} else {
			setHasAlert(true);
		}
	};

	const handleAddNewClick = async (type) => {
		if (addNewField === type) {
			onLoadingChange(true);
			type = type === 'winner' || type === 'loser' ? 'players' : type;
			const record = JSON.stringify({ name: addNewValue });
			const data = await addNewRecord({ type, record, spreadsheetId });
			onLoadingChange(false);
			if (!data.error) {
				onUpdate(data);
				setRecordData({ ...recordData, [addNewField]: addNewValue });
				setAddNewField(null);
				setAddNewValue('');
			} else {
				setHasAlert(true);
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
			<Alert open={hasAlert} onClose={() => setHasAlert(false)} />
			<h1>Add Game Record</h1>
			<div>
				<select value={location} onChange={(e) => setRecordData({ ...recordData, location: e.target.value })}>
					<option disabled value=''>
						Select location
					</option>
					{locations.map((location) => (
						<option key={location.name} value={location.name}>
							{location.name}
						</option>
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
					<option disabled value=''>
						Select game name
					</option>
					{gameNames.map((gameName) => (
						<option key={gameName.name} value={gameName.name}>
							{gameName.name}
						</option>
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
					<option disabled value=''>
						Select winner
					</option>
					{players.map((player) => (
						<option key={player.name} value={player.name}>
							{player.name}
						</option>
					))}
				</select>
				{addNewField === 'winner' && <input value={addNewValue} onChange={(e) => setAddNewValue(e.target.value)} />}
				<button onClick={() => handleAddNewClick('winner')}>{addNewField === 'winner' ? 'Submit' : 'Add new'}</button>
				{addNewField === 'winner' && <button onClick={handleAddNewCancel}>Cancel</button>}
			</div>
			<div>
				<select value={loser} onChange={(e) => setRecordData({ ...recordData, loser: e.target.value })}>
					<option disabled value=''>
						Select loser
					</option>
					{players.map((player) => (
						<option key={player.name} value={player.name}>
							{player.name}
						</option>
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
