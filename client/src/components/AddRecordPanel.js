import { Button } from '@mui/material';
import { useState } from 'react';
import { addNewRecord } from '../api';
import AddRecordField from './AddRecordField';
import Alert from './Alert';

function AddRecordPanel({ data, onUpdate, onLoadingChange }) {
	const { spreadsheetId } = data;
	const EMPTY_RECORD = { date: '', winner: '', loser: '', location: '', gameName: '' };
	const { locations = [], gameNames = [], players = [] } = data;
	const [recordData, setRecordData] = useState(EMPTY_RECORD);
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

	const COMMON_FIELD_PROPS = {
		spreadsheetId,
		onChange: ({ field, value }) => setRecordData({ ...recordData, [field]: value }),
		onLoadingChange,
		onDataUpdate: onUpdate,
	};

	return (
		<div>
			<AddRecordField
				name='location'
				tableName='locations'
				value={recordData.location}
				options={locations}
				{...COMMON_FIELD_PROPS}
			/>

			<AddRecordField
				name='gameName'
				displayName='Game Name'
				tableName='gameNames'
				value={recordData.gameName}
				options={gameNames}
				{...COMMON_FIELD_PROPS}
			/>

			<AddRecordField
				name='winner'
				tableName='players'
				value={recordData.winner}
				options={players}
				{...COMMON_FIELD_PROPS}
			/>

			<AddRecordField
				name='loser'
				tableName='players'
				value={recordData.loser}
				options={players}
				{...COMMON_FIELD_PROPS}
			/>

			<div>
				<Button variant='contained' disabled={!isComplete} onClick={handleSubmitClick}>
					Submit
				</Button>
			</div>

			<Alert open={hasAlert} onClose={() => setHasAlert(false)} />
		</div>
	);
}

export default AddRecordPanel;
