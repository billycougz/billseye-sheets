import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../logo.png';

function Header({ onNavClick, title, view, loggedIn }) {
	const handleLogout = () => {
		localStorage.removeItem('sheets-tokens');
		window.location.reload();
	};
	return (
		<AppBar position='static'>
			<Toolbar>
				{view !== 'selection' && (
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='menu'
						sx={{ mr: 2 }}
						onClick={() => onNavClick('selection')}
					>
						<ArrowBackIcon />
					</IconButton>
				)}
				<a id='logo-link' href={window.location.origin}>
					<img id='logo' alt='logo' src={logo} />
				</a>
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
					{`Billseye${view !== 'selection' ? ' • ' + title : ''}`}
				</Typography>
				{view !== 'selection' && (
					<>
						<Button color='inherit' onClick={() => onNavClick('history')}>
							Game History
						</Button>
						<Button color='inherit' onClick={() => onNavClick('leaderboard')}>
							Leaderboard
						</Button>
					</>
				)}
				{loggedIn && (
					<Button color='inherit' onClick={handleLogout}>
						Logout
					</Button>
				)}
			</Toolbar>
		</AppBar>
	);
}

export default Header;
