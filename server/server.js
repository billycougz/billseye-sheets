const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { handler } = require('.');

const port = 6969;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(port, () => console.log(`App listening on port ${port}`));

app.all('*', async (req, res) => {
	const event = {
		headers: req.headers,
		body: req.body,
		path: req._parsedUrl.pathname,
		queryStringParameters: req.query,
	};
	const result = await handler(event);
	res.status(result.statusCode);
	res.set({ ...result.headers });
	res.send(result.body);
});
