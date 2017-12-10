import * as express from "express";

import * as chanPool from "../lib/channelPoolImpl";
import * as connPool from "../lib/connPoolImpl";
import * as mq from "../lib/mqImpl";
import * as resHandler from "../lib/request-handler";
import * as sse from "../lib/sse";
import { broadcast } from "../lib/sse";

export const router = express.Router();

export const sseApp		= new sse.SSEAcceptor();
export const connections	= new connPool.ConnectionPoolImpl();
export const channels		= new chanPool.ChannelPoolImpl();
export const messages		= new mq.MQImpl();

router.get("/connect", sseApp.sse((req: express.Request, res: sse.ISSEConnection, next: express.NextFunction) => {
	const userId = req.query["userId"];
	req.on("close", () => {
		console.log("client disconnected");
	});
	res.id = userId;
	connections.put(userId, res);
	channels.putInto("default", res);
	// console.log("connected: ", res);
}))
.get("/channels", (req: express.Request, res: express.Response) => {
	// console.log("[app] channels: \n", channels.getIds());
	resHandler.response(
		res,
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_OK,
			"ok",
			"",
			{
				name: "channels",
				obj: channels.getIds(),
			},
		));
})
.post("/channel/create", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const channelId = req.body["channelId"];

	channels.put(channelId, []);
	resHandler.response(
		res,
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_OK,
			resHandler.ApiResponse.RESULT_OK));
})
.post("channel/delete", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const channelId = req.body["channelId"];

	channels.remove(channelId);
	resHandler.response(
		res, 
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_OK,
			resHandler.ApiResponse.RESULT_OK));
})
.post("/channel/join", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const userId			= req.body["userId"];
	const channelId			= req.body["channelId"];
	const userConnection	= connections.get(userId);
	const channel			= channels.get(channelId);
	if (!channel) {
		return resHandler.response(
			res,
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_NOT_FOUND,
			resHandler.ApiResponse.RESULT_FAIL,
			"not found(channel)"));
	}
	if (!userConnection) {
		return resHandler.response(
			res,
			new resHandler.ApiResponse(
				resHandler.ApiResponse.CODE_NOT_FOUND,
				resHandler.ApiResponse.RESULT_FAIL,
				"not found(user)"));
	}
	channels.putInto(channelId, userConnection);
	broadcast(channel, {
		from: "SYSTEM",
		to: channelId,
		msg: userId + " joined",
		dateSent: new Date(),
	});
	return resHandler.response(
		res,
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_OK,
			resHandler.ApiResponse.RESULT_OK));
})
.post("/channel/exit", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const userId	= req.body["userId"];
	const channelId	= req.body["channelId"];

	channels.removeUser(channelId, userId);
	
	resHandler.response(
		res,
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_OK,
			resHandler.ApiResponse.RESULT_OK));
})
.post("/send", (req: express.Request, res: express.Response) => {
	const from		= req.body["from"];
	const to		= req.body["to"];
	const msg		= req.body["msg"];
	const dateSent	= req.body["dateSent"];
	const channel	= channels.get(to);

	messages.put(to, msg);

	if (!channel) {
		console.log("[router] channel not found");
		return;
	}
	console.log("channel: ", channel);
	sse.broadcast(channel, {
		from,
		to,
		msg,
		dateSent,
	});
	resHandler.response(
		res,
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_OK,
			resHandler.ApiResponse.RESULT_OK));
})
.get("/channel/:p1/messages", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const channelId = req.params["p1"];
	const msgs = messages.get(channelId);

	resHandler.response(
		res,
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_OK,
			resHandler.ApiResponse.RESULT_OK,
			"",
			{
				name: "messages",
				obj: msgs,
			}));
});
