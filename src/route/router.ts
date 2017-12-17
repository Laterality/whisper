import * as express from "express";

import { AbstractChannel } from "../lib/channel";
import * as chanPool from "../lib/channelPoolImpl";
import * as connPool from "../lib/connPoolImpl";
import { ISSEConnection } from "../lib/interfaces";
import * as mq from "../lib/mqImpl";
import * as resHandler from "../lib/request-handler";
import * as sse from "../lib/sse";
import { broadcast } from "../lib/sse";
import { AbstractUser } from "../lib/user";
import { UserPoolImpl } from "../lib/userPoolImpl";

export const router = express.Router();

export const sseApp			= new sse.SSEAcceptor();
export const connections	= new connPool.ConnectionPoolImpl();
export const channels		= new chanPool.ChannelPoolImpl();
export const users			= new UserPoolImpl();
export const messages		= new mq.MQImpl();

router.get("/connect", sseApp.sse((req: express.Request, res: ISSEConnection, next: express.NextFunction) => {
	// connection established
	const userId = req.query["userId"];
	req.on("close", () => {
		console.log("client disconnected");
		users.remove(userId);

		// TODO: remove disconnected user from channels user has

	});
	res.write("data: connected\n\n");
	res.id = userId;
	connections.put(userId, res);

	// construct user object and put into user pool
	const user = new AbstractUser(userId);
	user.setConnected(res);
	users.put(user);
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

	channels.put(new AbstractChannel(channelId));
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
	// const userConnection	= connections.get(userId);
	const channel			= channels.get(channelId);
	const user				= users.get(userId);

	console.log("joining channel " + channelId);

	if (!channel) {
		console.log("channel " + channelId + " doesn't exist");
		return resHandler.response(
			res,
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_NOT_FOUND,
			resHandler.ApiResponse.RESULT_FAIL,
			"not found(channel)"));
	}
	// if (!userConnection) {
	// 	console.log("user " + userId + " doesn't exist");
	// 	return resHandler.response(
	// 		res,
	// 		new resHandler.ApiResponse(
	// 			resHandler.ApiResponse.CODE_NOT_FOUND,
	// 			resHandler.ApiResponse.RESULT_FAIL,
	// 			"not found(user)"));
	// }
	// add user into channel
	if (channel && user) {
		channel.join(user);

		// notify channel has new user
		channel.broadcast({
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
	}
	else {
		// if user or channel not exists
		if (!user) {
			console.log("user " + userId + " doesn't exist");
		}
		if (!channel) {
			console.log("channel " + channelId + "doesn't exist");
		}
		return resHandler.response(
			res, 
			new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_NOT_FOUND,
			resHandler.ApiResponse.RESULT_FAIL,
			"not found(user|channel)"));
	}
})
.post("/channel/exit", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const userId	= req.body["userId"];
	const channelId	= req.body["channelId"];

	// TODO: temporarily unavailable
	
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
	channel.broadcast({
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
})
.get("/user/:p1/channels", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const userId			= req.params["p1"];
	const user				= users.get(userId);

	console.log ("retrieve " + userId + "'s channels");
	if (!user) {
		console.log("user not found");
		return resHandler.response(
			res,
			new resHandler.ApiResponse(
				resHandler.ApiResponse.CODE_NOT_FOUND,
				resHandler.ApiResponse.RESULT_FAIL,
				"not found(user)"));
	}

	const channelsBelong	= user.getChannels();
	const channelIds		= [];

	for (const c of channelsBelong) {
		channelIds.push(c.getId());
	}

	return resHandler.response(
		res,
		new resHandler.ApiResponse(
			resHandler.ApiResponse.CODE_OK,
			resHandler.ApiResponse.RESULT_OK,
			"",
			{
				name: "channels",
				obj: channelIds,
			}));

});
