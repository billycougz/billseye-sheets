import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Alert({ open, onClose }) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
		>
			<MuiAlert elevation={6} variant='filled' onClose={onClose} severity='warning' sx={{ width: '100%' }}>
				There was an error with your request.
			</MuiAlert>
		</Snackbar>
	);
}

export default Alert;
