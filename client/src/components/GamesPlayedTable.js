import Table from './Table';

function GamesPlayedTable({ data }) {
	const { gamesPlayed = [] } = data;
	gamesPlayed.sort(function (a, b) {
		return new Date(b.dateAdded) - new Date(a.dateAdded);
	});

	const headers = ['#', 'Date', 'Winner', 'Loser'];
	const rows = gamesPlayed.map((game, index) => ({
		'#': index + 1,
		Date: game.dateAdded,
		// Location: game.location,
		// 'Game Name': game.gameName,
		Winner: game.winner,
		Loser: game.loser,
	}));

	return (
		<div>
			<h1>Game History</h1>
			<Table headers={headers} rows={rows} />
		</div>
	);
}

export default GamesPlayedTable;
