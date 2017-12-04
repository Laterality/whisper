import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";

import { config } from "./config";
import * as chanPool from "./lib/channelPoolImpl";
import * as connPool from "./lib/connPoolImpl";
import * as resHandler from "./lib/request-handler";
import * as sse from "./lib/sse";
import { channels, router } from "./route/router";

const app = express();

app.use(bodyParser.json());

app.use(logger("dev"));

app.use(router);

// create default channel
channels.put("default", []);

// 404 Handler
app.use((req: express.Request, res: express.Response) => {
	res.sendStatus(404);
	res.end("<h1>Not Found</h1>");
});

app.listen(config.port, () => {
	console.log("[app] Listening on port " + config.port);
});
