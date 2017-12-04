/**
 * In-memory connection pool implementation
 * 
 * Author: Jin-woo Shin
 * Date: 2017-11-22
 */
import * as sse from "./sse";
import { ISSEConnection } from "./sse";

export class ConnectionPoolImpl implements sse.IConnectionPool {

	private mConnections: any = {};

	public put(userId: string, connection: sse.ISSEConnection) {
		// this.mConnections.set(userId, connection);
		this.mConnections[userId] = connection;
		// console.log("added connection: ", this.mConnections[userId]);
		// console.log("connections added: " + (this.mConnections.get(userId) as ISSEConnection).id);
	}

	public get(userId: string) {
		// return this.mConnections.get(userId);
		// console.log("get: ", this.mConnections[userId]);
		return this.mConnections[userId];
	}

	public remove(userId: string) {
		// this.mConnections.set(userId, undefined);
		this.mConnections[userId] = undefined;
	}
}
