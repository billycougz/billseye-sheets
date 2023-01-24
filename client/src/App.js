import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import './App.css';
import AddRecordPanel from './components/AddRecordPanel';
import SheetSelectionPanel from './components/SheetSelectionPanel';
import GamesPlayedTable from './components/GamesPlayedTable';
import Leaderboard from './components/Leaderboard';
import Header from './components/Header';
import Loader from './components/Loader';
import { loginToGoogle } from './api';

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
	const [loggedIn, setLoggedIn] = useState(false);
	const [view, setView] = useState('selection');
	const [sheetsData, setSheetsData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const API_BASE = 'http://localhost:6969';

	useEffect(() => {
		const url = new URL(window.location.href);
		const tokens = url.searchParams.get('tokens');
		if (tokens) {
			setLoggedIn(true);
			localStorage.setItem('sheets-tokens', tokens);
			window.history.replaceState({}, document.title, '/');
		} else if (localStorage.getItem('sheets-tokens')) {
			setLoggedIn(true);
		}
	}, []);

	const handleUpdate = (updatedData) => {
		setSheetsData(updatedData);
		const newView = view === 'selection' ? 'history' : view;
		setView(newView);
	};

	return (
		<ThemeProvider theme={theme}>
			<Loader open={isLoading} />
			<Header onNavClick={setView} title={sheetsData?.title} view={view} loggedIn={loggedIn} />
			<Box className='main'>
				{view !== 'history' && view !== 'leaderboard' && (
					<>
						<h1>Billseye Dart Database</h1>
						<p>
							Now powered by your own{' '}
							<a href='https://docs.google.com/spreadsheets/u/0/' target='_blank' className='sheets'>
								Google Sheets
							</a>
							.
						</p>
					</>
				)}

				{!loggedIn && <button onClick={loginToGoogle}>Log in to Google Sheets</button>}
			</Box>
			{loggedIn && (
				<Box className='main'>
					{view === 'selection' && <SheetSelectionPanel onUpdate={handleUpdate} onLoadingChange={setIsLoading} />}
					{view !== 'selection' && (
						<Grid container spacing={2}>
							<Grid xs={4}>
								<Item>
									{view !== 'selection' && (
										<AddRecordPanel
											data={sheetsData}
											onUpdate={handleUpdate}
											onBack={() => setSheetsData(null)}
											onLoadingChange={setIsLoading}
										/>
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
			)}
		</ThemeProvider>
	);
}

export default App;
