/**
 * SSE Interfaces and Accpetor
 * 
 * Author: Jin-woo Shin
 * Date: 2017-11-22
 */
import * as express from "express";
import { ISSEConnection, ISSEMessage } from "./interfaces";
import * as user from "./user";

// export interface IChannel {
// 	id: string;
// 	users: ISSEConnection[];
// }

export class SSEAcceptor {

	// accept sse connection
	public sse(cb: (req: express.Request, res: ISSEConnection, next: express.NextFunction) => void) {
		
		return (req: express.Request, res: express.Response, next: express.NextFunction) => {
	
			console.log("[sse] connected");
			res.writeHead(200, {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				"Connection": "keep-alive",
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
