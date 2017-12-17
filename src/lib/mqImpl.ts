/**
 * 
 * Simple Message Queue Implementation
 * 
 * Author: Jin-woo Shin
 * Date: 2017-12-09
 */
import { IMessageQueue, ISSEMessage } from "./interfaces";
import * as sse from "./sse";

export class MQImpl implements IMessageQueue {

	private queue: any = {};
	
	public get(channelId: string): ISSEMessage[] {
		const q = this.queue["channelId"];

		if (q) {
			return q;
		}
		else {
			return [];
		}
	}

	public put(channelId: string, msg: ISSEMessage) {
		const q: ISSEMessage[] = this.queue[channelId];
		if (!q) {
			this.queue[channelId] = [];
		}
		else {
			this.queue[channelId].push(msg);
		}
	}

	public clear(channelId: string) {
		this.queue[channelId] = [];
	}
}
