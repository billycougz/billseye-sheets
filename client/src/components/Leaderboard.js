import Table from './Table';

function Leaderboard({ data }) {
	const { gamesPlayed = [] } = data;
	const rankedPlayerMap = gamesPlayed.reduce((map, game) => {
		map[game.winner] = map[game.winner] || { Player: game.winner, Wins: 0, Losses: 0 };
		map[game.winner].Wins++;
		map[game.winner].Pct = map[game.winner].Wins / (map[game.winner].Wins + map[game.winner].Losses);
		map[game.loser] = map[game.loser] || { Player: game.loser, Wins: 0, Losses: 0 };
		map[game.loser].Losses++;
		map[game.loser].Pct = map[game.loser].Wins / (map[game.loser].Wins + map[game.loser].Losses);
		return map;
	}, {});
	const rankedPlayers = Object.values(rankedPlayerMap).sort(function (a, b) {
		return b.Pct - a.Pct;
	});
	const rows = rankedPlayers.map((player, index) => ({ ...player, Pct: player.Pct.toFixed(2), '#': index + 1 }));
	const headers = ['#', 'Player', 'Wins', 'Losses', 'Pct'];
	return (
		<div>
			<h1>Leaderboard</h1>
			<Table headers={headers} rows={rows} />
		</div>
	);
}

export default Leaderboard;
