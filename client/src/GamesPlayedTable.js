function GamesPlayedTable({ data }) {
	const { gamesPlayed = [] } = data;
	return (
		<div>
			<h3>Game Log</h3>
			<table style={{ margin: '1em auto' }}>
				<tr>
					<th>Date</th>
					<th>Location</th>
					<th>Game Name</th>
					<th>Winner</th>
					<th>Loser</th>
				</tr>
				{gamesPlayed.map((game) => (
					<tr>
						<td>{game.dateAdded}</td>
						<td>{game.location}</td>
						<td>{game.gameName}</td>
						<td>{game.winner}</td>
						<td>{game.loser}</td>
					</tr>
				))}
			</table>
		</div>
	);
}

export default GamesPlayedTable;
