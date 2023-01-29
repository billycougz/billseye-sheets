import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function BasicTable({ headers, rows }) {
	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						{headers.map((header) => (
							<TableCell key={header} sx={{ fontWeight: 'bold' }}>
								{header}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={JSON.stringify(row)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
							{headers.map((header) => (
								<TableCell key={`${JSON.stringify(row)}${JSON.stringify(header)}`}>{row[header]}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default BasicTable;
