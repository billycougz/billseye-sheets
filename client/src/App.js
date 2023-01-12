import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
	const [title, setTitle] = useState('');

	useEffect(() => {
		const url = new URL(window.location.href);
		const token = url.searchParams.get('token');
		if (token) {
			localStorage.setItem('sheets-token', token);
			window.history.replaceState({}, document.title, '/');
		} else if (!localStorage.getItem('sheets-token')) {
			window.location.href =
				'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets&response_type=code&client_id=410398723822-o8k13cm1jf9eiduq8ce8fk890qfad23j.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A6969%2Foauthcallback';
		}
	}, []);

	const handleCreateClick = async () => {
		const response = await axios(
			`http://localhost:6969/create?token=${localStorage.getItem('sheets-token')}&title=${title}`
		);
	};

	return (
		<div className='App'>
			<input value={title} onChange={(e) => setTitle(e.target.value)} />
			<button onClick={handleCreateClick}>Create</button>
		</div>
	);
}

export default App;
