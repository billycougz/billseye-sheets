import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import AddRecordPanel from './AddRecordPanel';
import SheetSelectionPanel from './SheetSelectionPanel';
import GamesPlayedTable from './GamesPlayedTable';
import Leaderboard from './Leaderboard';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Header from './Header';

const theme = createTheme({
	palette: {
		primary: {
			light: '#757ce8',
			main: '#66ccff',
			dark: '#002884',
			contrastText: '#fff',
		},
		secondary: {
			light: '#ff7961',
			main: '#f44336',
			dark: '#ba000d',
			contrastText: '#000',
		},
	},
});

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

function App() {
	const [view, setView] = useState('selection');
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
		const newView = view === 'selection' ? 'history' : view;
		setView(newView);
	};

	return (
		<ThemeProvider theme={theme}>
			<Header onNavClick={setView} title={sheetsData?.title} view={view} />
			<Box className='main'>
				{view === 'selection' && <SheetSelectionPanel onUpdate={handleUpdate} />}
				{view !== 'selection' && (
					<Grid container spacing={2}>
						<Grid xs={4}>
							<Item>
								{view !== 'selection' && (
									<AddRecordPanel data={sheetsData} onUpdate={handleUpdate} onBack={() => setSheetsData(null)} />
								)}
							</Item>
						</Grid>
						<Grid xs={8}>
							<Item>
								{view === 'history' && <GamesPlayedTable data={sheetsData} />}
								{view === 'leaderboard' && <Leaderboard data={sheetsData} />}
							</Item>
						</Grid>
					</Grid>
				)}
			</Box>
		</ThemeProvider>
	);
}

export default App;
