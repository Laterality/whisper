/**
 * SSE Interfaces and Accpetor
 * 
 * Author: Jin-woo Shin
 * Date: 2017-11-22
 */
import * as express from "express";

// export interface IChannel {
// 	id: string;
// 	users: ISSEConnection[];
// }

export interface ISSEMessage {
	from: string;
	to: string;
	msg: string;
	dateSent: Date;
}

export interface ISSEConnection extends express.Response{
	id: string;
	sendMsg: (data: ISSEMessage) => void;
}

export interface IChannelPool {
	put: (channelId: string, group: ISSEConnection[]) => void;
	get: (channelId: string) => ISSEConnection[] | undefined;
	getIds: () => string[];
	putInto: (channelId: string, user: ISSEConnection) => void;
	remove: (channelId: string) => void;
	removeUser: (channelId: string, userId: string) => void;
}

export interface IConnectionPool {
	put: (userId: string, conn: ISSEConnection) => void;
	get: (userId: string) => ISSEConnection | undefined;
	remove: (userId: string) => void;
}

export interface IMessageQueue {
	get: (channelId: string) => ISSEMessage[];
	put: (channelId: string, msg: ISSEMessage) => void;
	clear: (channelId: string) => void;
}

export class SSEAcceptor {

	// accept sse connection
	public sse(cb: (req: express.Request, res: ISSEConnection, next: express.NextFunction) => void) {
	
		return (req: express.Request, res: express.Response, next: express.NextFunction) => {
	
			console.log("[sse] connected");
			res.writeHead(200, {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				"Connection": "Keep-alive",
			});
		
			(res as any)["sendMsg"] = (data: ISSEMessage) => {
				res.write("data: " + JSON.stringify(data) + "\n\n");
			};
			
			cb(req, (res as ISSEConnection), next);
	
		};
	
	}
}

export function broadcast(cons: ISSEConnection[], data: ISSEMessage) {
	console.log("broadcast, users of channel: " + cons.length);
	// console.log(cons);
	for (const idx in cons) {
		console.log(idx);
		console.log("id: " + cons[idx].id);
		cons[idx].sendMsg(data);
	}
}
