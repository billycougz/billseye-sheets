function Leaderboard({ data }) {
	const { gamesPlayed = [] } = data;
	const rankedPlayerMap = gamesPlayed.reduce((map, game) => {
		map[game.winner] = map[game.winner] || { name: game.winner, wins: 0, losses: 0 };
		map[game.winner].wins++;
		map[game.winner].pct = map[game.winner].wins / (map[game.winner].wins + map[game.winner].losses);
		map[game.loser] = map[game.loser] || { name: game.loser, wins: 0, losses: 0 };
		map[game.loser].losses++;
		map[game.loser].pct = map[game.loser].wins / (map[game.loser].wins + map[game.loser].losses);
		return map;
	}, {});
	const rankedPlayers = Object.values(rankedPlayerMap).sort(function (a, b) {
		return b.pct - a.pct;
	});
	return (
		<div>
			<h1>Leaderboard</h1>
			<table style={{ margin: '1em auto' }}>
				<tr>
					<th>Player</th>
					<th>Wins</th>
					<th>Losses</th>
					<th>Pct</th>
				</tr>
				{rankedPlayers.map((player) => (
					<tr>
						<td>{player.name}</td>
						<td>{player.wins}</td>
						<td>{player.losses}</td>
						<td>{player.pct.toFixed(2)}</td>
					</tr>
				))}
			</table>
		</div>
	);
}

export default Leaderboard;
