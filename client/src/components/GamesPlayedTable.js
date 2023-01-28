function GamesPlayedTable({ data }) {
	const { gamesPlayed = [] } = data;
	gamesPlayed.sort(function (a, b) {
		return new Date(b.dateAdded) - new Date(a.dateAdded);
	});
	return (
		<div>
			<h1>Game History</h1>
			<table style={{ margin: '1em auto' }}>
				<thead>
					<tr>
						<th>Date Added</th>
						<th>Location</th>
						<th>Game Name</th>
						<th>Winner</th>
						<th>Loser</th>
					</tr>
				</thead>
				<tbody>
					{gamesPlayed.map((game) => (
						<tr key={game.dateAdded}>
							<td>{game.dateAdded}</td>
							<td>{game.location}</td>
							<td>{game.gameName}</td>
							<td>{game.winner}</td>
							<td>{game.loser}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default GamesPlayedTable;
