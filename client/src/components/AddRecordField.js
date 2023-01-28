import { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { addNewRecord } from '../api';
import Alert from './Alert';

function AddRecordField({
	name,
	displayName,
	tableName,
	value,
	options,
	spreadsheetId,
	onChange,
	onLoadingChange,
	onDataUpdate,
}) {
	const [showAddValue, setShowAddValue] = useState(false);
	const [newValue, setNewValue] = useState('');
	const [hasAlert, setHasAlert] = useState(false);

	const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

	const handleAddValueSubmit = async () => {
		onLoadingChange(true);
		const record = JSON.stringify({ name: newValue });
		const data = await addNewRecord({ type: tableName, record, spreadsheetId });
		onLoadingChange(false);
		if (!data.error) {
			onDataUpdate(data);
			onChange({ field: name, value: newValue });
			setShowAddValue(false);
			setNewValue('');
		} else {
			setHasAlert(true);
		}
	};

	return (
		<div>
			<FormControl variant='standard' fullWidth>
				<InputLabel>{displayName || capitalizedName}</InputLabel>
				<Select value={value} onChange={(e) => onChange({ field: name, value: e.target.value })}>
					{options.map((option) => (
						<MenuItem key={option.name} value={option.name}>
							{option.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{!showAddValue && <Button onClick={() => setShowAddValue(true)}>Add new value</Button>}

			{showAddValue && (
				<div className='addNewFieldContainer'>
					<TextField value={newValue} onChange={(e) => setNewValue(e.target.value)} />
					<Button onClick={handleAddValueSubmit} disabled={!newValue}>
						Submit
					</Button>
					<Button onClick={() => setShowAddValue(false)}>Cancel</Button>
				</div>
			)}

			<Alert open={hasAlert} onClose={() => setHasAlert(false)} />
		</div>
	);
}

export default AddRecordField;
