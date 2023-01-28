import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import logo from '../logo.png';
import sheetsLogo from '../sheets.png';

const views = ['Game History', 'Leaderboard'];
const sheetsOptions = ['Open Sheets', 'Logout'];

function Header({ onNavClick, loggedIn, sheet }) {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleNavClick = (selection) => {
		switch (selection) {
			case 'logo':
				onNavClick('selection');
				break;
			case 'Game History':
				onNavClick('history');
				break;
			case 'Leaderboard':
				onNavClick('leaderboard');
				break;
			case 'Open Sheets':
				const url = sheet
					? `https://docs.google.com/spreadsheets/d/${sheet.spreadsheetId}`
					: 'https://docs.google.com/spreadsheets/u/0/';
				window.open(url);
				break;
			case 'Logout':
				localStorage.removeItem('sheets-tokens');
				window.location.reload();
				break;
			default:
				break;
		}
		setAnchorElNav(null);
		setAnchorElUser(null);
	};

	return (
		<AppBar position='static'>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
						<img id='logo' src={logo} onClick={() => handleNavClick('logo')} />
					</Box>

					<Typography
						variant='h6'
						noWrap
						component='a'
						href='/'
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						BILLSEYE
					</Typography>

					<Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
						<img id='logo' src={logo} onClick={() => handleNavClick('logo')} />
					</Box>
					<Typography
						variant='h5'
						noWrap
						component='a'
						href=''
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						BILLSEYE
					</Typography>

					{loggedIn && (
						<>
							<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
								{sheet &&
									views.map((view) => (
										<Button
											key={view}
											onClick={() => handleNavClick(view)}
											sx={{ my: 2, color: 'white', display: 'block' }}
										>
											{view}
										</Button>
									))}
							</Box>
							<Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
								<IconButton
									size='large'
									aria-label='account of current user'
									aria-controls='menu-appbar'
									aria-haspopup='true'
									onClick={handleOpenNavMenu}
									color='inherit'
								>
									<MenuIcon />
								</IconButton>
								<Menu
									id='menu-appbar'
									anchorEl={anchorElNav}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'left',
									}}
									open={Boolean(anchorElNav)}
									onClose={handleNavClick}
									sx={{
										display: { xs: 'block', md: 'none' },
									}}
								>
									{sheet && (
										<>
											{views.map((view) => (
												<MenuItem key={view} onClick={() => handleNavClick(view)}>
													<Typography textAlign='center'>{view}</Typography>
												</MenuItem>
											))}
											<Divider />
										</>
									)}

									{sheetsOptions.map((option) => (
										<MenuItem key={option} onClick={() => handleNavClick(option)}>
											<Typography textAlign='center'>{option}</Typography>
										</MenuItem>
									))}
								</Menu>
							</Box>
							<Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
								<Tooltip title='Open settings'>
									<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
										<Avatar alt='Remy Sharp' src={sheetsLogo} />
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: '45px' }}
									id='menu-appbar'
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleNavClick}
								>
									{sheetsOptions.map((option) => (
										<MenuItem key={option} onClick={() => handleNavClick(option)}>
											<Typography textAlign='center'>{option}</Typography>
										</MenuItem>
									))}
								</Menu>
							</Box>
						</>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default Header;
