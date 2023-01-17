import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import AddRecordPanel from './AddRecordPanel';
import SheetSelectionPanel from './SheetSelectionPanel';
import GamesPlayedTable from './GamesPlayedTable';
import Leaderboard from './Leaderboard';

function App() {
	const [sheetsData, setSheetsData] = useState(null);
	const API_BASE = 'http://localhost:6969';

	useEffect(() => {
		const url = new URL(window.location.href);
		const tokens = url.searchParams.get('tokens');
		if (tokens) {
			localStorage.setItem('sheets-tokens', tokens);
			window.history.replaceState({}, document.title, '/');
		} else if (!localStorage.getItem('sheets-tokens')) {
			window.location.href =
				'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets&response_type=code&client_id=410398723822-o8k13cm1jf9eiduq8ce8fk890qfad23j.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A6969%2Foauthcallback';
		}
	}, []);

	const handleUpdate = (updatedData) => {
		setSheetsData(updatedData);
	};

	return (
		<div className='App'>
			{!sheetsData && <SheetSelectionPanel onUpdate={handleUpdate} />}
			{sheetsData && <AddRecordPanel data={sheetsData} onUpdate={handleUpdate} onBack={() => setSheetsData(null)} />}
			{sheetsData && <GamesPlayedTable data={sheetsData} />}
			{sheetsData && <Leaderboard data={sheetsData} />}
		</div>
	);
}

export default App;
