import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Header({ onNavClick, title, view }) {
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
			</Toolbar>
		</AppBar>
	);
}

export default Header;
